// Folds every premise's governments, faiths, units, inventions and storylines into the shared
// content tables, each gated on the tag "premise:<id>" that only realms in worlds with that premise
// carry. Import this before anything that indexes those tables (pipeline.js and main.js do it first).
import { PREMISES } from "./index.js";
import { GOVERNMENTS, FAITH_TYPES } from "../society.js";
import { UNITS } from "../military.js";
import { INVENTIONS } from "../tech.js";
import { STORYLINES } from "../storylines.js";

export const PREMISE = Object.fromEntries(PREMISES.map(p => [p.id, p]));
const gate = (p, req) => (req == null ? "premise:" + p.id : ["premise:" + p.id, req]);
const has = (list, id) => list.some(x => x.id === id);

if (!globalThis.__premisesRegistered) {
  globalThis.__premisesRegistered = true;
  for (const p of PREMISES) {
    for (const g of p.govs || []) if (!has(GOVERNMENTS, g.id)) GOVERNMENTS.push({ ...g, w: g.w ?? 1, tags: g.tags || ["gov:" + g.id], req: gate(p, g.req), prem: p.id });
    for (const f of p.faiths || []) if (!has(FAITH_TYPES, f.id)) FAITH_TYPES.push({ ...f, w: f.w ?? 1, tags: f.tags || ["faith:" + f.id], req: gate(p, f.req), prem: p.id });
    for (const u of p.units || []) if (!has(UNITS, u.id)) UNITS.push({ ...u, req: gate(p, u.req), prem: p.id });
    // premise inventions are the point of the premise: weight them up so they are not lost among the rest
    for (const t of p.techs || []) if (!has(INVENTIONS, t.id)) INVENTIONS.push({ ...t, w: t.w ?? (t.level >= 5 ? 0.25 : t.level >= 4 ? 1 : 2), req: gate(p, t.req), prem: p.id });
    for (const s of p.storylines || []) if (!has(STORYLINES, s.id)) STORYLINES.push({ ...s, prem: p.id });
  }
}
