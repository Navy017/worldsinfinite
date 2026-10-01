// Checks premise writing against docs/style.md rules 11-20 (the Stellaris / Destiny manner):
// `node bench/lint-lore.mjs [family|id ...]`. Prints one line per premise and the worst problems.
// It is advisory: the numbers show how far a premise is from the target, not whether it is valid.
import { PREMISES } from "../src/content/premises/index.js";

const args = process.argv.slice(2);
const list = args.length ? PREMISES.filter(p => args.includes(p.family) || args.includes(p.id)) : PREMISES;
const words = s => String(s).split(/\s+/).filter(Boolean).length;
const NUM = /\b\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|hundred|thousand|dozen|half|third|quarter|first|second|third|fourth|fifth)\b/i;
const FOLK = /\b(grandmother|grandfather|granny|old wives|they say|as the saying goes)\b/i;
const VAGUE = /(^|[.!?]\s+)(something|it)\s+(stirs|waits|watches|breathes|wakes|sleeps|hungers|listens|is coming)/i;
const FRAME = /^[^.!?:]{3,90}:\s/; // "Case notes of X, physician at Y, 1201: ..."
const layerText = L => typeof L === "string" ? L : L.text;

let total = 0;
const rows = [];
for (const p of list) {
  const fr = p.fragments || [], issues = [];
  const avg = fr.reduce((a, f) => a + words(f.text), 0) / Math.max(1, fr.length);
  const short = fr.filter(f => words(f.text) < 35).length;
  const framed = fr.filter(f => f.who || FRAME.test(f.text)).length;
  const numbered = fr.filter(f => NUM.test(f.text)).length;
  const pointing = fr.filter(f => f.points).length;
  const folk = fr.filter(f => FOLK.test(f.text)).length;
  const vague = [...fr.map(f => f.text), ...(p.sites || []).flatMap(s => Object.values(s.layers || {}).map(layerText))].filter(t => VAGUE.test(t)).length;
  if (avg < 40) issues.push(`fragments average ${avg.toFixed(0)} words (target 40-90)`);
  if (short > 3) issues.push(`${short} fragments under 35 words (max 3 short ones)`);
  if (framed < fr.length * 0.8) issues.push(`only ${framed}/${fr.length} fragments have a frame (who/when)`);
  if (numbered < fr.length * 0.6) issues.push(`only ${numbered}/${fr.length} fragments contain a number`);
  if (pointing < fr.length / 3) issues.push(`only ${pointing}/${fr.length} fragments point somewhere (target a third)`);
  if (folk > 1) issues.push(`${folk} folk sayings (max 1)`);
  if (vague) issues.push(`${vague} vague "something waits/stirs" lines`);
  if (!(p.cast || []).length) issues.push("no cast");
  for (const t of p.truths || []) {
    const of = fr.filter(f => f.about === "truth:" + t.id);
    if (!of.some(f => f.plain)) issues.push(`truth ${t.id}: no plain-statement fragment`);
    if (!of.some(f => f.cost)) issues.push(`truth ${t.id}: no cost fragment`);
    if (!(t.known || []).length) issues.push(`truth ${t.id}: no known summaries`);
  }
  for (const s of p.sites || []) {
    const L = Object.values(s.layers || {});
    if (!L.some(l => typeof l === "object")) { issues.push(`site ${s.id}: layers are captions, not chapters`); continue; }
    if (!L.some(l => typeof l === "object" && l.points)) issues.push(`site ${s.id}: no chapter points onward`);
    if (!fr.some(f => f.about === "site:" + s.id || f.points === "site:" + s.id)) issues.push(`site ${s.id}: no fragment leads to it`);
  }
  total += issues.length;
  rows.push([p.id, avg, framed / Math.max(1, fr.length), numbered / Math.max(1, fr.length), pointing / Math.max(1, fr.length), issues]);
}
rows.sort((a, b) => b[5].length - a[5].length);
for (const [id, avg, fr, num, pt, issues] of rows) {
  console.log(`${id.padEnd(24)} avg ${avg.toFixed(0).padStart(3)}w  framed ${(fr * 100).toFixed(0).padStart(3)}%  numbers ${(num * 100).toFixed(0).padStart(3)}%  leads ${(pt * 100).toFixed(0).padStart(3)}%  issues ${issues.length}`);
  if (args.length) for (const i of issues) console.log("    - " + i);
}
console.log(`${list.length} premises, ${total} style issues`);
