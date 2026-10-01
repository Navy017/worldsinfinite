// Trade goods. Each province produces one or two, picked with the rule engine from its land and
// from whatever strange things are nearby (so mysteries and monsters feed the economy too).
// value: price per load, relative; c: colour on the trade map.
export const GOODS = [
  { id: "grain", n: "Grain", value: 1, c: "#d8b64a", w: 3, req: { any: ["grass", "river", "farmland"] }, mods: [["river", 2]] },
  { id: "livestock", n: "Cattle", value: 1.2, c: "#a26b3f", w: 2, req: { any: ["grass", "steppe", "savanna"] } },
  { id: "horses", n: "Horses", value: 2.5, c: "#8a5a2b", w: 1, req: "steppe", mods: [["horse_lords", 5]] },
  { id: "wool", n: "Wool", value: 1.4, c: "#e8e0cf", w: 1.5, req: { any: ["hills", "steppe", "cold"] } },
  { id: "fish", n: "Fish", value: 1, c: "#6fa3c0", w: 2.5, req: "coastal", mods: [["seafaring", 1.5]] },
  { id: "salt", n: "Salt", value: 2, c: "#f2f2ee", w: 0.8, req: { any: ["coastal", "desert", "marsh"] } },
  { id: "timber", n: "Timber", value: 1.3, c: "#6d4c2e", w: 2.5, req: "forest" },
  { id: "furs", n: "Furs", value: 3, c: "#7b5a44", w: 2, req: { any: ["cold", "boreal"] } },
  { id: "iron", n: "Iron", value: 2.5, c: "#6e7378", w: 1.5, req: { any: ["hills", "mountain"] } },
  { id: "copper", n: "Copper", value: 2.2, c: "#c07a4a", w: 1, req: { any: ["hills", "mountain", "badlands"] } },
  { id: "silver", n: "Silver", value: 5, c: "#c9ccd2", w: 0.5, req: "mountain" },
  { id: "gold", n: "Gold", value: 8, c: "#e8c03a", w: 0.3, req: { any: ["mountain", "river"] }, mods: [["mountain", 2]] },
  { id: "gems", n: "Gems", value: 9, c: "#b44a8a", w: 0.25, req: { any: ["mountain", "badlands"] } },
  { id: "stone", n: "Marble", value: 1.6, c: "#d9d3c7", w: 0.8, req: "hills" },
  { id: "wine", n: "Wine", value: 3, c: "#8a2a3a", w: 1.2, req: "warm", mods: [["hills", 2]] },
  { id: "olive", n: "Oil", value: 2, c: "#8a8a3a", w: 1, req: { all: ["warm", "!jungle"] } },
  { id: "spices", n: "Spices", value: 6, c: "#c4582a", w: 1.5, req: { any: ["jungle", "hot"] }, mods: [["jungle", 2]] },
  { id: "silk", n: "Silk", value: 7, c: "#e0a0b0", w: 0.4, req: "warm", mods: [["style:eastern", 8], ["artisans", 2]] },
  { id: "dyes", n: "Dyes", value: 4, c: "#5a3aa0", w: 0.6, req: { any: ["jungle", "marsh", "coastal"] } },
  { id: "incense", n: "Incense", value: 6, c: "#c9a86a", w: 0.8, req: "desert" },
  { id: "ivory", n: "Ivory", value: 7, c: "#f0e8d4", w: 0.5, req: { any: ["savanna", "jungle"] } },
  { id: "amber", n: "Amber", value: 5, c: "#e39a2a", w: 0.5, req: { all: ["coastal", "cold"] } },
  { id: "glass", n: "Glass", value: 3.5, c: "#9fd4d8", w: 0.4, req: "has:city", mods: [["desert", 3], ["artisans", 3]] },
  { id: "cloth", n: "Cloth", value: 2.5, c: "#b7a5d0", w: 0.8, req: "has:city", mods: [["artisans", 2], ["urbane", 1.5]] },
  { id: "tea", n: "Tea", value: 4, c: "#5a7a3a", w: 0.3, req: { all: ["warm", "hills"] }, mods: [["style:eastern", 10]] },
  // strange goods, only where strange things are
  { id: "ley_crystal", n: "Ley crystals", value: 15, c: "#6ae0e8", w: 20, req: "here:ley", strange: 1 },
  { id: "titan_bone", n: "Titan bone", value: 12, c: "#e8dcc0", w: 3, req: "near:titan", strange: 1 },
  { id: "void_glass", n: "Void glass", value: 18, c: "#3a1a5a", w: 20, req: "here:rift", strange: 1 },
  { id: "star_iron", n: "Star-iron", value: 16, c: "#8a9ab0", w: 20, req: "here:crater", strange: 1 },
  { id: "monster_parts", n: "Monster hides", value: 6, c: "#7a3a2a", w: 2, req: "here:beasts", strange: 1 },
  { id: "spores", n: "Dream spores", value: 9, c: "#9a6ab0", w: 6, req: "here:fungal", strange: 1 },
  { id: "crystal_wood", n: "Crystal wood", value: 10, c: "#aee0f0", w: 6, req: "here:crystal", strange: 1 },
  { id: "relics", n: "Relics", value: 11, c: "#d0b060", w: 4, req: "here:ruins", strange: 1 },
];
export const ROUTE_NAMES = ["The $ Road", "The $ Route", "The $ Way", "The Great $ Road"];
export const SEA_ROUTE_NAMES = ["The $ Run", "The $ Passage", "The $ Lane"];
