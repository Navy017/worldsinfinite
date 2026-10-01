// Diagnoses coastal towns: where the centre sits relative to the coast, and how much of the
// town area is water, bridges and buildings (rasterised at 16 m around the centre).
import { runPipeline } from "../src/gen/pipeline.js";
import { townPlan, townChunk, T_ } from "../src/gen/city.js";
import { localContext } from "../src/gen/local.js";

const P = { seed: "aldermoor-17", provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 28, land: 38, peninsulas: 2, islands: 40, seas: 3, mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50 };
const G = runPipeline(null, P, 0), L = localContext(G), out = {};
for (const s of G.X.settlements.filter(s => s.port && s.tier >= 2).slice(0, 8)) {
  L.blend(s.x, s.y, out);
  const land = L.landAt(s.x, s.y, out, 0.02), plan = townPlan(G, s.id);
  let water = 0, bridge = 0, total = 0;
  for (const [ci, cj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
    const c = townChunk(G, s.id, 3, ci, cj);
    for (let k = 0; k < c.tile.length; k++) { total++; if (c.tile[k] === T_.water || c.tile[k] === T_.deep) water++; if (c.tile[k] === T_.bridge) bridge++; }
  }
  console.log(`${s.name.padEnd(12)} tier ${s.tier} | centre land ${land.toFixed(2)} ${land < 0.5 ? "(IN WATER)" : ""} | water ${(100 * water / total).toFixed(0)}% | bridge tiles ${bridge} | buildings ${plan.lots.n}`);
}
