import { weight } from "./rules.js";

// Assembles prose from fragment libraries (content/lore.js, ecology.js, stories.js...).
// A fragment is a string or { t, req, w }; req is a rules.js condition on the context tags.
// Slots like {realm} are filled from a slot table; a fragment whose slot has no value is skipped,
// so libraries can use optional slots freely. Fragments with a req are a little preferred, since
// they say something specific about this realm rather than something any realm could say.

const SLOT = /\{(\w+)\}/g;

// what generic text calls the world's power: magic and mages by default, or the active power
// premise's own words ({power} {user} {users} {node}); a template's own slots take precedence
const DEFAULT_POWER = { power: "magic", user: "mage", users: "mages", node: "the ley lines" };
let POWER = DEFAULT_POWER;
export function setPowerWords(w) { POWER = w ? { ...DEFAULT_POWER, ...w } : DEFAULT_POWER; }
export const powerWord = k => POWER[k];

export function fill(t, slots) {
  let ok = true;
  const out = t.replace(SLOT, (m, k) => { const v = slots[k] ?? POWER[k]; if (v == null || v === "") { ok = false; return m; } return v; });
  if (!ok) return null;
  // tidy what slot filling can produce: "the The Varr Taiga", and sentences starting in lower case
  return out.replace(/\b([Tt]he) The\b/g, "$1").replace(/(^|[.!?]\s+)([a-z])/g, (m, a, c) => a + c.toUpperCase());
}

const norm = f => typeof f === "string" ? { t: f } : f;

// pick up to n fragments (without repeats) that fit the context and whose slots can all be filled
export function compose(rng, frags, ctx, slots, n = 1) {
  const cand = [];
  for (const f0 of frags || []) {
    const f = norm(f0), w = weight({ w: f.w ?? 1, req: f.req }, ctx);
    if (w <= 0) continue;
    const text = fill(f.t, slots); if (!text) continue;
    cand.push({ text, w: w * (f.req ? 1.6 : 1) });
  }
  const out = [];
  while (out.length < n && cand.length) {
    let tot = 0; for (const c of cand) tot += c.w;
    let r = rng.f() * tot, i = 0;
    while (i < cand.length - 1 && (r -= cand[i].w) > 0) i++;
    out.push(cand[i].text); cand.splice(i, 1);
  }
  return out;
}

export const capital1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
