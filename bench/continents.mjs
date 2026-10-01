// Checks how often the requested continent count survives (continents can merge when shapes overlap).
import { runPipeline } from "../src/gen/pipeline.js";
const base = { provinces: 1500, sizeVariety: 40, land: 38, peninsulas: 2, islands: 40, seas: 3, mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, states: 28 };
for (const style of ["mixed", "organic", "angular", "long", "branching"]) {
  const got = [];
  for (let s = 0; s < 12; s++) { const G = runPipeline(null, { ...base, continents: 4, shapeStyle: style, seed: `cc-${style}-${s}` }, 0); got.push(G.R.contCount); }
  console.log(style.padEnd(10), "asked 4, got:", got.join(" "), " avg", (got.reduce((a, b) => a + b) / got.length).toFixed(1));
}
