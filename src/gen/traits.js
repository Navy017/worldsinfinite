import { clamp, makeRng, weightedPick } from "../core/util.js";

// Every seed rolls a world archetype and a full set of settings, so worlds vary without
// touching a slider. Anything the user sets by hand overrides the rolled value.
export const ARCHETYPES = [
  { n: "Scattered continents", shapes: { mixed: 3, organic: 1, angular: 1 }, d: "Several mid-sized continents across open oceans.", w: 3,
    r: { continents: [3, 5], land: [32, 42], peninsulas: [1, 3], islands: [25, 55], seas: [1, 4], sizeVariety: [30, 70] } },
  { n: "Pangaea", shapes: { organic: 3, mixed: 1, branching: 1 }, d: "One supercontinent ringed by a world ocean.", w: 1.2,
    r: { continents: [1, 1], land: [38, 50], peninsulas: [2, 5], islands: [10, 35], seas: [3, 7], sizeVariety: [0, 0] } },
  { n: "Twin giants", shapes: { angular: 2, organic: 2, mixed: 1 }, d: "Two great continents of similar size facing each other.", w: 1,
    r: { continents: [2, 2], land: [34, 44], peninsulas: [1, 3], islands: [20, 45], seas: [1, 4], sizeVariety: [0, 20] } },
  { n: "Old world and new", shapes: { mixed: 3, angular: 1, organic: 1 }, d: "One dominant landmass and smaller lands across the sea.", w: 1.2,
    r: { continents: [2, 4], land: [34, 44], peninsulas: [1, 3], islands: [20, 50], seas: [2, 5], sizeVariety: [85, 100] } },
  { n: "Shattered isles", shapes: { long: 3, branching: 2, mixed: 1 }, d: "Many small continents and dense archipelagos.", w: 1,
    r: { continents: [6, 8], land: [22, 32], peninsulas: [0, 2], islands: [70, 100], seas: [0, 2], sizeVariety: [20, 60] } },
  { n: "Drowned world", shapes: { branching: 2, long: 2, mixed: 1 }, d: "Rising seas have left only scraps of land.", w: 0.6,
    r: { continents: [2, 5], land: [20, 25], peninsulas: [0, 2], islands: [60, 100], seas: [0, 3], sizeVariety: [20, 70] } },
  { n: "Great landmass", shapes: { organic: 2, branching: 1, mixed: 2 }, d: "Land dominates; oceans are narrow and inland seas are common.", w: 0.8,
    r: { continents: [1, 3], land: [52, 65], peninsulas: [1, 3], islands: [5, 30], seas: [4, 8], sizeVariety: [40, 90] } },
];

const band = (rng, table) => { const b = weightedPick(rng, table, t => t[0]); return Math.round(rng.range(b[1], b[2]) / 5) * 5; };

export function rollTraits(seed, provinces) {
  const rng = makeRng(seed + "|traits");
  const arch = weightedPick(rng, ARCHETYPES, a => a.w);
  const v = {};
  for (const [k, [lo, hi]] of Object.entries(arch.r)) v[k] = rng.int(lo, hi);
  v.islands = Math.round(v.islands / 5) * 5;
  // continent shape style leans on the archetype (a Pangaea tends to be lobed, shattered isles long and thin)
  v.shapeStyle = weightedPick(rng, Object.keys(arch.shapes), k => arch.shapes[k]);
  v.sizeVariety = Math.round(v.sizeVariety / 5) * 5;
  v.mountains = Math.round(rng.range(25, 95) / 5) * 5;
  v.plateaus = rng.int(0, 4);
  // most worlds are temperate; a few are ice ages, hothouses, deserts or swamps
  v.climate = band(rng, [[70, -25, 25], [8, -55, -25], [8, 25, 55], [7, -90, -55], [7, 55, 90]]);
  v.moisture = band(rng, [[70, -25, 25], [15, -80, -40], [15, 40, 80]]);
  v.wildlife = Math.round(rng.range(20, 85) / 5) * 5;
  v.magic = Math.round(rng.range(15, 85) / 5) * 5;
  // how much of the world is at war right now; drawn from its own rng so older seeds keep their other values
  v.conflict = Math.round(makeRng(seed + "|traits|war").range(15, 85) / 5) * 5;
  // realm count scales with world size at a rolled density (fragmented vs. imperial worlds)
  const density = rng.range(25, 90);
  v.states = clamp(Math.round(provinces / density), 3, 300);
  return { archetype: arch, values: v };
}

export function describeClimate(t, m) {
  const temp = t <= -55 ? "Ice age" : t < -20 ? "Cold" : t <= 20 ? "Temperate" : t < 55 ? "Warm" : "Hothouse";
  const wet = m <= -40 ? "arid" : m < -15 ? "dry" : m <= 15 ? "" : m < 40 ? "wet" : "drenched";
  return wet ? `${temp}, ${wet}` : temp;
}
