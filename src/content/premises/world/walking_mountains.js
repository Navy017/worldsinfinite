// The Walking Mountains: colossal titans roam the land on slow migrations, and whole ecosystems live and die on them.
export default {
  id: "walking_mountains",
  name: "The Walking Mountains",
  kind: "history",
  family: "world",
  pitch: "Some mountains move. Huge titans walk the land on migration routes older than any kingdom, carrying forests, rivers and towns on their backs. Where they walk decides where people can farm and live.",
  slots: ["ecology", "monster-source"],
  tone: ["wonder", "grim"],
  era: ["stone", "bronze", "medieval", "renaissance", "industrial"],
  scale: "regional",
  genres: ["fantasy", "mythic", "shonen", "grimdark"],
  w: 1,
  excludes: [],
  pairs: [{ id: "body_of_the_world", w: 2.5 }, { id: "nursery_sea", w: 2 }, { id: "strewn_sky", w: 2 }, { id: "elder_lattice", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a surveyor of the corridor calendars, who records the passing of every titan", home: "inner", stance: "Believes the titans follow rules that can be written down, and wants the realm to farm by them." },
    { role: "official", n: "a factor of the Hunters' Lodge who signs the kill licences", home: "capital", stance: "Holds that titans are a resource like timber, and that the Lodge's licences keep the hunt orderly and the realm rich." },
    { role: "believer", n: "a Keeper of the Path who walks beside the titans and turns back hunters", home: "forest", stance: "Holds that blocking a titan's path is the only true sin, and will use poisoned darts to prove it." },
    { role: "survivor", n: "an elder of a back-clan whose titan lay down and did not rise", home: "remote", stance: "Wants land for the clan and wants the lowlanders to listen to what the clan knows about titans before it is too late." },
  ],

  truths: [
    { id: "gardeners", n: "The titans are gardeners", d: "The titans tend the world. Their migrations carry soil, seed and rain to lands that would otherwise die, and every footprint is a sown field. The Hunters' Lodge has killed them for bone and hide for two centuries, and each kill has turned a province to dust. The Lodge's own tallies show the herds halved, and the Lodge has asked to widen the hunt.", tags: ["truth:titan_gardeners"],
      known: [
        "Farmers on the migration corridors say the soil is richest the year after a titan passes. The Lodge says droughts in the corridor provinces come from the sea winds and have nothing to do with its lawful hunt.",
        "Tax rolls from one corridor province show harvests halving the year after a great titan-kill, then falling to nothing. The rains that had followed the titan every autumn for as long as anyone remembered stopped coming.",
        "Under the bed of a lake shaped like a footprint, divers found seed-pods packed in clay, a dozen kinds to a pod. The same plants grow in a line of round ponds along the corridor.",
        "Confirmed: the titans sow the land and the rain follows them. Every titan the Lodge kills takes a province's harvest with it. The Lodge has seen the figures and is hunting harder.",
      ] },
    { id: "larval_gods", n: "The titans are young gods", d: "The titans are larvae. When they finish growing they stop walking, split along the spine and hatch, and the winged creature that comes out does not care about the towns on its back. The back-clans know the signs and leave in time. The Lodge sells the still titans as merely dying, and lets settlers move onto them.", tags: ["truth:titan_larvae"],
      known: [
        "Back-clan elders say old titans go quiet and stop eating, and that is when a clan must leave. The Lodge says a still titan is simply dying and its splitting hide is ordinary decay.",
        "In the badlands lies a titan skeleton with a second, smaller skeleton curled inside its ribs, of an entirely different shape: long-necked and legless, with wings folded along its spine.",
        "Paintings inside the twin skeleton show a winged shape rising out of a titan's back. The outer ribs were split from the inside. A still titan in the remote hills is splitting along its spine now.",
        "Confirmed: a titan is a cocoon, and what comes out has wings. The back-clans have always known. The settlers the Lodge sold land on a still titan have not been told.",
      ] },
    { id: "weapons", n: "The titans are weapons", d: "The titans were bred as war-engines in a forgotten war, numbered and harnessed. Their migrations are patrol lines, and they still obey a command no one living remembers, waiting for the word that sends them to war. A court has hired tamers to relearn the calls one by one; the third call already turns every titan in earshot to face the same way.", tags: ["truth:titan_weapons"],
      known: [
        "Old tamers say the titans patrol rather than wander, and never leave a line on the map. Scholars say the migrations follow grass and water. The titans' routes have not moved in recorded history.",
        "Shed titan-hide carries rows of rusted iron rivets in the pattern of a harness. One ring is stamped 'Seventeenth Walker. Northern line. Await the word.' Cliff paintings show riders with horns on the titans' brows.",
        "A court memorandum reports that the titans answer the tamers' third call by turning to face the same direction. The rest of the report is sealed by royal order, and the court has asked for a fourth horn.",
        "Confirmed: the titans are numbered war-engines walking patrol lines, waiting for orders from a war nobody remembers. A court has hired tamers to relearn the calls, and they have three. Nobody knows what the last call does.",
      ] },
  ],

  tags: ["walking_titans"],

  subthemes: [
    { id: "path_broken", n: "The Broken Path", d: "A titan has left its migration corridor for the first time in recorded history, and is walking straight toward the capital.", w: 1, req: { any: ["near:titan", "realm:large", "realm:vast"] }, truthLink: "weapons", tags: ["theme:path_broken"] },
    { id: "rain_fails", n: "The Rain That Followed", d: "Hunters brought down a titan for its bone. The rains that followed it every year did not come, and the province is turning to dust.", w: 1.1, req: { any: ["near:titan", "grass", "steppe", "savanna"] }, truthLink: "gardeners", tags: ["theme:rain_fails"], mark: { kind: "zone", n: "The dust after the kill", color: "#b0956a", size: [1, 3], where: "any" } },
    { id: "back_clans", n: "The Back-Clans", d: "Nomad clans live their whole lives on a titan's back, in towns among its moss and spines. Their titan is dying, and they have nowhere to go.", w: 1.3, req: { any: ["nomadic", "near:titan", "titan_touched", "tribal"] }, tags: ["theme:back_clans"] },
    { id: "hunters_lodge", n: "The Hunters' Lodge", d: "A great lodge hunts the lesser titans for bone, hide and marrow. Its hunters are rich, respected and increasingly worried about how few titans they see.", w: 1.4, mods: [["martial", 1.5], ["mercantile", 1.5], ["origin:titan_slayers", 3]], tags: ["theme:hunters_lodge"] },
    { id: "tamers", n: "The Tamers", d: "Horn-blowers who claim to steer titans with the old calls. One court has hired them. Its neighbours are terrified.", w: 0.8, req: { any: ["beast_tamers", "autocracy", "arcane"] }, truthLink: "weapons", tags: ["theme:tamers"] },
    { id: "hatching", n: "The Cracking Titan", d: "An old titan has stopped walking. Its back is splitting along the spine, and something underneath is moving.", w: 0.6, req: "near:titan", truthLink: "larval_gods", tags: ["theme:hatching"], mark: { kind: "zone", n: "The still titan", color: "#6a5a4a", size: [1, 2], where: "remote" } },
    { id: "boneyard_rush", n: "The Boneyard Rush", d: "A titan graveyard has been found in the badlands. Prospectors, priests and hunters are racing for the bones.", w: 1, req: { any: ["desert", "badlands", "hills", "mountain"] }, tags: ["theme:boneyard_rush"], mark: { kind: "zone", n: "The boneyard", color: "#d8cfb8", size: [1, 3], where: "desert" } },
    { id: "calf_sold", n: "The Captured Calf", d: "A titan calf the size of a barn was taken from its mother and sold to a king's menagerie. Its mother has not stopped calling.", w: 0.8, req: { any: ["has:city", "rich", "autocracy"] }, truthLink: "gardeners", tags: ["theme:calf_sold"] },
    { id: "carcass_city", n: "The City on the Carcass", d: "A city was built in the bones of a fallen titan, warm and sheltered. Now the carcass is beginning to rot, and the city's wells smell sweet.", w: 0.8, req: { any: ["has:city", "near:titan"] }, tags: ["theme:carcass_city"] },
    { id: "corridor_canal", n: "The Corridor Wall", d: "A sedentary realm is building a great wall and canal across a migration corridor to protect its farms. The keepers of the path call it murder.", w: 1, req: { any: ["artisans", "gov:empire", "frontier_forts", "great_roads"] }, truthLink: "gardeners", tags: ["theme:corridor_canal"] },
    { id: "keepers_path", n: "The Keepers of the Path", d: "A druidic order walks beside the titans, clearing the corridors and turning back hunters with poisoned darts.", w: 1.1, req: { any: ["faith:spirits", "faith:titan", "forest_folk", "titan_touched"] }, tags: ["theme:keepers_path"] },
  ],

  sites: [
    { id: "nested_skeleton", n: "The Twin Bones of $", kind: "dig", where: "desert", truthLink: "larval_gods", d: "A titan skeleton with an infant skeleton curled inside its ribs.",
      layers: {
        surface: { n: "The white ridge", text: "A ridge of white bone in the badlands near {place}, 600 paces long and the size of a hill. Prospectors have sawn it into blocks for 12 years. The Lodge sells the blocks for palace roofs at 40 crowns apiece." },
        study: { n: "The second skeleton", text: "Inside the great ribs lies a second skeleton, small and curled, of a different shape entirely: long-necked, with almost no legs. {investigator} measured it at 90 paces. The prospectors had been using it as a windbreak." },
        dig: { n: "Glass bones", text: "The inner skeleton has 8 wings folded along its spine, and its bones are not bone but something like smoked glass. The outer titan's ribs were split from the inside. A back-clan elder who knows these signs lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "The cocoon", text: "A titan is a cocoon. When it stops walking it splits along the spine, and something winged climbs out. This one died before it finished. The Lodge has sold the outer bones for decades and never once mentioned what was inside." },
      } },
    { id: "harness_rivets", n: "The Riveted Hide at $", kind: "ruin", where: "any", truthLink: "weapons", d: "A shed titan-hide with ancient iron rivets and harness rings driven into it.",
      layers: {
        surface: { n: "The leather field", text: "A slab of shed titan-hide as big as a field, sold by the Lodge's hunters at {place} as leather for 2 crowns a yard. The tanners complain that it blunts their knives and is full of old iron." },
        study: { n: "The strap pattern", text: "{investigator} pegged out the hide and mapped the iron. Rows of rusted rivets run along it in a pattern of straps and girths: 340 rivets, evenly spaced, like a horse's harness grown a thousand times over." },
        dig: { n: "The stamped ring", text: "One harness ring, as wide as a cartwheel, is stamped with a badge and words: 'Seventeenth Walker. Northern line. Await the word.' The same badge is painted on the cliffs at {lead}.", points: "site:rider_glyphs" },
        revelation: { n: "The war-engines", text: "The titans once wore harness. They were bred for a war nobody remembers, numbered, and sent out on patrol lines to wait for orders. They are still on the lines. A court has hired tamers to relearn the calls, and the tamers have learned three." },
      } },
    { id: "rider_glyphs", n: "The Rider Cliffs of $", kind: "ruin", where: "mountain", d: "Cliffs painted with titans and tiny riders on their heads.",
      layers: {
        surface: { n: "Ochre beasts", text: "Ochre paintings of great beasts cover 70 paces of a sheltered cliff above {place}. Shepherds shelter under the overhang in storms and add their own marks. The oldest paintings lie under a skin of stone the rain laid over them." },
        study: { n: "Riders on the brow", text: "Each titan is drawn with a tiny figure standing on its brow, holding a horn to its mouth. {investigator} counted 26 titans and 26 riders. No rider is drawn without a horn, and no titan without a rider." },
        dig: { n: "The cave of horns", text: "Under the paintings is a cave holding 400 horns of every size, and one carved from a titan's tooth. Each horn is notched with a number of lines. The Lodge factor {official} has offered to buy the lot, and writes from {lead}.", points: "cast:official" },
        revelation: { n: "The calls", text: "People once gave the titans orders with these horns, and each number of notches was a different command. The painters stood on the titans' brows and steered them. Nobody painted what became of the riders. The tooth-horn has 3 notches." },
      } },
    { id: "footprint_lake", n: "The Footprint Mere of $", kind: "wonder", where: "any", truthLink: "gardeners", d: "A lake that is a titan's footprint, the richest land in the realm.",
      layers: {
        surface: { n: "The round mere", text: "A round lake near {place}, half a mile across, ringed by the finest farms in the province. Land on its shore sells for 5 times the price of land a mile away. The farmers just call it the foot." },
        study: { n: "Black soil", text: "The soil around the lake is black and 6 feet deep, seeded with plants that grow nowhere else: a red barley, a bean with a blue flower. {investigator} found the same plants around a line of round ponds running 40 miles east." },
        dig: { n: "Seed-pods in clay", text: "Beneath the lake bed, divers found seed-pods packed in grey clay, layer on layer, as if planted. Each pod holds a dozen kinds of seed. The Keeper {believer}, who keeps a record of every titan that passes, lives at {lead}.", points: "cast:believer" },
        revelation: { n: "The sowing", text: "The titans plant the land. Every footprint is a field they sowed, and the rain follows them to water it. The Hunters' Lodge has killed 30 titans on this corridor since its charter. The ponds east of the last kill have stayed dry." },
      } },
    { id: "sleeping_range", n: "The Sleeping Range of $", kind: "anomaly", where: "mountain", d: "A mountain range that is actually a sleeping titan.",
      layers: {
        surface: { n: "The ridge the maps dispute", text: "A long ridge of forested hills near {place} that no 2 maps agree about. The royal survey of {year} put it a league west of where the last one did. The villages on it say the maps are wrong, and say it slightly too firmly." },
        study: { n: "Warm springs", text: "By {investigator}'s reckoning from old boundary stones, the ridge has moved a league in a century. Its springs run warm in winter, and they pulse: stronger for a count of 40, then weaker for 40." },
        dig: { n: "The breathing hollow", text: "Miners broke into a hollow where warm air rushed in and out like breath, and fled, leaving 3 picks and a lamp. The mine's owner has filed a claim against the crown for damages, and the claim is held at {lead}.", points: "archive" },
        revelation: { n: "Asleep", text: "This is no range. It is a titan lying down, older and larger than any that walks. When the springs were first timed, each pulse lasted a count of 40. This year it is 34, and falling. The 4 villages on its back pay taxes to {realm}. None of them has been told what they are sitting on." },
      } },
  ],

  beings: [
    { id: "lesser_titan", n: "Lesser titan", kind: "grazer", d: "A walking hill of moss and stone, grazing whole forests as it goes. Hunted for bone and hide, revered by those who live in its wake.", danger: 2, biomes: ["grass", "savanna", "tempforest", "coldsteppe", "boreal"], look: { size: 40, group: [1, 3], move: "herd", speed: 3, col: "#6a6a4a", col2: "#4a7a3a", body: "quad", active: "day", visible: true } },
    { id: "back_lice", n: "Spine-tick", kind: "insect", d: "Dog-sized ticks that live on the titans' backs and drop off in swarms when a titan dies.", danger: 1, biomes: ["grass", "savanna", "tempforest", "coldsteppe"], look: { size: 0.8, group: [5, 40], move: "swarm", speed: 5, col: "#4a3a2a", col2: "#8a6a3a", body: "spider", active: "dusk", visible: true } },
    { id: "titan_heron", n: "Titan-heron", kind: "bird", d: "Long-legged birds that ride the titans and pick parasites from their hide; a flock in the sky means a titan below the horizon.", danger: 0, biomes: ["grass", "savanna", "swamp", "river"], look: { size: 1.2, group: [10, 60], move: "flock", speed: 45, col: "#e8e0d0", col2: "#3a3a3a", body: "bird", active: "day", visible: true } },
    { id: "grave_scavenger", n: "Bone-warg", kind: "predator", d: "Huge scavengers that follow dying titans for months and fight over the carcass.", danger: 2, biomes: ["badlands", "grass", "coldsteppe", "desert"], look: { size: 1.8, group: [4, 12], move: "pack", speed: 13, col: "#7a6a5a", col2: "#2a2a2a", body: "quad", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "wm_corridor_calendars", n: "Corridor calendars", field: "astronomy", level: 1, d: "Calendars that predict when each titan will pass, so farmers know when to sow and when to flee." },
    { id: "wm_titan_bone", n: "Titan-bone building", field: "architecture", level: 2, d: "Halls, bridges and palace roofs built of titan bone, light and stronger than stone." },
    { id: "wm_hide_armour", n: "Titan-hide armour", field: "metallurgy", level: 3, d: "Leather of titan hide that turns a sword and does not burn." },
    { id: "wm_great_horns", n: "The great horns", field: "arcana", level: 4, d: "Horns carved from titan tooth whose calls can turn a titan's course, or stop it." },
    { id: "wm_back_towns", n: "Back-towns", field: "engineering", level: 4, d: "Towns lashed to a titan's back, with rope bridges, cisterns and moss-fields that walk with it." },
  ],

  units: [
    { id: "wm_hunters", n: "Titan hunters", role: "ranged", wpn: "javelin", kit: "hide", ranks: 2, gap: 3, size: 60, w: 0.8, mods: [["theme:hunters_lodge", 6], ["origin:titan_slayers", 3]] },
    { id: "wm_back_riders", n: "Back-clan riders", role: "beast", mounted: 1, wpn: "spear", kit: "hide", ranks: 2, gap: 4, size: 40, w: 0.4, mods: [["theme:back_clans", 8], ["titan_touched", 3]] },
  ],

  faiths: [
    { id: "keepers_path", n: "The Keepers of the Path", d: "The titans walk the world awake so that we may sleep; to block their path is the only sin.", tags: ["faith:path"], w: 0.5, names: ["The Keepers of the Path", "The Walking Way", "The Footstep Rites of $"], mods: [["theme:keepers_path", 6], ["faith:spirits", 0.5], ["titan_touched", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Migration corridor", color: "#8a9a5a", size: [3, 7], count: [1, 2], where: "any", d: "A broad trampled track across the land, lush and empty of towns, where the titans walk." },
  ],

  storylines: [
    { id: "wm_path_breaks", n: "The Titan Turns Toward {capital}", scale: "realm", anchor: "titan", w: 1.4, req: "walking_titans",
      stages: {
        start: { h: "{titan} leaves its path", b: "For the first time in recorded history, {titan} has left its corridor. Riders from {place} say it is walking toward {capital}, slowly and without pause.", wait: [2, 6], fx: { unrest: 15 }, next: [{ to: "horns", w: 1, mods: [["theme:tamers", 3], ["theme:keepers_path", 2]] }, { to: "evacuate", w: 1.5 }, { to: "fight", w: 1, mods: [["martial", 2], ["origin:titan_slayers", 3]] }] },
        horns: { h: "Horn-blowers go out to meet {titan}", b: "{person}, the last who knows the old calls, has walked out to meet {titan} with a horn of carved tooth.", wait: [1, 3], next: [{ to: "turned", w: 1.5 }, { to: "command_heard", w: 1 }] },
        evacuate: { h: "{capital} empties before {titan}", b: "The roads out of {capital} are choked. {ruler} has ordered the treasury carried to the hills.", wait: [2, 5], fx: { stability: -8 }, next: [{ to: "flattened", w: 1 }, { to: "passes_by", w: 1 }] },
        fight: { h: "{realm} marches against {titan}", b: "The army of {realm} has dug trenches and raised great bolt-throwers across the titan's path.", wait: [1, 4], next: [{ to: "slain", w: 1 }, { to: "flattened", w: 1.5 }] },
        turned: { h: "{titan} turns back to its path", b: "At the third call, {titan} stopped, lowered its head and turned back toward the corridor. {person} is a hero of {realm}.", fx: { prestige: 10, stability: 5 }, end: true },
        command_heard: { h: "{titan} answers the horn", b: "{titan} answered the call with a sound like a mountain breaking, and stood still. Far away, other titans stopped too, and turned to face the same way.", fx: { flag: "command", unrest: 10, discovery: "arcana" }, end: true },
        flattened: { h: "{titan} walks through {capital}", b: "{titan} walked through {capital} as if it were a field of corn, and on toward the sea. Behind it the ruins are already sprouting green.", fx: { pop: 0.85, stability: -15, titan: true }, end: true },
        passes_by: { h: "{titan} passes {capital} by a mile", b: "It passed within a mile of the walls without turning its head. The new path it trod is already greening, and the farmers of {realm} are moving onto it.", fx: { growth: 0.003, stability: 3 }, end: true },
        slain: { h: "{realm} brings down {titan}", b: "After three days of bolts and fire, {titan} fell. Its bones will roof a palace. The rains that followed it will not come again.", fx: { prestige: 15, treasury: 80, flag: "titan_slain", monument: { tier: 2, name: "The Titan Gate" } }, end: true },
      } },
    { id: "wm_back_clan", n: "The Last Walk of the Back-Clan", scale: "local", anchor: "frontier", w: 1, req: ["walking_titans", { any: ["near:titan", "nomadic", "titan_touched", "frontier"] }],
      stages: {
        start: { h: "A back-clan's titan lies down near {place}", b: "The titan that carried the clan of {person} for nine generations has lain down near {place} and will not rise. Its back-town is a village on a hill now.", wait: [2, 6], next: [{ to: "settle", w: 1, mods: [["hospitable", 2]] }, { to: "hunters_come", w: 1.5, mods: [["theme:hunters_lodge", 3]] }] },
        settle: { h: "The back-clan asks to stay at {place}", b: "{person} has asked the lord of {place} for land. The clan offers its titan-lore and its horn-songs in exchange.", wait: [4, 10], next: [{ to: "new_titan", w: 1 }, { to: "absorbed", w: 1.5 }] },
        hunters_come: { h: "Hunters gather around the dying titan at {place}", b: "{official}, factor of the Hunters' Lodge, has camped around the dying titan with saws, carts and a signed licence. {person} and the clan stand on its back with spears.", wait: [1, 4], fx: { unrest: 10 }, next: [{ to: "clan_war", w: 1 }, { to: "absorbed", w: 1 }] },
        new_titan: { h: "The back-clan of {place} finds a new titan", b: "A young titan came down the corridor, and {person} walked out to meet it with the horn. The clan has gone, singing, and left the old titan a garden.", fx: { stability: 3, prestige: 3 }, end: true },
        absorbed: { h: "The back-clan becomes folk of {place}", b: "The clan has settled on the land beside the old titan's bones. Their children are already forgetting the horn-songs.", fx: { pop: 1.03, found_town: true }, end: true },
        clan_war: { h: "Blood on the titan's back at {place}", b: "The clan fought the hunters for its titan's body, and lost. The bones went to market; {person}'s horn hangs in the Lodge as a trophy.", fx: { unrest: 15, treasury: 20 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "the Hunters' Bestiary, Lodge edition", text: "The Hunters' Bestiary, Lodge edition of {year}, entry 1: 'The titan is a beast like any other, though large. It may be slain at the knee-tendons and the throat; allow 3 days. Yields: bone (excellent), hide (excellent), marrow (consult the Lodge). Apprentices are reminded that a titan is not a mountain and should not be prospected.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: "partial", who: "{survivor}, back-clan elder", text: "{survivor}, elder of a back-clan, to a lowland magistrate who asked about clan life, {year}: 'You do not ride a titan. You live on it, the way a flea lives on a dog, and hope it is a patient dog. Ours carried 9 generations of us and 300 goats. It never once asked our names. We never asked it where it was going.'" },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a river pilot of {place}", text: "Letter of a river pilot of {place}, {year}: 'I saw a titan cross the river at dawn with a whole forest on its back, and birds rising off it like smoke, and a town's bells ringing somewhere in the moss. The river rose 4 feet behind it and swamped 2 barges. Nobody aboard was sorry. We stood on deck and watched it go.'" },

    { depth: "core", about: "truth:gardeners", source: "archive", bias: "true", reliable: true, plain: true, points: "archive", who: "{investigator}, corridor surveyor", text: "Report of {investigator}, surveyor of the corridor calendars, {year}: 'The titans sow the land and the rain walks behind them. I have set the province tax rolls beside the kill records. In every corridor district, harvests halve the year after a titan is killed, then fall to a third, then to nothing worth taxing. The rolls are at {lead}. Anyone may check my sums.'" },
    { depth: "core", about: "truth:gardeners", source: "temple", bias: "pious", reliable: "partial", points: "site:footprint_lake", who: "{believer}, Keeper of the Path", text: "Sermon of {believer}, Keeper of the Path, preached to hunters camped at {place}, {year}: 'They walk so that the rain may walk behind them. Kill one and you kill the rain. Kill the rain and you kill the land. If you doubt me, go and look at the round mere at {lead}, and ask the farmers there what their grain is worth. Then go home. My darts are not for show.'" },
    { depth: "core", about: "truth:gardeners", source: "person", bias: "true", reliable: "partial", who: "a corridor farmer, to {investigator}", text: "A farmer on the corridor near {place}, to {investigator}, {year}: 'Every seventh year it passes, and every seventh year the soil is black and the wheat stands to my shoulder. 7 years, regular as rent. My father knelt to it. So do I. If the Lodge comes for it, they will find my sons in the way, with pitchforks.'" },
    { depth: "core", about: "truth:gardeners", source: "library", bias: "official", reliable: false, who: "{official}, Lodge factor", text: "Letter of {official}, factor of the Hunters' Lodge, to the crown of {realm}, {year}: 'Droughts in the corridor provinces arise from shifts in the sea winds and bear no relation to the Lodge's lawful harvest of titans. The Lodge paid 4,000 crowns in licence fees last year. It would be a pity to lose them to a superstition.'" },
    { depth: "core", about: "truth:gardeners", source: "person", bias: "true", reliable: "partial", cost: true, points: "sub:rain_fails", who: "Edda Thorne, farmer", text: "Petition of Edda Thorne, farmer, to the crown, {year}: 'The Lodge killed the titan that crossed our valley in the spring of the comet year. The rain that followed it every autumn did not come. I have buried 2 children since, of the hunger-cough. My 40 acres are dust to the knee. I ask for nothing for myself. I ask that the dust province at {lead} be the last.'" },

    { depth: "core", about: "truth:larval_gods", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:nested_skeleton", who: "{investigator}, field notes", text: "Field notes of {investigator}, inside the ribcage of the twin skeleton at {lead}, {year}: 'Painted on the ribs, very old: a titan, and rising out of its back a winged shape that covers the sun. Below it, 7 small figures walk away from the titan carrying bundles. The painters knew what titans are. They are young. They grow, stop, split, and something with wings comes out.'" },
    { depth: "core", about: "truth:larval_gods", source: "heretic", bias: "heretic", reliable: "partial", points: "site:sleeping_range", who: "a cave-prophet, as taken down by a constable", text: "Preaching of a cave-prophet in the market at {place}, {year}, as taken down by the constable: 'They are not beasts! They are eggs! And when they hatch the sky will darken and what comes out will be hungry! Go and put your hand in the warm springs at {lead} and count the beats!' The prophet was fined 3 shillings. The constable went to the springs." },
    { depth: "core", about: "truth:larval_gods", source: "oral", bias: "garbled", reliable: "partial", who: "{survivor}, back-clan elder", text: "{survivor}, back-clan elder, explaining to a Lodge clerk at {place} why the clan left its titan, {year}: 'When an old titan goes quiet and stops eating, the clan leaves. That is the oldest rule we have. We call it going inward. Ours stopped eating 40 days ago and lay down. We were off its back in 3. I do not know what going inward means. I know we always leave.'" },
    { depth: "core", about: "truth:larval_gods", source: "archive", bias: "official", reliable: false, who: "Lodge survey report", text: "Lodge survey report on the still titan of the badlands, signed by {official}, {year}: 'The titan is merely old and dying. The splitting of its hide is ordinary decay. The back-town on it is sound, and 60 plots have been sold to settlers at 5 crowns each. The Lodge sees no reason to delay the sale of the remaining plots.'" },
    { depth: "core", about: "truth:larval_gods", source: "person", bias: "true", reliable: "partial", cost: true, who: "Bram Calloway, settler", text: "Letter of Bram Calloway, settler on the still titan, to a sister in {place}, {year}: 'We bought plot 41 from the Lodge for 5 crowns. Last night the ground split down the middle of the town, 30 feet wide. The Hallets' house went in with the Hallets. The crack is warm and something inside it is wet and moving. We are leaving in the morning. Tell Mother I am sorry about the money.'" },

    { depth: "core", about: "truth:weapons", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:harness_rivets", who: "a harness ring, recorded by {investigator}", text: "Recorded by {investigator} from a harness ring cut out of the hide at {lead}, {year}. The ring is iron, as wide as a cartwheel, stamped with a badge and plain words: 'Seventeenth Walker. Northern line. Await the word.' {investigator} notes: 'The titans were made for war and numbered. They walk patrol lines, and they are still waiting for the order.'" },
    { depth: "core", about: "truth:weapons", source: "archive", bias: "redacted", reliable: "partial", points: "sub:tamers", who: "a court memorandum", text: "Court memorandum to the privy council of {realm}, {year}: 'The tamers report that the titans answer the first call by stopping, the second by lowering their heads, and the third by turning, all within earshot, to face the same direction. The tamers ask for a fourth horn. [Remainder sealed by royal order.]' The tamers' contract is held at {lead}." },
    { depth: "core", about: "truth:weapons", source: "person", bias: "exaggerated", reliable: "partial", points: "site:rider_glyphs", who: "an old tamer, drinking at {place}", text: "An old tamer, drinking in an inn at {place}, {year}, overheard by the landlord: 'They don't wander. They patrol. Watch them 20 years like I have and you'll see they never leave a line on the map. Someone drew that line. The horns to talk to them are in a cave at {lead}, and I'm not telling the court which one to blow.'" },
    { depth: "core", about: "truth:weapons", source: "library", bias: "official", reliable: false, who: "Natural History of the Corridors", text: "From the Natural History of the Corridors, published at {place} in {year}, volume 2: 'The titans' migrations follow the seasons of grass and water, as all scholars agree. Talk of routes and commands is tavern nonsense. The author has observed 11 titans and found them no more obedient than cattle, and a good deal less useful.'" },
    { depth: "core", about: "truth:weapons", source: "person", bias: "true", reliable: "partial", cost: true, who: "a tamer's apprentice", text: "Statement of a tamer's apprentice to the court, {year}: 'Master Ivo Sallow blew the third call at the corridor near {place}. 4 titans stopped and turned north together. Then Master Ivo blew a fourth note nobody taught us. The nearest titan put its foot on the master and the horn, very carefully, and turned back to its line. I have not touched a horn since.'" },

    { depth: "sub", about: "sub:hunters_lodge", source: "archive", bias: "official", reliable: "partial", points: "cast:official", who: "Lodge tally", text: "Tally of the Hunters' Lodge, {year}, sent to the factor {official} at {lead}: 'Titans sighted this decade: 19. Last decade: 31. Before that: 52. Kills this decade: 12. Recommend the hunt be widened to the eastern corridor while stocks last.' Someone at the Lodge has underlined 'while stocks last' twice." },
    { depth: "sub", about: "sub:calf_sold", source: "person", bias: "true", reliable: true, who: "the menagerie keeper of {place}", text: "Daybook of the menagerie keeper of {place}, {year}: 'Day 60. The calf does not eat. It is the size of a barn and has lost a third of its weight. Every night the ground shakes a little, far off, and the calf lifts its head. Tonight the shaking was nearer. I have asked the king's steward for a bigger gate, or a smaller calf.'" },
    { depth: "sub", about: "sub:carcass_city", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a spice trader at {place}", text: "Journal of a spice trader at the bone city of {place}, {year}: 'The city smells of honey and old meat. The wells are sweet; I paid 2 pennies a cup and spat it out. The children are fat and pale and play in the ribs, 80 feet up. The city council says the carcass will last another century. I did not stay the night.'" },
    { depth: "sub", about: "sub:corridor_canal", source: "library", bias: "propaganda", reliable: false, who: "a crown placard on the Corridor Wall", text: "Placard posted along the Corridor Wall by the crown of {realm}, {year}: 'The Corridor Wall will protect 10,000 farms from the beasts and harm no living thing. The titans will simply walk around it. Citizens who hear the titans calling from the far side are reminded that this is the wind.'" },
    { depth: "sub", about: "sub:back_clans", source: "oral", bias: "true", reliable: true, points: "cast:survivor", who: "a back-clan child's first lesson", text: "A back-clan child's first lesson, as recited to {investigator} by a girl of 6 at {place}, {year}: 'Never light a fire on bare hide. Never dig deeper than your knee. Never forget it can feel you.' The clan elder {survivor}, who taught the girl, now lives at {lead} and teaches it to children who have never stood on a titan." },

    { depth: "site", about: "site:rider_glyphs", source: "person", bias: "true", reliable: "partial", who: "the shepherd who found the cave of horns", text: "The shepherd who found the cave of horns above {place}, to {investigator}, {year}: 'I took the little horn with 1 notch and blew it, for a joke. Far off, a titan stopped walking. Stopped dead, on the skyline, for the length of a meal. Then it went on. I put the horn back and have not slept well since.'" },
    { depth: "site", about: "site:footprint_lake", source: "temple", bias: "pious", reliable: true, who: "the harvest blessing at {place}", text: "The harvest blessing said at the round mere of {place} each autumn, written down by {believer} in {year}: 'Here the great one set its foot, and where it stepped we eat. Bless the foot and bless the walker.' {believer} notes that 200 families say it, and that the oldest of them still leaves the first sheaf on the shore, facing east, the way the titan went." },
  ],
};
