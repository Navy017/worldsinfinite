import { makeRng, weightedPick } from "../core/util.js";
import { W as WORLD_W, B } from "../core/tables.js";
import { weight } from "../core/rules.js";
import { fill, setPowerWords } from "../core/text.js";
import { PREMISES } from "../content/premises/index.js";
import { PREMISE } from "../content/premises/register.js";

// World premises: the one or two hidden truths a world is built on (see docs/world-premises.md).
//
//   genPremise  (before realms) rolls the premises and their truths, and claims the forbidden land
//               if a premise has one, so no realm is drawn there.
//   genLore     (after society) puts the premise into the world: regional themes on realms, marked
//               zones, dig sites with layered secrets, a great wall, and lore fragments scattered
//               through libraries, temples, ruins, villages, ports and people, so the truth has to
//               be pieced together from biased, partial and contradictory sources.

const EXCLUSIVE = new Set(["power-source", "cosmology", "world-shape", "world-edge", "afterlife", "divine-order", "mind-substrate", "ai-threat"]);
// presets that read as pre-modern worlds; sci-fi premises only appear in them as a hidden past (bridge)
const PREMODERN = new Set(["fantasy", "mythic", "grimdark", "shonen"]);
const wrapDx = dx => { dx = Math.abs(dx); return Math.min(dx, WORLD_W - dx); };

function eligible(p, genre, magic = 50) {
  // the "mysteries and strange lands" setting: low makes power systems rarer, high makes them likelier
  const m = p.family === "power" ? 0.35 + magic / 70 : 1;
  if ((p.genres || []).includes(genre)) return m;
  if (p.family === "scifi" && p.bridge && PREMODERN.has(genre)) return 0.45 * m;
  return 0;
}
function clash(a, b) {
  if (a.id === b.id) return true;
  if ((a.excludes || []).includes(b.id) || (b.excludes || []).includes(a.id)) return true;
  return a.slots.some(s => EXCLUSIVE.has(s) && b.slots.includes(s));
}
const pairW = (a, b) => {
  let m = 1;
  for (const x of a.pairs || []) if (x.id === b.id) m *= x.w;
  for (const x of b.pairs || []) if (x.id === a.id) m *= x.w;
  return m;
};

// P.premise: "" or "random" for a rolled world, "none" for no premise, or premise ids joined by "+"
export function genPremise(G, P, seed) {
  const rng = makeRng(seed + "|premise"), genre = P.genre || "fantasy";
  const { R } = G, provs = R.provs, np = provs.length;
  let list = [];
  const want = (P.premise || "").trim();
  if (want && want !== "random") {
    if (want !== "none") for (const id of want.split("+")) { const p = PREMISE[id.trim()]; if (p && !list.some(q => clash(p, q))) list.push(p); }
  } else {
    const pool = PREMISES.filter(p => eligible(p, genre, P.magic) > 0);
    const first = weightedPick(rng, pool, p => (p.w ?? 1) * eligible(p, genre, P.magic));
    if (first) {
      list.push(first);
      // a second premise most of the time, favouring good pairs and a different family
      if (rng.chance(0.65)) {
        const second = weightedPick(rng, pool.filter(p => !clash(p, first)), p => {
          let w = (p.w ?? 1) * eligible(p, genre, P.magic) * pairW(first, p);
          if (p.family !== first.family) w *= 1.4;
          if (!(p.tone || []).some(t => (first.tone || []).includes(t))) w *= 0.6;
          return w;
        });
        if (second) list.push(second);
      }
    }
  }
  const picks = list.map((p, k) => ({ id: p.id, truth: rng.pick(p.truths).id, role: k === 0 ? "core" : "second" }));
  const tags = new Set();
  for (const pk of picks) {
    const p = PREMISE[pk.id];
    tags.add("premise:" + p.id);
    for (const t of p.tags || []) tags.add(t);
    for (const t of p.truths.find(t => t.id === pk.truth).tags || []) tags.add(t);
    for (const s of p.slots) tags.add("slot:" + s);
    for (const t of p.tone || []) tags.add("tone:" + t);
  }
  // the built-in cosmology (ley lines as the power, rifts into the void) holds wherever no premise
  // claims that slot; content written for it is gated on these
  const slots = new Set(picks.flatMap(pk => PREMISE[pk.id].slots));
  if (!slots.has("power-source")) tags.add("default:power");
  if (!slots.has("cosmology")) tags.add("default:cosmos");
  tags.add("genre:" + genre);
  setPowerWords(powerWords(picks));

  // the forbidden land: the most remote sizeable landmass, or the far end of a lone continent
  let forbidden = null, forbiddenMark = null;
  for (const pk of picks) { const m = (PREMISE[pk.id].mapMarks || []).find(m => m.kind === "forbidden"); if (m) { forbiddenMark = { ...m, prem: pk.id }; break; } }
  if (forbiddenMark && np > 30) {
    forbidden = new Uint8Array(np);
    const count = new Map(); for (const p of provs) count.set(p.mass, (count.get(p.mass) || 0) + 1);
    const masses = [...count.entries()].sort((a, b) => b[1] - a[1]);
    const cen = m => { let x = 0, y = 0, n = 0; for (const p of provs) if (p.mass === m) { x += p.cx; y += p.cy; n++; } return [x / n, y / n]; };
    const main = cen(masses[0][0]);
    const cands = masses.slice(1).filter(([, n]) => n >= Math.max(6, np * 0.05) && n <= np * 0.25);
    if (cands.length) {
      let best = null, bd = -1;
      for (const [m] of cands) { const c = cen(m), d = Math.hypot(wrapDx(c[0] - main[0]), c[1] - main[1]) * rng.range(0.85, 1.15); if (d > bd) { bd = d; best = m; } }
      for (const p of provs) if (p.mass === best) forbidden[p.id] = 1;
    } else {
      // one landmass: wall off its far end, grown from the province farthest from its middle
      const m = masses[0][0], mine = provs.filter(p => p.mass === m);
      let far = mine[0], fd = -1; for (const p of mine) { const d = Math.hypot(wrapDx(p.cx - main[0]), p.cy - main[1]); if (d > fd) { fd = d; far = p; } }
      const target = Math.round(mine.length * rng.range(0.14, 0.22)), q = [far.id]; forbidden[far.id] = 1;
      for (let h = 0; h < q.length && q.length < target; h++) for (const r of provs[q[h]].adj) if (!forbidden[r] && provs[r].mass === m && q.length < target) { forbidden[r] = 1; q.push(r); }
    }
    let n = 0; for (let p = 0; p < np; p++) n += forbidden[p];
    if (n < 3 || n > np * 0.4) { forbidden = null; forbiddenMark = null; }
  }

  // the inventions, troops, governments and faiths these premises add, for the page's lookups
  const extra = { govs: [], faiths: [], units: [], techs: [], beings: [] };
  for (const pk of picks) {
    const p = PREMISE[pk.id];
    for (const g of p.govs || []) extra.govs.push({ id: g.id, n: g.n, d: g.d, tags: g.tags, forms: g.forms, ruler: g.ruler, prem: p.id });
    for (const f of p.faiths || []) extra.faiths.push({ id: f.id, n: f.n, d: f.d, tags: f.tags, names: f.names, prem: p.id });
    for (const u of p.units || []) extra.units.push({ ...u, mods: undefined, req: undefined, prem: p.id });
    for (const b of p.beings || []) extra.beings.push({ id: b.id, n: b.n, kind: b.kind, d: b.d, danger: b.danger ?? 1, biomes: b.biomes || [], zones: (b.biomes || []), magic: true, rare: true, look: b.look, prem: p.id });
    for (const t of p.techs || []) extra.techs.push({ id: t.id, n: t.n, field: t.field, level: t.level, d: t.d, req: "premise:" + p.id, prem: p.id });
  }
  const storyIds = picks.flatMap(pk => (PREMISE[pk.id].storylines || []).map(s => s.id));
  return { genre, picks, ids: picks.map(p => p.id), tags: [...tags], forbidden, forbiddenMark, extra, storyIds };
}

// the words generic text uses for "magic", "mage", "mages" and "the ley lines" in this world
export function powerWords(picks) {
  for (const pk of picks || []) {
    const p = PREMISE[pk.id] || pk; const pw = p.power; if (!pw) continue;
    return { power: pw.name, user: pw.user, users: pw.users, node: pw.node || "the old places of power" };
  }
  return null;
}

/* ------------------------------------------------------------------------------------------- */

const ROLES = ["an old soldier", "a retired scholar", "a hermit", "a widow", "a ferryman", "a physician", "a deserter", "a lay sister", "a toll-keeper", "a grave-digger", "a court scribe", "a smuggler"];
const HEADING = {
  library: s => `The library of ${s}`, archive: s => `The archives of ${s}`, temple: s => `The temple at ${s}`, ruin: s => s,
  oral: s => `Tales told in ${s}`, traveller: s => `Travellers at the inn in ${s}`, heretic: s => `A hidden press in ${s}`,
};

export function genLore(G, P, seed) {
  const W = G.W; if (!W || !W.picks.length) return emptyLore(G);
  const rng = makeRng(seed + "|lore"), nameRng = makeRng(seed + "|lorenames");
  const { R, S, Y, X, F } = G, provs = R.provs, np = provs.length, st = X.settlements;
  const realms = Y.realms, nR = realms.length;
  const langOf = p => R.masses[provs[p].mass].lang;
  const ptag = p => Y.ptags[p];
  const forb = p => W.forbidden && W.forbidden[p];

  // how far each province is from any capital, in steps: "remote" country is far from all of them
  const hop = new Int32Array(np).fill(-1), q0 = [];
  for (const s of S.states) { hop[s.capital] = 0; q0.push(s.capital); }
  for (let h = 0; h < q0.length; h++) for (const r of provs[q0[h]].adj) if (hop[r] < 0) { hop[r] = hop[q0[h]] + 1; q0.push(r); }
  const remote = p => hop[p] < 0 ? 99 : hop[p];

  const whereOk = {
    remote: p => remote(p) >= 3, inner: p => provs[p].adj.every(q => S.own[q] === S.own[p]), border: p => provs[p].adj.some(q => S.own[q] !== S.own[p]),
    coast: p => provs[p].coastal, mountain: p => provs[p].terr >= 2, desert: p => ptag(p).includes("desert"),
    forest: p => ptag(p).includes("forest") || ptag(p).includes("jungle"), capital: p => S.own[p] >= 0 && S.states[S.own[p]].capital === p, any: () => true,
  };
  // a province matching `where`, inside `within` if given, preferring remote ones for "remote"
  const findProv = (where, within, avoid) => {
    const pool = (within || provs.map(p => p.id)).filter(p => provs[p].biome !== B.glacier && !avoid(p));
    if (!pool.length) return -1;
    const ok = pool.filter(whereOk[where] || whereOk.any);
    const use = ok.length ? ok : pool;
    if (where === "remote") { use.sort((a, b) => remote(b) - remote(a)); return use[Math.floor(rng.f() * Math.max(1, Math.ceil(use.length * 0.25)))]; }
    return rng.pick(use);
  };

  /* ---- regional themes on realms ---- */
  const themes = [], realmThemes = realms.map(() => []);
  const ctxOf = realms.map(r => new Set(r.tags));
  for (const pk of W.picks) {
    const p = PREMISE[pk.id], subs = p.subthemes || [];
    const nPool = Math.min(subs.length, pk.role === "core" ? rng.int(5, 7) : rng.int(3, 4));
    const pool = [], left = subs.slice();
    while (pool.length < nPool && left.length) {
      const s = weightedPick(rng, left, s => (s.w ?? 1) * (s.truthLink ? (s.truthLink === pk.truth ? 1.6 : 0.35) : 1)); if (!s) break;
      pool.push(s); left.splice(left.indexOf(s), 1);
    }
    for (const sub of pool) {
      const cands = [];
      for (let r = 0; r < nR; r++) {
        if (realmThemes[r].length >= 2) continue;
        const w = weight(sub, ctxOf[r]) * Math.sqrt(S.states[r].provs.length); if (w > 0) cands.push([r, w]);
      }
      const n = Math.min(cands.length, 1 + (rng.chance(0.45) ? 1 : 0) + (nR > 40 && rng.chance(0.4) ? 1 : 0));
      const got = [];
      for (let k = 0; k < n; k++) { const c = weightedPick(rng, cands, c => c[1]); if (!c) break; got.push(c[0]); cands.splice(cands.indexOf(c), 1); }
      if (!got.length) continue;
      const id = themes.length;
      themes.push({ id, prem: p.id, sub: sub.id, n: sub.n, d: sub.d, truthLink: sub.truthLink || null, realms: got });
      for (const r of got) {
        realmThemes[r].push(id);
        const t = new Set(realms[r].tags); for (const x of sub.tags || []) t.add(x); realms[r].tags = [...t]; ctxOf[r] = t;
      }
    }
  }

  /* ---- marked zones ---- */
  const zones = [], provZone = new Int32Array(np).fill(-1);
  const grow = (start, size, ok) => {
    const out = [start]; provZone[start] = zones.length;
    const front = [...provs[start].adj];
    while (out.length < size && front.length) {
      const j = Math.floor(rng.f() * front.length), q = front[j]; front[j] = front[front.length - 1]; front.pop();
      if (provZone[q] >= 0 || !ok(q)) continue;
      provZone[q] = zones.length; out.push(q); for (const r of provs[q].adj) front.push(r);
    }
    return out;
  };
  const addZone = (mark, prem, theme, within) => {
    const start = findProv(mark.where || "any", within, p => provZone[p] >= 0 || forb(p)); if (start < 0) return;
    const size = rng.int(mark.size?.[0] ?? 2, mark.size?.[1] ?? 4), mass = provs[start].mass, wset = within ? new Set(within) : null;
    const ps = grow(start, size, q => provs[q].mass === mass && !forb(q) && (!wset || wset.has(q)));
    zones.push({ id: zones.length, n: mark.n, d: mark.d || (theme != null ? themes[theme].d : ""), color: mark.color || "#8a6aa8", prem, theme, provs: ps, label: provs[start].heart });
  };
  for (const th of themes) {
    const sub = PREMISE[th.prem].subthemes.find(s => s.id === th.sub);
    if (sub.mark) addZone(sub.mark, th.prem, th.id, S.states[th.realms[0]].provs);
  }
  for (const pk of W.picks) for (const m of PREMISE[pk.id].mapMarks || []) {
    if (m.kind !== "zone") continue;
    const n = rng.int(m.count?.[0] ?? 1, m.count?.[1] ?? 1);
    for (let k = 0; k < n; k++) addZone(m, pk.id, null, null);
  }

  /* ---- the great wall: around the heartland of the largest realm ---- */
  let wall = null;
  for (const pk of W.picks) {
    const m = (PREMISE[pk.id].mapMarks || []).find(m => m.kind === "wall"); if (!m) continue;
    const big = S.states.slice().sort((a, b) => b.provs.length - a.provs.length)[0]; if (!big || big.provs.length < 6) break;
    const mine = new Set(big.provs), d = new Map([[big.capital, 0]]), q = [big.capital];
    for (let h = 0; h < q.length; h++) for (const r of provs[q[h]].adj) if (mine.has(r) && !d.has(r)) { d.set(r, d.get(q[h]) + 1); q.push(r); }
    const heart = q.slice(0, Math.max(3, Math.round(q.length * rng.range(0.45, 0.65))));
    wall = { n: m.n, d: m.d, prem: pk.id, realm: big.id, provs: heart };
    break;
  }

  /* ---- dig sites and anomalies ---- */
  const sites = [], siteAt = new Map();
  const forbList = W.forbidden ? provs.filter(p => W.forbidden[p.id]).map(p => p.id) : null;
  for (const pk of W.picks) {
    const p = PREMISE[pk.id];
    for (const s of p.sites || []) {
      if (s.truthLink && s.truthLink !== pk.truth) continue; // a site that would prove another world's truth
      // linked sites lean toward realms whose themes leak the same truth; remote ones may lie in the forbidden land
      const linked = themes.filter(t => t.prem === p.id && t.truthLink && t.truthLink === s.truthLink).flatMap(t => t.realms);
      let within = null;
      if (forbList && s.where === "remote" && rng.chance(0.5)) within = forbList;
      else if (linked.length && rng.chance(0.6)) within = S.states[rng.pick(linked)].provs;
      const prov = findProv(s.where, within, q => siteAt.has(q) || (!within && forb(q)));
      if (prov < 0) continue;
      const id = sites.length;
      sites.push({ id, prem: p.id, key: s.id, name: s.n.replace("$", langOf(prov).word(nameRng, null)), kind: s.kind, prov, cell: provs[prov].heart, d: s.d, layers: s.layers, truthLink: s.truthLink || null });
      siteAt.set(prov, id);
    }
  }

  /* ---- where knowledge is kept ---- */
  const holders = [], holderKey = new Map();
  const realmOfP = p => S.own[p];
  const townsOf = r => (r >= 0 ? S.states[r].provs : provs.map(p => p.id)).map(p => st[X.mainOf[p]]).filter(Boolean);
  const holder = (kind, prov, name, extra = {}) => {
    const key = kind + "|" + prov + "|" + (extra.site ?? extra.cast ?? "");
    if (holderKey.has(key)) return holderKey.get(key);
    const id = holders.length; holders.push({ id, kind, prov, name, realm: realmOfP(prov), frags: [], ...extra }); holderKey.set(key, id); return id;
  };
  const pickTown = (r, test) => { const ts = townsOf(r).filter(test); return ts.length ? rng.pick(ts) : null; };
  // a holder of the right kind somewhere in realm r (or anywhere if r < 0)
  const holderIn = (source, r, near) => {
    const R0 = r >= 0 && S.states[r] ? r : -1;
    switch (source) {
      case "library": { const t = pickTown(R0, s => s.tier >= 3) || pickTown(R0, s => s.tier >= 2) || pickTown(-1, s => s.tier >= 3); return t ? holder("library", t.prov, HEADING.library(t.name)) : -1; }
      case "archive": { const rr = R0 >= 0 ? R0 : rng.int(0, nR - 1); const c = S.states[rr].capital; return holder("archive", c, HEADING.archive(S.states[rr].name)); }
      case "temple": {
        const fa = R0 >= 0 ? Y.faiths[realms[R0].faith] : rng.pick(Y.faiths);
        if (fa.holy && (R0 < 0 || S.own[fa.holy.prov] === R0) && rng.chance(0.5)) return holder("temple", fa.holy.prov, `The holy site of ${fa.holy.name}`);
        const t = pickTown(R0, s => s.tier >= 1); return t ? holder("temple", t.prov, HEADING.temple(t.name)) : -1;
      }
      case "ruin": {
        if (near != null) { const s = sites[near]; return holder("ruin", s.prov, s.name, { site: s.id }); }
        const own = sites.filter(s => R0 < 0 || S.own[s.prov] === R0);
        if (own.length && rng.chance(0.6)) { const s = rng.pick(own); return holder("ruin", s.prov, s.name, { site: s.id }); }
        const ms = F.sites.filter(s => (R0 < 0 || S.own[s.prov] === R0) && /Ruin|Tomb|Barrow|Monolith|Standing/i.test(s.type));
        if (ms.length) { const s = rng.pick(ms); return holder("ruin", s.prov, s.name); }
        const p = findProv("remote", R0 >= 0 ? S.states[R0].provs : null, q => forb(q));
        return p < 0 ? -1 : holder("ruin", p, `Ruins near ${st[X.mainOf[p]].name}`);
      }
      case "oral": { const t = pickTown(R0, s => s.tier <= 1) || pickTown(R0, () => true); return t ? holder("oral", t.prov, HEADING.oral(t.name)) : -1; }
      case "traveller": { const t = pickTown(R0, s => s.port) || pickTown(-1, s => s.port && s.tier >= 2) || pickTown(R0, s => s.tier >= 2); return t ? holder("traveller", t.prov, HEADING.traveller(t.name)) : -1; }
      case "person": {
        const t = pickTown(R0, s => s.tier >= 1); if (!t) return -1;
        const cu = Y.cultures[Y.cultureOf[t.prov]], who = cu.lang.word(nameRng, null);
        return holder("person", t.prov, `${who}, ${rng.pick(ROLES)} of ${t.name}`, { who });
      }
      case "heretic": {
        const zealots = R0 >= 0 ? [R0] : realms.filter(r => ["zealous", "pious", "gov:theocracy"].some(t => r.tags.includes(t))).map(r => r.id);
        const t = pickTown(zealots.length ? rng.pick(zealots) : R0, s => s.tier >= 2); return t ? holder("heretic", t.prov, HEADING.heretic(t.name)) : -1;
      }
    }
    return -1;
  };

  /* ---- the cast: the same few people write across the world ---- */
  const cast = {};
  for (const pk of W.picks) {
    const p = PREMISE[pk.id]; cast[p.id] = {};
    for (const c of p.cast || []) {
      const prov = findProv(c.home || "any", null, q => forb(q) || !st[X.mainOf[q]]); if (prov < 0) continue;
      const town = st[X.mainOf[prov]], name = Y.cultures[Y.cultureOf[prov]].lang.word(nameRng, null);
      const m = { role: c.role, n: c.n, stance: c.stance || "", name, prov, town: town.name, realm: S.own[prov] };
      m.holder = holder("person", prov, `${name}, ${c.n.replace(/^an? /, "")}, in ${town.name}`, { who: name, cast: c.role, prem: p.id });
      cast[p.id][c.role] = m;
    }
  }

  /* ---- lore fragments ---- */
  const frags = [];
  const year = Y.calendar.year;
  const the = n => n.replace(/^The /, "the ");
  const realmShort = r => r >= 0 && S.states[r] ? S.states[r].short : null;
  const placeName = (name, prov) => { const r = realmShort(S.own[prov]); return the(name) + (r && !name.includes(r) ? ` in ${r}` : ""); };
  const slotsFor = (prov, prem) => {
    const r = S.own[prov], cu = Y.cultures[Y.cultureOf[prov]], fa = Y.faiths[Y.faithOf[prov]];
    const o = { place: st[X.mainOf[prov]].name, realm: r >= 0 ? S.states[r].name : provs[prov].name, people: cu.adj, faith: fa.name, deity: fa.deity,
      year: String(year - rng.int(5, 400)), person: cu.lang.word(nameRng, null) };
    for (const [k, c] of Object.entries(cast[prem] || {})) o[k] = c.name;
    return o;
  };
  // where a pointer sends the reader: a real place, created if need be
  const resolve = (prem, points, region, except = -1) => {
    if (!points) return null;
    const [kind, id] = points.includes(":") ? points.split(":") : [points, null];
    if (kind === "site") {
      const s = sites.find(s => s.prem === prem && s.key === id);
      if (s) return { name: placeName(s.name, s.prov), site: s.id, prov: s.prov };
      const h = holderIn("archive", region); return h < 0 ? null : { name: placeName(holders[h].name, holders[h].prov), holder: h, prov: holders[h].prov };
    }
    if (kind === "cast") { const c = (cast[prem] || {})[id]; if (c) return { name: `${c.name} in ${c.town}`, holder: c.holder, prov: c.prov }; }
    if (kind === "sub") { const rs = themes.filter(t => t.prem === prem && t.sub === id).flatMap(t => t.realms); if (rs.length) region = rng.pick(rs); }
    // prefer a place of that kind that already keeps something of this premise
    const want = kind === "sub" || kind === "cast" ? "archive" : kind;
    const have = holders.filter(h => h.kind === want && h.id !== except && (h.frags || []).length && (region < 0 || h.realm === region));
    let h = have.length ? rng.pick(have).id : holderIn(want, region);
    if (h === except) { const other = holders.filter(x => x.kind === want && x.id !== except); h = other.length ? rng.pick(other).id : holderIn(want === "library" ? "archive" : "library", -1); }
    return h < 0 ? null : { name: placeName(holders[h].name, holders[h].prov), holder: h, prov: holders[h].prov };
  };
  for (const h of holders) h.frags = [];

  // site chapters: filled with names, with their pointers resolved
  const LAYER_KEYS = ["surface", "study", "dig", "revelation"];
  for (const s of sites) {
    const src = PREMISE[s.prem].sites.find(x => x.id === s.key).layers, chap = {};
    for (const k of LAYER_KEYS) {
      const L = typeof src[k] === "string" ? { n: null, text: src[k] } : src[k];
      const to = resolve(s.prem, L.points, S.own[s.prov]);
      chap[k] = { n: L.n || null, text: fill(L.text, { ...slotsFor(s.prov, s.prem), lead: to ? to.name : "the nearest archive" }) || L.text, to };
    }
    s.layers = chap;
  }

  const castOfText = (prem, t) => Object.keys(cast[prem] || {}).find(k => t.includes("{" + k + "}"));
  for (const pk of W.picks) {
    const p = PREMISE[pk.id], prem = p.id;
    const subRealms = id => themes.filter(t => t.prem === prem && t.sub === id).flatMap(t => t.realms);
    const linkedRealms = themes.filter(t => t.prem === prem && t.truthLink === pk.truth).flatMap(t => t.realms);
    (p.fragments || []).forEach((f, k) => {
      const a = f.about || "";
      let lead = false, region = -1, near = null, copies = 1;
      if (a.startsWith("truth:")) {
        if (a.slice(6) !== pk.truth) {
          // a theory that is wrong in this world: some of its believers' writings survive, never its denials
          if (f.reliable === false || f.plain || !rng.chance(0.45)) return;
          lead = true;
        } else if (linkedRealms.length && rng.chance(0.55)) region = rng.pick(linkedRealms);
      } else if (a.startsWith("sub:")) {
        const rs = subRealms(a.slice(4)); if (!rs.length) return; region = rng.pick(rs);
      } else if (a.startsWith("site:")) {
        const s = sites.find(s => s.prem === prem && s.key === a.slice(5)); if (!s) return;
        near = s.id; region = S.own[s.prov];
      }
      for (let c = 0; c < copies; c++) {
        // a person's own words are kept by that person, if they are one of the cast
        const author = f.source === "person" ? castOfText(prem, (f.who || "") + " " + f.text) : null;
        let h;
        if (author && c === 0) h = cast[prem][author].holder;
        else {
          if (f.source === "ruin" && near == null && sites.some(s => s.prem === prem) && rng.chance(0.5)) near = rng.pick(sites.filter(s => s.prem === prem)).id;
          h = holderIn(f.source, region, f.source === "ruin" ? near : null);
        }
        if (h < 0) continue;
        const to = resolve(prem, f.points, region, h);
        const sl = { ...slotsFor(holders[h].prov, prem), lead: to ? to.name : "the archives" };
        const text = fill(f.text, sl) || f.text.replace(/\{\w+\}/g, "someone");
        const who = f.who ? fill(f.who, sl) || null : null;
        // what the fragment really is in this world: a wrong theory's best evidence is still misleading
        const truthful = lead ? false : f.reliable;
        frags.push({ id: frags.length, prem, k, holder: h, depth: f.depth, about: a, source: f.source, bias: f.bias, reliable: f.reliable, truthful, lead, text, who, to, plain: !!f.plain && !lead, cost: !!f.cost });
        holders[h].frags.push(frags.length - 1);
        region = -1; // a second copy goes anywhere
      }
    });
  }
  // rumours that point the way: talk of each theme in neighbouring lands, and of each site in the
  // villages around it
  const neighbours = r => { const o = new Set(); for (const p of S.states[r].provs) for (const q of provs[p].adj) if (S.own[q] >= 0 && S.own[q] !== r) o.add(S.own[q]); return [...o]; };
  const rumour = (prem, about, depth, h, text, to = null) => { if (h >= 0) { frags.push({ id: frags.length, prem, k: -1, holder: h, depth, about, source: holders[h].kind, bias: "exaggerated", reliable: "partial", truthful: "partial", lead: false, text, gen: true, to }); holders[h].frags.push(frags.length - 1); } };
  for (const th of themes) {
    const r0 = th.realms[0], nb = neighbours(r0), far = nb.length ? rng.pick(nb) : r0;
    rumour(th.prem, "sub:" + th.sub, "sub", holderIn("traveller", far), `A traveller from ${S.states[r0].name} talks about ${the(th.n)}: "${th.d}"`);
  }
  for (const s of sites) {
    const ring = [s.prov, ...provs[s.prov].adj].filter(p => !forb(p) && st[X.mainOf[p]]);
    const p = ring.length ? rng.pick(ring) : -1; if (p < 0) continue;
    const t = st[X.mainOf[p]], h = holder("oral", t.prov, HEADING.oral(t.name));
    rumour(s.prem, "site:" + s.key, "site", h, `Villagers in ${t.name} will tell anyone who asks about ${the(s.name)}, a short walk away: "${s.layers.surface.text}"`, { name: placeName(s.name, s.prov), site: s.id, prov: s.prov });
  }
  // a pointer should never lead to an empty room: give each pointed-at place something to read
  for (const f of frags.slice()) {
    const h = f.to && f.to.holder; if (h == null || holders[h].frags.length) continue;
    const pool = frags.filter(x => x.prem === f.prem && !x.gen && x.depth !== "site" && x.id !== f.id);
    if (!pool.length) continue;
    const src = rng.pick(pool);
    frags.push({ ...src, id: frags.length, holder: h, copyOf: src.id }); holders[h].frags.push(frags.length - 1);
  }
  // each truth's "what is known so far" summaries, with names filled in
  const known = {};
  for (const pk of W.picks) {
    const p = PREMISE[pk.id], c0 = Object.values(cast[p.id] || {})[0], prov = c0 ? c0.prov : S.states[0].capital;
    known[p.id] = Object.fromEntries(p.truths.map(t => [t.id, (t.known || []).map(x => fill(x, slotsFor(prov, p.id)) || x)]));
  }

  return { themes, realmThemes, zones, provZone, wall, sites, siteAt: Object.fromEntries(siteAt), holders, frags, cast, known };
}

function emptyLore(G) {
  return { themes: [], realmThemes: G.Y.realms.map(() => []), zones: [], provZone: new Int32Array(G.R.provs.length).fill(-1), wall: null, sites: [], siteAt: {}, holders: [], frags: [], cast: {}, known: {} };
}

// what the page needs to describe the premises (names, powers, truths, theories) without loading
// the premise files themselves
export function premiseView(W) {
  if (!W) return null;
  return {
    catalog: PREMISES.map(p => ({ id: p.id, name: p.name, family: p.family })),
    genre: W.genre, tags: W.tags, forbidden: W.forbidden, forbiddenMark: W.forbiddenMark, extra: W.extra,
    picks: W.picks.map(pk => {
      const p = PREMISE[pk.id];
      return {
        id: p.id, name: p.name, pitch: p.pitch, family: p.family, kind: p.kind || null, role: pk.role, truth: pk.truth, slots: p.slots, tone: p.tone,
        power: p.power || null, truths: p.truths.map(t => ({ id: t.id, n: t.n, d: t.d })),
        subthemes: (p.subthemes || []).map(s => ({ id: s.id, n: s.n, d: s.d })),
        beings: (p.beings || []).map(b => ({ id: b.id, n: b.n, kind: b.kind, d: b.d, danger: b.danger })),
      };
    }),
  };
}
