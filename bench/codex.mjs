// Renders every codex page for a few realms, a market, a zone and the stories, and reports
// unfilled slots, empty sections and timing: `node bench/codex.mjs [provinces] [seed]`
import { runPipeline, toView } from "../src/gen/pipeline.js";
import { realmPage, REALM_TABS, marketPage } from "../src/app/codex.js";
import { storiesFor } from "../src/app/stories.js";
import { zonePage } from "../src/app/ecozone.js";

const provinces = +process.argv[2] || 1500, seed = process.argv[3] || "aldermoor-17";
const P = { seed, provinces, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: Math.round(provinces / 50), land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60 };
const G = toView(runPipeline(null, P, 0));
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
let t0 = performance.now(), bad = 0;
for (const rid of [0, 1, 2]) for (const [tab] of REALM_TABS) {
  const h = realmPage(G, rid, tab), txt = strip(h);
  if (/\{\w+\}/.test(txt)) { bad++; console.log("UNFILLED", rid, tab, txt.match(/\{\w+\}/g)); }
  if (txt.length < 40) console.log("SHORT", rid, tab, JSON.stringify(txt));
}
console.log("realm pages", (performance.now() - t0).toFixed(0), "ms");
console.log("\n--- realm 0 overview ---\n" + strip(realmPage(G, 0, "overview")).slice(0, 700));
console.log("\n--- realm 0 science ---\n" + strip(realmPage(G, 0, "science")).slice(0, 700));
console.log("\n--- market ---\n" + strip(marketPage(G, G.Q.hubs[0], G.Q.hubs[1])).slice(0, 600));
if (G.E) console.log("\n--- zone ---\n" + strip(zonePage(G, 0)).slice(0, 900));
t0 = performance.now();
const s = storiesFor(G);
console.log(`\nstories: ${s.big.length} big, ${s.medium.length} medium, ${s.small.length} small in ${(performance.now() - t0).toFixed(0)} ms`);
for (const b of s.big) console.log(" BIG", b.title, "| links", b.links.length, "| signs", b.signs.length);
for (const m of s.medium.slice(0, 4)) console.log(" MED", m.title, "->", m.links.join(","));
for (const x of s.small.slice(0, 4)) console.log(" SMALL", x.text, "->", x.links.join(","));
console.log("unfilled:", bad);
