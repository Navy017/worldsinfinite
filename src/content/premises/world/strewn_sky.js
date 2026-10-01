// The Strewn Sky: there is no ground; the world is a scatter of floating isles above an endless void.
export default {
  id: "strewn_sky",
  name: "The Strewn Sky",
  kind: "shape",
  family: "world",
  pitch: "There is no ground. The lands of the world are islands drifting in an endless sky, held up by lift-stone that is running out. Below them is a sea of cloud no one has crossed.",
  slots: ["world-shape", "world-edge"],
  tone: ["wonder", "melancholy"],
  era: ["medieval", "renaissance", "industrial"],
  scale: "world",
  genres: ["fantasy", "shonen", "flintlock"],
  w: 1,
  excludes: ["ward_walls"],
  pairs: [{ id: "drowned_crown", w: 3 }, { id: "elder_lattice", w: 2 }, { id: "walking_mountains", w: 2 }],

  cast: [
    { role: "investigator", n: "a bell-master of the Admiralty survey, who dives the cloud floor in a weighted bell", home: "coast", stance: "Wants to know what is under the cloud and trusts a depth-line over any sermon." },
    { role: "official", n: "a reserves clerk of the Lift-Stone Guild", home: "mountain", stance: "Believes the isles stay calm only if nobody learns how much stone is left, and keeps the ledgers accordingly." },
    { role: "believer", n: "a heart-cult priest who tends an isle's lift-heart and keeps the Raising Feast", home: "inner", stance: "Holds that the hearts are sleeping gods who will one day carry the isles home, and that this is good news." },
    { role: "survivor", n: "a ferry-keeper of a low isle whose child went down the rope", home: "border", stance: "Wants the Admiralty to admit there are people below and to send a bell after the lost child." },
  ],

  truths: [
    { id: "lifted", n: "The isles were lifted", d: "The isles were once one continent. When a flood came, its eleven high houses raised their own towns into the sky with engines and left 29 towns on the ground to drown. The flood went down within a lifetime; the people below survived, and their descendants still send ropes up to the people who abandoned them.", tags: ["truth:isles_lifted"],
      known: [
        "Ropes hang from the undersides of the lowest isles, and low-isle villages say people climb them at night. The Admiralty calls the rope-folk a sailors' fable and fines anyone who lowers cargo. Nobody has explained who ties bread and toys to the ropes.",
        "Bundles on the ropes carry letters in an old form of our own tongue. Whoever writes them knows our language as it was spoken centuries ago, and asks whether we are still angry. Somebody below remembers a quarrel the isles have forgotten.",
        "An engine in an isle's root holds lift-stone in a lattice that was plainly made. Its plates give a date, 'the year of the waters', and 29 towns to be abandoned. The heart-cult snuffs 29 candles at its Raising Feast. The isles did not always float.",
        "Confirmed: the eleven high houses raised the isles to escape a flood and chose 29 towns to leave below. The flood went down. The people of those towns lived, and have been calling up the ropes for four hundred years. The high houses' heirs still sit on the highest isles.",
      ] },
    { id: "broken", n: "The world exploded", d: "The isles are pieces of a world that burst after its people dug into its hot core for warmth. They circle the burning remains in the void below and fall a little closer every year. The Admiralty's own star-tables show the spiral tightening, and the Admiralty files them as instrument error.", tags: ["truth:isles_broken"],
      known: [
        "Once a year a hot wind rises from the void, carrying black glass and charred seed, and the sky below glows red. The Admiralty says the glow is sunset on the cloud. It is seen at midnight.",
        "Murals in the halls cut into the underside of an isle show a round world cracked like an egg, with houses on the pieces. Shards of glazed pottery come up on the hot wind. Someone below once farmed flat ground.",
        "Three hundred years of Admiralty logbooks show every isle drifting in a slow spiral around a point below the cloud, and every spiral tightening. The tables are filed under 'instrument error'. At the present rate the lowest isles reach the centre in about 600 years.",
        "Confirmed: the old world's people dug into its core for heat, and it burst. The isles are its pieces, circling the fire and falling back. The Admiralty has had the numbers for three centuries and filed them as a fault in its own instruments.",
      ] },
    { id: "sky_sea", n: "The cloud is alive", d: "The cloud below is a living ocean with its own deep creatures, and lift-stone is its seed. Below 300 feet the stone grows roots that draw each isle down to feed the cloud. The Lift-Stone Guild found the roots a century ago, called the bleeding 'sap' and paid miners double to stay quiet. Every fresh heart the guild sells an isle is a new seed planted.", tags: ["truth:cloud_sea"],
      known: [
        "Some isles are sinking, a fathom a season. The crown calls it settling and the guild sells new lift-stone to stop it. Cloud-divers say the floor is warm and thick once you are inside it, and that it pulls.",
        "Guild miners talk about white roots in the deep seams that bleed when cut. The guild's survey calls them mineral veins and docks the pay of anyone who repeats the story. The guild's injury book records men drawn down into the rock.",
        "The lowest known isle sits in the cloud, which laps it twice a day against the wind. Its lift-stone has grown roots as thick as masts, going down into the cloud, with guild clamps bolted on them.",
        "Confirmed: the cloud is alive and lift-stone is its seed. The roots pull the isles down to feed it. The guild has known for a century, and every new heart it sells plants another seed.",
      ] },
  ],

  tags: ["sky_isles"],

  subthemes: [
    { id: "sinking_isle", n: "The Sinking Isle", d: "An island is losing height, a fathom a season. Its people are selling everything that does not float.", w: 1.3, truthLink: "sky_sea", tags: ["theme:sinking_isle"], mark: { kind: "zone", n: "The sinking reach", color: "#7a8a9a", size: [1, 3], where: "border" } },
    { id: "lift_guild", n: "The Lift-Stone Guild", d: "The guild owns the mines that keep isles and ships aloft. It knows exactly how much stone is left, and says nothing.", w: 1.4, req: { any: ["mountain", "artisans", "guilds", "mercantile"] }, tags: ["theme:lift_guild"] },
    { id: "returned_ship", n: "The Ship from Beneath", d: "A sky-ship that dived into the cloud floor ten years ago has come back up, its hull crusted with something like coral.", w: 0.9, req: { any: ["has:port", "coastal"] }, truthLink: "lifted", tags: ["theme:returned_ship"] },
    { id: "sky_grazer", n: "The Grazing Leviathan", d: "A sky-whale the size of a town has settled on an isle's meadows to graze. It shows no sign of leaving.", w: 0.9, req: { any: ["grass", "forest", "near:beasts"] }, tags: ["theme:sky_grazer"] },
    { id: "wind_pirates", n: "The Wind Pirates", d: "Free captains have seized the only trade wind between two isle-realms and charge passage in gold or hostages.", w: 1.2, req: { any: ["has:port", "coastal"] }, mods: [["mercenaries", 2], ["unstable", 1.5]], tags: ["theme:wind_pirates"] },
    { id: "lost_isle", n: "The Returning Isle", d: "An isle that drifted out of sight a century ago has drifted back, its towns empty and its gardens perfectly kept.", w: 0.7, tags: ["theme:lost_isle"], mark: { kind: "zone", n: "The returned isle", color: "#b0a0c0", size: [1, 2], where: "remote" } },
    { id: "climbers_below", n: "The Climbers from Below", d: "Ropes have appeared hanging from the undersides of the lowest isles, and on them, at night, people are climbing.", w: 0.8, truthLink: "lifted", tags: ["theme:climbers_below"] },
    { id: "collision", n: "The Slow Collision", d: "Two isles are drifting together. Their realms have perhaps ten years to agree on a border before the mountains meet.", w: 0.8, mods: [["has:rival", 2], ["martial", 1.3]], tags: ["theme:collision"] },
    { id: "storm_wall", n: "The Storm Wall", d: "A wall of lightning has surrounded the known isles since records began. This year a gap has opened in it.", w: 0.9, req: { any: ["frontier", "navy", "seafaring"] }, truthLink: "broken", tags: ["theme:storm_wall"] },
    { id: "altitude_caste", n: "The High Isles", d: "The higher an isle floats, the nobler its people. Low-isle folk need a pass to visit the high courts, and many never get one.", w: 1.2, req: { any: ["hierarchical", "autocracy"] }, tags: ["theme:altitude_caste"] },
    { id: "heart_cults", n: "The Heart Cults", d: "Each isle worships the great lift-heart in its depths. To mine your own heart is sacrilege; to mine another isle's is merely war.", w: 1, req: { any: ["pious", "faith:spirits", "ancestor_bound"] }, truthLink: "sky_sea", tags: ["theme:heart_cults"] },
  ],

  sites: [
    { id: "raising_engine", n: "The Raising Engine of $", kind: "ruin", where: "inner", truthLink: "lifted", d: "Machinery in an isle's heart, built to lift it into the sky.",
      layers: {
        surface: { n: "The humming hall", text: "Under the root of {place} is a sealed bronze door, 12 feet high and warm to the touch. The hum behind it can be felt in the teeth. Farmers leave milk on the step for luck. Nobody living has opened it, and the hinges are on the inside." },
        study: { n: "The made lattice", text: "Masons cut through the wall beside the door. Behind it, bronze cages hold 400 blocks of lift-stone in rows of 20. In every mine the stone grows wild. This was cut, counted and placed. The foreman left a chisel in the wall to mark the spot." },
        dig: { n: "The plates", text: "Under the lattice is a floor of brass levers and a wall of bronze plates. They give a date, 'the year of the waters', and a list of 29 towns to be left below. The heart-cult snuffs 29 candles at its Raising Feast. {believer}, who keeps the feast, lives at {lead}.", points: "cast:believer" },
        revelation: { n: "Who was left", text: "The isles were one continent. When the flood came, the eleven high houses had their engineers raise the houses' own towns and leave 29 others on the ground. The flood went down within a lifetime. Nobody went back to look. The heirs of those houses still hold the highest isles." },
      } },
    { id: "hanging_rope", n: "The Rope at $", kind: "anomaly", where: "border", truthLink: "lifted", d: "A rope hanging from an isle's underside down into the cloud.",
      layers: {
        surface: { n: "The rope", text: "A rope of plaited grass, thick as a wrist, hangs from the rocks below {place} into the cloud. Twelve men tried to haul it up in {year} and could not. The village ties its goats to the top of it. Nobody knows who tied the bottom." },
        study: { n: "The tug", text: "{investigator} watched the rope for a season. It twitched 9 times, always at night and always twice. The fibre near the top is old and grey; lower down it is green. Someone below is replacing the rope from the bottom up." },
        dig: { n: "The bundle", text: "A climber went 60 feet down and found a bundle tied on: bread, a letter in an old form of our tongue, and a carved wooden horse. The letter thanks 'the ferry-keeper who pulled twice'. That is {survivor}, who lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "The people below", text: "There is ground under the cloud, and people on it: the descendants of the 29 towns the high houses left to drown. They have tended this rope for four centuries. They know exactly who left them. They still send toys up for children they have never seen." },
      } },
    { id: "underside_ruins", n: "The Underside Halls of $", kind: "ruin", where: "remote", d: "Ruins carved into the bottom of an island, facing the void.",
      layers: {
        surface: { n: "Windows below", text: "Sky-sailors passing under {place} point out 14 windows and two arches cut into the bottom of the isle, facing the void. Crews toss coins at the sills for luck, and the sills are crusted with old coin. Nobody climbs in, because the only way in is upside down." },
        study: { n: "The upside-down halls", text: "Climbers with hooks got in. The halls were built for people who walked on the underside, heads toward the void: the stairs run along what we would call the ceiling. A child's shoe was found nailed sole-up to the floor of the second hall." },
        dig: { n: "The murals", text: "The third hall is painted floor to ceiling. It shows a ground below with fields and rivers, and the isles hanging over it like a ceiling. A painted road leads to a town with a red tower. The same red tower is carved on a gatepost at {lead}.", points: "ruin" },
        revelation: { n: "The roof of the world", text: "The underside builders lived facing down, toward the place their grandparents had come from, and painted it so their children would not forget. To them, we lived on the roof of the world. The high houses sealed the halls and burned the ladders within 50 years. The sealing order is signed; its line for the reason is blank." },
      } },
    { id: "lowest_isle", n: "The Lowest Isle at $", kind: "anomaly", where: "remote", truthLink: "sky_sea", d: "The lowest known isle, half-sunk in the cloud floor.",
      layers: {
        surface: { n: "Feet in the cloud", text: "The lowest known isle sits with its base 200 feet deep in the cloud floor. Its 3 villages stand empty, doors open, tables laid. The last tax roll for it is 40 years old. Sky-ships give it a wide berth, because their keels grow heavy near it." },
        study: { n: "The tide", text: "{investigator} anchored a ship off the isle for a month. The cloud moves against the wind here, lapping the rock twice a day like a tide. A gauge-pole driven into the rim showed 4 feet of height lost in that month." },
        dig: { n: "The roots", text: "Miners cut down into the isle's heart. Its lift-stone has grown white roots, thick as a mast, reaching down into the cloud. They bleed when cut. A guild clamp is bolted round the largest root, and its work order is filed at {lead}.", points: "archive" },
        revelation: { n: "The planting", text: "The cloud is alive, and lift-stone is its seed. The seed grows roots, the roots draw the isle down, and the cloud feeds on what arrives. The Lift-Stone Guild has known for a century and clamped roots to buy time. Every new heart it sells is another seed." },
      } },
    { id: "up_wind", n: "The Upward Wind of $", kind: "wonder", where: "any", truthLink: "broken", d: "A wind that blows straight up from the void, once a year, warm and smelling of ash.",
      layers: {
        surface: { n: "The hot night", text: "On the same night every year a hot wind rises past {place} from the void, and the sky below glows red for about 3 hours. Farmers bring the washing in first, because the wind leaves black grit on everything. Children are allowed to stay up and watch." },
        study: { n: "The grit", text: "{investigator} sieved the grit out of 50 buckets of washing water. It is fine black glass and tiny charred seeds: barley, mostly, and a bean no isle grows. The glass is the kind volcanoes make. The seeds were burned this year, not long ago." },
        dig: { n: "Painted shards", text: "In the ash layers under the terraces, diggers found shards of glazed pottery. The best shows a woman sowing a field on flat ground, under a sky with no isles in it. The same woman is painted on the walls of the underside halls at {lead}.", points: "site:underside_ruins" },
        revelation: { n: "The burning world", text: "Below is not empty sky. The old world's people dug into its hot core for warmth, and it burst. The isles are pieces thrown off it, circling what is left and falling slowly back. Someone down there still grows barley on the burning ground." },
      } },
  ],

  beings: [
    { id: "sky_whale", n: "Sky-whale", kind: "grazer", d: "A gentle floating giant that drifts between isles, grazing on cloud-moss. Its passing shadow lasts an afternoon.", danger: 1, biomes: ["grass", "alpine", "peaks", "tempforest"], look: { size: 60, group: [1, 3], move: "pod", speed: 6, col: "#8aa0c0", col2: "#e0e8f0", body: "whale", active: "day", visible: true } },
    { id: "cloud_eel", n: "Cloud-eel", kind: "predator", d: "A long, translucent hunter that rises from the cloud floor to snatch sky-sailors from the rigging.", danger: 2, biomes: ["alpine", "peaks", "coast"], look: { size: 6, group: [1, 4], move: "solo", speed: 30, col: "#d0d8e0", col2: "#5a6a8a", body: "serpent", active: "dusk", visible: false } },
    { id: "winged_folk", n: "Wingfolk", kind: "beast", d: "A people with broad feathered arms who nest on the highest crags and trade feathers and news.", danger: 1, biomes: ["peaks", "alpine"], look: { size: 1.6, group: [4, 16], move: "flock", speed: 40, col: "#b09070", col2: "#f0e0c0", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "ss_lift_stone", n: "Lift-stone cutting", field: "metallurgy", level: 1, d: "Cutting and binding the stone that falls upward, to keep keels and isles aloft." },
    { id: "ss_wind_charts", n: "Trade-wind charts", field: "navigation", level: 2, d: "Charts of the great winds between isles, worth more than any cargo they carry." },
    { id: "ss_sky_ships", n: "Sky-ships", field: "navigation", level: 3, d: "Lift-keeled ships with sails and rudders for the open air." },
    { id: "ss_cloud_diving", n: "Cloud-diving bells", field: "engineering", level: 4, d: "Weighted bells on cables that let a diver go down into the cloud floor and come back." },
    { id: "ss_lift_seeding", n: "Lift seeding", field: "natural_philosophy", level: 5, d: "The discovery that lift-stone grows, and how to make it grow." },
  ],

  units: [
    { id: "ss_sky_marines", n: "Sky marines", role: "infantry", wpn: "sword", kit: "light", ranks: 3, gap: 1.4, size: 80, w: 0.8, mods: [["theme:wind_pirates", 5], ["navy", 3]] },
    { id: "ss_wing_riders", n: "Wing-riders", role: "cavalry", mounted: 1, wpn: "lance", kit: "light", ranks: 2, gap: 4, size: 40, w: 0.3, mods: [["theme:altitude_caste", 4], ["beast_tamers", 4]] },
  ],

  govs: [
    { id: "ss_admiralty", n: "Sky admiralty", d: "An isle-empire ruled by its fleet; whoever holds the winds holds the throne.", tags: ["gov:sky_admiralty", "autocracy"], w: 0.5, req: "has:port", forms: ["Admiralty of $", "Windholding of $", "High Isles of $"], ruler: "Lord Admiral", mods: [["navy", 4], ["theme:wind_pirates", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The cloud floor", color: "#c8d0d8", size: [3, 6], count: [1, 2], where: "coast", d: "The rim of an isle, where the land falls away to an endless floor of cloud." },
    { kind: "zone", n: "Lift-stone mines", color: "#a08ac0", size: [1, 2], count: [1, 2], where: "mountain", d: "Mines of the stone that falls upward, which keeps the isle in the sky." },
  ],

  storylines: [
    { id: "ss_sinking", n: "The Fall of {place}", scale: "realm", anchor: "realm", w: 1.5, req: "sky_isles",
      stages: {
        start: { h: "{place} is sinking", b: "The isle of {place} has dropped three fathoms since spring. The Lift-Stone Guild of {realm} says it is a seasonal dip.", wait: [3, 8], fx: { unrest: 10 }, next: [{ to: "guild_rescue", w: 1, mods: [["rich", 2], ["theme:lift_guild", 2]] }, { to: "evacuation", w: 1.5 }] },
        guild_rescue: { h: "The guild sells {place} a new heart", b: "For a sum that has emptied the treasury of {realm}, the guild has bolted fresh lift-stone into the isle's root. It holds, for now.", wait: [6, 18], fx: { treasury: -100 }, next: [{ to: "holds", w: 1.5 }, { to: "guild_secret", w: 1, mods: [["learned", 2]] }] },
        evacuation: { h: "Sky-ships evacuate {place}", b: "Every ship in {realm} is ferrying people off {place}. The isle's own folk are tying their dead to kites.", wait: [2, 6], fx: { pop: 0.95 }, next: [{ to: "isle_falls", w: 2 }, { to: "isle_stops", w: 1 }] },
        holds: { h: "The isle of {place} holds its height", b: "With its new heart, {place} rides the sky again. Its people pay the guild's tithe without complaint.", fx: { stability: 4 }, end: true },
        guild_secret: { h: "The guild's ledgers are leaked in {capital}", b: "Ledgers stolen from {official}, the guild's reserves clerk, show the lift-stone will last thirty years at most, and the guild has known for a century.", fx: { stability: -15, unrest: 20 }, end: true },
        isle_falls: { h: "{place} falls into the cloud", b: "The isle slipped into the cloud floor at dawn without a sound. Those watching from the ships say the cloud closed over it like water.", fx: { abandon_town: true, prestige: -5 }, end: true },
        isle_stops: { h: "{place} stops sinking, and a rope rises", b: "The isle stopped a fathom above the clouds. That night a rope came up from below and tied itself to the old harbour post.", fx: { flag: "rope", science: { natural_philosophy: 0.6 } }, end: true },
      } },
    { id: "ss_storm_gap", n: "The Gap in the Storm Wall", scale: "realm", anchor: "coast", w: 1, req: ["sky_isles", "has:port"],
      stages: {
        start: { h: "A gap opens in the storm wall off {place}", b: "For the first time in recorded history, the lightning wall beyond {place} has a hole in it, and there is blue sky beyond.", wait: [2, 5], next: [{ to: "voyage", w: 1.5 }, { to: "pirates_first", w: 1, mods: [["theme:wind_pirates", 3]] }] },
        voyage: { h: "{person} sails through the storm gap", b: "With the blessing of {ruler}, {person} took a sky-ship through the gap. The crew sang until the thunder drowned them out.", wait: [4, 12], next: [{ to: "new_isles", w: 1 }, { to: "burning_core", w: 1 }] },
        pirates_first: { h: "Wind pirates race through the gap", b: "The free captains were through the gap before the crown's ships had left the harbour of {place}.", wait: [4, 10], fx: { prestige: -4 }, next: [{ to: "new_isles", w: 1 }, { to: "gap_closes", w: 1 }] },
        new_isles: { h: "New isles found beyond the storm", b: "Beyond the wall lie more isles: green, inhabited, and astonished to see us. {realm} has its first envoy to a people it never knew existed.", fx: { discovery: "navigation", prestige: 12 }, end: true },
        burning_core: { h: "{person} returns with a tale of fire", b: "Beyond the wall the sky slopes downward to a red glow, and the isles there are burnt black. {person} will not go again, and has taken holy orders.", fx: { stability: -5, science: { astronomy: 0.7 } }, end: true },
        gap_closes: { h: "The storm gap closes", b: "The lightning wall sealed itself without warning. Two pirate ships and their crews are on the other side, for good.", fx: { stability: 2 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "Admiralty primer for midshipmen", text: "From the Admiralty primer for new midshipmen, {year} edition, page 1: 'The isles float by lift-stone, which rises as other stone falls. A piece the size of a fist will hold up a grown man. Below the isles lies the cloud floor, and below that, nothing that concerns a sailor. Midshipmen who drop tools over the side will pay for them out of their wages.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a net-mender of {place}", text: "A net-mender of {place}, talking to a visiting tax clerk, {year}: 'Every low-isle mother tells her children not to lean over the edge, or the cloud will think you're offering yourself. My sister leaned out at nine to cut a kite free. The cloud came up the rock like milk boiling over, a whole fathom, then sank back. We still tell the children.'" },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "captain of the free ship Kestrel's Due", text: "Log of the free ship Kestrel's Due, {year}, kept by its captain: 'Lowered the diving bell forty fathoms under the cloud floor on a stolen Admiralty cable. At twenty it went dark. At thirty-five the glass went green. The bell-man came up white and swore a shape longer than our ship passed under twice. Sold the cable at {place} for 60 crowns.'" },

    { depth: "core", about: "truth:lifted", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:raising_engine", who: "bronze plate, read by {investigator}", text: "Bronze plate on the raising engine in the root of {lead}, read by {investigator} in {year}: 'Lifted in the year of the waters by order of the eleven high houses. Towns below to be abandoned: Orra, Silt Cross, Brannock and twenty-six more. May they forgive us.' All 29 names run down the plate in a careful hand. No isle has a town by any of those names." },
    { depth: "core", about: "truth:lifted", source: "person", bias: "true", reliable: "partial", points: "site:hanging_rope", who: "a letter from below", text: "Letter found in a bundle on the rope that hangs below {lead}, {year}, wrapped round a loaf and a carved wooden horse. It is in an old form of our own tongue: 'We are still here. The water went down four lifetimes ago and we have fields again. Are you still angry with us? Pull twice if you are not.' Somebody pulled twice. Nothing has come up since." },
    { depth: "core", about: "truth:lifted", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, heart-cult priest", text: "Hymn sung at the Raising Feast in the temple of {place}, copied by {believer}, {year}: 'The gods lifted the worthy into the sky, and left the wicked to the waters, and the waters took them.' {believer} adds a note: during the hymn, 29 candles are put out one by one, and nobody in the temple remembers why there are 29." },
    { depth: "core", about: "truth:lifted", source: "library", bias: "official", reliable: false, who: "Admiralty circular 14", text: "Admiralty circular 14, sent from {place} in {year} to every master and harbour-warden: 'The isles have floated since the making of the world. No ground has ever existed below them. The so-called rope-folk are a sailors' fable. Any person who lowers cargo, livestock or persons on a rope will be fined 20 crowns per length of rope.'" },
    { depth: "core", about: "truth:lifted", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, ferry-keeper", text: "Petition of {survivor}, ferry-keeper of {place}, to the Admiralty court, {year}: 'My son Tam went down the rope on his fourteenth birthday to see who sends the bread. He took a lamp and food for two days. That night the rope was cut from below, cleanly. I ask the court to send a diving bell after him.' The court fined {survivor} 20 crowns for lowering a person on a rope." },

    { depth: "core", about: "truth:broken", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:underside_ruins", who: "{investigator}, Admiralty bell-master", text: "Survey notes of {investigator}, fifth and lowest underside hall at {lead}, {year}: 'The mural is 40 paces wide. A round world, cracked like an egg, with pieces flying out into the dark and tiny houses on each piece. At the centre, small figures lower buckets on chains into the red. The caption under it is plain: We dug for warmth, and the world opened. This is a record, not a myth.'" },
    { depth: "core", about: "truth:broken", source: "archive", bias: "true", reliable: "partial", points: "archive", who: "{investigator}, Admiralty bell-master", text: "Memorandum of {investigator} to the Admiralty board, {year}: 'I have compared the star-tables in 300 years of logbooks. Every isle drifts in a slow spiral around a point below the cloud floor, and every spiral is tighter than the last. At this rate the lowest isles reach the centre in 600 years.' The tables are kept at {lead}, filed under instrument error." },
    { depth: "core", about: "truth:broken", source: "heretic", bias: "exaggerated", reliable: "partial", points: "site:up_wind", who: "a low-isle preacher, as taken down by a constable", text: "Shouted from the Admiralty steps in {place} by a low-isle preacher, {year}, and taken down by the constable on duty: 'The red glow below is the old world's fire, and we fall back into it a fathom a year! Stand in the upward wind at {lead} and smell it for yourselves!' The preacher was charged with obstructing a public stair for 2 hours. The wind was not discussed." },
    { depth: "core", about: "truth:broken", source: "library", bias: "official", reliable: false, who: "The Navigator's Companion", text: "From The Navigator's Companion, Admiralty press, {year}, chapter 3: 'The red glow seen beneath the storm wall is sunset reflected off the cloud floor, as any competent navigator can explain. It is seen at midnight because the cloud holds light the way a warm stone holds heat. Navigators who log it as fire will be sent for an eye test at their own expense.'" },
    { depth: "core", about: "truth:broken", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, ferry-keeper", text: "Letter from {survivor}, ferry-keeper of {place}, to a cousin on a high isle, {year}: 'The upward wind came early this year, and hotter. It burned the barley on the low terraces and took the skin off Wenna's hands where she held the gate shut. She is 11. The priest says the fire below gets nearer every year. I have stopped arguing with the priest.'" },

    { depth: "core", about: "truth:sky_sea", source: "person", bias: "true", reliable: true, plain: true, who: "a guild miner, to {believer}", text: "Confession of a guild miner, heard by {believer} at the heart-shrine of {place}, {year}: 'The deep stone has roots. Below 300 feet the lift-stone sends white roots down through the rock toward the cloud. We cut them and they bleed. The guild calls it sap and pays us double to keep quiet. The roots are pulling the isle down. I have felt one tug the pick out of my hands.'" },
    { depth: "core", about: "truth:sky_sea", source: "oral", bias: "true", reliable: "partial", points: "cast:investigator", who: "an old cloud-diver of {place}", text: "An old cloud-diver in a harbour tavern at {place}, {year}, talking for the price of 2 drinks: 'The floor is not cloud once you are in it. It is warm and thick as soup, and it pulls you down. I went in on a 90-fathom line and they hauled me up with my boots gone. Ask the Admiralty's bell-master, {investigator}, who went deeper. You'll find the bell-master at {lead}.'" },
    { depth: "core", about: "truth:sky_sea", source: "temple", bias: "pious", reliable: "partial", points: "site:lowest_isle", who: "{believer}, heart-cult priest", text: "Sermon of {believer}, priest of the lift-heart at {place}, Harvest Day {year}: 'Each isle's lift-heart is a sleeping god. Every year our heart grows a finger's width, and we give thanks. One day all the gods will go home together, down to the warm place they came from, and carry us with them. Do not weep for the isle at {lead}, already up to its knees in cloud. It is going home first.'" },
    { depth: "core", about: "truth:sky_sea", source: "archive", bias: "official", reliable: false, points: "archive", who: "{official}, guild reserves clerk", text: "Guild survey of the deep seams, signed by {official}, reserves clerk, {year}: 'Lift-stone is ample for a thousand years. Reports of roots in seams below 300 feet describe ordinary mineral veins. Reports of bleeding describe groundwater. Miners spreading these stories will lose the deep-seam bonus of 4 crowns a week.' The survey is bound with the guild accounts at {lead}." },
    { depth: "core", about: "truth:sky_sea", source: "archive", bias: "true", reliable: "partial", cost: true, who: "guild injury book, in {official}'s hand", text: "Guild injury book of {place}, {year}, in the hand of {official}: 'Miner Joss Arden, 23, lost at 340 feet. A root took hold of the ankle chain and drew the miner down into the seam before the crew could cut it. Widow paid 30 crowns, on condition of silence.' In the margin, in a different hand, someone has written: 'That is the fourth this year.'" },

    { depth: "sub", about: "sub:lift_guild", source: "archive", bias: "redacted", reliable: "partial", points: "heretic", who: "guild reserves ledger, kept by {official}", text: "Guild reserves ledger, {year}, page 212, kept by {official}: 'Reserves this year: [scratched out]. Ten years prior: [scratched out]. Forty years prior: [scratched out]. Recommend silence.' The scratching on the oldest line is in brown ink a century old. A loose slip says one clean copy was stolen, and is now read aloud by heretics at {lead}." },
    { depth: "sub", about: "sub:altitude_caste", source: "person", bias: "true", reliable: true, who: "a low-isle girl of 15", text: "Diary of a low-isle girl of 15, sent up to the high court at {place} on a one-day pass, {year}: 'Pass stamped 4 times before the gate. They have trees up there. Real ones, with apples. Nobody stopped to talk to me, and they looked at my shoes the whole time. I had polished them with lard. I will never tell Mam they could smell it.'" },
    { depth: "sub", about: "sub:wind_pirates", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a wool merchant held on the free wind", text: "Account of a wool merchant held hostage on the free wind out of {place}, {year}: 'The captain wanted 80 crowns or my eldest. Over supper the captain told me the wind belongs to whoever can hold it, and that the crown held it for a hundred years without asking anybody either. I paid. The supper, I admit, was good.'" },
    { depth: "sub", about: "sub:sinking_isle", source: "library", bias: "propaganda", reliable: false, who: "proclamation of the crown of {realm}", text: "Proclamation posted in {place} by order of the crown of {realm}, {year}: 'No isle of {realm} is sinking. The isle of {place} is undergoing a gentle, seasonal settling of 3 fathoms. Citizens are reminded that selling roof-beams and furniture to sky-ship captains is unpatriotic, and is now taxed at one third of the price.'" },
    { depth: "sub", about: "sub:climbers_below", source: "oral", bias: "garbled", reliable: "partial", points: "site:hanging_rope", who: "a shepherd of {place}, to {investigator}", text: "A shepherd on the lowest terrace of {place}, talking to {investigator} in {year}: 'They climb at night so as not to be seen. Five of them last month, up the rope at {lead}. Green on their skin, and they smell of rain. They don't take anything. They look at the houses and touch the doors and go back down. One left a clay cup on my step. I use it.'" },
    { depth: "sub", about: "sub:returned_ship", source: "archive", bias: "true", reliable: "partial", who: "harbour-warden's log, {place}", text: "Harbour-warden's log, {place}, {year}: 'The Patient Gull came up out of the cloud floor at dawn, ten years after it dived. Hull crusted with grey coral 3 inches thick. 14 of 22 crew aboard, all alive, all ten years older. In the hold: wheat, in sacks stamped with a crest none of us know. The crew will speak only to the Admiralty bell-master, {investigator}.'" },

    { depth: "site", about: "site:hanging_rope", source: "person", bias: "true", reliable: "partial", who: "the headwoman of {place}", text: "The headwoman of {place}, to an Admiralty clerk, {year}: 'Every year on the same night we lower a loaf on the rope. Every year it comes back up with a toy: a horse, a boat, a doll with a cloth face. There are 31 of them on the shelf in the meeting hall. We do not know who started it. We are not going to be the ones who stop.'" },
    { depth: "site", about: "site:up_wind", source: "traveller", bias: "true", reliable: "partial", points: "site:underside_ruins", who: "a curio dealer of {place}", text: "Price list of a curio dealer at {place}, {year}, pinned in the shop window: 'Wind-glass, black, by the ounce: 1 crown. Charred bean, the kind no isle grows: 3 for a crown. Painted pot-shard from the hot wind, flat-ground scene, very rare: 40 crowns, no haggling. Buyers who want more of the same scene are referred to the painted walls at {lead}. The dealer accepts no responsibility for the climb.'" },
  ],
};
