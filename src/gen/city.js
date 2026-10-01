import { clamp, makeRng, shuffle, Heap } from "../core/util.js";
import { BIOMES } from "../core/tables.js";
import { TIERS, urbanRadiusKm } from "./settlements.js";
import { localContext, riverWidthKm, RIVER_MEANDER, ROAD_MEANDER } from "./local.js";
import { provinceSettlements } from "./region.js";
import { ARCH } from "./archstyles.js";
import { townProfile } from "./townprofile.js";

// Towns in two parts.
//  1. A plan, built once per settlement and cached: the outline, walls, streets (lines with real
//     widths), squares, parks, landmarks, docks and every building as an oriented rectangle with a
//     type, district and floor count. Everything is in metres around the town centre.
//  2. A rasteriser that draws any 256x256-tile chunk of that plan at 2, 4, 8, 16 or 32 m per tile.
// The same plan renders identically at every resolution, so chunks line up, big cities only render
// what is on screen, and the building data is ready for other outputs (3D, exports) later.

export const TT = [
  { k: "deep", n: "Deep water" }, { k: "water", n: "Water" }, { k: "grass", n: "Grass" }, { k: "field", n: "Fields" },
  { k: "tree", n: "Trees" }, { k: "road", n: "Road" }, { k: "street", n: "Street" }, { k: "plaza", n: "Square" },
  { k: "wall", n: "Town wall" }, { k: "tower", n: "Wall tower" }, { k: "gate", n: "Gate" }, { k: "bridge", n: "Bridge" },
  { k: "building", n: "Building" }, { k: "garden", n: "Garden" }, { k: "dock", n: "Dock" }, { k: "sand", n: "Sand" },
  { k: "rock", n: "Rock" }, { k: "snow", n: "Snow" }, { k: "stall", n: "Market stall" }, { k: "yard", n: "Courtyard" },
  { k: "palisade", n: "Palisade" }, { k: "park", n: "Park" }, { k: "cemetery", n: "Cemetery" }, { k: "green", n: "Village green" },
];
export const T_ = Object.fromEntries(TT.map((t, i) => [t.k, i]));
export const KINDS = ["house", "rich", "workshop", "warehouse", "farm", "barn", "inn", "shack", "temple", "keep", "hall", "market", "library", "barracks", "mill"];
export const BUILDING_KINDS = {
  house: "House", rich: "Townhouse", workshop: "Workshop", warehouse: "Warehouse", farm: "Farmhouse", barn: "Barn",
  inn: "Inn", shack: "Cottage", temple: "Temple", keep: "Keep", hall: "Town hall", market: "Market hall",
  library: "Library", barracks: "Barracks", mill: "Mill",
};
const K_ = Object.fromEntries(KINDS.map((k, i) => [k, i]));
export const CIVIC = new Set(["temple", "keep", "hall", "market", "library", "barracks", "mill"]);
export const DISTRICTS = ["Countryside", "Old town", "Residential", "Market", "Harbour", "Temple quarter", "Rich quarter", "Craft quarter", "Suburb", "Citadel"];
const D = { country: 0, old: 1, res: 2, market: 3, harbour: 4, temple: 5, rich: 6, craft: 7, suburb: 8, citadel: 9 };
// levels: -2 is 0.5 m tiles (street level), 0 is 2 m, 4 is 32 m
export const CHUNK_T = 256, MAX_LEVEL = 4, MIN_LEVEL = -2;
export const levelTileM = level => 2 * Math.pow(2, level);
// half-width of the area a town's map covers, in km
export function townExtentKm(pop) { const r = urbanRadiusKm(pop); return r < 1 ? Math.max(r * 1.9, r + 0.35) : r * 1.45 + 0.5; }

export function findSettlement(G, sid) {
  const p = Math.floor(sid / 100);
  return provinceSettlements(G, p).find(s => s.id === sid) || null;
}

// occupancy codes on the planning grid
const O = { free: 0, street: 1, building: 2, sea: 3, river: 4, wall: 5, reserved: 6, bridge: 7 };

const planCache = new WeakMap();
export function townPlan(G, sid) {
  let byTown = planCache.get(G); if (!byTown) planCache.set(G, byTown = new Map());
  if (byTown.has(sid)) { const p = byTown.get(sid); byTown.delete(sid); byTown.set(sid, p); return p; }
  const plan = buildPlan(G, sid);
  byTown.set(sid, plan);
  if (byTown.size > 8) byTown.delete(byTown.keys().next().value); // keep the most recently used plans
  return plan;
}

function buildPlan(G, sid) {
  const t0 = Date.now();
  const s = findSettlement(G, sid); if (!s) throw new Error("Unknown settlement " + sid);
  const prof = townProfile(G, s), kit = ARCH[prof.style];
  const L = localContext(G), { C, X } = G, rng = makeRng(G.seed + "|town|" + sid);
  const tier = s.tier, rM = urbanRadiusKm(s.pop) * 1000, ext = townExtentKm(s.pop) * 1000, mPerW = 1000 * L.kmPx;
  // planning grid: fine enough for lots and streets, at most 2400 cells across
  const gm = Math.max(2, ext * 2 / 2400), NG = Math.ceil(ext * 2 / gm), ng = NG * NG;
  const U = g => -ext + (g + 0.5) * gm;                  // grid cell -> metres
  const Gc = u => (u + ext) / gm - 0.5;                  // metres -> fractional grid cell
  const toW = (u, v) => [s.x + u / mPerW, s.y + v / mPerW];
  const m = metres => metres / gm;
  const occ = new Uint8Array(ng), inB = (i, j) => i >= 0 && j >= 0 && i < NG && j < NG;
  const oc = L.ownerCell(s.x, s.y), bk = oc >= 0 ? BIOMES[C.biome[oc]].k : "grass";
  const cold = ["tundra", "glacier", "boreal", "peaks"].includes(bk);

  // water on the planning grid: sea from the smooth land field (sampled every ~40 m), rivers traced
  const st = Math.max(1, Math.round(40 / gm)), NS = Math.ceil(NG / st) + 1, fLand = new Float32Array(NS * NS), out = {};
  for (let b = 0; b < NS; b++) for (let a = 0; a < NS; a++) {
    const [px, py] = toW(U(a * st), U(b * st));
    fLand[b * NS + a] = L.landAt(px, py, out, 0.04);
  }
  const lerpS = (f, i, j) => {
    const fx = (i + 0.5) / st, fy = (j + 0.5) / st, a = Math.min(NS - 2, Math.floor(fx)), b = Math.min(NS - 2, Math.floor(fy)), tx = fx - a, ty = fy - b;
    return (f[b * NS + a] * (1 - tx) + f[b * NS + a + 1] * tx) * (1 - ty) + (f[(b + 1) * NS + a] * (1 - tx) + f[(b + 1) * NS + a + 1] * tx) * ty;
  };
  // near the shoreline, sample the coast exactly (at planning-grid resolution) instead of interpolating;
  // big plans skip it (the 40 m samples already hold all but the finest ~1% of the coast's detail)
  const fineCoast = NG * NG <= 1.5e6;
  for (let j = 0; j < NG; j++) for (let i = 0; i < NG; i++) {
    let f = lerpS(fLand, i, j);
    if (fineCoast && Math.abs(f - 0.5) < 0.03) { const [px, py] = toW(U(i), U(j)); f = L.landAt(px, py, out, gm / 1000); }
    if (f < 0.5) occ[j * NG + i] = O.sea;
  }
  const bboxW = [...toW(-ext, -ext), ...toW(ext, ext)];
  const stampG = (ci, cj, r, fn) => {
    const ri = Math.ceil(r);
    for (let dj = -ri; dj <= ri; dj++) for (let di = -ri; di <= ri; di++) {
      const i = Math.floor(ci) + di, j = Math.floor(cj) + dj;
      if (inB(i, j) && di * di + dj * dj <= r * r + 0.25) fn(j * NG + i, i, j);
    }
  };
  const worldToG = (px, py) => [Gc((px - s.x) * mPerW), Gc((py - s.y) * mPerW)];
  L.traceSegs(C.riverSegs, C.riverCount, bboxW, gm / mPerW * 0.7, wv => riverWidthKm(wv) / 2 / L.kmPx, RIVER_MEANDER.km, RIVER_MEANDER.amp, (px, py, r) => {
    const [gi, gj] = worldToG(px, py);
    stampG(gi, gj, Math.max(0.6, r * mPerW / gm), k => { if (occ[k] !== O.sea) occ[k] = O.river; });
  });
  const isWaterO = o => o === O.sea || o === O.river;

  // outline: spread from the centre over the cheapest ground to build on (coarse cost field)
  const cg = Math.max(2, Math.round(NG / 160)), NC = Math.ceil(NG / cg), cgm = cg * gm;
  const cLand = new Float32Array(NC * NC), cRiver = new Float32Array(NC * NC), cElev = new Float32Array(NC * NC), cWob = new Float32Array(NC * NC);
  for (let cj = 0; cj < NC; cj++) for (let ci = 0; ci < NC; ci++) {
    let landN = 0, riverN = 0, tot = 0;
    for (let j = cj * cg; j < Math.min(NG, cj * cg + cg); j++) for (let i = ci * cg; i < Math.min(NG, ci * cg + cg); i++) {
      const o = occ[j * NG + i]; tot++;
      if (!isWaterO(o)) landN++; else if (o === O.river) riverN++;
    }
    const c = cj * NC + ci, [px, py] = toW(U(ci * cg + cg / 2), U(cj * cg + cg / 2));
    cLand[c] = landN / Math.max(1, tot); cRiver[c] = riverN / Math.max(1, tot);
    L.blend(px, py, out);
    cElev[c] = out.e + L.detail(px, py) * 0.05;
    cWob[c] = 1 + L.farmNoise(px, py) * 0.12;
  }
  // distances are Float64: a Float32 store rounds below the queue key and nodes get skipped
  const cCost = new Float64Array(NC * NC).fill(Infinity), hp = new Heap();
  const cc0 = Math.floor(NG / 2 / cg), c0 = cc0 * NC + cc0;
  cCost[c0] = 0; hp.push(c0, 0);
  while (hp.size) {
    const c = hp.pop(), dc = hp.lk; if (dc > cCost[c]) continue;
    const ci = c % NC, cj = (c / NC) | 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const i2 = ci + di, j2 = cj + dj; if (i2 < 0 || j2 < 0 || i2 >= NC || j2 >= NC) continue;
      const nc = j2 * NC + i2; if (cLand[nc] + cRiver[nc] < 0.4) continue;
      const step = (di && dj ? 1.414 : 1) * (1 + Math.abs(cElev[nc] - cElev[c]) * 250 + cRiver[nc] * 5 + (1 - cLand[nc] - cRiver[nc]) * 4);
      const nd = dc + step; if (nd < cCost[nc]) { cCost[nc] = nd; hp.push(nc, nd); }
    }
  }
  const reach = []; for (let c = 0; c < NC * NC; c++) if (cCost[c] < Infinity) reach.push(c);
  reach.sort((a, b) => cCost[a] - cCost[b]);
  let acc = 0, thr = 1;
  for (const c of reach) { acc += cLand[c] * cgm * cgm; thr = cCost[c]; if (acc >= Math.PI * rM * rM) break; }
  thr = Math.max(thr, 1.5);
  const cCostCapped = new Float32Array(NC * NC);
  for (let c = 0; c < NC * NC; c++) cCostCapped[c] = Math.min(cCost[c], thr * 4) * cWob[c];
  // outline cost at any point, in units of the threshold (<= 1 is inside the town)
  const costAt = (u, v) => {
    const fx = clamp((u + ext) / cgm - 0.5, 0, NC - 1), fy = clamp((v + ext) / cgm - 0.5, 0, NC - 1);
    const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(NC - 1, x0 + 1), y1 = Math.min(NC - 1, y0 + 1), tx = fx - x0, ty = fy - y0;
    const f = cCostCapped;
    return ((f[y0 * NC + x0] * (1 - tx) + f[y0 * NC + x1] * tx) * (1 - ty) + (f[y1 * NC + x0] * (1 - tx) + f[y1 * NC + x1] * tx) * ty) / thr;
  };
  const cAtG = (i, j) => costAt(U(i), U(j));
  const insideG = (i, j, f = 1) => inB(i, j) && cAtG(i, j) <= f && !isWaterO(occ[j * NG + i]);
  // outline as a polyline by angle (walls, towers and ring streets follow it)
  const contour = (f, steps = 256) => {
    const pts = [];
    for (let t = 0; t <= steps; t++) {
      const a = (t / steps) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      let last = 0;
      for (let d = 0; d < ext; d += gm * 0.5) { if (costAt(ca * d, sa * d) > f) break; last = d; }
      pts.push([ca * last, sa * last, a]);
    }
    return pts;
  };

  // --- streets, recorded as polylines in metres ---
  const streets = [];   // { pts: [[u,v],...], w (metres), cls }
  const setStreetO = k => {
    const o = occ[k];
    if (o === O.sea || o === O.building || o === O.reserved) return;
    occ[k] = o === O.river || o === O.bridge ? O.bridge : O.street;
  };
  const addStreet = (ptsM, w, cls) => {
    if (ptsM.length < 2) return;
    streets.push({ pts: ptsM, w, cls });
    const r = Math.max(0.5, w / 2 / gm);
    for (let q = 0; q < ptsM.length - 1; q++) {
      const [u0, v0] = ptsM[q], [u1, v1] = ptsM[q + 1], steps = Math.max(1, Math.ceil(Math.hypot(u1 - u0, v1 - v0) / gm * 2));
      for (let t = 0; t <= steps; t++) stampG(Gc(u0 + (u1 - u0) * t / steps), Gc(v0 + (v1 - v0) * t / steps), r, setStreetO);
    }
  };
  const mainW = [5, 6, 8, 10, 12][tier], sideW = tier >= 2 ? 4 : 3.2;
  // main streets: world roads through the town (they end at its centre)
  const roadLines = [];
  {
    let curQ = -1, cur = null;
    L.traceSegs(X.roadSegs, X.roadCount, bboxW, gm / mPerW * 0.8, () => 0, ROAD_MEANDER.km, ROAD_MEANDER.amp, (px, py, r, q) => {
      if (q !== curQ) { curQ = q; cur = []; roadLines.push(cur); }
      cur.push([(px - s.x) * mPerW, (py - s.y) * mPerW]);
    });
    for (let a = 0, want = Math.max(0, (tier >= 2 ? 3 : 2) - roadLines.length); a < want; a++) {
      const ang = rng.range(0, Math.PI * 2), pts = [];
      for (let t = 0; t <= 1.0001; t += 0.02) { const d = t * rM * 1.6; pts.push([Math.cos(ang + Math.sin(t * 5) * 0.15) * d, Math.sin(ang + Math.sin(t * 5) * 0.15) * d]); }
      roadLines.push(pts);
    }
  }

  // --- fortifications ---
  const fortKind = prof.fort, wallT = fortKind === "palisade" ? 1.5 : 5;
  let boundary = null, towers = [], bastions = [], moat = null;
  if (fortKind !== "none") {
    boundary = contour(1, 512).map(([u, v, a]) => [u, v, a]);
    // walls block streets (except where roads pass: gates) and buildings
    for (let t = 0; t < boundary.length - 1; t++) {
      const [u0, v0] = boundary[t], [u1, v1] = boundary[t + 1], steps = Math.max(1, Math.ceil(Math.hypot(u1 - u0, v1 - v0) / gm * 2));
      for (let q = 0; q <= steps; q++) stampG(Gc(u0 + (u1 - u0) * q / steps), Gc(v0 + (v1 - v0) * q / steps), Math.max(0.6, wallT / 2 / gm), k => { if (!isWaterO(occ[k])) occ[k] = O.wall; });
    }
    if (fortKind !== "palisade") {
      let run = 0, runB = 0;
      for (let t = 1; t < boundary.length; t++) {
        const [u0, v0] = boundary[t - 1], [u1, v1, a] = boundary[t], dl = Math.hypot(u1 - u0, v1 - v0);
        run += dl; runB += dl;
        if (fortKind === "star" && runB > 140) { runB = 0; run = 0; bastions.push([u1 + Math.cos(a) * 10, v1 + Math.sin(a) * 10, 30, a]); }
        else if (run > 45) { run = 0; towers.push([u1, v1, 4]); }
      }
    }
    if (prof.moat) moat = { pts: boundary.map(([u, v, a]) => [u + Math.cos(a) * (wallT + 6), v + Math.sin(a) * (wallT + 6)]), w: 8 };
  }
  for (const ln of roadLines) addStreet(ln, mainW, 2);

  // --- squares, green ---
  const squares = [], parks = [], cemeteries = [];
  // real squares top out at a few hundred metres across even in the biggest cities
  const plazaR = clamp(Math.min(rM * 0.18, 8 + rM * 0.012), 5, 70);
  const reserveDisc = (u, v, r) => stampG(Gc(u), Gc(v), r / gm, k => { if (!isWaterO(occ[k])) occ[k] = O.reserved; });
  const reserveRect = (u, v, hw, hh) => { for (let j = Math.floor(Gc(v - hh)); j <= Gc(v + hh); j++) for (let i = Math.floor(Gc(u - hw)); i <= Gc(u + hw); i++) if (inB(i, j) && !isWaterO(occ[j * NG + i])) occ[j * NG + i] = O.reserved; };
  const addSquare = (u, v, r, kind = "plaza") => {
    squares.push({ u, v, r, shape: kit.plaza, kind });
    if (kit.plaza === "square") reserveRect(u, v, r, r); else reserveDisc(u, v, r);
  };
  if (prof.layout === "green") addSquare(0, 0, Math.min(rng.range(22, 40), rM * 0.55 + 6), "green"); else addSquare(0, 0, plazaR);

  // --- skeleton streets per layout ---
  const skeleton = [];
  const edgeF = fortKind !== "none" ? 0.97 : 1.05, core = prof.layout === "mixed" ? 0.45 : 1;
  const insideM = (u, v, f = 1) => { const i = Math.floor(Gc(u)), j = Math.floor(Gc(v)); return insideG(i, j, f); };
  if (prof.layout === "organic" || prof.layout === "mixed") {
    const lim = prof.layout === "mixed" ? core : edgeF;
    const nRad = clamp(Math.round(rM / 110 * (prof.layout === "mixed" ? 0.6 : 1)), tier >= 2 ? 5 : 3, 16), a0 = rng.range(0, Math.PI * 2);
    for (let r = 0; r < nRad; r++) {
      const ang = a0 + (r / nRad) * Math.PI * 2 + rng.range(-0.2, 0.2), wob = rng.range(-0.25, 0.25), pts = [];
      for (let d = plazaR; d < ext; d += gm) {
        const a = ang + Math.sin(Math.min(1, d / rM) * Math.PI) * wob, u = Math.cos(a) * d, v = Math.sin(a) * d;
        if (!insideM(u, v, lim)) break;
        pts.push([u, v]);
      }
      if (pts.length > 2) skeleton.push(pts);
    }
    const rings = prof.layout === "mixed" ? [core * 0.55, core] : tier >= 3 ? [0.38, 0.66] : tier >= 2 ? [0.55] : [];
    if (fortKind === "wall" || fortKind === "star") rings.push(0.93);
    for (const f of rings) skeleton.push(contour(f).map(([u, v]) => [u, v]));
  }
  let gridTheta = 0;
  if (prof.layout === "grid" || prof.layout === "mixed") {
    gridTheta = rng.range(0, Math.PI);
    const main = roadLines[0];
    if (main && main.length > 4) { const a = main[0], b = main[main.length - 1]; gridTheta = Math.atan2(b[1] - a[1], b[0] - a[0]); }
    const bA = rng.range(kit.block[0], kit.block[1]), bB = rng.range(kit.block[0] * 0.6, kit.block[1] * 0.8);
    const ca = Math.cos(gridTheta), sa = Math.sin(gridTheta), span = ext;
    const inGrid = (u, v) => insideM(u, v, edgeF) && (prof.layout !== "mixed" || costAt(u, v) > core);
    for (const [spacing, along, cross] of [[bA, [ca, sa], [-sa, ca]], [bB, [-sa, ca], [ca, sa]]]) {
      for (let uu = -span; uu <= span; uu += spacing) {
        let seg = [];
        for (let vv = -span; vv <= span; vv += gm) {
          const u = cross[0] * uu + along[0] * vv, v = cross[1] * uu + along[1] * vv;
          if (inGrid(u, v)) seg.push([u, v]);
          else if (seg.length) { if (seg.length > 6) skeleton.push(seg); seg = []; }
        }
        if (seg.length > 6) skeleton.push(seg);
      }
    }
  }
  for (const ln of skeleton) addStreet(ln, sideW * 1.2, 1);
  if (tier >= 3) {
    for (let t = 0, want = tier === 4 ? 5 : 3; t < 60 && squares.length <= want; t++) {
      const a = rng.range(0, Math.PI * 2), d = rM * rng.range(0.35, 0.8), u = Math.cos(a) * d, v = Math.sin(a) * d;
      if (!insideM(u, v, 0.9) || squares.some(q => Math.hypot(q.u - u, q.v - v) < rM * 0.3)) continue;
      addSquare(u, v, rng.range(12, 22));
    }
  }

  // --- lots (buildings as oriented rectangles) ---
  const LU = [], LV = [], LA = [], LW = [], LD = [], LK = [], LDist = [], LF = [], LC = [], LFr = [];
  // rasterise an oriented rect onto the planning grid; returns false if anything is in the way
  const rectCells = (cu, cv, ang, w, d, fn) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), hw = w / 2, hd = d / 2;
    const ex = Math.abs(ca) * hw + Math.abs(sa) * hd, ey = Math.abs(sa) * hw + Math.abs(ca) * hd;
    for (let j = Math.floor(Gc(cv - ey)); j <= Math.ceil(Gc(cv + ey)); j++) for (let i = Math.floor(Gc(cu - ex)); i <= Math.ceil(Gc(cu + ex)); i++) {
      const du = U(i) - cu, dv = U(j) - cv, a = du * ca + dv * sa, b = -du * sa + dv * ca;
      if (Math.abs(a) > hw || Math.abs(b) > hd) continue;
      if (fn(i, j) === false) return false;
    }
    return true;
  };
  const tryLot = (cu, cv, ang, w, d, kind, dist, floors, lim = 1, court = 0, front = 0) => {
    if (w < gm || d < gm) return -1;
    const okRect = rectCells(cu, cv, ang, w, d, (i, j) => inB(i, j) && occ[j * NG + i] === O.free && cAtG(i, j) <= lim);
    if (!okRect) return -1;
    rectCells(cu, cv, ang, w, d, (i, j) => { occ[j * NG + i] = O.building; });
    LU.push(cu); LV.push(cv); LA.push(ang); LW.push(w); LD.push(d); LK.push(K_[kind]); LDist.push(dist); LF.push(floors); LC.push(court); LFr.push(front);
    return LU.length - 1;
  };

  // landmarks, sited by purpose (before side streets, so they get space near the squares)
  const nearLot = (kind, w, d, cu, cv, rMin, rMax, dist, floors, tries = 300) => {
    for (let pass = 0; pass < 2; pass++) for (let t = 0; t < tries; t++) {
      const a = rng.range(0, Math.PI * 2), r = rng.range(rMin, pass ? rMax * 3 + 40 : rMax);
      const id = tryLot(cu + Math.cos(a) * r, cv + Math.sin(a) * r, gridTheta, w, d, kind, dist, floors, 1.2);
      if (id >= 0) return id;
    }
    return -1;
  };
  const sz = (v, lo, hi) => clamp(v, lo, hi);
  let citadel = null;
  if (prof.citadel || (fortKind !== "none" && tier === 2 && rng.chance(0.5))) {
    let best = null, bv = -Infinity;
    for (let t = 0; t < 200; t++) {
      const a = rng.range(0, Math.PI * 2), d = rM * rng.range(0.4, 0.8), u = Math.cos(a) * d, v = Math.sin(a) * d;
      if (!insideM(u, v, 0.85)) continue;
      const ci = clamp(Math.floor((u + ext) / cgm), 0, NC - 1), cj = clamp(Math.floor((v + ext) / cgm), 0, NC - 1);
      const e = cElev[cj * NC + ci] + rng.f() * 0.002;
      if (e > bv) { bv = e; best = [u, v]; }
    }
    if (best) {
      const cr = clamp(rM * 0.14, 40, 130);
      citadel = { u: best[0], v: best[1], r: cr, walled: prof.citadel };
      const kw = sz(rM * 0.1, 18, 50);
      const keep = nearLot("keep", kw, kw, best[0], best[1], 0, cr * 0.3, D.citadel, 4, 120);
      if (tier >= 3) nearLot("barracks", sz(rM * 0.08, 14, 36), sz(rM * 0.05, 8, 18), best[0], best[1], cr * 0.3, cr * 0.8, D.citadel, 2, 120);
      // the citadel is a closed precinct: its ring wall blocks everything else
      if (prof.citadel) stampG(Gc(best[0]), Gc(best[1]), cr / gm, (k, i, j) => {
        const dd = Math.hypot(U(i) - best[0], U(j) - best[1]);
        if (dd > cr - 4 && !isWaterO(occ[k])) occ[k] = occ[k] === O.street ? O.street : O.wall;
        else if (occ[k] === O.free) occ[k] = O.reserved;
      });
      void keep;
    }
  }
  let temple = -1;
  if (tier >= 1) temple = nearLot("temple", sz(rM * 0.12, tier >= 2 ? 14 : 9, 32), sz(rM * 0.18, tier >= 2 ? 20 : 12, 48), 0, 0, plazaR + 4, plazaR + (tier >= 2 ? 30 : 60), D.temple, 3);
  if (tier >= 2) nearLot("hall", sz(rM * 0.1, 14, 34), sz(rM * 0.08, 12, 26), 0, 0, plazaR + 2, plazaR + 26, D.market, 3);
  if (tier >= 3) {
    const sq = squares[1] || squares[0];
    nearLot("market", sz(rM * 0.1, 18, 45), sz(rM * 0.06, 12, 28), sq.u, sq.v, 10, 40, D.market, 2);
    if (rng.chance(0.6)) nearLot("library", sz(rM * 0.07, 14, 30), sz(rM * 0.07, 14, 30), 0, 0, rM * 0.15, rM * 0.45, D.res, 3);
  }
  if (tier <= 2) {
    for (let t = 0; t < 300; t++) {
      const i = rng.int(0, NG - 1), j = rng.int(0, NG - 1);
      if (occ[j * NG + i] !== O.river || Math.hypot(U(i), U(j)) > rM * 1.6) continue;
      if (nearLot("mill", 10, 8, U(i), U(j), 6, 20, D.craft, 2, 40) >= 0) break;
    }
  }

  // side streets branch off everything, then off each other (in the organic parts)
  const blockedO = o => o === O.sea || o === O.river || o === O.wall || o === O.reserved || o === O.building;
  const organicAt = (u, v) => prof.layout !== "grid" && (prof.layout !== "mixed" || costAt(u, v) <= core);
  const grow = (from, gen) => {
    const made = [], spacing = Math.max([0, 46, 58, 58, 58][gen] * (tier >= 3 ? 1 : 1.15), gm * (gen === 1 ? 6 : 7));
    for (const pts of from) {
      let accD = rng.range(0, spacing);
      for (let q = 1; q < pts.length; q++) {
        const [u0, v0] = pts[q - 1], [u1, v1] = pts[q], seg = Math.hypot(u1 - u0, v1 - v0);
        accD += seg; if (accD < spacing) continue;
        accD = rng.range(-6, 6);
        if (!insideM(u1, v1, fortKind !== "none" ? 1 : 1.25) || !organicAt(u1, v1)) continue;
        const tx = (u1 - u0) / (seg || 1), ty = (v1 - v0) / (seg || 1);
        for (const side of [-1, 1]) {
          if (!rng.chance(tier <= 1 ? 0.45 : 0.8)) continue;
          let ang = Math.atan2(tx * side, -ty * side) + rng.range(-0.25, 0.25);
          let pu = u1 + Math.cos(ang) * (mainW / 2 + 3), pv = v1 + Math.sin(ang) * (mainW / 2 + 3);
          const len = rng.range(30, Math.max(130, rM * 0.3)) * (gen === 1 ? 1.3 : 1) * (tier <= 1 ? 0.5 : 1), path = [[pu, pv]], probe = 9;
          for (let walked = 0; walked < len; walked += gm) {
            ang += rng.range(-0.08, 0.08) * Math.sqrt(gm / 2);
            pu += Math.cos(ang) * gm; pv += Math.sin(ang) * gm;
            const i = Math.floor(Gc(pu)), j = Math.floor(Gc(pv));
            if (!inB(i, j)) break;
            const o = occ[j * NG + i];
            if (blockedO(o) || !insideM(pu, pv, fortKind !== "none" ? 0.96 : 1.3)) break;
            path.push([pu, pv]);
            if (walked > gm * 2 && (o === O.street || o === O.bridge)) break;
            if (walked > probe) {
              const ai = Math.floor(Gc(pu + Math.cos(ang) * probe)), aj = Math.floor(Gc(pv + Math.sin(ang) * probe));
              if (inB(ai, aj) && (occ[aj * NG + ai] === O.street)) { path.push([pu + Math.cos(ang) * probe, pv + Math.sin(ang) * probe]); break; }
            }
          }
          if (path.length > Math.max(3, 8 / gm)) { addStreet(path, sideW, 0); made.push(path); }
        }
      }
    }
    return made;
  };
  let genLines = [...roadLines, ...skeleton];
  for (let gen = 1, gens = tier >= 3 ? 4 : tier === 2 ? 2 : 1; gen <= gens; gen++) genLines = grow(genLines, gen);

  // districts (a function of position, also used when rasterising for hover information)
  const nearWaterC = new Uint8Array(NC * NC);
  {
    const q = [], dist = new Int16Array(ng).fill(-1), lim = Math.max(2, Math.round(60 / gm));
    for (let k = 0; k < ng; k++) if (isWaterO(occ[k])) { dist[k] = 0; q.push(k); }
    for (let h = 0; h < q.length; h++) {
      const k = q[h]; if (dist[k] >= lim) continue;
      const i = k % NG, j = (k / NG) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (!inB(ii, jj)) continue; const kk = jj * NG + ii; if (dist[kk] < 0) { dist[kk] = dist[k] + 1; q.push(kk); nearWaterC[Math.floor(jj / cg) * NC + Math.floor(ii / cg)] = 1; } }
    }
  }
  const richA = citadel ? Math.atan2(citadel.v, citadel.u) : rng.range(0, Math.PI * 2);
  const craftA = roadLines.length && roadLines[0].length ? Math.atan2(roadLines[0][0][1], roadLines[0][0][0]) : richA + Math.PI;
  const templePos = temple >= 0 ? [LU[temple], LV[temple]] : null;
  const harbourTown = s.port || tier >= 2;
  const angDiff = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
  const districtAt = (u, v) => {
    if (citadel && Math.hypot(u - citadel.u, v - citadel.v) < citadel.r) return D.citadel;
    const c = costAt(u, v);
    if (c > 1) return c < (fortKind !== "none" ? 1.45 : 1.3) && tier >= 2 ? D.suburb : D.country;
    if (tier <= 1) return D.res;
    const ci = clamp(Math.floor((u + ext) / cgm), 0, NC - 1), cj = clamp(Math.floor((v + ext) / cgm), 0, NC - 1);
    if (harbourTown && nearWaterC[cj * NC + ci]) return D.harbour;
    if (templePos && Math.hypot(u - templePos[0], v - templePos[1]) < 90) return D.temple;
    if (c < 0.33) return Math.hypot(u, v) < plazaR + 45 ? D.market : D.old;
    const a = Math.atan2(v, u);
    if (angDiff(a, richA) < 0.55) return D.rich;
    if (angDiff(a, craftA) < 0.45) return D.craft;
    return D.res;
  };

  // parks in big cities, a cemetery beside the temple
  if (tier >= 3) for (let t = 0, want = tier === 4 ? 6 : 3; t < 80 && parks.length < want; t++) {
    const a = rng.range(0, Math.PI * 2), d = rM * rng.range(0.3, 0.85), u = Math.cos(a) * d, v = Math.sin(a) * d;
    const dk = districtAt(u, v); if (dk !== D.res && dk !== D.rich) continue;
    const r = rng.range(35, 90);
    parks.push({ u, v, r });
    stampG(Gc(u), Gc(v), r / gm, k => { if (occ[k] === O.free) occ[k] = O.reserved; });
  }
  if (templePos && tier >= 2) {
    const cw = rng.range(30, 55), ch = rng.range(25, 45);
    for (let t = 0; t < 60; t++) {
      const u = templePos[0] + rng.range(-60, 60), v = templePos[1] + rng.range(-60, 60);
      if (!rectCells(u, v, gridTheta, cw, ch, (i, j) => inB(i, j) && occ[j * NG + i] === O.free)) continue;
      rectCells(u, v, gridTheta, cw, ch, (i, j) => { occ[j * NG + i] = O.reserved; });
      cemeteries.push({ u, v, w: cw, h: ch, ang: gridTheta });
      break;
    }
  }

  // buildings along both sides of every street, then a second row behind in dense districts
  const LOT = { [D.old]: 0.8, [D.res]: 1, [D.market]: 0.9, [D.harbour]: 1.7, [D.temple]: 1, [D.rich]: 1.45, [D.craft]: 1.2, [D.suburb]: 0.7, [D.country]: 1, [D.citadel]: 1 };
  const DENSE = { [D.old]: 0.95, [D.market]: 0.9, [D.craft]: 0.85, [D.harbour]: 0.8, [D.res]: 0.72, [D.temple]: 0.6, [D.rich]: 0.5 };
  const kindFor = dk => {
    const r = rng.f();
    switch (dk) {
      case D.harbour: return r < 0.55 ? "warehouse" : r < 0.75 ? "workshop" : r < 0.83 ? "inn" : "house";
      case D.craft: return r < 0.55 ? "workshop" : r < 0.6 ? "inn" : "house";
      case D.rich: return r < 0.7 ? "rich" : "house";
      case D.market: return r < 0.15 ? "inn" : r < 0.35 ? "workshop" : r < 0.55 ? "rich" : "house";
      case D.suburb: return r < 0.8 ? "shack" : "workshop";
      case D.country: return r < 0.7 ? "farm" : "barn";
      default: return r < 0.05 ? "inn" : r < 0.12 ? "workshop" : "house";
    }
  };
  const floorsFor = (kind, dk) => kind === "rich" ? 3 : dk === D.old || dk === D.market ? rng.int(2, 4) : kind === "shack" || kind === "barn" ? 1 : rng.int(1, 2);
  const courtFor = (kind, w, d) => (kind === "house" || kind === "rich") && w >= 12 && d >= 12 && rng.chance(kit.courtyard * (kind === "rich" ? 1.6 : 1)) ? 1 : 0;
  const lotStep = 0.6;
  for (const st of streets) {
    const pts = st.pts, off = st.w / 2 + lotStep;
    let accD = rng.range(0, 4);
    for (let q = 1; q < pts.length; q++) {
      const [u0, v0] = pts[q - 1], [u1, v1] = pts[q], seg = Math.hypot(u1 - u0, v1 - v0); if (!seg) continue;
      const tx = (u1 - u0) / seg, ty = (v1 - v0) / seg, ang = Math.atan2(ty, tx);
      let t = accD;
      while (t < seg) {
        const pu = u0 + tx * t, pv = v0 + ty * t;
        let used = 3;
        for (const side of [-1, 1]) {
          const nx = -ty * side, ny = tx * side, probeU = pu + nx * (off + 4), probeV = pv + ny * (off + 4);
          const dk = districtAt(probeU, probeV);
          // hamlets and villages spill out along their roads as farmsteads
          const chance = dk === D.suburb ? 0.45 : dk === D.country ? (tier <= 1 ? 0.35 : 0.12) : dk === D.citadel ? 0 : 0.92 * kit.density;
          if (!rng.chance(chance)) continue;
          const f = LOT[dk] || 1, w = rng.range(kit.lot.along[0], kit.lot.along[1]) * f, d = rng.range(kit.lot.depth[0], kit.lot.depth[1]) * f;
          const kind = kindFor(dk), lim = dk === D.suburb ? 1.45 : dk === D.country ? 1.9 : tier <= 1 ? 1.6 : 1;
          const cu = pu + nx * (off + d / 2), cv = pv + ny * (off + d / 2);
          // the street is on the lot's -side of its local y axis: that face gets the door
          const id = tryLot(cu, cv, ang, w, d, kind, dk, floorsFor(kind, dk), lim, courtFor(kind, w, d), -side);
          if (id < 0) continue;
          used = Math.max(used, w);
          // a second building behind in dense districts
          if (DENSE[dk] && rng.chance(DENSE[dk] * 0.8)) {
            const d2 = rng.range(kit.lot.depth[0], kit.lot.depth[1]) * f * 0.8, w2 = w * rng.range(0.7, 1);
            const k2 = kindFor(dk);
            tryLot(pu + nx * (off + d + 1 + d2 / 2), pv + ny * (off + d + 1 + d2 / 2), ang, w2, d2, k2, dk, floorsFor(k2, dk), 1, courtFor(k2, w2, d2), -side);
          }
        }
        t += used + rng.range(0, 1.5);
      }
      accD = t - seg; // carry the remaining distance onto the next segment
    }
  }
  // infill: pack remaining open ground inside dense districts
  if (tier >= 2) {
    const open = [];
    for (let j = 0; j < NG; j += Math.max(1, Math.round(4 / gm))) for (let i = 0; i < NG; i += Math.max(1, Math.round(4 / gm))) {
      if (occ[j * NG + i] === O.free && cAtG(i, j) <= 1) open.push(j * NG + i);
    }
    shuffle(rng, open);
    for (const k of open) {
      if (occ[k] !== O.free) continue;
      const u = U(k % NG), v = U((k / NG) | 0), dk = districtAt(u, v);
      if (!DENSE[dk] || !rng.chance(DENSE[dk])) continue;
      const f = LOT[dk] || 1;
      for (let t = 0; t < 3; t++) {
        const w = Math.max(5, rng.range(kit.lot.along[0] * 0.7, kit.lot.along[1]) * f - t * 2), d = Math.max(5, rng.range(kit.lot.depth[0] * 0.7, kit.lot.depth[1]) * f - t * 2);
        if (w * d < 35) break;
        const kind = kindFor(dk);
        if (tryLot(u + w / 2, v + d / 2, gridTheta, w, d, kind, dk, floorsFor(kind, dk), 1, courtFor(kind, w, d)) >= 0) break;
      }
    }
  }

  // docks along the waterfront
  const docks = [];
  if (s.port || tier >= 2) {
    for (let j = 1; j < NG - 1; j += 2) for (let i = 1; i < NG - 1; i += 2) {
      const k = j * NG + i; if (!isWaterO(occ[k]) || cAtG(i, j) > 1.2 || !rng.chance(0.08)) continue;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ok = occ[(j - dj) * NG + (i - di)];
        if (isWaterO(ok)) continue;
        docks.push({ u: U(i), v: U(j), ang: Math.atan2(dj, di), len: rng.range(6, 18), w: 3 });
        break;
      }
    }
  }

  // spatial index of lots (64 m buckets) for fast chunk rasterising
  const nL = LU.length, BK = 64, NB = Math.ceil(ext * 2 / BK), buckets = new Map();
  for (let q = 0; q < nL; q++) {
    const r = Math.hypot(LW[q], LD[q]) / 2, b0 = Math.floor((LU[q] - r + ext) / BK), b1 = Math.floor((LU[q] + r + ext) / BK), c0b = Math.floor((LV[q] - r + ext) / BK), c1b = Math.floor((LV[q] + r + ext) / BK);
    for (let b = c0b; b <= c1b; b++) for (let a = b0; a <= b1; a++) { const key = (b + 2) * (NB + 4) + (a + 2); let arr = buckets.get(key); if (!arr) buckets.set(key, arr = []); arr.push(q); }
  }
  const lots = {
    n: nL, u: Float32Array.from(LU), v: Float32Array.from(LV), ang: Float32Array.from(LA), w: Float32Array.from(LW), d: Float32Array.from(LD),
    kind: Uint8Array.from(LK), dist: Uint8Array.from(LDist), floors: Uint8Array.from(LF), court: Uint8Array.from(LC), front: Int8Array.from(LFr),
  };
  const civic = [];
  for (let q = 0; q < nL; q++) if (CIVIC.has(KINDS[lots.kind[q]])) civic.push({ q, name: BUILDING_KINDS[KINDS[lots.kind[q]]], u: lots.u[q], v: lots.v[q] - lots.d[q] / 2 - 6 });
  return {
    sid, name: s.name, tier, tierName: TIERS[tier].n, pop: s.pop, port: s.port, profile: prof, biome: bk, cold,
    x: s.x, y: s.y, ext, mPerW, rM, thr, costAt, districtAt, fortKind, wallT, boundary, towers, bastions, moat, citadel,
    streets, squares, parks, cemeteries, docks, lots, buckets, BK, NB, civic, planMs: Date.now() - t0,
  };
}

// --- rasterising one chunk of a town at a level of detail ---
export function townChunk(G, sid, level, ci, cj) {
  const t0 = Date.now();
  const P = townPlan(G, sid), L = localContext(G), { C } = G;
  const tsz = levelTileM(level), T = CHUNK_T, n = T * T, u0 = ci * T * tsz, v0 = cj * T * tsz;
  const tile = new Uint8Array(n), lot = new Int32Array(n).fill(-1), shade = new Uint8Array(n), district = new Uint8Array(n);
  const sea = new Uint8Array(n);
  const toW = (u, v) => [P.x + u / P.mPerW, P.y + v / P.mPerW];
  const tu = i => u0 + (i + 0.5) * tsz, tv = j => v0 + (j + 0.5) * tsz;
  const ti = u => (u - u0) / tsz - 0.5, tj = v => (v - v0) / tsz - 0.5;
  const inT = (i, j) => i >= 0 && j >= 0 && i < T && j < T;
  const isWater = k => tile[k] === T_.water || tile[k] === T_.deep;

  // ground from the world fields, sampled every ~40 m and interpolated
  const st = Math.max(1, Math.round(40 / tsz)), NS = Math.ceil(T / st) + 2, out = {};
  const fLand = new Float32Array(NS * NS), fE = new Float32Array(NS * NS), fRock = new Float32Array(NS * NS), fForest = new Float32Array(NS * NS);
  for (let b = 0; b < NS; b++) for (let a = 0; a < NS; a++) {
    const [px, py] = toW(u0 + a * st * tsz, v0 + b * st * tsz), c = b * NS + a;
    fLand[c] = L.landAt(px, py, out, 0.04); fE[c] = out.e; fRock[c] = L.rockNoise(px, py); fForest[c] = L.forestNoise(px, py);
  }
  const lerpS = (f, i, j) => {
    const fx = (i + 0.5) / st, fy = (j + 0.5) / st, a = Math.min(NS - 2, Math.floor(fx)), b = Math.min(NS - 2, Math.floor(fy)), tx = fx - a, ty = fy - b;
    return (f[b * NS + a] * (1 - tx) + f[b * NS + a + 1] * tx) * (1 - ty) + (f[(b + 1) * NS + a] * (1 - tx) + f[(b + 1) * NS + a + 1] * tx) * ty;
  };
  for (let j = 0; j < T; j++) for (let i = 0; i < T; i++) {
    const k = j * T + i, e = lerpS(fE, i, j), u = tu(i), v = tv(j);
    let land = lerpS(fLand, i, j);
    if (Math.abs(land - 0.5) < 0.03) { const [px, py] = toW(u, v); land = L.landAt(px, py, out, tsz / 1000); }
    district[k] = P.districtAt(u, v);
    if (land < 0.5) { tile[k] = land < 0.35 ? T_.deep : T_.water; sea[k] = 1; continue; }
    const c = P.costAt(u, v);
    if (P.cold && e > 0.5) tile[k] = T_.snow;
    else if (e > 0.6 + lerpS(fRock, i, j) * 0.1) tile[k] = T_.rock;
    else if (c <= 1) tile[k] = T_.garden;
    else if (land < 0.53 && e < 0.06 && !P.cold) tile[k] = T_.sand;
    else if (district[k] === 8) tile[k] = T_.garden;
    else if (c < 1.9 && !P.cold && lerpS(fForest, i, j) <= 0.2) tile[k] = T_.field;
    else {
      const h = ((Math.floor(u / 2) * 73856093) ^ (Math.floor(v / 2) * 19349663) ^ sid) >>> 0;
      tile[k] = lerpS(fForest, i, j) > 0.2 && (h % 100) < 55 ? T_.tree : T_.grass;
    }
  }
  const stamp = (cu, cv, rM, fn) => {
    const ci2 = ti(cu), cj2 = tj(cv), r = Math.max(0.5, rM / tsz), ri = Math.ceil(r);
    if (ci2 + ri < 0 || cj2 + ri < 0 || ci2 - ri >= T || cj2 - ri >= T) return;
    for (let dj = -ri; dj <= ri; dj++) for (let di = -ri; di <= ri; di++) {
      const i = Math.round(ci2) + di, j = Math.round(cj2) + dj;
      if (inT(i, j) && di * di + dj * dj <= r * r + 0.25) fn(j * T + i, i, j);
    }
  };
  const line = (pts, wM, fn) => {
    const pad = wM + tsz * 2;
    for (let q = 0; q < pts.length - 1; q++) {
      const [ua, va] = pts[q], [ub, vb] = pts[q + 1];
      if (Math.max(ua, ub) < u0 - pad || Math.min(ua, ub) > u0 + T * tsz + pad || Math.max(va, vb) < v0 - pad || Math.min(va, vb) > v0 + T * tsz + pad) continue;
      const steps = Math.max(1, Math.ceil(Math.hypot(ub - ua, vb - va) / tsz * 2));
      for (let t = 0; t <= steps; t++) stamp(ua + (ub - ua) * t / steps, va + (vb - va) * t / steps, wM / 2, fn);
    }
  };
  // rivers at true width
  const [wx0, wy0] = toW(u0, v0), [wx1, wy1] = toW(u0 + T * tsz, v0 + T * tsz);
  L.traceSegs(C.riverSegs, C.riverCount, [wx0, wy0, wx1, wy1], tsz / P.mPerW * 0.7, wv => riverWidthKm(wv) / 2 / L.kmPx, RIVER_MEANDER.km, RIVER_MEANDER.amp, (px, py, r) => {
    stamp((px - P.x) * P.mPerW, (py - P.y) * P.mPerW, Math.max(tsz * 0.8, r * P.mPerW), k => { if (tile[k] !== T_.deep) tile[k] = T_.water; });
  });
  // moat, walls, towers, bastions
  if (P.moat) line(P.moat.pts, P.moat.w, k => { if (!isWater(k)) tile[k] = T_.water; });
  if (P.boundary) {
    const wt = P.fortKind === "palisade" ? T_.palisade : T_.wall;
    line(P.boundary, P.wallT, k => { if (!isWater(k)) tile[k] = wt; });
    for (const [u, v, r] of P.towers) stamp(u, v, r, k => { if (tile[k] === T_.wall) tile[k] = T_.tower; });
    for (const [u, v, sz, a] of P.bastions) {
      const ca = Math.cos(a), sa = Math.sin(a);
      stamp(u, v, sz, (k, i, j) => {
        const du = tu(i) - u, dv = tv(j) - v, ru = Math.abs(du * ca + dv * sa) + Math.abs(-du * sa + dv * ca);
        if (ru <= sz && !isWater(k)) tile[k] = ru > sz - 3 ? T_.wall : T_.tower;
      });
    }
  }
  if (P.citadel && P.citadel.walled) {
    const { u, v, r } = P.citadel;
    stamp(u, v, r, (k, i, j) => { const d = Math.hypot(tu(i) - u, tv(j) - v); if (d > r - 4 && !isWater(k)) tile[k] = T_.wall; });
  }
  // streets (over walls they become gates; over rivers and moats, bridges; never over the sea)
  const setStreet = cls => k => {
    const t = tile[k];
    if (isWater(k)) { if (!sea[k]) tile[k] = T_.bridge; return; }
    if (t === T_.bridge) return;
    if (t === T_.wall || t === T_.tower || t === T_.palisade) { tile[k] = T_.gate; return; }
    tile[k] = cls === 2 && P.costAt(tu(k % T), tv((k / T) | 0)) > 1.08 ? T_.road : T_.street;
  };
  for (const s of P.streets) line(s.pts, s.w, setStreet(s.cls));
  // squares, parks, cemeteries
  for (const q of P.squares) {
    const t = q.kind === "green" ? T_.green : T_.plaza;
    stamp(q.u, q.v, q.r * 1.42, (k, i, j) => {
      if (isWater(k)) return;
      const du = tu(i) - q.u, dv = tv(j) - q.v;
      if (q.shape === "square" ? Math.max(Math.abs(du), Math.abs(dv)) <= q.r : Math.hypot(du, dv) <= q.r) {
        // market stalls scattered over the main square
        const h = ((Math.floor(tu(i) / 2) * 2654435761) ^ (Math.floor(tv(j) / 2) * 40503)) >>> 0;
        tile[k] = t === T_.plaza && q === P.squares[0] && Math.hypot(du, dv) < q.r * 0.8 && h % 100 < 6 ? T_.stall : t;
      }
    });
  }
  for (const p of P.parks) stamp(p.u, p.v, p.r, k => { if (tile[k] === T_.garden || tile[k] === T_.grass || tile[k] === T_.tree) tile[k] = T_.park; });
  for (const c of P.cemeteries) {
    const ca = Math.cos(c.ang), sa = Math.sin(c.ang);
    stamp(c.u, c.v, Math.hypot(c.w, c.h) / 2, (k, i, j) => {
      const du = tu(i) - c.u, dv = tv(j) - c.v;
      if (Math.abs(du * ca + dv * sa) <= c.w / 2 && Math.abs(-du * sa + dv * ca) <= c.h / 2 && !isWater(k)) tile[k] = T_.cemetery;
    });
  }
  // docks
  for (const d of P.docks) {
    const ca = Math.cos(d.ang), sa = Math.sin(d.ang);
    for (let t = 0; t <= d.len; t += tsz * 0.5) stamp(d.u + ca * t, d.v + sa * t, Math.max(tsz * 0.5, d.w / 2), k => { if (isWater(k)) tile[k] = T_.dock; });
  }
  // buildings: oriented rectangles, with roof shading worked out in each building's own frame
  const lots = P.lots, used = new Map(), chunkLots = [];
  const b0 = Math.floor((u0 + P.ext) / P.BK) - 1, b1 = Math.floor((u0 + T * tsz + P.ext) / P.BK) + 1;
  const c0b = Math.floor((v0 + P.ext) / P.BK) - 1, c1b = Math.floor((v0 + T * tsz + P.ext) / P.BK) + 1;
  const kit = ARCH[P.profile.style], flat = kit.roof === "flat", cm = 3.5;
  for (let b = c0b; b <= c1b; b++) for (let a = b0; a <= b1; a++) {
    const arr = P.buckets.get((b + 2) * (P.NB + 4) + (a + 2)); if (!arr) continue;
    for (const q of arr) {
      if (used.has(q)) continue; used.set(q, -1);
      const cu = lots.u[q], cv = lots.v[q], ang = lots.ang[q], hw = lots.w[q] / 2, hd = lots.d[q] / 2, court = lots.court[q];
      const ca = Math.cos(ang), sa = Math.sin(ang), ex = Math.abs(ca) * hw + Math.abs(sa) * hd, ey = Math.abs(sa) * hw + Math.abs(ca) * hd;
      const i0 = Math.max(0, Math.floor(ti(cu - ex))), i1 = Math.min(T - 1, Math.ceil(ti(cu + ex))), j0 = Math.max(0, Math.floor(tj(cv - ey))), j1 = Math.min(T - 1, Math.ceil(tj(cv + ey)));
      if (i0 > i1 || j0 > j1) continue;
      let local = -1;
      const edge = Math.max(tsz * 0.9, 0.6), ridgeLong = hw >= hd;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const du = tu(i) - cu, dv = tv(j) - cv, x = du * ca + dv * sa, y = -du * sa + dv * ca;
        if (Math.abs(x) > hw || Math.abs(y) > hd) continue;
        const k = j * T + i;
        if (isWater(k)) continue;
        if (local < 0) { local = chunkLots.length; chunkLots.push(q); used.set(q, local); }
        if (court && Math.abs(x) < hw - cm && Math.abs(y) < hd - cm) { tile[k] = T_.yard; continue; }
        tile[k] = T_.building; lot[k] = local;
        // shade code: 1 lit edge, 2 shaded edge, 3 ridge, 0 plain roof
        const ox = hw - Math.abs(x), oy = hd - Math.abs(y);
        let code = 0;
        if (Math.min(ox, oy) < edge || (court && Math.min(Math.abs(Math.abs(x) - (hw - cm)), Math.abs(Math.abs(y) - (hd - cm))) < edge)) {
          // outward normal of the nearest edge, in map orientation; light comes from the north-west
          const nx = ox < oy ? Math.sign(x) * ca : -Math.sign(y) * sa, ny = ox < oy ? Math.sign(x) * sa : Math.sign(y) * ca;
          code = flat ? 2 : nx + ny < 0 ? 1 : 2;
        } else if (!flat && !court && (ridgeLong ? Math.abs(y) < edge * 0.6 : Math.abs(x) < edge * 0.6)) code = 3;
        shade[k] = code;
      }
    }
  }
  const lotInfo = chunkLots.map(q => ({
    id: P.sid * 1e6 + q, kind: KINDS[lots.kind[q]], name: BUILDING_KINDS[KINDS[lots.kind[q]]], district: DISTRICTS[lots.dist[q]],
    floors: lots.floors[q], w: lots.w[q], d: lots.d[q], court: !!lots.court[q], u: lots.u[q], v: lots.v[q], ang: lots.ang[q], front: lots.front[q],
  }));
  const labels = P.civic.filter(c => c.u >= u0 && c.u < u0 + T * tsz && c.v >= v0 && c.v < v0 + T * tsz).map(c => ({ name: c.name, x: P.x + c.u / P.mPerW, y: P.y + c.v / P.mPerW }));
  const tw = tsz / P.mPerW;
  // street centre-lines for people walking about, only at the finest levels
  const streets = [];
  if (level < 0) {
    const pad = 20, x0m = u0 - pad, x1m = u0 + T * tsz + pad, y0m = v0 - pad, y1m = v0 + T * tsz + pad;
    P.streets.forEach((st, si) => {
      const pts = st.pts;
      if (!pts.some(([u, v]) => u > x0m && u < x1m && v > y0m && v < y1m)) return;
      streets.push({ id: si, w: st.w, cls: st.cls, pts: Float32Array.from(pts.flat()) });
    });
  }
  return {
    sid, level, ci, cj, T, tsz, tile, lot, shade, district, lots: lotInfo, labels, streets,
    x0: P.x + u0 / P.mPerW, y0: P.y + v0 / P.mPerW, tw, cx: P.x, cy: P.y, extW: P.ext / P.mPerW,
    summary: { sid, name: P.name, tier: P.tier, tierName: P.tierName, pop: P.pop, profile: P.profile, biome: P.biome, buildings: P.lots.n, planMs: P.planMs },
    ms: Date.now() - t0,
  };
}
