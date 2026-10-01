// Times region chunks and towns, and checks that chunk edges line up with their neighbours.
import { runPipeline } from "../src/gen/pipeline.js";
import { genChunk, provinceTracks, CHUNK, TILE_KM, GROUND } from "../src/gen/region.js";
import { townPlan, townChunk } from "../src/gen/city.js";

const P = { seed: "aldermoor-17", provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 28, land: 38, peninsulas: 2, islands: 40, seas: 3, mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50 };
const G = runPipeline(null, P, 0);
console.log("settlements:", G.X.settlements.length, "roads:", G.X.roads.length, "tiers:", [0, 1, 2, 3, 4].map(t => G.X.settlements.filter(s => s.tier === t).length).join("/"));
const big = G.X.settlements.filter(s => s.tier >= 3).sort((a, b) => b.pop - a.pop)[0];
const tw = TILE_KM / (G.worldKm / 1600), span = tw * CHUNK;
const cx = Math.floor(big.x / span), cy = Math.floor(big.y / span);
let t0 = Date.now(); provinceTracks(G, big.prov); console.log(`tracks for ${G.R.provs[big.prov].name}: ${Date.now() - t0} ms`);
t0 = Date.now();
const grid = [];
for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) grid.push(genChunk(G, cx + dx, cy + dy));
console.log(`9 chunks around ${big.name}: ${Date.now() - t0} ms (${((Date.now() - t0) / 9).toFixed(0)} ms each)`);
// continuity: roads/rivers/tracks crossing the edge between two horizontal neighbours should continue
const A = grid[4], Bc = grid[5];
let cont = 0, lines = 0;
const linear = g => ["road", "river", "track", "bridge"].includes(GROUND[g].k);
for (let j = 0; j < CHUNK; j++) {
  const a = A.ground[j * CHUNK + CHUNK - 1]; if (!linear(a)) continue;
  lines++;
  for (let d = -1; d <= 1; d++) { const jj = j + d; if (jj >= 0 && jj < CHUNK && linear(Bc.ground[jj * CHUNK])) { cont++; break; } }
}
console.log(`edge continuity: ${cont}/${lines} linear features on the east edge continue into the next chunk`);
let t1 = Date.now(); const T = townPlan(G, big.id); const planMs = Date.now() - t1;
t1 = Date.now(); townChunk(G, big.id, 0, 0, 0); const chunkMs = Date.now() - t1;
console.log(`town ${T.name} (${T.tierName}, pop ${T.pop}): plan ${planMs} ms, ${T.lots.n} buildings; one 2 m chunk ${chunkMs} ms`);
const vil = G.X.settlements.find(s => s.tier === 1);
t1 = Date.now(); const V = townPlan(G, vil.id);
console.log(`village ${V.name}: plan ${Date.now() - t1} ms, ${V.lots.n} buildings`);
