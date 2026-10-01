import { W, H, BIOMES, B, SPECIAL, HOSTILE_COL, hexRgb } from "../core/tables.js";
import { clamp } from "../core/util.js";
import { GOODS } from "../content/goods.js";
import { localContext } from "../gen/local.js";
import { armsOf, drawArms } from "./heraldry.js";
import { localMinutes } from "./time.js";
import { siteLevel } from "./journal.js";

// Shared app state for the main thread.
export const app = {
  world: null, canvas: null, ctx: null, cw: 0, ch: 0, dpr: 1,
  view: { k: 1, ox: 0, oy: 0 }, fitK: 1,
  ui: { mode: "terrain", layers: { animals: true, rivers: true, provinces: true, settlements: true, labels: true, wildlife: true, titans: true, mysteries: true, military: true, traffic: true, night: true }, sel: null },
  wc: null,   // world cache: whole map pre-rendered for zoomed-out viewing
  vc: null,   // view cache: crisp vector render of the current viewport when zoomed in
  perf: {},
};

/* ---------- colour ---------- */
const mixRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const packRgb = c => ((clamp(c[0], 0, 255) & 0xFC) << 16) | ((clamp(c[1], 0, 255) & 0xFC) << 8) | (clamp(c[2], 0, 255) & 0xFC);
const BRGB = BIOMES.map(b => hexRgb(b.c)), SRGB = SPECIAL.map(s => s ? hexRgb(s.c) : null);
export const HYPSO = [[0, "#4d7f4f"], [0.12, "#86a861"], [0.28, "#d3cb87"], [0.45, "#bf935d"], [0.62, "#8e6b52"], [0.8, "#b9aea4"], [1, "#ffffff"]].map(([t, c]) => [t, hexRgb(c)]);
const ramp = (stops, t) => { for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) return mixRgb(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return stops[stops.length - 1][1]; };
export const MODE_BG = { ecology: "#6d8e9f", terrain: "#1c3a50", political: "#6d8e9f", culture: "#6d8e9f", faith: "#6d8e9f", trade: "#5d7f93", conflict: "#6d8e9f", biome: "#7c9cab", height: "#14304a" };
const RIVER_COL = { ecology: "#5a8fb4", terrain: "#3d78a3", political: "#5a8fb4", culture: "#5a8fb4", faith: "#5a8fb4", trade: "#6a9cbf", conflict: "#5a8fb4", biome: "#4f86ad", height: "#4a86b4" };
export const MARINE_RGB = { shelf: [120, 176, 196], reef: [96, 200, 196], kelp: [96, 150, 130], lagoon: [130, 196, 170], estuary: [140, 160, 140], open: [70, 120, 170], abyss: [40, 70, 120], polar: [190, 214, 226] };
// modes that paint land by a region colour (realm, culture, faith...) share the political look
const FLAT = new Set(["political", "culture", "faith", "conflict", "trade", "ecology"]);
export const UNCLAIMED = "#d4cfc2";

export function computeColors() {
  const G = app.world, { M, T, C, R, S, F, Y, Z } = G, N = M.N, mode = app.ui.mode, cols = new Int32Array(N);
  const flat = FLAT.has(mode), occ = new Int32Array(N).fill(-1);
  // what colour a province gets in the flat modes
  const regionRgb = p => {
    if (mode === "political") { const st = S.own[p]; return st >= 0 ? S.states[st].rgb : null; }
    if (mode === "culture") return Y.cultures[Y.cultureOf[p]].rgb;
    if (mode === "faith") return Y.faiths[Y.faithOf[p]].rgb;
    if (mode === "trade") return [206, 196, 170];
    // ecology: each zone in its biome's colour, a little lighter or darker than its neighbours
    if (mode === "ecology") { const z = G.E.zoneOf[p], c = BRGB[G.E.zones[z].biome], f = 0.88 + ((z * 2654435761) >>> 0) % 100 / 100 * 0.24; return [c[0] * f, c[1] * f, c[2] * f]; }
    // conflict: realms at war keep their colour, everyone else fades to grey
    const st = S.own[p]; if (st < 0) return null;
    const c = S.states[st].rgb, g = (c[0] + c[1] + c[2]) / 3;
    return atWar.has(st) ? c : [g * 0.35 + 190 * 0.65, g * 0.35 + 186 * 0.65, g * 0.35 + 176 * 0.65];
  };
  const atWar = new Set(); if (Z) for (const w of Z.wars) for (const a of [...w.attackers, ...w.defenders]) { const ac = Z.actors[a]; atWar.add(ac.rebel ? ac.of : a); }
  const shallow = hexRgb("#8fbccd"), deep = hexRgb("#234c68"), lakeT = hexRgb("#79aecb");
  const pOcean = [hexRgb("#b8d2dd"), hexRgb("#8fb3c5")], unclaimed = hexRgb(UNCLAIMED);
  const hOcean = [hexRgb("#b9d9e6"), hexRgb("#16344f")];
  const specialOn = app.ui.layers.mysteries;
  for (let i = 0; i < N; i++) {
    const ty = T.type[i]; let c;
    if (ty === 1 && mode === "ecology" && G.E && G.E.marine) {
      const z = G.E.marine.zones[G.E.marine.zoneOfCell[i]];
      c = z ? MARINE_RGB[z.key].map(v => v * (0.94 + ((z.id * 2654435761) >>> 0) % 100 / 100 * 0.12)) : [150, 180, 200];
      if (z && z.monster) occ[i] = packRgb([150, 40, 40]);
    } else if (ty === 1) {
      const t = Math.max(Math.pow(clamp(T.coastDist[i] * M.s / 180, 0, 1), 0.7), T.depth[i] * 0.8);
      if (mode === "terrain") c = mixRgb(shallow, deep, t);
      else if (flat) c = mixRgb(pOcean[0], pOcean[1], t);
      else if (mode === "biome") c = [168, 198, 211];
      else c = mixRgb(hOcean[0], hOcean[1], Math.pow(T.depth[i], 0.8));
    } else if (ty === 2) {
      c = mode === "terrain" ? lakeT : flat ? [156, 194, 212] : mode === "biome" ? [143, 188, 208] : [106, 160, 191];
    } else {
      const sp = specialOn ? F.cSpecial[i] : 0;
      const base = sp ? SRGB[sp] : BRGB[C.biome[i]], sh = T.shade[i];
      if (mode === "terrain") {
        let b = base;
        const ee = T.e[i];
        if (ee > 0.45 && C.biome[i] !== B.peaks && !sp) b = mixRgb(b, [139, 127, 110], clamp((ee - 0.45) * 1.6, 0, 0.6));
        c = [b[0] * sh, b[1] * sh, b[2] * sh];
      } else if (flat) {
        const p = R.owner[i], sc = regionRgb(p) || unclaimed, f = 1 + (sh - 1) * (mode === "trade" ? 0.8 : 0.45);
        c = mixRgb(sc, base, mode === "trade" ? 0.3 : 0.14); c = [c[0] * f, c[1] * f, c[2] * f];
        // occupied land is striped in the occupier's colour
        if (mode === "conflict" && Z && Z.control[p] !== S.own[p] && Z.control[p] >= 0) occ[i] = packRgb(Z.actors[Z.control[p]].rgb.map(v => v * 0.8));
      } else if (mode === "biome") c = base;
      else { const f = 1 + (sh - 1) * 0.7; c = ramp(HYPSO, T.e[i]); c = [c[0] * f, c[1] * f, c[2] * f]; }
    }
    cols[i] = packRgb(c);
  }
  G.cols = cols; G.occ = occ;
}

// where to write culture and faith names: the region's province nearest its middle
export function computeRegionLabels() {
  const G = app.world, { R, M, Y } = G, kmPx = 1;
  const make = (list, of) => list.map((r, id) => {
    let sx = 0, sy = 0, n = 0, area = 0, ref = null;
    for (const p of R.provs) if (of[p.id] === id) { if (!ref) ref = p; let dx = p.cx - ref.cx; if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W; sx += ref.cx + dx; sy += p.cy; n++; area += p.size; }
    if (!n) return null;
    const cx = sx / n, cy = sy / n; let best = null, bd = Infinity;
    for (const p of R.provs) if (of[p.id] === id) { const d = (p.cx - cx) ** 2 + (p.cy - cy) ** 2; if (d < bd) { bd = d; best = p; } }
    const A = area * M.cellArea * kmPx, name = r.adj || r.name;
    return { name, x: M.x[best.heart], y: M.y[best.heart], fs: clamp(Math.min(Math.sqrt(A) * 0.12, 1.8 * Math.sqrt(A) / Math.max(4, name.length)), 4, 34) };
  }).filter(Boolean);
  G.regionLabels = { ecology: G.E ? G.E.zones.map(z => ({ name: z.name, x: M.x[z.label], y: M.y[z.label], fs: clamp(Math.sqrt(z.area) / (G.worldKm / W) * 0.1, 4, 16) }))
      .concat(G.E.marine ? G.E.marine.zones.filter(z => z.cells > 40).map(z => ({ name: z.monster ? `${z.name} (${z.monster.n})` : z.name, x: M.x[z.label], y: M.y[z.label], fs: clamp(Math.sqrt(z.area) / (G.worldKm / W) * 0.08, 5, 14), sea: true })) : []) : [], culture: make(Y.cultures.map(c => ({ adj: c.adj })), Y.cultureOf), faith: make(Y.faiths, Y.faithOf) };
  G.tradeLabels = G.Q.named.map(n => {
    const mid = G.Q.routes.find(r => r.id === n.links[Math.floor(n.links.length / 2)]); if (!mid) return null;
    const p = mid.pts, i = Math.floor(p.length / 4) * 2;
    return { name: n.name, x: p[i], y: p[i + 1], fs: 7 };
  }).filter(Boolean);
}

export function computeEdges() {
  const G = app.world, { M, T, R, S, F } = G, coast = [], prov = [], state = [], host = [], tit = [], zone = [], pzone = [], wall = [], forb = [];
  // the premise layer: marked zones, the great wall and the forbidden land
  const L = G.L, pz = L ? L.provZone : null, fb = G.W && G.W.forbidden;
  const inWall = new Uint8Array(R.provs.length); if (L && L.wall) for (const p of L.wall.provs) inWall[p] = 1;
  G.forbLabel = null;
  if (fb) { let x = 0, y = 0, n = 0; for (const p of R.provs) if (fb[p.id]) { x += p.cx; y += p.cy; n++; } if (n) G.forbLabel = { x: x / n, y: y / n }; }
  for (let e = 0; e < M.E; e++) {
    const a = M.eA[e], b = M.eB[e], la = T.type[a] === 0, lb = T.type[b] === 0;
    if (la !== lb) coast.push(e);
    else if (la) {
      if (S.cellState[a] !== S.cellState[b]) state.push(e);
      else if (R.owner[a] !== R.owner[b]) prov.push(e);
    }
    if (la && lb && G.E && G.E.zoneOf[R.owner[a]] !== G.E.zoneOf[R.owner[b]]) zone.push(e);
    if (F.cHost[a] !== F.cHost[b]) host.push(e);
    if (F.cTitan[a] !== F.cTitan[b]) tit.push(e);
    if (la && lb) {
      const pa = R.owner[a], pb = R.owner[b];
      if (pz && pz[pa] !== pz[pb]) pzone.push(e);
      if (inWall[pa] !== inWall[pb]) wall.push(e);
      if (fb && fb[pa] !== fb[pb]) forb.push(e);
    }
  }
  // cells the coastline can wander through: every coastal cell and its neighbours
  const ring = new Uint8Array(M.N);
  for (let i = 0; i < M.N; i++) {
    const li = T.type[i] === 0;
    for (let q = M.nStart[i]; q < M.nStart[i + 1]; q++) if ((T.type[M.nbr[q]] === 0) !== li) { ring[i] = 1; for (let q2 = M.nStart[i]; q2 < M.nStart[i + 1]; q2++) ring[M.nbr[q2]] = 1; break; }
  }
  G.coastRing = ring;
  G.edges = { zone: Int32Array.from(zone), coast: Int32Array.from(coast), prov: Int32Array.from(prov), state: Int32Array.from(state), host: Int32Array.from(host), tit: Int32Array.from(tit), pzone: Int32Array.from(pzone), wall: Int32Array.from(wall), forb: Int32Array.from(forb) };
}

/* ---------- horizontal wrap ---------- */
// The map wraps east-west like a globe. These are the screen x positions of each copy of the
// world that touches a view of width cwid.
export function wrapOffsets(v, cwid) {
  const Wk = W * v.k, out = [];
  for (let x = v.ox - Math.ceil(v.ox / Wk) * Wk; x < cwid; x += Wk) out.push(x);
  return out;
}

/* ---------- base layer ---------- */
// Cells are rasterised straight into an ImageData buffer with a convex-polygon scanline fill:
// every pixel belongs to exactly one cell, so there are no seams and no per-polygon canvas calls.
// Region hatching is applied per pixel in device space, so it keeps a constant on-screen density.
const HATCH = [null, ...[1, 2, 3].map(t => ({ rgb: hexRgb(HOSTILE_COL[t]), a: 0.75, sp: 7, w: t === 3 ? 1.8 : 1.3 }))];
const TITAN_HATCH = { rgb: hexRgb("#6b2f86"), a: 0.6, sp: 9, w: 1.2 };
const MIST = [214, 220, 228], zoneHatch = new Map();
const zHatch = color => { let h = zoneHatch.get(color); if (!h) zoneHatch.set(color, h = { rgb: hexRgb(color), a: 0.55, sp: 6, w: 1.2 }); return h; };
const bgRgb = h => { const c = hexRgb(h); return (0xFF000000 | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0; };

function rasterCells(g, pr, v, cwid, chei, hs, offs) {
  const G = app.world, ui = app.ui, { M, F } = G, { k, oy } = v, X = M.x, Y = M.y, ps = M.polyStart, pxy = M.polyXY;
  const w = Math.round(cwid * pr), h = Math.round(chei * pr);
  // reuse the pixel buffer between renders of the same size
  let img = g.canvas.__img;
  if (!img || img.width !== w || img.height !== h) img = g.canvas.__img = g.createImageData(w, h);
  const buf = new Uint32Array(img.data.buffer);
  buf.fill(bgRgb(MODE_BG[ui.mode]));
  const cols = G.cols, sk = k * pr, soy = oy * pr;
  const hostOn = ui.layers.wildlife, titanOn = ui.layers.titans, mystOn = ui.layers.mysteries;
  const pz = G.L ? G.L.provZone : null, zones = G.L ? G.L.zones : null, fb = G.W && G.W.forbidden, own = G.R.owner;
  const vx = new Float64Array(64), vy = new Float64Array(64);
  // Zoomed in, cells near the coast are drawn per pixel (in small blocks) from the same coastline
  // function the detailed levels use, so the shore does not jump when land detail streams in.
  const fine = fineCoast(sk), ring = G.coastRing, T = G.T, nS = M.nStart, nb = M.nbr;
  const L = fine ? localContext(G) : null, probe = {}, kmPx = G.worldKm / W;
  const bs = Math.max(1, Math.round(pr)), bw = Math.ceil(w / bs) + 1, res = bs / sk * kmPx;
  // two grids: coarse blocks (4x the fine block) decide open water and solid land cheaply; only
  // where neighbouring coarse blocks disagree (right at the shore) is the fine grid evaluated
  const CB = bs * 4, cw2 = Math.ceil(w / CB) + 2;
  let blk = null, mask = null, cblk = null;
  const reuse = (key, n) => g.canvas[key] && g.canvas[key].length === n ? g.canvas[key].fill(0) : (g.canvas[key] = new Uint8Array(n));
  if (fine) {
    blk = reuse("__blk", bw * (Math.ceil(h / bs) + 1));
    mask = reuse("__mask", w * h);
    cblk = reuse("__cblk", cw2 * (Math.ceil(h / CB) + 2));
  }
  let curSox = 0;
  const coarse = (cx, cy) => {
    const ci = (cy + 1) * cw2 + cx + 1; let v = cblk[ci];
    if (!v) { let wx = ((cx + 0.5) * CB - curSox) / sk; wx = ((wx % W) + W) % W; v = cblk[ci] = L.landAt(wx, ((cy + 0.5) * CB - soy) / sk, probe, res * 4) > 0.5 ? 1 : 2; }
    return v;
  };
  const pack32 = c => (0xFF000000 | ((c & 0xFF) << 16) | (c & 0xFF00) | ((c >> 16) & 0xFF)) >>> 0;
  // the colour of the nearest neighbour cell that is (or is not) land, for pixels that cross the coast
  const nearestOf = (i, wx, wy, wantLand) => {
    let best = -1, bd = Infinity;
    for (let q = nS[i]; q < nS[i + 1]; q++) { const n = nb[q]; if ((T.type[n] === 0) !== wantLand) continue; const d = (X[n] - wx) ** 2 + (Y[n] - wy) ** 2; if (d < bd) { bd = d; best = n; } }
    return best;
  };
  for (const ox of offs) {
  const sox = ox * pr; curSox = sox;
  if (fine && offs.length > 1) { cblk.fill(0); blk.fill(0); }
  const pad = M.s * 2, vx0 = -ox / k - pad, vy0 = -oy / k - pad, vx1 = (cwid - ox) / k + pad, vy1 = (chei - oy) / k + pad;
  for (let i = 0; i < M.N; i++) {
    if (X[i] < vx0 || X[i] > vx1 || Y[i] < vy0 || Y[i] > vy1) continue;
    const a = ps[i], nv = ps[i + 1] - a; if (nv < 3) continue;
    let ymin = Infinity, ymax = -Infinity;
    for (let j = 0; j < nv; j++) {
      const px = pxy[2 * (a + j)] * sk + sox, py = pxy[2 * (a + j) + 1] * sk + soy;
      vx[j] = px; vy[j] = py; if (py < ymin) ymin = py; if (py > ymax) ymax = py;
    }
    const r0 = Math.max(0, Math.ceil(ymin - 0.5)), r1 = Math.min(h - 1, Math.ceil(ymax - 0.5) - 1);
    if (r0 > r1) continue;
    const c = cols[i];
    let base = (0xFF000000 | ((c & 0xFF) << 16) | (c & 0xFF00) | ((c >> 16) & 0xFF)) >>> 0;
    const ht = G.occ && G.occ[i] >= 0 ? occHatch(G.occ[i]) : hostOn ? HATCH[F.cHost[i]] : null, tt = titanOn && F.cTitan[i] >= 0 ? TITAN_HATCH : null;
    const zt = mystOn && pz && G.T.type[i] === 0 && pz[own[i]] >= 0 ? zHatch(zones[pz[own[i]]].color) : null;
    if (fb && G.T.type[i] === 0 && fb[own[i]]) base = blend(base, MIST, 0.5);
    for (let r = r0; r <= r1; r++) {
      const yc = r + 0.5; let xl = Infinity, xr = -Infinity;
      for (let j = 0, q = nv - 1; j < nv; q = j++) {
        const y1 = vy[q], y2 = vy[j];
        if ((y1 <= yc && yc < y2) || (y2 <= yc && yc < y1)) {
          const xx = vx[q] + (yc - y1) * (vx[j] - vx[q]) / (y2 - y1);
          if (xx < xl) xl = xx; if (xx > xr) xr = xx;
        }
      }
      const c0 = Math.max(0, Math.ceil(xl - 0.5)), c1 = Math.min(w - 1, Math.ceil(xr - 0.5) - 1);
      if (c0 > c1) continue;
      const row = r * w;
      if (fine && ring[i]) {
        const cellLand = T.type[i] === 0, by = (r / bs) | 0, wy = ((by + 0.5) * bs - soy) / sk;
        for (let cx = c0; cx <= c1; cx++) {
          const bx = (cx / bs) | 0, bi = by * bw + bx;
          if (!blk[bi]) {
            const ccx = (cx / CB) | 0, ccy = (r / CB) | 0, v0 = coarse(ccx, ccy);
            if (v0 === coarse(ccx - 1, ccy) && v0 === coarse(ccx + 1, ccy) && v0 === coarse(ccx, ccy - 1) && v0 === coarse(ccx, ccy + 1)) blk[bi] = v0;
            else { let wx = ((bx + 0.5) * bs - sox) / sk; wx = ((wx % W) + W) % W; blk[bi] = L.landAt(wx, wy, probe, res) > 0.5 ? 1 : 2; }
          }
          const isLand = blk[bi] === 1;
          let col = base;
          if (isLand !== cellLand) {
            const wx = ((cx + 0.5 - sox) / sk % W + W) % W, n = nearestOf(i, wx, (r + 0.5 - soy) / sk, isLand);
            if (n >= 0) col = pack32(cols[n]);
          } else if (isLand) {
            if (ht) { const sp = ht.sp * hs, m = (cx + r) % sp; if (m < ht.w * hs) col = blend(col, ht.rgb, ht.a); }
          }
          buf[row + cx] = col; mask[row + cx] = isLand ? 1 : 2;
        }
        continue;
      }
      if (!ht && !tt && !zt) { for (let p = row + c0, e = row + c1; p <= e; p++) buf[p] = base; continue; }
      for (let cx = c0; cx <= c1; cx++) {
        let col = base;
        if (ht) { const sp = ht.sp * hs, m = (cx + r) % sp; if (m < ht.w * hs) col = blend(col, ht.rgb, ht.a); }
        if (tt) {
          const sp = tt.sp * hs, m1 = (cx + r) % sp, m2 = ((cx - r) % sp + sp) % sp;
          if (m1 < tt.w * hs || m2 < tt.w * hs) col = blend(col, tt.rgb, tt.a);
        }
        if (zt && r % (zt.sp * hs) < zt.w * hs) col = blend(col, zt.rgb, zt.a);
        buf[row + cx] = col;
      }
    }
  }
  }
  // a dark line along the shore, where land pixels meet water pixels
  if (fine) {
    const shore = hexRgb(ui.mode === "terrain" ? "#1c2c34" : "#28373e");
    for (let r = 1; r < h - 1; r++) for (let cx = 1, p = r * w + 1; cx < w - 1; cx++, p++) {
      if (mask[p] !== 1) continue;
      if (mask[p + 1] === 2 || mask[p - 1] === 2 || mask[p + w] === 2 || mask[p - w] === 2) buf[p] = blend(buf[p], shore, 0.75);
    }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.putImageData(img, 0, 0);
}
// per-pixel coast once a world cell is at least this many device pixels across
const fineCoast = sk => !!app.world && app.world.M.s * sk >= 14;
const occCache = new Map();
function occHatch(packed) {
  let h = occCache.get(packed);
  if (!h) { h = { rgb: [(packed >> 16) & 0xFF, (packed >> 8) & 0xFF, packed & 0xFF], a: 0.9, sp: 7, w: 3 }; occCache.set(packed, h); }
  return h;
}
function blend(c, rgb, a) {
  const r = (c & 0xFF) * (1 - a) + rgb[0] * a, gg = ((c >> 8) & 0xFF) * (1 - a) + rgb[1] * a, b = ((c >> 16) & 0xFF) * (1 - a) + rgb[2] * a;
  return (0xFF000000 | (b << 16) | (gg << 8) | r) >>> 0;
}

// v: world->target transform in target css units; pr: device pixel ratio of the target;
// lk: the zoom that line widths are sized for; hs: device pixels per css pixel for hatch spacing
function drawBase(g, pr, v, cwid, chei, lk, hs, offs = [v.ox]) {
  const t0 = performance.now();
  rasterCells(g, pr, v, cwid, chei, hs, offs);
  app.perf.raster = performance.now() - t0;
  for (const ox of offs) drawBaseLines(g, pr, { k: v.k, ox, oy: v.oy }, cwid, chei, lk);
}
function drawBaseLines(g, pr, v, cwid, chei, lk) {
  const G = app.world, ui = app.ui, { M, C } = G, { k, ox, oy } = v;
  g.setTransform(pr * k, 0, 0, pr * k, pr * ox, pr * oy);
  const pad = M.s * 3, vx0 = -ox / k - pad, vy0 = -oy / k - pad, vx1 = (cwid - ox) / k + pad, vy1 = (chei - oy) / k + pad;
  const inV = (px, py) => px > vx0 && px < vx1 && py > vy0 && py < vy1;
  const XY = M.eXY;
  const edges = (list, color, px, dash) => {
    g.strokeStyle = color; g.lineWidth = px / lk; g.setLineDash(dash ? dash.map(d => d / lk) : []);
    g.beginPath();
    for (let n = 0; n < list.length; n++) {
      const e = list[n], x1 = XY[4 * e], y1 = XY[4 * e + 1], x2 = XY[4 * e + 2], y2 = XY[4 * e + 3];
      if (!inV((x1 + x2) / 2, (y1 + y2) / 2)) continue;
      g.moveTo(x1, y1); g.lineTo(x2, y2);
    }
    g.stroke(); g.setLineDash([]);
  };
  g.lineCap = "round";
  if (ui.layers.rivers) {
    const rs = C.riverSegs, n = C.riverCount, minW = 0.85 / lk; g.strokeStyle = RIVER_COL[ui.mode]; let curW = -1;
    g.beginPath();
    for (let q = 0; q < n; q++) {
      const o7 = q * 7, lw = Math.max(rs[o7], minW);
      if (!inV(rs[o7 + 3], rs[o7 + 4])) continue;
      if (lw !== curW) { if (curW > 0) g.stroke(); g.beginPath(); g.lineWidth = lw; curW = lw; }
      g.moveTo(rs[o7 + 1], rs[o7 + 2]); g.quadraticCurveTo(rs[o7 + 3], rs[o7 + 4], rs[o7 + 5], rs[o7 + 6]);
    }
    g.stroke();
  }
  if (ui.layers.settlements && G.X) {
    // roads: major ones stronger; drawn under the borders
    const rs = G.X.roadSegs, n = G.X.roadCount;
    for (const cls of [0, 1]) {
      g.strokeStyle = cls ? "rgba(96,66,38,.85)" : "rgba(110,80,50,.55)"; g.lineWidth = (cls ? 1.1 : 0.7) / lk; g.setLineDash(cls ? [] : [3 / lk, 2 / lk]);
      g.beginPath();
      for (let q = 0; q < n; q++) {
        const o = q * 7; if (rs[o] !== cls || !inV(rs[o + 3], rs[o + 4])) continue;
        g.moveTo(rs[o + 1], rs[o + 2]); g.quadraticCurveTo(rs[o + 3], rs[o + 4], rs[o + 5], rs[o + 6]);
      }
      g.stroke();
    }
    g.setLineDash([]);
  }
  if (ui.mode === "trade" && G.Q) drawTradeRoutes(g, G, lk, inV);
  const pol = FLAT.has(ui.mode);
  if (ui.layers.provinces) edges(G.edges.prov, pol ? "rgba(60,45,30,.32)" : "rgba(40,30,20,.22)", 0.7);
  if (ui.mode === "ecology" && G.edges.zone) edges(G.edges.zone, "rgba(30,50,25,.8)", 1.4);
  edges(G.edges.state, pol ? "rgba(45,30,20,.85)" : "rgba(70,30,30,.55)", pol ? 1.7 : 1.1, pol ? null : [4, 3]);
  if (!fineCoast(k * pr)) edges(G.edges.coast, ui.mode === "terrain" ? "rgba(28,44,52,.75)" : "rgba(40,55,62,.7)", 1.1);

  // region outlines (the hatching itself is painted by rasterCells)
  if (ui.layers.wildlife) edges(G.edges.host, "rgba(140,30,20,.8)", 1.2);
  if (ui.layers.titans) edges(G.edges.tit, "rgba(95,35,125,.95)", 2, [7, 4]);
  if (ui.layers.mysteries && G.edges.pzone) edges(G.edges.pzone, "rgba(70,40,90,.8)", 1.3, [2, 3]);
  if (G.edges.forb && G.edges.forb.length) edges(G.edges.forb, "rgba(40,44,52,.9)", 2.2, [1, 4]);
  if (G.edges.wall && G.edges.wall.length) { edges(G.edges.wall, "rgba(35,30,26,.95)", 3.4); edges(G.edges.wall, "rgba(196,186,166,.95)", 1.6, [2, 2]); }
  if (ui.mode === "conflict" && G.Z) drawFronts(g, G, lk, inV);
}
// trade: every link with traffic, thicker for more; sea lanes dashed; named routes in gold
function drawTradeRoutes(g, G, lk, inV) {
  const Q = G.Q, named = new Set(); for (const n of Q.named) for (const li of n.links) named.add(li);
  g.lineCap = "round"; g.lineJoin = "round";
  const path = r => { const p = r.pts; g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); };
  const vis = r => { const p = r.pts; for (let i = 0; i < p.length; i += 8) if (inV(p[i], p[i + 1])) return true; return inV(p[p.length - 2], p[p.length - 1]); };
  for (const pass of [0, 1]) for (const r of Q.routes) {
    if (!vis(r)) continue;
    const w = (0.7 + Math.sqrt(r.flow) * 5.5) / lk, gold = named.has(r.id);
    if (pass === 0) { path(r); g.setLineDash([]); g.strokeStyle = "rgba(255,250,235,.75)"; g.lineWidth = w + 1.6 / lk; g.stroke(); continue; }
    path(r);
    g.setLineDash(r.sea ? [5 / lk, 3 / lk] : []);
    g.strokeStyle = gold ? "#b07c12" : r.sea ? "#2f5f86" : "#7a4a22"; g.lineWidth = w; g.stroke();
  }
  g.setLineDash([]);
}
// conflict: every border between enemies, as a heavy line with teeth pointing at the enemy side
function drawFronts(g, G, lk, inV) {
  const Z = G.Z;
  g.lineCap = "round";
  for (const [col, w] of [["rgba(255,245,230,.9)", 5], ["#8e1b12", 2.6]]) {
    g.strokeStyle = col; g.lineWidth = w / lk; g.beginPath();
    for (const f of Z.fronts) {
      if (!inV(f.mx, f.my)) continue;
      const s = f.segs; for (let i = 0; i < s.length; i += 4) { g.moveTo(s[i], s[i + 1]); g.lineTo(s[i + 2], s[i + 3]); }
    }
    g.stroke();
  }
}

/* ---------- overlay: selection, labels, markers, scale bar ---------- */
// Everything written or pinned on the map goes through one collision grid per frame: things are
// placed in order of importance (realms, great cities, then smaller places, then features) and
// anything that would overlap something already placed is left out. Zooming in makes room, so
// detail appears gradually instead of piling up, however big the world is.
export class Declutter {
  constructor() { this.cells = new Map(); }
  _keys(x0, y0, x1, y1, fn) { for (let j = Math.floor(y0 / 64); j <= Math.floor(y1 / 64); j++) for (let i = Math.floor(x0 / 64); i <= Math.floor(x1 / 64); i++) fn(i * 4096 + j); }
  take(x0, y0, x1, y1, pad = 2) {
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    let hit = false;
    this._keys(x0, y0, x1, y1, k => { if (hit) return; const a = this.cells.get(k); if (a) for (const r of a) if (r[0] < x1 && r[2] > x0 && r[1] < y1 && r[3] > y0) { hit = true; return; } });
    if (hit) return false;
    const r = [x0, y0, x1, y1];
    this._keys(x0, y0, x1, y1, k => { let a = this.cells.get(k); if (!a) this.cells.set(k, a = []); a.push(r); });
    return true;
  }
}
const F_SC = fs => `${fs}px "IM Fell English SC", Georgia, serif`;
const F_IT = fs => `italic ${fs}px "IM Fell English", Georgia, serif`;
// a label in world units (the map transform is set); placed only if it fits in the grid
function label(g, v, dc, text, x, y, fs, font, fill, halo, spacing, force) {
  const k = v.k, scr = fs * k; if (scr < 7.5 || scr > 150) return false;
  g.font = font(fs);
  if ("letterSpacing" in g) g.letterSpacing = (spacing ? fs * spacing : 0) + "px";
  const w = g.measureText(text).width * k, sx = x * k + v.ox, sy = y * k + v.oy;
  if (!force && dc && !dc.take(sx - w / 2, sy - scr * 0.55, sx + w / 2, sy + scr * 0.55)) return false;
  if (halo) { g.lineWidth = fs * 0.2; g.strokeStyle = halo; g.strokeText(text, x, y); }
  g.fillStyle = fill; g.fillText(text, x, y);
  return true;
}
// map icons for places, by size: a castle for great cities, walled squares for cities, dots below
function placeIcon(g, s, px, py) {
  const t = s.tier;
  g.lineWidth = 1.3; g.strokeStyle = "rgba(255,248,232,.95)";
  if (t >= 4) {
    // crenellated keep with a gold band
    g.fillStyle = "#2a1c10";
    g.beginPath(); g.moveTo(px - 8, py + 6); g.lineTo(px - 8, py - 5);
    for (let i = 0; i < 4; i++) { const x = px - 8 + i * 4.67; g.lineTo(x, py - 8); g.lineTo(x + 2.3, py - 8); g.lineTo(x + 2.3, py - 5); g.lineTo(x + 4.67, py - 5); }
    g.lineTo(px + 8, py + 6); g.closePath(); g.stroke(); g.fill();
    g.fillStyle = "#e2b53c"; g.fillRect(px - 8, py - 1, 16, 2.5);
    return 9;
  }
  if (t === 3) {
    g.fillStyle = "#2a1c10"; g.fillRect(px - 5, py - 5, 10, 10); g.strokeRect(px - 5, py - 5, 10, 10);
    g.fillStyle = "#e8dcc0"; g.fillRect(px - 2, py - 2, 4, 4);
    return 6;
  }
  if (t === 2) { g.fillStyle = "#2a1c10"; g.fillRect(px - 3.2, py - 3.2, 6.4, 6.4); g.strokeRect(px - 3.2, py - 3.2, 6.4, 6.4); return 4; }
  g.beginPath(); g.arc(px, py, t === 1 ? 2.6 : 1.9, 0, Math.PI * 2); g.fillStyle = "#2a1c10"; g.fill(); g.lineWidth = 1; g.stroke();
  return 3;
}
function drawOverlay(g, pr, v, cwid, chei, dc) {
  app.ui.marks = [];
  const G = app.world, ui = app.ui, { M, R, S, F } = G, { k, ox, oy } = v, X = M.x, Y = M.y, mode = ui.mode;
  const world = () => g.setTransform(pr * k, 0, 0, pr * k, pr * ox, pr * oy), screen = () => g.setTransform(pr, 0, 0, pr, 0, 0);
  world();
  const pad = 40 / k, vx0 = -ox / k - pad, vy0 = -oy / k - pad, vx1 = (cwid - ox) / k + pad, vy1 = (chei - oy) / k + pad;
  const inV = (px, py) => px > vx0 && px < vx1 && py > vy0 && py < vy1;
  const off = (px, py) => px < -10 || py < -10 || px > cwid + 10 || py > chei + 10;
  const zr = k / app.fitK;
  g.lineCap = "round"; g.lineJoin = "round";
  if (ui.sel && ui.sel.edges) {
    const XY = M.eXY, list = ui.sel.edges;
    for (const [color, px] of [["rgba(255,246,220,.95)", 4.5], ["#2b1d0a", 1.6]]) {
      g.strokeStyle = color; g.lineWidth = px / k; g.beginPath();
      for (let n = 0; n < list.length; n++) { const e = list[n]; g.moveTo(XY[4 * e], XY[4 * e + 1]); g.lineTo(XY[4 * e + 2], XY[4 * e + 3]); }
      g.stroke();
    }
  }
  const labels = ui.layers.labels;
  g.textAlign = "center"; g.textBaseline = "middle";
  // 1. continent names: faint, behind everything, never block anything
  if (labels && (mode === "terrain" || mode === "height")) for (const m of R.masses) {
    if (!m.continent) continue;
    label(g, v, null, m.name.toUpperCase(), m.cx, m.cy, clamp(Math.sqrt(m.size * M.cellArea) * 0.075, 16, 46), F_SC, "rgba(40,28,18,.45)", null, 0.35, true);
  }
  // 2. realms: name, with the realm's arms above it, biggest realms first
  if (mode === "political" || mode === "conflict") {
    const order = S.states.slice().sort((a, b) => b.cells - a.cells);
    for (const s of order) {
      const c = s.heart; if (c < 0 || !inV(X[c], Y[c])) continue;
      const A = s.cells * M.cellArea, fs = clamp(Math.min(Math.sqrt(A) * 0.13, 1.8 * Math.sqrt(A) / Math.max(4, s.name.length)), 4, 40);
      const placed = labels && label(g, v, dc, s.name, X[c], Y[c], fs, F_SC, "rgba(30,20,12,.88)", "rgba(255,250,240,.5)", 0.04);
      const aw = clamp(fs * k * 1.1, 12, 34), ax = X[c] * k + ox, ay = Y[c] * k + oy - (placed ? fs * k * 0.6 + aw * 0.7 : 0);
      if ((placed || !labels) && fs * k >= 7.5 && dc.take(ax - aw / 2, ay - aw * 0.6, ax + aw / 2, ay + aw * 0.6)) { screen(); drawArms(g, armsOf(G, s.id), ax, ay, aw); world(); }
    }
  } else if (labels && mode === "biome") {
    for (const s of S.states) { const c = s.heart; if (c < 0 || !inV(X[c], Y[c])) continue; const A = s.cells * M.cellArea; label(g, v, dc, s.name, X[c], Y[c], clamp(Math.min(Math.sqrt(A) * 0.13, 1.8 * Math.sqrt(A) / Math.max(4, s.name.length)), 4, 40), F_SC, "rgba(30,20,12,.88)", "rgba(255,250,240,.5)", 0.04); }
  }
  if (labels && (mode === "culture" || mode === "faith" || mode === "ecology") && G.regionLabels) {
    for (const lb of G.regionLabels[mode].slice().sort((a, b) => b.fs - a.fs)) if (inV(lb.x, lb.y)) label(g, v, dc, lb.name, lb.x, lb.y, lb.fs, F_SC, "rgba(30,20,12,.88)", "rgba(255,250,240,.55)", 0.04);
  }
  // 3. settlements, biggest first; capitals carry their realm's arms
  screen();
  if ("letterSpacing" in g) g.letterSpacing = "0px";
  if (ui.layers.settlements && G.X && !(app.chunks && app.chunks.active(v))) {
    const need = [9, 5, 2.4, 1.2, 0], font = t => `${t >= 4 ? 700 : 600} ${t >= 4 ? 13 : t >= 3 ? 12 : 11}px "Alegreya Sans", system-ui, sans-serif`;
    const list = G.__byTier || (G.__byTier = G.X.settlements.slice().sort((a, b) => b.tier - a.tier || b.capital - a.capital || b.pop - a.pop));
    g.textAlign = "center"; g.textBaseline = "bottom";
    for (const s of list) {
      if (zr < need[s.tier] || s.abandoned) continue;
      const px = s.x * k + ox, py = s.y * k + oy; if (off(px, py)) continue;
      const cap = s.capital && s.tier >= 2 && mode !== "political" && mode !== "conflict";
      const r = cap ? 8 : s.tier >= 4 ? 9 : s.tier === 3 ? 6 : s.tier === 2 ? 4 : 3;
      if (!dc.take(px - r, py - r - (cap ? 3 : 0), px + r, py + r)) continue;
      if (cap) drawArms(g, armsOf(G, G.S.own[s.prov]), px, py, 13); else placeIcon(g, s, px, py);
      if (labels && s.tier >= 1 && zr >= need[s.tier] + (s.tier >= 3 ? 0.3 : 0.9)) {
        g.font = font(s.tier); const w = g.measureText(s.name).width, ty = py - r - 2;
        if (dc.take(px - w / 2, ty - 12, px + w / 2, ty)) { g.lineWidth = 3; g.strokeStyle = "rgba(255,250,238,.88)"; g.strokeText(s.name, px, ty); g.fillStyle = s.capital ? "#5a1208" : "#24170c"; g.fillText(s.name, px, ty); }
      }
    }
  }
  if (mode === "trade" && G.Q) {
    for (const h of G.Q.hubs) {
      const s = G.X.settlements[h], px = s.x * k + ox, py = s.y * k + oy; if (off(px, py)) continue;
      const r = 3 + Math.sqrt(G.Q.through[h]) * 9;
      if (!dc.take(px - r, py - r, px + r, py + r, 0)) continue;
      g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fillStyle = "rgba(240,200,90,.85)"; g.strokeStyle = "#4a3208"; g.lineWidth = 1.3; g.fill(); g.stroke();
    }
  }
  // 4. named features of the land, where there is room
  world(); g.textAlign = "center"; g.textBaseline = "middle";
  if (labels) {
    if (mode === "trade" && G.tradeLabels) for (const lb of G.tradeLabels) if (inV(lb.x, lb.y)) label(g, v, dc, lb.name, lb.x, lb.y, lb.fs, F_IT, "#5a3a08", "rgba(255,248,230,.8)", 0.03);
    if (G.L && ui.layers.mysteries) for (const z of G.L.zones) { const c = z.label; if (c >= 0 && inV(X[c], Y[c])) label(g, v, dc, z.n, X[c], Y[c], 9, F_IT, "#3a1a5a", "rgba(250,244,255,.75)", 0.03); }
    if (G.forbLabel && inV(G.forbLabel.x, G.forbLabel.y)) label(g, v, dc, G.W.forbiddenMark.n, G.forbLabel.x, G.forbLabel.y, 15, F_IT, "#262a33", "rgba(236,240,246,.8)", 0.18, true);
    if (ui.layers.titans) for (const t of F.titans) { const c = t.heart; if (c >= 0 && inV(X[c], Y[c])) label(g, v, dc, t.name, X[c], Y[c], 9, F_IT, "#4a1a60", "rgba(250,240,255,.7)", 0.03); }
    for (const b of R.bodies) {
      if (!inV(b.x, b.y) || (b.lake && b.cells * M.cellArea < 900)) continue;
      label(g, v, dc, b.name, b.x, b.y, b.fs, F_IT, mode === "height" ? "rgba(220,235,245,.7)" : "rgba(28,52,70,.6)", null, 0.12);
    }
    if (mode === "terrain" || mode === "height") {
      for (const r of R.ranges) { const c = r.cell; if (inV(X[c], Y[c])) label(g, v, dc, r.name, X[c], Y[c], clamp(Math.sqrt(r.size * M.cellArea) * 0.09, 6, 16), F_IT, "rgba(60,40,25,.85)", "rgba(245,238,225,.55)", 0.05); }
      for (const p of R.plats) if (p && inV(p.x, p.y)) label(g, v, dc, p.name, p.x, p.y, clamp(Math.sqrt(p.size * M.cellArea) * 0.1, 6, 13), F_IT, "rgba(70,50,30,.85)", "rgba(245,238,225,.55)", 0.05);
    }
    if (mode === "political" || mode === "conflict") for (const p of R.provs) {
      const c = p.heart; if (!inV(X[c], Y[c])) continue;
      const fs = clamp(Math.sqrt(p.size * M.cellArea) * 0.17, 1, 20); if (fs * k < 10) continue;
      label(g, v, dc, p.name, X[c], Y[c] + fs * 0.1, fs, F_IT, "rgba(40,30,20,.75)", null, 0);
    }
  }
  // 5. point markers, a constant screen size, where there is room
  screen();
  if ("letterSpacing" in g) g.letterSpacing = "0px";
  const sx = i => X[i] * k + ox, sy = i => Y[i] * k + oy;
  for (const vo of F.volcanoes) {
    const px = sx(vo.cell), py = sy(vo.cell); if (off(px, py) || !dc.take(px - 7, py - 10, px + 7, py + 5)) continue;
    g.beginPath(); g.moveTo(px, py - 7); g.lineTo(px + 7, py + 5); g.lineTo(px - 7, py + 5); g.closePath();
    g.fillStyle = "#5a3326"; g.strokeStyle = "rgba(255,240,220,.9)"; g.lineWidth = 1.5; g.stroke(); g.fill();
    g.beginPath(); g.arc(px, py - 7, 2.6, 0, Math.PI * 2); g.fillStyle = "#f06a2a"; g.fill();
  }
  // monuments built during history: wonders always, great works when zoomed a little, the rest closer
  if (G.H && G.H.monuments.length) for (const m of G.H.monuments) {
    if (m.tier === 1 && zr < 5 || m.tier === 2 && zr < 1.8) continue;
    const px = m.x * k + ox, py = m.y * k + oy; if (off(px, py)) continue;
    const s = m.tier === 3 ? 9 : m.tier === 2 ? 7 : 5;
    if (!dc.take(px - s, py - s * 1.6, px + s, py + 3)) continue;
    g.beginPath();
    if (m.tier === 3) { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.45 : s; g.lineTo(px + Math.cos(a) * r, py - s * 0.4 + Math.sin(a) * r); } g.closePath(); g.fillStyle = "#e2b53c"; }
    else { g.moveTo(px - s * 0.45, py + 2); g.lineTo(px - s * 0.25, py - s * 1.5); g.lineTo(px, py - s * 1.8); g.lineTo(px + s * 0.25, py - s * 1.5); g.lineTo(px + s * 0.45, py + 2); g.closePath(); g.fillStyle = m.tier === 2 ? "#d8c9a8" : "#b8b0a0"; }
    g.strokeStyle = "#2a1c10"; g.lineWidth = 1.3; g.fill(); g.stroke();
  }
  if (ui.layers.mysteries) {
    const showNames = zr > 3.2;
    g.font = '600 12px "Alegreya Sans", system-ui, sans-serif'; g.textAlign = "left"; g.textBaseline = "middle";
    for (const s of F.sites) {
      const px = sx(s.cell), py = sy(s.cell); if (off(px, py) || !dc.take(px - 6, py - 8, px + 6, py + 8)) continue;
      g.beginPath(); g.moveTo(px, py - 7); g.lineTo(px + 5, py); g.lineTo(px, py + 7); g.lineTo(px - 5, py); g.closePath();
      g.fillStyle = "#f2c75a"; g.strokeStyle = "#3b2a10"; g.lineWidth = 1.4; g.fill(); g.stroke();
      if (showNames) { const w = g.measureText(s.type).width; if (dc.take(px + 8, py - 7, px + 10 + w, py + 7)) { g.lineWidth = 3; g.strokeStyle = "rgba(255,250,238,.85)"; g.strokeText(s.type, px + 9, py); g.fillStyle = "#4a3208"; g.fillText(s.type, px + 9, py); } }
    }
    // markets and places of knowledge, once zoomed in to town level: small clickable icons
    app.ui.marks = [];
    if (zr > 6 && ui.layers.settlements) {
      const st = G.X.settlements, icon = (s, dx, glyph, fill, kind, id) => {
        const px = s.x * k + ox + dx, py = s.y * k + oy - 13; if (off(px, py) || !dc.take(px - 7, py - 7, px + 7, py + 7)) return;
        g.beginPath(); g.arc(px, py, 7, 0, Math.PI * 2); g.fillStyle = fill; g.strokeStyle = "#2a1c10"; g.lineWidth = 1.2; g.fill(); g.stroke();
        g.fillStyle = "#fff"; g.font = '700 9px "Alegreya Sans", system-ui, sans-serif'; g.textAlign = "center"; g.fillText(glyph, px, py + 0.5);
        app.ui.marks.push({ x: px, y: py, kind, id });
      };
      g.textBaseline = "middle";
      for (const h of G.Q.hubs) { const s = st[G.X.mainOf[h]]; if (s) icon(s, -9, "$", "#b8862c", "market", h); }
      if (G.L) for (const h of G.L.holders) if ((h.kind === "library" || h.kind === "archive" || h.kind === "temple") && !h.burned) { const s = st[G.X.mainOf[h.prov]]; if (s) icon(s, h.kind === "temple" ? 18 : 9, h.kind === "temple" ? "T" : "B", h.kind === "temple" ? "#7a5aa8" : "#3f6f8f", "holder", h.id); }
      g.textAlign = "left";
    }
    // premise sites, once the viewer knows of them (or in god view): a violet four-pointed star
    if (G.L) for (const s of G.L.sites) {
      if (siteLevel(G, s.id) < 0) continue;
      const px = sx(s.cell), py = sy(s.cell); if (off(px, py) || !dc.take(px - 7, py - 7, px + 7, py + 7)) continue;
      g.beginPath();
      for (let j = 0; j < 8; j++) { const a = -Math.PI / 2 + j * Math.PI / 4, r = j % 2 ? 2.6 : 7.5; g.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); }
      g.closePath(); g.fillStyle = "#b48ce0"; g.strokeStyle = "#24123a"; g.lineWidth = 1.3; g.fill(); g.stroke();
      if (showNames) { const w = g.measureText(s.name).width; if (dc.take(px + 9, py - 7, px + 11 + w, py + 7)) { g.lineWidth = 3; g.strokeStyle = "rgba(250,244,255,.85)"; g.strokeText(s.name, px + 10, py); g.fillStyle = "#3a1a5a"; g.fillText(s.name, px + 10, py); } }
    }
  }
}
function drawScaleBar(g, cwid, chei, k) {
  const kmPx = app.world.worldKm / W, target = 120 * kmPx / k;
  // down to metres, since the map now zooms from continents to single buildings
  const nice = [0.005, 0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
  let km = nice[0]; for (const n of nice) if (n <= target) km = n;
  const len = km / kmPx * k, x0 = cwid - len - 18, y0 = chei - 20;
  g.fillStyle = "rgba(250,247,240,.9)"; g.fillRect(x0 - 8, y0 - 22, len + 16, 32);
  for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#f4efe3" : "#2a2118"; g.fillRect(x0 + len * i / 4, y0, len / 4, 5); }
  g.strokeStyle = "#2a2118"; g.lineWidth = 1; g.strokeRect(x0, y0, len, 5);
  g.fillStyle = "#2a2118"; g.font = '500 11.5px "IBM Plex Mono", ui-monospace, monospace'; g.textAlign = "right"; g.textBaseline = "alphabetic";
  g.fillText(km >= 1 ? km.toLocaleString("en-US") + " km" : Math.round(km * 1000) + " m", x0 + len, y0 - 7);
  g.textAlign = "left"; g.fillText("0", x0, y0 - 7);
}

/* ---------- caches and frame composition ---------- */
const CACHE_OVERSAMPLE = 1;
const zoomedIn = () => app.view.k > app.fitK * CACHE_OVERSAMPLE * 1.02;

export function buildWorldCache() {
  if (!app.world || !app.cw) return;
  const t0 = performance.now();
  const K = app.fitK * app.dpr * CACHE_OVERSAMPLE;
  const c = app.wc && app.wc.canvas || document.createElement("canvas");
  c.width = Math.ceil(W * K); c.height = Math.ceil(H * K);
  drawBase(c.getContext("2d"), 1, { k: K, ox: 0, oy: 0 }, c.width, c.height, app.fitK, app.dpr * CACHE_OVERSAMPLE);
  app.wc = { canvas: c, K };
  if (app.vc) app.vc.valid = false;
  app.perf.cache = performance.now() - t0;
}

function renderViewCache() {
  const { cw, ch, dpr, view } = app, t0 = performance.now();
  const c = app.vc && app.vc.canvas || document.createElement("canvas");
  if (c.width !== Math.round(cw * dpr) || c.height !== Math.round(ch * dpr)) { c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr); }
  drawBase(c.getContext("2d"), dpr, view, cw, ch, view.k, dpr, wrapOffsets(view, cw));
  app.vc = { canvas: c, k: view.k, ox: view.ox, oy: view.oy, valid: true };
  app.perf.view = performance.now() - t0;
}

// crisp: allowed to re-render the zoomed-in viewport (slow path); otherwise reuse cached bitmaps
export function frame(crisp) {
  const { ctx, dpr, cw, ch, view, world } = app;
  if (!world || !cw || !app.wc) return;
  const t0 = performance.now();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = MODE_BG[app.ui.mode]; ctx.fillRect(0, 0, cw, ch);
  ctx.imageSmoothingQuality = "high";
  const vc = app.vc, zin = zoomedIn();
  const same = vc && vc.valid && vc.k === view.k && vc.ox === view.ox && vc.oy === view.oy;
  if (zin && crisp && !same) renderViewCache();
  const v2 = app.vc;
  const offs = wrapOffsets(view, cw), copyView = ox => ({ k: view.k, ox, oy: view.oy });
  const worldImage = () => { for (const ox of offs) ctx.drawImage(app.wc.canvas, ox, view.oy, W * view.k + 1, H * view.k); };
  if (zin && v2 && v2.valid) {
    const exact = v2.k === view.k && v2.ox === view.ox && v2.oy === view.oy;
    if (!exact) worldImage();
    const s = view.k / v2.k;
    ctx.drawImage(v2.canvas, view.ox - v2.ox * s, view.oy - v2.oy * s, cw * s, ch * s);
  } else worldImage();
  // detail layers, clipped to each copy of the world so the edges of one copy don't spill onto the next
  const darkAt = app.darkAt || (() => 0);
  for (const ox of offs) {
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.beginPath(); ctx.rect(ox, view.oy, W * view.k, H * view.k); ctx.clip();
    const cv = copyView(ox);
    if (app.chunks) app.chunks.draw(ctx, dpr, cv);
    if (app.towns) app.towns.draw(ctx, dpr, cv);
    if (app.street) app.street.draw(ctx, dpr, cv, darkAt);
    if (app.wild) app.wild.draw(ctx, dpr, cv);
    if (app.life) app.life.draw(ctx, dpr, cv);
    ctx.restore();
  }
  // night falls over everything on the ground; lights are added on top of it
  if (app.night && app.ui.layers.night && app.night.any) {
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = true;
    // lighter on the map modes that are about reading colours
    ctx.globalAlpha = FLAT.has(app.ui.mode) || app.ui.mode === "biome" ? 0.55 : 1;
    for (const ox of offs) ctx.drawImage(app.night.canvas, ox, view.oy, W * view.k + 1, H * view.k);
    ctx.globalAlpha = 1;
    ctx.restore();
    for (const ox of offs) {
      const cv = copyView(ox);
      drawCityLights(ctx, dpr, cv, darkAt);
      if (app.life) app.life.drawLights(ctx, dpr, cv, darkAt);
    }
    if (app.street) app.street.drawLights(ctx, dpr);
  }
  const dc = app.dc = new Declutter();
  for (const ox of offs) {
    const cv = copyView(ox);
    if (app.life) app.life.drawUI(ctx, dpr, cv, app.ui.mode === "conflict" || view.k / app.fitK > 2.5);
    drawOverlay(ctx, dpr, cv, cw, ch, dc);
    if (app.chunks) app.chunks.drawOverlay(ctx, dpr, cv);
    if (app.towns) app.towns.drawOverlay(ctx, dpr, cv);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScaleBar(ctx, cw, ch, view.k);
  app.perf.frame = performance.now() - t0;
}

// towns glow at night: a halo per settlement on the map, and lit windows once buildings show
function drawCityLights(ctx, dpr, v, darkAt) {
  const G = app.world; if (!G.X || !app.ui.layers.settlements) return;
  ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = "lighter";
  const zr = v.k / app.fitK, kmPx = G.worldKm / W, cw = app.cw, chh = app.ch;
  const streetOn = app.street && app.street.active(v);
  if (app.towns && app.towns.active(v) && !streetOn) {
    // top-down town: a warm point for some of the houses
    const mPerW = 1000 * kmPx, hour = localMinutes(app.clock.t, ((((app.cw / 2 - v.ox) / v.k) % W) + W) % W) / 60, late = hour > 22 || hour < 5 ? 0.25 : 1;
    app.towns.current(v, c => {
      const d = darkAt(c.cx, c.cy); if (d < 0.25) return;
      ctx.fillStyle = `rgba(255,200,110,${0.75 * d})`;
      const r = Math.max(1, Math.min(4, v.k / mPerW * 1.2));
      for (const l of c.lots) {
        if (((l.id * 2654435761) >>> 0) % 100 > 60 * late) continue;
        const x = (c.cx + l.u / mPerW) * v.k + v.ox, y = (c.cy + l.v / mPerW) * v.k + v.oy;
        if (x < -5 || y < -5 || x > cw + 5 || y > chh + 5) continue;
        ctx.fillRect(x - r / 2, y - r / 2, r, r);
      }
    });
  } else if (!streetOn) {
    for (const s of G.X.settlements) {
      if (s.tier < (zr < 3 ? 2 : 0)) continue;
      const x = s.x * v.k + v.ox, y = s.y * v.k + v.oy; if (x < -30 || y < -30 || x > cw + 30 || y > chh + 30) continue;
      const d = darkAt(s.x, s.y); if (d < 0.2) continue;
      const rKm = Math.sqrt(s.pop / 9000 / Math.PI) + 0.3, r = Math.max(1.5 + s.tier, rKm / kmPx * v.k * 1.6);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,205,120,${0.7 * d})`); g.addColorStop(1, "rgba(255,160,70,0)");
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
  ctx.restore();
}

export function invalidateView() { if (app.vc) app.vc.valid = false; }
