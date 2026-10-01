// Prints a world's premises and how its lore was scattered: `node bench/lore.mjs [provinces] [seed] [premise]`
import { runPipeline } from "../src/gen/pipeline.js";
import { PREMISE } from "../src/content/premises/register.js";
const provinces = +process.argv[2] || 1500, seed = process.argv[3] || "aldermoor-17", premise = process.argv[4] || "";
const P = { seed, provinces, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: Math.round(provinces / 50), land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60, premise };
const t0 = performance.now();
const G = runPipeline(null, P, 0);
console.log("total", (performance.now() - t0).toFixed(0), "ms · premise", G.timings.premise.toFixed(1), "ms · lore", G.timings.lore.toFixed(1), "ms");
const { W, L, S, Y } = G;
for (const pk of W.picks) { const p = PREMISE[pk.id]; console.log(`${pk.role}: ${p.name} (${p.family}) · truth: ${p.truths.find(t => t.id === pk.truth).n}`); }
console.log("world tags:", W.tags.join(" "));
if (W.forbidden) console.log(`forbidden land: ${W.forbiddenMark.n}, ${W.forbidden.reduce((a, b) => a + b, 0)} provinces`);
console.log(`${L.themes.length} themes:`); for (const t of L.themes) console.log(`  ${t.n} → ${t.realms.map(r => S.states[r].short).join(", ")}${t.truthLink ? " (leaks " + t.truthLink + ")" : ""}`);
console.log(`${L.zones.length} zones:`, L.zones.map(z => `${z.n} (${z.provs.length})`).join(", "));
if (L.wall) console.log(`wall: ${L.wall.n} around ${S.states[L.wall.realm].name}, ${L.wall.provs.length} provinces`);
console.log(`${L.sites.length} sites:`, L.sites.map(s => s.name).join(", "));
const byKind = {}; for (const h of L.holders) byKind[h.kind] = (byKind[h.kind] || 0) + 1;
console.log(`${L.frags.length} fragments in ${L.holders.length} places`, JSON.stringify(byKind));
const core = L.frags.filter(f => f.depth === "core"), inLib = core.filter(f => ["library", "archive"].includes(L.holders[f.holder].kind)).length;
console.log(`core fragments: ${core.length}, in libraries/archives ${inLib} (${Math.round(inLib / Math.max(1, core.length) * 100)}%), wrong-theory leads ${L.frags.filter(f => f.lead).length}`);
for (const f of L.frags.slice(0, 4)) console.log(`  [${L.holders[f.holder].name}] ${f.text}`);
const realmsWithPrem = Y.realms.filter(r => r.tags.includes("premise:" + W.ids[0])).length;
console.log(`realms tagged with the core premise: ${realmsWithPrem}/${Y.realms.length}; premise govs: ${Y.realms.filter(r => (PREMISE[W.ids[0]].govs || []).some(g => g.id === r.gov)).length}`);
