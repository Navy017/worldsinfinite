import { makeRng, clamp } from "../core/util.js";
import { test, weight, allowed } from "../core/rules.js";
import { fill } from "../core/text.js";
import { FIELDS, FIELD_BIAS, INVENTIONS, INSTITUTIONS, SCHOLAR_ROLES, DISCOVERY_TEXT } from "../content/tech.js";

// Science and technology per realm. Every realm starts from a common level; its tags (culture,
// faith, government, ideals, land, size) push individual fields up or down (content/tech.js
// FIELD_BIAS), and it knows the inventions whose field level it has reached and whose
// requirements it meets. Big old realms and scholarly ones know more; isolated tribes less.

export const FIELD_NAMES = Object.fromEntries(FIELDS.map(f => [f.id, f.n]));
let cache = new WeakMap();
export function clearScienceCache() { cache = new WeakMap(); }

export function realmScience(G, rid, ctx) {
  let byR = cache.get(G); if (!byR) cache.set(G, byR = new Map());
  if (byR.has(rid)) return byR.get(rid);
  // once history is running, the realm's own progress replaces the generated snapshot
  if (G.H && G.H.realm[rid]) {
    const d = G.H.realm[rid], known = new Set(d.known);
    const fields = FIELDS.map(f => ({ id: f.id, n: f.n, d: f.d, level: clamp(Math.floor(d.fields[f.id] || 1), 1, 5) }));
    const inventions = INVENTIONS.filter(x => known.has(x.id)).sort((a, b) => a.field.localeCompare(b.field) || a.level - b.level);
    const best = fields.slice().sort((a, b) => b.level - a.level), avg = fields.reduce((a, f) => a + f.level, 0) / fields.length;
    const out = { fields, inventions, institutions: d.institutions.map(n => ({ n, d: "", field: "" })), discovery: null,
      summary: `${avg >= 3.6 ? "One of the most learned realms of its age" : avg >= 2.8 ? "A realm of solid, practical learning" : "Knowledge here is practical and local"}, strongest in ${best[0].n.toLowerCase()} and ${best[1].n.toLowerCase()}. ${known.size} inventions known.` };
    byR.set(rid, out);
    return out;
  }
  const rng = makeRng(G.seed + "|science|" + rid), st = G.S.states[rid], r = G.Y.realms[rid];
  const base = 2.2 + (ctx.has("realm:vast") ? 0.7 : ctx.has("realm:large") ? 0.4 : ctx.has("realm:tiny") ? -0.3 : 0) + (ctx.has("has:city") ? 0.3 : -0.2)
    + clamp((G.Y.calendar.year - r.founded) / 600, 0, 0.5);
  const lv = {};
  for (const f of FIELDS) lv[f.id] = base + rng.range(-0.6, 0.6);
  for (const b of FIELD_BIAS) if (test(b.tag, ctx)) for (const [k, d] of Object.entries(b.fields)) if (k in lv) lv[k] += d * 0.6;
  const fields = FIELDS.map(f => ({ id: f.id, n: f.n, d: f.d, level: clamp(Math.round(lv[f.id]), 1, 5) }));
  const L = Object.fromEntries(fields.map(f => [f.id, f.level]));
  const inventions = INVENTIONS.filter(x => x.level <= (L[x.field] || 0) && allowed(x, ctx))
    .map(x => ({ x, k: (x.level + rng.f() * 2 + (x.req ? 1.5 : 0)) * weight({ w: 1, mods: x.mods }, ctx) })).sort((a, b) => b.k - a.k).slice(0, 14).map(e => e.x)
    .sort((a, b) => a.field.localeCompare(b.field) || a.level - b.level);
  const slots = { capital: G.X.settlements[G.X.mainOf[st.capital]].name, short: st.short, people: G.Y.cultures[r.culture].adj, deity: G.Y.faiths[r.faith].deity, ruler: r.ruler };
  const inst = INSTITUTIONS.map(x => ({ x, w: weight({ w: x.w ?? 1, req: x.req }, ctx) * (L[x.field] >= 3 ? 1.5 : L[x.field] >= 2 ? 0.7 : 0.15) }))
    .filter(e => e.w > 0).map(e => ({ ...e, k: e.w * rng.f() })).sort((a, b) => b.k - a.k).slice(0, ctx.has("realm:tiny") ? 1 : ctx.has("realm:vast") ? 4 : 2)
    .map(e => ({ n: fill(e.x.n, slots) || e.x.n, d: fill(e.x.d, slots) || e.x.d, field: e.x.field }));
  const best = fields.slice().sort((a, b) => b.level - a.level), worst = best[best.length - 1];
  const inv = inventions.length ? inventions[inventions.length - 1] : null;
  const tpl = DISCOVERY_TEXT.length ? rng.pick(DISCOVERY_TEXT) : null;
  const discovery = tpl && inv ? fill(tpl, { ...slots, scholar: `the ${rng.pick(SCHOLAR_ROLES)} ${G.Y.cultures[r.culture].name.slice(0, 3)}${rng.pick(["an", "iel", "or", "us", "ra", "eth"])}`, invention: inv.n.toLowerCase(), field: FIELD_NAMES[inv.field].toLowerCase() }) : null;
  const avg = fields.reduce((a, f) => a + f.level, 0) / fields.length;
  const summary = `${avg >= 3.6 ? "One of the most learned realms of its age" : avg >= 2.8 ? "A realm of solid, practical learning" : avg >= 2 ? "Knowledge here is practical and local" : "Learning is scarce and mostly handed down by word of mouth"}, strongest in ${best[0].n.toLowerCase()} and ${best[1].n.toLowerCase()}, weakest in ${worst.n.toLowerCase()}.`;
  const out = { fields, inventions, institutions: inst, discovery, summary };
  byR.set(rid, out);
  return out;
}
