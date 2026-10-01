# Premise integration audit: existing content vs. the World Premise system

Scope: every pre-premise content file and generator setting that touches magic, cosmology, titans,
rifts, ruins, gods or the shape of the world. Each item gets one of four verdicts:

| Verdict | Meaning |
|---|---|
| **KEEP** | Unrestricted texture. Works in any world, under any premise. No change. |
| **ADAPT** | Stays, but re-tagged, gated behind a slot/compat tag, or reworded with premise text slots. |
| **CONVERT** | Becomes (or is absorbed by) premise content when a matching premise is active; stays as a default otherwise. |
| **REMOVE** | Redundant or contradictory. |

Premise ids not yet written (everything but `balanced_circle`) are given as the snake_case of their
catalogue name in `docs/world-premises.md` §6 (e.g. `walking_mountains`, `thinning`, `long_dark`).

---

## 0. Headline findings

1. **The generator already has an implicit, hard-wired premise.** Ley lines are the power source
   (Ley Nexus, ley crystals, ley faith, ley techs, ley spire, *Guttering of the Ley*, *Great Working*);
   rifts to a void are the cosmology (Planar Rift, Rift cult, void glass, *The Shroud*); titans are the
   monster source (titan domains, titan cult, titan bone); a fallen empire is the history secret
   (`has:fallen_empire` is set in **every** world). Call this the **default cosmology**. Nearly all the
   conflicts below are this default colliding with a premise that owns the same slot.
2. **Only `power-source` is a hard clash** (ley vs. any power premise owning that slot). Rifts, titans,
   ruins and gods can almost always be *reinterpreted* by a premise rather than removed.
3. **The BIG stories already behave like premises but with no exclusivity.** Today a world can roll
   *The Dying Sun* + *The Long Winter* + *The Rising Sea* + *The Shroud* together (2-4 BIGs, picked
   uniformly from all eligible). That is incoherent even before premises; slot tags fix both problems.
4. **No premise plumbing exists yet**: nothing in `src/gen`, `src/app` or `src/sim` reads
   `content/premises`. World tags (`magic:high`, `has:*`) are computed in three separate places
   (`gen/society.js regionTags`, `app/stories.js storiesFor`, `sim/storylines.js liveTags` via realm tags),
   so premise tags must be injected in all three.
5. **Cheapest gating lever: switch tags off at the source.** If `provinceTags` stops emitting
   `near:ley`/`here:ley` when a premise owns `power-source` (and does not list `compat: ["ley"]`), about
   70% of ley content switches off with no edits. Only items that also accept `magic:high`, `arcane` or
   `gov:magocracy` as an alternative route need an explicit gate (listed in §12).

### Top 10 recommendations

| # | Recommendation |
|---|---|
| 1 | Add a premise roll to `gen/traits.js` (own rng stream `seed+"|traits|premise"` so old seeds keep their other values) and emit world tags `premise:<id>`, `slot:<slot>`, `compat:<family>`, `access:<route>`, `truth:<id>`, plus the premise's own `tags`, into **all three** tag contexts. |
| 2 | Gate the ley family on `power-source`: emit `near:ley`/`here:ley`/`has:ley` only when `!slot:power-source` or `compat:ley`; always emit a neutral alias `near:node`/`here:node` for the same sites so premise content can target "a place of power" without saying "ley". |
| 3 | Give every BIG story a `slots` field; when a premise fills a slot, drop BIGs with that exclusive slot, and allow soft-slot (`apocalypse`, `history-secret`) BIGs only at stage 0 as rumours. Cap the world at **one** main apocalypse BIG even with no premise. |
| 4 | Add `absorbs: [bigId]` to the premise format so a premise can take over a matching BIG (e.g. `long_dark` absorbs `long_winter` and `dying_sun`; `walking_mountains` absorbs `titans_stir`; `borrowed_grace` absorbs `god_dying`; `drowned_crown` absorbs `rising_sea`; `thinning` absorbs `the_shroud`). |
| 5 | Add `claims` to premise sites so a premise can reinterpret an existing MYST type (Glass Desert -> balanced_circle's glass waste; Bottomless Sinkhole -> downward_throat; Frozen Citadel -> long_dark; Ancient Ruins -> elder_lattice; Planar Rift -> thinning). Give MYST entries stable `id`s first. |
| 6 | Add power text slots `{power}`, `{user}`, `{users}` to the template filler, defaulting to "magic"/"mage"/"mages"; reword the ~15 generic magic lines (magocracy, battle mages, arcane barrage, arcane tower, news "Mages turn the tide"...) to use them. Keeps one set of content valid under every power premise. |
| 7 | Redefine the **magic** slider: with a power premise active it means "how strong and visible the power is" (subtheme count, power unit/gov weights); with none it keeps today's meaning. Below 25, prefer non-power premises; below 15, power premises only as hidden secondaries. |
| 8 | Add `suppress: { techs, units, stories, storylines, faiths }` to the premise format for the few existing items that contradict a specific premise's rules (e.g. balanced_circle suppresses `transmutation` "lead into gold", storyline `mad_alchemist`, BIG `wild_magic`'s "born with sparks"). |
| 9 | Gate `age_of_sails` (BIG) and `lost_expedition` (storyline) on `!slot:world-edge` unless `compat:open_sea`; world-edge premises (`nursery_sea`, `rim`, `strewn_sky`, `ward_walls`) provide their own expedition arcs. |
| 10 | Stop forcing `has:fallen_empire` in every world: keep it as the default, but when a `history-secret` premise is active, bind the fallen empire `$F` to it (the precursors, the forgotten colony) so *Return of the Old Empire*, `successor`, `ruin_heirs` become carriers of the premise instead of a rival history. |

---

## 1. Proposed tag vocabulary for gating (used throughout)

All of this works with the existing rule engine (`core/rules.js`: tags, `"!tag"`, `{any}`, `not:`).

| Tag | Emitted when | Used by |
|---|---|---|
| `premise:<id>` | premise active | premise-specific boosts in old content |
| `slot:<slot>` | an active premise fills that slot | `not: "slot:power-source"` style gates |
| `compat:<family>` | an active premise lists the family in its new `compat` field. Families: `ley`, `rift`, `titan`, `arcane`, `open_sea`, `fallen_empire` | re-allow a default family under a premise |
| `access:<route>` | from the power premise: `born`, `trained`, `contract`, `item`, `implant`, `eaten`, `bound` | gate "children born with sparks" vs. "anyone can learn" content |
| `truth:<id>` | already in the format | |
| `theme:<id>` | realm got that subtheme | already in the format |
| `near:node` / `here:node` | Ley Nexus (any world) | neutral "place of power" |
| `near:breach` / `here:breach` | Planar Rift (any world) | neutral "thin place" |
| `default:power` | shorthand for `!slot:power-source` OR `compat:ley` (computed once) | makes ley gates one tag instead of an `any` |
| `default:cosmos` | `!slot:cosmology` OR `compat:rift` | same for rift/void content |

`default:power` / `default:cosmos` are optional sugar, but they keep `req` lines short and make the
gating auditable by grep.

---

## 2. Map features and world settings

### 2.1 `core/tables.js` BIOMES, WILD, GOV, colours

| Item | Verdict | Reason | How |
|---|---|---|---|
| BIOMES (17) | KEEP | Physical; premises read them as biome keys. | None. |
| WILD hostile creatures (all) | KEEP | Ordinary monsters are unrestricted (doc §4). | Add a hook: premise `beings` with `danger >= 2` join `WILD[biome]` as candidate hostile-region creatures (e.g. `feral_chimera`), weight x2 in realms with a matching subtheme. |
| "Owlbears" (tempforest) | ADAPT | Name hygiene (doc §9): a coined tabletop-game creature name. | Rename (e.g. "Hook-beaked Bears") or add to the hygiene block list check. Low priority. |
| GOV name forms | KEEP | | |

### 2.2 SPECIAL strange forests

| Forest | Verdict | Reason | How |
|---|---|---|---|
| Ancient Forest | KEEP | Neutral wonder. | `great_root` may boost count (x2) via a premise `mapBoost` (see §13). |
| Fungal Forest | KEEP | Neutral; feeds `here:fungal`, dream spores. | Claimable flavour for `sleeper`/`thinning` (dream leakage). |
| Crystal Forest | ADAPT | "Trees grown through with glassy mineral" reads as ley-crystal growth. | Keep; under a non-ley power premise, let the premise optionally rename it via `reskin` (e.g. balanced_circle: "Salt-glass Wood"). |
| Blighted Wood | CONVERT (optional) | It is exactly the "power has ecological fallout" pairing; balanced_circle `stolen_flow` truth ("lands where the most work is done are slowly dying"), `great_root` (sick world-tree). | Let a premise `claims: "Blighted Wood"` attach a site with layers; otherwise keep. |

### 2.3 `titanKinds`

| Item | Verdict | Reason | How |
|---|---|---|---|
| Titan kind lists | KEEP | Physical giants; no premise forbids them. | Add premise override `titans: { mult, kinds?: {biome: [...]}, origin? }`: `walking_mountains` mult 2.5 + ecosystems; `breach_born` titans spawn near rifts; `body_of_the_world` names them as the giant's kin. |
| "Sky Whale" (default/plains) | ADAPT | Whimsical; jars in grim/horror tone worlds. | Weight down when premise tone is `grim`/`horror`/`noir`. Low priority. |

### 2.4 MYST mystery site types (the most important map table)

MYST entries are keyed by display name (`n`) everywhere (`features.js`, `gen/society.js provinceTags`,
`app/stories.js`, BIG `links.sites`, storyline `site:`). **First add a stable `id`** to each.

| Site | Verdict | Slot it implies | Premises that overlap | How |
|---|---|---|---|---|
| Ancient Ruins | KEEP + claimable | history-secret (soft) | elder_lattice, forgotten_landing, unremembering, blood_debt | Premise sites with `claims: "ancient_ruins"` replace the generic description with their `layers`. |
| **Ley Nexus** | **ADAPT** | **power-source** | every power premise with that slot (balanced_circle, grudgewell, sundered_wellspring, first_tongue, underchord, undersea, kindled_age, borrowed_grace, tally) | Keep the site (it is the map's "place of power"), but when `slot:power-source` and not `compat:ley`: (a) display name/desc from premise `reskin.node` (balanced_circle: "Current-well: the earth-current wells up here and circles draw strongly"); (b) emit `here:node` but not `here:ley`. |
| **Planar Rift** | **ADAPT** | cosmology (soft), monster-source | thinning (owns it), hush_below, undersea, sleeper, wardens_gaol, painted_sky, splinter_world, breach_born | Keep by default. If a cosmology premise is active and lists neither `compat:rift` nor a claim, weight the rift x0.3 (rare, unexplained) rather than removing it. `thinning` claims it outright. |
| Petrified Titan | KEEP + claimable | | walking_mountains, body_of_the_world, gods_twilight | Claimable (a dead titan = a dead god / giant kin). |
| Standing Stones | KEEP + claimable | | elder_lattice (gate-rings), underchord | |
| Sunken Temple | KEEP + claimable | | drowned_crown | |
| Eternal Storm | KEEP | | strewn_sky (storm walls) | |
| Meteor Crater | KEEP + claimable | | pale_visitor, seed_engine, visited_ground, forgotten_landing | A crater is the natural landing site for sky-origin premises. |
| Whispering Grove | KEEP + claimable | | great_root, thinning | |
| Frozen Citadel | KEEP + claimable | apocalypse (soft) | long_dark, unremembering | |
| Glass Desert | **CONVERT** under balanced_circle | | balanced_circle | balanced_circle's `mapMarks` "Glass waste" duplicates this. Either drop that mapMark and `claims: "glass_desert"`, or suppress Glass Desert while the mapMark is active. Prefer the claim (one mechanism). |
| Floating Isles | ADAPT | world-shape (soft) | strewn_sky | Redundant in a strewn_sky world (the whole map is floating isles): suppress there. Elsewhere KEEP. |
| Singing Caves | KEEP + claimable | | underchord | |
| Bottomless Sinkhole | KEEP + claimable | | downward_throat | `downward_throat` should claim one Sinkhole as its abyss. |

### 2.5 `gen/features.js` placement

| Piece | Verdict | How |
|---|---|---|
| Hostile regions (wildlife slider) | KEEP | Add premise beings to the creature pick (2.1). |
| Titan domains (wildlife slider, remote land) | KEEP | Multiply `nT` by premise `titans.mult` (2.3). |
| Strange forests (`np*mg/120`) | KEEP | Driven by magic slider: fine as "strangeness". |
| Mystery sites (`np*mg/22`, uniform pick of fitting MYST) | ADAPT | (1) Apply MYST weights from premise (`claims` x3, `reskin` 1, rift x0.3 when incompatible). (2) Reserve 1-2 slots per premise site so premise sites appear even at low magic. Premise sites should go through the same `mystery[]` array so `here:mystery`, storyline `site` anchors and SMALL `where:"site"` all work for them. |
| Volcanoes | KEEP | Physical. |

### 2.6 `gen/traits.js` settings

| Setting | Verdict | Today | Recommendation |
|---|---|---|---|
| `magic` (15-85) | **ADAPT** | Scales strange forests, mystery count, magic-species weight, `magic:high/low` tags (which unlock arcane traits, ley faith, magocracy), +1 BIG at >60. | Keep the strangeness effects. Add a second meaning when a power premise is active: **how strong and visible the power is.** `magic:high` -> more realms get power subthemes, premise units/govs weight x2, power fragments more often `reliable:true`; `magic:low` -> power is rare and secret (subthemes only in 1-2 realms, faiths and govs from the premise suppressed). Roll the premise *after* magic: magic <= 25 weights world/history/sci-fi-bridge premises x2 over power ones; magic <= 15 allows power premises only as hidden secondaries. |
| `wildlife` (20-85) | KEEP | Hostile regions, titan count. | Leave. Monster-source premises (grafted, thinning) tint which creatures fill hostile regions, not how many. |
| Archetypes (`Drowned world`, `Shattered isles`...) | ADAPT | Chosen before any premise. | world-shape premises should *set* or *weight* the archetype: `drowned_crown` -> "Drowned world"; `strewn_sky` -> "Shattered isles" + no ocean rendering; `inner_sun`/`rim` -> special map handling (out of scope here). Roll the premise first when a world-shape premise is possible, or let a world-shape premise override the archetype pick. |
| New: `premise` setting | ADD | | User override like the other settings ("auto" or an id), stored with the seed. |

---

## 3. `content/society.js`

### 3.1 Culture traits

| Trait | Verdict | Reason | How |
|---|---|---|---|
| seafaring ... egalitarian, ancestor_bound | KEEP | People-level. | |
| beast_tamers | KEEP | Physical (near:beasts). | grafted / balanced_circle `chimeras` could boost (`mods: [["theme:chimeras", 3]]`). |
| titan_touched | KEEP | Physical. | walking_mountains boosts. |
| **arcane** ("Magic runs in families; every village has its hedge-mage") | **ADAPT** | It is the hub tag for ~25 items (magocracy, war mages, arcane council, techs, lore). It asserts *hereditary* access ("runs in families"), which contradicts trained-only premises (balanced_circle, glyphwright) and is redundant with `quickening`. Requires `near:ley`/`near:rift`. | Keep the id and tag (too many dependents). Reword `d` to "{users} are common here; every village has one." Change `req` to `{ any: ["magic:high", "near:node", "near:breach"] }` (neutral aliases). Under `access:trained` premises, read it as "many trained {users}". |
| seers | KEEP | Belief/practice. | `long_sight` boosts (prescience). |

### 3.2 Faith types

Faiths are *beliefs*. A premise's hidden truth is allowed to contradict them; that is the point of
the fragment system. So most faiths stay; only faiths that **assert the default cosmology as fact
in their mechanics** (requiring ley/rift sites) need gating.

| Faith | Verdict | Reason | How |
|---|---|---|---|
| pantheon, one_god, dualism, spirits, sun, sea, philosophy | KEEP | Beliefs. | Divine-order premises add weights: `borrowed_grace` x2 pantheon; `sleeper` adds a sinister cult via its own `faiths`. |
| ancestors | KEEP | Belief. | `unquiet_gate` (the dead stay) boosts x3. |
| stars | KEEP | Belief. | `pale_visitor`, `watchers`, `wheel_of_suns` boost. |
| titan (`req near:titan`) | KEEP | Physical anchor. | walking_mountains boosts. |
| **void / Rift cult** (`req near:rift`) | ADAPT | Tied to rift; its theology ("a thin skin over a vast hunger") is a cosmology. | Follows the rift gate automatically. Under `thinning`/`sleeper`/`hush_below`, premise `faiths` may replace it: add `not: "premise:thinning"` if thinning brings its own. |
| **ley / Ley mysticism** (`req: any[near:ley, magic:high]`) | **ADAPT** | States the ley lines are the power and the divine: a `power-source` answer. The `magic:high` route lets it appear even when ley tags are switched off. | `req: [{ any: ["near:ley", "magic:high"] }, "default:power"]`. Under a power premise, its niche is filled by the premise's own `faiths` (FORMAT allows 0-2); balanced_circle should add one (e.g. "The Balance", a faith of equal exchange). |

### 3.3 Doctrines
All KEEP. `mystic` mods `faith:ley` harmless once ley faith is gated.

### 3.4 Governments

| Gov | Verdict | How |
|---|---|---|
| feudal ... commune, stratocracy | KEEP | |
| **magocracy** | ADAPT | Keep id/tags (`gov:magocracy` is referenced by premise units, e.g. `bc_wrights` mods). Reword `d`: "Only {users} may rule. Everyone else is 'mundane'." Forms/ruler: premise may supply `govNames: { magocracy: { forms: ["Circle of $"], ruler: "Grand Wright" } }`; default stays "Arcanum of $ / Archmage". Remove `faith:ley` from `req` (keep in mods). |
| beast_dominion | KEEP | |

### 3.5 Origins

| Origin | Verdict | How |
|---|---|---|
| old_dynasty, horde, merchant_charter, holy_mandate, exiles, rebellion, union, frontier_march, mountain_hold, beast_bond | KEEP | |
| successor ("ruins of the fallen $F") | ADAPT | Under a history-secret premise, `$F` should be the premise's precursor (elder_lattice builders, the forgotten colony). Needs the fallen-empire hook (§13). |
| titan_slayers, titan_worshippers | KEEP | |
| rift_touched | ADAPT | Follows rift gate (`req near:rift` already). Rename display under `thinning` via premise reskin, optional. |
| ruin_heirs | KEEP + boost | elder_lattice / forgotten_landing `mods x3`; it is a ready-made carrier for their subthemes. |

### 3.6 Ideals

| Ideal | Verdict | How |
|---|---|---|
| arcane_council ("Mages advise the ruler") | ADAPT | Reword "{users} advise the ruler and fight in the wars." `req` drop `faith:ley` route. |
| beast_cavalry, academies, all others | KEEP | |

### 3.7 Relation rules and casus belli
All KEEP. "Priests and mages" (theocracy vs magocracy) reads fine with `{users}`; consider rewording
to "Priests and {users}". Premises with a `circle_breakers`-style subtheme should add a rule (needs a
premise `relations[]` field, §13).

---

## 4. `content/military.js` and `content/warfare.js`

| Item | Verdict | Reason | How |
|---|---|---|---|
| All infantry/ranged/cavalry/siege units, all ships | KEEP | | |
| beast_riders | KEEP | | Premise beast units (`bc_chimeras`) coexist; fine. |
| **war_mages** "Battle mages" | ADAPT | Duplicates premise magic units (`bc_wrights`, role magic). Two magic units with different fiction in one army is noise. | Rule: if the active power premise defines a unit with `role: "magic"`, generic `war_mages` gets `not: "slot:power-source"`... simpler: engine drops generic units whose `role` is covered by a premise unit **in realms where that premise unit has weight > 0**. Else rename `n` to "Battle {users}". |
| Tactic shield_wall ... scorched_earth | KEEP | | |
| arcane_barrage | ADAPT | Mechanic is generic; text "rain fire and lightning" is one specific magic. | `d` from premise `power.battle` text if present ("Wrights unmake the ground beneath packed ranks"), else current. `n` stays "an arcane barrage" or "{power} barrage". |
| beast_rampage | KEEP | | |
| PROJECTS statue ... imperial_road | KEEP | | |
| observatory | KEEP | | |
| sky_citadel (`req any[arcane, magocracy, magic:high]`) | ADAPT | Floating fortress assumes levitation magic. | Keep under default power; under strewn_sky it is natural (boost x3); under a power premise without flight, `not: "slot:power-source"` unless premise lists it in `projects`. |
| **ley_spire** | ADAPT | Pure ley power-source. | `req: [ {any:[...]}, "default:power" ]`. Premises supply their own tier-3 wonder via a new `projects[]` field (balanced_circle: "The Great Circle of {capital}"). |
| titan_throne | KEEP | | |

---

## 5. `content/goods.js` strange goods

| Good | Verdict | Reason | How |
|---|---|---|---|
| ley_crystal (`here:ley`) | ADAPT | Power-source specific. | Switches off with `here:ley`. Add premise `goods[]` (new field) keyed to `here:node` so the node still produces something: balanced_circle "Red shards" or "Current-salt". |
| titan_bone | KEEP | | |
| void_glass (`here:rift`) | ADAPT | Follows the rift gate; under `thinning` the premise may reskin. | Nothing to edit if rift gating is at the tag level. |
| star_iron (`here:crater`) | KEEP + claimable | | sky-origin premises can reskin ("Seed-metal"). |
| monster_parts, spores, crystal_wood, relics | KEEP | | |

---

## 6. `content/tech.js`

### 6.1 Fields and biases
`arcana` field: KEEP, defined as "the study of the world's power". `alchemy` field: KEEP; balanced_circle
uses it. FIELD_BIAS for `faith:ley`, `near:ley`: harmless once those tags are gated.
`magic:low` bias (+natural philosophy): KEEP, good.

### 6.2 Inventions

| Invention(s) | Verdict | Reason | How |
|---|---|---|---|
| All mundane inventions (agriculture ... natural philosophy, ~85 items) | KEEP | | |
| ley_blessed_fields, ley_lamps, ley_lodestone, ley_surgery (req only ley tags) | ADAPT (auto) | Ley power-source. | Switch off via tag gating; no edit. |
| rune_quenching (`any[near:ley, arcane, magic:high]`), speaking_stones (`any[near:ley, faith:ley, magic:high]`), ley_engine (`... gov:magocracy`), ley_grid (`... magocracy, arcane_council`) | ADAPT | Text says "ley"; the `arcane`/`magic:high`/`magocracy` routes bypass the tag gate. | Add `"default:power"` to `req`. |
| storm_glass ("rift-water", req `any[near:rift, faith:sea, arcane]`) | ADAPT | `faith:sea`/`arcane` routes produce rift-water in rift-less worlds (existing bug). | Reword to "a sealed vial of storm-water", or add `near:breach` as the only rift route. |
| transmutation ("Lead becomes gold on a ley nexus") | ADAPT + suppress | Ley-specific, and contradicts balanced_circle's law ("iron becomes iron, never gold"; gold_crisis subtheme treats gold-making as a catastrophe). | Add `"default:power"`; balanced_circle `suppress.techs: ["transmutation"]` (its own `bc_catalyst` takes the role). |
| hedge_charms, warding_circles, grimoire_schools, scrying_mirrors, golems, weather_working | KEEP (generic) | Generic spellcraft; fine under most power premises. | Premises whose rules forbid these add them to `suppress.techs` (e.g. vowfire, an aura power, could suppress golems/grimoire). |
| spirit_binding | KEEP | | `sworn_kindred` boosts. |
| titan techs (titanbone_alloy, titan_harness, titanbone_halls, titan_marrow_tonic, titan_slayer_ballista, titan_speech, titan_ichor, titan_geology) | KEEP | Physical. | |
| rift_stitching, void_gates, rift_star_charts, rift_physics | ADAPT (auto) | Follow rift gate (`req near:rift`/`faith:void`/`origin:rift_touched`). | None if rift tags are gated. |
| floating_foundations (`any[near:mystery, magic:high]`) | ADAPT | Assumes Floating Isles exist; `near:mystery` is any site. | `req: { any: ["near:floating_isles", "premise:strewn_sky"] }` once MYST ids exist. |
| philosophers_salts, beast_rendering, bestiary_taxonomy, laying_on_hands, mechanical_philosophy | KEEP | | |
| battle_mages | ADAPT | Same reasoning as the unit. | Reword `n`: "Battle-{user} cadres". |

### 6.3 Institutions, scholar roles

| Item | Verdict | How |
|---|---|---|
| Arcane Tower of {capital} | ADAPT | "The {power} Tower of {capital}"; or premise `institutions[]` replaces it. |
| Circle of the Ley | ADAPT | `req` add `"default:power"`. |
| Riftwatch | ADAPT (auto) | Follows rift gate. |
| Order of the Titan Hunt, College of Heralds | KEEP | |
| SCHOLAR_ROLES "ley-surveyor", "rift-scholar", "magister" | ADAPT | **Picked unconditionally today** (`app/science.js`), so a no-ley world has ley-surveyors. Turn roles into `{ n, req? }`: ley-surveyor `default:power` + `has:ley`; rift-scholar `has:rifts`; magister `!magic:low`. Premises add their own role (`power.user`). |

---

## 7. `content/stories.js` BIG world stories (most important)

Engine today (`app/stories.js`): eligible = `!b.req || test(b.req, world)`; picks 2-4 uniformly;
random `stage`. Proposed engine change:

1. Each BIG gets `slots: [...]`.
2. Exclusive slot filled by a premise -> BIG dropped unless the premise `absorbs` it (then the BIG is
   *presented* as the premise's visible symptom, re-anchored to premise sites).
3. Soft slot (`apocalypse`, `history-secret`) filled by a premise -> BIG may still appear but only at
   `stage = 0` (rumour), never as a second main arc.
4. Without any premise: at most one BIG per soft slot at stage > 0.

| BIG | Slots | Overlapping premises | Verdict | How |
|---|---|---|---|---|
| **The Shroud** (has:rifts) | apocalypse, cosmology (soft) | thinning (otherworld pressing through), hush_below, sleeper, painted_sky (reality greying = glitch) | **CONVERT** | `slots: ["apocalypse"]`. `thinning.absorbs: ["the_shroud"]` (the Shroud *is* its endgame). Without thinning: default arc, still gated by rifts. |
| **Stirring of the Titans** (has:titans) | apocalypse, monster-source | walking_mountains (truth "Larval Gods": they hatch apocalyptically), body_of_the_world, gods_twilight (giant kin bring the end), breach_born | **CONVERT** | `slots: ["apocalypse", "monster-source"]`. `walking_mountains.absorbs: ["titans_stir"]`, with stage 4 text taken from the chosen truth. Without it: keep as default. |
| **Guttering of the Ley** (has:ley) | **power-source**, apocalypse | every power premise with power-source; nearest: last_kindling (fading flame), balanced_circle truth `stolen_flow` ("it breathes slower each year"), sundered_wellspring | **CONVERT** | `slots: ["power-source", "apocalypse"]`; requires `default:power` (it names the ley). Generalise into a premise-agnostic template "The Guttering of the {power}" that power premises opt into with `absorbs`, supplying their own signs. balanced_circle (stolen_flow truth) and last_kindling should absorb it. |
| **Return of the Old Empire** (any[has:fallen_empire, has:ruins], i.e. always) | history-secret (soft) | elder_lattice, forgotten_landing, unremembering, blood_debt | **ADAPT** | `slots: ["history-secret"]`. Split the fiction: pretenders and claims (stages 1-3) are people-level and stay; stage 4 "an army of the dead" asserts an `afterlife` answer, so make it conditional (`!slot:afterlife` or `premise:unquiet_gate`). History-secret premises absorb it: the "something that remembers the emperors" becomes their precursor. |
| **The Red Comet** | apocalypse (soft) | falling_hour, pale_visitor, watchers, seed_engine, visited_ground, forgotten_landing | **ADAPT** | `slots: ["apocalypse"]` soft. It already has a "nothing happens / prophecy wrong" feel; keep as default omen. Sky-origin premises can absorb it (the comet is the seed, the ship, the visitor). |
| **The Grey Cough** | none (people-level plague) | grey_unmaking, fleshwright_covenant, seed_engine | **KEEP** | Plagues are unrestricted (doc §4). Optional `absorbs` for grey_unmaking (stage 3 "survivors begin to change" is its hook). |
| **The Dying God** | **divine-order** | borrowed_grace (gods live on belief: perfect fit), gods_twilight, broken_writ, sleeper, pale_visitor, wardens_gaol, sworn_kindred, elemental_kinship | **ADAPT / CONVERT** | `slots: ["divine-order"]`. It asserts gods are real and answer. Drop it when a divine-order premise is active unless absorbed; `borrowed_grace`, `broken_writ` and `gods_twilight` should absorb it. |
| **The Age of Sails** | **world-edge** | nursery_sea (lethal outer world), rim (edge), strewn_sky (no sea), ward_walls, hungerfruit (the sea drowns the gifted); fits drowned_crown | **ADAPT** | `slots: ["world-edge"]`; `req` add `{ any: ["!slot:world-edge", "compat:open_sea"] }`. Stage 4 "The world is mapped" is the direct contradiction. nursery_sea should absorb it as "the expeditions to the outer world". |
| **The Great Migration** (any[wild:high, has:titans]) | monster-source (soft) | walking_mountains, grafted, thinning, sleeper | **KEEP + claimable** | `slots: ["monster-source"]` soft. Its stage 4 ("the thing that drove them out is revealed") is an open hook: premises with `monster-source` fill it via `absorbs`. |
| **The Rising Sea** (any[many_islands, has:ruins]) | apocalypse (soft), world-shape (soft) | drowned_crown (endless ocean over a sunken civilisation); conflicts with strewn_sky (no sea), rim? (fine) | **CONVERT** | `slots: ["apocalypse"]`; `not: "premise:strewn_sky"`. `drowned_crown.absorbs: ["rising_sea"]`. |
| **The Prophecy of the Dying Sun** | apocalypse | long_dark (dying sun truth), last_kindling (fire that must be fed: near-identical "feed the sun"), wheel_of_suns | **CONVERT** | `slots: ["apocalypse"]`. `last_kindling` and `long_dark` absorb it. Without them, keep: it is framed as a *prophecy* with a "proved wrong" ending, so it also works as the rumour-stage arc beside another apocalypse. |
| **The Ashen Age** (has:volcanoes) | apocalypse (soft) | long_dark (ash-sky variant) | **ADAPT** | `slots: ["apocalypse"]` soft. Physical, so keep as default; `long_dark` (ash truth) may absorb. |
| **The War of Many Crowns** (has:wars) | none | | **KEEP** | Unrestricted people-level arc. |
| **The Unbinding** (magic:high) | power-source (soft) | quickening (gifts strengthen each generation: *is* this arc), any power premise | **ADAPT / CONVERT** | `slots: ["power-source"]` soft. Reword with `{power}`/`{users}`. "Children are born with sparks" needs `!access:trained` (contradicts balanced_circle, glyphwright). `quickening.absorbs: ["wild_magic"]`. Under `access:trained`-only premises, suppress. |
| **The Long Winter** | apocalypse | long_dark (endless winter: same idea), ward_walls + long_dark pairing (the ice wall) | **CONVERT** | `slots: ["apocalypse"]`. `long_dark.absorbs: ["long_winter"]`. Without it: default. Also: never roll together with `dying_sun` (both apocalypse) except at rumour stage. |

**REMOVE**: none. Every BIG is either people-level or a good default for worlds whose slot is free.

---

## 8. `content/stories.js` MEDIUM and SMALL

Most follow their BIG or their site family automatically through `links` and site/near tags. Only
items with an unconditional or bypassing `req` need an edit.

| Item | Verdict | Reason | How |
|---|---|---|---|
| All realm/war/trade politics MEDIUMs (succession, revolt, coup, regency, feud, mercenaries, naval war, company, famine, plague...) | KEEP | People-level. | |
| heretic_preacher, holy_war, schism, sacred_pilgrimage, comet_cult | KEEP | Faith practice. | |
| witch_hunt (any[zealous, harsh_law, magic:low]) | KEEP | Works under any premise (and balanced_circle's `circle_breakers`). | |
| cult_spreading (any[sinister, faith:void, near:rift]) | KEEP | `sinister` is generic. | |
| titan_cult, titan_walks | KEEP | Physical. | |
| void_whispers ("a dark between the stars") | ADAPT | Cosmology claim; `faith:void`/`near:rift` already gate it. | Under `sleeper`, boost (dreams leaking is its premise). Else auto via rift gate. |
| rift_breach | ADAPT (auto) | rift gate. | |
| ley_drought (any[near:ley, faith:ley]) | ADAPT (auto) | Ley gate. | |
| magic_crackdown (any[magocracy, arcane_council, arcane, magic:high]) | ADAPT | Generic, but "mage-council... hedge-witches" text and it duplicates balanced_circle `state_wrights` subtheme. | Reword with `{users}`; `not: "theme:state_wrights"` (the premise's version wins in that realm). |
| ancestor_unrest ("shades are seen at crossroads") | KEEP | Ambiguous enough (elders *say*). `unquiet_gate` boosts. | |
| strange_goods_boom, ruin_excavation, invention_scandal | KEEP | Ruin excavation is a natural carrier for any premise site (add premise site types to its `{site}` pool). | |
| SMALL `spark_child`, `hedge_witch`, `twin_births`, `bookseller` (no `req`) | ADAPT | **Appear even in `magic:low` worlds** today (existing inconsistency). spark_child also needs `!access:trained`. | `req: "!magic:low"` on all four; spark_child `req: ["!magic:low", "!access:trained"]`; hedge_witch text "her charms" fine. |
| SMALL ley_hum (any[here:ley, near:rift]) | ADAPT | `near:rift` route lets ley text appear without ley. | `req: "here:ley"`. |
| SMALL site_ley_*, site_rift_*, grey_fog, rift_creature | ADAPT (auto) | Gated by `here:ley`/`here:rift`/`near:rift`. | |
| SMALL site_titan_*, titan_tremor, titan_scale, site_crater_* | KEEP | | |
| SMALL site_ghost_legion ("soldiers in old imperial armour marching", here:ruins) | KEEP | Ambiguous rumour. | |
| All other SMALL hooks | KEEP | | |

---

## 9. `content/storylines.js` (36 branching storylines)

| Storyline | Verdict | Reason | How |
|---|---|---|---|
| comet_omen, plague_saint, barefoot_saint, prophet_heresy, disputed_succession, bastard_claimant, peasant_messiah, merchant_bubble, great_inventor, secret_society, assassination_plot, runaway_princess, famine, hero_tyrant, traitor_general, border_marriage, guild_revolt, relic_stolen, beast_hunt, harbour_terror, haunted_fort, bandit_queen, oasis_spring, wild_colony, sleepwalkers (cured by bad rye) (25) | KEEP | People-level or grounded; no cosmology assumed. | Unrestricted. |
| titan_cult | KEEP | Anchor `titan`. | walking_mountains boosts `w`. |
| star_iron (Meteor Crater) | KEEP + claimable | | If a premise claims the crater, it may suppress this storyline in favour of its own. |
| storm_moves (Eternal Storm) | KEEP | "weather-witch", `arcane` mods only. | Optional `{user}` wording for "weather-witch". |
| temple_rises (Sunken Temple) | KEEP | "forgotten gods" is fine as belief. | drowned_crown boost. |
| whispering_grove | KEEP | | great_root / thinning boost. |
| sealed_vault (Ancient Ruins, Petrified Titan, Glass Desert) | KEEP + claimable | | When a premise claims the anchor site, the premise's site `layers` should feed the `study`/`old_secrets` text (or the premise suppresses this storyline at claimed sites). |
| **rift_spawn** (Planar Rift, Bottomless Sinkhole) | ADAPT | Rift-cosmology storyline; hedge-mages/arcana discovery. The Sinkhole anchor bypasses the rift gate. | Storyline anchors need the gate too: `site` filter should skip sites whose family is switched off. If `downward_throat` claims the Sinkhole, drop it from this anchor list. |
| **mad_alchemist** ("gold from lead") | ADAPT | In an `alchemy` world transmutation is a real, regulated science with a law that forbids gold-from-lead; a quack alchemist plot then reads as a different genre. | `not: "alchemy"` (balanced_circle has its own `bc_resurrection`/`bc_catalyst_war`), or keep but force the `fraud` ending under `alchemy`. Prefer `not`. |
| **great_working** ("draw raw power from the ley lines") | **CONVERT** | Hard ley assumption; but the arc (great ritual: success / backlash / sabotage) is premise-agnostic. | Reword with `{power}`/`{users}` and replace "the ley lines" with `{node}` ("the current-wells", "the lines"); `req` add `{ any: ["default:power", "slot:power-source"] }` (i.e. any power exists). balanced_circle is a natural fit ("a great circle"). Suppress under `access:born`-only premises where rituals do not exist (bound_nine, hungerfruit). |
| **lost_expedition** ("seeking land beyond the maps") | ADAPT | world-edge contradiction (same as Age of Sails). | `req: { any: ["!slot:world-edge", "compat:open_sea"] }`; world-edge premises supply their own expedition storyline (nursery_sea: "The Voyage to the Outer Shore"). |
| **citadel_thaw** (Frozen Citadel, Floating Isles; "changing what the mages of {realm} believe") | ADAPT | Small wording; the sleeper on the ice throne is a premise hook. | Reword "the {users} of {realm}"; `long_dark`/`unremembering` can claim the Frozen Citadel anchor. |

Storylines needing changes: 5 of 36. None removed.

---

## 10. `content/lore.js` and `content/news.js`

### 10.1 Lore

| Fragment(s) | Verdict | How |
|---|---|---|
| Realm overview/economy/daily life/troubles lines with `near:titan`, `near:beasts`, `near:ruins` | KEEP | |
| `near:rift` lines ("The rift glows on the horizon", "Strange lights from the rift", "Strange things crawl out of the rift") | ADAPT (auto) | Follow rift gate. |
| "Magic is ordinary in {realm}: lamps that never gutter..." (any[magic:high, arcane]) | ADAPT | "Ley-lamps" imagery; reword with `{power}`/`{users}`: "{power} is ordinary in {realm}...". |
| "Truth-spells are used in the high courts" (law) | ADAPT | Spell-specific; add `!access:trained`? Simpler: reword "{users} are hired to test oaths in the high courts". |
| "Enchanted goods are an everyday export" | ADAPT | Reword with `{power}`. |
| "Every village has a hedge-mage" | ADAPT | "Every village has a {user}..." Under `access:trained`-only premises with a licensing subtheme this still works. |
| "Wild magic has flared across the realm" (any[near:ley, magic:high]) | ADAPT | `req: ["default:power", { any: [...] }]`, or reword with `{power}`. |
| FAITH_SECTIONS beliefs/rites/clergy per faith type, incl. `faith:ley`, `faith:void`, `faith:titan` | KEEP | Beliefs; gated by their faith type. |
| FAITH_SECTIONS `afterlife` (judgement, halls, ancestors...) | KEEP | Beliefs, explicitly "teaches". The `afterlife` premise truth lives in fragments, contradicting them is intended. `unquiet_gate` can add one belief line per faith via premise fragments of `source: temple`. |
| "{deity} created the world in seven days" (one_god) | KEEP | Belief. Note: under `painted_sky`, this is a lovely accidental truth. |
| CURRENCY `sigil` (magocracy/arcane), `scale` (near:titan), `fang` | KEEP | |

### 10.2 News

| Template | Verdict | How |
|---|---|---|
| Battle "Mages turn the tide at {place}" (arcane_council/magocracy) | ADAPT | "{users} turn the tide at {place}"; body "Fire fell from a clear sky" -> premise `power.battle` text if given. |
| Battle "Beasts of war crush {short2}" | KEEP | |
| Discovery "Mages unlock {invention}" (arcane/magocracy) | ADAPT | `{users}`. |
| Mystery "Mages flock to {site}" (arcane) | ADAPT | `{users}`. |
| titan_rampage (all 7) | KEEP | |
| "Gods spare {place}, say the priests", coronation "chosen by the gods" | KEEP | Claims, not facts. |
| Everything else | KEEP | |

---

## 11. `content/ecology.js` and `content/wildlife.js`

| Item | Verdict | Reason | How |
|---|---|---|---|
| FLORA/FAUNA mundane (~80%) | KEEP | | |
| 50 `magic: true` land species (Frost Wyrm, Basilisk, Cinder Phoenix, Mindvine, Selkie Seal, Kraken, Isleback Turtle...) | KEEP | Ordinary monsters and wonders are unrestricted; weight already scales with the magic slider (`gen/ecology.js` line 45). | Under a sci-fi bridge premise (`gardener_engine`, `forgotten_landing`) "magic" species are engineered: add an optional premise `strangeNote` shown in the eco panel ("Scholars cannot explain these; ruin-tablets list them as 'stock'"). Low priority. |
| 18 `magic` marine species | KEEP | Same. | |
| SEA_MONSTERS (Kraken, Leviathan, Dragon Turtle, Island Whale...) | KEEP | | `hungerfruit`/`nursery_sea` can weight the sea more dangerous (x2 danger-3 monsters). Island Whale/Isleback Turtle are lovely texture for `walking_mountains`. |
| "Dragon Turtle" | ADAPT (optional) | Name hygiene: a well-known tabletop-game monster name. | Rename (e.g. "Reef-crowned Turtle") if the block list includes it. |
| WILDLIFE_NEWS | KEEP | | |

---

## 12. (1) Slot and family tags existing content should carry

### 12.1 BIG stories: `slots` field

| BIG id | `slots` | also needs |
|---|---|---|
| the_shroud | `["apocalypse"]` | rift family |
| titans_stir | `["apocalypse", "monster-source"]` | |
| ley_failing | `["power-source", "apocalypse"]` | `req` + `default:power` |
| empire_returns | `["history-secret"]` | stage-4 dead army gated on afterlife |
| the_comet | `["apocalypse"]` (soft) | |
| grey_plague | `[]` | |
| god_dying | `["divine-order"]` | |
| age_of_sails | `["world-edge"]` | `req` `!slot:world-edge` or `compat:open_sea` |
| great_migration | `["monster-source"]` (soft) | |
| rising_sea | `["apocalypse"]` | `not: "premise:strewn_sky"` |
| dying_sun | `["apocalypse"]` | |
| ashen_age | `["apocalypse"]` (soft) | |
| war_of_crowns | `[]` | |
| wild_magic | `["power-source"]` (soft) | `!access:trained` for the spark text |
| long_winter | `["apocalypse"]` | |

### 12.2 Explicit `"default:power"` gate (the ley family, items with bypass routes)

`FAITH_TYPES.ley`, `PROJECTS.ley_spire`, `PROJECTS.sky_citadel` (or premise:strewn_sky),
`INVENTIONS.rune_quenching`, `speaking_stones`, `ley_engine`, `ley_grid`, `transmutation`,
`INSTITUTIONS["The Circle of the Ley"]`, `BIG.ley_failing`, `STORYLINES.great_working` (until reworded),
lore "Wild magic has flared", SMALL `ley_hum`, SCHOLAR_ROLES "ley-surveyor".
Everything else in the ley family is gated by the tag switch alone.

### 12.3 Rift family (gated by `default:cosmos` at tag emission, soft)

Planar Rift weight, `near:rift`/`here:rift`/`has:rifts` emission, `faith:void`, `origin:rift_touched`,
`void_glass`, rift techs, Riftwatch, `the_shroud`, `rift_breach`, `void_whispers`, rift SMALLs,
`rift_spawn` anchors, rift lore lines, `storm_glass` (reword).

### 12.4 Power-text slot users (`{power}`, `{user}`, `{users}`)

`arcane` trait d, `magocracy` d/forms/ruler, `arcane_council` d, `war_mages` n, `arcane_barrage` d,
`battle_mages` invention, Arcane Tower institution, `magic_crackdown`, `wild_magic`, `great_working`,
`citadel_thaw`, 4 lore lines, 3 news templates, SMALL `spark_child`.

### 12.5 Access gate (`!access:trained`)

`wild_magic` (sparks at birth), SMALL `spark_child`, `twin_births` (optional).

---

## 13. (2) Tags, fields and engine hooks the premise system needs but does not have

### 13.1 Missing tags

| Tag | Why |
|---|---|
| `premise:<id>`, `slot:<slot>`, `compat:<family>`, `access:<route>` | All gating above. |
| `near:node`/`here:node`, `near:breach`/`here:breach` | Neutral names so premise content and `arcane` don't depend on ley/rift words. |
| `default:power`, `default:cosmos` | Short gates (§1). |
| `here:site:<siteId>` / `near:psite` | Premise sites can't currently be targeted by goods, techs, SMALL hooks or `strange_goods_boom`. Emit `here:psite` + `here:psite:<id>` from `provinceTags` for premise sites. |
| `near:zone:<markName>` or `near:pzone` | Premise `mapMarks`/subtheme `mark` zones are invisible to rules; content can't react to "near the Chimera wilds". |
| `has:premise_site` (world) | BIG `links.sites` uses MYST names; premise sites need a world tag and an id-based link. |
| `era:<era>`, `tone:<tone>`, `genre:<preset>` (world) | Premise format declares era/tone/genre but no existing content can read them (e.g. down-weight "Sky Whale" in grim worlds, sails in bronze age). |
| Faith-level `faith:premise` | Premise faiths need a way to be preferred in realms with matching subthemes; FORMAT faiths have `mods`, but `theme:*` tags are assigned after faiths. See ordering below. |

### 13.2 Missing premise-format fields

| Field | Shape | Why |
|---|---|---|
| `compat` | `["ley" \| "rift" \| "titan" \| "arcane" \| "open_sea" \| "fallen_empire"]` | Re-allow default families (e.g. `elder_lattice` keeps ley lines: they are its grid). |
| `reskin` | `{ node?: {n,d}, breach?: {n,d}, goods?: {ley_crystal: {n}}, forest?: {...} }` | Rename default map features instead of removing them. |
| `claims` on sites | `site.claims: "<mystId>"` | Doc §5 step 5 ("existing mysteries can be claimed"); also resolves the Glass Desert duplicate. |
| `absorbs` | `["<bigId>", ...]` with optional `signs`/`stages` overrides | Turn a BIG into the premise's visible arc (§7). |
| `suppress` | `{ techs, units, faiths, govs, stories, storylines, small }` (id lists) | Remove the few existing items that break a premise's rules. |
| `power.access` | `["trained"]`, `["born"]`... | Emits `access:*`. power-access is a non-exclusive slot, but content needs to know the route. |
| `power.battle`, `power.node` | short strings | Fill `arcane_barrage`, news, `great_working` text. |
| `govNames` | `{ magocracy: { forms, ruler } }` | Rename the generic magocracy instead of adding a near-duplicate gov. |
| `projects` | PROJECTS format | Power premises need their own tier-3 wonder (replaces ley_spire). |
| `goods` | GOODS format | Node/site produce (replaces ley crystals). |
| `institutions` | INSTITUTIONS format | Replaces Arcane Tower / Circle of the Ley. |
| `relations` | RELATION_RULES format | e.g. circle-breakers vs. licensed-wright realms. |
| `titans` | `{ mult, kinds?, origin? }` | walking_mountains, breach_born, body_of_the_world. |
| `world` (BIG stories) | BIG format | FORMAT has `storylines` (sim) but nothing for the map's BIG/MEDIUM/SMALL layer, so a premise without `absorbs` has no visible world arc. |
| `medium`/`small` | stories.js formats | Rumours and hooks pointing at premise sites. |
| `fallenEmpire` | `{ n?, d }` | Bind `$F` and `has:fallen_empire` to a history-secret premise. |
| `cultureTraits` | CULTURE_TRAITS format (optional) | FORMAT can add govs/faiths/units but no culture trait; subthemes partly cover this. |

### 13.3 Missing engine hooks

| Hook | Where |
|---|---|
| Premise roll + override setting | `gen/traits.js` (`rollTraits`), separate rng stream. |
| Premise tags into realm tags | `gen/society.js regionTags` (next to `magic:high`). |
| Premise tags into world tags | `app/stories.js storiesFor` (`world` set). |
| Premise tags into sim realm tags | flow through `Y.realms[i].tags`, so `sim/storylines.js liveTags` gets them; add `theme:*` there too. |
| Ley/rift tag switch | `gen/society.js provinceTags` `here()` and `app/stories.js` `has:ley`/`has:rifts`. |
| MYST weighting, premise site placement, claims | `gen/features.js` mystery loop. |
| BIG slot filter, absorb, rumour-stage clamp | `app/stories.js` big-story selection. |
| `{power}/{user}/{users}/{node}` slots | `core/text.js fill` default slot map. |
| `suppress` | one filter applied to each content array at load (or in `pickSome`/`weight` via a blocked-id set). |
| Subtheme assignment order | after origins/governments/ideals (subtheme `req` reads them), before units/storylines/tech. Premise govs/faiths must therefore use world tags (`premise:*`), not `theme:*`, in their `mods`. |
| Hostile creatures from premise beings | `gen/features.js` hostile loop (`WILD[bk]`). |

---

## 14. (3) Prioritised change list (small, specific)

**P0: plumbing (nothing else works without it)**
1. `core/tables.js`: add `id` to every MYST entry (`ancient_ruins`, `ley_nexus`, `planar_rift`, ...). Keep `n` for display; switch `provinceTags`, `app/stories.js` and storyline `site:` lists to ids (or map `n -> id` in one place).
2. `gen/traits.js`: roll 0-2 premises with `makeRng(seed+"|traits|premise")`, respecting slots/era/genre/excludes/pairs; return `v.premises = [{ id, truth }]`. Honour a user override.
3. New `gen/premises.js`: `premiseWorldTags(G)` returning the Set (`premise:*`, `slot:*`, `compat:*`, `access:*`, `truth:*`, premise `tags`, `default:power`, `default:cosmos`). Call it from `regionTags`, `storiesFor` and wherever realm tags are frozen.
4. `gen/society.js provinceTags`: emit `here/near:node` and `here/near:breach` always; emit `here/near:ley` only if `default:power`, `here/near:rift` only if `default:cosmos` (or rift claimed by a compatible premise).
5. `app/stories.js`: same switch for `has:ley`/`has:rifts`.

**P1: stop the hard contradictions**
6. Add `"default:power"` to the 13 items in §12.2.
7. `content/stories.js`: add `slots` to all 15 BIGs (§12.1); in `app/stories.js` drop BIGs whose exclusive slot is premise-filled (unless absorbed), clamp soft-slot BIGs to `stage 0` when a premise fills the slot, and allow at most one main `apocalypse` BIG per world.
8. `age_of_sails` and `lost_expedition`: `req` add `{ any: ["!slot:world-edge", "compat:open_sea"] }`.
9. `god_dying`: dropped under any `slot:divine-order` unless absorbed (falls out of step 7).
10. `balanced_circle.js`: add `suppress: { techs: ["transmutation"], storylines: ["mad_alchemist"] }`, `claims: "glass_desert"` on a site (and remove the duplicate "Glass waste" mapMark), `reskin.node`, a faith, `projects` (Great Circle), `goods` (red shards), `power.access: ["trained"]`.

**P2: make generic magic premise-aware**
11. `core/text.js`: default slots `{power}="magic"`, `{user}="mage"`, `{users}="mages"`, `{node}="the ley lines"`, overridden by the active power premise's `power` block.
12. Reword the ~15 items in §12.4 to use them (arcane trait, magocracy, arcane_council, war_mages, arcane_barrage, battle_mages, Arcane Tower, magic_crackdown, wild_magic, great_working, citadel_thaw, 4 lore lines, 3 news lines).
13. `war_mages`: drop in realms where a premise `role:"magic"` unit has weight > 0.
14. `wild_magic` and SMALL `spark_child`: add `!access:trained`.

**P3: pre-existing inconsistencies to fix while there**
15. SMALL `spark_child`, `hedge_witch`, `twin_births`, `bookseller`: add `req: "!magic:low"`.
16. SCHOLAR_ROLES: make conditional (`ley-surveyor` needs `has:ley`, `rift-scholar` needs `has:rifts`, `magister` needs `!magic:low`).
17. `storm_glass`: reword "rift-water" -> "storm-water", or restrict to `near:rift`.
18. SMALL `ley_hum`: `req: "here:ley"` (drop the `near:rift` route).
19. `floating_foundations`: require Floating Isles (`near:floating_isles`) or `premise:strewn_sky`, not any mystery.
20. `has:fallen_empire` is set unconditionally: keep as default, but let a history-secret premise bind it (`fallenEmpire` field) and make `empire_returns` stage 4 ("army of the dead") conditional on `!slot:afterlife || premise:unquiet_gate`.

**P4: conversions (as each premise is written)**
21. `absorbs`: thinning <- the_shroud; walking_mountains <- titans_stir; last_kindling, long_dark <- dying_sun; long_dark <- long_winter (+ ashen_age for the ash truth); drowned_crown <- rising_sea; borrowed_grace, broken_writ, gods_twilight <- god_dying; quickening <- wild_magic; nursery_sea <- age_of_sails; power premises with a fading-source truth <- ley_failing; history-secret premises <- empire_returns; sky-origin premises <- the_comet; monster-source premises <- great_migration.
22. `claims`: downward_throat <- Bottomless Sinkhole; elder_lattice <- Ancient Ruins / Standing Stones; long_dark <- Frozen Citadel; drowned_crown <- Sunken Temple; underchord <- Singing Caves; great_root <- Whispering Grove / Blighted Wood; walking_mountains, body_of_the_world <- Petrified Titan; pale_visitor, seed_engine, forgotten_landing <- Meteor Crater; thinning <- Planar Rift.
23. `titans` overrides for walking_mountains, breach_born, body_of_the_world; suppress Floating Isles under strewn_sky; set archetype from world-shape premises.

**P5: polish**
24. Magic slider semantics (§2.6) and premise-family weighting by magic.
25. Name hygiene: "Owlbears", "Dragon Turtle" through the block-list check.
26. Tone-aware weights (`tone:*` world tag): whimsical titans/sea monsters down in grim/horror worlds.

---

## 15. Counts

| Area | KEEP | ADAPT | CONVERT | REMOVE |
|---|---|---|---|---|
| Map features (MYST 14, SPECIAL 4, titans, WILD) | 9 MYST, 3 forests, titans, WILD | Ley Nexus, Planar Rift, Floating Isles, Crystal Forest, Owlbears | Glass Desert, Blighted Wood (optional) | 0 |
| Society (traits, faiths, govs, origins, ideals) | ~60 | arcane, faith:ley, faith:void, magocracy, successor, rift_touched, arcane_council | 0 | 0 |
| Military / warfare / projects | all but 4 | war_mages, arcane_barrage, sky_citadel, ley_spire | 0 | 0 |
| Goods | 6 | ley_crystal, void_glass | 0 | 0 |
| Tech (inventions, institutions, roles) | ~105 | ~20 (mostly auto via tag switch) | 0 | 0 |
| BIG stories (15) | 2 | 5 | 8 (with a default kept) | 0 |
| MEDIUM / SMALL | ~150 | ~15 (most auto) | 0 | 0 |
| Storylines (36) | 31 | 4 | 1 (great_working) | 0 |
| Lore / news | all but ~9 | ~9 (wording) | 0 | 0 |
| Ecology / wildlife | all | 1 name (optional) | 0 | 0 |

Nothing needs removing outright: the default cosmology remains the right answer for any world whose
slots no premise fills, and the gating keeps it out of the way when one does.
