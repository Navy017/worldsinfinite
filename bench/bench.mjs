// Times each generation stage headlessly: `npm run bench` (optionally: npm run bench -- 5000)
import { runPipeline, STAGES, cellCountFor } from "../src/gen/pipeline.js";

const sizes = process.argv.slice(2).map(Number).filter(Boolean);
const base = {
  seed: "aldermoor-17", provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 28, land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50,
};
for (const provinces of sizes.length ? sizes : [500, 1500, 5000]) {
  const P = { ...base, provinces };
  runPipeline(null, P, 0); // warm up the JIT
  const t0 = performance.now();
  const G = runPipeline(null, P, 0);
  const total = performance.now() - t0;
  const row = STAGES.map(s => `${s.key} ${G.timings[s.key].toFixed(0).padStart(5)}`).join("  ");
  console.log(`${String(provinces).padStart(5)} prov, ${String(cellCountFor(P)).padStart(5)} cells | ${row} | total ${total.toFixed(0)} ms`);
  console.log(`      -> ${G.R.provs.length} provinces, ${G.S.states.length} realms, ${G.R.rivers.length} rivers, ${G.F.titans.length} titans, ${G.F.sites.length} mysteries`);
}
