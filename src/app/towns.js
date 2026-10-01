import { W } from "../core/tables.js";
import { townChunkImage } from "./localview.js";
import { wrapOffsets } from "./render.js";
import { townExtentKm, CHUNK_T, MAX_LEVEL, MIN_LEVEL, levelTileM, T_ } from "../gen/city.js";
const COUNTRY = new Set([T_.grass, T_.field, T_.tree, T_.water, T_.deep, T_.sand, T_.rock, T_.snow]);

// Streams towns onto the map as 256x256-tile chunks at a level of detail that matches the zoom:
// 32 m tiles when a city first appears, down to 2 m up close. Only chunks on screen are generated,
// so even the largest cities stay quick. Coarser chunks already loaded fill in while finer ones
// arrive, and each town's edge fades into the land around it.

const MIN_TILE_PX = 0.8, FEATHER = 0.14, MAX_TILES = 60e6, MAX_IN_FLIGHT = 3;

export function makeTownLayer(app, send, onReady) {
  const cache = new Map(), pending = new Set(), summaries = new Map();
  let queue = [], inflight = 0, epoch = 0, sel = null;
  const mPerW = () => 1000 * app.world.worldKm / W;
  // the coarsest level whose tiles are big enough on screen; the sub-2 m levels (street level)
  // only kick in once their tiles are a few pixels across, so they stay cheap
  const NONE = -99;
  const levelFor = v => {
    const p = v.k / mPerW();
    for (let L = MIN_LEVEL; L <= MAX_LEVEL; L++) if (levelTileM(L) * p >= (L < 0 ? 3 : MIN_TILE_PX)) return L;
    return NONE;
  };
  const active = v => !!app.world && levelFor(v) !== NONE;
  const tileW = () => 0.002 / (app.world.worldKm / W); // a 2 m tile in world units (sets the deepest zoom)
  const key = (sid, L, ci, cj) => `${sid}:${L}:${ci}:${cj}`;

  function update() {
    const v = app.view, L = levelFor(v);
    if (L === NONE) {
      queue = [];
      // not zoomed in far enough for towns yet, but land detail is showing: build the plans of the
      // big cities on screen now (one coarse chunk each), so zooming into them does not pause
      if (app.chunks.active(v) && inflight === 0) {
        for (const s of app.chunks.settlementsInView(v)) {
          if (s.tier < 3) continue;
          const k = key(s.id, MAX_LEVEL, 0, 0);
          if (cache.has(k) || pending.has(k)) continue;
          queue.push([s.id, MAX_LEVEL, 0, 0, 0]);
          if (queue.length >= 2) break;
        }
        pump();
      }
      return;
    }
    const spanM = CHUNK_T * levelTileM(L), mpw = mPerW(), want = [], seen = new Set();
    for (const s of app.chunks.settlementsInView(v)) {
      const extM = townExtentKm(s.pop) * 1000, nMax = Math.ceil(extM / spanM);
      for (const ox of wrapOffsets(v, app.cw)) {
        // the screen, in this town's local metres
        const u0 = ((0 - ox) / v.k - s.x) * mpw, u1 = ((app.cw - ox) / v.k - s.x) * mpw;
        const v0 = ((0 - v.oy) / v.k - s.y) * mpw, v1 = ((app.ch - v.oy) / v.k - s.y) * mpw;
        if (u1 < -extM || u0 > extM || v1 < -extM || v0 > extM) continue;
        const ci0 = Math.max(-nMax, Math.floor(u0 / spanM)), ci1 = Math.min(nMax - 1, Math.floor(u1 / spanM));
        const cj0 = Math.max(-nMax, Math.floor(v0 / spanM)), cj1 = Math.min(nMax - 1, Math.floor(v1 / spanM));
        const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
        for (let cj = cj0; cj <= cj1; cj++) for (let ci = ci0; ci <= ci1; ci++) {
          // skip chunks entirely outside the town's circle
          const nu = Math.max(ci * spanM, Math.min(0, (ci + 1) * spanM)), nv = Math.max(cj * spanM, Math.min(0, (cj + 1) * spanM));
          if (Math.hypot(nu, nv) > extM) continue;
          const k = key(s.id, L, ci, cj);
          if (seen.has(k)) continue; seen.add(k);
          const e = cache.get(k); if (e) { e.used = performance.now(); continue; }
          if (pending.has(k)) continue;
          want.push([s.id, L, ci, cj, ((ci + 0.5) * spanM - um) ** 2 + ((cj + 0.5) * spanM - vm) ** 2]);
        }
      }
    }
    want.sort((a, b) => a[4] - b[4]);
    queue = want;
    pump();
  }
  function pump() {
    while (inflight < MAX_IN_FLIGHT && queue.length) {
      const [sid, L, ci, cj] = queue.shift(), k = key(sid, L, ci, cj);
      if (cache.has(k) || pending.has(k)) continue;
      pending.add(k); inflight++;
      send({ id: `T${epoch}|${k}`, sid, level: L, ci, cj });
    }
  }
  function receive(id, c) {
    const [ep, k] = id.slice(1).split("|");
    if (+ep !== epoch) return;
    pending.delete(k); inflight = Math.max(0, inflight - 1);
    summaries.set(c.sid, c.summary);
    const img = townChunkImage(c), px = img.data, T = c.T, mpw = mPerW(), ext = c.extW * mpw;
    // fade out towards the edge of the town's area so it blends into the land
    const u0 = (c.x0 - c.cx) * mpw, v0 = (c.y0 - c.cy) * mpw;
    // open country around the town is left to the land layer (which has the same fields, woods and
    // water at this detail), so there is no disc of different-looking ground around each town
    for (let j = 0; j < T; j++) for (let i = 0; i < T; i++) {
      const k = j * T + i;
      const dk = c.district[k], t = c.tile[k];
      if ((dk === 0 && COUNTRY.has(t)) || ((dk === 0 || dk === 8) && t === T_.garden)) { px[k * 4 + 3] = 0; continue; }
      const d = Math.hypot(u0 + (i + 0.5) * c.tsz, v0 + (j + 0.5) * c.tsz) / ext;
      px[k * 4 + 3] = Math.round(Math.max(0, Math.min(1, (1 - d) / FEATHER)) * 255);
    }
    const cv = document.createElement("canvas"); cv.width = T; cv.height = T; cv.getContext("2d").putImageData(img, 0, 0);
    cache.set(k, { c, canvas: cv, used: performance.now() });
    if (cache.size * T * T > MAX_TILES) {
      for (const [ok] of [...cache.entries()].sort((a, b) => a[1].used - b[1].used)) {
        if (cache.size * T * T <= MAX_TILES) break;
        cache.delete(ok);
      }
    }
    pump(); onReady();
  }
  function failed(id) {
    const [ep, k] = id.slice(1).split("|"); if (+ep !== epoch) return;
    pending.delete(k); inflight = Math.max(0, inflight - 1); pump();
  }
  function reset() { cache.clear(); pending.clear(); summaries.clear(); queue = []; inflight = 0; epoch++; sel = null; }

  // chunks on screen at levels L..L+2, coarsest first, so finer detail draws over coarser fill-ins
  function onScreen(v, fn) {
    const L = levelFor(v); if (L === NONE) return;
    const list = [];
    for (const e of cache.values()) {
      const c = e.c; if (c.level < L || c.level > L + 2) continue;
      const x = c.x0 * v.k + v.ox, y = c.y0 * v.k + v.oy, size = c.T * c.tw * v.k;
      if (x + size < 0 || y + size < 0 || x > app.cw || y > app.ch) continue;
      list.push([e, x, y, size]);
    }
    list.sort((a, b) => b[0].c.level - a[0].c.level);
    for (const it of list) fn(...it);
  }
  function draw(ctx, dpr, v) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    onScreen(v, (e, x, y, size) => ctx.drawImage(e.canvas, x, y, size, size));
    ctx.imageSmoothingEnabled = true;
  }
  function drawOverlay(ctx, dpr, v) {
    const L = levelFor(v); if (L === NONE) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    if (levelTileM(L) <= 8) onScreen(v, e => {
      if (e.c.level !== L) return;
      for (const lb of e.c.labels) {
        const px = lb.x * v.k + v.ox, py = lb.y * v.k + v.oy;
        ctx.font = '600 12px "Alegreya Sans", system-ui, sans-serif'; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(250,245,232,.9)";
        ctx.strokeText(lb.name, px, py); ctx.fillStyle = "#1e140a"; ctx.fillText(lb.name, px, py);
      }
    });
    if (sel) {
      // the selected building's outline, as the oriented rectangle it is
      const { lot, cx, cy } = sel, mpw = mPerW(), ca = Math.cos(lot.ang), sa = Math.sin(lot.ang), hw = lot.w / 2, hd = lot.d / 2;
      ctx.beginPath();
      [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].forEach(([a, b], n) => {
        const u = lot.u + a * ca - b * sa, w = lot.v + a * sa + b * ca, px = (cx + u / mpw) * v.k + v.ox, py = (cy + w / mpw) * v.k + v.oy;
        if (n) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      });
      ctx.closePath(); ctx.strokeStyle = "#ffe9a8"; ctx.lineWidth = 2.5; ctx.stroke();
    }
  }
  // what is under a world point: the finest loaded chunk covering it
  function pick(wx, wy) {
    let best = null;
    for (const e of cache.values()) {
      const c = e.c, i = Math.floor((wx - c.x0) / c.tw), j = Math.floor((wy - c.y0) / c.tw);
      if (i < 0 || j < 0 || i >= c.T || j >= c.T) continue;
      if (Math.hypot(wx - c.cx, wy - c.cy) > c.extW * (1 - FEATHER)) continue; // faded edge: defer to the land
      if (!best || c.level < best.c.level) best = { c, i, j };
    }
    if (!best) return null;
    const { c, i, j } = best, k = j * c.T + i, li = c.lot[k];
    return { chunk: c, town: c.summary, tile: c.tile[k], district: c.district[k], lot: li >= 0 ? c.lots[li] : null };
  }
  function select(p) { sel = p && p.lot ? { lot: p.lot, cx: p.chunk.cx, cy: p.chunk.cy } : null; }
  function clearSelection() { sel = null; }
  // the town whose centre is nearest the middle of the screen, if any town is shown
  function nearest(v) {
    if (!active(v)) return null;
    let best = null, bd = Infinity;
    const seenT = new Set();
    onScreen(v, e => {
      const c = e.c; if (seenT.has(c.sid)) return; seenT.add(c.sid);
      const d = Math.hypot(c.cx * v.k + v.ox - app.cw / 2, c.cy * v.k + v.oy - app.ch / 2);
      if (d < bd) { bd = d; best = c.summary; }
    });
    return best;
  }
  // chunks at the current level on screen (the street layer draws buildings from their lots)
  function current(v, fn) { const L = levelFor(v); if (L === NONE) return; onScreen(v, (e, x, y, size) => { if (e.c.level === L) fn(e.c, x, y, size); }); }
  // chunks on screen at every drawn level, finest first
  function around(v, fn) { const list = []; onScreen(v, e => list.push(e.c)); list.sort((a, b) => a.level - b.level); for (const c of list) fn(c); }
  return { active, update, current, around, levelFor: v => levelFor(v), mPerW, receive, failed, reset, draw, drawOverlay, pick, select, clearSelection, nearest, tileW, busy: () => pending.size + queue.length };
}
