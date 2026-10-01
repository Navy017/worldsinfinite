import { clamp, makeRng, shuffle } from "../core/util.js";
import { BIOMES, SPECIAL } from "../core/tables.js";
import { FLORA, FAUNA, ZONE_NAME_FORMS } from "../content/ecology.js";
import { MARINE, MARINE_FLORA, MARINE_FAUNA, SEA_MONSTERS } from "../content/wildlife.js";

// Ecological zones: provinces grouped into contiguous stretches of one biome on one landmass
// ("the Varr Taiga"), each with its own list of plants and animals drawn from the ecology content
// (content/ecology.js) plus whatever monsters, titans and strange forests live there. The prose
// description is assembled on demand from the same content, so this stage only stores ids.

const MAX_ZONE = 45, MIN_ZONE = 3;
// rough climate families, so a coastal species of the tropics does not turn up on a cold shore
const FAMILY = { glacier: 0, tundra: 0, peaks: 0, alpine: 1, boreal: 1, coldsteppe: 1, colddesert: 1, tempforest: 2, temprain: 2, grass: 2, swamp: 2,
  desert: 3, badlands: 3, savanna: 3, dryforest: 3, rainforest: 4, mangrove: 4 };
const sameClimate = (a, b) => Math.abs((FAMILY[a] ?? 2) - (FAMILY[b] ?? 2)) <= 1;

export function genEcology(G, P, seed) {
  const rng = makeRng(seed + "|ecology"), nameRng = makeRng(seed + "|ecologynames");
  const { R, F, M } = G, provs = R.provs, np = provs.length, kmPx = G.worldKm / 1600;
  const zoneOf = new Int32Array(np).fill(-1), groups = [];
  // grow zones of one biome on one landmass
  for (const p of shuffle(rng, provs.map(q => q.id))) {
    if (zoneOf[p] >= 0) continue;
    const id = groups.length, list = [p], b = provs[p].biome, m = provs[p].mass; zoneOf[p] = id;
    for (let h = 0; h < list.length && list.length < MAX_ZONE; h++) {
      for (const q of provs[list[h]].adj) if (zoneOf[q] < 0 && provs[q].biome === b && provs[q].mass === m && list.length < MAX_ZONE) { zoneOf[q] = id; list.push(q); }
    }
    groups.push(list);
  }
  // fold tiny zones into the neighbour they share the most border with
  for (let z = 0; z < groups.length; z++) {
    const list = groups[z]; if (list.length >= MIN_ZONE || !list.length) continue;
    const count = new Map();
    for (const p of list) for (const q of provs[p].adj) { const o = zoneOf[q]; if (o !== z && o >= 0 && groups[o].length && provs[q].mass === provs[p].mass) count.set(o, (count.get(o) || 0) + 1); }
    if (!count.size) continue;
    const to = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
    for (const p of list) { zoneOf[p] = to; groups[to].push(p); }
    groups[z] = [];
  }
  // renumber and describe
  const remap = new Int32Array(groups.length).fill(-1), zones = [];
  const pick = (pool, n, r) => {
    const out = [], cand = pool.slice();
    for (let k = 0; k < n && cand.length; k++) {
      let tot = 0; const ws = cand.map(e => { const w = (e.rare ? 0.3 : 1) * (e.magic ? P.magic / 100 * 1.4 + 0.05 : 1); tot += w; return w; });
      let x = r.f() * tot, i = 0; while (i < cand.length - 1 && (x -= ws[i]) > 0) i++;
      out.push(cand[i].id); cand.splice(i, 1);
    }
    return out;
  };
  groups.forEach((list, z) => {
    if (!list.length) return;
    const id = zones.length; remap[z] = id;
    const bc = new Map(); for (const p of list) bc.set(provs[p].biome, (bc.get(provs[p].biome) || 0) + provs[p].size);
    const biome = [...bc.entries()].sort((a, b) => b[1] - a[1])[0][0], bk = BIOMES[biome].k;
    let coast = 0, river = 0, size = 0, temp = 0, moist = 0, e = 0;
    for (const p of list) { const q = provs[p]; if (q.coastal) coast++; if (q.rivers.length) river++; size += q.size; temp += q.temp * q.size; moist += q.moist * q.size; e += q.e * q.size; }
    const r = makeRng(seed + "|zone|" + list[0]);
    const keys = new Set([bk]); if (coast / list.length > 0.3) keys.add("coast"); if (river / list.length > 0.3) keys.add("river");
    // shore and river species also named for particular biomes only live on those shores
    const PSEUDO = new Set(["coast", "river", "ocean"]);
    const fits = f => f.biomes.includes(bk) || (f.biomes.some(b => keys.has(b)) && (f.biomes.every(b => PSEUDO.has(b)) || f.biomes.some(b => !PSEUDO.has(b) && sameClimate(b, bk))));
    const fauna = FAUNA.filter(fits), flora = FLORA.filter(fits);
    const hostile = new Set(), titans = new Set(), special = new Set(), sites = [];
    for (const p of list) {
      if (F.hostile[p] >= 0) hostile.add(F.hostile[p]);
      if (F.titan[p] >= 0) titans.add(F.titans[F.titan[p]].name);
      if (F.special[p]) special.add(SPECIAL[F.special[p]].n);
      if (F.mystery[p] >= 0) sites.push(F.sites[F.mystery[p]].name);
    }
    const forms = ZONE_NAME_FORMS[bk] || ["The $ Wilds"], word = R.masses[provs[list[0]].mass].lang.word(nameRng, null);
    // a label spot: the zone's province nearest its middle
    let sx = 0, sy = 0; for (const p of list) { sx += provs[p].cx; sy += provs[p].cy; }
    sx /= list.length; sy /= list.length;
    let lab = list[0], bd = Infinity; for (const p of list) { const d = (provs[p].cx - sx) ** 2 + (provs[p].cy - sy) ** 2; if (d < bd) { bd = d; lab = p; } }
    zones.push({
      id, name: r.pick(forms).replace("$", word), biome, provs: list.length, area: Math.round(size * M.cellArea * kmPx * kmPx),
      temp: temp / size, moist: moist / size, e: e / size, coastal: coast / list.length, rivers: river / list.length,
      flora: pick(flora, 8, r), fauna: pick(fauna, 9, r), hostile: [...hostile].map(h => F.hostRegions[h].creature), titans: [...titans], special: [...special], sites: sites.slice(0, 5),
      label: provs[lab].heart, keys: [...keys],
    });
  });
  for (let p = 0; p < np; p++) zoneOf[p] = remap[zoneOf[p]];
  const marine = genMarine(G, P, seed, pick);
  addPremiseBeings(G, seed, zones, zoneOf, marine.zones);
  return { zones, zoneOf, marine };
}

// Marine zones: the open sea split by depth, warmth and distance from the coast into shelf, reef,
// kelp forest, lagoon, estuary, open ocean, abyss and polar sea; contiguous runs of one kind become
// named zones with their own species (content/wildlife.js). A few far-out zones are monster waters.
// the creatures of the world's premises join the zones they fit, far more often near the premise's
// own places: the realms whose themes come from it, its marked zones and its sites
const MARINE_KEYS = new Set(["shelf", "reef", "kelp", "lagoon", "estuary", "open", "abyss", "polar"]);
function addPremiseBeings(G, seed, zones, zoneOf, mzones) {
  if (!G.W || !G.W.extra.beings || !G.W.extra.beings.length) return;
  const rng = makeRng(seed + "|beings"), { R, S, L } = G, provs = R.provs;
  const near = new Map();  // province -> premises whose places are in or next to it
  const mark = (p, prem) => { for (const q of [p, ...provs[p].adj]) { if (!near.has(q)) near.set(q, new Set()); near.get(q).add(prem); } };
  if (L) {
    for (const z of L.zones) for (const p of z.provs) mark(p, z.prem);
    for (const s of L.sites) mark(s.prov, s.prem);
    for (const t of L.themes) for (const r of t.realms) for (const p of S.states[r].provs) { if (!near.has(p)) near.set(p, new Set()); near.get(p).add(t.prem); }
  }
  const inZone = zones.map(() => new Set()); provs.forEach(p => { if (zoneOf[p.id] >= 0) for (const x of near.get(p.id) || []) inZone[zoneOf[p.id]].add(x); });
  for (const b of G.W.extra.beings) {
    const sea = b.biomes.some(k => MARINE_KEYS.has(k));
    if (sea) { for (const z of mzones) if (b.biomes.includes(z.key) && rng.f() < 0.3) z.fauna.push(b.id); continue; }
    let placed = 0;
    zones.forEach((z, i) => {
      if (!b.biomes.includes(BIOMES[z.biome].k)) return;
      if (rng.f() < (inZone[i].has(b.prem) ? 0.85 : 0.18) / (1 + b.danger * 0.25)) { z.fauna.push(b.id); placed++; }
    });
    // every being lives somewhere: if no zone fit by chance, give it the best-fitting one
    if (!placed) { const fit = zones.filter(z => b.biomes.includes(BIOMES[z.biome].k)); if (fit.length) fit[Math.floor(rng.f() * fit.length)].fauna.push(b.id); }
  }
}

function genMarine(G, P, seed, pick) {
  const { M, T, C, R } = G, N = M.N, rng = makeRng(seed + "|marine"), nameRng = makeRng(seed + "|marinenames");
  const kindOf = new Int8Array(N).fill(-1), KEYS = ["shelf", "reef", "kelp", "lagoon", "estuary", "open", "abyss", "polar"], K = Object.fromEntries(KEYS.map((k, i) => [k, i]));
  for (let i = 0; i < N; i++) {
    if (T.type[i] !== 1) continue;
    const t = C.temp[i], dep = T.depth[i], cd = T.coastDist[i];
    let river = false, mangrove = false;
    if (cd <= 1) for (let k = M.nStart[i]; k < M.nStart[i + 1]; k++) { const n = M.nbr[k]; if (T.type[n] === 0) { if (C.river[n]) river = true; const bk = BIOMES[C.biome[n]].k; if (bk === "mangrove" || bk === "swamp") mangrove = true; } }
    kindOf[i] = t < -3 ? K.polar : river ? K.estuary : mangrove && t > 18 ? K.lagoon : t > 21 && dep < 0.12 && cd <= 3 ? K.reef : t < 13 && dep < 0.14 && cd <= 3 ? K.kelp : dep < 0.2 && cd <= 5 ? K.shelf : dep > 0.55 ? K.abyss : K.open;
  }
  // grow zones over contiguous cells of one kind
  const zoneOfCell = new Int32Array(N).fill(-1), groups = [];
  for (let i = 0; i < N; i++) {
    if (kindOf[i] < 0 || zoneOfCell[i] >= 0) continue;
    const id = groups.length, list = [i], cap = kindOf[i] === K.open || kindOf[i] === K.abyss ? 1400 : 500; zoneOfCell[i] = id;
    for (let h = 0; h < list.length && list.length < cap; h++) { const c = list[h]; for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) { const n = M.nbr[k]; if (kindOf[n] === kindOf[i] && zoneOfCell[n] < 0 && list.length < cap) { zoneOfCell[n] = id; list.push(n); } } }
    groups.push({ kind: kindOf[i], cells: list });
  }
  // fold scraps into a neighbouring zone
  for (let z = 0; z < groups.length; z++) {
    const g = groups[z]; if (g.cells.length >= 6) continue;
    let to = -1; for (const c of g.cells) { for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) { const o = zoneOfCell[M.nbr[k]]; if (o >= 0 && o !== z && groups[o].cells.length) { to = o; break; } } if (to >= 0) break; }
    if (to < 0) continue;
    for (const c of g.cells) { zoneOfCell[c] = to; groups[to].cells.push(c); }
    g.cells = [];
  }
  const remap = new Int32Array(groups.length).fill(-1), zones = [];
  const kmPx = G.worldKm / 1600;
  groups.forEach((g, z) => {
    if (!g.cells.length) return;
    const key = KEYS[g.kind], id = zones.length; remap[z] = id;
    let sx = 0, sy = 0, t = 0, dep = 0;
    for (const c of g.cells) { sx += M.x[c]; sy += M.y[c]; t += C.temp[c]; dep += T.depth[c]; }
    const n = g.cells.length, cx = sx / n, cy = sy / n;
    let lab = g.cells[0], bd = Infinity; for (const c of g.cells) { const d = (M.x[c] - cx) ** 2 + (M.y[c] - cy) ** 2; if (d < bd) { bd = d; lab = c; } }
    // named in the language of the nearest land
    let mass = 0, md = Infinity; for (const m of R.masses) { if (!m.lang) continue; const d = (m.cx - cx) ** 2 + (m.cy - cy) ** 2; if (d < md) { md = d; mass = m.id; } }
    const word = R.masses[mass].lang ? R.masses[mass].lang.word(nameRng, null) : "Grey", forms = (MARINE[key] && MARINE[key].forms) || ["The $ Waters"];
    const zr = makeRng(seed + "|mzone|" + g.cells[0]);
    zones.push({
      id, key, name: zr.pick(forms).replace("$", word), cells: n, area: Math.round(n * M.cellArea * kmPx * kmPx), temp: t / n, depth: dep / n, label: lab, cx, cy,
      flora: pick(MARINE_FLORA.filter(f => f.zones.includes(key)), 6, zr), fauna: pick(MARINE_FAUNA.filter(f => f.zones.includes(key)), 9, zr), monster: null,
    });
  });
  for (let i = 0; i < N; i++) if (zoneOfCell[i] >= 0) zoneOfCell[i] = remap[zoneOfCell[i]];
  // monster waters: some of the far and deep zones
  const deep = zones.filter(z => (z.key === "open" || z.key === "abyss" || z.key === "polar") && z.cells > 30);
  const nMon = Math.min(deep.length, Math.round(2 + (P.wildlife ?? 50) / 20));
  for (const z of shuffle(rng, deep.slice()).slice(0, nMon)) {
    const opts = SEA_MONSTERS.filter(m => m.zones.includes(z.key) && (!m.req || (m.req === "cold" ? z.temp < 8 : z.temp > 14)));
    if (opts.length) { const m = rng.pick(opts); z.monster = { id: m.id, n: m.n }; }
  }
  return { zones, zoneOfCell };
}
