// A small tag-based rule engine, used for everything picked "by the situation": cultures,
// governments, origins, ideals, units, ship types, goods...
//
// Content items are plain data:
//   { id, n, tags: ["seafaring", ...], w: 1,
//     req:  condition that must hold, or the item is never picked
//     not:  condition that must NOT hold
//     mods: [[condition, multiplier], ...]  soft preferences (most rules should be these)
//     excl: ["tag", ...]  tags this item cannot be combined with once picked }
//
// A condition is a tag string, "!tag", an array (all of), { any: [...] }, { all: [...] } or { not: cond }.
// The context is a Set of tags describing the situation ("coastal", "culture:seafaring", "near:titan"...).
// Hard requirements are rare on purpose: most interactions only shift the odds, so nothing is ever
// impossible just because of one earlier roll, but some combinations are far more likely.

export function test(cond, ctx) {
  if (cond == null) return true;
  if (typeof cond === "string") return cond[0] === "!" ? !ctx.has(cond.slice(1)) : ctx.has(cond);
  if (Array.isArray(cond)) return cond.every(c => test(c, ctx));
  if (cond.any) return cond.any.some(c => test(c, ctx));
  if (cond.all) return cond.all.every(c => test(c, ctx));
  if (cond.not) return !test(cond.not, ctx);
  return true;
}

export function allowed(item, ctx) { return test(item.req, ctx) && (item.not == null || !test(item.not, ctx)); }

export function weight(item, ctx) {
  if (!allowed(item, ctx)) return 0;
  let w = item.w ?? 1;
  if (item.mods) for (const [c, m] of item.mods) if (test(c, ctx)) w *= m;
  return w;
}

// Pick up to n distinct items. Each pick adds its tags to a copy of the context (so later picks can
// react to earlier ones) and blocks anything listed in its excl, in either direction.
export function pickSome(rng, items, ctx, n = 1) {
  const c = new Set(ctx), out = [], blocked = new Set();
  for (let k = 0; k < n; k++) {
    let tot = 0; const ws = items.map(it => {
      if (out.includes(it) || blocked.has(it.id) || (it.tags || []).some(t => blocked.has(t))) return 0;
      const w = weight(it, c); tot += w; return w;
    });
    if (tot <= 0) break;
    let r = rng.f() * tot, pick = items[items.length - 1];
    for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0 && ws[i] > 0) { pick = items[i]; break; } }
    out.push(pick);
    for (const t of pick.tags || []) c.add(t);
    for (const e of pick.excl || []) blocked.add(e);
    blocked.add(pick.id);
  }
  return out;
}

export function pickOne(rng, items, ctx, fallback = null) {
  const r = pickSome(rng, items, ctx, 1);
  return r.length ? r[0] : fallback;
}

export const byId = list => Object.fromEntries(list.map(x => [x.id, x]));
