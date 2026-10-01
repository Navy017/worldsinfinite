import { clamp, makeRng, Heap, shuffle } from "../core/util.js";
import { W, BIOMES, B, hexRgb } from "../core/tables.js";
import { makeLanguage } from "../core/names.js";
import { pickSome, pickOne, test, byId } from "../core/rules.js";
import {
  CULTURE_TRAITS, HERITAGE, FAITH_TYPES, DOCTRINES, FESTIVALS, GOVERNMENTS, ORIGINS, IDEALS, RELATION_RULES, SEASON_MONTHS, ERA_FORMS,
} from "../content/society.js";

// Peoples and politics, layered on the map that already exists:
//   cultures  spread from cores over the province graph; mountains and seas slow them down
//   faiths    spread the same way but ignore realm borders, and bend around culture borders
//   realms    get an origin, a government and two ideals, each picked by rules that read the land,
//             the culture, the faith and each other (see content/society.js)
//   relations every pair of neighbouring realms gets an opinion with the reasons behind it
//   calendar  months, weeks, moons, the era and today's date
// Everything reads tags, so new content only has to say what it likes and what it cannot stand.

const wrapDx = dx => { dx = Math.abs(dx); return Math.min(dx, W - dx); };
export const PALETTE = ["#c8745a", "#6f9fc2", "#b9a24e", "#7fae7a", "#a67fb8", "#d69a5a", "#5fa7a0", "#c77f97", "#8e9a5a", "#9a8fd0", "#cf6f6f", "#5f8f6a",
  "#d4b36a", "#7a8fb0", "#b06a4a", "#6ab0c8", "#a0a060", "#c090c0", "#80a0a0", "#e0a080"];

// the tags a single province carries (land, and strange things in or next to it)
export function provinceTags(G, p) {
  const { R, F, X } = G, pr = R.provs[p], bk = BIOMES[pr.biome].k, t = new Set();
  // ley lines and rifts are the built-in cosmology: a premise that owns the power or the cosmos
  // replaces them, and the places themselves remain as neutral "node" and "breach" tags
  const dPow = !G.W || G.W.tags.includes("default:power"), dCos = !G.W || G.W.tags.includes("default:cosmos");
  if (pr.coastal) t.add("coastal");
  if (["grass", "coldsteppe", "savanna"].includes(bk)) t.add("steppe");
  if (bk === "savanna") t.add("savanna");
  if (["desert", "colddesert", "badlands"].includes(bk)) t.add("desert");
  if (bk === "badlands") t.add("badlands");
  if (bk === "grass") t.add("grass");
  if (["rainforest", "mangrove", "dryforest"].includes(bk)) t.add("jungle");
  else if (BIOMES[pr.biome].forest) t.add("forest");
  if (bk === "boreal") t.add("boreal");
  if (["swamp", "mangrove"].includes(bk)) t.add("marsh");
  if (["tundra", "glacier", "boreal", "coldsteppe", "peaks"].includes(bk) || pr.temp < 3) t.add("cold");
  if (pr.temp > 22) t.add("hot");
  if (pr.temp > 13 && pr.temp < 26) t.add("warm");
  if (pr.terr >= 2) t.add("mountain"); else if (pr.terr === 1 || pr.terr === 4) t.add("hills");
  if (pr.rivers.length) t.add("river");
  if ((pr.rivers.length || bk === "grass") && pr.terr <= 1) t.add("farmland");
  if (!R.masses[pr.mass].continent) t.add("island");
  const here = q => {
    const o = [];
    if (F.titan[q] >= 0) o.push("titan");
    if (F.hostile[q] >= 0) o.push("beasts");
    if (F.volcProv[q] >= 0) o.push("volcano");
    if (F.mystery[q] >= 0) {
      o.push("mystery");
      const ty = F.sites[F.mystery[q]].type;
      if (ty === "Planar Rift") { o.push("breach"); if (dCos) o.push("rift"); } else if (ty === "Ley Nexus") { o.push("node"); if (dPow) o.push("ley"); } else if (ty === "Ancient Ruins") o.push("ruins");
      else if (ty === "Meteor Crater") o.push("crater");
    }
    if (F.special[q] === 2) o.push("fungal"); else if (F.special[q] === 3) o.push("crystal");
    return o;
  };
  for (const h of here(p)) { t.add("here:" + h); t.add("near:" + h); }
  for (const q of pr.adj) for (const h of here(q)) t.add("near:" + h);
  if (X) { const s = X.settlements[X.mainOf[p]]; if (s.tier >= 3) t.add("has:city"); if (s.port && s.tier >= 1) t.add("has:port"); }
  return t;
}

// a region's tags: a land tag if enough of it has that land, "near:" tags if any of it is near
function regionTags(G, provList, ptags, P) {
  const cnt = new Map(), n = provList.length, out = new Set();
  for (const p of provList) for (const t of ptags[p]) cnt.set(t, (cnt.get(t) || 0) + 1);
  const share = { coastal: 0.3, steppe: 0.3, desert: 0.3, forest: 0.35, jungle: 0.3, mountain: 0.22, hills: 0.3, river: 0.35, cold: 0.4, hot: 0.4, warm: 0.4, marsh: 0.2, island: 0.5, farmland: 0.3, savanna: 0.3, grass: 0.3, boreal: 0.3, badlands: 0.3 };
  for (const [t, c] of cnt) {
    if (t.startsWith("near:") || t.startsWith("has:")) out.add(t);
    else if (share[t] != null && c / n >= share[t]) out.add(t);
  }
  if (P.magic >= 60) out.add("magic:high"); else if (P.magic <= 25) out.add("magic:low");
  if (P.wildlife >= 60) out.add("wild:high");
  // the world's premises: every people, faith and realm lives under them, whether they know it or not
  if (G.W) for (const t of G.W.tags) out.add(t);
  return out;
}

// sea links between nearby coastal provinces on different landmasses
export function seaLinks(G) {
  const { R, M } = G, provs = R.provs, np = provs.length, out = Array.from({ length: np }, () => []);
  const avgSp = Math.sqrt(R.land.length * M.cellArea / Math.max(1, np)), gs = avgSp * 3.2, grid = new Map(), key = (a, b) => a * 100000 + b;
  for (const p of provs) { if (!p.coastal) continue; const k = key(Math.floor(p.cx / gs), Math.floor(p.cy / gs)); let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(p.id); }
  for (const p of provs) {
    if (!p.coastal) continue;
    const gx = Math.floor(p.cx / gs), gy = Math.floor(p.cy / gs);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      const arr = grid.get(key(gx + a, gy + b)); if (!arr) continue;
      for (const q of arr) if (q !== p.id && provs[q].mass !== p.mass && Math.hypot(provs[q].cx - p.cx, provs[q].cy - p.cy) < gs) out[p.id].push(q);
    }
  }
  return out;
}

// spread labels from seeds over the province graph; cost(p, q, label) per step
function spread(G, seeds, cost, sea) {
  const provs = G.R.provs, np = provs.length, lab = new Int32Array(np).fill(-1), dist = new Float64Array(np).fill(Infinity), hp = new Heap();
  seeds.forEach((s, k) => { lab[s] = k; dist[s] = 0; hp.push(s, 0); });
  while (hp.size) {
    const c = hp.pop(), dc = hp.lk; if (dc > dist[c]) continue;
    const pc = provs[c];
    const step = (q, extra) => {
      const nd = dc + (Math.hypot(wrapDx(provs[q].cx - pc.cx), provs[q].cy - pc.cy) * extra) * cost(c, q, lab[c]);
      if (nd < dist[q]) { dist[q] = nd; lab[q] = lab[c]; hp.push(q, nd); }
    };
    for (const q of pc.adj) step(q, 1);
    for (const q of sea[c]) step(q, 3.5);
  }
  for (let p = 0; p < np; p++) if (lab[p] < 0) lab[p] = 0;
  return lab;
}
function spreadSeeds(rng, G, n, preset = []) {
  const provs = G.R.provs, pool = provs.filter(p => p.biome !== B.glacier).map(p => p.id), seeds = [...new Set(preset)].slice(0, n), taken = new Set(seeds);
  if (!pool.length) pool.push(0);
  if (!seeds.length) { seeds.push(rng.pick(pool)); taken.add(seeds[0]); }
  while (seeds.length < n && seeds.length < pool.length) {
    let best = -1, bs = -1;
    for (let t = 0; t < 12; t++) {
      const c = rng.pick(pool); if (taken.has(c)) continue;
      let md = Infinity; for (const k of seeds) md = Math.min(md, wrapDx(provs[c].cx - provs[k].cx) ** 2 + (provs[c].cy - provs[k].cy) ** 2);
      md = Math.sqrt(md) * rng.range(0.75, 1.25);
      if (md > bs) { bs = md; best = c; }
    }
    if (best < 0) break;
    seeds.push(best); taken.add(best);
  }
  return seeds;
}
// colour regions so that neighbours differ
function colourRegions(rng, n, adjOf, palette) {
  const idx = new Int32Array(n).fill(-1), use = new Int32Array(palette.length), off = rng.int(0, palette.length - 1);
  for (let r = 0; r < n; r++) {
    const bad = new Set([...adjOf(r)].map(q => idx[q]));
    let best = -1;
    for (let j = 0; j < palette.length; j++) { const c = (j + off) % palette.length; if (bad.has(c)) continue; if (best < 0 || use[c] < use[best]) best = c; }
    if (best < 0) best = rng.int(0, palette.length - 1);
    idx[r] = best; use[best]++;
  }
  return [...idx].map(i => hexRgb(palette[i]).map(v => clamp(v * rng.range(0.92, 1.08), 0, 255)));
}
const adjective = (rng, w) => /[aeiouy]$/.test(w) ? w + "n" : /[sx]$/.test(w) ? w + "i" : w + rng.pick(["ish", "ian", "i", "ese", "ic", "an"]);
const FEMALE = { King: "Queen", Emperor: "Empress", "High Priest": "High Priestess", Khagan: "Khatun", "Lord Protector": "Lady Protector", "Lord Marshal": "Lady Marshal", "Elected King": "Elected Queen", Beastlord: "Beastmistress" };
const EPITHETS = ["the Bold", "the Wise", "the Young", "the Old", "the Pious", "the Cruel", "the Just", "the Fair", "the Unready", "the Great", "the Lame", "the Silent", "the Builder", "the Red", "Ironhand", "the Magnificent", "the Stern", "the Mad"];

export function genSociety(G, P, seed) {
  const rng = makeRng(seed + "|society"), nameRng = makeRng(seed + "|societynames");
  const { R, S, F, X } = G, provs = R.provs, np = provs.length;
  const sea = seaLinks(G);
  const ptags = provs.map(p => provinceTags(G, p.id));
  const langOf = p => R.masses[provs[p].mass].lang;

  /* ---- cultures ---- */
  const nC = clamp(Math.round(S.states.length * 0.6 + 3), 3, 80);
  const bigCaps = S.states.slice().sort((a, b) => b.provs.length - a.provs.length).slice(0, Math.ceil(nC / 2)).map(s => s.capital);
  const cSeeds = spreadSeeds(rng, G, nC, bigCaps);
  const cw = cSeeds.map(() => rng.range(0.8, 1.25));
  const terrCost = q => { const t = provs[q].terr; return t === 3 ? 3 : t === 2 ? 2.2 : t === 1 ? 1.2 : 1; };
  const cultureOf = spread(G, cSeeds, (p, q, l) => terrCost(q) * cw[l], sea);
  const cProvs = cSeeds.map(() => []); for (let p = 0; p < np; p++) cProvs[cultureOf[p]].push(p);
  const usedNames = new Set();
  const cultures = cSeeds.map((s, k) => {
    // each culture speaks its own dialect of its continent's language
    const lang = makeLanguage(makeRng(seed + "|culturelang" + k));
    const tries = [0, 1, 2].map(() => langOf(s).word(nameRng, null)).sort((a, b) => a.length - b.length);
    const name = tries.find(w => !usedNames.has(w)) || tries[0]; usedNames.add(name);
    const ctx = regionTags(G, cProvs[k], ptags, P);
    // one heritage trait from the land if the land suggests one, then values
    const heritage = pickSome(rng, CULTURE_TRAITS.filter(t => HERITAGE.has(t.id)), ctx, 1);
    for (const h of heritage) ctx.add(h.id);
    const values = pickSome(rng, CULTURE_TRAITS.filter(t => !HERITAGE.has(t.id) && !heritage.includes(t)), ctx, heritage.length ? 2 : 3);
    const traits = [...heritage, ...values];
    for (const t of traits) ctx.add(t.id);
    return { id: k, name, adj: adjective(nameRng, name), seed: s, traits: traits.map(t => t.id), provs: cProvs[k].length, tags: [...ctx], lang };
  });
  const cAdj = cultures.map(() => new Set());
  for (let p = 0; p < np; p++) for (const q of provs[p].adj) if (cultureOf[q] !== cultureOf[p]) cAdj[cultureOf[p]].add(cultureOf[q]);
  colourRegions(rng, cultures.length, r => cAdj[r], PALETTE).forEach((c, k) => { cultures[k].rgb = c; });

  /* ---- faiths ---- */
  const nF = clamp(Math.round(nC * 0.45) + 1, 2, 36);
  const fSeeds = spreadSeeds(rng, G, nF, shuffle(rng, cSeeds.slice()).slice(0, Math.ceil(nF * 0.7)));
  const fw = fSeeds.map(() => rng.range(0.6, 1.6));
  const faithOf = spread(G, fSeeds, (p, q, l) => terrCost(q) * fw[l] * (cultureOf[p] !== cultureOf[q] ? 1.7 : 1), sea);
  const fProvs = fSeeds.map(() => []); for (let p = 0; p < np; p++) fProvs[faithOf[p]].push(p);
  const faiths = fSeeds.map((s, k) => {
    const cu = cultures[cultureOf[s]], ctx = regionTags(G, fProvs[k].length ? fProvs[k] : [s], ptags, P);
    for (const t of cu.traits) ctx.add(t);
    const type = pickOne(rng, FAITH_TYPES, ctx, FAITH_TYPES[0]);
    for (const t of type.tags) ctx.add(t);
    const doctrines = pickSome(rng, DOCTRINES, ctx, rng.int(2, 3));
    const deity = cu.lang.word(nameRng, null);
    let name = rng.pick(type.names);
    if (type.id === "titan") {
      // the cult is named after the nearest titan
      let best = null, bd = Infinity;
      for (const t of F.titans) for (const q of t.provs) { const d = wrapDx(provs[q].cx - provs[s].cx) ** 2 + (provs[q].cy - provs[s].cy) ** 2; if (d < bd) { bd = d; best = t; } }
      name = name.replace("$", best ? best.name.split(",")[0] : deity);
    }
    name = name.replace("$", deity).replace("$", cu.lang.word(nameRng, null));
    // the holy site: a mystery site of the faith's lands if it has one, else the seed's main town
    const sites = fProvs[k].filter(p => F.mystery[p] >= 0);
    const holy = sites.length ? { prov: sites[0], name: F.sites[F.mystery[sites[0]]].name } : { prov: s, name: X.settlements[X.mainOf[s]].name };
    return { id: k, name, type: type.id, typeName: type.n, typeD: type.d, deity, doctrines: doctrines.map(d => d.id), holy, provs: fProvs[k].length, seedCulture: cu.id, festivals: [] };
  });
  const fAdj = faiths.map(() => new Set());
  for (let p = 0; p < np; p++) for (const q of provs[p].adj) if (faithOf[q] !== faithOf[p]) fAdj[faithOf[p]].add(faithOf[q]);
  colourRegions(rng, faiths.length, r => fAdj[r], ["#d9c36a", "#8fb8de", "#c98a8a", "#9fc79a", "#b39ad6", "#e0a86a", "#7fc2c0", "#d69ac0", "#b0b0b0", "#a8906a", "#6a8fc0", "#c0c070"])
    .forEach((c, k) => { faiths[k].rgb = c; });

  /* ---- calendar ---- */
  const biggest = S.states.slice().sort((a, b) => b.provs.length - a.provs.length)[0];
  const calCulture = cultures[cultureOf[biggest ? biggest.capital : 0]];
  const calendar = makeCalendar(rng, nameRng, calCulture, biggest);
  // festivals land on real dates
  for (const f of faiths) {
    const n = rng.int(2, 3);
    for (let i = 0; i < n; i++) {
      const m = rng.int(0, calendar.months.length - 1);
      f.festivals.push({ name: rng.pick(FESTIVALS).replace("$", rng.chance(0.5) ? f.deity : cultures[f.seedCulture].lang.word(nameRng, null)), month: m, day: rng.int(1, calendar.months[m].days) });
    }
  }

  /* ---- fallen empires, for successor states ---- */
  const nFallen = rng.int(1, 3), fallen = [];
  for (let k = 0; k < nFallen; k++) {
    const p = provs[rng.int(0, np - 1)], w = langOf(p.id).word(nameRng, usedNames);
    fallen.push({ name: rng.pick(["Old $ Empire", "Empire of $", "$ Imperium", "High Kingdom of $"]).replace("$", w), short: w, x: p.cx, y: p.cy, fell: rng.int(90, 700) });
  }

  /* ---- realms ---- */
  const nearAny = (list, test) => list.some(p => test(p) || provs[p].adj.some(test));
  const realms = S.states.map(s => {
    const cCount = new Map(); for (const p of s.provs) cCount.set(cultureOf[p], (cCount.get(cultureOf[p]) || 0) + provs[p].size);
    const cs = [...cCount.entries()].sort((a, b) => b[1] - a[1]), tot = cs.reduce((a, b) => a + b[1], 0) || 1;
    const culture = cs.length ? cs[0][0] : cultureOf[s.capital], faith = faithOf[s.capital];
    const ctx = regionTags(G, s.provs, ptags, P);
    for (const t of cultures[culture].traits) ctx.add(t);
    ctx.add("faith:" + faiths[faith].type);
    for (const t of FAITH_TYPES.find(f => f.id === faiths[faith].type).tags) ctx.add(t);
    for (const d of faiths[faith].doctrines) ctx.add(d);
    const n = s.provs.length;
    ctx.add(n <= 3 ? "realm:tiny" : n <= 10 ? "realm:small" : n >= Math.max(60, np * 0.06) ? "realm:vast" : n >= 30 ? "realm:large" : "realm:mid");
    if (nearAny(s.provs, q => F.titan[q] >= 0 || F.hostRegions[F.hostile[q]]?.tier >= 2 || S.own[q] < 0)) ctx.add("frontier");
    const origin = pickOne(rng, ORIGINS, ctx, ORIGINS[0]); for (const t of origin.tags) ctx.add(t);
    const gov = pickOne(rng, GOVERNMENTS, ctx, GOVERNMENTS[0]); for (const t of gov.tags) ctx.add(t);
    const ideals = pickSome(rng, IDEALS, ctx, 2); for (const i of ideals) for (const t of i.tags) ctx.add(t);
    // nearest fallen empire, for successor states
    let fi = 0, fd = Infinity; fallen.forEach((f, k) => { const d = wrapDx(f.x - provs[s.capital].cx) ** 2 + (f.y - provs[s.capital].cy) ** 2; if (d < fd) { fd = d; fi = k; } });
    const female = rng.chance(0.4), title = female ? (FEMALE[gov.ruler] || gov.ruler) : gov.ruler;
    const ruler = `${title} ${cultures[culture].lang.word(nameRng, null)} ${rng.chance(0.55) ? rng.pick(EPITHETS) : ["I", "II", "III", "IV", "V", "VI", "IX"][rng.int(0, 6)]}`;
    const founded = calendar.year - (origin.id === "old_dynasty" ? rng.int(250, 900) : origin.id === "rebellion" ? rng.int(8, 60) : rng.int(40, 400));
    s.name = rng.pick(gov.forms).replace("$", s.short);
    return {
      id: s.id, culture, faith, origin: origin.id, gov: gov.id, ideals: ideals.map(i => i.id), fallen: fi, ruler, founded,
      minorities: cs.slice(1, 4).map(([c, v]) => ({ culture: c, share: v / tot })).filter(m => m.share > 0.05),
      originText: origin.d.replace("$F", fallen[fi].name), tags: [...ctx],
    };
  });

  /* ---- relations between neighbouring realms ---- */
  const rAdj = new Map(), key = (a, b) => a < b ? a * 100000 + b : b * 100000 + a;
  for (let p = 0; p < np; p++) {
    const a = S.own[p]; if (a < 0) continue;
    for (const q of provs[p].adj) { const b = S.own[q]; if (b >= 0 && b !== a) { const k = key(a, b); rAdj.set(k, (rAdj.get(k) || 0) + 1); } }
    for (const q of sea[p]) { const b = S.own[q]; if (b >= 0 && b !== a) { const k = key(a, b); if (!rAdj.has(k)) rAdj.set(k, 0); } }
  }
  const tagSets = realms.map(r => new Set(r.tags));
  const relations = [];
  for (const [k, border] of rAdj) {
    const a = Math.floor(k / 100000), b = k % 100000, A = realms[a], Bm = realms[b], why = [];
    let op = 0;
    for (const rule of RELATION_RULES) {
      const sameOk = !rule.same || (rule.same === "culture" ? A.culture === Bm.culture : A.faith === Bm.faith);
      const differOk = !rule.differ || (rule.differ === "faith" ? A.faith !== Bm.faith : A.culture !== Bm.culture);
      if (!sameOk || !differOk) continue;
      if (rule.sameF && A.fallen !== Bm.fallen) continue;
      const one = (x, y) => test(rule.a, tagSets[x]) && test(rule.b, tagSets[y]);
      const symmetric = !rule.a && !rule.b || rule.a === rule.b;
      const hits = symmetric ? (one(a, b) ? 1 : 0) : (one(a, b) ? 1 : 0) + (one(b, a) ? 1 : 0);
      if (hits) { op += rule.d * hits; why.push([rule.why, rule.d * hits]); }
    }
    if (border > 10) { const d = Math.min(10, Math.round(border / 3)); op -= d; why.push(["Long shared border", -d]); }
    const mood = Math.round(rng.range(-18, 18)); op += mood; if (Math.abs(mood) >= 8) why.push([mood > 0 ? "Recent good will" : "Recent incidents", mood]);
    op = clamp(Math.round(op), -100, 100);
    const status = op >= 35 && rng.chance(0.6) ? "alliance" : op >= 15 ? "friendly" : op <= -45 ? "rival" : op <= -15 ? "tense" : "neutral";
    relations.push({ a, b, op, status, why: why.sort((x, y) => Math.abs(y[1]) - Math.abs(x[1])).slice(0, 4), border });
  }

  return { cultures, faiths, cultureOf, faithOf, realms, relations, calendar, fallen, ptags: ptags.map(t => [...t]), sea };
}

/* ---- calendar ---- */
function makeCalendar(rng, nameRng, culture, realm) {
  const yearDays = rng.int(300, 420), nMonths = rng.int(10, 14), base = Math.floor(yearDays / nMonths), extra = yearDays - base * nMonths;
  const native = rng.chance(0.5), lang = culture.lang, seasons = ["winter", "spring", "summer", "autumn"];
  const used = new Set(), months = [];
  for (let m = 0; m < nMonths; m++) {
    const season = seasons[Math.floor(((m + 0.5) / nMonths) * 4 + 3.5) % 4]; // month 0 is midwinter
    let name;
    if (native) name = lang.word(nameRng, used);
    else { const pool = SEASON_MONTHS[season].filter(n => !used.has(n)); name = pool.length ? rng.pick(pool) : lang.word(nameRng, used); used.add(name); }
    months.push({ name, days: base + (m < extra ? 1 : 0), season });
  }
  const weekLen = rng.int(5, 10), weekdays = [];
  for (let d = 0; d < weekLen; d++) weekdays.push(lang.word(nameRng, used) + (rng.chance(0.3) ? "day" : ""));
  const nMoons = rng.chance(0.6) ? 1 : rng.chance(0.7) ? 2 : 3, moons = [];
  for (let k = 0; k < nMoons; k++) moons.push({ name: lang.word(nameRng, null), period: Math.round(rng.range(18, 45) * 10) / 10, phase: rng.f(), color: rng.pick(["#f2eed8", "#e8d0a0", "#d8e4f0", "#f0c8b0", "#c8d8c0"]) });
  const eraWord = realm ? realm.short : lang.word(nameRng, null);
  const era = rng.pick(ERA_FORMS).replace("$", eraWord), eraShort = era.split(" ").filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join("").slice(0, 3) || "AE";
  const year = rng.int(300, 1800), day = rng.int(0, yearDays - 1);
  return { yearDays, months, weekdays, moons, era, eraShort, year, startDay: day, tilt: Math.round(rng.range(12, 32)), hour: 8 };
}
