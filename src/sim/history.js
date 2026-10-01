import { clamp, makeRng, shuffle, Heap } from "../core/util.js";
import { W, BIOMES } from "../core/tables.js";
import { pickOne, pickSome, test, weight, allowed } from "../core/rules.js";
import { fill } from "../core/text.js";
import { GOVERNMENTS, CASUS_BELLI } from "../content/society.js";
import { TACTICS, PROJECTS, TRAITS, EPITHETS } from "../content/warfare.js";
import { FIELDS, INVENTIONS, INSTITUTIONS } from "../content/tech.js";
import { NEWS } from "../content/news.js";
import { WILDLIFE_NEWS, MARINE_FAUNA, SEA_MONSTERS } from "../content/wildlife.js";
import { FAUNA } from "../content/ecology.js";
import { UNITS } from "../content/military.js";
import { TIERS, FERTILITY } from "../gen/settlements.js";
import { computeFronts, deployForces } from "../gen/conflict.js";
import { provinceTags } from "../gen/society.js";
import { realmScience } from "../app/science.js";
import { storyStep } from "./storylines.js";
import { loreStep } from "./lore.js";

// The history layer. Generation makes the world as it is on its first day; this layer then moves
// it forward a month at a time. It never regenerates anything: it changes ownership, relations,
// wars, people, towns, roads and projects on top of the generated world, and writes a news item
// for everything that happens. Every month has its own seeded rng, so the same world run for the
// same number of months always has the same history.
//
// Systems, in the order they run each month:
//   people      rulers, heirs, commanders, scholars, spymasters, diplomats age, gain fame and die
//   succession  heirs, elections, chosen priests; weak claims turn into crises and civil wars
//   economy     taxes and trade into the treasury; armies and projects out of it
//   towns       grow or shrink with prosperity, war and plague; change tier; are abandoned or founded
//   science     research by field; discoveries of the inventions in content/tech.js
//   diplomacy   opinions drift; trade deals, alliances, rivalries, embargoes, royal marriages
//   war         declarations, monthly battles (tactics, terrain, commanders), sieges, peace treaties
//   unrest      revolts, rebel factions, revolutions that change the government
//   projects    megaprojects and monuments in three tiers (content/warfare.js PROJECTS)
//   intrigue    spies steal knowledge, stir unrest, sabotage projects, assassinate
//   the world   plague, famine, earthquakes, titans, stirring mysteries, festivals
//   yearly      new roads and new towns

const wrapDx = dx => { dx = Math.abs(dx); return Math.min(dx, W - dx); };
const TRAIT = Object.fromEntries(TRAITS.map(t => [t.id, t]));
const GOV = Object.fromEntries(GOVERNMENTS.map(g => [g.id, g]));
const TAC = Object.fromEntries(TACTICS.map(t => [t.id, t]));
const UNIT = Object.fromEntries(UNITS.map(u => [u.id, u]));
const FEMALE = { King: "Queen", Emperor: "Empress", "High Priest": "High Priestess", Khagan: "Khatun", "Lord Protector": "Lady Protector", "Lord Marshal": "Lady Marshal", "Elected King": "Elected Queen", Beastlord: "Beastmistress" };
const fmtN = n => Math.round(n).toLocaleString("en-US");

export function initHistory(G) {
  const { S, Y, Z, X, R } = G, rng = makeRng(G.seed + "|history|init");
  const H = { month: 0, people: [], realm: [], news: [], newsSeq: 0, monuments: [], projects: [], truce: new Map(), plague: null, rebels: 0, lastForces: 0, founded: 0 };
  for (const r of Y.relations) { r.base = r.op; r.deal = r.status === "friendly" && rng.chance(0.3); }
  S.states.forEach((st, i) => {
    const yr = Y.realms[i], ctx = new Set(yr.tags);
    const sci = realmScience(G, i, ctx);
    const d = {
      treasury: 60 + st.provs.length * 4, stability: rng.range(45, 75), prestige: rng.range(5, 20), exhaustion: 0, dead: false,
      fields: Object.fromEntries(sci.fields.map(f => [f.id, f.level + rng.f() * 0.5])), known: new Set(sci.inventions.map(x => x.id)), institutions: sci.institutions.map(x => x.n),
      tactics: [], project: null, ruler: -1, heir: -1, commanders: [], scholars: [], spymaster: -1, diplomat: -1, termEnds: 0, fx: { trade: 0, growth: 0, defence: 0, science: 0 },
    };
    H.realm.push(d);
    realmTactics(G, H, i);
    // the ruler named at generation becomes a person with a life
    const ruler = newPerson(G, H, i, "ruler", rng.int(25, 65), rng), g0 = GOV[yr.gov];
    const titleUsed = [g0.ruler, FEMALE[g0.ruler]].find(t => t && yr.ruler.startsWith(t + " "));
    const rest = titleUsed ? yr.ruler.slice(titleUsed.length + 1).split(" ") : yr.ruler.split(" ").slice(1);
    ruler.name = rest[0] || ruler.name; ruler.suffix = rest.slice(1).join(" ") || null; ruler.female = titleUsed ? titleUsed !== g0.ruler : ruler.female;
    d.ruler = ruler.id;
    if (GOV[yr.gov].tags.includes("monarchy")) d.heir = newPerson(G, H, i, "heir", rng.int(3, 30), rng).id;
    if (GOV[yr.gov].tags.includes("republic")) d.termEnds = rng.int(6, 60);
    d.commanders.push(newPerson(G, H, i, "commander", rng.int(30, 55), rng).id);
    if (rng.chance(0.7)) d.scholars.push(newPerson(G, H, i, "scholar", rng.int(25, 60), rng).id);
    d.spymaster = newPerson(G, H, i, "spymaster", rng.int(30, 60), rng).id;
    d.diplomat = newPerson(G, H, i, "diplomat", rng.int(30, 60), rng).id;
  });
  for (const w of Z.wars) { w.start = -Math.floor(w.days / 30); w.sieges = {}; w.battles = 0; w.casualties = [0, 0]; }
  // rebels move to their own id range, so new realms can take the next realm ids
  const remap = new Map();
  Z.actors.forEach((a, id) => { if (a && a.rebel && id < 100000) remap.set(id, 100000 + H.rebels++); });
  if (remap.size) {
    for (const [o, n] of remap) { Z.actors[n] = { ...Z.actors[o], id: n }; delete Z.actors[o]; }
    for (let p = 0; p < Z.control.length; p++) if (remap.has(Z.control[p])) Z.control[p] = remap.get(Z.control[p]);
    for (const w of Z.wars) { w.attackers = w.attackers.map(a => remap.get(a) ?? a); w.defenders = w.defenders.map(a => remap.get(a) ?? a); }
    for (const a of Z.armies) if (remap.has(a.actor)) a.actor = remap.get(a.actor);
    Z.actors.length = S.states.length;
  }
  X.settlements.forEach(s => { s.pop0 = s.pop; });
  return H;
}

/* ---------- people ---------- */
function newPerson(G, H, rid, role, age, rng) {
  const lang = G.Y.cultures[G.Y.realms[rid].culture].lang, traits = [];
  const n = rng.int(1, 3);
  for (let k = 0; k < n; k++) { const t = rng.pick(TRAITS); if (!traits.includes(t.id) && !traits.some(x => (TRAIT[x].opp || []).includes(t.id))) traits.push(t.id); }
  if (role === "scholar" && !traits.includes("scholar")) traits.push("scholar");
  const sk = { mil: rng.int(2, 7), dip: rng.int(2, 7), sci: rng.int(2, 7), int: rng.int(2, 7) };
  for (const t of traits) for (const k of ["mil", "dip", "sci", "int"]) if (TRAIT[t].fx[k]) sk[k] = clamp(sk[k] + TRAIT[t].fx[k] * 2, 1, 10);
  if (role === "commander") sk.mil = clamp(sk.mil + 2, 1, 10); if (role === "spymaster") sk.int = clamp(sk.int + 2, 1, 10); if (role === "diplomat") sk.dip = clamp(sk.dip + 2, 1, 10); if (role === "scholar") sk.sci = clamp(sk.sci + 2, 1, 10);
  const female = rng.chance(0.4);
  const p = { id: H.people.length, name: lang.word(rng, null), female, role, realm: rid, born: G.Y.calendar.year - age, bornMonth: H.month, traits, sk, alive: true, fame: 0, wins: 0, deeds: [] };
  H.people.push(p);
  return p;
}
const age = (G, H, p) => G.Y.calendar.year + Math.floor(H.month / G.Y.calendar.months.length) - p.born;
const fx = (H, pid, key) => { if (pid < 0) return 1; let v = 1; for (const t of H.people[pid].traits) { const f = TRAIT[t].fx[key]; if (f && key !== "mil" && key !== "dip" && key !== "sci" && key !== "int") v *= f; } return v; };
function rulerString(G, H, rid) {
  const p = H.people[H.realm[rid].ruler], gov = GOV[G.Y.realms[rid].gov];
  const title = p.female ? (FEMALE[gov.ruler] || gov.ruler) : gov.ruler;
  const ep = p.epithet || p.suffix || "";
  return `${title} ${p.name}${ep ? " " + ep : ""}`;
}

/* ---------- tactics a realm can use ---------- */
function realmTactics(G, H, rid) {
  const ctx = new Set(G.Y.realms[rid].tags);
  for (const t of G.Z.templates[rid] || []) ctx.add("units:" + UNIT[t.unit].role);
  const rng = makeRng(G.seed + "|tactics|" + rid + "|" + H.month);
  H.realm[rid].tactics = pickSome(rng, TACTICS, ctx, 4).map(t => t.id);
  if (!H.realm[rid].tactics.length) H.realm[rid].tactics = ["shield_wall"];
}

/* ---------- news ---------- */
function dateOfMonth(G, m) {
  const cal = G.Y.calendar, nM = cal.months.length;
  let d = cal.startDay, mo = 0; while (mo < nM - 1 && d >= cal.months[mo].days) { d -= cal.months[mo].days; mo++; }
  const abs = mo + m;
  return { year: cal.year + Math.floor(abs / nM), month: ((abs % nM) + nM) % nM };
}
function news(G, H, kind, imp, slots, where) {
  const cal = G.Y.calendar, dt = dateOfMonth(G, H.month), rid = where.realm ?? -1;
  const ctx = rid >= 0 ? new Set(G.Y.realms[rid].tags) : new Set();
  const opts = (NEWS[kind] || WILDLIFE_NEWS[kind] || []).map(t => ({ t, w: weight({ w: t.w ?? 1, req: t.req }, ctx) })).filter(e => e.w > 0);
  const rng = makeRng(G.seed + "|news|" + H.newsSeq);
  let h = null, b = null;
  for (let tries = 0; tries < 6 && opts.length && !h; tries++) {
    let tot = 0; for (const o of opts) tot += o.w; let r = rng.f() * tot, i = 0; while (i < opts.length - 1 && (r -= opts[i].w) > 0) i++;
    const o = opts.splice(i, 1)[0].t; h = fill(o.h, slots); b = fill(o.b, slots); if (!h || !b) h = null;
  }
  if (!h) { h = (slots.realm ? slots.realm + ": " : "") + kind.replace(/_/g, " "); b = ""; }
  H.news.push({ id: H.newsSeq++, month: H.month, year: dt.year, mon: cal.months[dt.month].name, kind, imp, h, b, realms: where.realms || (rid >= 0 ? [rid] : []), prov: where.prov ?? -1, x: where.x, y: where.y });
}

// news written directly (storylines bring their own text)
function newsText(G, H, kind, imp, h, b, where) {
  const cal = G.Y.calendar, dt = dateOfMonth(G, H.month);
  H.news.push({ id: H.newsSeq++, month: H.month, year: dt.year, mon: cal.months[dt.month].name, kind, imp, h, b, realms: where.realms || (where.realm >= 0 ? [where.realm] : []), prov: where.prov ?? -1, story: where.story });
}

/* ---------- the monthly step ---------- */
export function simulate(G, H, toMonth, maxMonths = 12) {
  const flags = { own: false, forces: false, roads: false, towns: false };
  const start = H.news.length;
  let n = 0;
  while (H.month < toMonth && n < maxMonths) { step(G, H, flags); H.month++; n++; }
  if (flags.own || flags.forces || H.month - H.lastForces >= 3) {
    computeFronts(G, G.Z);
    deployForces(G, G.Z, H.month);
    H.lastForces = H.month; flags.forces = true;
  }
  if (H.news.length > 4000) H.news.splice(0, H.news.length - 4000);
  return { flags, news: H.news.slice(Math.max(0, H.news.length - (H.news.length - start))) };
}

function step(G, H, flags) {
  const rng = makeRng(G.seed + "|month|" + H.month);
  const { S, Y, Z, X, R } = G, provs = R.provs, np = provs.length, st = X.settlements, cal = Y.calendar;
  const alive = S.states.map((s, i) => !H.realm[i].dead && s.provs.length > 0);
  const realmOf = a => Z.actors[a] ? (Z.actors[a].rebel ? Z.actors[a].of : (Z.actors[a].realm ?? a)) : a;
  const inWar = i => Z.wars.find(w => [...w.attackers, ...w.defenders].some(a => realmOf(a) === i));
  const town = rid => st[X.mainOf[S.states[rid].capital]];
  const slotsR = (rid, extra = {}) => ({ realm: S.states[rid].name, short: S.states[rid].short, ruler: Y.realms[rid].ruler, people: Y.cultures[Y.realms[rid].culture].adj, faith: Y.faiths[Y.realms[rid].faith].name, place: town(rid).name, gov: GOV[Y.realms[rid].gov].n, year: String(dateOfMonth(G, H.month).year), ...extra });

  /* people: age and die */
  for (const p of H.people) {
    if (!p.alive) continue;
    const a = age(G, H, p), risk = 0.0004 * Math.exp(0.075 * Math.max(0, a - 20)) * (p.traits.includes("sickly") ? 2.5 : p.traits.includes("strong") ? 0.6 : 1) + (a < 5 ? 0.002 : 0);
    if (rng.f() < risk / 1) {
      p.alive = false; p.died = H.month;
      const d = H.realm[p.realm];
      if (d.dead) continue;
      if (p.id === d.ruler) { news(G, H, "ruler_died", 2, slotsR(p.realm, { person: Y.realms[p.realm].ruler }), { realm: p.realm, prov: S.states[p.realm].capital }); succession(G, H, p.realm, rng, flags); }
      else if (p.id === d.heir) d.heir = -1;
      else { d.commanders = d.commanders.filter(x => x !== p.id); d.scholars = d.scholars.filter(x => x !== p.id); if (d.spymaster === p.id) d.spymaster = -1; if (d.diplomat === p.id) d.diplomat = -1; }
    }
  }
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i], gov = GOV[Y.realms[i].gov];
    if (d.heir < 0 && gov.tags.includes("monarchy") && rng.chance(0.02)) d.heir = newPerson(G, H, i, "heir", 0, rng).id;
    if (!d.commanders.length) d.commanders.push(newPerson(G, H, i, "commander", rng.int(28, 50), rng).id);
    if (d.spymaster < 0 && rng.chance(0.05)) d.spymaster = newPerson(G, H, i, "spymaster", rng.int(30, 55), rng).id;
    if (d.diplomat < 0 && rng.chance(0.05)) d.diplomat = newPerson(G, H, i, "diplomat", rng.int(30, 55), rng).id;
    if (d.scholars.length < 2 && rng.chance(0.01 * (d.fields.writing || 2))) d.scholars.push(newPerson(G, H, i, "scholar", rng.int(20, 45), rng).id);
    // republics hold elections when a term ends
    if (gov.tags.includes("republic") && d.termEnds && H.month >= d.termEnds) {
      const old = H.people[d.ruler]; if (old) old.alive = old.alive && rng.chance(0.9);
      const np2 = newPerson(G, H, i, "ruler", rng.int(35, 65), rng); if (old) old.role = "former ruler";
      d.ruler = np2.id; d.termEnds = H.month + rng.int(36, 72); Y.realms[i].ruler = rulerString(G, H, i);
      news(G, H, "election", 2, slotsR(i, { person: Y.realms[i].ruler }), { realm: i, prov: s.capital });
    }
  });

  /* economy */
  const occupied = new Float32Array(S.states.length), total = S.states.map(s => s.provs.length || 1);
  for (let p = 0; p < np; p++) { const o = S.own[p]; if (o >= 0 && Z.control[p] !== o) occupied[o]++; }
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i]; let inc = 0;
    for (const p of s.provs) inc += Math.pow(st[X.mainOf[p]].pop, 0.75) / 900;
    inc *= (1 + d.fx.trade) * (1 - occupied[i] / total[i] * 0.7);
    const war = inWar(i), upkeep = war ? inc * 0.45 : inc * 0.12, proj = d.project ? d.project.cost / d.project.months : 0;
    d.treasury += inc - upkeep - (d.project && d.treasury > 0 ? proj : 0);
    if (d.treasury < -40 && rng.chance(0.08)) { news(G, H, "treasury_crisis", 1, slotsR(i), { realm: i, prov: s.capital }); d.stability -= 8; }
    const target = 60 + d.prestige / 6 - d.exhaustion * 30 - occupied[i] / total[i] * 45 - (d.treasury < 0 ? 12 : 0);
    d.stability += (target - d.stability) * 0.05 + rng.range(-1, 1);
    d.stability = clamp(d.stability, 0, 100);
    d.exhaustion = Math.max(0, d.exhaustion - (war ? 0 : 0.01));
    d.prestige = Math.max(0, d.prestige * 0.998);
  });

  /* towns grow, shrink, rise and fall */
  const yearTick = H.month % cal.months.length === 0;
  for (const s of st) {
    if (s.abandoned) continue;
    const o = S.own[s.prov], d = o >= 0 ? H.realm[o] : null;
    let g = 0.004 + (d ? (d.stability - 50) / 50 * 0.006 + d.fx.growth : -0.004) + (G.Q.through[s.prov] || 0) * 0.02;
    if (Z.control[s.prov] !== o) g -= 0.06; else if (Z.warOf[s.prov] >= 0) g -= 0.02;
    if (H.plague && H.plague.provs.has(s.prov)) g -= 0.5;
    s.pop = Math.max(8, s.pop * (1 + g / 12));
    if (yearTick) {
      const t = s.tier;
      if (t < 4 && s.pop > TIERS[t + 1].pop[0] * 1.1 && (t + 1 < 4 || s.capital)) { s.tier++; flags.towns = true; if (s.tier >= 2) news(G, H, "town_grew", s.tier >= 3 ? 2 : 1, slotsR(o >= 0 ? o : 0, { place: s.name, count: TIERS[s.tier].n.toLowerCase() }), { realm: o, prov: s.prov }); }
      else if (t > 0 && s.pop < TIERS[t].pop[0] * 0.85) { s.tier--; flags.towns = true; if (t >= 2) news(G, H, "town_declined", 1, slotsR(o >= 0 ? o : 0, { place: s.name }), { realm: o, prov: s.prov }); }
      else if (t === 0 && s.pop < 15 && !s.capital) { s.abandoned = true; flags.towns = true; news(G, H, "town_abandoned", 1, slotsR(o >= 0 ? o : 0, { place: s.name }), { realm: o, prov: s.prov }); }
    }
  }

  /* science */
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i], ctx = new Set(Y.realms[i].tags);
    const sch = d.scholars.map(x => H.people[x]).filter(p => p && p.alive), boost = 1 + sch.reduce((a, p) => a + p.sk.sci * 0.06, 0) + (ctx.has("academies") ? 0.5 : 0) + d.fx.science;
    const size = clamp(Math.sqrt(s.provs.length) / 4, 0.4, 2);
    for (const f of FIELDS) {
      const before = Math.floor(d.fields[f.id]);
      if (before >= 5) continue;
      d.fields[f.id] += 0.0026 * boost * size * rng.range(0.3, 1.7) / Math.max(1, before * 0.8);
      if (Math.floor(d.fields[f.id]) > before) {
        const lvl = before + 1, cand = INVENTIONS.filter(x => x.field === f.id && x.level <= lvl && !d.known.has(x.id) && allowed(x, ctx));
        const inv = cand.length ? cand[Math.floor(rng.f() * cand.length)] : null;
        const who = sch.length ? sch[Math.floor(rng.f() * sch.length)] : null;
        if (inv) {
          d.known.add(inv.id);
          if (who) { who.fame++; who.deeds.push(`Invented ${inv.n.toLowerCase()} (${dateOfMonth(G, H.month).year})`); if (who.fame === 5) news(G, H, "great_scholar", 2, slotsR(i, { person: `${who.name}`, field: f.n.toLowerCase(), invention: inv.n.toLowerCase() }), { realm: i, prov: s.capital }); }
          news(G, H, "discovery", 2, slotsR(i, { invention: inv.n.toLowerCase(), field: f.n.toLowerCase(), person: who ? who.name : `scholars of ${S.states[i].short}` }), { realm: i, prov: s.capital });
        }
        if (lvl === 4 && rng.chance(0.5)) {
          const ins = INSTITUTIONS.filter(x => x.field === f.id && (!x.req || test(x.req, ctx)));
          if (ins.length) { const it = rng.pick(ins), name = fill(it.n, { capital: town(i).name, short: s.short, people: Y.cultures[Y.realms[i].culture].adj, deity: Y.faiths[Y.realms[i].faith].deity, ruler: Y.realms[i].ruler }) || it.n; d.institutions.push(name); news(G, H, "institution_founded", 1, slotsR(i, { project: name, field: f.n.toLowerCase() }), { realm: i, prov: s.capital }); }
        }
      }
    }
  });
  // knowledge spreads along friendly borders and trade
  for (const r of Y.relations) {
    if (!alive[r.a] || !alive[r.b] || rng.f() > 0.02 || r.op < 0) continue;
    const [hi, lo] = rng.chance(0.5) ? [r.a, r.b] : [r.b, r.a], f = FIELDS[rng.int(0, FIELDS.length - 1)].id;
    if (H.realm[hi].fields[f] > H.realm[lo].fields[f] + 0.5) H.realm[lo].fields[f] += 0.15;
  }

  /* diplomacy */
  for (const r of Y.relations) {
    if (!alive[r.a] || !alive[r.b]) continue;
    const da = H.realm[r.a], db = H.realm[r.b], dipl = ((H.people[da.diplomat]?.sk.dip || 3) + (H.people[db.diplomat]?.sk.dip || 3)) / 10;
    r.op += ((r.base ?? 0) - r.op) * 0.01 + rng.range(-1.5, 1.5) + (r.deal ? 0.15 : 0) + (r.status === "alliance" ? 0.1 : 0);
    const both = test("monarchy", new Set(Y.realms[r.a].tags)) && test("monarchy", new Set(Y.realms[r.b].tags));
    const sl = { ...slotsR(r.a), realm2: S.states[r.b].name, short2: S.states[r.b].short, ruler2: Y.realms[r.b].ruler, place2: town(r.b).name }, where = { realm: r.a, realms: [r.a, r.b], prov: S.states[r.a].capital };
    if (!r.deal && r.op > 5 && rng.f() < 0.004 * dipl) { r.deal = true; r.op += 10; news(G, H, "trade_deal", 2, { ...sl, good: G.Q.goods[S.states[r.b].capital].length ? "goods" : "grain" }, where); }
    else if (r.status !== "alliance" && r.op > 40 && rng.f() < 0.003 * dipl) { r.status = "alliance"; news(G, H, "alliance_formed", 2, sl, where); }
    else if (r.status === "alliance" && r.op < 8 && rng.f() < 0.03) { r.status = "neutral"; news(G, H, "alliance_broken", 2, sl, where); }
    else if (r.status !== "rival" && r.op < -45 && rng.f() < 0.006) { r.status = "rival"; news(G, H, "rivalry_declared", 2, sl, where); }
    else if (r.status === "rival" && r.deal && rng.f() < 0.02) { r.deal = false; r.op -= 8; news(G, H, "embargo", 2, sl, where); }
    else if (both && r.op > 10 && rng.f() < 0.0015) { r.op += 15; r.marriage = true; news(G, H, "royal_marriage", 2, sl, where); }
    else if (rng.f() < 0.0008 * dipl) { r.op += 8; news(G, H, "diplomat_mission", 1, { ...sl, person: H.people[da.diplomat]?.name }, where); }
    r.op = clamp(r.op, -100, 100);
    if (r.status !== "alliance" && r.status !== "rival") r.status = r.op >= 15 ? "friendly" : r.op <= -15 ? "tense" : "neutral";
  }

  /* war */
  warStep(G, H, rng, flags, alive, slotsR, realmOf);

  /* unrest, revolts and revolutions */
  if (!H.unrest) H.unrest = new Float32Array(np);
  const U = H.unrest;
  for (let p = 0; p < np; p++) {
    const o = S.own[p]; if (o < 0 || !alive[o]) continue;
    const yr = Y.realms[o], d = H.realm[o];
    let t = 5 + (Y.cultureOf[p] !== yr.culture ? 14 : 0) + (Y.faithOf[p] !== yr.faith ? (yr.tags.includes("zealous") ? 24 : 10) : 0) + (Z.control[p] !== o ? 30 : 0) + (d.stability < 30 ? 15 : 0) + d.exhaustion * 25 - (yr.tags.includes("harsh_law") ? 8 : 0);
    t *= fx(H, d.ruler, "unrest");
    U[p] += (t - U[p]) * 0.06;
  }
  if (rng.chance(0.25)) {
    const p = rng.int(0, np - 1), o = S.own[p];
    if (o >= 0 && alive[o] && U[p] > 42 && Z.control[p] === o && !inWar(o) && S.states[o].provs.length > 4 && p !== S.states[o].capital) revolt(G, H, o, p, rng, flags, slotsR);
  }
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i];
    if (d.stability < 12 && rng.f() < 0.012 * fx(H, d.ruler, "reform")) revolution(G, H, i, rng, slotsR);
  });

  /* projects and monuments */
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i];
    if (d.project) {
      if (d.treasury > 0) d.project.done++;
      if (d.project.done >= d.project.months) completeProject(G, H, i, rng, slotsR);
      return;
    }
    if (d.stability < 35 || rng.f() > 0.02 * fx(H, d.ruler, "projects")) return;
    const ctx = new Set(Y.realms[i].tags);
    // world wonders are rare: big realms only, one at a time, and never the same one twice
    const cands = PROJECTS.filter(pr => allowed(pr, ctx) && pr.cost < d.treasury * 1.2 + 40 && !(pr.tier === 3 && (s.provs.length < 12 || !rng.chance(0.25) || H.monuments.some(m => m.tier === 3 && m.realm === i && (m.pid === pr.id || H.month - m.month < 240)))));
    const pr = pickOne(rng, cands, ctx, null); if (!pr) return;
    const where = projectSite(G, i, pr, rng); if (!where) return;
    const name = fill(pr.n, { ruler: H.people[d.ruler]?.name || Y.realms[i].ruler, deity: Y.faiths[Y.realms[i].faith].deity, place: where.name, capital: town(i).name, short: s.short, holy: Y.faiths[Y.realms[i].faith].holy.name }) || pr.n;
    d.project = { pid: pr.id, name, tier: pr.tier, months: pr.months, cost: pr.cost, done: 0, ...where };
    if (pr.tier >= 2) news(G, H, "project_started", pr.tier, slotsR(i, { project: name, place: where.name }), { realm: i, prov: where.prov });
  });

  /* intrigue */
  S.states.forEach((s, i) => {
    if (!alive[i]) return;
    const d = H.realm[i], spy = H.people[d.spymaster]; if (!spy || !spy.alive) return;
    const rivals = Y.relations.filter(r => (r.a === i || r.b === i) && (r.status === "rival" || r.op < -30)).map(r => r.a === i ? r.b : r.a).filter(t => alive[t]);
    if (!rivals.length || rng.f() > 0.012 * spy.sk.int / 5 * fx(H, d.ruler, "int")) return;
    const t = rivals[Math.floor(rng.f() * rivals.length)], dt = H.realm[t], their = H.people[dt.spymaster];
    const sl = { ...slotsR(i), realm2: S.states[t].name, short2: S.states[t].short, ruler2: Y.realms[t].ruler, person: spy.name }, where = { realm: i, realms: [i, t], prov: S.states[t].capital };
    if (rng.f() < 0.25 + (their ? their.sk.int * 0.04 : 0) - spy.sk.int * 0.02) {
      const rel = Y.relations.find(r => (r.a === i && r.b === t) || (r.a === t && r.b === i)); if (rel) rel.op -= 25;
      news(G, H, "spy_caught", 2, sl, where); return;
    }
    const r = rng.f();
    if (r < 0.4) {
      const f = FIELDS.map(x => x.id).find(fid => dt.fields[fid] > d.fields[fid] + 0.5);
      if (f) { d.fields[f] += 0.4; const inv = INVENTIONS.find(x => x.field === f && dt.known.has(x.id) && !d.known.has(x.id)); if (inv) d.known.add(inv.id); news(G, H, "tech_stolen", 2, { ...sl, invention: inv ? inv.n.toLowerCase() : "secrets", field: f }, where); }
    } else if (r < 0.7) {
      const border = S.states[t].provs.filter(p => provs[p].adj.some(q => S.own[q] === i));
      for (const p of border.slice(0, 3)) U[p] += 25;
      if (border.length && rng.chance(0.3)) news(G, H, "unrest_rising", 1, { ...sl, place: provs[border[0]].name }, { ...where, prov: border[0] });
    } else if (r < 0.9) {
      if (dt.project) { dt.project.done = Math.max(0, dt.project.done - Math.round(dt.project.months * 0.3)); news(G, H, "unrest_rising", 1, { ...sl, place: dt.project.name }, where); }
    } else {
      // an assassination: usually a commander or heir, rarely the ruler
      const targets = [...dt.commanders, dt.heir, ...(rng.chance(0.2) ? [dt.ruler] : [])].filter(x => x >= 0 && H.people[x].alive);
      if (targets.length) {
        const v = H.people[targets[Math.floor(rng.f() * targets.length)]]; v.alive = false; v.died = H.month; v.killed = true;
        news(G, H, "assassination", v.id === dt.ruler ? 3 : 2, { ...sl, person: v.name, title: v.role }, where);
        if (v.id === dt.ruler) succession(G, H, t, rng, flags);
        else { dt.commanders = dt.commanders.filter(x => x !== v.id); if (dt.heir === v.id) dt.heir = -1; }
      }
    }
  });

  /* the world itself */
  worldEvents(G, H, rng, alive, slotsR);

  /* storylines */
  const api = {
    flags,
    newsDirect: (kind, imp, h, b, where) => newsText(G, H, kind, imp, h, b, where),
    discover: (rid, field) => { const d = H.realm[rid], ctx = new Set(Y.realms[rid].tags); d.fields[field] = (d.fields[field] || 1) + 0.5; const inv = INVENTIONS.find(x => x.field === field && !d.known.has(x.id) && x.level <= Math.ceil(d.fields[field]) && allowed(x, ctx)); if (inv) d.known.add(inv.id); },
    heir: rid => { H.realm[rid].heir = newPerson(G, H, rid, "heir", 0, rng).id; },
    monument: (rid, prov, tier, name) => { const t = st[X.mainOf[prov]]; H.monuments.push({ id: H.monuments.length, month: H.month, pid: "story", name, tier, realm: rid, prov, x: t.x, y: t.y, year: dateOfMonth(G, H.month).year, builder: Y.realms[rid].ruler }); },
    plague: prov => { if (!H.plague) H.plague = { provs: new Set([prov]), months: rng.int(8, 20) }; else H.plague.provs.add(prov); },
    titan: prov => { const t = st[X.mainOf[prov]]; if (t) t.pop *= 0.75; },
    foundTown: rid => { if (foundTown(G, H, rid, rng, slotsR)) flags.towns = true; },
    revolt: (rid, prov) => { if (!inWar(rid) && S.states[rid].provs.length > 2) revolt(G, H, rid, prov, rng, flags, slotsR); },
    revolution: rid => revolution(G, H, rid, rng, slotsR),
    rulerDies: rid => { const p = H.people[H.realm[rid].ruler]; if (p) { p.alive = false; p.died = H.month; } succession(G, H, rid, rng, flags); },
    war: (rid, kind) => {
      if (inWar(rid)) return;
      const rels = Y.relations.filter(r => (r.a === rid || r.b === rid) && alive[r.a] && alive[r.b]).sort((a, b) => a.op - b.op);
      const r = kind === "rival" ? rels[0] : rels[Math.floor(rng.f() * rels.length)]; if (!r) return;
      const D = r.a === rid ? r.b : r.a; if (inWar(D)) return;
      const atWar = new Set(); for (const w of Z.wars) for (const a of [...w.attackers, ...w.defenders]) atWar.add(realmOf(a));
      declareWar(G, H, rid, D, rng, flags, slotsR, alive, atWar, r);
    },
    peace: rid => { const w = inWar(rid); if (w) { w.score = 0; makePeace(G, H, w, rng, flags, slotsR, realmOf, alive); Z.wars = Z.wars.filter(x => x !== w); Z.wars.forEach((x, i) => { x.id = i; }); flags.own = true; } },
  };
  storyStep(G, H, rng, alive, api);
  loreStep(G, H, rng, alive, (kind, imp, h, b, where) => newsText(G, H, kind, imp, h, b, where));

  /* yearly: roads and new towns */
  if (yearTick) {
    S.states.forEach((s, i) => {
      if (!alive[i]) return;
      const d = H.realm[i], ctx = new Set(Y.realms[i].tags);
      if (d.treasury > 60 && rng.f() < (ctx.has("great_roads") ? 0.25 : 0.08)) { if (buildRoad(G, H, i, rng)) { d.treasury -= 30; flags.roads = true; } }
      if (d.stability > 50 && rng.f() < 0.04) { if (foundTown(G, H, i, rng, slotsR)) flags.towns = true; }
    });
  }
}

/* ---------- succession, revolts, revolutions ---------- */
function succession(G, H, rid, rng, flags) {
  const { Y, S } = G, d = H.realm[rid], gov = GOV[Y.realms[rid].gov], heir = H.people[d.heir];
  const old = H.people[d.ruler];
  let crisis = false, next;
  if (gov.tags.includes("monarchy") && heir && heir.alive) {
    next = heir; heir.role = "ruler"; d.heir = -1;
    // a child or a weak heir invites rival claimants
    if (age(G, H, heir) < 16 || (heir.sk.dip < 4 && rng.chance(0.4)) || rng.chance(0.1)) crisis = true;
  } else {
    next = newPerson(G, H, rid, "ruler", rng.int(28, 60), rng);
    if (gov.tags.includes("monarchy") || gov.tags.includes("tribal")) crisis = rng.chance(0.45);
  }
  next.suffix = null; next.epithet = null;
  d.ruler = next.id; d.stability -= crisis ? 25 : 6;
  Y.realms[rid].ruler = rulerString(G, H, rid);
  const claimant = G.Y.cultures[G.Y.realms[rid].culture].lang.word(rng, null);
  const sl = { realm: S.states[rid].name, short: S.states[rid].short, ruler: Y.realms[rid].ruler, person: claimant, heir: next.name, place: G.X.settlements[G.X.mainOf[S.states[rid].capital]].name, gov: gov.n };
  if (crisis) {
    news(G, H, "succession_crisis", 3, sl, { realm: rid, prov: S.states[rid].capital });
    if (S.states[rid].provs.length > 5 && rng.chance(0.5)) {
      // a claimant raises the banner in a far province
      const far = S.states[rid].provs.slice().sort((a, b) => wrapDx(G.R.provs[b].cx - G.R.provs[S.states[rid].capital].cx) - wrapDx(G.R.provs[a].cx - G.R.provs[S.states[rid].capital].cx))[0];
      revolt(G, H, rid, far, rng, flags, (r, e) => ({ ...sl, ...e }), "claimant");
    }
  } else news(G, H, gov.tags.includes("monarchy") ? "coronation" : "succession", 2, sl, { realm: rid, prov: S.states[rid].capital });
  void old;
}
function revolt(G, H, rid, p0, rng, flags, slotsR, why = "revolt") {
  const { S, R, Z, Y } = G, provs = R.provs, U = H.unrest;
  const region = [p0], inR = new Set(region), want = clamp(Math.round(S.states[rid].provs.length * rng.range(0.1, 0.3)), 1, 30);
  for (let h = 0; h < region.length && region.length < want; h++) for (const q of provs[region[h]].adj) {
    if (S.own[q] === rid && !inR.has(q) && q !== S.states[rid].capital && (U ? U[q] > 25 : true) && region.length < want) { inR.add(q); region.push(q); }
  }
  const place = provs[p0].name, monarchy = Y.realms[rid].tags.includes("monarchy");
  const aid = 100000 + H.rebels++;
  const name = why === "claimant" ? `Loyalists of ${place}` : (monarchy ? rng.pick(["Free Commune of $", "$ Republic", "Rightful Crown of $"]) : rng.pick(["Kingdom of $", "Free $", "Holy $"])).replace("$", place);
  Z.actors[aid] = { id: aid, name, short: place, rgb: S.states[rid].rgb.map(v => v * 0.55), realm: -1, rebel: true, of: rid };
  for (const p of region) Z.control[p] = aid;
  const war = { id: Z.wars.length, name: (why === "claimant" ? "The War of the $ Succession" : rng.pick(["The $ Rebellion", "The $ Uprising", "The $ Revolt"])).replace("$", why === "claimant" ? S.states[rid].short : place),
    cb: "rebellion", cbName: why === "claimant" ? "Succession dispute" : "Rebellion", attackers: [aid], defenders: [rid], score: 0, days: 0, civil: true, why: [why === "claimant" ? "A rival claimant" : "Unrest boiled over"], start: H.month, sieges: {}, battles: 0, casualties: [0, 0] };
  Z.wars.push(war); flags.own = true;
  news(G, H, "revolt", 3, slotsR(rid, { place, realm2: name, war: war.name }), { realm: rid, prov: p0 });
}
function revolution(G, H, rid, rng, slotsR) {
  const { Y, S } = G, yr = Y.realms[rid], old = GOV[yr.gov];
  const ctx = new Set(yr.tags); ctx.add("revolution");
  for (const t of old.tags) ctx.delete(t);
  const cand = GOVERNMENTS.filter(g => g.id !== old.id);
  const gov = pickOne(rng, cand.map(g => ({ ...g, mods: [...(g.mods || []), ["egalitarian", g.tags.includes("republic") ? 3 : 1]] })), ctx, null) || GOV.feudal;
  yr.tags = yr.tags.filter(t => !old.tags.includes(t)).concat(gov.tags);
  yr.gov = gov.id;
  const d = H.realm[rid], np2 = newPerson(G, H, rid, "ruler", rng.int(30, 55), rng);
  if (H.people[d.ruler]) H.people[d.ruler].role = "deposed";
  d.ruler = np2.id; d.stability = 45; d.heir = -1; if (gov.tags.includes("republic")) d.termEnds = H.month + 48;
  S.states[rid].name = rng.pick(gov.forms).replace("$", S.states[rid].short);
  yr.ruler = rulerString(G, H, rid);
  news(G, H, "revolution", 3, slotsR(rid, { gov: gov.n, gov2: old.n }), { realm: rid, prov: S.states[rid].capital });
  realmTactics(G, H, rid);
}

/* ---------- war ---------- */
function power(G, H, rid) {
  const { S, X } = G, d = H.realm[rid]; let v = 0;
  for (const p of S.states[rid].provs) v += X.settlements[X.mainOf[p]].pop;
  const q = 0.8 + (d.fields.warfare || 2) * 0.08 + (d.fields.metallurgy || 2) * 0.04;
  return v * 0.18 * q * (1 - Math.min(0.8, d.exhaustion));
}
function terrainOf(G, p) {
  const t = provinceTags(G, p);
  return t.has("mountain") ? "mountain" : t.has("hills") ? "hills" : t.has("forest") ? "forest" : t.has("jungle") ? "forest" : t.has("marsh") ? "marsh" : t.has("desert") ? "desert" : t.has("steppe") ? "steppe" : t.has("cold") ? "cold" : "open";
}
function pickTactic(H, rid, terrain, commander, rng) {
  const d = H.realm[rid], opts = d.tactics.map(id => TAC[id]).filter(Boolean);
  let best = opts[0], bs = -1;
  for (const t of opts) { const s = (t.terrain[terrain] || 1) * rng.range(0.6, 1.4) * (commander && commander.traits.includes("brave") && t.id === "cavalry_charge" ? 1.4 : 1); if (s > bs) { bs = s; best = t; } }
  return best || TAC.shield_wall;
}
function warStep(G, H, rng, flags, alive, slotsR, realmOf) {
  const { S, Y, Z, R, X } = G, provs = R.provs, st = X.settlements;
  const sideOf = (w, a) => w.attackers.includes(a) ? 1 : w.defenders.includes(a) ? -1 : 0;
  const atWar = new Set(); for (const w of Z.wars) for (const a of [...w.attackers, ...w.defenders]) atWar.add(realmOf(a));

  // declarations
  for (const r of Y.relations) {
    if (!alive[r.a] || !alive[r.b] || atWar.has(r.a) || atWar.has(r.b) || r.op > -25) continue;
    const key = Math.min(r.a, r.b) * 100000 + Math.max(r.a, r.b); if ((H.truce.get(key) || -1) > H.month) continue;
    const [A, D] = power(G, H, r.a) >= power(G, H, r.b) ? [r.a, r.b] : [r.b, r.a];
    const appetite = 0.004 * fx(H, H.realm[A].ruler, "war") * (Y.realms[A].tags.includes("martial") ? 1.5 : 1) * (r.status === "rival" ? 2 : 1) * (H.realm[A].stability > 30 ? 1 : 0.3);
    if (rng.f() > appetite || power(G, H, A) < power(G, H, D) * 0.8) continue;
    declareWar(G, H, A, D, rng, flags, slotsR, alive, atWar, r);
  }

  // battles along the fronts, sieges, and peace
  const ended = [];
  for (const w of Z.wars) {
    w.days += 30;
    const fronts = (Z.fronts || []).filter(f => f.war === w.id && Z.control[f.a] !== Z.control[f.b]);
    const nB = fronts.length ? clamp(Math.round(fronts.length / 5), 1, 4) : 0;
    for (let k = 0; k < nB; k++) {
      if (rng.f() > 0.45) continue;
      const f = fronts[Math.floor(rng.f() * fronts.length)];
      const ca = Z.control[f.a], cb2 = Z.control[f.b], sa = sideOf(w, ca), sb = sideOf(w, cb2);
      if (!sa || !sb || sa === sb) continue;
      const aSide = sa === 1 ? ca : cb2, dSide = sa === 1 ? cb2 : ca, battleProv = sa === 1 ? f.b : f.a;
      // the stronger side presses, otherwise the defender counterattacks
      const ra = realmOf(aSide), rd = realmOf(dSide); if (ra < 0 || rd < 0 || !alive[ra] || !alive[rd]) continue;
      const pa = power(G, H, ra) * (Z.actors[aSide]?.rebel ? 0.35 : 1), pd = power(G, H, rd) * (Z.actors[dSide]?.rebel ? 0.35 : 1);
      const [atk, def, atkR, defR, prov] = rng.f() < pa / (pa + pd) ? [aSide, dSide, ra, rd, battleProv] : [dSide, aSide, rd, ra, battleProv === f.a ? f.b : f.a];
      const terrain = terrainOf(G, prov);
      const cA = H.people[H.realm[atkR].commanders[0]], cD = H.people[H.realm[defR].commanders[0]];
      const tA = pickTactic(H, atkR, terrain, cA, rng), tD = pickTactic(H, defR, terrain, cD, rng);
      const menA = Math.round(Math.min(power(G, H, atkR), 60000) * rng.range(0.2, 0.5)), menD = Math.round(Math.min(power(G, H, defR), 60000) * rng.range(0.2, 0.5));
      const match = (x, y) => (x.strong.includes(y.id) ? 1.35 : 1) * (x.weak.includes(y.id) ? 0.75 : 1);
      const town = st[G.X.mainOf[prov]], fort = town.walled ? 1.15 + H.realm[defR].fx.defence : 1;
      const sA = Math.pow(Math.max(100, menA), 0.9) * (1 + (cA ? cA.sk.mil : 3) * 0.05) * (tA.terrain[terrain] || 1) * match(tA, tD) * rng.range(0.75, 1.25);
      const sD = Math.pow(Math.max(100, menD), 0.9) * (1 + (cD ? cD.sk.mil : 3) * 0.05) * (tD.terrain[terrain] || 1) * match(tD, tA) * fort * rng.range(0.75, 1.25);
      const aWins = sA > sD, ratio = aWins ? sA / sD : sD / sA;
      const lossW = rng.range(0.04, 0.1), lossL = rng.range(0.12, 0.28) * Math.min(1.6, ratio);
      const casA = Math.round(menA * (aWins ? lossW : lossL)), casD = Math.round(menD * (aWins ? lossL : lossW));
      H.realm[atkR].exhaustion += casA / Math.max(2000, power(G, H, atkR)) * 0.5; H.realm[defR].exhaustion += casD / Math.max(2000, power(G, H, defR)) * 0.5;
      w.battles++; w.casualties[0] += sideOf(w, atk) === 1 ? casA : casD; w.casualties[1] += sideOf(w, atk) === 1 ? casD : casA;
      const winR = aWins ? atkR : defR, loseR = aWins ? defR : atkR, winC = aWins ? cA : cD, winT = aWins ? tA : tD, loseT = aWins ? tD : tA;
      const winSide = sideOf(w, aWins ? atk : def);
      w.score = clamp(w.score + winSide * (4 + ratio * 3), -100, 100);
      if (winC) { winC.wins++; winC.fame++; winC.deeds.push(`Won at ${provs[prov].name} (${dateOfMonth(G, H.month).year})`); if (winC.wins === 3 || winC.wins === 7) { news(G, H, "great_commander", 2, { ...slotsR(winR), commander: winC.name, person: winC.name, tactic: winT.n }, { realm: winR, prov }); if (winC.wins === 7) winC.epithet = "the Victorious"; } }
      news(G, H, "battle_won", 2, { ...slotsR(winR), realm2: S.states[loseR].name, short2: S.states[loseR].short, place: provs[prov].name, tactic: winT.n, tactic2: loseT.n, commander: winC ? winC.name : null, commander2: (aWins ? cD : cA)?.name, casualties: fmtN(aWins ? casD : casA), war: w.name }, { realm: winR, realms: [winR, loseR], prov });
      // the winner takes the ground; walled towns must be besieged first
      if (aWins) {
        if (town.walled && town.tier >= 2 && !w.sieges[prov]) { w.sieges[prov] = { by: atk, months: 2 + town.tier * 2, done: 0 }; news(G, H, "siege_started", 2, { ...slotsR(atkR), realm2: S.states[defR].name, place: town.name, war: w.name }, { realm: atkR, prov }); }
        else if (!town.walled || town.tier < 2) { Z.control[prov] = atk; flags.own = true; }
      }
    }
    // sieges grind on
    for (const [p, sg] of Object.entries(w.sieges)) {
      if (Z.control[p] === sg.by) { delete w.sieges[p]; continue; }
      sg.done++;
      if (rng.f() < 0.04) { delete w.sieges[p]; news(G, H, "siege_lifted", 2, { ...slotsR(realmOf(Z.control[p])), place: st[X.mainOf[p]].name, war: w.name }, { realm: realmOf(Z.control[p]), prov: +p }); continue; }
      if (sg.done >= sg.months) {
        Z.control[p] = sg.by; delete w.sieges[p]; flags.own = true;
        const rr = realmOf(sg.by); if (rr >= 0) news(G, H, "siege_fallen", 2, { ...slotsR(rr), place: st[X.mainOf[p]].name, war: w.name }, { realm: rr, prov: +p });
        st[X.mainOf[p]].pop *= 0.85;
      }
    }
    // occupation feeds the score
    let occA = 0, occD = 0;
    for (const p of [...w.defenders.flatMap(a => S.states[realmOf(a)] ? S.states[realmOf(a)].provs : [])]) if (sideOf(w, Z.control[p]) === 1) occA++;
    for (const p of [...w.attackers.flatMap(a => Z.actors[a]?.rebel ? [] : S.states[realmOf(a)] ? S.states[realmOf(a)].provs : [])]) if (sideOf(w, Z.control[p]) === -1) occD++;
    w.score = clamp(w.score + (occA - occD) * 0.4, -100, 100);
    // peace
    const lead = [realmOf(w.attackers[0]), realmOf(w.defenders[0])];
    const exh = Math.max(H.realm[lead[0]]?.exhaustion || 0, H.realm[lead[1]]?.exhaustion || 0);
    const months = H.month - w.start;
    if (Math.abs(w.score) >= 70 || (months > 18 && rng.f() < exh * 0.15) || months > 72 || lead.some(l => l < 0 || !alive[l])) ended.push(w);
  }
  for (const w of ended) makePeace(G, H, w, rng, flags, slotsR, realmOf, alive);
  if (ended.length) { Z.wars = Z.wars.filter(w => !ended.includes(w)); Z.wars.forEach((w, i) => { w.id = i; }); flags.own = true; }
}
export function declareWar(G, H, A, D, rng, flags, slotsR, alive, atWar, r) {
  const { S, Y, Z, R } = G, provs = R.provs;
  r = r || Y.relations.find(q => (q.a === A && q.b === D) || (q.a === D && q.b === A)) || { status: "neutral", why: [] };
  const ctx = new Set();
  for (const t of Y.realms[A].tags) ctx.add("a:" + t);
  for (const t of Y.realms[D].tags) ctx.add("b:" + t);
  if (Y.realms[A].culture === Y.realms[D].culture) ctx.add("pair:same:culture");
  if (Y.realms[A].faith !== Y.realms[D].faith) ctx.add("pair:differ:faith");
  if (r.status === "rival") ctx.add("pair:rival");
  const cb = pickOne(rng, CASUS_BELLI, ctx, CASUS_BELLI[0]);
  const war = { id: Z.wars.length, name: rng.pick(cb.names).replace("$", rng.chance(0.5) ? S.states[D].short : provs[S.states[D].capital].name), cb: cb.id, cbName: cb.n,
    attackers: [A], defenders: [D], score: 0, days: 0, civil: false, why: (r.why || []).filter(w => w[1] < 0).map(w => w[0]).slice(0, 2), start: H.month, sieges: {}, battles: 0, casualties: [0, 0] };
  atWar.add(A); atWar.add(D);
  for (const [side, lead] of [[war.attackers, A], [war.defenders, D]]) for (const q of Y.relations) {
    if (q.status !== "alliance" || (q.a !== lead && q.b !== lead)) continue;
    const ally = q.a === lead ? q.b : q.a; if (!alive[ally] || atWar.has(ally) || !rng.chance(0.6)) continue;
    side.push(ally); atWar.add(ally);
  }
  Z.wars.push(war); flags.own = true;
  news(G, H, "war_declared", 3, { ...slotsR(A), realm2: S.states[D].name, short2: S.states[D].short, ruler2: Y.realms[D].ruler, war: war.name }, { realm: A, realms: [A, D], prov: S.states[D].capital });
  return war;
}
function makePeace(G, H, w, rng, flags, slotsR, realmOf, alive) {
  const { S, Y, Z, R, X } = G, provs = R.provs, sideOf = (a) => w.attackers.includes(a) ? 1 : w.defenders.includes(a) ? -1 : 0;
  const A = realmOf(w.attackers[0]), D = realmOf(w.defenders[0]), winSide = w.score > 15 ? 1 : w.score < -15 ? -1 : 0;
  const involved = new Set([...w.attackers, ...w.defenders].map(realmOf).filter(x => x >= 0 && x < H.realm.length));
  const taken = [];
  if (w.civil) {
    const rebel = w.attackers[0], parent = D, held = provs.map(p => p.id).filter(p => Z.control[p] === rebel);
    if (winSide === 1 && held.length) {
      // the rebels win their freedom: a new realm
      const nid = S.states.length, act = Z.actors[rebel], cap = held.slice().sort((a, b) => X.settlements[X.mainOf[b]].pop - X.settlements[X.mainOf[a]].pop)[0];
      const parentR = Y.realms[parent];
      const gov = act.name.includes("Republic") || act.name.includes("Commune") ? (act.name.includes("Commune") ? "commune" : "noble_republic") : "feudal";
      S.states.push({ id: nid, name: act.name, short: act.short, capital: cap, provs: [], cells: 0, rgb: S.states[parent].rgb.map((v, i) => clamp(v * (i === (nid % 3) ? 0.7 : 1.15), 30, 240)), heart: provs[cap].heart });
      Y.realms.push({ ...parentR, id: nid, gov, tags: parentR.tags.filter(t => !GOV[parentR.gov].tags.includes(t)).concat(GOV[gov].tags), origin: "rebellion", originText: `Born in revolt against ${S.states[parent].name} in ${dateOfMonth(G, H.month).year}.`, founded: dateOfMonth(G, H.month).year, ideals: parentR.ideals, minorities: [], ruler: "" });
      Z.actors[nid] = { id: nid, name: act.name, short: act.short, rgb: S.states[nid].rgb, realm: nid, rebel: false };
      Z.templates[nid] = Z.templates[parent];
      const d = { ...H.realm[parent], fields: { ...H.realm[parent].fields }, known: new Set(H.realm[parent].known), institutions: [], treasury: 30, stability: 55, prestige: 10, exhaustion: 0.2, project: null, commanders: [], scholars: [], fx: { trade: 0, growth: 0, defence: 0, science: 0 }, dead: false };
      H.realm.push(d);
      d.ruler = newPerson(G, H, nid, "ruler", rng.int(30, 55), rng).id; d.heir = -1; d.spymaster = -1; d.diplomat = -1; d.termEnds = GOV[gov].tags.includes("republic") ? H.month + 48 : 0;
      Y.realms[nid].ruler = rulerString(G, H, nid);
      realmTactics(G, H, nid);
      for (const p of held) { S.own[p] = nid; taken.push(p); }
      Y.relations.push({ a: parent, b: nid, op: -50, base: -40, status: "rival", why: [["Won its freedom by the sword", -40]], border: 5 });
      for (const q of Y.relations.filter(r => r.a === parent || r.b === parent)) { const o = q.a === parent ? q.b : q.a; if (o !== nid) Y.relations.push({ a: nid, b: o, op: q.op * 0.5, base: 0, status: "neutral", why: [], border: 0 }); }
      news(G, H, "independence", 3, { ...slotsR(parent), realm2: act.name, short2: act.short, war: w.name, place: X.settlements[X.mainOf[cap]].name }, { realm: parent, realms: [parent, nid], prov: cap });
    } else news(G, H, "rebels_crushed", 2, { ...slotsR(parent), war: w.name, place: Z.actors[rebel]?.short }, { realm: parent, prov: S.states[parent].capital });
    for (const p of held) if (S.own[p] !== Z.control[p] || Z.control[p] === rebel) Z.control[p] = S.own[p];
    delete Z.actors[rebel];
  } else if (winSide) {
    const W2 = winSide === 1 ? A : D, L = winSide === 1 ? D : A, winners = new Set((winSide === 1 ? w.attackers : w.defenders).map(realmOf));
    // the winner keeps (some of) what it holds of the loser's land
    const held = S.states[L].provs.filter(p => winners.has(realmOf(Z.control[p])));
    const keep = w.cb === "raid" || w.cb === "trade_war" ? 0 : Math.ceil(held.length * (Math.abs(w.score) >= 70 ? 1 : 0.6));
    for (const p of held.slice(0, keep)) { if (p === S.states[L].capital && S.states[L].provs.length - taken.length > 1) continue; S.own[p] = realmOf(Z.control[p]); taken.push(p); }
    H.realm[W2].prestige += 10; H.realm[L].prestige = Math.max(0, H.realm[L].prestige - 8); H.realm[L].stability -= 10;
    news(G, H, taken.length ? "peace_signed" : "white_peace", 3, { ...slotsR(W2), realm2: S.states[L].name, short2: S.states[L].short, ruler2: Y.realms[L].ruler, war: w.name, count: String(taken.length), place: taken.length ? provs[taken[0]].name : null }, { realm: W2, realms: [W2, L], prov: taken[0] ?? S.states[L].capital });
    if (taken.length > 1) news(G, H, "province_ceded", 2, { ...slotsR(W2), realm2: S.states[L].name, place: provs[taken[0]].name, count: String(taken.length) }, { realm: W2, realms: [W2, L], prov: taken[0] });
  } else news(G, H, "white_peace", 2, { ...slotsR(A), realm2: S.states[D].name, short2: S.states[D].short, war: w.name }, { realm: A, realms: [A, D], prov: S.states[D].capital });
  // everything returns to its (new) owner; a truce follows
  for (let p = 0; p < provs.length; p++) if (involved.has(realmOf(Z.control[p])) || involved.has(S.own[p])) Z.control[p] = S.own[p];
  for (const a of involved) for (const b of involved) if (a < b) H.truce.set(a * 100000 + b, H.month + 60);
  for (const r of Y.relations) if (involved.has(r.a) && involved.has(r.b) && ((w.attackers.map(realmOf).includes(r.a) && w.defenders.map(realmOf).includes(r.b)) || (w.attackers.map(realmOf).includes(r.b) && w.defenders.map(realmOf).includes(r.a)))) { r.op -= 15; r.base = (r.base ?? 0) - 10; }
  for (const a of involved) H.realm[a].exhaustion *= 0.5;
  if (taken.length) rebuildRealms(G, H, flags);
}
// ownership changed: province lists, capitals, dead realms, per-cell ownership
export function rebuildRealms(G, H, flags) {
  const { S, R, M, X, Z } = G, np = R.provs.length;
  for (const s of S.states) s.provs = [];
  for (let p = 0; p < np; p++) { const o = S.own[p]; if (o >= 0 && S.states[o]) S.states[o].provs.push(p); }
  S.states.forEach((s, i) => {
    let cells = 0; for (const p of s.provs) cells += R.provs[p].size; s.cells = cells;
    if (!s.provs.length) { if (!H.realm[i].dead) { H.realm[i].dead = true; } return; }
    if (S.own[s.capital] !== i) {
      // the capital was lost: the biggest remaining town becomes the new one
      const c = s.provs.slice().sort((a, b) => X.settlements[X.mainOf[b]].pop - X.settlements[X.mainOf[a]].pop)[0];
      X.settlements[X.mainOf[s.capital]].capital = false; s.capital = c; X.settlements[X.mainOf[c]].capital = true;
    }
    s.heart = R.provs[s.capital].heart;
  });
  for (const i of R.land) S.cellState[i] = S.own[R.owner[i]];
  flags.own = true;
}

/* ---------- projects ---------- */
function projectSite(G, rid, pr, rng) {
  const { S, R, X, Y } = G, s = S.states[rid], provs = R.provs, st = X.settlements, cap = s.capital;
  const at = p => { const t = st[X.mainOf[p]]; return { prov: p, x: t.x, y: t.y, name: t.name }; };
  if (pr.place === "capital") return at(cap);
  if (pr.place === "river") { const p = s.provs.find(q => provs[q].rivers.length); return p != null ? { ...at(p), name: R.rivers[provs[p].rivers[0]].name } : null; }
  if (pr.place === "coast") { const p = s.provs.filter(q => st[X.mainOf[q]].port).sort((a, b) => st[X.mainOf[b]].pop - st[X.mainOf[a]].pop)[0]; return p != null ? at(p) : null; }
  if (pr.place === "mountain") { const p = s.provs.find(q => provs[q].terr >= 2); return p != null ? { prov: p, x: provs[p].cx, y: provs[p].cy, name: provs[p].name } : null; }
  if (pr.place === "holy") { const f = Y.faiths[Y.realms[rid].faith]; return S.own[f.holy.prov] === rid ? at(f.holy.prov) : null; }
  if (pr.place === "border") { const p = s.provs.find(q => provs[q].adj.some(o => S.own[o] >= 0 && S.own[o] !== rid)); return p != null ? { prov: p, x: provs[p].cx, y: provs[p].cy, name: provs[p].name } : null; }
  return at(cap);
}
function completeProject(G, H, rid, rng, slotsR) {
  const d = H.realm[rid], pj = d.project, pr = PROJECTS.find(x => x.id === pj.pid);
  d.project = null;
  for (const [k, v] of Object.entries(pr.fx)) {
    if (k === "prestige") d.prestige += v; else if (k === "stability") d.stability += v;
    else if (k === "science") d.fx.science += v; else if (k === "trade") d.fx.trade += v; else if (k === "defence") d.fx.defence += v; else if (k === "growth") d.fx.growth += v;
  }
  const ruler = H.people[d.ruler]; if (ruler && pr.tier >= 2 && !ruler.epithet && rng.chance(0.4)) { ruler.epithet = "the Builder"; G.Y.realms[rid].ruler = rulerString(G, H, rid); }
  H.monuments.push({ id: H.monuments.length, month: H.month, pid: pr.id, name: pj.name, tier: pr.tier, realm: rid, prov: pj.prov, x: pj.x, y: pj.y, year: dateOfMonth(G, H.month).year, builder: G.Y.realms[rid].ruler });
  news(G, H, pr.tier === 3 ? "wonder_completed" : pr.tier === 2 ? "project_completed" : "monument_completed", pr.tier, slotsR(rid, { project: pj.name, place: pj.name.includes(pj.name) ? G.X.settlements[G.X.mainOf[pj.prov]].name : pj.name }), { realm: rid, prov: pj.prov, x: pj.x, y: pj.y });
}

/* ---------- the world ---------- */
function worldEvents(G, H, rng, alive, slotsR) {
  const { S, R, X, F, Y } = G, provs = R.provs, st = X.settlements, np = provs.length;
  // plague: starts in a city and spreads along neighbours for a year or two
  if (H.plague) {
    const pl = H.plague; pl.months--;
    for (const p of [...pl.provs]) for (const q of provs[p].adj) if (!pl.provs.has(q) && rng.f() < 0.08) pl.provs.add(q);
    if (pl.months <= 0) H.plague = null;
  } else if (rng.f() < 0.004 * Math.sqrt(np / 1500)) {
    const cities = st.filter(s => s.tier >= 3 && !s.abandoned); if (cities.length) {
      const s = cities[Math.floor(rng.f() * cities.length)], o = S.own[s.prov];
      H.plague = { provs: new Set([s.prov]), months: rng.int(8, 24) };
      news(G, H, "plague", 3, slotsR(o >= 0 ? o : 0, { place: s.name }), { realm: o, prov: s.prov });
    }
  }
  if (rng.f() < 0.006 * Math.sqrt(np / 1500)) {
    const alv = S.states.map((_, i) => i).filter(i => alive[i]), rid = alv[Math.floor(rng.f() * alv.length)];
    if (rid != null) { for (const p of S.states[rid].provs) { st[X.mainOf[p]].pop *= 0.94; if (H.unrest) H.unrest[p] += 12; } H.realm[rid].stability -= 6; news(G, H, "famine", 2, slotsR(rid), { realm: rid, prov: S.states[rid].capital }); }
  }
  if (F.volcanoes.length && rng.f() < 0.003) {
    const v = F.volcanoes[Math.floor(rng.f() * F.volcanoes.length)], s = st[X.mainOf[v.prov]], o = S.own[v.prov];
    s.pop *= 0.9; news(G, H, "earthquake", 2, slotsR(o >= 0 ? o : 0, { place: s.name, site: v.name }), { realm: o, prov: v.prov });
  }
  if (F.titans.length && rng.f() < 0.004) {
    const t = F.titans[Math.floor(rng.f() * F.titans.length)], edge = t.provs.flatMap(p => provs[p].adj).filter(q => F.titan[q] < 0 && S.own[q] >= 0);
    if (edge.length) { const p = edge[Math.floor(rng.f() * edge.length)], s = st[X.mainOf[p]]; s.pop *= 0.7; news(G, H, "titan_rampage", 3, slotsR(S.own[p], { place: s.name, titan: t.name.split(",")[0] }), { realm: S.own[p], prov: p }); }
  }
  if (F.sites.length && rng.f() < 0.003) {
    const site = F.sites[Math.floor(rng.f() * F.sites.length)], o = S.own[site.prov];
    news(G, H, "mystery_stirs", 2, slotsR(o >= 0 ? o : 0, { site: site.name, place: provs[site.prov].name }), { realm: o, prov: site.prov });
  }
  if (rng.f() < 0.02) {
    const alv = S.states.map((_, i) => i).filter(i => alive[i]), rid = alv[Math.floor(rng.f() * alv.length)];
    if (rid != null) { const fa = Y.faiths[Y.realms[rid].faith], fe = fa.festivals[0]; news(G, H, "festival", 1, slotsR(rid, { project: fe ? fe.name : "the harvest feast" }), { realm: rid, prov: S.states[rid].capital }); }
  }
  wildlifeEvents(G, H, rng, alive, slotsR);
  if (rng.f() < 0.003) {
    const alv = S.states.map((_, i) => i).filter(i => alive[i] && Y.realms[i].tags.includes("zealous")), rid = alv[Math.floor(rng.f() * alv.length)];
    if (rid != null) { const p = S.states[rid].provs[Math.floor(rng.f() * S.states[rid].provs.length)]; if (H.unrest) H.unrest[p] += 20; news(G, H, "heresy", 2, slotsR(rid, { place: provs[p].name }), { realm: rid, prov: p }); }
  }
}

/* ---------- wildlife and the sea ---------- */
const FAUNA_ALL = Object.fromEntries([...FAUNA, ...MARINE_FAUNA].map(f => [f.id, f]));
const MONSTER = Object.fromEntries(SEA_MONSTERS.map(m => [m.id, m]));
function wildlifeEvents(G, H, rng, alive, slotsR) {
  const { S, X, E, R } = G; if (!E) return;
  const st = X.settlements, np = R.provs.length;
  const townNear = (x, y, maxW, port) => { let best = null, bd = maxW * maxW; for (const s of st) { if (s.abandoned || s.tier < 1 || (port && !s.port)) continue; const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = s; } } return best; };
  const where = s => ({ realm: S.own[s.prov], prov: s.prov });
  const sl = (s, beast, zone) => ({ ...slotsR(S.own[s.prov] >= 0 ? S.own[s.prov] : 0, { place: s.name, beast, zone }) });
  // sea monsters prey on shipping near the ports closest to their waters
  for (const z of E.marine.zones) {
    if (!z.monster || rng.f() > 0.004) continue;
    const port = townNear(z.cx, z.cy, 60, true); if (!port || S.own[port.prov] < 0) continue;
    port.pop *= 0.985; news(G, H, "monster_attack", 2, sl(port, z.monster.n, z.name), where(port));
    // a seafaring or martial realm may send hunters after it
    const rid = S.own[port.prov], tags = new Set(G.Y.realms[rid].tags);
    if (rng.f() < 0.15 * ((tags.has("navy") ? 2 : 1) + (tags.has("seafaring") ? 1 : 0) + (tags.has("beast_tamers") ? 1 : 0))) {
      news(G, H, "monster_slain", 2, sl(port, z.monster.n, z.name), where(port)); z.monster = null; H.ecoChanged = true; H.realm[rid].prestige += 6;
    }
  }
  // herds on the move, whaling, strandings, rare sightings, rich seasons
  if (rng.f() < 0.02) {
    const zs = E.zones.filter(z => ["grass", "savanna", "tundra", "coldsteppe"].includes(BIOMES[z.biome].k)); const z = zs[Math.floor(rng.f() * zs.length)];
    const herd = z && z.fauna.map(id => FAUNA_ALL[id]).find(f => f && f.kind === "grazer");
    const p = z ? G.R.provs.findIndex((_, i) => E.zoneOf[i] === z.id) : -1;
    if (herd && p >= 0) { const t = st[X.mainOf[p]]; news(G, H, "migration", 1, sl(t, herd.n, z.name), where(t)); }
  }
  if (rng.f() < 0.01) {
    const mz = E.marine.zones[Math.floor(rng.f() * E.marine.zones.length)], f = mz && mz.fauna.map(id => FAUNA_ALL[id]).find(x => x && (x.kind === "marine" || x.kind === "beast"));
    const port = mz && townNear(mz.cx, mz.cy, 80, true);
    if (f && port && S.own[port.prov] >= 0) {
      const tags = new Set(G.Y.realms[S.own[port.prov]].tags), kind = tags.has("seafaring") && rng.chance(0.5) ? "whaling" : rng.chance(0.5) ? "stranding" : "beast_sighting";
      news(G, H, kind, 1, sl(port, f.n, mz.name), where(port));
    }
  }
  if (rng.f() < 0.006) {
    const mz = E.marine.zones.filter(z => z.key === "shelf" || z.key === "kelp" || z.key === "reef"); const z = mz[Math.floor(rng.f() * mz.length)];
    const f = z && z.fauna.map(id => FAUNA_ALL[id]).find(x => x && x.kind === "fish"), port = z && townNear(z.cx, z.cy, 40, true);
    if (f && port && S.own[port.prov] >= 0) { port.pop *= 1.01; news(G, H, "bloom", 1, sl(port, f.n, z.name), where(port)); }
  }
  // hunting pressure: a zone near a great city can lose a species
  if (rng.f() < 0.004) {
    const cities = st.filter(s => s.tier >= 3 && !s.abandoned), c = cities[Math.floor(rng.f() * cities.length)];
    if (c && c.prov < np) {
      const z = E.zones[E.zoneOf[c.prov]], game = z && z.fauna.filter(id => { const f = FAUNA_ALL[id]; return f && (f.kind === "grazer" || f.kind === "predator") && !f.magic; });
      if (game && game.length && z.fauna.length > 4) { const id = game[Math.floor(rng.f() * game.length)]; z.fauna = z.fauna.filter(x => x !== id); H.ecoChanged = true; news(G, H, "overhunting", 1, sl(c, FAUNA_ALL[id].n, z.name), where(c)); }
    }
  }
  void MONSTER;
}

/* ---------- roads and towns ---------- */
function buildRoad(G, H, rid, rng) {
  const { S, R, X, M, T, C } = G, provs = R.provs, st = X.settlements;
  if (!H.roadPairs) { H.roadPairs = new Set(); for (const r of X.roads) H.roadPairs.add(Math.min(r.a, r.b) * 100000 + Math.max(r.a, r.b)); }
  const cand = [];
  for (const p of S.states[rid].provs) for (const q of provs[p].adj) {
    if (q < p || S.own[q] !== rid) continue;
    const a = X.mainOf[p], b = X.mainOf[q]; if (st[a].tier + st[b].tier < 2 || H.roadPairs.has(Math.min(a, b) * 100000 + Math.max(a, b))) continue;
    cand.push([a, b]);
  }
  if (!cand.length) return false;
  const [a, b] = cand[Math.floor(rng.f() * cand.length)], s1 = st[a], s2 = st[b];
  // least-cost path over the two provinces' cells (as the generator lays roads)
  const pa = s1.prov, pb = s2.prov, goal = s2.cell, dist = new Map(), prev = new Map(), hp = new Heap();
  const { x, y, nStart, nbr } = M;
  dist.set(s1.cell, 0); hp.push(s1.cell, 0);
  while (hp.size) {
    const c = hp.pop(), dc = dist.get(c); if (c === goal) break; if (hp.lk - Math.hypot(x[c] - x[goal], y[c] - y[goal]) > dc + 1e-9) continue;
    for (let k = nStart[c]; k < nStart[c + 1]; k++) {
      const n = nbr[k]; if (T.type[n] !== 0) continue; const o = R.owner[n]; if (o !== pa && o !== pb) continue;
      const nd = dc + Math.hypot(x[n] - x[c], y[n] - y[c]) * (1 + T.slope[n] * 60 + T.e[n] * 1.5) + (C.river[n] && !C.river[c] ? M.s * 2.5 : 0);
      if (nd < (dist.has(n) ? dist.get(n) : Infinity)) { dist.set(n, nd); prev.set(n, c); hp.push(n, nd + Math.hypot(x[n] - x[goal], y[n] - y[goal])); }
    }
  }
  if (!dist.has(goal)) return false;
  const cells = [goal]; while (cells[cells.length - 1] !== s1.cell) cells.push(prev.get(cells[cells.length - 1]));
  cells.reverse();
  const rd = { a, b, cls: 1, cells, built: H.month };
  X.roads.push(rd); H.roadPairs.add(Math.min(a, b) * 100000 + Math.max(a, b));
  // world geometry, as the generator writes it
  const pts = cells.map(c => [x[c], y[c]]); pts[0] = [s1.x, s1.y]; pts[pts.length - 1] = [s2.x, s2.y];
  // new pieces are collected and joined onto the world's road geometry once per batch
  if (!H.newSegs) H.newSegs = [];
  const segs = H.newSegs;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i === 0 ? pts[0] : [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
    const p2 = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    const ctrl = i === 0 ? [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2] : pts[i];
    segs.push(1, p0[0], p0[1], ctrl[0], ctrl[1], p2[0], p2[1]);
  }
  H.segsDirty = true;
  news(G, H, "road_built", 1, { realm: S.states[rid].name, short: S.states[rid].short, place: s1.name, place2: s2.name, ruler: G.Y.realms[rid].ruler }, { realm: rid, prov: pa });
  return true;
}
function foundTown(G, H, rid, rng, slotsR) {
  const { S, R, X, M, T } = G, provs = R.provs, st = X.settlements;
  const opts = S.states[rid].provs.filter(p => (FERTILITY[BIOMES[provs[p].biome].k] ?? 0.3) > 0.5 && provs[p].size > 4 && !st.some(s => s.founded && s.prov === p));
  if (!opts.length) return false;
  const p = opts[Math.floor(rng.f() * opts.length)], main = st[X.mainOf[p]];
  // a site in the province well away from its main town
  let best = -1, bd = 0;
  for (const c of provs[p].cells) { if (T.type[c] !== 0) continue; const d = Math.hypot(M.x[c] - main.x, M.y[c] - main.y); if (d > bd && rng.chance(0.5)) { bd = d; best = c; } }
  if (best < 0 || bd * G.worldKm / W < 12) return false;
  const lang = G.Y.cultures[G.Y.realms[rid].culture].lang, name = lang.word(rng, null);
  const s = { id: p * 100 + 90 + (H.founded++ % 9), prov: p, cell: best, x: M.x[best], y: M.y[best], tier: 1, pop: 180, pop0: 180, walled: false, port: false, name, capital: false, founded: H.month };
  st.push(s);
  news(G, H, "town_founded", 1, slotsR(rid, { place: name }), { realm: rid, prov: p, x: s.x, y: s.y });
  return true;
}

/* ---------- what the page needs after a batch ---------- */
export function historyView(G, H, since, flags) {
  const { S, Y, Z, X } = G;
  const out = {
    month: H.month, date: dateOfMonth(G, H.month), news: H.news.filter(n => n.id >= since),
    S: { own: S.own, states: S.states }, Y: { realms: Y.realms, relations: Y.relations },
    X: { pops: Float32Array.from(X.settlements, s => s.pop), tiers: Uint8Array.from(X.settlements, s => s.tier), gone: Uint8Array.from(X.settlements, s => s.abandoned ? 1 : 0), caps: Uint8Array.from(X.settlements, s => s.capital ? 1 : 0), n: X.settlements.length },
    H: {
      realm: H.realm.map(d => ({ treasury: d.treasury, stability: d.stability, prestige: d.prestige, exhaustion: d.exhaustion, dead: d.dead, fields: d.fields, known: [...d.known], institutions: d.institutions, tactics: d.tactics, project: d.project, ruler: d.ruler, heir: d.heir, commanders: d.commanders, scholars: d.scholars, spymaster: d.spymaster, diplomat: d.diplomat })),
      people: H.people.filter(p => p.alive || p.fame > 0 || p.role === "ruler" || p.role === "deposed" || p.role === "former ruler").map(p => ({ ...p, age: age(G, H, p) })),
      monuments: H.monuments, unrest: H.unrest, plague: H.plague ? [...H.plague.provs] : [],
      stories: (H.stories || []).map(s => ({ id: s.id, def: s.def, title: s.title, scale: s.scale, realm: s.realm, prov: s.prov, stage: s.stage, done: s.done, ending: s.ending, started: s.started, log: s.log, parent: s.parent })),
    },
  };
  if (flags.towns) out.X.added = X.settlements.filter(s => s.founded != null);
  if (H.segsDirty) {
    const old = X.roadSegs, add = H.newSegs, merged = new Float32Array(old.length + add.length);
    merged.set(old); merged.set(add, old.length); X.roadSegs = merged; X.roadCount = merged.length / 7; H.newSegs = []; H.segsDirty = false;
  }
  if (flags.roads) { out.X.roadSegs = X.roadSegs; out.X.roadCount = X.roadCount; out.X.roads = X.roads.filter(r => r.built != null).map(r => ({ a: r.a, b: r.b, cls: r.cls, cells: Int32Array.from(r.cells) })); }
  if (H.loreDirty && G.L) { out.L = { holders: G.L.holders, frags: G.L.frags, sites: G.L.sites }; H.loreDirty = false; }
  if (H.ecoChanged) { out.E = { zones: G.E.zones, marineZones: G.E.marine.zones }; H.ecoChanged = false; }
  if (flags.forces || flags.own) out.Z = { actors: Z.actors, wars: Z.wars, control: Z.control, warOf: Z.warOf, fronts: Z.fronts, armies: Z.armies, fleets: Z.fleets, templates: Z.templates };
  out.flags = flags;
  return out;
}
