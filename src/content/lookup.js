// Shared id lookups for the page. The page never loads the premise files (they are large); the
// worker sends the governments, faiths, units and inventions of the world's active premises with
// the world, and addExtra folds them into these tables so every card can name them.
import { GOVERNMENTS, FAITH_TYPES } from "./society.js";
import { UNITS } from "./military.js";
import { INVENTIONS } from "./tech.js";
import { FAUNA } from "./ecology.js";
import { MARINE_FAUNA, LOOK } from "./wildlife.js";

const byId = list => Object.fromEntries(list.map(x => [x.id, x]));
export const LOOKUP = { gov: byId(GOVERNMENTS), faith: byId(FAITH_TYPES), unit: byId(UNITS), tech: byId(INVENTIONS), fauna: byId([...FAUNA, ...MARINE_FAUNA]), look: { ...LOOK } };

export function addExtra(extra) {
  if (!extra) return;
  const add = (list, map, items) => { for (const x of items || []) if (!map[x.id]) { list.push(x); map[x.id] = x; } };
  add(GOVERNMENTS, LOOKUP.gov, extra.govs);
  add(FAITH_TYPES, LOOKUP.faith, extra.faiths);
  add(UNITS, LOOKUP.unit, extra.units);
  add(INVENTIONS, LOOKUP.tech, extra.techs);
  for (const b of extra.beings || []) { LOOKUP.fauna[b.id] = b; if (b.look) LOOKUP.look[b.id] = b.look; }
}
