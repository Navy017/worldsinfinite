# World premises: structure and combination rules

A **premise** is the hidden backbone of a world: the one or two ideas that make it special and
that everything else quietly draws on. Players never read it outright; they piece it together
from fragments scattered through libraries, temples, ruins, oral tradition, travellers and key
people. This document sets out how premises are built, how they stack into regional and local
themes, and the rules for what may combine with what. The catalogue of premises themselves is in
`docs/research/` (power systems, science fiction, world structure) and summarised at the end.

Everything is built in the *essence* of well-known fiction and myth, then renamed and reworked as
our own, so the project can be public.

---

## 1. The four layers

| Layer | Per world | What it is | Hidden? |
|---|---|---|---|
| **Premise** (core theme) | 1, sometimes 2 | The world's backbone: a power system, the shape of the world, a secret history, a technology that changed everything | Deeply. Never written in one place; 40-60% of it only in the field |
| **Subtheme** (regional) | 4-10 | How the premise shows up in one region: customs, factions, technology, politics, wars | Partly. ~20% missing from libraries, the rest biased by who wrote it |
| **Thread** (local) | many | A town's festival, a ruin's inscription, a bloodline's secret, one experiment gone wrong | Mostly findable, scattered |
| **Plain knowledge** | everything else | Wildlife, geography, trade, laws, current events | ~5% missing or out of date |

Each premise carries a pool of subthemes; each world draws a few, weighted by the land and peoples
of each region. Not every subtheme connects back to the premise strongly: some draw on it
loosely, and some regions get "free" subthemes with no link at all, so the world doesn't feel like
one idea repeated everywhere.

---

## 2. What a premise is made of (the data format)

```
premise {
  id, name, pitch
  inspirations           // for us only, never shown
  slots                  // what part of the world it explains (see 3)
  tone, era, scale       // see 3
  truths                 // 1-3 alternative hidden truths; each world picks one
  rules                  // source, cost, limits, the forbidden act, how it is gained
  wielders               // institutions, orders, bloodlines, outlaws
  subthemes[]            // regional arcs, each with its own tags, requirements, weight
  sites[]                // mysteries / dig sites / anomalies, each with layers (surface, study, dig, revelation)
  beings[], items[]      // creatures, peoples, artefacts it adds
  tech[]                 // what realms can learn, early to late
  mapMarks[]             // how the world looks different (scars, fogged lands, walls, zones)
  historyRules[]         // what it makes happen over time (races, atrocities, crusades, cycles)
  fragments[]            // lore sources: kind, bias, depth (which layer of the truth it reveals)
  tags                   // what it gives to cultures, faiths, governments, tech, storylines
  requires, excludes, pairs  // the combination rules below
}
```

---

## 3. The axes every premise declares

### Slots: what part of reality it explains

A slot is a question about the world that the premise answers. **Two premises may not answer the
same exclusive question in two different ways.**

| Slot | Question it answers | Exclusive? |
|---|---|---|
| `power-source` | Where does supernatural power come from? | **Yes** |
| `power-access` | Who can use power, and how is it gained (born, trained, contract, item, implant)? | No: several routes can coexist |
| `cosmology` | What the world fundamentally is (a god's corpse, a prison, a simulation, a disc) | **Yes** |
| `world-shape` | The physical shape (sphere, disc with an edge, abyss, sky islands, endless ocean) | **Yes** |
| `world-edge` | What lies beyond the known map (a forbidden continent, an edge, a wall, a void) | **Yes** |
| `apocalypse` | What ends worlds or ages (a cycle, a returning enemy, a dying sun, a collapse) | Soft: one main, others as rumours |
| `history-secret` | The great lie about the past | Soft: one main |
| `afterlife` | What happens to the dead | **Yes** |
| `divine-order` | Whether gods exist, and what they are | **Yes** |
| `mind-substrate` | What a mind is (a soul, data, a pattern that can be copied) | **Yes** |
| `state-control` | How societies are held in check (surveillance, caste, faith) | No: varies by region |
| `augmentation` | How bodies are changed (mutation, implants, chimera work) | No |
| `ai-threat`, `ecology`, `economy-order`, `time` | Machine minds, the living world, who owns everything, how time behaves | Mostly not exclusive |

### Tone
`heroic`, `mythic`, `wonder`, `whimsical`, `grim`, `noir`, `horror`, `melancholy`, `satirical`, `hopeful`

- A world has **one dominant tone and at most one counter-tone**.
- **Counter-tones work as intrusions.** Horror intruding on a wonder world is great: the cosmic thing under the beautiful sky islands. Whimsy intruding on horror mostly isn't.
- Clashing pairs need the second premise to stay **secondary and hidden**, not co-equal:
  - heroic with horror
  - whimsical with grim
  - hopeful with noir

### Era
`stone`, `bronze`, `medieval`, `renaissance`, `industrial`, `modern`, `near-future`, `far-future`, `post-collapse`

- Each premise states the era range it works in, and the world's **genre preset** sets the era.
- **Post-collapse is a bridge.** A far-future premise can sit under a medieval world as a buried past: the "it was a starship all along" kind of world.

### Scale
`personal` (a power one person wields), `regional`, `world`

- At most **one world-scale premise that is visible on the map**. A second world-scale premise must be hidden or slow.

---

## 4. Combination rules

### Hard restrictions (never combine)
1. **Two answers to an exclusive slot**, for example:
   - two power sources: "magic is a dying god's blood" with "magic is the ley-lattice of the world"
   - two cosmologies: "the world is a simulation" with "the world is a god's corpse"
   - two world-edges: "a forbidden continent" with "the world ends in a waterfall edge"
2. **An era outside a premise's range** with no post-collapse bridge, for example:
   - uploaded minds in a bronze-age world, unless the uploads are a buried precursor truth
3. **Premises that cancel each other's core rule**, for example:
   - "nothing can be created without an equal cost" with "power is free and infinite to the chosen"
   - "machines that think are forbidden and absent" with "a rogue AI is everywhere", unless the ban is *because of* the AI, which is a pairing, not a clash
   - "death is final and the dead are gone" with "the dead walk and talk"

### Soft restrictions (allowed only in a particular shape)
- **Tone clashes:** the second premise must be secondary and hidden (an intrusion).
- **Two world-scale premises:** only one is visible; the other is hidden or slow (it ripens over history).
- **Two personal power systems:** allowed if they are framed as rival traditions or as two faces of one source. Examples:
  - aura-training and alchemy as "two schools"
  - one unified as "the same energy, read two ways", which can itself be a hidden truth
- **Tech and magic:** allowed if one is ascendant and the other fading, or if they are in open conflict (an industrial revolution against old magic).

### Pairings (combine well, often better than either alone)
- **One power system with one world-structure premise** is the default best pair. Examples:
  - alchemy + a forbidden continent: the continent is where the raw materials come from
  - aura-power + a world of walls: power is rationed to the wall-keepers
- **A history secret with almost anything:** the lie about the past is usually *about* the other premise.
- **State control with any power system:** the state monopolises the power; licences, registries, purges.
- **Ecology premise with a power system:** the power has ecological fallout (mutations, blights, chimera wildlife).
- **An apocalypse cycle with a precursor or history secret:** the last cycle's ruins are the dig sites.

### Unrestricted (any world can have them)
These are the texture layer: they never conflict and are drawn freely in every world.
- **Subthemes about people:** succession crises, trade leagues, holy wars, bandit kingdoms, guild revolts, plagues, migrations
- **Local threads, ordinary wildlife and monsters, most mysteries**, unless a mystery is a premise's own site
- **Storylines, unless they need a premise tag.** For example, the philosopher's-stone arc needs the alchemy premise.

---

## 5. How a world is built from this

1. **The genre preset** (fantasy, shonen, alternate history, cyberpunk...) sets the era, the tone range and which premises are allowed, with weights.
2. **Roll the premise.**
   - Pick 1 premise, by weight.
   - With some chance, add a second one that fits all the rules above. It is often the secondary, hidden kind.
   - Each premise picks one of its truths.
3. **Subthemes:**
   - For each region (a continent, culture area or group of realms), draw 1-2 subthemes from the premises' pools, weighted by the region's tags.
   - Add 0-1 free subthemes with no premise link.
4. **Threads:** seeded in towns, sites and peoples from the subthemes.
5. **Sites:** each premise contributes its own sites, and existing mysteries can be "claimed" by a premise, giving them layers.
6. **Tags:** premise and subtheme tags flow into cultures, faiths, governments, technology, units, storylines and history rules, through the same rules engine everything else uses.
7. **Fragments** are written for every layer, with sources, bias and depth, and scattered:
   - **Libraries** get mostly plain knowledge and some subtheme pieces.
   - **Temples** get the faith's version.
   - **Ruins and sites** get the truth.
   - **People** carry what they discovered.
   - **History** writes new fragments as things happen.

---

## 6. The catalogue (77 premises in 6 families)

The full entries (truths, rules, factions, 8-12 subthemes, sites, beings, progression, fragments and
tags for every premise) are in:
- `research/premises-power.md`: power systems
- `research/premises-world.md`: world structure and cosmic secrets
- `research/premises-scifi.md`: science fiction

Below they are grouped into **families**. Families are what the combination rules mostly work on.

### A. Power systems: how individuals wield power (23)
| Premise | Essence | Exclusive slots |
|---|---|---|
| The Balanced Circle | Transmutation by equal exchange; the red catalyst is made of souls | power-source |
| Vowfire | Life-aura trained and strengthened by vows and restrictions | (none) |
| The Grudgewell | Power pooled from dread and curses; fighters project their inner world | power-source |
| Hungerfruit | Powers you eat; the sea drowns those who have eaten | world-edge (the sea) |
| The Bound Nine | Great beasts sealed in human hosts | (none) |
| The Shadeself | The soul takes form as a guardian with one ability | mind-substrate |
| The Quickening | Most people are born gifted; gifts strengthen each generation | (none) |
| The Tally | A voice that ranks everyone; gates and dungeons | power-source, world-edge |
| Ore-Burning | Swallowed metals burned for power | (cosmology, in some truths) |
| The Sworn Kindred | Spirit partners bound by oath; the day every knight broke theirs | divine-order |
| The Sundered Wellspring | A two-halved source, one half poisoned | power-source, cosmology |
| The First Tongue | True names | power-source, cosmology |
| Elemental Kinship | Four elemental arts and a reincarnating soul who can use all four | cosmology, divine-order |
| Glyphwright Science | Linking magic, runes and seals run like engineering | (none) |
| The Long Sight | A prescience substance from one desert, and the empire built on it | (none) |
| The Undersea | An otherworld of emotion and dreams that leaks power | power-source, cosmology |
| The Grafted | Monster hunters made by mutation after worlds collided | (none) |
| The Red Inheritance | Blood magic, a first progenitor, and the breathing schools that hunt its kin | divine-order |
| The Kindled Age | A dying first flame, or an imposed order that removed death | power-source, cosmology, afterlife |
| Borrowed Grace | Gods lend power and live on belief | power-source, divine-order |
| The Pact Market | Summoning contracts, devils bound in books, wish bargains | (none) |
| The Ascending Path | Cultivation towards immortality | cosmology |
| The Underchord | The world is a song still being sung | power-source, cosmology |

### B. World shape and edge: what the map is (9). These change the map itself.
| Premise | Essence | Exclusive slots |
|---|---|---|
| The Nursery Sea | The known world is a sheltered basin inside a lethal outer world (a forbidden continent) | world-edge |
| The Ward-Walls | People live behind walls; why is a lie | (local edge) |
| The Downward Throat | A layered abyss that punishes the climb back | (a feature, not exclusive) |
| The Body of the World | The land is a dead, sleeping or walking giant | world-shape |
| The Inner Sun | The world is hollow, with a world inside | world-shape |
| The Rim | Flat, with an edge | world-shape, world-edge |
| The Strewn Sky | Floating islands over a void | world-shape, world-edge |
| The Drowned Crown | An endless ocean over a sunken civilisation | world-shape |
| The Splinter World | One shard of a broken whole | world-shape, world-edge, cosmology |

### C. Cosmic secrets: what reality really is (10, after merging duplicates)
| Premise | Essence | Exclusive slots |
|---|---|---|
| The Sleeper (merges Unlidded Eye and Dreamer Beneath) | A sleeping alien god; knowing it changes you, and its dreams leak | cosmology, divine-order |
| The Hush Below (merges Undersea, as its cosmic form) | A silent sea of souls under reality, with a mortal-made patron in it | cosmology, afterlife (optional) |
| The Last Kindling (merges Kindled Age) | A first flame that must be fed or allowed to die | cosmology, apocalypse |
| The Pale Visitor | A benevolent orb in the sky, and what followed it | divine-order |
| The Great Root | A sick world-tree holding the realms together | cosmology |
| The Warden's Gaol | The world is a prison | cosmology, divine-order |
| The Gods' Twilight | Tyrant gods and the foretold war that ends them | divine-order, apocalypse |
| The Broken Writ | The sacred law shattered; demigods hold the shards | divine-order |
| The Thinning | An otherworld pressing through thin places | cosmology |
| The Painted Sky (from the sci-fi catalogue) | The world is constructed or simulated | cosmology, world-edge |

### D. Cycles and endings: how ages end (6)
| Premise | Essence | Exclusive slots |
|---|---|---|
| The Wheel of Suns | Cyclic ages, and this one is nearly over | apocalypse, time |
| The Long Dark | A returning endless winter, dying sun or ash sky | apocalypse |
| The Falling Hour | A falling moon, time loops or stopped time | apocalypse, time |
| The Unquiet Gate | Death is broken; the dead stay | afterlife |
| The Unremembering | The whole world forgets | (history-secret) |
| The Watchers in the Dark (from sci-fi) | Something harvests civilisations on a cycle | apocalypse |

### E. Hidden history: the lie about the past (5)
| Premise | Essence | Exclusive slots |
|---|---|---|
| The Elder Lattice | A vanished precursor empire and its sealed gates | (history-secret) |
| The Blood Debt | An ancient curse carried in bloodlines | (none) |
| The Leavings / The Visited Ground (merged) | Anomaly zones left by an incomprehensible visit | (none) |
| The Walking Mountains | Roaming titans with ecosystems on their backs (an ecology premise) | (none) |
| The Forgotten Landing (from sci-fi) | The ancestors came from the sky; the colony forgot | history-secret |

### F. Science fiction: technology that changed everything (24 more)
The Lattice Ascension (uploaded dead), the Vessel Peerage (body-swapping aristocrats), the Gentle Eye
(a scoring surveillance state), Chrome Fever (implant psychosis), the Ashen Net (network collapse,
rogue AIs walled off), the Made Kin (artificial people), the Gardener Engine (a lost terraforming
mind), the Sealed Refuges (vaults that were experiments), the Machine Liturgy (thinking machines
banned, technology worshipped), the Arithmetic of Ages (history secretly steered), the Kindled
Lineages (uplifted species), the Seed-Engine (an alien substance), the Converging Choir (psychic
children and a pull towards one mind), the Breach-Born (titans through a rift, linked pilots), the
Charter Lords (corporate feudalism), the Helix Peerage (gene castes), the Grey Unmaking (a nanoswarm
or plague that ended the old world), the Long Mending (a solarpunk recovery with a hidden cost), the
Fleshwright Covenant (grown technology), the Luminous Aether (steampunk and atomic
retro-futurism), the Unending Mobilization (a war that never ended), and the Branching (posthuman
divergence).

Exclusive slots in this family:
- `mind-substrate`: Lattice Ascension and Vessel Peerage
- `ai-threat`: Ashen Net and Machine Liturgy, which can be fused as before and after
- `state-control`: one primary at most (Gentle Eye, Sealed Refuges, Charter Lords, Unending Mobilization)

**The post-collapse bridge.** Eight of the science-fiction premises can sit *under* a fantasy or
medieval world as its hidden truth. In those worlds "magic" is misremembered technology:
- the Ashen Net
- the Gardener Engine
- the Sealed Refuges
- the Visited Ground
- the Machine Liturgy
- the Grey Unmaking
- the Long Mending
- the Forgotten Landing

This is one of the strongest kinds of twist available.

---

## 7. Combining across families

A world takes **one primary premise** and, often, **one secondary premise from a different
family**. Within a family, combining is mostly a merge (one idea told two ways), not a pair.

| | A Power | B Shape | C Cosmic | D Cycles | E History | F Sci-fi |
|---|---|---|---|---|---|---|
| **A Power** | Merge or rival schools only | **Best pair** | Good if the secret *is* the power's source (merge the slot) | Good: the power feeds or delays the ending | Good: the power came from the hidden past | Only as a post-collapse truth or open tech-against-magic |
| **B Shape** | | One shape and one edge at most | Good | Good | **Best pair**: the shape hides the history | Bridge only (a ship, an arcology, a dome) |
| **C Cosmic** | | | Merge only | Good, if the apocalypse slot is shared | Good | Painted Sky only |
| **D Cycles** | | | | One apocalypse only | **Best pair**: the last cycle's ruins are the dig sites | Watchers, Grey Unmaking |
| **E History** | | | | | Two can stack | Forgotten Landing and Visited Ground bridge both ways |
| **F Sci-fi** | | | | | | One state-control, one mind-substrate, one ai-threat |

### Hard conflicts (never)
- **Two premises with the same exclusive slot** (`power-source`, `cosmology`, `world-shape`, `world-edge`, `afterlife`, `divine-order`, `mind-substrate`), unless written as a deliberate merge where one becomes the other's hidden truth. For example:
  - Sundered Wellspring with Underchord
  - Rim with Strewn Sky
  - Unquiet Gate with the Kindled Age's "death removed"
- **Era mismatches with no bridge**, for example the Gentle Eye in a bronze-age world.
- **Rule cancellations:**
  - Balanced Circle's "everything costs" with any "power is free" truth
  - Machine Liturgy's "machines absent" with Ashen Net's "AIs everywhere", unless fused as before and after
- **"Game-shaped" frames together**, for example the Tally with the Kindled Age. They feel derivative.

### Soft (only in a particular shape)
- **Two world-scale premises:** one visible, one hidden and slow.
- **A tone clash:** the second premise is an intrusion, hidden, not co-equal. Horror under wonder is the classic.
- **Two power systems:** framed as rival schools, or as two readings of one source (which can be a truth to uncover). For example:
  - Hungerfruit + Vowfire: eaten power against trained will
  - Ore-Burning + Sworn Kindred: two shards of one dead god
- **Sci-fi with fantasy:** only when one is ascendant and the other fading, or as the post-collapse truth.

### Pairings worth seeding (tested in the research)
- **Balanced Circle + Grafted:** transmutation made the monster hunters; chimera regiments are the monsters.
- **Hungerfruit + Nursery Sea:** the sea that drowns the gifted is the barrier to the lethal outer world.
- **Vowfire + Nursery Sea:** the classic "licensed hunters and the forbidden continent".
- **Balanced Circle + Elder Lattice:** the great circles are precursor gates; the stone is the key.
- **Strewn Sky + Drowned Crown:** islands raised above a drowned world.
- **Body of the World + Gods' Twilight:** the gods murdered the giant; its kin bring the end.
- **Long Dark + Ward-Walls:** the ice wall.
- **Unquiet Gate + Last Kindling:** as the fire fades, the dead stop leaving.
- **Machine Liturgy + Arithmetic of Ages:** computers forbidden, human calculators steering history.
- **Chrome Fever + Ashen Net:** implants are the way in for the walled AIs.
- **Gentle Eye + Helix Peerage:** a scored, gene-sorted society.
- **Any fantasy premise + Forgotten Landing or Gardener Engine (as the hidden truth):** "the magic was the terraformer".

### Unrestricted (in every world, any mix)
- People-level subthemes: succession, trade leagues, holy wars, bandit kingdoms, guild revolts, plagues, migrations
- Local threads, ordinary wildlife and monsters
- Most mysteries and storylines, unless they need a premise tag

---

## 8. Genre presets: which premises each allows
| Preset | Era | Allowed families | Notes |
|---|---|---|---|
| **Classic fantasy** | medieval | A, B, C, D, E (F only as post-collapse truth) | The default |
| **Shonen** | medieval to modern | Mostly A (Vowfire, Grudgewell, Hungerfruit, Bound Nine, Shadeself, Quickening, Tally, Elemental Kinship, Ascending Path, Balanced Circle) + B (Nursery Sea, Strewn Sky, Downward Throat) | Personal power front and centre; tournaments, licences, rival schools |
| **Mythic** | stone to bronze | C, D, B, and A (Underchord, First Tongue, Borrowed Grace) | Gods, cycles, the world's body |
| **Grimdark** | medieval to industrial | A (grim ones), C (Sleeper, Gaol), D, E | Horror intrusions encouraged |
| **Flintlock and steam** | renaissance to industrial | A (Glyphwright, Long Sight, Balanced Circle), F (Luminous Aether, Unending Mobilization), E | Magic against industry |
| **Cyberpunk** | near-future | F (Chrome Fever, Ashen Net, Gentle Eye, Charter Lords, Vessel Peerage, Made Kin) | One state-control, one ai-threat |
| **Post-apocalypse** | post-collapse | F (Grey Unmaking, Sealed Refuges, Gardener Engine, Visited Ground, Long Mending), E | Ruins are the dig sites |
| **Far future** | far-future | F (Lattice, Branching, Kindled Lineages, Seed-Engine, Watchers, Arithmetic) | |

---

## 9. Name hygiene
- Inspirations lines and source titles are developer-only and are stripped before anything is generated.
- A final check blocks a list of source-work names and coined terms from any generated text.
- Premise, faction and creature names are our own or generated from the world's languages.
