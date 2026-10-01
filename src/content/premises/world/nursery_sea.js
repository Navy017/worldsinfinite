// The Nursery Sea: the whole known world is one sheltered basin, and the true world beyond its rim is vast and lethal.
export default {
  id: "nursery_sea",
  name: "The Nursery Sea",
  kind: "shape",
  family: "world",
  pitch: "Every map shows one sheltered sea basin ringed by storms that never stop. Beyond them lies a far larger, deadly world, and almost nobody who sails out comes back.",
  slots: ["world-edge", "history-secret"],
  tone: ["wonder", "horror"],
  era: ["bronze", "medieval", "renaissance", "industrial"],
  scale: "world",
  genres: ["fantasy", "shonen", "mythic", "grimdark"],
  w: 1,
  excludes: [],
  pairs: [{ id: "elder_lattice", w: 2.5 }, { id: "walking_mountains", w: 2 }, { id: "ward_walls", w: 1.5 }, { id: "balanced_circle", w: 2 }],

  truths: [
    { id: "nursery", n: "The basin is a nursery", d: "An older power walled off the basin to raise young peoples in safety until they were ready. The outer world is their inheritance, and its builders are still watching to see who passes the rim. They have sent crossings home with 'not yet', and the Compact swore every crew to silence, so nobody inside knows the door is meant to open.", tags: ["truth:nursery"],
      known: [
        "Every map shows the basin ringed by storms. The Compact, the league of rim powers that licenses crossings, says nothing of use lies beyond. Its rolls of the crossings have passages struck out.",
        "{survivor}, one of four who came back from the last crossing, says the people beyond were 'disappointed' and measured the crew like children. A rim cairn says 'when they can read this, open the door'.",
        "On the Turning Isle every compass points at one fixed place beyond the storms, and a buried model shows the basin inside a larger world with a lamp lit in it. The boundary stones are cracking.",
        "Confirmed: the basin is a nursery. Its builders wait beyond the rim for its peoples to grow up and come out, and they send back those who come too early. The Compact has hidden every 'not yet'.",
      ] },
    { id: "quarantine", n: "The basin is a refuge", d: "The outer world was not always deadly. A living grey blight overran it, and the basin was walled off as the last clean place. The blight still covers the outside and is still growing. The sixth crossing brought a jar of it home, and the Compact keeps it under the capital rather than admit the voyage should never have sailed.", tags: ["truth:basin_refuge"],
      known: [
        "A sealed vault under the capital holds a jar labelled 'never'. Its wardens are hereditary and have never been told what is inside. The grey cough of a past year was blamed on damp grain.",
        "The vault ledger says jar six came from the sixth crossing's surgeon and must not 'hear speech'. People on the grey coast remember the outer world as big and kind until 'the grey came'.",
        "Jar six has cracked, and grey threads are growing into the floor. A porter who unloaded the sixth crossing died of the grey cough within the month. The Compact has not explained the jar.",
        "Confirmed: a grey blight covers the world beyond the rim, and the basin is its last clean refuge. The sixth crossing brought a piece home. It is growing under the capital.",
      ] },
    { id: "reversal", n: "We are what is kept in", d: "The outer world is fine. The rim was built to stop the basin's peoples, and a sickness they carry in the blood, from getting out; the sickness wakes when they cross. The storms are a fence around us, not a shield, and the lighthouse clans have kept their lamps facing inward for a thousand years because they know it.", tags: ["truth:basin_reversal"],
      known: [
        "The lighthouse clans of the rim keep their fires facing the basin. Their oath says the light is for 'those who must not leave'. The crown's library says the lamps face inward to guide ships home.",
        "The boundary stones on the rim carry a warning addressed to the reader inside the basin. A smuggler says the outer coast is farms and bells, and that the farmers fled from the landing crew.",
        "A second hand on the stones says 'it is in the blood, it wakes when they cross'. The smuggler's mate began coughing blood after the landing and died before the boat was home.",
        "Confirmed: the rim keeps us in, not the world out. Something in the basin's blood wakes when its people cross, and the storms are the fence. The lighthouse clans have known all along.",
      ] },
  ],

  tags: ["basin"],

  subthemes: [
    { id: "sanctioned_voyage", n: "The Sanctioned Voyage", d: "Once in a generation the rim powers license a crossing. Every court wants a seat aboard, and every seat is paid for in favours, gold or sons.", w: 1.4, req: { any: ["coastal", "has:port"] }, mods: [["navy", 2], ["mercantile", 1.5], ["prestigious", 1.3]], tags: ["theme:sanctioned_voyage"] },
    { id: "vault_calamity", n: "The Jar Beneath the Capital", d: "A thing brought back by an old expedition is sealed in a vault under the capital. The wardens are hereditary; none of them has ever been told what is in the jar.", w: 1, req: { any: ["realm:large", "realm:vast", "autocracy"] }, truthLink: "quarantine", tags: ["theme:vault_calamity"] },
    { id: "salvage_coast", n: "The Salvage Coast", d: "A rim people grow rich on what the storms throw up: strange timber, glassy shells, seeds that sprout overnight. They swear it all washes in from wrecks.", w: 1.3, req: "coastal", mods: [["mercantile", 2], ["seafaring", 1.5]], tags: ["theme:salvage_coast"], mark: { kind: "zone", n: "Wrecker shore", color: "#6b7f86", size: [1, 3], where: "coast" } },
    { id: "returnee_line", n: "The Returnee Line", d: "A family descended from the few who came back. Their children see through fog, heal too fast and sometimes stop ageing at twenty.", w: 1, mods: [["ancestor_bound", 1.5], ["hierarchical", 1.3]], truthLink: "nursery", tags: ["theme:returnee_line"] },
    { id: "forged_charts", n: "The Forged Charts", d: "Charts from the last crossing are copied, doctored and sold. Three courts own 'the true chart'; all three disagree about where the safe current runs.", w: 1, req: { any: ["mercantile", "scholarly", "urbane"] }, tags: ["theme:forged_charts"] },
    { id: "storm_gap_blight", n: "The Storm-Gap Blight", d: "A gap opened in the rim storms for one season, and grey spores blew in. They take root in people's lungs and in the fields.", w: 0.9, req: "coastal", truthLink: "quarantine", tags: ["theme:storm_gap_blight"], mark: { kind: "zone", n: "Grey-spore coast", color: "#8a8f7a", size: [1, 2], where: "coast" } },
    { id: "inward_lamps", n: "The Inward Lamps", d: "The lighthouse clans of the rim keep their fires burning toward the basin, not the sea. Their oath-songs say the light is for 'those who must not leave'.", w: 1, req: "coastal", mods: [["ancestor_bound", 2], ["insular", 1.5]], truthLink: "reversal", tags: ["theme:inward_lamps"] },
    { id: "pale_pilot", n: "The Pale Pilot", d: "A tall stranger walked out of the rim surf and asked, in an old court tongue, to speak to 'whoever is eldest here'. The harbour master has locked them in the customs house.", w: 0.7, req: "has:port", truthLink: "nursery", tags: ["theme:pale_pilot"] },
    { id: "notch_race", n: "The Race for the Notch", d: "Only one mountain pass through the rim has ever been crossed alive. Two realms are building forts on either side of it.", w: 1, req: { any: ["mountain", "hills"] }, mods: [["martial", 1.8], ["frontier_forts", 2]], tags: ["theme:notch_race"], mark: { kind: "zone", n: "The contested notch", color: "#7a5a4a", size: [1, 2], where: "mountain" } },
    { id: "small_map_heresy", n: "The Small Map Heresy", d: "A cartographer has measured the stars from both ends of the basin and proved it is a tenth the size the crowns claim. Her book is banned in four realms.", w: 0.8, req: { any: ["scholarly", "academies", "faith:stars", "faith:philosophy"] }, tags: ["theme:small_map_heresy"] },
    { id: "failing_stones", n: "The Failing Boundary Stones", d: "The carved stones along the rim have begun to crack, and the storms beyond them grow quieter every year. Nobody knows who carved them, or how to mend them.", w: 0.9, req: { any: ["coastal", "mountain", "frontier"] }, truthLink: "nursery", tags: ["theme:failing_stones"] },
  ],

  sites: [
    { id: "seventh_hull", n: "The Seventh Hull at $", kind: "ruin", where: "coast", d: "The last expedition ship, washed ashore decades late with no crew and bread still warm in its ovens.",
      layers: {
        surface: { n: "The white hull", text: "A great hull lies on the shingle, its timbers bleached white and its sails neatly furled. It is the seventh crossing's ship, which sailed with ninety aboard and came back 31 years late with none. Nobody charges to see it, and nobody visits twice." },
        study: { n: "Warm bread", text: "The log stops mid-sentence on the day of the crossing. The stores are fresh: the water sweet, the bread in the ovens still warm. A child's drawing is pinned over the captain's bunk, showing this harbour as seen from the sea." },
        dig: { n: "The second log", text: "In the hold, sealed in lead, lies a second log in a hand nobody recognises. It describes the crew's 'welcome' in careful schoolroom sentences and ends with a list of ninety names. The Compact's registrar, {lead}, took it away and sealed it.", points: "cast:official" },
        revelation: { n: "The reply", text: "The crew did not die. They were met beyond the rim and kept there, and the empty ship was sent home as a reply. The second log lists every crew member with one word beside each name: 'kept'. The Compact read it, sealed it, and told the widows the ship was lost in the storms." },
      } },
    { id: "inward_stelae", n: "The Inward Stones of $", kind: "anomaly", where: "remote", truthLink: "reversal", d: "A line of carved boundary stones on the rim, every one of them facing the basin.",
      layers: {
        surface: { n: "Warm stones", text: "Tall weathered stones stand along the rim, one every three hundred paces, warm to the touch even in winter. Shepherds lean on them to warm their hands. Every carved face points inward, toward the basin, and none faces the sea." },
        study: { n: "Addressed to us", text: "The script is a warning. {investigator} has read enough of it to see that it addresses the reader and assumes the reader lives inside. It opens with the word for 'you' and a small map of the basin, with a dot for the reader." },
        dig: { n: "The guardians' bones", text: "Each stone's foundation is set with the bones of a people with long hands and no wisdom teeth, buried facing out to sea. One holds a bronze lamp. A drawing of a lighthouse-clan lamp exactly like it is filed at {lead}.", points: "sub:inward_lamps" },
        revelation: { n: "Do not let them cross", text: "The warning is not about the outside. It reads: 'Do not let them cross. They carry it still.' The long-handed builders raised the rim around us because a sickness in our blood wakes when we leave. They stood guard facing outward and were buried that way. The storms are the fence they left." },
      } },
    { id: "turning_isle", n: "The Turning Isle of $", kind: "anomaly", where: "coast", truthLink: "nursery", d: "A rim island where every compass swings to point outward, at one place beyond the storms.",
      layers: {
        surface: { n: "The needles", text: "On this rim island every compass needle spins, then settles pointing seaward. Pilots bring new needles here to test them, a copper a try. The island has one well, one hut and one goat, and the goat belongs to the pilots' guild." },
        study: { n: "One fixed point", text: "The bearing never changes with the seasons. {investigator} took sightings from both ends of the island, two miles apart, and the lines met at one spot far beyond the storms. Whatever the needles point at is very large." },
        dig: { n: "The model", text: "A buried chamber holds a model of the basin, every coast correct, set inside a far larger model with a single lamp burning in the outer part. The model's coastlines are more accurate than any chart held in {lead}.", points: "library" },
        revelation: { n: "The signal post", text: "Someone beyond the rim keeps a building that faces the basin, and keeps a lamp lit in it. The isle is their signal post: whoever lights the model's inner lamp tells them a people has grown up enough to find it. Nobody has lit it. The inner lamp is full of oil." },
      } },
    { id: "numbered_vault", n: "The Numbered Vault of $", kind: "dig", where: "capital", truthLink: "quarantine", d: "A vault under the capital lined with sealed jars, each labelled with an expedition number.",
      layers: {
        surface: { n: "Frost in summer", text: "A cellar under the palace has frost on its door in summer. The palace stewards will not enter it, and the hereditary wardens walk in backwards by custom. A brass bell hangs outside the door, to be rung once before anyone goes in." },
        study: { n: "Nine jars", text: "The vault inventory lists jars one to nine, each labelled with a crossing number. Eight have contents written beside them: shells, seeds, a pressed flower. Jar six is marked 'never'. {official} signs the inventory every year without opening the vault." },
        dig: { n: "Jar six", text: "Jar six is cracked. Grey threads have grown out of it an arm's length into the stone floor, and they twitch when the bell rings. The surgeon of the sixth crossing, who brought the jar home, wrote a report that is kept at {lead}.", points: "archive" },
        revelation: { n: "The last clean place", text: "The threads came from beyond the rim. The outer world was green and kind until this grey blight covered it, and the basin was walled off as the last clean place. The sixth crossing brought a piece home. The Compact keeps it under the capital rather than admit that voyage should never have sailed." },
      } },
    { id: "calling_notch", n: "The Calling Notch of $", kind: "anomaly", where: "mountain", d: "A mountain pass where travellers hear their names called from the far side.",
      layers: {
        surface: { n: "Tied dogs", text: "Shepherds tie up their dogs before crossing the notch, the only pass through the rim ever crossed alive. The dogs howl at nothing for the whole two-hour climb. A post at the foot of the pass has iron rings worn bright by leashes." },
        study: { n: "Our names", text: "Travellers hear their names called from the far side. The voices use family names, sometimes names of people dead a century. {survivor} heard a grandparent called by the old spelling of the family name, which nobody has used for two hundred years." },
        dig: { n: "The cairns", text: "Cairns along the pass hold clothing from many centuries: a bronze cloak pin, a knitted cap, a soldier's boot. They were left by people who walked out through the notch and never returned. The parish registers that list them are kept at {lead}.", points: "temple" },
        revelation: { n: "The callers' list", text: "The callers know our names because they wrote them down when they first brought our ancestors here, and they have kept the list. Those who answer and walk through are crossed off. The cairns hold 340 sets of clothes. By the number of voices, the list is still very long." },
      } },
  ],

  beings: [
    { id: "fog_strider", n: "Fog-strider", kind: "grazer", d: "A stilt-legged grazer three times a man's height that wades in from the rim fog to eat kelp, then wanders back out. Nobody has seen one young.", danger: 1, biomes: ["coast", "swamp", "tundra"], look: { size: 5, group: [1, 3], move: "herd", speed: 6, col: "#b8b8a8", col2: "#5a6a6a", body: "quad", active: "dusk", visible: true } },
    { id: "rim_stalker", n: "Rim-stalker", kind: "predator", d: "A pale, eyeless hunter that slips through storm gaps. It hunts by the sound of breathing, and no two witnesses describe it the same way.", danger: 3, biomes: ["coast", "boreal", "tempforest", "peaks"], look: { size: 2.5, group: [1, 1], move: "solo", speed: 12, col: "#d8d4c8", col2: "#3a3a3a", body: "quad", active: "night", visible: false } },
    { id: "rim_lamp_moth", n: "Lamp-moth", kind: "insect", d: "Palm-sized moths that drift in from the outer dark in spring and crowd the rim lighthouses until the glass goes black.", danger: 0, biomes: ["coast", "tundra", "boreal"], look: { size: 0.15, group: [50, 400], move: "swarm", speed: 8, col: "#e8dcb0", col2: "#4a3a2a", body: "insect", active: "night", visible: true } },
    { id: "rim_leviathan", n: "Rim leviathan", kind: "marine", d: "A whale-shaped thing as long as a town, seen only at the edge of the storm belt, turning slowly as if patrolling.", danger: 3, biomes: ["open", "abyss", "polar"], look: { size: 90, group: [1, 1], move: "solo", speed: 5, col: "#2a3a44", col2: "#8aa0a8", body: "whale", active: "any", visible: true } },
  ],

  techs: [
    { id: "nb_storm_reckoning", n: "Storm reckoning", field: "navigation", level: 1, d: "Pilots learn to read the rim storms' moods by colour and sound, and to know when to turn back." },
    { id: "nb_rim_tables", n: "Rim-pilot tables", field: "navigation", level: 2, d: "Hereditary tables of the safe currents along the rim, guarded like crown jewels." },
    { id: "nb_lead_seals", n: "Lead seals and jars", field: "medicine", level: 2, d: "Returning cargo is sealed in lead and kept apart for a year and a day; a law made after old plagues." },
    { id: "nb_fog_lenses", n: "Fog lenses", field: "astronomy", level: 3, d: "Ground lenses that pierce the rim mist, showing coastlines no basin map has ever held." },
    { id: "nb_outward_hull", n: "The outward hull", field: "navigation", level: 4, d: "A double-planked, copper-sheathed ship built to survive the storm belt. Only one realm can afford to build it." },
    { id: "nb_returnee_lore", n: "Returnee medicine", field: "medicine", level: 4, d: "Physicians learn to treat, and recognise, the changes the outside leaves in the body." },
  ],

  units: [
    { id: "nb_rim_wardens", n: "Rim wardens", role: "ranged", wpn: "xbow", kit: "mail", ranks: 3, gap: 1.4, size: 90, w: 0.6, mods: [["theme:inward_lamps", 5], ["theme:notch_race", 4], ["frontier_forts", 2]] },
  ],

  govs: [
    { id: "nb_rim_compact", n: "Rim compact", d: "A league of rim lords sworn to turn back every unlicensed ship, and paid handsomely by the inner crowns to do it.", tags: ["gov:rim_compact", "republic"], w: 0.4, req: "coastal", forms: ["Compact of $", "Rim League of $", "Wardenry of $"], ruler: "Warden of the Rim", mods: [["seafaring", 2], ["theme:inward_lamps", 4]] },
  ],

  faiths: [
    { id: "far_seekers", n: "The Far-Seeking", d: "The outer world is the promised land; every soul is owed one crossing, in life or in death.", tags: ["faith:far_seekers"], w: 0.5, names: ["The Far-Seekers of $", "The Outward Creed", "The Unwalled Sea"], mods: [["seafaring", 3], ["theme:sanctioned_voyage", 3]] },
  ],

  mapMarks: [
    { kind: "forbidden", n: "The Outer Dark", d: "The true world beyond the storm-rim: unclaimed, uncharted and lethal, drawn on old charts only as fog and warnings." },
    { kind: "zone", n: "The storm belt", color: "#4a5868", size: [2, 4], count: [1, 2], where: "coast", d: "Coasts where the rim storms never stop and the sea is a grey wall." },
  ],

  storylines: [
    { id: "nb_voyage", n: "The Crossing of {year}", scale: "realm", anchor: "coast", w: 1.6, req: ["basin", "has:port"],
      stages: {
        start: { h: "{realm} is granted the right to cross the rim", b: "The compact has licensed one ship this generation, and it will sail from {place}. {person}, a pilot of the old tables, is to command the ship.", wait: [3, 8], fx: { treasury: -80, prestige: 5 }, next: [{ to: "sails", w: 2 }, { to: "seats_war", w: 1, mods: [["has:rival", 2], ["unstable", 1.5]] }] },
        seats_war: { h: "Courts quarrel over seats on the crossing", b: "Every great house in {realm} wants a son aboard. Two have come to blows in {capital}, and the ship waits at anchor.", wait: [2, 6], fx: { unrest: 10, stability: -4 }, next: [{ to: "sails", w: 2 }, { to: "cancelled", w: 1, mods: [["ruler:paranoid", 2], ["unstable", 2]] }] },
        sails: { h: "The crossing ship vanishes into the storm belt", b: "Crowds lined the harbour of {place} as the ship sailed into the grey wall. The lamps on the rim burned all night.", wait: [8, 24], next: [{ to: "silence", w: 2 }, { to: "few_return", w: 1 }, { to: "changed_return", w: 0.8, mods: [["theme:returnee_line", 3]] }] },
        silence: { h: "No word from the crossing", b: "Two years and nothing. The widows of {place} have stopped walking to the harbour, and the compact has struck the voyage from the rolls.", fx: { prestige: -6, stability: -3 }, end: true },
        few_return: { h: "Four of ninety come home to {place}", b: "The ship came back with four survivors and a sealed chest. {person2}, the ship's surgeon, will not speak of the far shore, and will not let anyone open the chest.", wait: [3, 8], fx: { flag: "returned" }, next: [{ to: "chest_opened", w: 1, mods: [["ruler:greedy", 2], ["ruler:cruel", 1.5]] }, { to: "chest_sealed", w: 1.5 }] },
        changed_return: { h: "{person} returns from beyond, unaged", b: "Twelve years after sailing, {person} walked into {place} looking not a day older, carrying charts of a coast a hundred times the size of the basin.", fx: { discovery: "navigation", prestige: 12 }, end: true },
        chest_opened: { h: "The chest from beyond is opened in {capital}", b: "The court of {realm} broke the seals. Within a month the grey cough was in every street of {capital}.", fx: { plague: true, pop: 0.85, stability: -10 }, end: true },
        chest_sealed: { h: "The chest goes down into the vault", b: "{person2} carried the chest into the vault under {capital} with their own hands and was never seen again. It has a number now.", fx: { stability: 3, science: { navigation: 0.8 } }, end: true },
        cancelled: { h: "{ruler} cancels the crossing", b: "Sick of the feuding, {ruler} ordered the ship burned at her moorings. Some say it was wisdom; most say it was shame.", fx: { prestige: -8, stability: 4 }, end: true },
      } },
    { id: "nb_pale_guest", n: "The Guest from the Rim", scale: "local", anchor: "coast", w: 1, req: "basin",
      stages: {
        start: { h: "A stranger walks out of the surf at {place}", b: "Fishers of {place} pulled a tall, grey-eyed stranger from the rim surf. It speaks an old court tongue and asks to see 'the eldest'.", wait: [1, 4], fx: { unrest: 5 }, next: [{ to: "audience", w: 1.5, mods: [["hospitable", 2], ["learned", 1.5]] }, { to: "imprisoned", w: 1, mods: [["insular", 2], ["zealous", 2]] }] },
        audience: { h: "The guest speaks before the court of {realm}", b: "The stranger told {ruler} that 'the term is nearly up' and asked how many of us can read. Nobody at court knows why it asked, or what answer it wants.", wait: [3, 9], next: [{ to: "invitation", w: 1, mods: [["learned", 2], ["scholarly", 2]] }, { to: "departs", w: 1.5 }] },
        imprisoned: { h: "The guest of {place} is put in chains", b: "The priests called it a demon of the outer dark. It did not resist. On the ninth night the rim storms came ashore for the first time in living memory.", wait: [1, 3], fx: { stability: -6 }, next: [{ to: "storm_comes", w: 2 }, { to: "departs", w: 1 }] },
        invitation: { h: "{realm} is invited beyond the rim", b: "Before leaving, the guest left a token of white stone and a promise: a safe passage, once, for whoever {realm} chooses.", fx: { prestige: 15, discovery: "navigation", flag: "invited" }, end: true },
        departs: { h: "The guest of {place} walks back into the sea", b: "It thanked the fishers who had fed it and walked back into the surf. A child of {place} has been drawing its face ever since.", fx: { stability: 2 }, end: true },
        storm_comes: { h: "The rim storm breaks over {place}", b: "The storm took the harbour, the temple and the cell where the guest was chained. It left the fishers' houses standing.", fx: { pop: 0.9, abandon_town: true }, end: true },
      } },
  ],

  cast: [
    { role: "investigator", n: "a cartographer of the Small Map school who measures the basin with shadow-sticks", home: "remote", stance: "Has proved the basin is small and wants to know who made it, whatever the Compact says." },
    { role: "official", n: "a registrar of the Compact who keeps the crossing rolls and the vault inventory", home: "capital", stance: "Believes the basin survives because people do not know what is outside, and acts on it." },
    { role: "believer", n: "a far-seeker preacher who teaches that the outer world is a garden earned by faith", home: "inner", stance: "Wants the faithful to grow worthy, and expects to be among the first invited out." },
    { role: "survivor", n: "a sailor of the last crossing, one of four who came home", home: "coast", stance: "Swore the Rim Oath and has kept it for years; is close to breaking it." },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "a schoolroom atlas of {realm}", text: "From a schoolroom atlas of {realm}, page one, {year} printing: 'The known world is a single sea basin, bounded on every side by the Rim: a belt of storms that never stop, and mountains no one has climbed. Beyond it lies nothing of use or safety. Crossings are licensed by the Compact of the rim powers. Seven have been attempted; all are recorded in the Compact rolls.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a lighthouse family of {place}, recorded by {investigator}", text: "Lullaby sung in the lighthouse families of {place}, written down by {investigator} in {year}: 'Hush, the sea is a cradle, the storm is its side; sleep till they lift you and carry you wide.' The cartographer's note: 'Sung in every lighthouse on this coast, 31 of them. Nobody could say who they are. One keeper's mother said: the people who built the cradle.'" },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a sailor, before the harbour court of {place}", points: "site:turning_isle", text: "Sworn statement of a sailor before the harbour court of {place}, {year}: 'Off the island where the needles turn, at {lead}, the storm wall parted for as long as it takes to say a prayer. Behind it was a coast so long and high it filled half the sky, with lights on it, hundreds of them, in rows.' The court fined the sailor two silver for drunkenness, noting in the margin that the sailor had been ashore and dry for nine days." },

    { depth: "core", about: "truth:nursery", source: "ruin", bias: "true", reliable: true, plain: true, who: "carved inside a rim cairn", text: "Carved inside a rim cairn in letters older than any realm, copied by {investigator} in {year} by lamplight: 'We have walled this sea to raise you. Keep them warm. Keep them fed. When they can read this, open the door.' Under it, smaller, a count of marks in fives, 174 in all. The cartographer believes they are years, and that the last mark is recent." },
    { depth: "core", about: "truth:nursery", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, far-seeker preacher", text: "Sermon of {believer}, far-seeker, at the harbour shrine of {place}, {year}: 'The world beyond the storms is a garden prepared for us. We are not ready for it yet. Grow worthy, and the door will open. I have counted the signs: three boundary stones cracked this winter. Bring your children to the reading-school, which is free on the first day of every week.'" },
    { depth: "core", about: "truth:nursery", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, sailor of the last crossing", text: "Deposition of {survivor}, sailor of the last crossing, taken in {year}: 'Ninety of us sailed and four came home. They were not angry. They were disappointed. They measured us like you measure a child against a door, and wrote the marks down. They kept my twin, {person}. They said: not yet. I have kept the Rim Oath for eleven years, and I am done keeping it.'" },
    { depth: "core", about: "truth:nursery", source: "archive", bias: "redacted", reliable: "partial", who: "the Compact roll of the fourth crossing", points: "site:seventh_hull", text: "Compact roll of the fourth crossing, as copied for {official} in {year}: '...landed safely on the far shore, day 19. Met by [struck out]. Told to return home and wait. Crew ordered to silence under the Rim Oath, 63 men, all signed.' A clerk's note: 'Compare the seventh crossing's hull, beached at {lead} with its second log.'" },
    { depth: "core", about: "truth:nursery", source: "library", bias: "official", reliable: false, who: "the Compact's official answer", text: "Answer of the Compact to the petition of the far-seekers, {year}: 'There is no intelligence beyond the rim. The so-called callers of the mountain notch are echoes and the wind. The so-called second log of the seventh crossing is a forgery by wreckers. The Compact will license no crossing for the next 40 years.'" },

    { depth: "core", about: "truth:quarantine", source: "archive", bias: "redacted", reliable: true, plain: true, who: "the vault ledger", points: "site:numbered_vault", text: "The vault ledger at {lead}, jar six, in the sixth crossing surgeon's hand: 'Taken from the far shore. The grey threads cover it all: every tree, every hill, every town, as far as the masthead could see. The world out there was green once; you can see the shapes. This sea is the last clean place. Do not open. Do not move. Do not let it hear speech.'" },
    { depth: "core", about: "truth:quarantine", source: "oral", bias: "garbled", reliable: "partial", who: "a net-mender of the grey coast", points: "sub:storm_gap_blight", text: "A net-mender of the grey coast, talking to {investigator} on the quay at {place}, {year}: 'The world used to be big and kind. Then the grey came, and the good folk walled this sea off to hide in. My family has mended nets here for nine generations, and every one of them was told the same thing. We never go near grey moss. We burn it with lamp oil.' The cartographer adds that the record of the year the storm gap opened is kept at {lead}." },
    { depth: "core", about: "truth:quarantine", source: "heretic", bias: "heretic", reliable: "partial", who: "a pamphlet of the Small Map school", points: "sub:small_map_heresy", text: "Pamphlet of the Small Map school, {year}, 500 copies, one of them now filed at {lead}: 'The crowns are not keeping us in for fear of monsters. They are keeping us in because of what covers the world outside, and they have already brought a piece of it home. Ask the Compact why the sixth crossing came home with a jar, and why the grey cough started in the port where it landed.'" },
    { depth: "core", about: "truth:quarantine", source: "library", bias: "official", reliable: false, who: "the court physician of {realm}", text: "Report of the court physician of {realm}, {year}: 'The grey cough arose from damp grain in the port stores and has no connection with any vessel from the rim. 1,200 deaths are recorded. The grain has been burned. The port reopens next month, and talk of grey threads in the lungs of the dead is to cease.'" },
    { depth: "core", about: "truth:quarantine", source: "person", bias: "true", reliable: "partial", cost: true, who: "the family of {person}, porter", text: "Letter from the family of {person}, porter at {place}, to the Compact, {year}: '{person} unloaded the sixth crossing's sealed chest, one of eight porters. All eight are dead of the grey cough. The physician opened the body and showed us grey threads in the chest like wet cobweb. We ask for the wages for the last week, four silver, and for the truth.'" },

    { depth: "core", about: "truth:reversal", source: "ruin", bias: "true", reliable: true, plain: true, who: "the inward stones of the rim", points: "site:inward_stelae", text: "On the inward stones at {lead}, beneath the old warning, a second hand has cut a plain note, copied by {investigator} in {year}: 'The outer world is well. The fence is for them. It is in their blood, and it wakes when they cross. The storm is the fence. Keep the lamps facing in.' The second hand uses the same letters as the lighthouse clans' oath-books." },
    { depth: "core", about: "truth:reversal", source: "oral", bias: "true", reliable: "partial", who: "a lighthouse clan of {place}", text: "Oath sung by the lighthouse clan of {place} at every lighting, 9 lamps each night, as recorded in {year}: 'The lamp faces home, the back faces the sea; none shall go out who was born in the lee.' The head keeper, asked what 'none shall go out' means, said it meant ships, and then asked {investigator} to leave the tower." },
    { depth: "core", about: "truth:reversal", source: "traveller", bias: "exaggerated", reliable: "partial", cost: true, who: "a smuggler, in a dockside tavern", text: "A smuggler's tale, told in a dockside tavern at {place}, {year}: 'We got through on the tail of a storm, six of us. The outer coast is all farms and bells. The farmers saw us land and ran screaming, ringing the bells. Three days out on the way home my mate {person} began coughing blood. Died before we cleared the storms. The rest of us burned the boat.'" },
    { depth: "core", about: "truth:reversal", source: "library", bias: "official", reliable: false, who: "the Compact's ruling on the lamps", text: "Ruling of the Compact on the rim lamps, {year}: 'The lamps of the rim face inward only so that ships within the basin may find safe harbour before the storms. No other reading of the lighthouse oath is permitted. The clans' request for 200 more barrels of oil a year is granted, as usual, without question.'" },

    { depth: "sub", about: "sub:salvage_coast", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a timber merchant of {place}", points: "sub:storm_gap_blight", text: "Complaint of a timber merchant of {place} to the guild, {year}: 'The wreckers sold me forty planks of ship timber. In a wet cellar they put out green shoots within the week. No ship I know was ever built of living wood. The wreckers say it washes in through the storm gap, which the records at {lead} describe. I want my eight silver back.'" },
    { depth: "sub", about: "sub:vault_calamity", source: "person", bias: "true", reliable: "partial", who: "a hereditary vault warden", points: "cast:official", text: "Diary of a hereditary vault warden, {year}: 'Jar six hums when the palace bells ring. My father said never to sing near it. I did not ask why until he was dead, and by then there was nobody to ask. I have asked the registrar, {lead}, three times what is in it. Each time the registrar has sent me a new key and no answer.'" },
    { depth: "sub", about: "sub:small_map_heresy", source: "heretic", bias: "heretic", reliable: true, who: "{investigator}, in a banned book", text: "From the banned book of {investigator}, cartographer, chapter three: 'By the shadow of a stick at either shore, measured at noon on the same day by two of my students, I have measured our whole world. It is a tenth the size the crowns claim: 600 leagues across, not 6,000. We live in a pond and were told it was an ocean. Someone dug the pond.'" },
    { depth: "sub", about: "sub:returnee_line", source: "oral", bias: "garbled", reliable: "partial", who: "a barber of {place}", text: "A barber of {place}, to a customer, {year}: 'I cut the hair of the returnee family twice a year, all eleven of them. The girls never let me take more than a finger's width. Once, the youngest made me cut it short, and by morning it had grown back white to the waist. The family paid me a silver to say nothing. That was nine years ago.'" },
    { depth: "sub", about: "sub:failing_stones", source: "person", bias: "true", reliable: true, who: "a rim shepherd", points: "site:inward_stelae", text: "A rim shepherd, to the parish priest of {place}, {year}: 'Three of the warm stones on the ridge at {lead} cracked this winter, top to bottom. The storm was gentle for the first time in my life. I could see a grey line beyond it, flat, like land. I have never been so frightened. I have moved the flock down to the valley.'" },
    { depth: "sub", about: "sub:sanctioned_voyage", source: "archive", bias: "propaganda", reliable: false, who: "a proclamation of the Compact", text: "Proclamation of the Compact, signed by {official} for the seventh time in {year}: 'Of every crossing, the greater part returned in honour and health. Tales to the contrary are punishable by a fine of ten silver or a month in the stocks. The next crossing will be licensed to the realm that pays the greatest share of the Compact's costs.'" },
    { depth: "site", about: "site:seventh_hull", source: "person", bias: "true", reliable: "partial", who: "the beachcomber who found the hull", text: "Statement of the beachcomber who found the seventh hull on the shingle at {place}, {year}: 'The bread was warm. The beds were made, ninety of them. There was a child's drawing pinned over the captain's bunk, of our harbour, from the sea side. I took the drawing home before the Compact came. My daughter says it is very well done.'" },
    { depth: "site", about: "site:calling_notch", source: "oral", bias: "garbled", reliable: "partial", who: "a shepherd of the notch", text: "Testimony of a shepherd of the notch to {investigator}, {year}: 'Do not answer the voices in the notch. If you answer, they write your name down, and then they know you are still here. My uncle answered, at forty. He walked up the pass the next spring with his good boots on. We found the boots on the cairn.'" },
  ],
};
