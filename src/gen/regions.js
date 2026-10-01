import { clamp, makeRng, shuffle, Heap } from "../core/util.js";
import { W, BIOMES } from "../core/tables.js";
import { makeLanguage } from "../core/names.js";
import { findCell, innerDist, heartCells } from "./mesh.js";

// Landmasses, provinces, and names for every geographic feature.
export function genRegions(M, T, Cl, P, seed) {
  const rng = makeRng(seed + "|regions"), nameRng = makeRng(seed + "|names");
  const { N, x, y, nStart, nbr } = M, { type, e } = T;
  const landList = []; for (let i = 0; i < N; i++) if (type[i] === 0) landList.push(i);
  const land = Int32Array.from(landList), L = land.length;

  // landmasses
  const lm = new Int32Array(N).fill(-1), masses = [];
  for (const i of land) {
    if (lm[i] >= 0) continue;
    const id = masses.length, cells = [i]; lm[i] = id;
    for (let q = 0; q < cells.length; q++) { const c = cells[q]; for (let k = nStart[c]; k < nStart[c + 1]; k++) { const n = nbr[k]; if (type[n] === 0 && lm[n] < 0) { lm[n] = id; cells.push(n); } } }
    let sx = 0, sy = 0; for (const c of cells) { sx += x[c]; sy += y[c]; }
    masses.push({ id, size: cells.length, cx: sx / cells.length, cy: sy / cells.length });
  }
  const bySize = masses.slice().sort((a, b) => b.size - a.size);
  bySize.forEach((m, k) => { m.continent = k === 0 || m.size >= L * 0.04; });
  const conts = bySize.filter(m => m.continent);
  conts.forEach((m, k) => { m.lang = makeLanguage(makeRng(seed + "|lang" + k)); });
  const nearestCont = (px, py) => { let b = conts[0], bd = Infinity; for (const c of conts) { const d = (c.cx - px) ** 2 + (c.cy - py) ** 2; if (d < bd) { bd = d; b = c; } } return b; };
  const langAt = (px, py) => nearestCont(px, py).lang;
  const used = new Set();
  for (const m of bySize) {
    if (m.continent) { m.name = m.lang.word(nameRng, used); continue; }
    m.lang = nearestCont(m.cx, m.cy).lang;
    if (m.size >= 5) { const w = m.lang.word(nameRng, used); m.name = m.size >= L * 0.008 ? w : nameRng.chance(0.5) ? "Isle of " + w : w + " Isle"; }
    else m.name = "";
  }

  // province seeds, spaced apart with a grid-accelerated rejection test
  const target = Math.max(1, Math.min(P.provinces, L)), avg = L / target;
  const sh = shuffle(rng, landList.slice()), seeds = [], taken = new Uint8Array(N);
  let rmin = 0.85 * Math.sqrt(avg) * M.s;
  for (let pass = 0; pass < 5 && seeds.length < target; pass++) {
    const gs = rmin, grid = new Map(), key = (gx, gy) => gx * 100000 + gy;
    const add = i => { const k = key(Math.floor(x[i] / gs), Math.floor(y[i] / gs)); let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(i); };
    seeds.forEach(add);
    for (const i of sh) {
      if (seeds.length >= target) break; if (taken[i]) continue;
      const gx = Math.floor(x[i] / gs), gy = Math.floor(y[i] / gs); let ok = true;
      for (let a = -1; a <= 1 && ok; a++) for (let b = -1; b <= 1 && ok; b++) {
        const arr = grid.get(key(gx + a, gy + b)); if (!arr) continue;
        for (const j of arr) if ((x[i] - x[j]) ** 2 + (y[i] - y[j]) ** 2 < rmin * rmin) { ok = false; break; }
      }
      if (ok) { seeds.push(i); taken[i] = 1; add(i); }
    }
    rmin *= 0.75;
  }

  // grow provinces outward; ridges and rivers are expensive to cross, so borders follow them
  const river = Cl.river;
  const cost = (a, b) => Math.hypot(x[a] - x[b], y[a] - y[b]) * (1 + Math.abs(e[a] - e[b]) * 45 + (river[a] !== river[b] ? 0.6 : 0));
  const owner = new Int32Array(N).fill(-1);
  const wts = new Float32Array(target * 2 + 400); for (let k = 0; k < wts.length; k++) wts[k] = rng.range(0.85, 1.2);
  function grow(seedList, ids, allow) {
    const dist = new Float64Array(N).fill(Infinity), hp = new Heap(); // Float64 so queue keys compare exactly
    seedList.forEach((s, k) => { owner[s] = ids[k]; dist[s] = 0; hp.push(s, 0); });
    while (hp.size) {
      const c = hp.pop(), dc = hp.lk; if (dc > dist[c]) continue;
      const w = wts[owner[c]] || 1;
      for (let k = nStart[c]; k < nStart[c + 1]; k++) {
        const n = nbr[k]; if (!allow[n]) continue;
        const nd = dc + cost(c, n) * w;
        if (nd < dist[n]) { dist[n] = nd; owner[n] = owner[c]; hp.push(n, nd); }
      }
    }
  }
  const landMask = new Uint8Array(N); for (const i of land) landMask[i] = 1;
  const ids = seeds.map((_, k) => k);
  grow(seeds, ids, landMask);
  // one relaxation pass so provinces come out evenly shaped
  {
    const n = seeds.length, sx = new Float64Array(n), sy = new Float64Array(n), cn = new Int32Array(n);
    for (const i of land) { const o = owner[i]; if (o >= 0) { sx[o] += x[i]; sy[o] += y[i]; cn[o]++; } }
    const best = seeds.slice(), bd = new Float64Array(n).fill(Infinity);
    for (const i of land) { const o = owner[i]; if (o < 0 || !cn[o]) continue; const d = (x[i] - sx[o] / cn[o]) ** 2 + (y[i] - sy[o] / cn[o]) ** 2; if (d < bd[o]) { bd[o] = d; best[o] = i; } }
    for (const i of land) owner[i] = -1;
    grow(best, ids, landMask);
  }
  // land that no seed reached: tiny islets join the nearest province, larger islands get their own
  let nextId = seeds.length;
  const inComp = new Uint8Array(N), allow = new Uint8Array(N);
  for (const i of land) {
    if (owner[i] >= 0) continue;
    const comp = [i]; inComp[i] = 1;
    for (let q = 0; q < comp.length; q++) { const c = comp[q]; for (let k = nStart[c]; k < nStart[c + 1]; k++) { const n = nbr[k]; if (type[n] === 0 && owner[n] < 0 && !inComp[n]) { inComp[n] = 1; comp.push(n); } } }
    let attach = -1;
    if (comp.length < avg * 0.35) {
      const d = new Map(), q = comp.slice(); comp.forEach(c => d.set(c, 0));
      for (let h = 0; h < q.length && attach < 0; h++) {
        const c = q[h]; if (d.get(c) > 10) break;
        for (let k = nStart[c]; k < nStart[c + 1]; k++) {
          const n = nbr[k]; if (d.has(n)) continue; d.set(n, d.get(c) + 1);
          if (type[n] === 0 && owner[n] >= 0) { attach = owner[n]; break; }
          q.push(n);
        }
      }
    }
    if (attach >= 0) { for (const c of comp) owner[c] = attach; continue; }
    const k = Math.max(1, Math.round(comp.length / avg)), sub = shuffle(rng, comp.slice()).slice(0, k);
    for (const c of comp) allow[c] = 1;
    grow(sub, sub.map((_, j) => nextId + j), allow);
    for (const c of comp) allow[c] = 0;
    nextId += k;
  }
  // compact province ids
  const remap = new Int32Array(nextId).fill(-1); let np = 0;
  for (const i of land) { const o = owner[i]; if (remap[o] < 0) remap[o] = np++; owner[i] = remap[o]; }
  const provCells = Array.from({ length: np }, () => []);
  for (const i of land) provCells[owner[i]].push(i);

  // water bodies: oceans at the points farthest from land, carved seas, and lakes
  const waterName = new Int32Array(N).fill(-1), bodies = [];
  const seaLang = conts[0].lang;
  const ocean = []; for (let i = 0; i < N; i++) if (type[i] === 1) ocean.push(i);
  const oc = ocean.slice().sort((a, b) => T.coastDist[b] - T.coastDist[a]), opts = [];
  for (const i of oc) {
    if (opts.length >= 4 || T.coastDist[i] < 5) break;
    if (opts.every(j => Math.hypot(x[i] - x[j], y[i] - y[j]) > 430)) opts.push(i);
  }
  if (!opts.length && oc.length) opts.push(oc[0]);
  opts.forEach((c, k) => {
    const w = seaLang.word(nameRng, used), big = T.coastDist[c] * M.s > 90;
    bodies.push({ name: k === 0 ? "The " + w + " Ocean" : big ? w + " Ocean" : w + " Sea", kind: big ? "Ocean" : "Sea", x: x[c], y: y[c], fs: big ? 26 : 18, cells: 0 });
  });
  for (const i of ocean) {
    let b = 0, bd = Infinity;
    for (let k = 0; k < opts.length; k++) { const c = opts[k], d = (x[i] - x[c]) ** 2 + (y[i] - y[c]) ** 2; if (d < bd) { bd = d; b = k; } }
    waterName[i] = b;
  }
  for (const s of T.seas) {
    const ci = findCell(M, s.x, s.y); if (type[ci] !== 1) continue;
    const w = langAt(s.x, s.y).word(nameRng, used), idx = bodies.length;
    bodies.push({ name: nameRng.pick(["Sea of $", "$ Sea", "Gulf of $", "Bay of $"]).replace("$", w), kind: "Sea", x: s.x, y: s.y, fs: clamp(s.r * 0.22, 11, 20), cells: 0 });
    for (const i of ocean) if (Math.hypot(x[i] - s.x, y[i] - s.y) < s.r * 1.15) waterName[i] = idx;
  }
  for (const lk of T.lakes) {
    let sx = 0, sy = 0; for (const c of lk.cells) { sx += x[c]; sy += y[c]; }
    const cx = sx / lk.cells.length, cy = sy / lk.cells.length, w = langAt(cx, cy).word(nameRng, used), big = lk.cells.length * M.cellArea > 3500;
    const idx = bodies.length;
    bodies.push({ name: big ? w + " Sea" : "Lake " + w, kind: big ? "Inland sea" : "Lake", x: cx, y: cy, fs: big ? 13 : 8, cells: lk.cells.length, lake: 1 });
    for (const c of lk.cells) waterName[c] = idx;
  }

  // named rivers: trace each main stem upstream from its lowest unnamed point
  const riverId = new Int32Array(N).fill(-1), rivers = [];
  const rcells = landList.filter(i => river[i]).sort((a, b) => Cl.flux[b] - Cl.flux[a]);
  for (const c of rcells) {
    if (riverId[c] >= 0 || Cl.flux[c] < Cl.riverT * 2) continue;
    const id = rivers.length, w = langAt(x[c], y[c]).word(nameRng, used);
    rivers.push({ name: nameRng.chance(0.5) ? "The " + w : w + " River", len: 0 });
    let cur = c;
    while (cur >= 0 && river[cur] && riverId[cur] < 0) { riverId[cur] = id; rivers[id].len++; cur = Cl.bestUp[cur]; }
  }

  // mountain ranges: connected high ground
  const rangeId = new Int32Array(N).fill(-1), ranges = [], minRange = Math.max(5, Math.round(1500 / M.cellArea));
  for (const i of land) {
    if (e[i] <= 0.44 || rangeId[i] !== -1) continue;
    const cells = [i]; rangeId[i] = -2;
    for (let q = 0; q < cells.length; q++) { const c = cells[q]; for (let k = nStart[c]; k < nStart[c + 1]; k++) { const n = nbr[k]; if (type[n] === 0 && e[n] > 0.44 && rangeId[n] === -1) { rangeId[n] = -2; cells.push(n); } } }
    if (cells.length < minRange) { for (const c of cells) rangeId[c] = -3; continue; }
    const id = ranges.length; let sx = 0, sy = 0;
    for (const c of cells) { rangeId[c] = id; sx += x[c]; sy += y[c]; }
    const cx = sx / cells.length, cy = sy / cells.length, w = langAt(cx, cy).word(nameRng, used);
    let lc = cells[0], ld = Infinity; for (const c of cells) { const d = (x[c] - cx) ** 2 + (y[c] - cy) ** 2; if (d < ld) { ld = d; lc = c; } }
    ranges.push({ name: nameRng.pick(["The $ Mountains", "$ Range", "The $ Peaks", "Spine of $", "$ Mountains"]).replace("$", w), size: cells.length, cell: lc });
  }
  for (const i of land) if (rangeId[i] < 0) rangeId[i] = -1;

  // plateau names
  const platCells = T.plateaus.map(() => []);
  for (const i of land) if (T.plateau[i]) platCells[T.plateau[i] - 1].push(i);
  const plats = platCells.map(cells => {
    if (cells.length < 6) return null;
    let sx = 0, sy = 0; for (const c of cells) { sx += x[c]; sy += y[c]; }
    const cx = sx / cells.length, cy = sy / cells.length, w = langAt(cx, cy).word(nameRng, used);
    return { name: nameRng.pick(["$ Plateau", "The $ Highlands", "$ Tableland"]).replace("$", w), x: cx, y: cy, size: cells.length };
  });

  // province records
  const heart = heartCells(owner, innerDist(M, owner), np);
  const provs = [], nb = BIOMES.length;
  const adjSets = Array.from({ length: np }, () => new Set());
  for (let ed = 0; ed < M.E; ed++) {
    const a = M.eA[ed], b = M.eB[ed];
    if (type[a] === 0 && type[b] === 0 && owner[a] !== owner[b]) { adjSets[owner[a]].add(owner[b]); adjSets[owner[b]].add(owner[a]); }
  }
  const bc = new Int32Array(nb), tc = new Int32Array(5);
  for (let p = 0; p < np; p++) {
    const cells = provCells[p]; bc.fill(0); tc.fill(0);
    let se = 0, st = 0, sm = 0, sx = 0, sy = 0, coastal = false, coastBody = -1, lakeShore = -1;
    const rv = new Set(), rg = new Map(), pl = new Map();
    for (const c of cells) {
      se += e[c]; st += Cl.temp[c]; sm += Cl.moist[c]; sx += x[c]; sy += y[c];
      bc[Cl.biome[c]]++; tc[Cl.terr[c]]++;
      if (riverId[c] >= 0) rv.add(riverId[c]);
      if (rangeId[c] >= 0) rg.set(rangeId[c], (rg.get(rangeId[c]) || 0) + 1);
      if (T.plateau[c] && plats[T.plateau[c] - 1]) pl.set(T.plateau[c] - 1, (pl.get(T.plateau[c] - 1) || 0) + 1);
      for (let k = nStart[c]; k < nStart[c + 1]; k++) {
        const n = nbr[k];
        if (type[n] === 1) { coastal = true; if (coastBody < 0) coastBody = waterName[n]; }
        else if (type[n] === 2 && lakeShore < 0) lakeShore = waterName[n];
      }
    }
    let biome = 0; for (let b = 1; b < nb; b++) if (bc[b] > bc[biome]) biome = b;
    let terr = 0; for (let t = 1; t < 5; t++) if (tc[t] > tc[terr]) terr = t;
    const topOf = m => { let b = -1, bv = 0; for (const [k, v] of m) if (v > bv) { bv = v; b = k; } return b; };
    const n = cells.length, mass = masses[lm[cells[0]]];
    provs.push({
      id: p, cells, size: n, cx: sx / n, cy: sy / n, heart: heart[p] >= 0 ? heart[p] : cells[0], mass: mass.id,
      e: se / n, temp: st / n, moist: sm / n, biome, terr, coastal, coastBody, lakeShore,
      rivers: [...rv].sort((a, b) => rivers[b].len - rivers[a].len), range: topOf(rg), plateau: topOf(pl),
      name: mass.lang.word(nameRng, used), adj: [...adjSets[p]],
    });
  }
  return { owner, provs, masses, cellMass: lm, contCount: conts.length, langAt, waterName, bodies, riverId, rivers, rangeId, ranges, plats, land };
}
