// Checks that the world wraps east-west: noise matches exactly at x = 0 and x = W, and the
// terrain the zoomed-in levels sample is nearly identical on both sides of the seam.
import { makeNoise, makeRng } from "../src/core/util.js";
import { runPipeline } from "../src/gen/pipeline.js";
import { localContext } from "../src/gen/local.js";
import { classifyTerrain } from "../src/gen/region.js";

const W = 1600, nz = makeNoise(makeRng("seam"), W);
let maxDiff = 0;
for (let y = 0; y <= 1000; y += 7) maxDiff = Math.max(maxDiff, Math.abs(nz.pfbm(0, y, 0.0045, 5, 3) - nz.pfbm(W, y, 0.0045, 5, 3)));
console.log(`noise at x=0 vs x=W: max difference ${maxDiff.toExponential(2)}`);

const P = { seed: "aldermoor-17", provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 28, land: 38, peninsulas: 2, islands: 40, seas: 3, mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50 };
const G = runPipeline(null, P, 0), L = localContext(G), a = {}, b = {};
let same = 0, n = 0, eDiff = 0;
for (let y = 5; y < 995; y += 2) {
  classifyTerrain(L, 0.02, y, a); classifyTerrain(L, W - 0.02, y, b);
  n++; if (a.g === b.g) same++; eDiff = Math.max(eDiff, Math.abs(a.elev - b.elev));
}
console.log(`terrain class at the two edges matches for ${same}/${n} samples; max elevation difference ${eDiff.toFixed(3)}`);
