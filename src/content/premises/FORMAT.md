# Premise data format

One premise per file: `src/content/premises/<family>/<id>.js`, with `export default { ... }`.
Each family folder has an `index.js` that imports every file in it and exports
`export const PREMISES = [ ... ]`. The model file is `power/balanced_circle.js`; follow it closely.

Families: `power` (power systems), `world` (world shape, cosmic secrets, cycles, hidden history),
`scifi` (science fiction).

Design background: `docs/world-premises.md`. Source material: `docs/research/premises-*.md`.

## Fields

| Field | Required | What it is |
|---|---|---|
| `id` | yes | snake_case, unique across all families |
| `name`, `pitch` | yes | Our own name and a one-sentence pitch. Never use names from source works. |
| `family` | yes | `power`, `world` or `scifi` |
| `kind` | world family | `shape` (changes the map), `cosmic`, `cycle` or `history` |
| `slots` | yes | From: `power-source`, `power-access`, `cosmology`, `world-shape`, `world-edge`, `apocalypse`, `history-secret`, `afterlife`, `divine-order`, `mind-substrate`, `state-control`, `augmentation`, `ai-threat`, `ecology`, `economy-resource`, `time`, `monster-source`, `bloodline`. Exclusive slots: power-source, cosmology, world-shape, world-edge, afterlife, divine-order, mind-substrate, ai-threat. |
| `tone` | yes | 1-2 of: heroic, mythic, wonder, whimsical, grim, noir, horror, melancholy, satirical, hopeful |
| `era` | yes | The eras it works in: stone, bronze, medieval, renaissance, industrial, modern, near-future, far-future, post-collapse |
| `scale` | yes | personal, regional or world |
| `genres` | yes | Presets that may roll it: fantasy, shonen, mythic, grimdark, flintlock, cyberpunk, postapoc, farfuture |
| `bridge` | sci-fi only | `true` if it can sit under a fantasy or medieval world as its hidden truth (the post-collapse bridge) |
| `w` | yes | Base weight (about 1) |
| `excludes` | yes | Premise ids it must never combine with, beyond slot clashes (can be empty) |
| `pairs` | yes | `[{ id, w }]`: premises it pairs well with; w multiplies the chance of being rolled together |
| `power` | power family | `{ name, user, users, taught, rules: [..], forbidden }`: the power as the world believes it works |
| `truths` | yes | 2-3 of `{ id, n, d, tags }`. Each world picks one; d is the hidden truth in 1-3 sentences. |
| `tags` | yes | World tags added while active, e.g. `["alchemy"]`. Short snake_case words. |
| `subthemes` | yes | 8-12 regional themes (see below) |
| `sites` | yes | 4-6 dig sites or anomalies (see below) |
| `beings` | yes | 2-5 creatures or peoples (see below) |
| `techs` | yes | 4-6 inventions (see below) |
| `units` | optional | 0-3 troop types (see below) |
| `govs` | optional | 0-2 government forms (see below) |
| `faiths` | optional | 0-2 faith types (see below) |
| `mapMarks` | yes | 0-3 marks on the map (see below) |
| `storylines` | yes | 2-3 premise storylines, in the format of `src/content/storylines.js` |
| `fragments` | yes | 18-30 lore fragments (see below) |
| `cast` | yes | 3-4 recurring people (see below) |

### Cast
```
cast: [{ role: "investigator" | "official" | "believer" | "survivor", n: "a surveyor of the crown's mapping office", home: "<where>", stance: "one line: what they want and believe" }]
```
- Each world gives every role a generated name and a home town (`home` uses the site `where` values).
- Use them as slots `{investigator}` `{official}` `{believer}` `{survivor}` in fragments, site chapters, truth `known` and storylines. The same people then write across the world and appear in its storylines.

### Truths: `known`
Each truth may add `known: [s1, s2, s3, s4]`: what the reader understands at each point, from first
suspicion to confirmed, 30-60 words each, written as a plain summary ("Several realms keep records of
...; nobody has yet explained ..."). Shown in the journal as the mystery's current summary.

### Subthemes
```
{ id, n, d, w, req?, mods?, truthLink?, tags: ["theme:<id>"], mark? }
```
- **Assigned per realm.** `req` and `mods` read the realm's tags: culture traits, faith tags, doctrines, government tags (`monarchy`, `republic`, `tribal`, `autocracy`, `gov:*`), ideals, land tags (`coastal`, `island`, `steppe`, `desert`, `forest`, `jungle`, `mountain`, `hills`, `river`, `cold`, `hot`, `warm`, `marsh`), `has:port`, `has:city`, `near:titan`, `near:beasts`, `near:rift`, `near:ley`, `near:ruins`, `magic:high`, `magic:low`, and `realm:tiny`, `realm:small`, `realm:mid`, `realm:large`, `realm:vast`.
- **`truthLink`** names the truth this subtheme leaks. Subthemes without one are flavour that works with any truth.
- **`mark`** optionally puts a zone on the map in that realm: `{ kind: "zone", n, color: "#hex", size: [minProvinces, maxProvinces], where }`, with `where` being `remote`, `inner`, `border`, `coast`, `mountain`, `desert`, `forest`, `capital` or `any`.

### Sites
```
{ id, n: "The Ring of $", kind: "ruin"|"dig"|"anomaly"|"shrine"|"wonder", where, d, truthLink?, layers: { surface, study, dig, revelation } }
```
- `$` is replaced by a local place word.
- Each layer is uncovered in order. A layer is either a string, or a chapter `{ n: "Sick wrights", text, points? }`
  (30-60 words; one fact and one find each). The `dig` chapter should usually have `points` and `{lead}` naming
  where to go next. Layers may use the fragment slots.
- A layer opens when the reader has found a fragment `about` that site or `points`-ing to it (or, failing that,
  enough fragments overall). So every site needs at least one fragment that points to it.

### Beings
```
{ id, n, kind, d, danger: 0-3, biomes: [...], look: { size, group: [min, max], move, speed, col, col2, body, active, visible } }
```
- `kind`, the `look` fields and the biome keys are as in `content/ecology.js` and `content/wildlife.js`.
- Sea beings use the marine zone keys in `biomes`: shelf, reef, kelp, lagoon, estuary, open, abyss, polar.

### Techs
```
{ id: "<prefix>_..", n, field, level: 1-5, d }
```
- `field` is one of: agriculture, metallurgy, engineering, architecture, navigation, medicine, astronomy, writing, warfare, arcana, alchemy, natural_philosophy.
- Prefix every id with a short premise prefix.

### Units
The `content/military.js` UNITS format.
- Add `mods: [["theme:<subtheme>", n]]` so they favour realms with the right subtheme.
- `role`: infantry, ranged, cavalry, siege, magic or beast.

### Govs
The GOVERNMENTS format in `content/society.js`: `{ id, n, d, tags, w, forms: ["... of $"], ruler, mods }`. Prefix the ids.

### Faiths
The FAITH_TYPES format in `content/society.js`: `{ id, n, d, tags: ["faith:<id>"], w, names: [".. $ .."], mods }`.

### mapMarks
- `{ kind: "zone", n, color, size: [min, max], count: [min, max], where, d }`: patches of provinces marked on the map.
- `{ kind: "forbidden", n, d }`: the most remote large landmass becomes forbidden, unclaimed and misted. For "beyond the known world" premises.
- `{ kind: "wall", n, d }`: a great wall rings the heartland of the biggest realm.

### Fragments
```
{ depth, about, source, bias, reliable, text, who?, points?, plain?, cost? }
```
- **`depth`:**
  - `core`: about a truth; 4-5 per truth
  - `sub`: about a subtheme; about one per subtheme, more for important ones
  - `site`: about a site
  - `lore`: background about the premise or power; 3-4
- **`about`:** `truth:<id>`, `truth` (true whichever truth is picked), `sub:<id>`, `site:<id>` or `power`.
- **`source`:** library, temple, ruin, oral, traveller, person, archive or heretic.
- **`bias`:** official, pious, heretic, propaganda, true, garbled, exaggerated or redacted.
- **`reliable`:** `true`, `"partial"` or `false`. Every truth needs at least one false official denial, and most core fragments should be partial.
- **`text`:** 40-90 words, written as an in-world document (a report, a letter, a ledger, case notes, a sermon, a sailor's tale, a scratched wall), opening with its frame (who, role, when or where). Slots: {place} {realm} {people} {faith} {deity} {year} {person}, the cast slots, and {lead}.
- **`who`:** the short attribution shown under the text ("{investigator}, crown surveyor").
- **`points`:** where this sends the reader: `site:<id>`, `sub:<id>`, `cast:<role>` (that person's home), or a holder kind (`archive`, `library`, `temple`, `ruin`, `heretic`). The engine resolves it to a real place and fills `{lead}` with its name, so the text must contain `{lead}`. At least a third of fragments should point somewhere.
- **`plain: true`:** this fragment states its truth outright (one per truth). **`cost: true`:** a named person pays for the truth (one per truth).
- See `docs/style.md` rules 11-20.

## Rules
- Original names only. The `Inspirations` lines in the research are for us and never go into a file.
- **Storyline gating.** Storylines must include the premise's world tag in `req`, for example `req: "alchemy"` or `req: ["alchemy", ...]`. Storyline fx and slots follow `content/storylines.js` exactly.
- **Valid JS.** The family `index.js` must import every file in its folder.
