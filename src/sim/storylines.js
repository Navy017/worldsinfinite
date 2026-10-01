import { makeRng } from "../core/util.js";
import { test } from "../core/rules.js";
import { fill } from "../core/text.js";
import { STORYLINES } from "../content/storylines.js";

// Storylines: stories that start somewhere in the world and unfold over months or years. Each is a
// small graph of stages (content/storylines.js). When a stage's wait is over, the next stage is
// chosen from its branches by weight, and the weights read the world as it is at that moment:
// a pious ruler, a lost war, an empty treasury, a plague, a choice the story made earlier. Stages
// change the world through a fixed set of effects (stability, a war, a revolt, a monument...),
// which the history layer carries out. Every stage entered is news and a line in the story's log.

const DEF = Object.fromEntries(STORYLINES.map(s => [s.id, s]));

// the tags a condition can read about a realm right now, on top of its static ones
export function liveTags(G, H, rid, flags) {
  const { S, Y, Z } = G, d = H.realm[rid], t = new Set(Y.realms[rid].tags);
  const realmOf = a => Z.actors[a] ? (Z.actors[a].rebel ? Z.actors[a].of : (Z.actors[a].realm ?? a)) : a;
  const war = Z.wars.find(w => [...w.attackers, ...w.defenders].some(a => realmOf(a) === rid));
  if (war) {
    t.add("atwar");
    const side = war.attackers.some(a => realmOf(a) === rid) ? 1 : -1;
    if (war.score * side > 15) t.add("winning"); else if (war.score * side < -15) t.add("losing");
  } else t.add("peace");
  if (d.stability > 60) t.add("stable"); else if (d.stability < 30) t.add("unstable");
  if (d.treasury > 300) t.add("rich"); else if (d.treasury < 0) t.add("poor");
  if (d.prestige > 40) t.add("prestigious");
  const n = S.states[rid].provs.length; if (n >= 30) t.add("big"); else if (n <= 5) t.add("small");
  const fl = Object.values(d.fields), avg = fl.reduce((a, b) => a + b, 0) / Math.max(1, fl.length);
  if (avg >= 3.2) t.add("learned"); else if (avg < 2) t.add("backward");
  if (H.plague && S.states[rid].provs.some(p => H.plague.provs.has(p))) t.add("plague");
  for (const r of Y.relations) if (r.a === rid || r.b === rid) { if (r.status === "rival") t.add("has:rival"); if (r.status === "alliance") t.add("has:ally"); }
  for (const m of H.monuments) if (m.realm === rid) { t.add("has:monument"); if (m.tier === 3) t.add("has:wonder"); }
  if (d.heir >= 0 && H.people[d.heir]?.alive) t.add("heir"); else t.add("no_heir");
  const ru = H.people[d.ruler];
  if (ru) {
    const age = Y.calendar.year + Math.floor(H.month / Y.calendar.months.length) - ru.born;
    if (age < 30) t.add("ruler:young"); else if (age > 60) t.add("ruler:old");
    for (const tr of ru.traits) t.add("ruler:" + tr);
  }
  if (flags) for (const f of flags) t.add("flag:" + f);
  return t;
}

// where a story can start
function pickAnchor(G, H, def, rng, alive) {
  const { S, X, F, R, Y, Z } = G, st = X.settlements, provs = R.provs;
  const realms = S.states.map((_, i) => i).filter(i => alive[i]);
  if (!realms.length) return null;
  const pickRealm = list => list[Math.floor(rng.f() * list.length)];
  const ok = rid => !def.req || test(def.req, liveTags(G, H, rid, null));
  // checking every realm is slow in big worlds: try a random handful
  const sample = list => { const out = []; for (let t = 0; t < 12 && list.length; t++) { const r = list[Math.floor(rng.f() * list.length)]; if (!out.includes(r) && ok(r)) out.push(r); if (out.length >= 3) break; } return out; };
  let rid = -1, prov = -1, extra = {};
  switch (def.anchor) {
    case "site": {
      const sites = F.sites.filter(s => (!def.site || def.site.includes(s.type)) && S.own[s.prov] >= 0 && alive[S.own[s.prov]] && ok(S.own[s.prov]));
      if (!sites.length) return null;
      const s = sites[Math.floor(rng.f() * sites.length)]; rid = S.own[s.prov]; prov = s.prov; extra.site = s.name; break;
    }
    case "titan": {
      if (!F.titans.length) return null;
      const t = F.titans[Math.floor(rng.f() * F.titans.length)];
      const edge = t.provs.flatMap(p => provs[p].adj).filter(q => S.own[q] >= 0 && alive[S.own[q]] && ok(S.own[q]));
      if (!edge.length) return null;
      prov = edge[Math.floor(rng.f() * edge.length)]; rid = S.own[prov]; extra.titan = t.name.split(",")[0]; break;
    }
    case "coast": {
      const ports = st.filter(s => s.port && s.tier >= 2 && !s.abandoned && S.own[s.prov] >= 0 && alive[S.own[s.prov]]).sort(() => 0).filter((s, i) => i % Math.max(1, Math.floor(st.length / 400)) === H.month % Math.max(1, Math.floor(st.length / 400))).filter(s => ok(S.own[s.prov])).slice(0, 20);
      if (!ports.length) return null;
      const s = ports[Math.floor(rng.f() * ports.length)]; rid = S.own[s.prov]; prov = s.prov; break;
    }
    case "war": {
      const at = sample(realms.filter(r => G.Z.wars.some(w => [...w.attackers, ...w.defenders].includes(r)))); if (!at.length) return null;
      rid = pickRealm(at); prov = S.states[rid].capital; break;
    }
    case "frontier": {
      const cands = sample(realms); if (!cands.length) return null;
      rid = pickRealm(cands);
      const border = S.states[rid].provs.filter(p => provs[p].adj.some(q => S.own[q] >= 0 && S.own[q] !== rid));
      if (!border.length) return null;
      prov = border[Math.floor(rng.f() * border.length)]; break;
    }
    case "town": {
      const cands = sample(realms); if (!cands.length) return null;
      rid = pickRealm(cands);
      const towns = S.states[rid].provs.map(p => st[X.mainOf[p]]).filter(s => s.tier >= 2 && !s.abandoned);
      prov = towns.length ? towns[Math.floor(rng.f() * towns.length)].prov : S.states[rid].capital; break;
    }
    default: {
      const cands = sample(realms); if (!cands.length) return null;
      rid = pickRealm(cands); prov = S.states[rid].capital;
    }
  }
  if (rid < 0) return null;
  void Y; void Z;
  return { rid, prov, ...extra };
}

function slotsFor(G, H, s) {
  const { S, Y, X, F, R, Z } = G, rid = s.realm, st = S.states[rid];
  const town = X.settlements[X.mainOf[s.prov]], fa = Y.faiths[Y.realms[rid].faith];
  const rel = Y.relations.filter(r => r.a === rid || r.b === rid);
  const rival = rel.filter(r => r.status === "rival" || r.op < -30).sort((a, b) => a.op - b.op)[0];
  const ally = rel.filter(r => r.status === "alliance" || r.op > 30).sort((a, b) => b.op - a.op)[0];
  const realmOf = a => Z.actors[a] ? (Z.actors[a].rebel ? Z.actors[a].of : (Z.actors[a].realm ?? a)) : a;
  const war = Z.wars.find(w => [...w.attackers, ...w.defenders].some(a => realmOf(a) === rid));
  const d = H.realm[rid], heir = d.heir >= 0 ? H.people[d.heir] : null;
  let beast = null; if (F.hostile[s.prov] >= 0) beast = F.hostRegions[F.hostile[s.prov]].creature; else for (const q of R.provs[s.prov].adj) if (F.hostile[q] >= 0) { beast = F.hostRegions[F.hostile[q]].creature; break; }
  const cal = Y.calendar;
  return {
    realm: st.name, short: st.short, ruler: Y.realms[rid].ruler, heir: heir && heir.alive ? heir.name : null, capital: X.settlements[X.mainOf[st.capital]].name,
    place: town ? town.name : R.provs[s.prov].name, site: s.site || null, titan: s.titan || null, faith: fa.name, deity: fa.deity, people: Y.cultures[Y.realms[rid].culture].adj,
    rival: rival ? S.states[rival.a === rid ? rival.b : rival.a].name : null, ally: ally ? S.states[ally.a === rid ? ally.b : ally.a].name : null,
    war: war ? war.name : null, person: s.person, person2: s.person2, year: String(cal.year + Math.floor(H.month / cal.months.length)),
    // a premise storyline can name the premise's recurring cast
    ...((G.L && G.L.cast && DEF[s.def] && G.L.cast[DEF[s.def].prem]) ? Object.fromEntries(Object.entries(G.L.cast[DEF[s.def].prem]).map(([k, c]) => [k, c.name])) : {}),
    beast, good: G.Q.goods[s.prov] && G.Q.goods[s.prov].length ? "goods" : null,
  };
}

// one month of storylines: maybe start one, and move on any whose wait is over
export function storyStep(G, H, rng, alive, api) {
  if (!H.stories) { H.stories = []; H.storySeq = 0; }
  const active = H.stories.filter(s => !s.done);
  const nRealms = alive.filter(Boolean).length;
  const cap = 4 + Math.round(nRealms / 5);
  if (active.length < cap && rng.f() < 0.2 * Math.sqrt(Math.max(1, nRealms) / 30)) {
    // a new story, never two of the same kind at once, and at most two world stories at a time
    const worldN = active.filter(s => s.scale === "world").length, running = new Set(active.map(s => s.def));
    // premise storylines only exist in worlds built on their premise, and are a little more likely there
    const prem = G.W ? G.W.ids : [];
    const cands = STORYLINES.filter(d => !running.has(d.id) && (d.scale !== "world" || worldN < 2) && (!d.prem || prem.includes(d.prem)));
    const wOf = d => (d.w ?? 1) * (d.prem ? 2.5 : 1);
    let tot = 0; for (const d of cands) tot += wOf(d);
    let r = rng.f() * tot, def = null; for (const d of cands) { r -= wOf(d); if (r <= 0) { def = d; break; } }
    if (def) {
      const a = pickAnchor(G, H, def, rng, alive);
      if (a && !active.some(s => s.realm === a.rid && s.scale !== "local")) {
        const lang = G.Y.cultures[G.Y.realms[a.rid].culture].lang, nrng = makeRng(G.seed + "|storynames|" + H.storySeq);
        const s = { id: H.storySeq++, def: def.id, title: "", scale: def.scale, realm: a.rid, prov: a.prov, site: a.site, titan: a.titan,
          person: lang.word(nrng, null), person2: lang.word(nrng, null), flags: [], stage: "start", started: H.month, nextAt: 0, log: [], done: false };
        s.title = fill(def.n, slotsFor(G, H, s)) || def.n.replace(/\{\w+\}/g, "").trim();
        H.stories.push(s);
        enter(G, H, s, "start", rng, api);
      }
    }
  }
  for (const s of active) {
    if (s.done || H.month < s.nextAt) continue;
    if (!alive[s.realm]) { s.done = true; s.ending = "faded"; continue; }
    const def = DEF[s.def], st = def && def.stages[s.stage];
    if (!st || st.end) { s.done = true; continue; }
    const tags = liveTags(G, H, s.realm, s.flags);
    const opts = (st.next || []).filter(b => DEF[s.def].stages[b.to] && (!b.req || test(b.req, withChance(tags, rng))));
    if (!opts.length) { s.done = true; s.ending = "faded"; continue; }
    const ws = opts.map(b => { let w = b.w ?? 1; for (const [c, m] of b.mods || []) if (test(c, withChance(tags, rng))) w *= m; return Math.max(0, w); });
    let tot = ws.reduce((a, b) => a + b, 0), r = rng.f() * tot, i = 0; while (i < opts.length - 1 && (r -= ws[i]) > 0) i++;
    enter(G, H, s, opts[i].to, rng, api);
  }
  if (H.stories.length > 300) H.stories = H.stories.filter(s => !s.done).concat(H.stories.filter(s => s.done).slice(-150));
}
function withChance(tags, rng) { const t = new Set(tags); if (rng.f() < 0.25) t.add("chance:low"); if (rng.f() < 0.75) t.add("chance:high"); return t; }

function enter(G, H, s, stageId, rng, api) {
  const def = DEF[s.def], st = def.stages[stageId];
  s.stage = stageId;
  if (st.fx) applyFx(G, H, s, st.fx, rng, api);
  const sl = slotsFor(G, H, s);
  const h = fill(st.h, sl) || s.title, b = fill(st.b, sl) || "";
  s.log.push({ month: H.month, stage: stageId, h, b });
  api.newsDirect("story", s.scale === "world" ? 3 : s.scale === "realm" ? 2 : 1 + (st.end ? 1 : 0), h, b, { realm: s.realm, prov: s.prov, story: s.id });
  if (st.end) { s.done = true; s.ending = stageId; s.endedAt = H.month; }
  else { const [a, z] = st.wait || [2, 6]; s.nextAt = H.month + a + Math.floor(rng.f() * (z - a + 1)); }
}

function applyFx(G, H, s, fx, rng, api) {
  const { S, X, R, Y } = G, d = H.realm[s.realm], rid = s.realm, town = X.settlements[X.mainOf[s.prov]];
  if (fx.stability) d.stability = Math.max(0, Math.min(100, d.stability + fx.stability));
  if (fx.prestige) d.prestige = Math.max(0, d.prestige + fx.prestige);
  if (fx.treasury) d.treasury += fx.treasury;
  if (fx.unrest && H.unrest) { H.unrest[s.prov] += fx.unrest; for (const q of R.provs[s.prov].adj) if (S.own[q] === rid) H.unrest[q] += fx.unrest * 0.6; }
  if (fx.pop && town) town.pop *= fx.pop;
  if (fx.growth) d.fx.growth += fx.growth;
  if (fx.science) for (const [f, v] of Object.entries(fx.science)) if (f in d.fields) d.fields[f] = Math.min(5.5, d.fields[f] + v);
  if (fx.discovery) api.discover(rid, fx.discovery);
  if (fx.flag) s.flags.push(fx.flag);
  if (fx.ruler_trait) { const p = H.people[d.ruler]; if (p && !p.traits.includes(fx.ruler_trait)) p.traits.push(fx.ruler_trait); }
  if (fx.heir) api.heir(rid);
  if (fx.relation) for (const [kind, v] of Object.entries(fx.relation)) {
    const rel = Y.relations.filter(r => (r.a === rid || r.b === rid) && (kind === "rival" ? r.op < 0 : r.op > 0)).sort((a, b) => kind === "rival" ? a.op - b.op : b.op - a.op)[0];
    if (rel) rel.op = Math.max(-100, Math.min(100, rel.op + v));
  }
  if (fx.monument) api.monument(rid, s.prov, fx.monument.tier || 1, fill(fx.monument.name || "Monument of {place}", slotsFor(G, H, s)) || "A monument");
  if (fx.plague) api.plague(s.prov);
  if (fx.titan) api.titan(s.prov);
  if (fx.found_town) api.foundTown(rid);
  if (fx.abandon_town && town && !town.capital) { town.abandoned = true; api.flags.towns = true; }
  if (fx.revolt) api.revolt(rid, s.prov);
  if (fx.revolution) api.revolution(rid);
  if (fx.ruler_dies) api.rulerDies(rid);
  if (fx.war) api.war(rid, fx.war);
  if (fx.peace) api.peace(rid);
  if (fx.spawn && DEF[fx.spawn]) {
    const ns = { id: H.storySeq++, def: fx.spawn, title: "", scale: DEF[fx.spawn].scale, realm: rid, prov: s.prov, site: s.site, titan: s.titan, person: s.person, person2: s.person2, flags: [], stage: "start", started: H.month, nextAt: H.month + 2, log: [], done: false, parent: s.id };
    ns.title = fill(DEF[fx.spawn].n, slotsFor(G, H, ns)) || DEF[fx.spawn].n;
    H.stories.push(ns);
    enter(G, H, ns, "start", rng, api);
  }
  void Y;
}
