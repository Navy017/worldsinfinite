// The journal: what the viewer has pieced together about the world's hidden premises.
//
// Lore lives in places (libraries, archives, temples, ruins, villages, inns, people, hidden presses).
// Reading a place adds its texts to the journal, and many texts name where to look next (a lead).
// Sites give up their secrets chapter by chapter: a chapter opens when you have read something that
// leads to it, or once you know enough overall. Theories form from the texts found: some are wrong
// for this world, sources disagree, and official accounts deny. The god view shows it all.
// Progress is kept per world seed in this browser.

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KIND = { library: "Library", archive: "Archive", temple: "Temple", ruin: "Ruin", oral: "Village tales", traveller: "Inn", person: "A person", heretic: "Hidden press" };
const ICON = { library: "📚", archive: "🗄", temple: "⛩", ruin: "🏚", oral: "🗣", traveller: "🍺", person: "👤", heretic: "✒" };
const BIAS = { official: "Official", pious: "Devout", heretic: "Heretical", propaganda: "Propaganda", true: "First-hand", garbled: "Garbled", exaggerated: "Embellished", redacted: "Censored" };
const LAYERS = ["surface", "study", "dig", "revelation"], LAYER_N = { surface: "What anyone can see", study: "Studied", dig: "Excavated", revelation: "What it means" };
const ROLE_N = { investigator: "Investigator", official: "Official", believer: "Believer", survivor: "Survivor" };
const layerOf = (s, k) => { const L = s.layers[k]; return typeof L === "string" ? { n: null, text: L, to: null } : L; };

let J = null, key = "", lastFind = null;
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage may be blocked */ } },
};

export function journalFor(w) {
  const k = "wf-journal|" + w.seed + "|" + w.P.provinces + "|" + (w.W ? w.W.picks.map(p => p.id + ":" + p.truth).join("+") : "");
  if (k === key && J) return J;
  key = k;
  const saved = (J && J.key === k ? { read: [...J.read], found: [...J.found], layers: J.layers, seen: [...J.seen], god: J.god } : null) || store.get(k) || {};
  J = { key: k, read: new Set(saved.read || []), found: new Set(saved.found || []), layers: saved.layers || {}, seen: new Set(saved.seen || []), god: !!saved.god };
  // indexes for this world
  const L = w.L || { holders: [], sites: [], frags: [], zones: [], themes: [] };
  J.byProv = new Map(); for (const h of L.holders) { if (!J.byProv.has(h.prov)) J.byProv.set(h.prov, []); J.byProv.get(h.prov).push(h.id); }
  J.sitesAt = new Map(); for (const s of L.sites) { if (!J.sitesAt.has(s.prov)) J.sitesAt.set(s.prov, []); J.sitesAt.get(s.prov).push(s.id); }
  return J;
}
// the history layer adds places and texts as it runs: rebuild the indexes, keep what was found
export function journalReindex() { key = ""; }
const save = () => store.set(key, { read: [...J.read], found: [...J.found], layers: J.layers, seen: [...J.seen], god: J.god });
export function setGod(w, on) { journalFor(w).god = on; save(); }
export function resetJournal(w) { journalFor(w); J.read.clear(); J.found.clear(); J.layers = {}; J.seen.clear(); save(); }

const foundFrags = w => [...journalFor(w).found].map(f => w.L.frags[f]).filter(Boolean);
const pickOf = (w, prem) => w.W.picks.find(p => p.id === prem);
// how much a found text supports each theory, for the find card and the mystery card
function theoryCounts(w, prem, frags) {
  const out = new Map();
  for (const f of frags) if (f.prem === prem && f.about.startsWith("truth:")) {
    const t = f.about.slice(6), o = out.get(t) || { for: 0, against: 0 };
    if (f.reliable === false) o.against++; else o.for++;
    out.set(t, o);
  }
  return out;
}

// read a place: its texts go in the journal, and what they add is remembered for the find card
export function readHolder(w, h) {
  const j = journalFor(w), H0 = w.L.holders[h]; if (!H0) return null;
  const fresh = H0.frags.filter(f => !j.found.has(f)).map(f => w.L.frags[f]);
  j.read.add(h); for (const f of H0.frags) j.found.add(f);
  const sites = [], leads = [];
  for (const fr of fresh) {
    if (fr.about.startsWith("site:")) { const s = w.L.sites.find(s => s.prem === fr.prem && s.key === fr.about.slice(5)); if (s && !j.seen.has(s.id)) { j.seen.add(s.id); sites.push(s); } }
    if (fr.to) { if (fr.to.site != null && !j.seen.has(fr.to.site)) { j.seen.add(fr.to.site); sites.push(w.L.sites[fr.to.site]); } leads.push(fr.to); }
  }
  if (H0.site != null && !j.seen.has(H0.site)) { j.seen.add(H0.site); sites.push(w.L.sites[H0.site]); }
  const theories = [];
  for (const prem of new Set(fresh.map(f => f.prem))) {
    const pk = pickOf(w, prem); if (!pk) continue;
    for (const [t, c] of theoryCounts(w, prem, fresh)) { const tr = pk.truths.find(x => x.id === t); if (tr) theories.push({ n: tr.n, ...c }); }
  }
  lastFind = { holder: h, count: fresh.length, sites, leads, theories };
  save(); return lastFind;
}

// what the next chapter of a site needs: something that leads to it, or enough knowledge overall
function siteNeeds(w, s) {
  const j = journalFor(w), L = w.L, pk = pickOf(w, s.prem);
  const mine = foundFrags(w).filter(f => f.prem === s.prem);
  const aboutSite = mine.filter(f => f.about === "site:" + s.key || (f.to && f.to.site === s.id)).length;
  const truthCore = mine.filter(f => f.about === "truth:" + pk.truth && f.truthful !== false).length;
  const dig = layerOf(s, "dig"), digLead = dig.to && dig.to.holder != null ? dig.to.holder : null;
  return {
    study: { ok: aboutSite >= 1 || mine.length >= 3, need: "something written about this place (or a little more about this mystery)" },
    dig: { ok: aboutSite >= 2 || mine.length >= 7, need: "a second account of this place" },
    revelation: {
      ok: (digLead != null && j.read.has(digLead)) || (s.truthLink ? truthCore >= 3 : mine.length >= 10),
      need: digLead != null ? `what is kept in ${L.holders[digLead].name.replace(/^The /, "the ")}` : "three trustworthy accounts of what lies behind it",
    },
  };
}
export function siteLevel(w, sid) { const j = journalFor(w); return j.god ? 3 : (j.layers[sid] ?? (j.seen.has(sid) ? 0 : -1)); }
export function studySite(w, sid) {
  const j = journalFor(w), s = w.L.sites[sid]; j.seen.add(sid);
  const cur = j.layers[sid] ?? 0, next = LAYERS[cur + 1]; if (!next) return { ok: false };
  const need = siteNeeds(w, s)[next];
  if (!need.ok) return { ok: false, need: need.need };
  j.layers[sid] = cur + 1;
  const ch = layerOf(s, next);
  lastFind = { site: sid, chapter: ch.n || LAYER_N[next], sites: [], leads: ch.to ? [ch.to] : [], theories: next === "revelation" && s.truthLink ? [{ n: pickOf(w, s.prem).truths.find(t => t.id === s.truthLink).n, confirmed: true }] : [] };
  save(); return { ok: true };
}

const realmName = (w, r) => r >= 0 && w.S.states[r] ? w.S.states[r].name : "the wilds";
const goLink = to => to && to.prov != null ? ` <a href="#" data-prov="${to.prov}">Go there</a>` : "";
const fragHtml = (w, f, god) => {
  const h = w.L.holders[f.holder];
  return `<blockquote class="frag ${f.lead ? "lead" : ""}"><p>${esc(f.text)}</p><cite>${f.who ? esc(f.who) + " · " : ""}${ICON[h.kind] || ""} ${esc(h.name)} · <span class="bias b-${f.bias}">${BIAS[f.bias] || f.bias}</span>${god ? ` · <b class="${f.truthful === true ? "pos" : f.truthful === false ? "neg" : ""}">${f.truthful === true ? "true" : f.truthful === false ? (f.lead ? "a wrong theory here" : "false") : "half-true"}</b>` : ""}</cite>${f.to ? `<div class="fraglead">Leads to ${esc(f.to.name)}.${goLink(f.to)}</div>` : ""}</blockquote>`;
};
const chapterHtml = (s, k) => { const c = layerOf(s, k); return `<p class="layer"><i>${esc(c.n || LAYER_N[k])}.</i> ${esc(c.text)}${c.to ? ` <span class="fraglead">Leads to ${esc(c.to.name)}.${goLink(c.to)}</span>` : ""}</p>`; };

// the moment of finding something: what just happened, in plain words
function findCard(w) {
  const f = lastFind; if (!f) return "";
  lastFind = null;
  const rows = [];
  if (f.count != null) rows.push(f.count ? `${f.count} new ${f.count > 1 ? "texts" : "text"} added to your journal.` : "Nothing new here.");
  if (f.chapter) rows.push(`New chapter: <b>${esc(f.chapter)}</b>.`);
  for (const t of f.theories) rows.push(t.confirmed ? `Confirms the theory <b>${esc(t.n)}</b>.` : `Evidence on <b>${esc(t.n)}</b>: ${t.for ? `${t.for} for` : ""}${t.for && t.against ? ", " : ""}${t.against ? `${t.against} denying it` : ""}.`);
  for (const s of f.sites) if (s) rows.push(`New place on your map: <b>${esc(s.name)}</b>.${goLink({ prov: s.prov })}`);
  for (const l of f.leads.slice(0, 3)) rows.push(`New lead: ${esc(l.name)}.${goLink(l)}`);
  return `<div class="findcard">${rows.map(r => `<div>${r}</div>`).join("")}</div>`;
}

/* ---- the province card ---- */
export function loreSection(w, prov) {
  if (!w.L || !w.W || !w.W.picks.length) return "";
  const j = journalFor(w), L = w.L, out = [];
  for (const sid of j.sitesAt.get(prov) || []) {
    const s = L.sites[sid]; j.seen.add(sid);
    const lvl = siteLevel(w, sid), next = LAYERS[Math.max(0, lvl) + 1];
    out.push(`<div class="tag t-myst lore-site"><b>${esc(s.name)}</b>${esc(s.d)}${LAYERS.slice(0, Math.max(0, lvl) + 1).map(k => chapterHtml(s, k)).join("")}
      ${next ? `<button class="small" data-study="${sid}">${next === "study" ? "Study it" : next === "dig" ? "Excavate" : "Piece it together"}</button><span class="studymsg" id="studymsg${sid}"></span>` : `<p class="note">You know all this place can tell.</p>`}</div>`);
  }
  save();
  const zid = L.provZone[prov];
  if (zid >= 0) { const z = L.zones[zid]; out.push(`<div class="tag t-myst"><b>${esc(z.n)}</b>${esc(z.d || "")}</div>`); }
  for (const hid of j.byProv.get(prov) || []) out.push(holderHtml(w, hid));
  return out.length ? `<h4>Secrets and old texts</h4>${findCard(w)}${out.join("")}` : "";
}
function holderHtml(w, hid) {
  const j = journalFor(w), L = w.L, h = L.holders[hid], read = j.read.has(hid) && h.frags.every(f => j.found.has(f));
  if (h.burned) return `<div class="holder"><span>🔥</span><div><b>${esc(h.name)}</b><small>Burned. Whatever it held is gone.</small></div></div>`;
  return `<div class="holder"><span>${ICON[h.kind]}</span><div><b>${esc(h.name)}</b><small>${KIND[h.kind]}${read ? ` · read, ${h.frags.length} ${h.frags.length > 1 ? "texts" : "text"}` : ""}</small>
      ${read ? h.frags.map(f => fragHtml(w, L.frags[f], j.god)).join("") : `<button class="small" data-read="${hid}">${h.kind === "person" ? "Talk to them" : h.kind === "oral" || h.kind === "traveller" ? "Listen" : h.kind === "ruin" ? "Search the ruins" : "Read"}</button>`}</div></div>`;
}
// a single place of knowledge, opened by clicking it on the map or from search
export function holderCard(w, hid) {
  const h = w.L.holders[hid]; if (!h) return "";
  return `${findCard(w)}${holderHtml(w, hid)}`;
}
// places of knowledge a reader can walk into, for map icons: libraries, archives, temples
export const publicHolders = w => w.L ? w.L.holders.filter(h => ["library", "archive", "temple"].includes(h.kind) && !h.burned) : [];

/* ---- realm codex: the realm's themes ---- */
export function realmThemes(w, rid) {
  if (!w.L || !w.L.realmThemes[rid] || !w.L.realmThemes[rid].length) return "";
  return `<h4>What people here talk about</h4><div class="tags">${w.L.realmThemes[rid].map(t => { const th = w.L.themes[t]; return `<div class="tag t-myst"><b>${esc(th.n)}</b>${esc(th.d)}</div>`; }).join("")}</div>`;
}

// open leads: places named by what you have read that you have not been to yet
function openLeads(w, prem) {
  const j = journalFor(w), L = w.L, seen = new Set(), out = [];
  const add = (to, from) => {
    if (!to) return; const k = to.holder != null ? "h" + to.holder : "s" + to.site; if (seen.has(k)) return; seen.add(k);
    if (to.holder != null && j.read.has(to.holder)) return;
    if (to.site != null && siteLevel(w, to.site) >= 3) return;
    out.push({ to, from });
  };
  for (const f of foundFrags(w)) if ((!prem || f.prem === prem) && f.to) add(f.to, f.who || L.holders[f.holder].name);
  for (const s of L.sites) if ((!prem || s.prem === prem)) for (let k = 0; k <= siteLevel(w, s.id); k++) add(layerOf(s, LAYERS[k]).to, s.name);
  return out;
}

/* ---- the journal page ---- */
export const JOURNAL_TABS = [["mysteries", "Mysteries"], ["leads", "Leads"], ["people", "People"], ["found", "Texts found"], ["places", "Places"], ["themes", "Talk of the world"]];
export function journalPage(w, tab) {
  if (!w.W || !w.W.picks.length) return `<p>This world has no hidden premise: its gods, magic and history are what they seem.</p>`;
  const j = journalFor(w), L = w.L, god = j.god;
  const total = L.frags.length, found = foundFrags(w).length;
  const head = `<div class="jhead"><div class="jprog"><b>${found}</b> of ${total} texts found · <b>${j.read.size}</b> of ${L.holders.length} places read</div>
    <label class="jgod"><input type="checkbox" id="jGod"${god ? " checked" : ""}> God view <small>(shows every secret)</small></label></div>`;
  let body = "";
  if (tab === "mysteries") body = w.W.picks.map(pk => mysteryCard(w, pk)).join("");
  else if (tab === "leads") {
    const ls = openLeads(w);
    body = ls.length ? `<ul class="leads">${ls.map(l => `<li><b>${esc(l.to.name)}</b><small>mentioned by ${esc(l.from)}</small>${goLink(l.to)}</li>`).join("")}</ul>`
      : `<p class="note">No open leads. Read something in a library, temple or archive; most texts name where to look next.</p>`;
  } else if (tab === "people") {
    const rows = [];
    for (const pk of w.W.picks) for (const c of Object.values((L.cast || {})[pk.id] || {})) {
      const met = god || j.read.has(c.holder) || foundFrags(w).some(f => f.prem === pk.id && f.text.includes(c.name));
      if (!met) continue;
      const theirs = foundFrags(w).filter(f => f.holder === c.holder || f.text.includes(c.name));
      rows.push(`<div class="story"><div class="scale">${ROLE_N[c.role] || c.role} · ${esc(c.town)}, ${esc(realmName(w, c.realm))}</div><b>${esc(c.name)}</b>, ${esc(c.n)}
        ${god && c.stance ? `<p class="note">${esc(c.stance)}</p>` : ""}<p>${theirs.length} ${theirs.length === 1 ? "text mentions" : "texts mention"} them.${j.read.has(c.holder) ? "" : ` You have not met them yet.`} <a href="#" data-prov="${c.prov}">Go there</a></p></div>`);
    }
    body = rows.join("") || `<p class="note">You have not come across anyone yet. The same few people turn up again and again in these texts; once one is named, they appear here.</p>`;
  } else if (tab === "found") {
    const list = god ? L.frags : foundFrags(w);
    body = list.length ? list.map(f => fragHtml(w, f, god)).join("") : `<p class="note">Nothing yet. Libraries, temples, ruins, village tales, inns and the people you meet all keep pieces. Open a province's card and look for <b>Secrets and old texts</b>.</p>`;
  } else if (tab === "places") {
    const sites = L.sites.filter(s => god || siteLevel(w, s.id) >= 0);
    body = (sites.length ? sites.map(s => `<div class="story"><div class="scale">${esc(s.kind)} · ${esc(w.R.provs[s.prov].name)}, ${esc(realmName(w, w.S.own[s.prov]))} · chapter ${siteLevel(w, s.id) + 1} of 4</div><b>${esc(s.name)}</b><p>${esc(s.d)}</p>
      ${LAYERS.slice(0, siteLevel(w, s.id) + 1).map(k => chapterHtml(s, k)).join("")}<a href="#" data-prov="${s.prov}">Go there</a></div>`).join("")
      : `<p class="note">No strange places found yet. Texts that mention a place put it here.</p>`) +
      (L.zones.length ? `<h4>Marked lands</h4>` + L.zones.map(z => `<div class="story"><b>${esc(z.n)}</b><p>${esc(z.d || "")}</p><a href="#" data-prov="${z.provs[0]}">Go there</a></div>`).join("") : "") +
      (L.wall ? `<h4>The wall</h4><div class="story"><b>${esc(L.wall.n)}</b><p>${esc(L.wall.d || "")}</p><a href="#" data-prov="${L.wall.provs[0]}">Go there</a></div>` : "") +
      (w.W.forbiddenMark ? `<h4>Beyond the edge</h4><div class="story"><b>${esc(w.W.forbiddenMark.n)}</b><p>${esc(w.W.forbiddenMark.d || "")}</p></div>` : "");
  } else if (tab === "themes") {
    body = L.themes.map(t => `<div class="story"><div class="scale">${t.realms.map(r => esc(realmName(w, r))).join(", ")}</div><b>${esc(t.n)}</b><p>${esc(t.d)}</p>${t.realms.map(r => `<a href="#" data-codex-realm="${r}">${esc(w.S.states[r] ? w.S.states[r].short : "")}</a>`).join(" · ")}</div>`).join("") || "<p>Nothing.</p>";
  }
  return head + body;
}

function mysteryCard(w, pk) {
  const j = journalFor(w), L = w.L, god = j.god;
  const mine = (god ? L.frags : foundFrags(w)).filter(f => f.prem === pk.id);
  const all = L.frags.filter(f => f.prem === pk.id);
  const mySites = L.sites.filter(s => s.prem === pk.id), sitesKnown = mySites.filter(s => siteLevel(w, s.id) >= 0).length, sitesDone = mySites.filter(s => siteLevel(w, s.id) >= 3).length;
  const pw = pk.power, knowsPower = god || mine.some(f => f.about === "power" || f.depth === "lore");
  let html = `<div class="story big"><div class="scale">${pk.role === "core" ? "The great mystery" : "A second mystery"} · ${mine.length} of ${all.length} texts · ${sitesKnown} of ${mySites.length} places found, ${sitesDone} fully explored</div>`;
  html += `<b>${god || mine.length >= 4 ? esc(pk.name) : "An unexplained pattern"}</b>`;
  if (god) html += `<p>${esc(pk.pitch)}</p>`;
  if (pw && knowsPower) html += `<p><i>${esc(pw.name[0].toUpperCase() + pw.name.slice(1))}</i>, as it is taught: ${esc(pw.taught)}</p><ul>${pw.rules.map(r => `<li>${esc(r)}</li>`).join("")}</ul><p class="note">Forbidden: ${esc(pw.forbidden)}</p>`;
  else if (!mine.length) html += `<p class="note">You have found nothing about this yet. Start with a library or a temple in a large town.</p>`;
  // theories: every truth something found points to, with the evidence and what is known so far
  const counts = theoryCounts(w, pk.id, mine), known = (L.known || {})[pk.id] || {};
  const theories = pk.truths.map(t => ({ t, c: counts.get(t.id) || { for: 0, against: 0 }, real: t.id === pk.truth })).filter(x => god || x.c.for + x.c.against);
  if (theories.length) {
    html += `<h4>Theories</h4>`;
    for (const x of theories) {
      const plainFound = mine.some(f => f.plain && f.about === "truth:" + x.t.id);
      const confirmed = god ? x.real : x.real && (x.c.for >= 4 || (plainFound && x.c.for >= 2) || mySites.some(s => s.truthLink === pk.truth && siteLevel(w, s.id) >= 3));
      const ks = known[x.t.id] || [], lvl = confirmed ? ks.length - 1 : Math.min(ks.length - 2, Math.floor((x.c.for - 1) / 2));
      html += `<div class="theory${confirmed ? " confirmed" : ""}"><b>${esc(x.t.n)}</b> <small>${x.c.for} for${x.c.against ? `, ${x.c.against} denying it` : ""}${x.c.for && x.c.against ? " · sources disagree" : ""}${confirmed ? " · confirmed" : ""}</small>
        ${ks.length && lvl >= 0 ? `<p>${esc(ks[lvl])}</p>` : confirmed ? `<p>${esc(x.t.d)}</p>` : ""}${confirmed && ks.length ? `<p class="note">${esc(x.t.d)}</p>` : ""}${god && !x.real ? `<p class="note">Not true in this world.</p>` : ""}</div>`;
    }
  }
  if (!god) {
    const ls = openLeads(w, pk.id).slice(0, 4);
    if (ls.length) html += `<h4>Leads</h4><ul>${ls.map(l => `<li>${esc(l.to.name)} <small>(from ${esc(l.from)})</small>${goLink(l.to)}</li>`).join("")}</ul>`;
    else {
      // no lead yet: point at the nearest public place that holds something
      const h = L.holders.find(h => !j.read.has(h.id) && ["library", "archive", "temple"].includes(h.kind) && h.frags.some(f => L.frags[f].prem === pk.id));
      if (h) html += `<h4>Where to start</h4><p>${esc(h.name)} (${esc(realmName(w, h.realm))}) keeps something on this.${goLink({ prov: h.prov })}</p>`;
    }
  }
  if (god && pk.beings.length) html += `<h4>Creatures of this premise</h4><ul>${pk.beings.map(b => `<li><b>${esc(b.n)}</b>: ${esc(b.d)}</li>`).join("")}</ul>`;
  return html + `</div>`;
}
