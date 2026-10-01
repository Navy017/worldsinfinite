import { makeRng, weightedPick } from "../core/util.js";
import { BIOMES } from "../core/tables.js";

// Architecture style kits. A style is how a culture builds, independent of what the building is for:
// roof form and colours, lot proportions, how often houses wrap a courtyard, and which street
// layouts it favours. Every building type (house, temple, keep...) takes its look from the kit.
// These are data, so new styles can be added without touching the generator.

export const ARCH = {
  timber: {
    n: "Timber and tile", roof: "pitched", courtyard: 0.04, density: 1,
    layouts: { organic: 4, grid: 1 }, plaza: "round",
    lot: { along: [6, 12], depth: [10, 18] }, block: [70, 110],
    roofs: {
      house: ["#a4553c", "#8f5b45", "#9a6048", "#7a5d52"], rich: ["#8f3b36", "#7c3a4a"], workshop: ["#7c6a50"], warehouse: ["#6e5c45"],
      farm: ["#b39a5a"], barn: ["#a58a4c"], inn: ["#9a5a35"], shack: ["#8a7a62", "#7d6f5c"],
      temple: ["#d2c49b"], keep: ["#6e6a66"], hall: ["#7d5a3c"], market: ["#9b6b43"], library: ["#8a6d5a"], barracks: ["#6a5a4a"], mill: ["#a58a60"],
    },
  },
  stone: {
    n: "Grey stone and slate", roof: "pitched", courtyard: 0.08, density: 0.95,
    layouts: { organic: 4, grid: 1 }, plaza: "square",
    lot: { along: [7, 13], depth: [9, 16] }, block: [65, 100],
    roofs: {
      house: ["#5c6470", "#4f5864", "#6a6f76"], rich: ["#3f4a5a", "#4a4f63"], workshop: ["#62646a"], warehouse: ["#565a60"],
      farm: ["#7a766a"], barn: ["#6f6a5e"], inn: ["#5a5048"], shack: ["#6d6a64"],
      temple: ["#b8b4aa"], keep: ["#55524f"], hall: ["#4c5058"], market: ["#6a6660"], library: ["#57545a"], barracks: ["#4f4d4a"], mill: ["#6e685c"],
    },
  },
  courtyard: {
    n: "Courtyard houses, flat roofs", roof: "flat", courtyard: 0.55, density: 1.05,
    layouts: { organic: 3, grid: 1 }, plaza: "square",
    lot: { along: [9, 18], depth: [10, 20] }, block: [60, 95],
    roofs: {
      house: ["#d8c19a", "#cfb48a", "#e3d2b0", "#c9a77a"], rich: ["#ece3cf", "#dcc9a6"], workshop: ["#b99b72"], warehouse: ["#a88d68"],
      farm: ["#c9b089"], barn: ["#b89f78"], inn: ["#c8a47a"], shack: ["#b8a07e", "#a99374"],
      temple: ["#f1ece0"], keep: ["#b08a62"], hall: ["#d9c29a"], market: ["#c9a06e"], library: ["#e6dcc4"], barracks: ["#a78862"], mill: ["#bda57e"],
    },
  },
  eastern: {
    n: "Tiled halls in walled compounds", roof: "pitched", courtyard: 0.35, density: 0.9,
    layouts: { grid: 4, organic: 1 }, plaza: "square",
    lot: { along: [10, 18], depth: [10, 18] }, block: [80, 120],
    roofs: {
      house: ["#4f5a61", "#5a6268", "#465055"], rich: ["#2f3e46", "#6b2e2a"], workshop: ["#5e5a52"], warehouse: ["#54514b"],
      farm: ["#8a7a58"], barn: ["#7c6e50"], inn: ["#6b3a30"], shack: ["#6e6860"],
      temple: ["#a0392f"], keep: ["#3c4448"], hall: ["#7a2f2a"], market: ["#5e524a"], library: ["#3f4a50"], barracks: ["#4a4a46"], mill: ["#6e6858"],
    },
  },
  tropical: {
    n: "Thatch and timber on open lots", roof: "pitched", courtyard: 0.06, density: 0.7,
    layouts: { organic: 4 }, plaza: "round",
    lot: { along: [6, 11], depth: [7, 12] }, block: [70, 110],
    roofs: {
      house: ["#b89a5c", "#a88a4f", "#c4a868"], rich: ["#9a6a3a", "#b07a44"], workshop: ["#8f7a52"], warehouse: ["#7e6a48"],
      farm: ["#b8a060"], barn: ["#a88f55"], inn: ["#9c7a48"], shack: ["#a89660", "#98885a"],
      temple: ["#d8c07a"], keep: ["#7a6a52"], hall: ["#a0784a"], market: ["#b08a55"], library: ["#9a8058"], barracks: ["#7a6a4e"], mill: ["#a89060"],
    },
  },
};

const COLD = new Set(["tundra", "glacier", "boreal", "peaks", "alpine", "coldsteppe"]);
const HOT = new Set(["desert", "savanna", "badlands", "dryforest", "colddesert"]);
const WET_HOT = new Set(["rainforest", "mangrove", "swamp"]);

// Each landmass leans towards a couple of styles (a stand-in for culture until cultures exist);
// the local climate then shifts the odds, so towns on one continent share a family resemblance.
export function styleFor(G, s) {
  const pr = G.R.provs[s.prov], bk = BIOMES[pr.biome].k;
  const rng = makeRng(G.seed + "|arch|" + pr.mass);
  const w = { timber: 1, stone: 1, courtyard: 1, eastern: 1, tropical: 1 };
  const favourite = weightedPick(rng, Object.keys(w), () => 1), second = weightedPick(rng, Object.keys(w), () => 1);
  w[favourite] *= 6; w[second] *= 2.5;
  if (COLD.has(bk)) { w.stone *= 3; w.timber *= 1.5; w.courtyard *= 0.1; w.tropical *= 0.05; }
  if (HOT.has(bk)) { w.courtyard *= 4; w.timber *= 0.4; w.stone *= 0.6; w.tropical *= 0.5; }
  if (WET_HOT.has(bk)) { w.tropical *= 5; w.courtyard *= 0.6; w.stone *= 0.3; }
  const pick = weightedPick(makeRng(G.seed + "|arch|town|" + s.id), Object.keys(w), k => w[k]);
  return pick;
}
