// Builds town plans for a spread of settlements and rasterises a chunk of each at 2 m and 16 m.
import { runPipeline } from "../src/gen/pipeline.js";
import { townPlan, townChunk, KINDS, CIVIC } from "../src/gen/city.js";
import { provinceSettlements } from "../src/gen/region.js";

const P = { seed: process.argv[2] || "aldermoor-17", provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 28, land: 38, peninsulas: 2, islands: 40, seas: 3, mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50 };
const G = runPipeline(null, P, 0), X = G.X.settlements;
const pick = [...X.filter(s => s.tier === 4).slice(0, 1), ...X.filter(s => s.tier === 3).slice(0, 3), ...X.filter(s => s.tier === 2).slice(0, 3)];
pick.push(...provinceSettlements(G, pick[1].prov).filter(s => s.tier <= 1).slice(0, 2));
for (const s of pick) {
  const plan = townPlan(G, s.id), p = plan.profile, civic = new Set();
  for (let q = 0; q < plan.lots.n; q++) { const k = KINDS[plan.lots.kind[q]]; if (CIVIC.has(k)) civic.add(k); }
  let courts = 0; for (let q = 0; q < plan.lots.n; q++) courts += plan.lots.court[q];
  const t0 = Date.now(); const fine = townChunk(G, s.id, 0, 0, 0); const fineMs = Date.now() - t0;
  const t1 = Date.now(); const coarse = townChunk(G, s.id, 3, -1, -1); const coarseMs = Date.now() - t1;
  const bFine = fine.tile.reduce((a, t) => a + (t === 12 ? 1 : 0), 0);
  console.log(`${plan.tierName.padEnd(10)} ${plan.name.padEnd(12)} plan ${String(plan.planMs).padStart(5)} ms | chunk 2m ${fineMs} ms (${Math.round(100 * bFine / fine.tile.length)}% roofs) | chunk 16m ${coarseMs} ms`);
  console.log(`           ${p.styleName} | ${p.layoutName} | ${p.fortName} | ${plan.lots.n} buildings, ${courts} courtyards | ${[...civic].join(" ") || "no civic"}`);
}
