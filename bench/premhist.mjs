// Runs history in worlds with forced premises and lists what the premises produced: `node bench/premhist.mjs [premise] [years] [seeds]`
import { runPipeline } from "../src/gen/pipeline.js";
import { initHistory, simulate } from "../src/sim/history.js";
const premise = process.argv[2] || "", years = +process.argv[3] || 40, seeds = +process.argv[4] || 3;
for (let k = 0; k < seeds; k++) {
  const P = { seed: "ph-" + k, provinces: 1200, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 30, land: 38, peninsulas: 2, islands: 40, seas: 3,
    mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60, premise };
  const G = runPipeline(null, P, 0), H = initHistory(G), months = years * G.Y.calendar.months.length;
  const t0 = performance.now(); while (H.month < months) simulate(G, H, months, 12);
  const prem = H.stories.filter(s => /^[a-z]+_/.test(s.def) && G.W.ids.some(id => s.def.startsWith(id.slice(0, 2)) ));
  const techs = new Set(); for (const d of H.realm) for (const t of d.known || []) if (G.W.extra.techs.some(x => x.id === t)) techs.add(t);
  const govs = G.Y.realms.filter(r => G.W.extra.govs.some(g => g.id === r.gov)).length, faiths = G.Y.faiths.filter(f => G.W.extra.faiths.some(x => x.id === f.type)).length;
  const units = G.Z.templates.flat().filter(t => G.W.extra.units.some(u => u.id === t.unit)).length;
  console.log(`${P.seed}: ${G.W.ids.join(" + ")} · ${((performance.now() - t0) / months).toFixed(1)} ms/month · ${H.stories.length} storylines, premise ones: ${H.stories.filter(s => G.W.ids.some(id => (G.W.storyIds || []).includes(s.def))).length}`);
  console.log(`   premise techs known: ${techs.size} [${[...techs].join(", ")}] · realms with premise govs ${govs} · faiths ${faiths} · unit slots ${units}`);
  void prem;
}
