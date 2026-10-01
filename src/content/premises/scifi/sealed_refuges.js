// The Sealed Refuges: the buried halls that saved the world from the end were never meant to save it.
// A bridge premise: under a medieval world the refuges are the buried halls of the sealed folk, and their charters are scripture.
export default {
  id: "sealed_refuges",
  name: "The Sealed Refuges",
  family: "scifi",
  pitch: "The buried halls that sheltered our ancestors from the end of the world were never meant to save them. Each hall was an experiment, and the people running it are still recording the results.",
  slots: ["apocalypse", "state-control", "history-secret"],
  tone: ["grim", "satirical"],
  era: ["medieval", "renaissance", "industrial", "modern", "post-collapse"],
  scale: "world",
  genres: ["postapoc", "fantasy", "grimdark"],
  bridge: true,
  w: 1,
  excludes: [],
  pairs: [{ id: "grey_unmaking", w: 3 }, { id: "ward_walls", w: 2.5 }, { id: "gentle_eye", w: 2 }, { id: "unremembering", w: 2 }, { id: "arithmetic_of_ages", w: 1.5 }],

  truths: [
    { id: "variables", n: "Each hall was a test", d: "Every sealed hall was built with one deliberate flaw: a door that never opens, a warden with absolute power, a draught in the water, too many mouths for the bread. The founders wanted to see what each flaw would make of people, and wrote the suffering down as results. One hall was built with no flaw, as a control, and its people do not know they are the measure for everyone else.", tags: ["truth:refuge_variables"],
      known: [
        "Every hall has one fault no warden may fix: too few beds, sweet water, a door that never opens. The wardens call them faults of haste and a test of faith.",
        "Two halls have heard each other through the old speaking-pipes. Their charters match word for word, except for one law each. A warden's half-burned instruction forbids correcting the water and asks for outcomes to be reported.",
        "The founders' ledger-room lists every hall with one line beside it: 'Never opens.' 'One ruler, no law.' 'Sweetened water.' 'None. Measure.' Each hall was a test, the flaws were deliberate, and someone is still recording the results.",
      ] },
    { id: "surface_fine", n: "The world outside healed long ago", d: "The end was real but short, or never happened at all. The halls were sealed so their builders could restart humanity under their control, and the hidden master-hall has known for centuries that the surface is green. The wardens show the faithful a painted ash-cloud and send doubters out of the door to die. The other halls are scheduled to be shut down, and their people killed, one by one.", tags: ["truth:surface_fine"],
      known: [
        "The great window in the warden-chamber shows ash and fire outside. Doubters are sent out of the door to die before everyone's eyes. One exile has come back years later, sunburned and well fed.",
        "The ash cloud in the window comes round every eleventh day, the same shape each time. An old surface town has clocks all stopped at one minute and a sign saying 'Go below. It is only for a little while.'",
        "The window is a painted scroll on rollers. The surface has been green for centuries, and the master-hall's logs say so. Some halls are marked for 'quieting', and one hall's bell has already stopped ringing.",
      ] },
    { id: "scheduled_revolt", n: "The uprisings are scheduled", d: "Every great revolt in the halls' history was permitted, even planned, by hidden masters who sleep in shifts behind the deepest door. Each uprising leaves fewer mouths to feed, and their ledger calls the losses 'within tolerance'. At the end of each one, the rebel leader is taken aside and offered the secret and the warden's seat, and most of them accept.", tags: ["truth:scheduled_revolt"],
      known: [
        "Every few generations the halls have a rising, and afterwards there are always more empty beds. The wardens call each one the act of wicked men, and promise it will never happen again.",
        "Rebel leaders who take the warden's seat go into the sealed chamber and come out changed. A ledger of uprisings ends each one with a lower head count and the margin note 'within tolerance'.",
        "Behind the last door of an old hall the masters sleep in shifts, beside a table of revolts dated a century ahead. The uprisings are scheduled. The rebel leaders are offered the crown, and most take it.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "a pipe-listener of a sealed hall, who keeps the log of voices heard through the old speaking-pipes", home: "mountain", stance: "Has heard another hall's charter read aloud, and wants to know why it differs from ours by exactly one law." },
    { role: "official", n: "a warden's clerk, keeper of the Charter, the ration book and the door", home: "capital", stance: "Believes the outside is death and the Charter is what keeps the hall alive, and signs every exile without reading the name." },
    { role: "believer", n: "a cantor of the Charter, who leads the hall in the daily oath of obedience", home: "inner", stance: "Believes the founders saved the righteous from the fire, and that doubt is the first crack in the door." },
    { role: "survivor", n: "an exile sent out of the door to die, who came back years later sunburned and well fed", home: "remote", stance: "Wants every hall to know the surface is green, and wants the clerk who signed the exile to say so in public." },
  ],

  tags: ["refuges"],

  subthemes: [
    { id: "door_opens", n: "The Opening of the Deep Door", d: "A great round door in the hillside, shut since before the chronicles, has rolled open. The people who walked out are pale, numbered, and astonished by the sun.", w: 1.4, req: { any: ["mountain", "hills", "near:ruins"] }, tags: ["theme:door_opens"], mark: { kind: "zone", n: "The Opened Hall", color: "#7a7a6a", size: [1, 1], where: "mountain" } },
    { id: "surface_meets", n: "The Can-Folk Among Us", d: "Hall-born people now live among the surface villages, keeping their strange laws: numbered names, rationed baths, a lottery for every birth. The villagers find them absurd, and slightly frightening.", w: 1.1, req: { any: ["hospitable", "tolerant", "mercantile", "frontier"] }, tags: ["theme:can_folk"] },
    { id: "hidden_window", n: "The Window That Shows the Wrong Sky", d: "In one sealed hall, a child has found a hidden window that shows green hills, though the wardens' great window shows only ash.", w: 1, truthLink: "surface_fine", tags: ["theme:hidden_window"] },
    { id: "speaking_tubes", n: "The Voices in the Pipes", d: "Two buried halls have found each other through old speaking-pipes. They compare their holy charters, and find them word for word the same except for one law each.", w: 1, truthLink: "variables", tags: ["theme:speaking_tubes"] },
    { id: "crowned_rebel", n: "The Rebel on the Warden's Seat", d: "A popular uprising has thrown down the old warden. Its leader now sits in the warden's chair, reading the sealed instructions, and has not spoken publicly in a month.", w: 1, req: { any: ["autocracy", "unstable", "harsh_law", "origin:rebellion"] }, truthLink: "scheduled_revolt", tags: ["theme:crowned_rebel"] },
    { id: "draught_water", n: "The Calm Water", d: "In this realm the wells are known for a sweetness, and its people for their mildness. The few who drink only rainwater are restless, and remember more.", w: 0.9, truthLink: "variables", tags: ["theme:calm_water"] },
    { id: "rail_hall", n: "The Long Iron Hall", d: "Far off, a great hall on iron wheels is said to circle the land without stopping. The rich ride at the front by the warm engine; the poor at the back eat what they are given.", w: 0.7, req: { any: ["great_roads", "realm:large", "realm:vast", "hierarchical"] }, tags: ["theme:rail_hall"] },
    { id: "tunnel_states", n: "The Tunnel Kingdoms", d: "Beneath the hills, a chain of buried halls has become a chain of little kingdoms, each with its own faith and its own wars, linked by dark roads under the earth.", w: 1, req: { any: ["mountain_folk", "mountain", "origin:mountain_hold"] }, tags: ["theme:tunnel_kingdoms"], mark: { kind: "zone", n: "The Underhalls", color: "#4a4a5a", size: [2, 4], where: "mountain" } },
    { id: "exile_returns", n: "The Exile Who Lived", d: "Hall law sends the disobedient out of the door to die before everyone's eyes. One of them has come back, years later, sunburned and well fed.", w: 1, truthLink: "surface_fine", tags: ["theme:exile_returns"] },
    { id: "gone_quiet", n: "The Hall That Went Quiet", d: "One hall's bell, heard faintly across the valley every dawn for three hundred years, did not ring this morning. Nor the next.", w: 0.8, truthLink: "surface_fine", tags: ["theme:gone_quiet"] },
    { id: "valve_lore", n: "The Keepers of the Deep Wheels", d: "The lowest caste of the halls tends the great wheels and pipes, chanting rules nobody else understands. Never turn the ninth wheel. Never sleep near the blue pipe. They are always right.", w: 1, req: { any: ["artisans", "guilds", "hierarchical"] }, tags: ["theme:deep_wheels"] },
    { id: "same_faces", n: "The Hall of One Face", d: "Rumour tells of a hall whose every inhabitant shares a single face, and calls the others in their chronicles 'the many-faced'.", w: 0.5, truthLink: "variables", tags: ["theme:one_face"] },
  ],

  sites: [
    { id: "register", n: "The Ledger-Room of $", kind: "dig", where: "remote", truthLink: "variables", d: "A sealed chamber holding the founders' register of every hall and its flaw.",
      layers: {
        surface: { n: "The iron hatch", text: "A stone stump on a bare hill with an iron hatch in it, rusted shut. Goatherds use it as a table. The hatch is four feet across, and the bolts are on the outside." },
        study: { n: "The open eye", text: "The hatch's markings match those of all 20 known buried halls, but the crest is different: an open eye, where the halls have a closed one. {investigator} has drawn both crests side by side in the pipe log." },
        dig: { n: "The great book", text: "Below are dry shelves and one great book: a list of halls, each with a single line beside it. 'Never opens.' 'One ruler, no law.' 'Sweetened water.' 'None. Measure.' The hall marked 'None' is at {lead}.", points: "sub:speaking_tubes" },
        revelation: { n: "The results", text: "Every hall was built to fail in its own way. The founders designed the flaws, sealed people in, and came here to study what the suffering made of them. The last entry in the book is in fresh ink, dated {year}. Someone is still writing down the results." },
      } },
    { id: "set_tables", n: "The Empty Feast-Hall of $", kind: "ruin", where: "any", d: "A sealed hall with no one in it, its tables laid for a meal three hundred years cold.",
      layers: {
        surface: { n: "The open door", text: "A round door left open in a hillside, and silence inside. Village children dare each other to touch the threshold. Nobody from the village has gone further in than the first ration board, 30 paces." },
        study: { n: "Laid tables", text: "Every table is laid for 400. Every bed is made. A voice from the wall still announces the hour and the day's ration: two loaves and a cup of water a head, the same every day for 300 years." },
        dig: { n: "The last order", text: "No bodies anywhere. In the warden's chamber is one order on the desk: 'Proceed to the surface. Do not look back.' It is signed with the open-eye crest found on a hatch at {lead}.", points: "site:register" },
        revelation: { n: "Walked out", text: "The masters emptied this hall in a single night. Its people were walked out to the green world and forbidden on pain of death to speak of it. The villages nearest the door are their descendants. They still lay one spare place at table, and do not know why." },
      } },
    { id: "welded_door", n: "The Last Door of $", kind: "anomaly", where: "mountain", truthLink: "scheduled_revolt", d: "A door at the deepest level of a buried hall, sealed from the inside.",
      layers: {
        surface: { n: "The blank door", text: "The deepest stair of an old buried hall ends in a blank door, 140 steps below the lowest ration room. The wheel-keepers will not sleep within sight of it, and they do not explain." },
        study: { n: "Warm air and music", text: "The door is fused to its frame from the other side. Warm air leaks around it, and on still nights there is music. A wheel-keeper timed the music in {year}: it plays for one hour every 30 days." },
        dig: { n: "The sleepers' roster", text: "Broken through: a hall of sleepers in glass coffins, a roster of shifts pinned to the wall, and a table of the great revolts with dates set out a century ahead. A copy of the roster was carried out to {lead}.", points: "archive" },
        revelation: { n: "The next rising", text: "The masters sleep here in turns, waking to arrange the next uprising and choose who will lose it. The table lists rebellions not yet fought, with the leaders' names left blank. Twelve of the last 14 rebel leaders accepted the warden's seat." },
      } },
    { id: "stopped_clocks", n: "The Still Town of $", kind: "ruin", where: "any", truthLink: "surface_fine", d: "An ancient surface town whose every clock stopped at the same minute, with no bodies left anywhere.",
      layers: {
        surface: { n: "The same hands", text: "Old houses, ivy, and clocks on every wall. All 60 clocks stopped at the same minute, a quarter past the ninth hour. Foxes live in the bakery, and swallows nest in the council chamber. The road to the town is still on the old maps." },
        study: { n: "No graves", text: "No graves, no bones, no sign of fire or siege. Plates are left on the tables and doors left open. The orchards behind the town are wild but healthy, and the apples are sweet." },
        dig: { n: "The stair", text: "Beneath the square is a broad stair down, and painted on the wall: 'Go below. It is only for a little while.' The stair leads to a hall whose great window is at {lead}.", points: "site:master_window" },
        revelation: { n: "An order, not a fire", text: "The end came to this town as an order from the founders, not as a fire. Its people walked down into a hall, and the world above was never harmed at all. The town's apple trees have fruited every year since. Their great-grandchildren are told the surface is ash." },
      } },
    { id: "master_window", n: "The Great Window of $", kind: "wonder", where: "capital", truthLink: "surface_fine", d: "The holy window in a hall's warden-chamber that shows the outside as ash and ruin.",
      layers: {
        surface: { n: "The yearly showing", text: "A sacred window, shown once a year on Founding Day, where 2,000 of the faithful file past to see the burning wasteland that waits outside. The cantor leads the oath of obedience at the end of the line." },
        study: { n: "The eleventh day", text: "The scene in the window repeats. The same ash cloud passes every eleventh day, and the same broken tower burns on the left. A child with a slate drew it on three showings, and the drawings match." },
        dig: { n: "The rollers", text: "Behind the window is not glass but a painted scroll on rollers, turned by a hidden wheel. The wheel's maintenance log, signed each month by the warden's clerk, is kept at {lead}.", points: "cast:official" },
        revelation: { n: "Painted ash", text: "The wasteland outside is a painting. The world is green, and the wardens have always known. The founders painted the scroll so people would stay inside, and the clerks have sent 140 doubters out of the door to 'die' in a green country." },
      } },
  ],

  beings: [
    { id: "hall_keeper", n: "Iron hall-keeper", kind: "beast", d: "A tireless servant of iron and old oil that mends the halls' pipes and obeys only the founders' commands. It ignores the people it serves, until they touch a forbidden door.", danger: 2, biomes: ["alpine", "hills", "boreal", "tempforest", "badlands"], look: { size: 1.9, group: [1, 3], move: "solo", speed: 6, col: "#5a5a50", col2: "#c0a040", body: "biped", active: "any", visible: false } },
    { id: "ash_hound", n: "Ash hound", kind: "predator", d: "A pale, hairless dog bred in the halls as a guard and let loose with the exiles. Its descendants hunt the hillsides near every great door.", danger: 2, biomes: ["badlands", "grass", "coldsteppe", "tempforest", "dryforest"], look: { size: 1.1, group: [3, 7], move: "pack", speed: 32, col: "#c8c0b0", col2: "#8a7060", body: "quad", active: "night", visible: true } },
    { id: "sr_lamp_moth", n: "Lamp-moth", kind: "insect", d: "A huge white moth that once lived only in the halls' grow-rooms and now flies out at dusk in clouds, following lantern-light home.", danger: 0, biomes: ["tempforest", "grass", "temprain", "hills", "swamp"], look: { size: 0.15, group: [10, 40], move: "swarm", speed: 12, col: "#f0eee0", col2: "#a0d0a0", body: "insect", active: "night", visible: true } },
  ],

  techs: [
    { id: "sr_recyclers", n: "The turning-cisterns", field: "engineering", level: 1, d: "Water used, cleaned and used again through nested cisterns of sand and charcoal: the first gift of the hall-born." },
    { id: "sr_lamp_gardens", n: "Lamp-gardens", field: "agriculture", level: 2, d: "Crops grown under glass lamps in deep cellars, without sun, the way the sealed folk fed themselves." },
    { id: "sr_charter_law", n: "The charter-codes", field: "writing", level: 2, d: "Law written as one sacred charter, with numbered rules and no exceptions, and ration-tokens for every family." },
    { id: "sr_seal_suits", n: "Sealed cloaks", field: "medicine", level: 3, d: "Oiled, sewn cloaks and glass-eyed hoods that keep out ash and fever, copied from the exiles' suits." },
    { id: "sr_speaking_pipes", n: "Speaking-pipes", field: "engineering", level: 4, d: "Long brass pipes laid under the earth that carry voices between towns, as they once did between the halls." },
    { id: "sr_founders_key", n: "The founders' key", field: "arcana", level: 5, d: "A master token that opens every hall door and wakes every iron keeper. Whoever holds it holds the halls." },
  ],

  units: [
    { id: "sr_wardens_guard", n: "Warden's guard", role: "infantry", wpn: "spear", kit: "mail", ranks: 4, gap: 1.2, size: 100, w: 0.8, mods: [["theme:crowned_rebel", 4], ["theme:tunnel_kingdoms", 4], ["harsh_law", 1.5]] },
    { id: "sr_hall_keepers", n: "Iron keepers", role: "siege", wpn: "siege", kit: "plate", ranks: 1, gap: 6, size: 10, w: 0.2, mods: [["theme:door_opens", 8], ["theme:tunnel_kingdoms", 4]] },
  ],

  govs: [
    { id: "sr_wardenry", n: "Wardenry", d: "A single warden rules by the sealed instructions of the founders, which no one else may read.", tags: ["gov:sr_wardenry", "autocracy"], w: 0.3, forms: ["Wardenry of $", "The Sealed Hall of $", "Charterhold of $"], ruler: "Warden", mods: [["theme:door_opens", 10], ["theme:tunnel_kingdoms", 8], ["hierarchical", 1.5]] },
  ],

  faiths: [
    { id: "sr_charter", n: "The Charter", d: "The founders sealed the faithful below to save them from the fire, and wrote the Charter to keep them. The outside is death; obedience is life.", tags: ["faith:sr_charter", "organised"], w: 0.5, names: ["The Faith of the Charter", "The Sealed Covenant of $", "The Founders' Word"], mods: [["theme:door_opens", 6], ["theme:can_folk", 3], ["harsh_law", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Hall-doors", color: "#6a6a5a", size: [1, 1], count: [2, 4], where: "mountain", d: "Great round doors set into hillsides, some open, most shut, a few ringing faintly at dawn." },
  ],

  storylines: [
    { id: "sr_door_opens", n: "The Door Beneath {place}", scale: "local", anchor: "town", w: 1.6, req: "refuges",
      stages: {
        start: { h: "The great door at {place} rolls open", b: "With a groan heard for miles, the round door in the hill above {place} has opened. Pale people in numbered tunics stand in the light, weeping and shading their eyes.", wait: [1, 4], next: [{ to: "welcomed", w: 1.5, mods: [["hospitable", 2], ["tolerant", 2]] }, { to: "feared", w: 1, mods: [["insular", 2], ["zealous", 2]] }] },
        welcomed: { h: "{place} takes in the sealed folk", b: "The hall-born of {place} have been given land, though they keep their own strange laws. Their warden, {person}, has asked to speak with {ruler}.", wait: [4, 10], fx: { pop: 1.05, science: { engineering: 0.5 } }, next: [{ to: "warden_secret", w: 1 }, { to: "mingled", w: 1.5 }] },
        feared: { h: "The folk of {place} drive the hall-born back", b: "Priests called them ghosts and demons. Stones were thrown, and the pale people fled back inside. The door has not shut again.", wait: [3, 8], fx: { unrest: 6 }, next: [{ to: "exile_tale", w: 1 }, { to: "door_sealed", w: 1 }] },
        warden_secret: { h: "The warden of {place} confesses", b: "{person} has shown {ruler} a sealed letter from the founders: the hall was opened on purpose, at a set date, to see what the surface would do with them.", fx: { stability: -6, discovery: "writing", flag: "founders_known" }, end: true },
        mingled: { h: "The hall-born are just folk now", b: "A generation on, the children of the hall marry in {place} and laugh at the old Charter. Only the old ones still count their baths.", fx: { stability: 4, growth: 0.002 }, end: true },
        exile_tale: { h: "{person2} walks out of the hall alone", b: "A young hall-dweller came out of the open door with a stolen book, saying the hall's masters sleep below in shifts, and that they are waking.", fx: { unrest: 10, flag: "sleepers" }, end: true },
        door_sealed: { h: "The door above {place} closes", b: "One night the round door rolled shut on its own. Nobody in {place} talks about the pale people any more, but children dare each other to knock.", fx: { stability: 2 }, end: true },
      } },
    { id: "sr_revolt", n: "The Uprising in the Halls of {realm}", scale: "realm", anchor: "realm", w: 1.1, req: ["refuges", { any: ["autocracy", "harsh_law", "unstable", "theme:tunnel_kingdoms", "theme:crowned_rebel"] }],
      stages: {
        start: { h: "The deep folk of {realm} rise", b: "Wheel-keepers and ration-clerks have taken the lower halls of {realm}. Their leader, {person}, demands the wardens open the sealed instructions.", wait: [2, 6], fx: { unrest: 15, stability: -6 }, next: [{ to: "rebels_win", w: 1.5 }, { to: "crushed", w: 1, mods: [["standing_army", 2], ["ruler:cruel", 2]] }] },
        rebels_win: { h: "{person} takes the warden's seat in {capital}", b: "The old warden has fled or died. {person} has been led alone into the sealed chamber, and the door has shut behind them.", wait: [2, 5], next: [{ to: "accepts", w: 1.5 }, { to: "reveals", w: 1, mods: [["ruler:just", 2], ["egalitarian", 2]] }] },
        crushed: { h: "The uprising in {realm} is broken", b: "The lower halls were flooded and the leaders sent out of the door to die before the crowds. Rations have been raised a little, as if by plan.", fx: { pop: 0.92, stability: 4 }, end: true },
        accepts: { h: "{person} rules {realm} as the old wardens did", b: "The rebel leader came out of the chamber changed, kept the Charter, and hanged three old comrades. The people say the halls ruin everyone in the end.", fx: { stability: 6, unrest: 8, ruler_trait: "cunning" }, end: true },
        reveals: { h: "{person} reads the sealed orders aloud", b: "Before the whole of {capital}, {person} read out the founders' instructions: every revolt in the chronicle had been scheduled, including this one. The halls are in uproar.", fx: { revolution: true, stability: -15, discovery: "writing" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, cantor of the Charter", text: "The Charter of the halls, first article, as recited by {believer}, cantor, at the morning oath in {year}: 'The fire came upon the world, and the founders made the halls, and sealed the righteous within. Outside is death. Obedience is breath.' The cantor's note for new children: the halls are buried shelters, and there are 20 of them that we know of." },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a shepherd of {place}", text: "A shepherd of {place}, to a tax-collector who asked about the round door in the hill, {year}: 'Buried kings live in tin houses under that mountain. On the last day they'll come out and ask for their land back. My flock grazes on top of them, 200 head, and nobody's asked yet. If they come, they can have the thistles.'" },
    { depth: "lore", about: "truth", source: "person", bias: "true", reliable: "partial", who: "a wheel-keeper's memoir", text: "From the memoir of a wheel-keeper of the deep wheels, {year}: 'Our rule, chanted each shift: Never turn the ninth wheel. Never sleep by the blue pipe. Never ask what the ninth wheel turns. I asked once, aged 9. My father struck me. Forty years later I learned the answer: the ninth wheel turns the great window at {lead}.'", points: "site:master_window" },

    { depth: "core", about: "truth:variables", source: "ruin", bias: "true", reliable: true, plain: true, who: "the founders' ledger", text: "Copied from the founders' great book in the ledger-room, {year}: 'Hall Seven: door never opens. Hall Eleven: one ruler, no law. Hall Fourteen: sweetened water. Hall Twenty: none. Measure. Each hall has its flaw by design. Record what the flaw makes of them. Do not inform.' The ledger-room is at {lead}.", points: "site:register" },
    { depth: "core", about: "truth:variables", source: "traveller", bias: "exaggerated", reliable: "partial", cost: true, who: "{investigator}, pipe-listener", text: "Log of {investigator}, pipe-listener, {year}: 'I have heard the voices of two halls in the pipes. Their charters are the same in every word but one law. In one, a hand is cut for theft. In the other, nothing is ever stolen, because there is nothing to steal. In the first hall, a child of 12, {person}, lost a hand last week for one loaf. The pipe is at {lead}.'", points: "sub:speaking_tubes" },
    { depth: "core", about: "truth:variables", source: "heretic", bias: "heretic", reliable: "partial", who: "a pamphlet from the lower halls", text: "A pamphlet passed hand to hand in the lower halls, {year}, 40 copies, unsigned: 'Ask why your hall has one flaw no one may fix. Ask why the founders who could build iron servants could not build enough beds. We have 600 people and 450 beds. Somebody counted.'" },
    { depth: "core", about: "truth:variables", source: "archive", bias: "redacted", reliable: "partial", who: "a warden's sealed instruction", text: "A warden's sealed instruction, half-burned, found in a strongbox in {year}: '...you are to keep the population at [scraped] and no higher. You are not to correct the water, whatever the physicians say. Report outcomes yearly to...' The rest is ash. A complete copy is believed to be held at {lead}.", points: "archive" },
    { depth: "core", about: "truth:variables", source: "temple", bias: "official", reliable: false, who: "{official}, warden's clerk", text: "Answer of {official}, warden's clerk, to a petition about the beds, {year}: 'Each hall was built as well as the founders could manage in the last days of fire. Their small faults are the faults of haste, and a test of our faith, nothing more. The petition's 31 signatories will lose a week's bath ration for impatience.'" },

    { depth: "core", about: "truth:surface_fine", source: "person", bias: "true", reliable: true, plain: true, who: "{survivor}, returned exile", text: "{survivor}, returned exile, before the hall council, {year}: 'You sent me out of the door to die seven years ago. There is grass. There are rivers. There are towns full of people who have never heard of us. The air is fine and has been fine for centuries. The ash in the window is a lie. I ate an apple off a tree. Here are the seeds.'" },
    { depth: "core", about: "truth:surface_fine", source: "ruin", bias: "true", reliable: "partial", who: "a notice in the still town", text: "A rotting notice on the church door of the still town, copied by a surveyor in {year}: 'By order of the Council: all citizens to the shelters by the ninth hour. It is only for a little while. Bring nothing. Leave the doors open.' No date of return is given. Every clock in the town stopped at a quarter past nine. The town is {lead}.", points: "site:stopped_clocks" },
    { depth: "core", about: "truth:surface_fine", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "a hall-dweller, to the pipe-listener", text: "A hall-dweller, to the pipe-listener, {year}: 'My grandmother said the great window was a picture, and that the ash in it was painted by a man with a red beard. The wardens sent her out of the door for saying it. My cousin {person} spoke up for Grandmother at the hearing, and was sent out the same day. Look at the window at {lead} on the eleventh day.'", points: "site:master_window" },
    { depth: "core", about: "truth:surface_fine", source: "archive", bias: "redacted", reliable: "partial", who: "a master-hall log", text: "A master-hall log, one leaf, {year}: 'External readings normal for the 300th year running. Grass, water and air within all limits. Halls Three, Nine and Twelve scheduled for quieting. Proceed.' The word 'quieting' is underlined twice. Hall Nine is the empty hall at {lead}, its tables still laid. Halls Three and Twelve are not accounted for.", points: "site:set_tables" },
    { depth: "core", about: "truth:surface_fine", source: "library", bias: "official", reliable: false, who: "{official}, warden's clerk", text: "Primer for hall schools, approved by {official}, warden's clerk, {year}: 'The great window shows the outside as it truly is: ash, fire and death. Those who claim to have walked out and lived are liars, or ghosts. Children who repeat such stories are to be reported. 140 exiles have gone out of the door, and none has come back alive.'" },

    { depth: "core", about: "truth:scheduled_revolt", source: "person", bias: "true", reliable: "partial", plain: true, who: "a rebel who became a warden", text: "From the diary of a rebel leader who became a warden, {year}: 'They showed me the table. My revolt was on it, set a hundred years ago, with my name left blank. Every rising is planned by the sleepers behind the last door, to thin us and make us grateful after. They asked if I would like to keep the seat. Founders forgive me, I said yes. The door is at {lead}.'", points: "site:welded_door" },
    { depth: "core", about: "truth:scheduled_revolt", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a clerk's incident report", text: "Incident report of a ration-clerk in the lower halls, {year}: 'Painted overnight across the ninth corridor in letters 3 feet high: EVERY WARDEN WAS A REBEL ONCE. EVERY REBEL WILL BE A WARDEN. BURN THE CHAIR. Scrubbed by noon. Nobody seen. The paint was taken from stores signed out by the warden's own office at {lead}.'", points: "cast:official" },
    { depth: "core", about: "truth:scheduled_revolt", source: "archive", bias: "redacted", reliable: true, cost: true, who: "a ledger of uprisings", text: "A ledger of uprisings found behind the last door, entry for the Rising of the Deep, {year}: 'Population before: 2,140. After: 1,610. Leader {person}, wheel-keeper, sent out of the door before the crowds, as planned. Second leader offered the seat; accepted.' In the margin, in the same neat hand as every other entry: 'Within tolerance.'" },
    { depth: "core", about: "truth:scheduled_revolt", source: "oral", bias: "garbled", reliable: "partial", who: "a bed-keeper of the halls", text: "A bed-keeper of the halls, who has kept the bed roll for 40 years, to a new clerk, {year}: 'Every few generations the halls have a war. My mother kept this roll before me, and it was the same for her. And afterwards, always, there are more empty beds. Exactly enough empty beds. Never one too many, never one short.'" },
    { depth: "core", about: "truth:scheduled_revolt", source: "library", bias: "propaganda", reliable: false, who: "the Official Chronicle", text: "From the Official Chronicle of the halls, chapter 9, {year} edition: 'The Rising of the Deep was a spontaneous act of wicked men, crushed in 3 days by the wisdom of the wardens. Its leader was sent out of the door. No such disorder can ever happen again, because the Charter has been strengthened.'" },

    { depth: "sub", about: "sub:door_opens", source: "traveller", bias: "true", reliable: true, who: "a carter of {place}", text: "A carter of {place}, who was on the hill road the day the great door opened, {year}: 'They came out holding each other's sleeves, about 300 of them, and every one had a number stitched over the heart. A little girl with the number 88 asked me if the sky would fall on her. I gave her an apple. She didn't know what it was.'" },
    { depth: "sub", about: "sub:surface_meets", source: "oral", bias: "exaggerated", reliable: "partial", who: "a market-wife of {place}", text: "A market-wife of {place}, to a visiting priest, {year}: 'The can-folk count everything: their baths, their candles, their children. Two baths a month, if you please, as if that were a lot. Last spring they held a lottery in our market to decide which 6 couples could marry this year. The losers thanked the winners. It was the strangest wedding season I ever saw.'" },
    { depth: "sub", about: "sub:draught_water", source: "person", bias: "true", reliable: "partial", who: "a hall physician's notes", text: "Notes of a hall physician, {year}: 'Patients who drink only rain grow anxious within a month, and begin to ask questions about the old days, the founders and the beds. 9 of 9 cases. On the well water they are calm again within a week. I have been told to stop prescribing rain. I have stopped.'" },
    { depth: "sub", about: "sub:gone_quiet", source: "traveller", bias: "garbled", reliable: "partial", who: "a valley villager", text: "A villager of the valley, to a royal messenger, {year}: 'The bell of the eastern hall rang every dawn for 300 years. It has not rung in a year. Four of us climbed to its door. It was warm, and very quiet, and we came away. There's another door like it, open, at {lead}. That one is empty too, and the tables are laid.'", points: "site:set_tables" },
    { depth: "sub", about: "sub:speaking_tubes", source: "archive", bias: "true", reliable: "partial", who: "{investigator}, pipe-listener", text: "Pipe log of {investigator}, pipe-listener, night 61, {year}: 'Hall Twenty read us its whole charter tonight. Same as ours, word for word, except it has no flaw article at all: enough beds, plain water, an elected warden. They asked what our flaw article is. I could not answer. They found the list of halls on a hill at {lead}.'", points: "site:register" },
    { depth: "sub", about: "sub:crowned_rebel", source: "person", bias: "true", reliable: "partial", who: "a rebel's lieutenant", text: "Letter of a rebel lieutenant to {survivor}, {year}: 'Our leader went into the sealed chamber 34 days ago and has not spoken publicly since. Food goes in on a tray. Yesterday an order came out, in our leader's hand, raising the bread ration and hanging no one. I don't know if that's good. The old wardens' orders are filed at {lead}.'", points: "archive" },
    { depth: "site", about: "site:master_window", source: "person", bias: "true", reliable: true, who: "a chamber servant's confession", text: "Confession of a chamber servant to the cantor {believer}, {year}: 'I turned the wheel behind the great window for twelve years, 4 hours a day. Every eleventh day the ash cloud comes round again. I could draw it with my eyes shut. The clerk said it was a holy duty and I must never speak of it. I am speaking of it.'" },
  ],
};
