// Plays the journal without a browser: reads places, follows leads, studies sites, and prints what
// the player would see. `node bench/journal.mjs [premise] [seed]`
import { runPipeline, toView } from "../src/gen/pipeline.js";
import { readHolder, studySite, journalPage, journalFor, loreSection } from "../src/app/journal.js";
const premise = process.argv[2] || "", seed = process.argv[3] || "jr-1";
const P = { seed, provinces: 1500, continents: 3, sizeVariety: 40, shapeStyle: "mixed", states: 30, land: 38, peninsulas: 2, islands: 40, seas: 3,
  mountains: 60, plateaus: 2, climate: 0, moisture: 0, wildlife: 50, magic: 50, conflict: 60, premise };
const w = toView(runPipeline(null, P, 0));
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const L = w.L;
console.log(`${w.W.picks.map(p => p.name + " (" + p.truth + ")").join(" + ")}: ${L.frags.length} texts, ${L.holders.length} places, ${L.sites.length} sites, cast ${Object.values(L.cast).map(c => Object.keys(c).length).join("+")}`);
console.log(`texts with a lead: ${L.frags.filter(f => f.to).length}; lead to empty place: ${L.frags.filter(f => f.to && f.to.holder != null && !L.holders[f.to.holder].frags.length).length}; unfilled slots: ${L.frags.filter(f => /\{\w+\}/.test(f.text)).length}`);
// play: start at the first public place with something, then follow leads for 12 steps
let h = L.holders.find(h => ["library", "archive", "temple"].includes(h.kind) && h.frags.length);
for (let step = 0; step < 12 && h; step++) {
  const r = readHolder(w, h.id);
  console.log(`\n[${step}] READ ${h.name}: ${r.count} new; leads: ${r.leads.map(l => l.name).join("; ") || "-"}; sites: ${r.sites.map(s => s.name).join(", ") || "-"}`);
  for (const f of h.frags.slice(0, 1)) console.log("   “" + L.frags[f].text + "”" + (L.frags[f].who ? " — " + L.frags[f].who : ""));
  for (const s of r.sites) { let res; while ((res = studySite(w, s.id)).ok); console.log(`   study ${s.name}: ${res.need ? "stuck, needs " + res.need : "fully read"}`); }
  const next = r.leads.find(l => l.holder != null && !journalFor(w).read.has(l.holder));
  h = next ? L.holders[next.holder] : L.holders.find(x => !journalFor(w).read.has(x.id) && x.frags.length && x.kind !== "oral" && x.kind !== "traveller");
}
console.log("\nJOURNAL ·", strip(journalPage(w, "mysteries")).slice(0, 1200));
console.log("\nLEADS ·", strip(journalPage(w, "leads")).slice(0, 500));
console.log("\nPEOPLE ·", strip(journalPage(w, "people")).slice(0, 500));
const sp = L.sites[0]; if (sp) console.log("\nCARD ·", strip(loreSection(w, sp.prov)).slice(0, 700));
