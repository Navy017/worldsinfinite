// Prints what the society, trade and conflict stages produced: `node bench/society.mjs [provinces] [seed]`
import { runPipeline, toView } from "../src/gen/pipeline.js";
const provinces = +process.argv[2] || 1500, seed = process.argv[3] || "aldermoor-17";
const P = { seed, provinces, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: Math.round(provinces / 50), land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60 };
const t0 = performance.now();
const G = runPipeline(null, P, 0);
console.log("total", (performance.now() - t0).toFixed(0), "ms", Object.entries(G.timings).map(([k, v]) => k + " " + v.toFixed(0)).join(", "));
const { Y, Q, Z, S } = G;
console.log(`${Y.cultures.length} cultures, ${Y.faiths.length} faiths, ${S.states.length} realms`);
for (const c of Y.cultures.slice(0, 5)) console.log("  culture", c.adj, c.traits.join(","), c.provs);
for (const f of Y.faiths.slice(0, 5)) console.log("  faith", f.name, "|", f.typeName, f.doctrines.join(","), "holy:", f.holy.name);
const gov = {}, org = {};
for (const r of Y.realms) { gov[r.gov] = (gov[r.gov] || 0) + 1; org[r.origin] = (org[r.origin] || 0) + 1; }
console.log("  governments", JSON.stringify(gov)); console.log("  origins", JSON.stringify(org));
for (const r of Y.realms.slice(0, 4)) console.log("  realm", S.states[r.id].name, "|", r.ruler, "|", r.ideals.join(","), "|", r.originText);
const st = {}; for (const r of Y.relations) st[r.status] = (st[r.status] || 0) + 1; console.log("  relations", JSON.stringify(st));
console.log("  calendar", Y.calendar.months.map(m => m.name + ":" + m.days).join(" "), "| week", Y.calendar.weekdays.length, "| moons", Y.calendar.moons.length, "|", Y.calendar.era, Y.calendar.year);
console.log(`trade: ${Q.routes.length} links carrying goods (${Q.routes.filter(r => r.sea).length} sea), ${Q.hubs.length} markets`);
for (const n of Q.named) console.log("  route", n.name, n.km + " km", n.sea ? "sea" : "land");
console.log(`conflict: ${Z.wars.length} wars, ${Z.fronts.length} front sectors, ${Z.armies.length} armies, ${Z.fleets.length} fleets`);
for (const w of Z.wars) console.log("  war", w.name, "|", w.cbName, "|", w.attackers.map(a => Z.actors[a].name).join("+"), "vs", w.defenders.map(a => Z.actors[a].name).join("+"), "score", w.score);
const a = Z.armies[0]; if (a) console.log("  army", a.name, a.men, "men,", a.divisions.length, "divisions; first battalion", JSON.stringify(a.divisions[0].regiments[0].battalions[0]));
const v = toView(G); const size = JSON.stringify(v, (k, x) => ArrayBuffer.isView(x) ? x.length : x).length;
console.log("view json (typed arrays excluded)", (size / 1024).toFixed(0), "KB");
