import { clamp, makeRng, shuffle } from "../core/util.js";
import { BIOMES, SPECIAL, WILD, WILD_WEIGHT, MYST, titanKinds } from "../core/tables.js";
import { innerDist, heartCells } from "./mesh.js";

// Hostile wildlife, titan domains, strange forests, mystery sites and volcanoes.
export function genFeatures(G, P, seed) {
  const rng = makeRng(seed + "|wonders"), nameRng = makeRng(seed + "|wondernames");
  const { R, S, T, M } = G, provs = R.provs, np = provs.length, wl = P.wildlife / 100, mg = P.magic / 100;
  const langOf = p => R.masses[provs[p].mass].lang;
  const hostile = new Int32Array(np).fill(-1), titan = new Int32Array(np).fill(-1), special = new Uint8Array(np), mystery = new Int32Array(np).fill(-1);

  // random-frontier growth over the province graph
  const growRegion = (start, size, ok, mark) => {
    const reg = [start], inReg = new Set([start]); mark(start);
    const front = [...provs[start].adj];
    while (reg.length < size && front.length) {
      const j = rng.int(0, front.length - 1), q = front[j];
      front[j] = front[front.length - 1]; front.pop();
      if (inReg.has(q) || !ok(q)) continue;
      reg.push(q); inReg.add(q); mark(q);
      for (const r of provs[q].adj) front.push(r);
    }
    return reg;
  };

  // hostile wildlife: seeded by biome weight, danger tier scales with the slider
  const hostRegions = [];
  const nH = Math.round(np * wl / 40);
  // weighted pick by biome via a prefix sum; retry on provinces that are already hostile
  const cum = new Float64Array(np); let tot = 0;
  for (let p = 0; p < np; p++) { tot += WILD_WEIGHT[BIOMES[provs[p].biome].k] || 1; cum[p] = tot; }
  const pickWeighted = () => {
    const r = rng.f() * tot; let lo = 0, hi = np - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    return provs[lo];
  };
  for (let k = 0; k < nH; k++) {
    let s = null;
    for (let t = 0; t < 40 && !s; t++) { const c = pickWeighted(); if (hostile[c.id] < 0) s = c; }
    if (!s) break;
    const tierR = rng.f() + wl * 0.4, tier = tierR < 0.55 ? 1 : tierR < 0.95 ? 2 : 3;
    const id = hostRegions.length, bk = BIOMES[s.biome].k;
    const reg = growRegion(s.id, rng.int(2, 8), q => hostile[q] < 0, q => { hostile[q] = id; });
    hostRegions.push({ tier, creature: rng.pick(WILD[bk]), provs: reg });
  }

  // titan domains, placed in the most remote country (far from every capital)
  const titans = [];
  const nT = wl <= 0 ? 0 : clamp(Math.round(np / 320 * wl * 2), 1, 14);
  if (nT) {
    const hop = new Int32Array(np).fill(-1), q = [];
    for (const s of S.states) { hop[s.capital] = 0; q.push(s.capital); }
    for (let h = 0; h < q.length; h++) for (const r of provs[q[h]].adj) if (hop[r] < 0) { hop[r] = hop[q[h]] + 1; q.push(r); }
    const rem = p => hop[p] < 0 ? 999 : hop[p];
    const order = provs.map(p => p.id).sort((a, b) => rem(b) - rem(a));
    const top = order.slice(0, Math.max(nT * 3, Math.round(np * 0.3)));
    const seeds = [];
    for (let t = 0; t < 400 && seeds.length < nT; t++) {
      const c = rng.pick(top); if (titan[c] >= 0 || provs[c].size < 2) continue;
      if (seeds.some(s => Math.hypot(provs[s].cx - provs[c].cx, provs[s].cy - provs[c].cy) < 180)) continue;
      seeds.push(c);
      const id = titans.length, reg = [c]; titan[c] = id;
      const size = rng.int(8, 22);
      for (let h = 0; h < reg.length && reg.length < size; h++) {
        for (const r of shuffle(rng, provs[reg[h]].adj.slice())) { if (reg.length >= size) break; if (titan[r] < 0) { titan[r] = id; reg.push(r); } }
      }
      const kind = rng.pick(titanKinds(BIOMES[provs[c].biome].k));
      titans.push({ name: langOf(c).word(nameRng, null) + ", the " + kind, kind, provs: reg });
    }
  }

  // strange forests grow only through forest types they fit
  const nS = Math.round(np * mg / 120);
  for (let k = 0; k < nS; k++) {
    const t = rng.int(1, 4), fits = SPECIAL[t].fits;
    const cand = provs.filter(p => !special[p.id] && fits.includes(p.biome)); if (!cand.length) continue;
    growRegion(rng.pick(cand).id, rng.int(3, 12), q => !special[q] && fits.includes(provs[q].biome), q => { special[q] = t; });
  }

  // mystery sites, typed to fit their province
  const sites = [], nM = Math.round(np * mg / 22);
  for (let k = 0, tries = 0; k < nM && tries < nM * 5; tries++) {
    const p = provs[rng.int(0, np - 1)]; if (mystery[p.id] >= 0) continue;
    const m = rng.pick(MYST.filter(m => m.ok(p)));
    mystery[p.id] = sites.length;
    sites.push({ type: m.n, d: m.d, name: m.n + " of " + langOf(p.id).word(nameRng, null), prov: p.id, cell: p.heart });
    k++;
  }

  // volcanoes on the highest local peaks along plate collisions
  const volcanoes = [], nV = Math.round(np / 140) + 1, vc = [];
  for (const i of R.land) {
    if (T.mStr[i] < 0.3 || T.e[i] < 0.45) continue;
    let top = true; for (let k = M.nStart[i]; k < M.nStart[i + 1]; k++) if (T.e[M.nbr[k]] > T.e[i]) { top = false; break; }
    if (top) vc.push(i);
  }
  vc.sort((a, b) => T.e[b] - T.e[a]);
  const volcProv = new Int32Array(np).fill(-1);
  for (const i of vc) {
    if (volcanoes.length >= nV) break;
    if (volcanoes.some(v => Math.hypot(M.x[v.cell] - M.x[i], M.y[v.cell] - M.y[i]) < 70)) continue;
    const p = R.owner[i];
    volcProv[p] = volcanoes.length;
    volcanoes.push({ cell: i, prov: p, name: "Mount " + langOf(p).word(nameRng, null) });
  }

  // per-cell layers for drawing
  const N = M.N, cHost = new Uint8Array(N), cTitan = new Int32Array(N).fill(-1), cSpecial = new Uint8Array(N);
  for (const i of R.land) {
    const p = R.owner[i];
    if (hostile[p] >= 0) cHost[i] = hostRegions[hostile[p]].tier;
    cTitan[i] = titan[p]; cSpecial[i] = special[p];
  }
  const tHeart = heartCells(cTitan, innerDist(M, cTitan), titans.length);
  titans.forEach((t, k) => { t.heart = tHeart[k]; });
  return { hostile, hostRegions, titan, titans, special, mystery, sites, volcanoes, volcProv, cHost, cTitan, cSpecial };
}
