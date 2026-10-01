// Checks premise data files: `node bench/premises.mjs [family]` (from the project root).
// Reports every problem; exits non-zero if any are found.
import { PREMISES } from "../src/content/premises/index.js";

const fam = process.argv[2];
const list = fam ? PREMISES.filter(p => p.family === fam) : PREMISES;
const SLOTS = new Set(["power-source", "power-access", "cosmology", "world-shape", "world-edge", "apocalypse", "history-secret", "afterlife", "divine-order", "mind-substrate", "state-control", "augmentation", "ai-threat", "ecology", "economy-resource", "time", "monster-source", "bloodline"]);
const TONES = new Set(["heroic", "mythic", "wonder", "whimsical", "grim", "noir", "horror", "melancholy", "satirical", "hopeful"]);
const ERAS = new Set(["stone", "bronze", "medieval", "renaissance", "industrial", "modern", "near-future", "far-future", "post-collapse"]);
const GENRES = new Set(["fantasy", "shonen", "mythic", "grimdark", "flintlock", "cyberpunk", "postapoc", "farfuture"]);
const SOURCES = new Set(["library", "temple", "ruin", "oral", "traveller", "person", "archive", "heretic"]);
const BIAS = new Set(["official", "pious", "heretic", "propaganda", "true", "garbled", "exaggerated", "redacted"]);
const FIELDS = new Set(["agriculture", "metallurgy", "engineering", "architecture", "navigation", "medicine", "astronomy", "writing", "warfare", "arcana", "alchemy", "natural_philosophy"]);
const WHERE = new Set(["remote", "inner", "border", "coast", "mountain", "desert", "forest", "capital", "any"]);
const CAST = ["investigator", "official", "believer", "survivor"];
const FRAG_SLOTS = new Set(["place", "realm", "people", "faith", "deity", "year", "person", "lead", ...CAST]);
const STORY_SLOTS = new Set([...CAST, "realm", "short", "ruler", "heir", "capital", "place", "site", "titan", "faith", "deity", "people", "rival", "ally", "war", "person", "person2", "year", "beast", "good"]);
const FX = new Set(["stability", "prestige", "treasury", "unrest", "pop", "growth", "science", "discovery", "war", "peace", "revolt", "revolution", "ruler_dies", "ruler_trait", "heir", "monument", "plague", "titan", "found_town", "abandon_town", "relation", "spawn", "flag"]);
const BANNED = /\b(alchemist|philosopher'?s stone|nen|hunter x|dark continent|chakra|jutsu|devil fruit|haki|quirk|stand user|breathing style|allomancy|surgebinding|one power|bender|bending|stargate|cyberpsycho|blackwall|netrunner|replicant|skynet|matrix|zone stalker|shimmer|soma|thought ?police|big brother|winterfell|valyria|dragonstone|hogwarts|jedi|sith|force user)\b/i;

let problems = 0;
const bad = (p, msg) => { problems++; console.log(`${p}: ${msg}`); };
const ids = new Set(), allIds = new Set(PREMISES.map(p => p.id));
for (const p of list) {
  const P = p.id || "(no id)";
  if (ids.has(p.id)) bad(P, "duplicate id"); ids.add(p.id);
  for (const k of ["id", "name", "pitch", "family", "slots", "tone", "era", "scale", "genres", "w", "excludes", "pairs", "truths", "tags", "subthemes", "sites", "beings", "techs", "mapMarks", "storylines", "fragments"]) if (p[k] === undefined) bad(P, "missing " + k);
  if (p.family === "power" && !p.power) bad(P, "power family needs a power block");
  if (p.family === "world" && !["shape", "cosmic", "cycle", "history"].includes(p.kind)) bad(P, "world family needs kind");
  for (const s of p.slots || []) if (!SLOTS.has(s)) bad(P, "unknown slot " + s);
  for (const s of p.tone || []) if (!TONES.has(s)) bad(P, "unknown tone " + s);
  for (const s of p.era || []) if (!ERAS.has(s)) bad(P, "unknown era " + s);
  for (const s of p.genres || []) if (!GENRES.has(s)) bad(P, "unknown genre " + s);
  for (const x of p.pairs || []) if (!allIds.has(x.id) && !process.env.LOOSE) console.log(`  (note) ${P}: pair ${x.id} not written yet`);
  const truths = new Set((p.truths || []).map(t => t.id));
  if (truths.size < 2) bad(P, "needs 2-3 truths");
  const subs = new Set((p.subthemes || []).map(s => s.id)), sites = new Set((p.sites || []).map(s => s.id));
  if (subs.size < 8) bad(P, `only ${subs.size} subthemes`);
  for (const s of p.subthemes || []) {
    if (!s.n || !s.d || !s.tags) bad(P, `subtheme ${s.id} incomplete`);
    if (s.truthLink && !truths.has(s.truthLink)) bad(P, `subtheme ${s.id} links unknown truth ${s.truthLink}`);
    if (s.mark && (!WHERE.has(s.mark.where) || !Array.isArray(s.mark.size))) bad(P, `subtheme ${s.id} has a bad mark`);
  }
  if (sites.size < 4) bad(P, `only ${sites.size} sites`);
  for (const s of p.sites || []) { if (!s.layers || !["surface", "study", "dig", "revelation"].every(k => s.layers[k])) bad(P, `site ${s.id} missing layers`); if (!WHERE.has(s.where)) bad(P, `site ${s.id} bad where`); if (s.truthLink && !truths.has(s.truthLink)) bad(P, `site ${s.id} bad truthLink`); }
  for (const b of p.beings || []) { if (!b.look || !b.look.body || !Array.isArray(b.look.group)) bad(P, `being ${b.id} bad look`); }
  if ((p.techs || []).length < 4) bad(P, "needs 4-6 techs");
  for (const t of p.techs || []) if (!FIELDS.has(t.field) || !(t.level >= 1 && t.level <= 5)) bad(P, `tech ${t.id} bad field/level`);
  for (const m of p.mapMarks || []) if (!["zone", "forbidden", "wall"].includes(m.kind)) bad(P, `bad mapMark ${m.kind}`);
  // storylines
  if ((p.storylines || []).length < 2) bad(P, "needs 2-3 storylines");
  for (const s of p.storylines || []) {
    const st = s.stages || {}; if (!st.start) bad(P, `story ${s.id} has no start`);
    const reqStr = JSON.stringify(s.req || ""); if (!(p.tags || []).some(t => reqStr.includes(`"${t}"`))) bad(P, `story ${s.id} req must include a premise tag`);
    let ends = 0;
    for (const [k, g] of Object.entries(st)) {
      for (const m of (g.h + " " + g.b + " " + s.n).matchAll(/\{(\w+)\}/g)) if (!STORY_SLOTS.has(m[1])) bad(P, `story ${s.id}.${k} bad slot ${m[1]}`);
      for (const f of Object.keys(g.fx || {})) if (!FX.has(f)) bad(P, `story ${s.id}.${k} bad fx ${f}`);
      if (g.end) { ends++; continue; }
      if (!g.wait || !(g.next || []).length) bad(P, `story ${s.id}.${k} needs wait and next`);
      if (!(g.next || []).some(n => !n.req)) bad(P, `story ${s.id}.${k} needs a next without req`);
      for (const n of g.next || []) if (!st[n.to]) bad(P, `story ${s.id}.${k} -> missing ${n.to}`);
    }
    if (ends < 2) bad(P, `story ${s.id} needs 2+ endings`);
  }
  // cast, truth summaries, site chapters
  for (const c of p.cast || []) { if (!CAST.includes(c.role) || !c.n) bad(P, `cast entry ${c.role} invalid`); if (c.home && !WHERE.has(c.home)) bad(P, `cast ${c.role} bad home`); }
  const castRoles = new Set((p.cast || []).map(c => c.role));
  const useSlots = (txt, where) => { for (const m of String(txt).matchAll(/\{(\w+)\}/g)) { if (!FRAG_SLOTS.has(m[1])) bad(P, `${where}: bad slot ${m[1]}`); if (CAST.includes(m[1]) && !castRoles.has(m[1])) bad(P, `${where}: uses {${m[1]}} but the cast has no ${m[1]}`); } };
  for (const t of p.truths || []) for (const k of t.known || []) useSlots(k, `truth ${t.id} known`);
  const pointOk = x => /^(site|sub|cast):\w+$/.test(x) || ["archive", "library", "temple", "ruin", "heretic", "oral", "traveller"].includes(x);
  for (const s of p.sites || []) for (const [k, L] of Object.entries(s.layers || {})) {
    const txt = typeof L === "string" ? L : L.text; useSlots(txt, `site ${s.id}.${k}`);
    if (typeof L === "object") { if (!L.n || !L.text) bad(P, `site ${s.id}.${k} chapter needs n and text`); if (L.points && !pointOk(L.points)) bad(P, `site ${s.id}.${k} bad points ${L.points}`); if (!!L.points !== /\{lead\}/.test(L.text)) bad(P, `site ${s.id}.${k}: points and {lead} must go together`); }
    else if (/\{lead\}/.test(L)) bad(P, `site ${s.id}.${k}: {lead} needs a chapter with points`);
  }
  // fragments
  const fr = p.fragments || [];
  if (fr.length < 18) bad(P, `only ${fr.length} fragments`);
  for (const t of truths) { const n = fr.filter(f => f.about === "truth:" + t).length; if (n < 3) bad(P, `truth ${t} has only ${n} fragments`); if (!fr.some(f => f.about === "truth:" + t && f.reliable === false) && !fr.some(f => f.about === "truth" && f.reliable === false)) bad(P, `truth ${t} needs a false/denial fragment`); }
  for (const f of fr) {
    if (!["core", "sub", "site", "lore"].includes(f.depth)) bad(P, "fragment bad depth " + f.depth);
    if (!SOURCES.has(f.source)) bad(P, "fragment bad source " + f.source);
    if (!BIAS.has(f.bias)) bad(P, "fragment bad bias " + f.bias);
    if (![true, false, "partial"].includes(f.reliable)) bad(P, "fragment bad reliable " + f.reliable);
    const a = f.about || ""; if (!(a === "truth" || a === "power" || (a.startsWith("truth:") && truths.has(a.slice(6))) || (a.startsWith("sub:") && subs.has(a.slice(4))) || (a.startsWith("site:") && sites.has(a.slice(5))))) bad(P, "fragment bad about " + a);
    useSlots(f.text, "fragment"); if (f.who) useSlots(f.who, "fragment who");
    if (f.points && !pointOk(f.points)) bad(P, "fragment bad points " + f.points);
    if (!!f.points !== /\{lead\}/.test(f.text)) bad(P, "fragment: points and {lead} must go together: " + f.text.slice(0, 50));
    if (f.points && f.points.startsWith("site:") && !sites.has(f.points.slice(5))) bad(P, "fragment points to unknown site " + f.points);
    if (f.points && f.points.startsWith("sub:") && !subs.has(f.points.slice(4))) bad(P, "fragment points to unknown subtheme " + f.points);
    if (f.points && f.points.startsWith("cast:") && !castRoles.has(f.points.slice(5))) bad(P, "fragment points to missing cast " + f.points);
  }
  // names from source works must not appear in anything a player could read
  const visible = JSON.stringify({ ...p, pairs: undefined, excludes: undefined });
  const hit = visible.match(BANNED); if (hit) bad(P, `source-work term "${hit[0]}"`);
}
// ids that end up in shared tables must be unique across every premise
const seen = new Map();
for (const p of PREMISES) for (const k of ["beings", "techs", "units", "govs", "faiths", "storylines"]) for (const x of p[k] || []) {
  const key = k + ":" + x.id; if (seen.has(key) && seen.get(key) !== p.id) bad(p.id, `${k} id ${x.id} also used by ${seen.get(key)}`); seen.set(key, p.id);
}
console.log(`${list.length} premises checked, ${problems} problems`);
process.exit(problems ? 1 : 0);
