import { W, H } from "../core/tables.js";
import { CHUNK, TILE_KM, LAND_LEVELS, levelTileKm } from "../gen/region.js";
import { chunkImage } from "./localview.js";
import { wrapOffsets } from "./render.js";

// Streams region-level chunks onto the world map. Once tiles would be at least ~0.75 screen pixels,
// visible chunks are requested from the worker (nearest the centre first), cached, and drawn over
// the world map. Pan anywhere and more land loads; there is no province border to hit.

export const MIN_TILE_PX = 0.75;
const MAX_CACHED = 900, MAX_IN_FLIGHT = 4;

export function makeChunkLayer(app, send, onReady) {
  const cache = new Map(), pending = new Set();
  let queue = [], inflight = 0, epoch = 0;
  const tw = (L = 0) => levelTileKm(L) / (app.world.worldKm / W);   // tile size in world units
  const span = (L = 0) => tw(L) * CHUNK;                            // chunk size in world units
  const key = (cx, cy, L = 0) => L + ":" + cx + "," + cy;
  const active = v => !!app.world && v.k * tw() >= MIN_TILE_PX;
  // the finest land level whose tiles are still about a pixel across (finer levels add detail)
  const levelFor = v => { let L = 0; while (L < LAND_LEVELS - 1 && v.k * tw(L + 1) >= 0.9) L++; return L; };

  function range(v, pad = 0, L = 0) {
    const t = span(L);
    return [Math.floor(-v.ox / v.k / t) - pad, Math.floor(-v.oy / v.k / t) - pad,
      Math.floor((app.cw - v.ox) / v.k / t) + pad, Math.floor((app.ch - v.oy) / v.k / t) + pad];
  }
  // each horizontal copy of the world on screen, as a view of its own
  const copies = v => wrapOffsets(v, app.cw).map(ox => ({ k: v.k, ox, oy: v.oy }));
  function update() {
    const v = app.view;
    if (!active(v)) { queue = []; return; }
    const Lc = levelFor(v), want = [], seen = new Set();
    // the current level first (nearest the middle first), then level 0, which carries the places
    for (const L of Lc > 0 ? [Lc, 0] : [0]) {
      const t = span(L), maxC = Math.ceil(W / t) - 1, maxR = Math.ceil(H / t) - 1, part = [];
      for (const cv of copies(v)) {
        const [x0, y0, x1, y1] = range(cv, L ? 0 : 1, L);
        const cxm = (app.cw / 2 - cv.ox) / v.k / t, cym = (app.ch / 2 - v.oy) / v.k / t;
        for (let cy = Math.max(0, y0); cy <= Math.min(maxR, y1); cy++) for (let cx = Math.max(0, x0); cx <= Math.min(maxC, x1); cx++) {
          const k = key(cx, cy, L);
          if (seen.has(k)) continue; seen.add(k);
          if (cache.has(k)) { cache.get(k).used = performance.now(); continue; }
          if (!pending.has(k)) part.push([cx, cy, L, (cx + 0.5 - cxm) ** 2 + (cy + 0.5 - cym) ** 2]);
        }
      }
      part.sort((a, b) => a[3] - b[3]);
      want.push(...part);
    }
    queue = want;
    pump();
  }
  function pump() {
    while (inflight < MAX_IN_FLIGHT && queue.length) {
      const [cx, cy, L] = queue.shift(), k = key(cx, cy, L);
      if (cache.has(k) || pending.has(k)) continue;
      pending.add(k); inflight++;
      send({ id: `C${epoch}|${k}`, cx, cy, level: L });
    }
  }
  function receive(id, chunk) {
    const [ep, k] = id.slice(1).split("|");
    if (+ep !== epoch) return;
    pending.delete(k); inflight = Math.max(0, inflight - 1);
    const img = chunkImage(chunk), c = document.createElement("canvas");
    c.width = CHUNK; c.height = CHUNK; c.getContext("2d").putImageData(img, 0, 0);
    cache.set(k, { chunk, canvas: c, used: performance.now() });
    if (cache.size > MAX_CACHED) {
      const old = [...cache.entries()].sort((a, b) => a[1].used - b[1].used).slice(0, cache.size - MAX_CACHED);
      for (const [ok] of old) cache.delete(ok);
    }
    pump();
    onReady();
  }
  function failed(id) {
    const [ep, k] = id.slice(1).split("|");
    if (+ep !== epoch) return;
    pending.delete(k); inflight = Math.max(0, inflight - 1); pump();
  }
  function reset() { cache.clear(); pending.clear(); queue = []; inflight = 0; epoch++; }

  function visible(v, fn, L = 0) {
    const [x0, y0, x1, y1] = range(v, 0, L);
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) { const e = cache.get(key(cx, cy, L)); if (e) fn(e, cx, cy); }
  }
  function draw(ctx, dpr, v) {
    if (!active(v)) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // coarse levels first, finer ones over them as they arrive
    for (let L = 0; L <= levelFor(v); L++) {
    const t = span(L) * v.k;
    visible(v, (e, cx, cy) => {
      // snap to whole device pixels so neighbouring chunks meet without hairline gaps
      const x0 = Math.floor((cx * t + v.ox) * dpr) / dpr, y0 = Math.floor((cy * t + v.oy) * dpr) / dpr;
      const x1 = Math.ceil(((cx + 1) * t + v.ox) * dpr) / dpr, y1 = Math.ceil(((cy + 1) * t + v.oy) * dpr) / dpr;
      ctx.drawImage(e.canvas, x0, y0, x1 - x0, y1 - y0);
    }, L);
    }
    ctx.imageSmoothingEnabled = true;
  }
  function drawOverlay(ctx, dpr, v) {
    if (!active(v)) return;
    const zt = v.k * tw(); // screen px per tile
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    const text = (str, x, y, font) => { ctx.font = font; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(250,245,232,.88)"; ctx.strokeText(str, x, y); ctx.fillStyle = "#23180e"; ctx.fillText(str, x, y); };
    visible(v, e => {
      for (const s of e.chunk.settlements) {
        if (!(s.tier >= 2 || (s.tier === 1 && zt > 1.6) || zt > 3)) continue;
        const px = s.x * v.k + v.ox, py = s.y * v.k + v.oy, rpx = s.rKm / TILE_KM * zt;
        if (rpx < 4) { const hs = 2 + s.tier * 0.6; ctx.fillStyle = s.capital ? "#7a1d12" : "#2a1d12"; ctx.fillRect(px - hs, py - hs, hs * 2, hs * 2); }
        text(s.name, px, py - Math.max(10, rpx + 8), `${s.tier >= 2 ? 600 : 500} ${[10, 11, 13, 15, 18][s.tier]}px "Alegreya Sans", system-ui, sans-serif`);
      }
      if (zt > 0.9) for (const st of e.chunk.stops || []) {
        const px = st.x * v.k + v.ox, py = st.y * v.k + v.oy;
        ctx.fillStyle = st.kind === "border" ? "#8e1b12" : "#3a2a18"; ctx.beginPath(); ctx.arc(px, py, st.kind === "border" ? 4 : 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,248,232,.9)"; ctx.lineWidth = 1.2; ctx.stroke();
        if (zt > 2.2 && (!app.dc || app.dc.take(px - 50, py + 4, px + 50, py + 18))) text(st.kind === "border" ? `Border post · ${app.world.S.states[st.realm].short}` : st.name, px, py + 11, '500 10.5px "Alegreya Sans", system-ui, sans-serif');
      }
      for (const st of e.chunk.sites) {
        const px = st.x * v.k + v.ox, py = st.y * v.k + v.oy;
        if (zt > 1.5) text(st.kind === "volcano" ? st.name : st.type, px, py + 17, '600 11px "Alegreya Sans", system-ui, sans-serif');
      }
    });
  }
  // what is under a world point, if its chunk is loaded
  function tileAt(wx, wy) {
    for (let L = levelFor(app.view); L >= 0; L--) {
      const t = tw(L), I = Math.floor(wx / t), J = Math.floor(wy / t), cx = Math.floor(I / CHUNK), cy = Math.floor(J / CHUNK);
      const e = cache.get(key(cx, cy, L)); if (!e) continue;
      const k = (J - cy * CHUNK) * CHUNK + (I - cx * CHUNK), c = e.chunk;
      return { g: c.ground[k], biome: c.biome[k], elev: c.elev[k], owner: c.owner[k] };
    }
    return null;
  }
  function settlementNear(mx, my, v) {
    let best = null, bd = Infinity;
    for (const cv of copies(v)) visible(cv, e => {
      for (const s of e.chunk.settlements) {
        const d = Math.hypot(s.x * v.k + cv.ox - mx, s.y * v.k + v.oy - my), reach = Math.max(10, s.rKm / TILE_KM * v.k * tw() + 4);
        if (d < reach && d < bd) { bd = d; best = s; }
      }
    });
    return best;
  }
  function stopNear(mx, my, v) {
    let best = null, bd = 10;
    for (const cv of copies(v)) visible(cv, e => { for (const st of e.chunk.stops || []) { const d = Math.hypot(st.x * v.k + cv.ox - mx, st.y * v.k + v.oy - my); if (d < bd) { bd = d; best = st; } } });
    return best;
  }
  // settlements in loaded chunks on (or just around) the screen
  function settlementsInView(v) {
    const out = [], seen = new Set();
    for (const cv of copies(v)) {
      const [x0, y0, x1, y1] = range(cv, 1);
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
        const k = key(cx, cy), e = cache.get(k); if (!e || seen.has(k)) continue;
        seen.add(k); out.push(...e.chunk.settlements);
      }
    }
    return out;
  }
  return { stopNear, levelFor, active, update, receive, failed, reset, draw, drawOverlay, tileAt, settlementNear, settlementsInView, tw, stats: () => ({ cached: cache.size, pending: pending.size, queued: queue.length }) };
}
