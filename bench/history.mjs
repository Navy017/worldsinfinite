// Runs the history layer for N years and prints the chronicle: `node bench/history.mjs [provinces] [years] [seed]`
import { runPipeline } from "../src/gen/pipeline.js";
import { initHistory, simulate } from "../src/sim/history.js";
const provinces = +process.argv[2] || 1500, years = +process.argv[3] || 20, seed = process.argv[4] || "aldermoor-17";
const P = { seed, provinces, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: Math.round(provinces / 50), land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60 };
const G = runPipeline(null, P, 0);
const H = initHistory(G), months = years * G.Y.calendar.months.length;
const t0 = performance.now();
while (H.month < months) simulate(G, H, months, 12);
const ms = performance.now() - t0;
const kinds = {}; for (const n of H.news) kinds[n.kind] = (kinds[n.kind] || 0) + 1;
console.log(`${years} years (${months} months) in ${ms.toFixed(0)} ms, ${(ms / months).toFixed(1)} ms/month, ${H.news.length} news`);
console.log(JSON.stringify(kinds));
console.log("realms alive", H.realm.filter(d => !d.dead).length, "of", H.realm.length, "| wars now", G.Z.wars.length, "| monuments", H.monuments.length, "| towns founded", G.X.settlements.filter(s => s.founded != null).length, "| roads built", G.X.roads.filter(r => r.built != null).length);
for (const n of H.news.filter(n => n.imp >= 3).slice(0, 25)) console.log(` ${n.year} ${n.mon}: ${n.h} — ${n.b}`);
const S2 = H.stories || [];
console.log(`storylines: ${S2.length} started, ${S2.filter(s => s.done && s.ending !== "faded").length} concluded, ${S2.filter(s => !s.done).length} unfolding, ${S2.filter(s => s.ending === "faded").length} faded`);
for (const s of S2.filter(s => s.done && s.ending !== "faded").slice(0, 4)) { console.log(`\n== ${s.title} (${s.scale}) -> ${s.ending}`); for (const e of s.log) console.log(`   ${e.stage}: ${e.h} — ${e.b}`); }
console.log("marine zones", G.E.marine.zones.length, "monster waters", G.E.marine.zones.filter(z => z.monster).map(z => z.name + ": " + z.monster.n).join("; "));
