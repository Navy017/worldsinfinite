// The Branching: humanity split into kinds who no longer share bodies, values or a sense of time.
export default {
  id: "branching",
  name: "The Branching",
  family: "scifi",
  pitch: "Humanity split into kinds shaped for the sea, the void, the machine and the old soil, who no longer share bodies, values or even a sense of time, and must now decide whether they still share a future.",
  slots: ["augmentation", "bloodline"],
  tone: ["wonder", "melancholy"],
  era: ["far-future"],
  scale: "world",
  genres: ["farfuture"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "helix_peerage", w: 2.5 }, { id: "lattice_ascension", w: 2 }, { id: "kindled_lineages", w: 2 }, { id: "charter_lords", w: 1.2 }],

  cast: [
    { role: "investigator", n: "a Concord archivist of the Deep kin who reads the founders' records", home: "coast", stance: "Believes the branches can be reconciled if the old records are read honestly, and is patient enough to read all of them." },
    { role: "official", n: "a Shaped patron who sits for the gardens on the Concord of Kinds", home: "forest", stance: "Holds that every branch owes its comfort to the Concord's quiet, and that some questions are simply rude." },
    { role: "believer", n: "a preacher of the One Root, the faith that the branches will be rejoined", home: "inner", stance: "Believes the founders pruned humanity to save it, and that the gardener's hand will bring the branches home." },
    { role: "survivor", n: "a garden child who ran from the autumn crowning and was made over by a crosser", home: "border", stance: "Belongs to no branch now, and wants the gardens emptied before another garden child is crowned." },
  ],

  truths: [
    { id: "planned", n: "The split was planned", d: "When the founders saw that no single kind of human would survive the coming centuries, a council of nine wrote four branches for four futures: sea, void, machine and soil. They gave each branch reasons to distrust the others, so that none would join too early, and sealed a reunion protocol in the writing-house to open when all branches stand in one room. The distrust worked far better than planned; the branches have not shared a room in 600 years.", tags: ["truth:branch_plan"],
      known: [
        "Every branch carries the same locked gene in the same place, and it does nothing. A crosser surgeon thinks it was written on purpose.",
        "The writing-house door is carved 'Divided to survive. Rejoined to live.' It has four handprints, one for each branch, and has never opened.",
        "A founders' minute orders each branch to be given 'a reason to distrust the others'. The branches' old hatreds may have been written for them.",
        "Confirmed: nine founders split humanity deliberately and planned a reunion. The distrust they planted is the only part of the plan that has worked.",
      ] },
    { id: "farmed", n: "One branch farms another", d: "The Shaped patrons extend their lives with the bodies of the garden folk: organs, marrow and years, taken at the autumn crowning from youths of about nineteen. Each crowned child adds about twenty years to one patron. The beautiful, idle people of the gardens are not a privileged class. They are livestock, and the oldest patron on the Concord has used up forty-one of them.", tags: ["truth:branch_farmed"],
      known: [
        "Garden youths crowned at the autumn feast are never seen again. The Shaped say they join their patrons' households.",
        "A runaway says a twin's patron looked ten years younger the spring after the crowning, and wore the twin's ring.",
        "A yield ledger credits patrons with 'years' for each youth 'transferred'. The feast hall's cellars are tiled, cold and fitted with drains.",
        "Confirmed: the Shaped live on the garden folk. The physicians who do the work keep case-books, and the patrons keep the crowns in glass cases.",
      ] },
    { id: "preserve", n: "The old stock is a museum", d: "The unaltered humans do not live free on their farmland. The other branches fenced them in 600 years ago as a living sample of the old stock, and keepers run their weather, wells and disease screens and count them every Visiting Day. The reserve's budget is now under review, and the keepers' report recommends culling the more troublesome valleys to save money.", tags: ["truth:branch_preserve"],
      known: [
        "Sheep and birds will not cross a line in the hills. Posts along it carry glass eyes that turn to follow walkers.",
        "Visitors in sealed carriages tour the old-stock villages once a year, take notes and never get out. The treaty says the old stock are free and uncounted.",
        "A buried keeper's station records a 'specimen count' of the villages and a notice of 'funding review'. A well failed the winter the review began.",
        "Confirmed: the old stock live in a reserve, and the keepers are deciding whether to keep paying for it, or to cull it.",
      ] },
  ],

  tags: ["branched_kin"],

  subthemes: [
    { id: "slow_envoy", n: "The Slow Embassy", d: "An envoy must carry a treaty between a branch that thinks in seconds and one that thinks in seasons. Each side believes the other is stalling.", w: 1.2, req: { any: ["urbane", "mercantile", "hospitable", "open_roads"] }, tags: ["theme:slow_embassy"] },
    { id: "reserve_visit", n: "The Visiting Days", d: "Once a year, other branches tour the old-stock farmland in sealed carriages. The residents are told to wear their festival clothes and to smile.", w: 1.2, req: { any: ["river", "grass", "tribal", "egalitarian", "faith:ancestors"] }, truthLink: "preserve", tags: ["theme:visiting_days"], mark: { kind: "zone", n: "Heritage reserve", color: "#9aa86a", size: [2, 5], where: "inner" } },
    { id: "harvest_festival", n: "The Garden Festival", d: "In the gardens of the Shaped, the young are crowned with flowers each autumn and led away to a great feast. None of them are ever seen again.", w: 0.9, req: { any: ["hierarchical", "lavish", "forest", "warm"] }, truthLink: "farmed", tags: ["theme:garden_festival"] },
    { id: "hybrid_child", n: "The Child of No Branch", d: "A child born of two branches who should not have been able to have children at all. Every branch claims the child; none will say why it is so urgent.", w: 0.9, truthLink: "planned", tags: ["theme:hybrid_child"] },
    { id: "kin_plague", n: "The Narrow Plague", d: "A sickness that kills only one branch and leaves the others untouched. Everyone has a theory about who made it.", w: 0.8, req: { any: ["atwar", "has:rival", "martial", "insular"] }, tags: ["theme:narrow_plague"] },
    { id: "fading_branch", n: "The Fading Kind", d: "A branch that has had fewer children each generation is now down to a few thousand. Its neighbours are already measuring its territory.", w: 0.9, tags: ["theme:fading_kind"] },
    { id: "departure", n: "The Ones Who Left", d: "One branch has packed its cities into ships and gone outward, leaving empty towers and no forwarding address. Some of the others feel abandoned; some feel relieved.", w: 0.7, req: { any: ["coastal", "seafaring", "has:port", "scholarly"] }, tags: ["theme:departure"] },
    { id: "deep_kin", n: "The Deep Kin", d: "The sea-shaped branch lives on the shelf and in drowned towns, gilled, slow and patient. Their trade in pearls and pressure-iron keeps the coast alive.", w: 1.3, req: { any: ["coastal", "island", "seafaring"] }, tags: ["theme:deep_kin"], mark: { kind: "zone", n: "Drowned settlements", color: "#3a6a8a", size: [1, 3], where: "coast" } },
    { id: "wired_lover", n: "The Fast Heart", d: "A machine-branch mind has fallen in love with a soil-born poet. It thinks so fast that each wait between the poet's letters feels like a lifetime.", w: 0.7, req: { any: ["scholarly", "urbane", "academies"] }, tags: ["theme:fast_heart"] },
    { id: "crossers", n: "The Crossers", d: "Back-room surgeons who will move you from one branch to another, for a price and a great deal of pain. It is the gravest crime every branch agrees on.", w: 1, req: { any: ["urbane", "mercantile", "has:city", "has:port"] }, tags: ["theme:crossers"] },
    { id: "concord", n: "The Concord of Kinds", d: "The assembly where every branch has a seat and nothing is ever decided. Its transcripts are full of very polite threats.", w: 1, req: { any: ["republic", "gov:noble_republic", "gov:merchant", "gov:elective"] }, truthLink: "planned", tags: ["theme:concord"] },
  ],

  sites: [
    { id: "template_lab", n: "The Writing-House of $", kind: "ruin", where: "remote", d: "The laboratory where the first branch templates were written.",
      layers: {
        surface: { n: "Four spirals", text: "A white ruin on a hill, its walls carved with four spirals. Each branch claims one spiral as its own symbol, and the branches have sued each other in the Concord twelve times over who may repaint them." },
        study: { n: "Interlocking", text: "{investigator} traced the spirals onto cloth. They are written templates for the four kinds of body, and they are drawn interlocking: laid over one another, they make a single pattern with no gaps." },
        dig: { n: "The founders' door", text: "In the deepest vault is a door with four handprints and a charter: 'Divided to survive. Rejoined to live. When all four stand here, open.' A ledger says the key went to the Concord's first chair, whose papers are held by the garden patrons at {lead}.", points: "cast:official" },
        revelation: { n: "Rejoined to live", text: "Nine founders split humanity into four kinds so one would survive the hard centuries. They sowed distrust between the branches on purpose, so none would rejoin too early. It worked too well. The door has waited 600 years, and no four branches have ever agreed to stand in one room." },
      }, truthLink: "planned" },
    { id: "unfinished_monument", n: "The Monument of Kinds at $", kind: "wonder", where: "capital", d: "A great monument inscribed in the tongues of every branch but one.",
      layers: {
        surface: { n: "The blank face", text: "A tower of black stone, ninety feet high, carved with a welcome in the script of every branch. One face is blank. Guides tell visitors it was left for kinds not yet born." },
        study: { n: "Ground smooth", text: "The blank face was not left empty. It was ground smooth about two hundred years after the other faces were cut. The marks show three different tools, and a mason's tally scratched at the base counts forty days." },
        dig: { n: "The fifth script", text: "Under the polish are traces of a fifth script, the language of a branch no living record mentions. One repeated word seems to mean 'cold'. The same script appears among the founders' templates at {lead}.", points: "site:template_lab" },
        revelation: { n: "The kind that was ground away", text: "There were five branches, not four. The fifth was written for ice and dark. The other four fought it over the northern shelf and wiped it out in one generation. Then the Concord ground its words off the monument and wrote primers that count to four." },
      } },
    { id: "feast_hall", n: "The Long Table of $", kind: "dig", where: "forest", d: "A garden hall where the Shaped hold their autumn feasts.",
      layers: {
        surface: { n: "The pavilion", text: "A beautiful pavilion in a perfumed garden, open to visitors each spring. The long table seats sixty. Visitors are shown the flower crowns from every autumn feast, kept in glass cases along the wall." },
        study: { n: "The cellars", text: "The hall's cellars are larger than the hall: cold, tiled white and fitted with drains. {investigator} paced them out at three times the floor above. The garden staff say they are for keeping ice." },
        dig: { n: "The yield ledgers", text: "In a locked cellar room are ledgers of 'yield' by garden family, with ages, weights and the years 'transferred' to named patrons. The largest account belongs to the patron who sits for the gardens, at {lead}.", points: "cast:official" },
        revelation: { n: "The long table", text: "The gardens are a farm. The Shaped patrons breed the garden folk for beauty and health, crown them at nineteen, and take their organs and years in these cellars. Each youth adds about twenty years to one patron. The feast is real. The guests of honour do not eat." },
      }, truthLink: "farmed" },
    { id: "reserve_fence", n: "The Glass Fence at $", kind: "anomaly", where: "border", d: "An invisible boundary that ringed the old-stock lands, recently found by a shepherd.",
      layers: {
        surface: { n: "The line in the hills", text: "Sheep will not cross a certain line in the hills, and birds turn back from it. A shepherd found it in {year}, when twelve ewes lay down along it in a row and would not get up." },
        study: { n: "Glass eyes", text: "The line is a perfect curve 300 miles long. Posts hidden in the gorse along it carry small glass eyes that turn to follow anyone near. {investigator} walked nine miles of it and was watched the whole way." },
        dig: { n: "The keeper's station", text: "A buried keeper's station holds a ledger of 'specimen counts' and a Concord notice headed 'funding review'. A note on the notice says it was copied to the Concord archive at {lead}.", points: "cast:investigator" },
        revelation: { n: "Under review", text: "The old stock are not free folk. The other branches fenced them in as a living exhibit 600 years ago and have run their weather and wells ever since. The keepers' last report recommends culling the troublesome valleys to save money. The Concord votes on it next session." },
      }, truthLink: "preserve" },
    { id: "silent_colony", n: "The Quiet Colony at $", kind: "ruin", where: "coast", d: "A colony of a lost branch, silent for a century, built for living conditions no one here recognises.",
      layers: {
        surface: { n: "No ground doors", text: "A coastal town of tall, narrow houses with no doors at ground level, empty and clean. The nearest fishing village has used its quay for a hundred years without once going inside." },
        study: { n: "Built for elsewhere", text: "Its people were shaped for heavier air and a dimmer sun. The stairs are steep and shallow and the windows are tinted dark. {investigator} found that the beds were built for bodies seven feet tall." },
        dig: { n: "The message", text: "The town hall wall carries a message in every branch's script: 'We went where we were written for. Follow when you are ready.' A star chart beside it marks one point of light. The same chart is carved on a wall at {lead}.", points: "site:template_lab" },
        revelation: { n: "Written for other worlds", text: "The branches were designed for other worlds, not this one. This colony built ships and left a century ago without telling the Concord. The founders meant every branch to follow. The rest are still here, arguing in the Concord over the rent on the empty towers." },
      } },
  ],

  beings: [
    { id: "deep_kin", n: "Deep kin", kind: "aquatic", d: "Sea-shaped humans with gills and wide dark eyes, slow on land and graceful below. They trade from drowned towers and plan by the tides.", danger: 0, biomes: ["shelf", "reef", "kelp", "lagoon"], look: { size: 1.8, group: [3, 20], move: "pod", speed: 4, col: "#3a6a7a", col2: "#a0c8d0", body: "fish", active: "dusk", visible: true } },
    { id: "shaped_folk", n: "Shaped", kind: "beast", d: "Tall, beautiful gene-sculpted people of the gardens, long-lived and soft-spoken. Some of them are several centuries old.", danger: 1, biomes: ["tempforest", "temprain", "rainforest", "grass"], look: { size: 2, group: [2, 12], move: "herd", speed: 3, col: "#e0c8b0", col2: "#6a8a5a", body: "biped", active: "day", visible: true } },
    { id: "proxy_walker", n: "Proxy body", kind: "beast", d: "A hollow-eyed machine body worn by a Wired mind to walk among the slower branches. When its mind withdraws, it simply stands where it was left.", danger: 1, biomes: ["grass", "desert", "badlands", "coldsteppe"], look: { size: 1.9, group: [1, 3], move: "solo", speed: 5, col: "#b0b4b8", col2: "#3a7ab0", body: "biped", active: "any", visible: true } },
    { id: "graze_lamb", n: "Garden lamb", kind: "grazer", d: "A docile, fleecy beast bred by the Shaped. Its meat is never eaten; its blood is drunk, and it lives in the same pastures as the garden children.", danger: 0, biomes: ["grass", "tempforest", "temprain"], look: { size: 1, group: [6, 30], move: "herd", speed: 4, col: "#f0eae0", col2: "#c8a8a0", body: "quad", active: "day", visible: true } },
  ],

  techs: [
    { id: "br_gill_masks", n: "Gill-masks", field: "medicine", level: 1, d: "Breathing gear that lets one branch visit another's air or water for an afternoon." },
    { id: "br_translators", n: "Sense-translators", field: "writing", level: 2, d: "Devices and trained people who carry not just words but timing and feeling between branches." },
    { id: "br_proxies", n: "Proxy bodies", field: "engineering", level: 3, d: "Bodies worn at a distance, so a slow mind can walk among the fast and a frail one in the deep." },
    { id: "br_crossing", n: "Crossing surgery", field: "medicine", level: 4, d: "The forbidden art of moving a person from one branch to another. Survivors never fully fit either branch." },
    { id: "br_templates", n: "The founders' templates", field: "natural_philosophy", level: 5, d: "The original branch designs, read in full. They were built to be combined again." },
  ],

  units: [
    { id: "br_proxy_guard", n: "Proxy guard", role: "infantry", wpn: "pike", kit: "plate", ranks: 3, gap: 1.4, size: 60, w: 0.8, mods: [["theme:slow_embassy", 2], ["theme:concord", 2], ["theme:crossers", 1.5]] },
    { id: "br_tide_riders", n: "Deep kin tide-riders", role: "beast", mounted: 1, wpn: "javelin", kit: "hide", ranks: 2, gap: 3, size: 40, w: 0.5, req: "coastal", mods: [["theme:deep_kin", 8]] },
  ],

  faiths: [
    { id: "br_one_root", n: "The One Root", d: "All the branches are one tree, and the faithful pray for the day it grows back together.", tags: ["faith:one_root"], w: 0.6, names: ["The One Root", "The Rejoining of $", "The Tree of Kinds"], mods: [["theme:hybrid_child", 4], ["theme:concord", 2], ["egalitarian", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Branch borderlands", color: "#7a8aa0", size: [2, 4], count: [1, 2], where: "border", d: "Neutral country where the air is filtered, the signs are in five scripts, and every branch can stand for an afternoon." },
  ],

  storylines: [
    { id: "br_hybrid", n: "The Child of {place}", scale: "local", anchor: "town", w: 1.5, req: "branched_kin",
      stages: {
        start: { h: "A child of two branches is born in {place}", b: "{person}, of the soil, and {person2}, of the deep, have had a child, which every physician said was impossible.", wait: [2, 6], fx: { unrest: 5 }, next: [{ to: "claimed", w: 2 }, { to: "hidden", w: 1, mods: [["insular", 2], ["hospitable", 1.5]] }] },
        claimed: { h: "Every branch sends envoys to {place}", b: "The Concord's delegates, the garden-folk and the deep kin have all come for the child of {place}, and all speak of 'custody' with unusual urgency.", wait: [3, 8], next: [{ to: "template_found", w: 1, mods: [["learned", 2], ["scholarly", 2]] }, { to: "taken", w: 2 }] },
        hidden: { h: "The family of {place} disappears", b: "{person} and {person2} slipped away with their child before the envoys arrived. The old-stock villages shelter them, and say nothing.", fx: { stability: -2 }, end: true },
        taken: { h: "The child of {place} is taken by the Shaped", b: "Garden envoys carried the child away in a sealed carriage. {person} has been given a pension and a promise of visits.", fx: { unrest: 10 }, end: true },
        template_found: { h: "The child of {place} opens the founders' door", b: "Scholars brought the child to the old writing-house. The sealed door recognised it, and opened, and the reunion protocol began to speak.", fx: { discovery: "natural_philosophy", prestige: 12, flag: "reunion" }, end: true },
      } },
    { id: "br_reserve_review", n: "The Review of {realm}", scale: "realm", anchor: "realm", w: 1.1, req: ["branched_kin", { any: ["realm:small", "realm:mid", "tribal", "egalitarian", "faith:ancestors", "river"] }],
      stages: {
        start: { h: "Strange carriages visit {realm}", b: "Sealed carriages have been crossing {realm} and stopping at every village. Their occupants count people, take notes and leave gifts no one asked for.", wait: [3, 8], next: [{ to: "fence_found", w: 2 }, { to: "gifts_accepted", w: 1, mods: [["mercantile", 2], ["poor", 2]] }] },
        fence_found: { h: "A shepherd of {realm} finds the edge of the world", b: "{person} followed a stray past the old hill line and found posts with glass eyes, and a station full of ledgers titled 'Specimen Count'.", wait: [2, 6], fx: { stability: -8, unrest: 12 }, next: [{ to: "uprising", w: 1, mods: [["martial", 2], ["unstable", 2]] }, { to: "petition", w: 1, mods: [["learned", 1.5], ["stable", 1.5]] }, { to: "reserve_closed", w: 0.7 }] },
        gifts_accepted: { h: "{realm} grows rich on visitors' gifts", b: "{ruler} welcomes the carriages and wears the gifted silks. The visitors call it a 'successful season'.", fx: { treasury: 60, prestige: -3 }, end: true },
        uprising: { h: "{realm} tears down the glass fence", b: "Mobs led by {person} smashed the watching posts along the hills. The keepers on the other side have not yet responded.", fx: { revolt: true, prestige: 6 }, end: true },
        petition: { h: "{realm} sends envoys to its keepers", b: "{ruler} has sent {person} through the fence with a letter demanding to be counted not as exhibits but as kin. The Concord has agreed to hear it, eventually.", fx: { prestige: 10, stability: 4 }, end: true },
        reserve_closed: { h: "The keepers stop paying for {realm}", b: "The carriages stopped coming. Then the rain stopped falling on time, and the old wells began to fail.", fx: { growth: -0.003, pop: 0.9, stability: -10 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", who: "Concord primer", points: "site:unfinished_monument", text: "Concord primer for the schools of every branch, issue of {year}: 'There are four great kinds of human, each written for its own world. The Deep breathe water. The Void live in thin air and cold. The Wired think a thousand times faster than you. The Shaped are tall, slow-ageing and beautiful. The Old Stock were left as they were, 600 years ago.' A teacher's note in the margin: 'Now count the faces on the monument at {lead}.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "A grandmother of {place}", text: "A grandmother's tale from the old-stock village of {place}, written down by {investigator} in {year}: once all people were one people, and they quarrelled over a single apple. So the gods cut the tree into four pieces and gave each people a branch. The grandmother keeps a dried apple core on the windowsill, and says it is for the day the branches come home." },
    { depth: "lore", about: "power", source: "traveller", bias: "exaggerated", reliable: "partial", who: "An old-stock wool-trader", text: "Letter of an old-stock wool-trader to a sister in {place}, {year}: 'I spent one hour talking with a Wired envoy, one of the fast-thinking kind. Afterwards it told me it had spent the hour writing an epic about the pauses between my words, 4,000 verses long. It gave me a copy. It is very good, and I am in it, mostly coughing.'" },

    { depth: "core", about: "truth:planned", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, Concord archivist", points: "site:template_lab", text: "Carved over the sealed door of the writing-house at {lead}, copied by {investigator} in {year}: 'Divided to survive. Rejoined to live. We, the nine founders, wrote four kinds of human for four futures, so that one at least would last. None was meant to stay apart. When all kinds stand here together, open.' Below it are four handprints: a webbed hand, a long one, a jointed one and an ordinary one." },
    { depth: "core", about: "truth:planned", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, Concord archivist", points: "cast:official", text: "Founders' minute, item 14, from the copy in {investigator}'s archive, {year}: '...each branch to be given a reason to distrust the others, lest any join too early. The Deep shall fear the Shaped; the Shaped shall despise the Old Stock... The reunion key is held in ███.' The blacking-out is in fresh ink. The register says the copy was last borrowed by the patrons' office at {lead}, nine years ago." },
    { depth: "core", about: "truth:planned", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, preacher of the One Root", points: "site:template_lab", text: "Litany of the One Root, led by {believer} at the spring meeting in {place}, {year}, before a congregation from 3 branches: 'We were pruned, not broken. A gardener does not prune a tree to kill it.' The congregation answers: 'And the four shall stand in one room.' Afterwards {believer} told the meeting that the room is real, and that its door waits at {lead}." },
    { depth: "core", about: "truth:planned", source: "library", bias: "official", reliable: false, who: "Resolution 1 of the Concord of Kinds", text: "Resolution 1 of the Concord of Kinds, reaffirmed in {year} on the motion of {official}: 'The divergence of the kinds was the free and natural choice of each people over 600 years, the result of no design and no plan. All claims to the contrary are sectarian myth. Sects that teach them shall lose their seats in the Concord gallery.'" },
    { depth: "core", about: "truth:planned", source: "person", bias: "true", reliable: "partial", cost: true, who: "A crosser surgeon of {place}", text: "Confession of a crosser surgeon, a back-room doctor who moves people between branches, to the court at {place}, {year}: 'Every branch has the same locked gene in the same place. It does nothing. It is waiting for a key; somebody wrote that on purpose. I tried to turn it in my apprentice, {person}, who asked me to. {person} lived three days and spoke four branch tongues before the end. I have stopped operating.'" },

    { depth: "core", about: "truth:farmed", source: "person", bias: "true", reliable: true, cost: true, who: "{survivor}, garden runaway", text: "Statement of {survivor}, a garden child who ran, to {investigator}, {year}: 'They crowned my twin, {person}, with flowers at nineteen, and the patrons kissed {person}'s hands. The feast lasted 3 days. Next spring {person}'s patron looked ten years younger and wore {person}'s ring. I watched the staff carry the crowns down to the cellar and come back up without them.'" },
    { depth: "core", about: "truth:farmed", source: "archive", bias: "redacted", reliable: "partial", who: "A garden yield ledger", points: "site:feast_hall", text: "A page from a garden yield ledger, carried out of {lead} under a coat in {year}: 'Family ███, autumn: two transferred, aged nineteen and twenty-two. Weights recorded.' [One line cut out.] 'Patron years credited: thirty-eight.' In the margin, a clerk has done a sum and written: 'Ahead of last autumn by six. Please thank the kitchen.'" },
    { depth: "core", about: "truth:farmed", source: "heretic", bias: "heretic", reliable: "partial", who: "{investigator}, Concord archivist", points: "site:feast_hall", text: "A warning song of the Deep kin, sung to the young before they trade inland, written down by {investigator} in {year}: 'Never take the garden's bread, never drink the garden wine; the gardeners eat at a long table, and the guests are what they dine.' The Deep have not sent a single youth to the gardens in 90 years. The Deep claim the long table still stands at {lead}." },
    { depth: "core", about: "truth:farmed", source: "library", bias: "propaganda", reliable: false, who: "Brochure of the Shaped gardens", text: "Brochure of the Shaped gardens, issued by {official} for the visiting season of {year}: 'The gardens are a haven of leisure and beauty for all 9,000 who live in them. No garden child has ever known hunger or work. The autumn crowning honours the young as they leave to join their patrons' households, where they are very well looked after.'" },
    { depth: "core", about: "truth:farmed", source: "person", bias: "true", reliable: true, plain: true, who: "Physician to {official}", text: "Case-book of the physician to {official}, patron of the gardens, {year}: 'Treatment 41 complete. Organs, marrow and about twenty years' growth taken from one garden youth of nineteen and given to the patron. The patron now walks without a stick. I have done this forty-one times for this patron alone. The gardens are not homes. They are pens, and I am the butcher.'" },

    { depth: "core", about: "truth:preserve", source: "ruin", bias: "true", reliable: true, plain: true, who: "A keeper's station report book", points: "site:reserve_fence", text: "Report book from a buried keeper's station on the glass fence near {lead}, opened by {investigator} in {year}. The last entry: 'Specimen count stable at 41,200. Weather and wells within budget. Recommend continued funding at reduced rate. Consider culling the more troublesome valleys to save on disease screens.' The station door is stamped with the Concord's seal." },
    { depth: "core", about: "truth:preserve", source: "oral", bias: "garbled", reliable: "partial", who: "A hill shepherd of {place}", text: "A hill shepherd of {place}, talking to {investigator} at the autumn fair of {year}: there is a glass wall at the end of the world. Sometimes faces look in through it, sad faces, the way you look at a fine old horse you can no longer afford to keep. The shepherd lost 12 sheep at the wall last spring. They walked up to it, lay down, and would not get up." },
    { depth: "core", about: "truth:preserve", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A Void kin pilgrim", text: "Diary of a Void kin pilgrim, one of the thin-air kind, on a tour of the old-stock lands, {year}: 'They live exactly as their ancestors did. Nothing changes there, not even the songs; I checked them against a 300-year-old songbook. It is the most beautiful place I have ever seen. Our guide told us twice that we must not tell them.'" },
    { depth: "core", about: "truth:preserve", source: "library", bias: "official", reliable: false, who: "{official}, for the Concord", text: "Treaty of the Concord, article 7, as read aloud by {official} on Visiting Day at {place}, {year}: 'The Old Stock lands are sovereign and free, untouched by any other kind. No branch shall count, tax or govern them.' The reading took place inside a sealed carriage. The 200 villagers who came to hear it listened through the glass." },
    { depth: "core", about: "truth:preserve", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "Concord budget, item 87", text: "Concord budget for {year}, item 87: 'Heritage reserve, {realm}: maintenance of weather, wells and disease screens. Under review.' Attached is a petition from the headman of {place}, {person}, asking why the rain came late. The three-line reply thanks {person} for the interest. That winter the well at {place} failed, and {person} lost both grandchildren to a fever the screens no longer stopped." },

    { depth: "sub", about: "sub:slow_envoy", source: "archive", bias: "official", reliable: "partial", who: "Concord transcript, session 612", text: "Concord transcript, session 612, {year}: 'The delegate of the Deep thanks the delegate of the Wired for her remarks, which arrived across eleven months and were much appreciated. The delegate of the Wired has meanwhile resigned, married, written a history of this session, and died.' Motion to adjourn: carried, after a delay of 14 days." },
    { depth: "sub", about: "sub:reserve_visit", source: "person", bias: "true", reliable: true, who: "The headwoman of {place}", points: "site:reserve_fence", text: "The headwoman of {place}, talking to {investigator}, {year}: 'On Visiting Day we put on our best and wave at the carriages. There were 30 carriages last year. My grandson asked why the visitors never get out. I had no answer. This year he asked why they write in little books when we wave. I have no answer to that either. The carriages leave by the hill road, toward {lead}.'" },
    { depth: "sub", about: "sub:crossers", source: "person", bias: "true", reliable: "partial", who: "{survivor}, crosser-made", text: "From the memoir of {survivor}, {year}: 'I was born in the gardens and wanted the sea. A crosser, one of the back-room surgeons, cut me for 9 months and took 400 crowns. Now I cannot breathe air or water for long. I live in the shallows, which belong to no branch, and sell what the Deep drop. Every branch would hang the crosser. Not one of them would take me back.'" },
    { depth: "sub", about: "sub:fading_branch", source: "traveller", bias: "true", reliable: "partial", who: "A coast trader", text: "Letter of a coast trader to the Concord archive at {place}, {year}: 'Their towers are mostly dark now. I counted 11 lit windows in a city built for 80,000. The last few hundred walk the empty halls at night, very gently, as if trying not to wake anyone. Two Deep surveyors were measuring the harbour while I was there. Nobody stopped them.'" },
    { depth: "sub", about: "sub:wired_lover", source: "person", bias: "true", reliable: true, who: "A Wired mind, to {person}", text: "Letter from a Wired machine-mind to {person}, a poet of the soil, delivered at {place} in {year}: 'Between your letters I live a thousand years, and every one of them is about the last thing you wrote. You wrote that the plums were ripe. I have spent 40 of those years on the plums. Please write again soon. I am running out of things to think about plums.'" },
    { depth: "sub", about: "sub:concord", source: "archive", bias: "official", reliable: false, who: "{official}, for the Concord", text: "Annual report of the Concord of Kinds to the branches, {year}, signed by {official}: 'The Concord has resolved every dispute brought before it in a spirit of mutual respect, and no branch has ever had cause to complain.' The appendix on the next page: 'Disputes outstanding: 1,212. Average age of a dispute: 61 years. Oldest: the rent on the empty towers.'" },
    { depth: "sub", about: "sub:hybrid_child", source: "person", bias: "pious", reliable: "partial", who: "{believer}, preacher of the One Root", points: "site:template_lab", text: "Letter of {believer}, preacher of the One Root, to the congregation at {place}, {year}: 'A child has been born to a Deep mother and a Wired father, which every physician says cannot happen. The child is 3 and already speaks four branch tongues. Five branches have sent envoys to claim the child. We mean to carry the child to the sealed door at {lead} before any of them arrive.'" },
    { depth: "site", about: "site:unfinished_monument", source: "heretic", bias: "heretic", reliable: "partial", who: "A One Root follower", points: "archive", text: "Scratched at the foot of the monument in {place}, beside the blank face, in {year}: 'Ask what the fifth face said. Ask why they polished it away 200 years after the others were cut. Ask who paid the stonemason for forty days of grinding. The bill is still on file in {lead}.' The guides scrub it off every month. It comes back every month." },
    { depth: "site", about: "site:silent_colony", source: "ruin", bias: "true", reliable: true, who: "{investigator}, Concord archivist", text: "Painted on the town-hall wall of the quiet colony at {place}, in the script of every branch, found by {investigator} in {year}: 'We went where we were written for. Follow when you are ready.' Under it someone left 600 pairs of shoes in rows, one pair per household, all too long and narrow for any foot living here now." },
  ],
};
