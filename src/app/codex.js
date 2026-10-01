import { W } from "../core/tables.js";
import { makeRng } from "../core/util.js";
import { pickOne, test } from "../core/rules.js";
import { compose, capital1 } from "../core/text.js";
import { REALM_SECTIONS, CULTURE_SECTIONS, FAITH_SECTIONS, CURRENCY, TITLES } from "../content/lore.js";
import { CULTURE_TRAITS, FAITH_TYPES, DOCTRINES, GOVERNMENTS, ORIGINS, IDEALS } from "../content/society.js";
import { UNITS, SHIPS } from "../content/military.js";
import { LOOKUP } from "../content/lookup.js";
import { realmThemes } from "./journal.js";
import { GOODS } from "../content/goods.js";
import { realmScience, FIELD_NAMES } from "./science.js";
import { storiesFor } from "./stories.js";

// The codex: long-form pages about realms, cultures, faiths and markets, written by mixing and
// matching fragments from the content libraries (see core/text.js). Everything is deterministic
// per world, so a realm's page reads the same every time.

const byId = l => Object.fromEntries(l.map(x => [x.id, x]));
const TRAIT = byId(CULTURE_TRAITS), FTYPE = LOOKUP.faith, DOCT = byId(DOCTRINES), GOVT = LOOKUP.gov, ORIG = byId(ORIGINS), IDEAL = byId(IDEALS), UNIT = LOOKUP.unit, SHIP = byId(SHIPS);
void FAITH_TYPES; void GOVERNMENTS; void UNITS;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => Math.round(n).toLocaleString("en-US");
const para = list => list.map(t => `<p>${esc(t)}</p>`).join("");

/* ---------- facts about a realm, gathered once ---------- */
let cache = new WeakMap();
export function clearCodexCache() { cache = new WeakMap(); }
export function realmFacts(G, rid) {
  let byR = cache.get(G); if (!byR) cache.set(G, byR = new Map());
  if (byR.has(rid)) return byR.get(rid);
  const { S, R, Y, Z, Q, X } = G, st = S.states[rid], r = Y.realms[rid], cu = Y.cultures[r.culture], fa = Y.faiths[r.faith];
  const rng = makeRng(G.seed + "|codex|" + rid);
  const wars = Z.wars.filter(w => [...w.attackers, ...w.defenders].some(a => a === rid || Z.actors[a].of === rid));
  const ctx = new Set(r.tags); ctx.add(wars.length ? "atwar" : "peace");
  const rels = Y.relations.filter(x => x.a === rid || x.b === rid);
  const other = x => x.a === rid ? x.b : x.a;
  const rival = rels.filter(x => x.status === "rival" || x.status === "tense").sort((a, b) => a.op - b.op)[0];
  const ally = rels.filter(x => x.status === "alliance" || x.status === "friendly").sort((a, b) => b.op - a.op)[0];
  const gcount = new Map();
  let river = null, range = null, sea = null;
  for (const p of st.provs) {
    for (const g of Q.goods[p]) gcount.set(g, (gcount.get(g) || 0) + 1);
    const pr = R.provs[p];
    if (!river && pr.rivers.length) river = R.rivers[pr.rivers[0]].name;
    if (!range && pr.range >= 0) range = R.ranges[pr.range].name;
    if (!sea && pr.coastal && R.bodies[pr.coastBody]) sea = R.bodies[pr.coastBody].name;
  }
  const goods = [...gcount.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);
  // money
  const unit = pickOne(rng, CURRENCY.units.map((u, i) => ({ ...u, id: "u" + i })), ctx, { n: "mark" }).n;
  const metal = rng.pick(CURRENCY.metals), form = rng.pick(CURRENCY.forms);
  const currency = form.replace("$", metal).replace("{unit}", unit).replace(/^\s+/, "");
  const coin = Math.round(rng.range(0.5, 2.2) * 100) / 100; // how many trade units one coin is worth
  const capitalTown = X.settlements[X.mainOf[st.capital]];
  const festival = fa.festivals[0] ? fa.festivals[0].name : null;
  const slots = {
    realm: st.name, short: st.short, ruler: r.ruler, title: r.ruler.split(" ").slice(0, -2).join(" ") || r.ruler.split(" ")[0], capital: capitalTown.name,
    people: cu.adj, faith: fa.name, deity: fa.deity, land: R.masses[R.provs[st.capital].mass].name || null,
    good: goods[0] != null ? GOODS[goods[0]].n.toLowerCase() : null, good2: goods[1] != null ? GOODS[goods[1]].n.toLowerCase() : null,
    rival: rival ? S.states[other(rival)].name : null, ally: ally ? S.states[other(ally)].name : null,
    founded: String(r.founded), era: Y.calendar.eraShort, river, range, sea, currency,
    fallen: r.origin === "successor" || rng.chance(0.5) ? Y.fallen[r.fallen].name : null, holy: fa.holy.name, festival,
  };
  const f = { st, r, cu, fa, rng, ctx, slots, wars, rels, goods, currency, coin, capitalTown };
  byR.set(rid, f);
  return f;
}

/* ---------- realm codex ---------- */
export const REALM_TABS = [["overview", "Overview"], ["government", "Government"], ["figures", "Key people"], ["people", "Culture"], ["faith", "Faith"], ["military", "Military"],
  ["economy", "Economy"], ["science", "Science"], ["history", "History"], ["chronicle", "Chronicle"], ["relations", "Relations"], ["stories", "Stories"]];
const ROLE = { ruler: "Ruler", heir: "Heir", commander: "Commander", scholar: "Scholar", spymaster: "Spymaster", diplomat: "Diplomat", "former ruler": "Former ruler", deposed: "Deposed ruler" };
const skillBar = n => "●".repeat(Math.round(n / 2)) + "○".repeat(5 - Math.round(n / 2));

export function realmPage(G, rid, tab) {
  const f = realmFacts(G, rid), { st, r, cu, fa, slots, ctx } = f, { S, R, Y, Z, Q, X } = G;
  const rng = makeRng(G.seed + "|codex|" + rid + "|" + tab);  // each tab reads the same every time
  const sec = (lib, key, n) => compose(rng, lib[key], ctx, slots, n);
  const cctx = new Set([...cu.traits, ...cu.tags]), fctx = new Set([...FTYPE[fa.type].tags, ...fa.doctrines]);
  const kv = rows => `<dl class="kv">${rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>`;
  const Hd = G.H && G.H.realm[rid];
  switch (tab) {
    case "figures": {
      if (!G.H) {
        // before history runs: the ruler, the court, and anyone from the world's mysteries who lives here
        const cast = G.L && G.L.cast ? Object.values(G.L.cast).flatMap(o => Object.values(o)).filter(c => c.realm === rid) : [];
        return `<div class="story"><div class="scale">Ruler · reigning</div><b>${esc(r.ruler)}</b><p>${esc(GOVT[r.gov].n)} of ${esc(st.name)}, ruling from ${esc(f.capitalTown.name)}.</p></div>` +
          cast.map(c => `<div class="story"><div class="scale">Lives in ${esc(c.town)}</div><b>${esc(c.name)}</b>, ${esc(c.n)}<p class="note">Their writings turn up in libraries and archives. See the Journal's People tab once you have met them.</p></div>`).join("") +
          `<p class="note">Start the clock to bring the realm's people to life: heirs, commanders, scholars, spymasters and diplomats appear, age, win renown and die. The court's offices are listed on the Government tab.</p>`;
      }
      const people = G.H.people.filter(p => p.realm === rid).sort((a, b) => (b.alive - a.alive) || ((a.role === "ruler") ? -1 : 0) - ((b.role === "ruler") ? -1 : 0) || b.fame - a.fame);
      const row = p => `<div class="story${p.alive ? "" : " dead"}"><div class="scale">${ROLE[p.role] || p.role}${p.id === Hd.ruler ? " · reigning" : ""}${p.alive ? ` · age ${p.age}` : " · died" + (p.killed ? ", assassinated" : "")}</div>
        <b>${esc(p.name)}${p.epithet ? " " + esc(p.epithet) : ""}</b><p>${p.traits.map(t => esc(t[0].toUpperCase() + t.slice(1))).join(", ") || "Unremarkable"}</p>
        <p class="note">Martial ${skillBar(p.sk.mil)} · Diplomacy ${skillBar(p.sk.dip)} · Learning ${skillBar(p.sk.sci)} · Intrigue ${skillBar(p.sk.int)}${p.wins ? ` · ${p.wins} victories` : ""}</p>
        ${p.deeds.length ? `<ul>${p.deeds.slice(-4).map(d => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}</div>`;
      return people.slice(0, 30).map(row).join("") || "<p>No one of note.</p>";
    }
    case "chronicle": {
      const list = (G.news || []).filter(n => n.realms.includes(rid)).slice(-80).reverse();
      return list.length ? list.map(n => `<div class="newsitem"><small>${n.year} ${esc(n.mon)}</small><b>${esc(n.h)}</b><span>${esc(n.b)}</span></div>`).join("") : "<p>Nothing has happened yet. Start the clock (the month or year speeds are quickest) and history will be written here.</p>";
    }
    case "overview": {
      const gov = GOVT[r.gov];
      const state = Hd ? [["Stability", `${Math.round(Hd.stability)}%`], ["Treasury", `${Math.round(Hd.treasury)} ${esc(f.currency)}`], ["Prestige", Math.round(Hd.prestige)], ["War weariness", `${Math.round(Hd.exhaustion * 100)}%`]].concat(Hd.project ? [["Building", `${esc(Hd.project.name)} (${Math.round(Hd.project.done / Hd.project.months * 100)}%)`]] : []) : [];
      return para(sec(REALM_SECTIONS, "overview", 2)) + kv([...state, ["Ruler", esc(r.ruler)], ["Government", esc(gov.n)], ["Capital", esc(f.capitalTown.name)],
        ["Provinces", fmt(st.provs.length)], ["People", esc(cu.adj)], ["State faith", esc(fa.name)], ["Currency", esc(f.currency)], ["Founded", `${r.founded} ${esc(Y.calendar.eraShort)}`],
        ["Ideals", r.ideals.map(i => esc(IDEAL[i].n)).join(", ")], ["Main exports", f.goods.slice(0, 4).map(g => esc(GOODS[g].n)).join(", ")]]) + realmThemes(G, rid) +
        `<h4>Troubles</h4>` + para(sec(REALM_SECTIONS, "troubles", 2));
    }
    case "government": {
      const gov = GOVT[r.gov], lang = Y.cultures[r.culture];
      const nrng = makeRng(G.seed + "|court|" + rid), offices = TITLES.offices.slice().sort(() => nrng.f() - 0.5).slice(0, 5);
      const names = offices.map(() => `${nrng.pick(TITLES.nobles)} ${cu.name.slice(0, 2)}${nrng.pick(["ren", "vas", "thel", "mor", "adan", "ius", "orin", "ek", "ala", "ost"])}`);
      void lang;
      return `<p class="lead">${esc(gov.n)}: ${esc(gov.d)}</p>` + para(sec(REALM_SECTIONS, "government", 3)) +
        `<h4>Law</h4>` + para(sec(REALM_SECTIONS, "law", 2)) + `<h4>Succession</h4>` + para(sec(REALM_SECTIONS, "succession", 1)) +
        `<h4>The court</h4>` + kv([["Ruler", esc(r.ruler)], ...offices.map((o, i) => [esc(o), esc(names[i])])]) +
        `<h4>Ideals</h4>` + kv(r.ideals.map(i => [esc(IDEAL[i].n), esc(IDEAL[i].d)]));
    }
    case "people": {
      const cs = (k, n) => compose(rng, CULTURE_SECTIONS[k], cctx, slots, n);
      return `<p class="lead">The ${esc(cu.adj)} are ${cu.traits.map(t => esc(TRAIT[t].n.toLowerCase())).join(", ")}.</p>` +
        kv(cu.traits.map(t => [esc(TRAIT[t].n), esc(TRAIT[t].d)])) +
        `<h4>Values</h4>` + para(cs("values", 2)) + `<h4>Customs</h4>` + para(cs("customs", 2)) + `<h4>Food</h4>` + para(cs("food", 1)) +
        `<h4>Dress</h4>` + para(cs("dress", 1)) + `<h4>Arts</h4>` + para(cs("arts", 1)) + `<h4>Names</h4>` + para(cs("names", 1)) +
        (r.minorities.length ? `<h4>Other peoples in the realm</h4>` + kv(r.minorities.map(m => [esc(Y.cultures[m.culture].adj), `${Math.round(m.share * 100)}%`])) : "");
    }
    case "faith": {
      const fs = (k, n) => compose(rng, FAITH_SECTIONS[k], fctx, slots, n), cal = Y.calendar;
      return `<p class="lead">${esc(fa.name)}: ${esc(FTYPE[fa.type].d)}</p>` + kv(fa.doctrines.map(d => [esc(DOCT[d].n), esc(DOCT[d].d)])) +
        `<h4>Beliefs</h4>` + para(fs("beliefs", 2)) + `<h4>Rites</h4>` + para(fs("rites", 2)) + `<h4>Clergy</h4>` + para(fs("clergy", 1)) +
        `<h4>Death and after</h4>` + para(fs("afterlife", 1)) + `<h4>Symbols</h4>` + para(fs("symbols", 1)) +
        `<h4>Holy days</h4>` + para(fs("holy_days", 1)) + kv(fa.festivals.map(x => [esc(x.name), `${x.day} ${esc(cal.months[x.month].name)}`])) +
        kv([["Holy site", esc(fa.holy.name)], ["Followers", `${fmt(fa.provs)} provinces`]]);
    }
    case "military": {
      const armies = Z.armies.filter(a => a.realm === rid && !Z.actors[a.actor].rebel), fleets = Z.fleets.filter(fl => fl.realm === rid);
      const tpl = Z.templates[rid];
      return para(sec(REALM_SECTIONS, "military", 3)) +
        `<h4>Troop types</h4>` + kv(tpl.map(t => { const u = UNIT[t.unit]; return [esc(u.n), `${esc(u.role)}${u.mounted ? ", mounted" : ""} · ${esc(u.kit)} armour`]; })) +
        `<h4>Armies</h4>` + (armies.length ? kv(armies.map(a => [`<a href="#" data-goto="${a.x},${a.y}">${esc(a.name)}</a>`, `${fmt(a.men)} men · ${a.garrison ? "in barracks" : a.battle ? "in battle" : a.mode === "siege" ? "besieging " + esc(a.siege.name) : a.mode === "march" ? "on the march" : "encamped"} · ${esc(a.general)}`])) : "<p>No field armies.</p>") +
        `<h4>Navy</h4>` + (fleets.length ? kv(fleets.map(fl => [`<a href="#" data-goto="${fl.x},${fl.y}">${esc(fl.name)}</a>`, `${fl.ships.length} ships (${[...new Set(fl.ships.map(s => SHIP[s.type].n))].join(", ")}) · ${esc(fl.mission)}`])) : "<p>No navy.</p>");
    }
    case "economy": {
      const hubs = Q.hubs.filter(h => S.own[h] === rid);
      return para(sec(REALM_SECTIONS, "economy", 3)) + kv([["Currency", `${esc(f.currency)} (one coin is worth ${f.coin} trade units)`]]) +
        `<h4>What the realm produces</h4>` + kv(f.goods.slice(0, 10).map(g => [esc(GOODS[g].n), `${st.provs.filter(p => Q.goods[p].includes(g)).length} provinces`])) +
        `<h4>Markets</h4>` + (hubs.length ? kv(hubs.map(h => [`<a href="#" data-market="${h}">${esc(X.settlements[h].name)}</a>`, `trade ${Math.round(Q.through[h] * 100)}`])) : "<p>No great markets; trade passes through foreign towns.</p>");
    }
    case "science": {
      const sc = realmScience(G, rid, ctx);
      return `<p class="lead">${esc(sc.summary)}</p>` +
        `<h4>Fields of knowledge</h4><div class="bars">${sc.fields.map(x => `<div class="barrow"><span>${esc(x.n)}</span><span class="pips">${"●".repeat(x.level)}${"○".repeat(5 - x.level)}</span></div>`).join("")}</div>` +
        `<h4>Known inventions</h4>` + kv(sc.inventions.map(x => [esc(x.n), `${esc(FIELD_NAMES[x.field] || x.field)}: ${esc(x.d)}`])) +
        (sc.institutions.length ? `<h4>Institutions</h4>` + kv(sc.institutions.map(x => [esc(x.n), esc(x.d)])) : "") +
        (sc.discovery ? `<h4>Lately</h4><p>${esc(sc.discovery)}</p>` : "");
    }
    case "history": {
      const cal = Y.calendar, events = [];
      events.push([r.founded, `${ORIG[r.origin].n}: ${r.originText}`]);
      const hist = sec(REALM_SECTIONS, "history", 3), span = Math.max(1, cal.year - r.founded);
      hist.forEach((t, i) => events.push([r.founded + Math.round(span * (i + 1) / (hist.length + 1.5)), t]));
      const fallen = Y.fallen[r.fallen]; if (r.origin === "successor") events.unshift([cal.year - fallen.fell, `The ${fallen.name} falls.`]);
      events.push([cal.year - Math.max(1, Math.round(f.rng.range(1, 30))), `${r.ruler} comes to power.`]);
      for (const w of f.wars) events.push([cal.year - Math.floor(w.days / cal.yearDays), `${w.name} begins (${w.cbName.toLowerCase()}).`]);
      events.sort((a, b) => a[0] - b[0]);
      return `<ol class="timeline">${events.map(([y, t]) => `<li><b>${y} ${esc(cal.eraShort)}</b><span>${esc(t)}</span></li>`).join("")}</ol>`;
    }
    case "relations": {
      const STATUS = { alliance: "Allies", friendly: "Friendly", neutral: "Neutral", tense: "Tense", rival: "Rivals" };
      const rows = f.rels.slice().sort((a, b) => b.op - a.op).map(x => {
        const o = x.a === rid ? x.b : x.a;
        return `<span><a href="#" data-realm="${o}">${esc(S.states[o].name)}</a> · ${STATUS[x.status]}</span><span class="op ${x.op > 0 ? "pos" : x.op < 0 ? "neg" : ""}">${x.op > 0 ? "+" : x.op < 0 ? "−" : ""}${Math.abs(x.op)}</span><span class="why">${x.why.map(([w, d]) => `${esc(w)} ${d > 0 ? "+" : "−"}${Math.abs(d)}`).join(" · ")}</span>`;
      });
      return para(sec(REALM_SECTIONS, "foreign", 2)) + (f.wars.length ? `<h4>Wars</h4>` + f.wars.map(w => `<div class="tag t-danger"><b>${esc(w.name)}</b>${esc(w.cbName)} · ${w.attackers.map(a => esc(Z.actors[a].name)).join(" and ")} against ${w.defenders.map(a => esc(Z.actors[a].name)).join(" and ")}</div>`).join("") : "") +
        `<h4>Neighbours</h4><div class="rel">${rows.join("")}</div>`;
    }
    case "stories": {
      const s = storiesFor(G).byRealm(rid);
      if (!s.length) return "<p>Nothing of note is stirring here. Yet.</p>";
      return s.map(x => `<div class="story ${x.scale}"><div class="scale">${x.scale === "big" ? "World story" : x.scale === "medium" ? "Regional story" : "Rumour"}</div><b>${esc(x.title)}</b><p>${esc(x.text)}</p>${x.place != null ? `<a href="#" data-prov="${x.place}">Go there</a>` : ""}</div>`).join("");
    }
  }
  return "";
}

/* ---------- markets ---------- */
export function marketInfo(G, h) {
  const { Q, S, X } = G, k = Q.hubs.indexOf(h); if (k < 0) return null;
  const nG = GOODS.length, rid = S.own[h], f = rid >= 0 ? realmFacts(G, rid) : null;
  const avg = new Float64Array(nG), cnt = new Int32Array(nG);
  for (let i = 0; i < Q.hubs.length; i++) for (let g = 0; g < nG; g++) { const v = Q.prices[i * nG + g]; if (v === v) { avg[g] += v; cnt[g]++; } }
  const rows = [];
  for (let g = 0; g < nG; g++) {
    const v = Q.prices[k * nG + g]; if (v !== v) continue;
    const src = Q.source[k * nG + g];
    rows.push({ g, price: v, coin: f ? v / f.coin : v, vsAvg: cnt[g] ? v / (avg[g] / cnt[g]) - 1 : 0, local: src === h || G.R.provs[h].adj.includes(src) || src === -1, from: src >= 0 ? X.settlements[src].name : "" });
  }
  rows.sort((a, b) => GOODS[b.g].value - GOODS[a.g].value);
  return { h, k, town: X.settlements[h], realm: rid >= 0 ? S.states[rid] : null, currency: f ? f.currency : "trade units", coin: f ? f.coin : 1, rows };
}
export function marketPage(G, h, compareWith) {
  const m = marketInfo(G, h); if (!m) return "<p>Not a market town.</p>";
  const c = compareWith != null ? marketInfo(G, compareWith) : null;
  const byG = c ? new Map(c.rows.map(r => [r.g, r])) : null;
  const money = (v, mk) => `${v < 10 ? v.toFixed(2) : v.toFixed(1)}`;
  const others = G.Q.hubs.filter(x => x !== h).map(x => ({ x, d: Math.hypot(Math.min(Math.abs(G.X.settlements[x].x - m.town.x), W - Math.abs(G.X.settlements[x].x - m.town.x)), G.X.settlements[x].y - m.town.y) })).sort((a, b) => a.d - b.d).slice(0, 40);
  return `<p class="lead">${m.rows.length} kinds of goods for sale, priced in ${esc(m.currency)}.${m.realm ? ` Part of ${esc(m.realm.name)}.` : ""}</p>
    <label class="cmp">Compare with <select data-compare="${h}"><option value="">(choose a market)</option>${others.map(o => `<option value="${o.x}"${o.x === compareWith ? " selected" : ""}>${esc(G.X.settlements[o.x].name)}</option>`).join("")}</select></label>
    <div class="tablewrap"><table class="prices"><thead><tr><th>Good</th><th class="n">Price</th><th class="n">vs. average</th><th>Comes from</th>${c ? `<th class="n">${esc(c.town.name)}</th><th class="n">Difference</th>` : ""}</tr></thead><tbody>
    ${m.rows.map(r => {
      const o = byG && byG.get(r.g), pct = Math.round(r.vsAvg * 100);
      const diff = o ? Math.round((o.price / r.price - 1) * 100) : null;
      return `<tr><td><span class="sw" style="background:${GOODS[r.g].c}"></span>${esc(GOODS[r.g].n)}</td><td class="n">${money(r.coin)}</td><td class="n ${pct < -5 ? "pos" : pct > 5 ? "neg" : ""}">${pct > 0 ? "+" : pct < 0 ? "−" : ""}${Math.abs(pct)}%</td><td>${r.local ? "Local" : esc(r.from)}</td>` +
        (c ? (o ? `<td class="n">${money(o.coin)} <small>${esc(c.currency.split(" ").pop())}</small></td><td class="n ${diff > 5 ? "neg" : diff < -5 ? "pos" : ""}">${diff > 0 ? "+" : diff < 0 ? "−" : ""}${Math.abs(diff)}%</td>` : `<td class="n">not sold</td><td></td>`) : "") + `</tr>`;
    }).join("")}
    </tbody></table></div>
    <p class="note">Prices rise with the distance to the nearest place that makes a good. "vs. average" compares with every market in the world, in trade units.${c ? " The difference column compares in trade units, so different currencies line up." : ""}</p>`;
}
