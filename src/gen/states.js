import { clamp, makeRng, weightedPick, Heap } from "../core/util.js";
import { B, GOV, REALM_COLORS, hexRgb } from "../core/tables.js";
import { innerDist, heartCells } from "./mesh.js";

// Realms: spread-out capitals expand over the province graph; rough terrain slows them down.
export function genStates(G, P, seed) {
  const rng = makeRng(seed + "|states"), nameRng = makeRng(seed + "|statenames");
  const { R, M } = G, provs = R.provs, np = provs.length;
  const S = Math.max(1, Math.min(P.states, Math.floor(np / 3) || 1));
  const avgSp = Math.sqrt(R.land.length * M.cellArea / Math.max(1, np));

  // sea links between nearby coastal provinces on different landmasses, so islands can join realms
  const seaAdj = Array.from({ length: np }, () => []);
  {
    const gs = avgSp * 3.2, grid = new Map(), key = (a, b) => a * 100000 + b;
    for (const p of provs) { if (!p.coastal) continue; const k = key(Math.floor(p.cx / gs), Math.floor(p.cy / gs)); let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(p.id); }
    for (const p of provs) {
      if (!p.coastal) continue;
      const gx = Math.floor(p.cx / gs), gy = Math.floor(p.cy / gs);
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const arr = grid.get(key(gx + a, gy + b)); if (!arr) continue;
        for (const q of arr) if (q !== p.id && provs[q].mass !== p.mass && Math.hypot(provs[q].cx - p.cx, provs[q].cy - p.cy) < gs) seaAdj[p.id].push(q);
      }
    }
  }

  // capitals: best-of-15 candidates by distance to existing capitals, avoiding ice
  // the forbidden land of a premise (if any) is never settled by a realm
  const forb = G.W && G.W.forbidden ? G.W.forbidden : new Uint8Array(np);
  const hab = []; for (let p = 0; p < np; p++) if (provs[p].biome !== B.glacier && !forb[p]) hab.push(p);
  const pool = hab.length ? hab : provs.map(p => p.id);
  const caps = [rng.pick(pool)], isCap = new Uint8Array(np); isCap[caps[0]] = 1;
  while (caps.length < Math.min(S, pool.length)) {
    let best = -1, bs = -1;
    for (let t = 0; t < 15; t++) {
      const c = rng.pick(pool); if (isCap[c]) continue;
      let md = Infinity; for (const k of caps) md = Math.min(md, (provs[c].cx - provs[k].cx) ** 2 + (provs[c].cy - provs[k].cy) ** 2);
      md = Math.sqrt(md) * rng.range(0.8, 1.2);
      if (md > bs) { bs = md; best = c; }
    }
    if (best < 0) break;
    caps.push(best); isCap[best] = 1;
  }
  const vigor = caps.map(() => rng.range(0.75, 1.35));
  const tcost = new Float32Array(np);
  for (let p = 0; p < np; p++) {
    const b = provs[p].biome;
    let c = b === B.glacier ? 8 : b === B.peaks ? 4 : b === B.alpine ? 2.5 : (b === B.desert || b === B.colddesert) ? 1.8 : b === B.swamp ? 1.6 : b === B.rainforest ? 1.5 : 1;
    if (provs[p].terr === 2) c *= 1.6; else if (provs[p].terr === 3) c *= 2.2;
    tcost[p] = c;
  }
  const own = new Int32Array(np).fill(-1), dist = new Float64Array(np).fill(Infinity), hp = new Heap();
  caps.forEach((c, s) => { own[c] = s; dist[c] = 0; hp.push(c, 0); });
  while (hp.size) {
    const c = hp.pop(), dc = hp.lk; if (dc > dist[c]) continue;
    const s = own[c], pc = provs[c];
    for (const q of pc.adj) {
      if (forb[q]) continue;
      const nd = dc + Math.hypot(provs[q].cx - pc.cx, provs[q].cy - pc.cy) * tcost[q] * vigor[s];
      if (nd < dist[q]) { dist[q] = nd; own[q] = s; hp.push(q, nd); }
    }
    for (const q of seaAdj[c]) {
      if (forb[q]) continue;
      const nd = dc + (Math.hypot(provs[q].cx - pc.cx, provs[q].cy - pc.cy) * 2.2 + avgSp * 2) * tcost[q] * vigor[s];
      if (nd < dist[q]) { dist[q] = nd; own[q] = s; hp.push(q, nd); }
    }
  }
  for (let p = 0; p < np; p++) {
    if (own[p] >= 0 || forb[p]) continue;
    let b = -1, bd = Infinity;
    for (let q = 0; q < np; q++) if (own[q] >= 0) { const d = (provs[q].cx - provs[p].cx) ** 2 + (provs[q].cy - provs[p].cy) ** 2; if (d < bd) { bd = d; b = q; } }
    own[p] = b >= 0 ? own[b] : 0;
  }
  for (let p = 0; p < np; p++) if (provs[p].biome === B.glacier && !isCap[p]) own[p] = -1;

  // realm records and names
  const states = caps.map((c, s) => ({ id: s, capital: c, provs: [], cells: 0 }));
  for (let p = 0; p < np; p++) if (own[p] >= 0) { states[own[p]].provs.push(p); states[own[p]].cells += provs[p].size; }
  const rank = states.slice().sort((a, b) => b.cells - a.cells);
  rank.forEach((s, k) => {
    const lang = R.masses[provs[s.capital].mass].lang, w = lang.word(nameRng, null);
    let form;
    if (k < Math.max(1, Math.round(states.length * 0.08))) form = nameRng.pick(["$ Empire", "Empire of $", "High Kingdom of $"]);
    else if (s.provs.length <= 3) form = nameRng.pick(["Free City of $", "Barony of $", "County of $", "Principality of $"]);
    else form = weightedPick(nameRng, GOV, g => g[1])[0];
    s.name = form.replace("$", w); s.short = w;
  });

  // colour realms so neighbours differ
  const sAdj = states.map(() => new Set());
  for (let p = 0; p < np; p++) { if (own[p] < 0) continue; for (const q of provs[p].adj) if (own[q] >= 0 && own[q] !== own[p]) sAdj[own[p]].add(own[q]); }
  const useCount = new Int32Array(REALM_COLORS.length), cidx = new Int32Array(states.length).fill(-1);
  const off = rng.int(0, REALM_COLORS.length - 1);
  for (const s of rank) {
    const bad = new Set([...sAdj[s.id]].map(t => cidx[t]));
    let best = -1;
    for (let j = 0; j < REALM_COLORS.length; j++) { const c = (j + off) % REALM_COLORS.length; if (bad.has(c)) continue; if (best < 0 || useCount[c] < useCount[best]) best = c; }
    if (best < 0) best = rng.int(0, REALM_COLORS.length - 1);
    cidx[s.id] = best; useCount[best]++;
    const rgb = hexRgb(REALM_COLORS[best]), j = rng.range(0.93, 1.06);
    s.rgb = rgb.map(v => clamp(v * j, 0, 255));
  }
  const cellState = new Int32Array(M.N).fill(-1);
  for (const i of R.land) cellState[i] = own[R.owner[i]];
  const heart = heartCells(cellState, innerDist(M, cellState), states.length);
  states.forEach(s => { s.heart = heart[s.id] >= 0 ? heart[s.id] : provs[s.capital].heart; });
  return { own, states, cellState };
}
