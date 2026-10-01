// The Inner Sun: the world is a hollow shell, with a small sun and a second world inside.
export default {
  id: "inner_sun",
  name: "The Inner Sun",
  kind: "shape",
  family: "world",
  pitch: "The world is hollow. Through the polar whirlpools and the deepest caves lies an inner world lit by a small red sun, and its people say the surface was once theirs.",
  slots: ["world-shape", "history-secret"],
  tone: ["wonder", "mythic"],
  era: ["bronze", "medieval", "renaissance", "industrial"],
  scale: "world",
  genres: ["fantasy", "mythic", "flintlock"],
  w: 1,
  excludes: [],
  pairs: [{ id: "downward_throat", w: 3 }, { id: "elder_lattice", w: 2 }, { id: "walking_mountains", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a mapmaker expelled from the academy for proving that the horizon of a deep valley curves upward", home: "mountain", stance: "Wants the concave charts accepted; believes we are standing on the inside of something, and wants to know what." },
    { role: "official", n: "the crown's chancellor, who keeps the council minutes and the only key to the hall of the red chair", home: "capital", stance: "Wants the realm prosperous and the guest's advice followed quietly; believes it does not matter whose advice it is if it works." },
    { role: "believer", n: "a priest of the mountain temples who prays with the forehead on the floor", home: "border", stance: "Believes the Mother below is real and is owed an apology, and that the pale refugees are her children." },
    { role: "survivor", n: "a whaler who rode the polar maelstrom down and came home two years later through a mountain cave", home: "coast", stance: "Wants to go back down; will not say what the inner people asked in return for the way home." },
  ],

  truths: [
    { id: "original_world", n: "The inside came first", d: "The inner world is the first home of every people; the surface was settled by exiles who climbed the thousand-league stair to escape a sun that burned them. The inner sun is now dying and cooling, and its peoples will need the surface back. The pale refugees are the first of them, and the surface crowns are already sealing the caves.", tags: ["truth:inner_first"],
      known: [
        "Starving pale folk have begun climbing out of the deep caves, saying the light below is failing. The royal chronicles say every surface people arose where it now lives. The mountain temples pray facing the floor.",
        "A caged beast from the warm pole, known only from fossils, sleeps with its face to the floor and is dying under the open sky. {investigator} found that the great stair was worn by feet climbing up, not going down.",
        "Waystations on the stair carry carvings of families climbing away from a setting red sun. A refugee elder says our ancestors left because the inner sun burned them, and that it is now too cold to burn anyone.",
        "Confirmed: the inner world is the first home of every people, and the surface was settled by its exiles. The inner sun is dying, and its peoples need the surface back. The refugees are the first, and the crowns are already sealing the caves.",
      ] },
    { id: "egg", n: "The world is an egg", d: "The inner sun is not a sun but an embryo, and the world is its shell. It grows warmer every century; the same well is twenty degrees warmer than it was three hundred years ago. When it hatches, the shell will break, and the crown's sunstone miners are cutting deepest in the places where the shell is already thinnest.", tags: ["truth:world_egg"],
      known: [
        "Wells grow warmer every decade and hot springs are spreading. The academy calls it a passing irregularity of underground springs. A new crater shows red light below it, and a sky curving upward.",
        "Well-keepers' records show the same well at the same depth twenty degrees warmer than three hundred years ago. In the uplit cave, a red light pulses about once a minute, and the pulse is quickening.",
        "Under the uplit cave the rock is thin as eggshell and warm, with a veined membrane beneath it. A sunstone miner reports that when you tap the rock, something taps back.",
        "Confirmed: the inner sun is an embryo and the world is its shell. It grows warmer every century, and when it hatches the shell breaks. The crown licenses sunstone mining in the thinnest places of the shell.",
      ] },
    { id: "hidden_kingdom", n: "The hidden kingdom steers us", d: "An ancient, patient civilisation under the inner sun has steered surface history for millennia through emissaries, prophets and well-timed gifts. Our great turning points were theirs: the guest in the red chair has advised the royal council for centuries through a crystal speaking-tube, and the chancellors who keep its minutes have always known.", tags: ["truth:inner_kingdom"],
      known: [
        "A tall, sun-pale emissary has come to court with red crystal and excellent advice, and everyone who takes it prospers. The palace chaplain says the empty red chair of the council is a memorial to the founding king.",
        "Council minutes record 'the guest' advising the crown against a war and for a marriage; two pages are removed. The most famous prophet of the age vanished as a child for seven years and came back with red dust in the hair.",
        "Under the red chair a shaft goes straight down to a speaking-tube of red crystal. A letter found on a dead courtier reports the prophet's teachings to a Council of the Sun.",
        "Confirmed: a patient civilisation under the inner sun has steered surface history for millennia through emissaries, prophets and the red chair. The great turning points were theirs, and the chancellors who keep the minutes have always known.",
      ] },
  ],

  tags: ["hollow_world"],

  subthemes: [
    { id: "polar_race", n: "The Race to the Warm Pole", d: "Beyond the northern ice lies open water and warm air, the expeditions say. Two crowns are racing to plant a flag on the lip of the maelstrom.", w: 1.3, req: { any: ["cold", "coastal", "has:port"] }, mods: [["navy", 2], ["prestigious", 1.3]], tags: ["theme:polar_race"], mark: { kind: "zone", n: "The warm ice", color: "#8ab0a8", size: [1, 3], where: "remote" } },
    { id: "living_specimen", n: "The Living Fossil", d: "A polar expedition brought back a creature known only from fossils, alive, in a cage. It is slowly dying, and its keepers think the open sky is killing it.", w: 1, req: { any: ["scholarly", "academies", "urbane"] }, truthLink: "original_world", tags: ["theme:living_specimen"] },
    { id: "deep_holds", n: "The Deep Holds", d: "Crust-kingdoms deep in the mountains control the long stairs down. They tax every traveller and map no route for outsiders.", w: 1.3, req: { any: ["mountain", "mountain_folk", "hills"] }, mods: [["insular", 1.5]], tags: ["theme:deep_holds"] },
    { id: "inner_emissary", n: "The Emissary from Below", d: "A tall, sun-pale stranger has arrived at court with gifts of red crystal and excellent advice. Everyone who takes the advice prospers.", w: 0.8, req: { any: ["has:city", "monarchy"] }, truthLink: "hidden_kingdom", tags: ["theme:inner_emissary"] },
    { id: "refugees_below", n: "The Pale Refugees", d: "Families of pale, large-eyed folk have begun climbing out of the deep caves, starving, saying the light below is failing.", w: 0.9, req: { any: ["mountain", "hills", "near:rift"] }, truthLink: "original_world", tags: ["theme:refugees_below"] },
    { id: "raised_prophet", n: "The Prophet Raised Below", d: "The most famous prophet of the age vanished for seven years as a child. A cave-guide swears he led the boy down, and that someone else brought him back.", w: 0.8, req: { any: ["pious", "zealous", "mystic"] }, truthLink: "hidden_kingdom", tags: ["theme:raised_prophet"] },
    { id: "crust_revolt", n: "The Crust Revolt", d: "The cave peoples who live in the crust have risen against the surface mines that poison their air shafts.", w: 1, req: { any: ["mountain", "artisans"] }, mods: [["harsh_law", 1.5]], tags: ["theme:crust_revolt"] },
    { id: "skylight_crater", n: "The Skylight Crater", d: "A new crater has opened in the hills. At its bottom, through a ragged hole, is red light, and a sky curving upward.", w: 0.6, truthLink: "egg", tags: ["theme:skylight_crater"], mark: { kind: "zone", n: "The skylight", color: "#a0402a", size: [1, 1], where: "remote" } },
    { id: "upward_horizon", n: "The Upward Horizon", d: "A mapmaker in a cave valley proved the horizon there curves up, not down. The academy expelled the mapmaker, and the guild of guides hired the mapmaker the same week.", w: 0.8, req: { any: ["scholarly", "faith:philosophy", "academies"] }, tags: ["theme:upward_horizon"] },
    { id: "warming_deep", n: "The Warming Deep", d: "Wells grow warmer every decade, and the hot springs are spreading. The temple says the gods are pleased; the miners say the floor is too hot to stand on.", w: 0.9, req: { any: ["mountain", "hot", "near:volcano"] }, truthLink: "egg", tags: ["theme:warming_deep"] },
  ],

  sites: [
    { id: "pole_maelstrom", n: "The Maelstrom of $", kind: "wonder", where: "remote", d: "A vast whirlpool beyond the ice, ringed by a graveyard of ships.",
      layers: {
        surface: { n: "The ring of wrecks", text: "Beyond the northern ice a ring of wrecked ships lies frozen around open, steaming water. Whalers counted 63 hulls in {year}. The newest still flies the flag of the last polar society, and its stores are untouched." },
        study: { n: "No drain", text: "The water spirals down without draining or rising. Birds fly into the steam and do not come out. {investigator} timed a floating barrel: one full turn of the spiral took forty minutes, and the barrel never came round again." },
        dig: { n: "The long fall", text: "One wreck's log describes 'the long fall, then the sea curving up on every side, and a red sun in the middle'. It is signed by a whaler who later turned up alive, and now lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "A mouth", text: "The pole is a mouth into the world's hollow, and ships have gone in and lived. The polar societies of two crowns know it. They race for the flag because the first crown to plant it will claim the only sea road to the world inside." },
      } },
    { id: "uplit_cave", n: "The Uplit Cave of $", kind: "anomaly", where: "mountain", truthLink: "egg", d: "A cave where red light shines up from below.",
      layers: {
        surface: { n: "Fire without fire", text: "Shepherds near {place} warm themselves in winter in a cave lit by a red glow with no fire. They pay the landowner 2 coppers a night. Their dogs will not come in, and sleep at the mouth." },
        study: { n: "The pulse", text: "The light rises from a crack in the floor and pulses slowly, about once a minute. {investigator} timed it over twelve winters: the pulse is quicker now by four beats an hour than it was at the start." },
        dig: { n: "The shell", text: "Deep in the fissure the rock is thin as eggshell and warm, and a membrane lies beneath it, veined and moving. Sunstone miners have been cutting through this layer for ten years; their licence is filed at {lead}.", points: "archive" },
        revelation: { n: "The heartbeat", text: "The world's shell is thin here, and the creature inside it is growing; its heartbeat is the pulse. When it hatches, the shell breaks. The crown licenses sunstone mining at 40 silver a seam, and the richest seams are the thinnest places in the shell." },
      } },
    { id: "thousand_stair", n: "The Thousand-League Stair of $", kind: "ruin", where: "mountain", truthLink: "original_world", d: "A stair carved through the crust, worn by the feet of a whole people going up.",
      layers: {
        surface: { n: "The guides' shrine", text: "A cave-guides' shrine stands at the head of a stair near {place} that goes down past any lantern's reach. Guides take travellers down for 5 silver a day. None will go past the ninth waystation." },
        study: { n: "Worn going up", text: "The steps are worn hollow in the middle. {investigator} examined the wear on 300 steps: the deepest scuffing is on the front edges, as feet make when climbing. The stair was climbed, not descended, by a whole people." },
        dig: { n: "The waystations", text: "Every few miles stands a waystation, carved with a red sun setting behind families climbing away from it. The cave-guides' oldest map of the stations hangs in the Stairhold at {lead}.", points: "sub:deep_holds" },
        revelation: { n: "Our exile", text: "We came up these stairs. The surface was our exile, not our home, and the founding chronicles that say otherwise were written by the exiles' grandchildren. The pale refugees climbing up now use the same steps, and the deep holds charge them the toll." },
      } },
    { id: "living_fossils", n: "The Fossil Beds of $", kind: "dig", where: "any", d: "Fossils of creatures that the polar expeditions have seen alive.",
      layers: {
        surface: { n: "Claws for sale", text: "Bone-diggers at the cliffs near {place} sell giant claws and teeth from the rock, a silver a tooth. The best pieces go to the academy, which displays them as the beasts of a lost age." },
        study: { n: "Drawn from life", text: "The same beasts appear in expedition sketches from the warm pole, drawn from life, with notes on their colour and smell. {investigator} matched nine of the academy's fossils to living animals in those sketches." },
        dig: { n: "The crystal in the palm", text: "In the deepest bed lie the bones of a man-sized creature with a red crystal pressed into its palm. It is the same sunstone the emissary from below gave the crown. A sample was sent to {lead}.", points: "library" },
        revelation: { n: "The surface lost them", text: "The inner world never lost its beasts. The surface did, when the exiles climbed out and the cold killed what they had brought. The academy has known for forty years, and still labels the cases extinct, because extinct sells more tickets." },
      } },
    { id: "council_hall", n: "The Hall of Patient Counsel at $", kind: "shrine", where: "capital", truthLink: "hidden_kingdom", d: "An old council chamber with a chair no one may sit in.",
      layers: {
        surface: { n: "The red chair", text: "A palace hall in {place} holds an empty chair of red stone, honoured since the founding. Nobody may sit in it, on pain of exile. Every great council of the realm has met in this hall, with the chair at the head of the table." },
        study: { n: "The guest", text: "The chair is warm every morning. {investigator} read the council records back 300 years: every great council mentions 'the guest' in that seat, and in 41 cases the crown followed the guest's advice." },
        dig: { n: "The speaking-tube", text: "Beneath the chair a shaft goes straight down, with a speaking-tube of red crystal. The chancellor holds the only key to the trapdoor, and the full minutes of what came up the tube are kept at {lead}.", points: "cast:official" },
        revelation: { n: "Patient counsel", text: "For centuries the inner kingdom has advised the realm's council through this tube, and the chancellors have kept its minutes. Every war avoided, every marriage made and every prophet raised was its choice. The realm has prospered. Nobody has asked what the inner kingdom wants in return." },
      } },
  ],

  beings: [
    { id: "thunder_lizard", n: "Thunder-lizard", kind: "predator", d: "A great beast of the inner jungles, known on the surface only from fossils. Now and then one climbs out of a deep cave and is never forgotten.", danger: 3, biomes: ["rainforest", "swamp", "temprain"], look: { size: 9, group: [1, 2], move: "solo", speed: 20, col: "#4a5a3a", col2: "#a08050", body: "reptile", active: "day", visible: true } },
    { id: "cave_folk", n: "Crust-folk", kind: "beast", d: "Pale, quiet cave-dwellers with large eyes who trade crystal for salt and avoid the sun.", danger: 1, biomes: ["peaks", "alpine", "badlands"], look: { size: 1.3, group: [4, 20], move: "herd", speed: 5, col: "#d8d0c8", col2: "#6a6a7a", body: "biped", active: "night", visible: false } },
    { id: "is_glow_eel", n: "Glow-eel", kind: "small", d: "Luminous eels of the deep cave rivers, sold in jars as lanterns.", danger: 0, biomes: ["river", "swamp"], look: { size: 0.8, group: [3, 30], move: "school", speed: 4, col: "#80e0c0", col2: "#205040", body: "serpent", active: "any", visible: true } },
  ],

  techs: [
    { id: "is_cave_lamps", n: "Eel-lamps", field: "engineering", level: 1, d: "Jar-lamps of glowing cave eels that never need oil." },
    { id: "is_polar_ships", n: "Ice-hulled ships", field: "navigation", level: 3, d: "Ships built to ride the polar ice and the whirlpool's spiral without breaking." },
    { id: "is_sunstone", n: "Sunstone", field: "alchemy", level: 3, d: "Red crystal from below that holds heat for a year. A fortune in a cold land." },
    { id: "is_deep_charts", n: "Concave charts", field: "astronomy", level: 4, d: "Charts drawn for a world that curves upward, so a traveller below can find their way." },
    { id: "is_seam_crystals", n: "Seam crystals", field: "natural_philosophy", level: 5, d: "Crystals from the place where weight turns over, which fall upward if dropped." },
  ],

  govs: [
    { id: "is_deep_hold", n: "Deep hold", d: "A kingdom of halls and stairs under the mountains, ruled by whoever holds the keys to the way down.", tags: ["gov:deep_hold", "monarchy"], w: 0.5, req: { any: ["mountain", "mountain_folk"] }, forms: ["Deep Hold of $", "The Under-Realm of $", "Stairhold of $"], ruler: "Keeper of the Stair", mods: [["theme:deep_holds", 6], ["insular", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The polar mouth", color: "#2a4a5a", size: [1, 2], count: [1, 2], where: "remote", d: "Steaming open water beyond the ice, spiralling down into the world's hollow." },
    { kind: "zone", n: "The deep stairs", color: "#5a4a3a", size: [1, 2], count: [1, 2], where: "mountain", d: "Cave country where the roads go down and do not stop." },
  ],

  storylines: [
    { id: "is_pole_race", n: "The Flag at the Pole", scale: "realm", anchor: "coast", w: 1.3, req: ["hollow_world", "has:port"],
      stages: {
        start: { h: "{realm} sends a ship to the warm pole", b: "{person} has sailed from {place} for the open water beyond the ice, with a flag, a printing press and three dozen scholars.", wait: [6, 14], fx: { treasury: -60 }, next: [{ to: "into_maelstrom", w: 1 }, { to: "ice_bound", w: 1 }] },
        into_maelstrom: { h: "The ship of {person} rides the maelstrom down", b: "A surviving boat crew watched the ship spiral down into the steaming whirlpool, sails set, cheering.", wait: [8, 20], next: [{ to: "return_inside", w: 1 }, { to: "never_back", w: 1.5 }] },
        ice_bound: { h: "The pole ship is trapped in the ice", b: "Letters by dog-sled say the ship is frozen in, and that the ice around it is warm to the touch and creaking.", wait: [4, 10], fx: { stability: -2 }, next: [{ to: "never_back", w: 1 }, { to: "walk_home", w: 1 }] },
        return_inside: { h: "{person} returns from the world within", b: "Two years later, {person} came home through a cave in the mountains with a red stone, a living beast in a cage and a map where the horizon curves up.", fx: { discovery: "navigation", prestige: 15, flag: "inner_contact" }, end: true },
        never_back: { h: "The pole ship is lost", b: "No word, no wreck. {realm} has raised a memorial in {place} and quietly stopped funding the polar society.", fx: { prestige: -5 }, end: true },
        walk_home: { h: "The pole crew walks home across the ice", b: "Half the crew walked home, frostbitten and raving about a warm wind blowing up out of the ice, smelling of jungle.", fx: { science: { astronomy: 0.5 } }, end: true },
      } },
    { id: "is_pale_exodus", n: "The Pale Exodus", scale: "realm", anchor: "realm", w: 1, req: ["hollow_world", { any: ["mountain", "hills"] }],
      stages: {
        start: { h: "Pale refugees climb out of the caves of {realm}", b: "Starving families with large, pale eyes have come up out of the deep caves near {place}. They say the light below is going out.", wait: [2, 6], fx: { unrest: 8 }, next: [{ to: "welcomed", w: 1, mods: [["hospitable", 2], ["tolerant", 2]] }, { to: "driven_back", w: 1, mods: [["insular", 2], ["zealous", 2], ["harsh_law", 1.5]] }] },
        welcomed: { h: "{realm} takes in the pale folk", b: "{ruler} has granted the pale folk the empty valleys near {place}. They farm by night and teach the children songs about a red sun.", wait: [6, 18], fx: { pop: 1.05 }, next: [{ to: "more_come", w: 1 }, { to: "settled", w: 1.5 }] },
        driven_back: { h: "Soldiers drive the pale folk back underground", b: "The soldiers of {realm} sealed the cave mouths near {place} with fire and stone. The knocking went on for weeks.", wait: [4, 12], fx: { unrest: 10, stability: -3 }, next: [{ to: "they_return", w: 1 }, { to: "silence_below", w: 1 }] },
        more_come: { h: "Thousands rise from below {realm}", b: "Every cave in the mountains of {realm} is spilling pale folk. They are polite, desperate and very many, and they say: 'This was ours first.'", fx: { unrest: 20, stability: -10, flag: "exodus" }, end: true },
        settled: { h: "The pale folk become subjects of {realm}", b: "A generation on, the pale folk of {place} are tax-payers, guides and stone-cutters. Their elders still look down when they pray.", fx: { stability: 4, growth: 0.002 }, end: true },
        they_return: { h: "The pale folk return under arms", b: "They came back up with red-crystal spears and great beasts that the surface knows only as fossils. {place} has fallen.", fx: { abandon_town: true, stability: -12 }, end: true },
        silence_below: { h: "The knocking stops beneath {place}", b: "The knocking has stopped. The cave mouths have been made into a shrine, and nobody in {place} will say for whom.", fx: { stability: 2 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", points: "site:pole_maelstrom", who: "a polar society journal", text: "Expedition journal of the polar society of {place}, printed and sold at 2 silver a copy to raise funds, {year}: 'Beyond the ice the sea was warm as a bath, and the sky above the maelstrom at {lead} was red, as if the sun were shining from beneath. Our thermometer read 31 degrees at noon in the polar winter. Subscribers of 50 silver will have a cape named after them.'" },
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: false, who: "the royal academy", text: "Lecture of the royal academy at {place}, {year}, approved by {official}, chancellor: 'The world is a solid sphere of rock and fire, as the depths of every mine attest. The warm pole is a fable of whalers who drank their stores. The academy has this year expelled one member for teaching otherwise, and reminds the guild of guides that the expelled member's maps are not to be sold.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", points: "site:thousand_stair", who: "a cave-guide", text: "A cave-guide at the head of the stair at {lead}, to a party of travellers, {year}: 'There are people down below who have never seen a star. They think we are the ones living in a cave, with a lid on it. I've met three of them at the ninth waystation. Nice folk. They asked whether our lid ever falls in, and whether we mind the cold.'" },
    { depth: "core", about: "truth:original_world", source: "ruin", bias: "true", reliable: true, plain: true, who: "a carving on the great stair", text: "Carving at the thousandth step of the great stair near {place}, copied by {investigator} in {year}: a long line of people climbing, looking back at a red sun, weeping. The inscription beneath, in the crust-folk script: 'We are leaving our first home, because the sun has grown too hot to bear. Our children will forget this. When it cools, their cousins below will come up after them.'" },
    { depth: "core", about: "truth:original_world", source: "person", bias: "true", reliable: "partial", cost: true, points: "site:thousand_stair", who: "a refugee elder, through a cave-guide", text: "Statement of a refugee elder of the pale folk at the cave mouth of {lead}, {year}, translated by the cave-guide {person}: 'Your ancestors left because our sun burned them. Now it is too cold to burn anyone, and our fields are dark half the day. We would like to come home.' The elder brought 40 families. {person}, who led them up, has been sentenced to two years in the mines for opening the way." },
    { depth: "core", about: "truth:original_world", source: "temple", bias: "pious", reliable: "partial", points: "temple", who: "{believer}, mountain priest", text: "The oldest prayer of the mountain temples, as led by {believer} each new moon, spoken kneeling with the forehead on the floor: 'Mother below, forgive the ones who climbed.' {believer} says nobody knows who the Mother is or who climbed, and that the prayer has been said this way for 900 years. The temple floor at {lead} is worn into hollows where the priests' heads rest." },
    { depth: "core", about: "truth:original_world", source: "library", bias: "official", reliable: false, who: "{official}, chancellor", text: "Chronicle of the founding kings of {realm}, preface, re-issued in {year} under the seal of {official}, chancellor: 'The peoples of the surface arose where they now live, as the chronicles of every founding king plainly record. Tales of a stair up from below are folk nonsense. Copies of the older chronicle, which says otherwise, are to be surrendered for pulping at 1 silver each.'" },
    { depth: "core", about: "truth:egg", source: "archive", bias: "true", reliable: true, plain: true, who: "{investigator}, mapmaker", text: "Well-keepers' book of {place}, two entries compared by {investigator} in {year}: the same well, the same 90-fathom rope, the same kind of thermometer. The entry from three hundred years ago reads 41 degrees; this year's reads 61. A note in {investigator}'s hand: 'It warms from the inside, at the same rate everywhere I have measured. We are not living on a cooling ball. We are living on an egg, and what is in it is alive.'" },
    { depth: "core", about: "truth:egg", source: "heretic", bias: "heretic", reliable: "partial", who: "a watch report", text: "Cry of a cave-prophet in the market of {place}, {year}, as noted by the watch before the arrest: 'The sun below is not a sun! It turns in its sleep! It is waiting to be born, and we are the shell!' The prophet carried a sack of eggshells and threw them at the crowd. The watch fined the prophet 3 silver, for the eggs." },
    { depth: "core", about: "truth:egg", source: "person", bias: "true", reliable: "partial", cost: true, points: "site:uplit_cave", who: "{person}, sunstone miner", text: "Statement of {person}, a sunstone miner at the uplit cave near {lead}, to the mine's owner, {year}: 'The rock rings like a bell when you tap it. And when you stop, something taps back. Yesterday my pick went through and came back warm and wet, and the light pulsed twice as fast for an hour. My arm is burned red to the elbow. I want my wages, and I want to leave.'" },
    { depth: "core", about: "truth:egg", source: "library", bias: "official", reliable: false, who: "{official}, chancellor", text: "Report of the academy to the crown, {year}, countersigned by {official}, chancellor: 'The warming of the deep wells is a passing irregularity of underground springs, and gives no cause for alarm. Sunstone mining at the uplit cave may continue at the present rate of 30 seams a year. The miner's burn was caused by careless handling of a lamp.'" },
    { depth: "core", about: "truth:hidden_kingdom", source: "archive", bias: "redacted", reliable: "partial", points: "site:council_hall", who: "council minutes", text: "Council minutes of {realm}, ninety years ago, copied by {investigator} in {year}: 'The guest advised against the war. The crown deferred. [Two pages removed.] The guest advised the marriage. The crown agreed.' The minutes were taken in the hall of the red chair at {lead}. Of the nine councillors present, none ever wrote down who the guest was." },
    { depth: "core", about: "truth:hidden_kingdom", source: "traveller", bias: "exaggerated", reliable: "partial", who: "{survivor}, whaler", text: "Account given by {survivor}, whaler, to the polar society at {place}, {year}, two years after the ship went down the maelstrom: 'Under the red sun there is a city of white towers where nobody hurries. They knew my name, and my mother's, and the name of the ship. They fed us for a year and then walked us up a stair to a cave in our own mountains. They asked one favour. I won't say what.'" },
    { depth: "core", about: "truth:hidden_kingdom", source: "heretic", bias: "true", reliable: true, plain: true, who: "a letter on a dead courtier", text: "Letter found sewn into the coat of a dead courtier at {place}, {year}, in a fine hand on red-tinted paper: 'The prophet's teachings have taken. The surface will be calmer for a century, as the Council of the Sun intended when we raised the child below. The chair reports that the crown will follow us on the harbour treaty. Report as usual.' The courtier had served the crown for 30 years." },
    { depth: "core", about: "truth:hidden_kingdom", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "the chancellor's register", text: "Register of the chancellor's office, {year}, in {official}'s hand: 'Councillor {person} moved that the red chair be removed and the shaft beneath it filled. Motion lost, eight to one. Councillor {person} was found a week later at the foot of a cellar stair, neck broken. The guest sent condolences, and a red stone for the family.' The next line is the guest's advice on the grain tax." },
    { depth: "core", about: "truth:hidden_kingdom", source: "temple", bias: "official", reliable: false, who: "the palace chaplain", text: "Answer of the palace chaplain to a petition, {year}, endorsed by {official}, chancellor: 'The empty red chair of the council is a memorial to the founding king, and is kept vacant out of piety alone. It is warm because it stands above the kitchens. The petitioner, a palace sweeper, is dismissed with 10 silver for a misunderstanding.'" },
    { depth: "sub", about: "sub:deep_holds", source: "archive", bias: "official", reliable: "partial", who: "the Stairhold toll-roll", text: "Toll-roll of the Stairhold, kept by the clerk of the Keeper of the Stair, {year}: 'Surface travellers gone down: forty. Toll at 5 silver a head: paid. Returned up: thirty-one. Remainder, nine, detained below at their own request. Their mules and goods are held at the toll-house against their return, and will be sold after seven years.'" },
    { depth: "sub", about: "sub:living_specimen", source: "person", bias: "true", reliable: true, points: "site:living_fossils", who: "the beast's keeper", text: "Notes of the keeper of the caged beast at the academy of {place}, {year}: 'Day 212. The beast sleeps with its face to the floor, always, whichever way I turn the cage. It eats less every week; the open sky seems to be killing it. When it dies, I think it will be facing home. Its claws match the ones the bone-diggers sell from the cliffs at {lead}.'" },
    { depth: "sub", about: "sub:upward_horizon", source: "heretic", bias: "true", reliable: true, points: "cast:investigator", who: "{investigator}, mapmaker", text: "Notes of {investigator}, mapmaker, written the week of the expulsion from the academy, {year}: 'Measured three times with a water-level, from three stations a mile apart. The horizon of the deep valley rises, a hand's width at a mile. We are standing on the inside of something. The guild of guides has offered me 20 silver a month to draw their charts, at their chart house in {lead}. I accept.'" },
    { depth: "sub", about: "sub:polar_race", source: "library", bias: "propaganda", reliable: false, who: "the gazette of {realm}", text: "Gazette of {realm}, {year}: 'The glorious expedition of {realm} reached the pole first, and found it a frozen waste, as all serious scholars predicted. The flag was planted on solid ice at noon. The expedition regrets the loss of its second ship, the larger one, which was carried off by a current that does not exist.'" },
    { depth: "sub", about: "sub:raised_prophet", source: "oral", bias: "garbled", reliable: "partial", points: "oral", who: "the prophet's mother", text: "Said by the prophet's mother to a pilgrim at the door in {place}, {year}, for a coin: 'Seven years gone, from the age of six. He came back taller, with red dust in his hair that never washed out, and he called me little one. The cave-guide who took him down still lives at {lead}, and still won't look me in the eye.'" },
    { depth: "site", about: "site:pole_maelstrom", source: "traveller", bias: "garbled", reliable: "partial", who: "a cabin boy of the lost pole ship", text: "Told by a cabin boy of the lost pole ship, found raving in a mountain village near {place} in {year}: 'We fell for a day and a night. Then the sea was above us and below us, and a small red sun hung in the middle, and the ship's cat would not stop crying. The captain said a prayer for the 36 of us. Then we saw the towers.'" },
    { depth: "site", about: "site:council_hall", source: "person", bias: "redacted", reliable: "partial", who: "a palace sweeper", text: "A palace sweeper of {place}, talking to a fishmonger in {year}: 'Nobody sits in the red chair. But it's warm every morning, and there's red dust under it, and I'm paid 10 silver a year extra not to mention it. Twice I've heard talking under the floor, polite as a bishop. I sweep round it now.'" },
  ],
};
