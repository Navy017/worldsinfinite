// The Wheel of Suns: the world has ended and been remade many times, each age shorter and dimmer, and this one is nearly done.
export default {
  id: "wheel_of_suns",
  name: "The Wheel of Suns",
  family: "world",
  kind: "cycle",
  pitch: "The world has ended and been rebuilt many times, each time under a new sun. Every age has been shorter and dimmer than the last, and the calendar-priests' count says this sun is nearly used up.",
  slots: ["apocalypse", "time", "history-secret"],
  tone: ["mythic", "melancholy"],
  era: ["stone", "bronze", "medieval", "renaissance"],
  scale: "world",
  genres: ["fantasy", "mythic", "grimdark"],
  w: 1,
  excludes: ["falling_hour"],
  pairs: [{ id: "elder_lattice", w: 3 }, { id: "last_kindling", w: 2 }, { id: "long_dark", w: 2 }, { id: "unremembering", w: 1.5 }, { id: "body_of_the_world", w: 1.2 }],

  cast: [
    { role: "investigator", n: "a reckoner of the Count's college who recomputes the great count from the oldest stones", home: "inner", stance: "Believes the numbers can be got right, and that a right number is worth more than a comforting one." },
    { role: "official", n: "secretary to the high reckoner, who posts the count in the markets", home: "capital", stance: "Holds that the people need one count, posted and certain, and that doubts are for the college to keep." },
    { role: "believer", n: "a priest of the sun-stair who leads the dawn rites", home: "desert", stance: "Is certain the rites hold the sun on its wheel, and that every missed rite brings the end nearer." },
    { role: "survivor", n: "a stonefolk elder who lived through the end of the last sun", home: "mountain", stance: "Has seen an age end once and wants this one to build arks instead of temples." },
  ],

  truths: [
    { id: "natural_wheel", n: "The wheel cannot be stopped", d: "The turning of the ages is the law of the world, as sure as tides. Each sun is smaller than the last and nothing can halt the ending; the only work that matters is carrying seed, knowledge and people across it. The last age did exactly that, and everyone alive descends from its 400 ark survivors. The Count's priests spend on rites what should go into arks.", tags: ["truth:natural_wheel"],
      known: [
        "The Count teaches that eight suns have burned out, each smaller than the last, and that the rites hold this ninth one on its wheel. The crown's historians say the ages are a poet's device.",
        "A sealed bronze vault in the mountains carries a manifest of seed, tools, songs and 400 names, and a plain carving: go down so the next sun has hands to plant with. Its beds are empty and made.",
        "Many of the 400 names on the ark door are still common in the realm, and 4 belong to ruling houses. The stonefolk say their own age ended exactly the way this one is ending.",
        "Confirmed: the ages end by law, and nothing stops them. The last age survived by its ark, and this one descends from it. The only question is whether this age builds arks or temples.",
      ] },
    { id: "harvest", n: "Each age is harvested", d: "The endings are not natural. A power beyond the sky waits for each age to reach its height, then takes its greatest works whole, burns the rest and leaves just enough people to start again. Eight ages have been reaped at their peak. This ninth age's towers are the tallest yet, and its crowns are competing to build higher.", tags: ["truth:age_harvest"],
      known: [
        "A river cliff shows the same city eight times over, one on another under the present town, each sealed under a black line of ash. The crown says the layers are ordinary fires and floods.",
        "In every layer the great works are missing: towers cut off in clean stumps, libraries emptied, while cheap houses were left to burn. A cellar wall says lights came down and took the towers.",
        "In the deep desert lies a plain of 70 pits shaped like tower footings, where nothing grows and camels will not cross. Every ending in the strata came when its age was at its greatest.",
        "Confirmed: a power from beyond the sky harvests each age at its peak, takes its best works whole and burns the rest. Eight ages have been reaped. The towers of this age are the tallest it has ever built.",
      ] },
    { id: "broken_wheel", n: "Someone keeps turning it", d: "The wheel was meant to stop at the fourth sun. The star called the Hub was its keeper, and it has restarted the wheel at every ending since, because it fears what would happen if the cycle ever stopped. In the eighth sun the wheel grew too heavy to turn from the sky, and the Hub came down to turn it by hand beneath the great observatory. Every restart gives a smaller sun and a shorter age. The high reckoners of the eighth sun struck its descent from the logs, and their successors keep the stair locked.", tags: ["truth:broken_wheel"],
      known: [
        "Old star charts in 14 languages show a bright star called the Hub where there is now empty sky. The temple says the charts are the work of drunken copyists.",
        "An observatory log of the eighth sun records that the Hub left the sky, and that the high reckoner forbade anyone to note it. A calendar stone asks why the count did not end at the fourth sun.",
        "The great observatory's stair goes down, 900 steps, to a warm stone wheel on a bronze axle. Wheel-breakers who heard it say it groans like something old being made to work.",
        "Confirmed: the wheel should have stopped long ago. Its keeper turns it by hand under the observatory, and each turn gives a smaller sun. The high reckoners have known for a whole age.",
      ] },
  ],

  tags: ["age_wheel"],

  subthemes: [
    { id: "final_count", n: "The Final Count", d: "The calendar-priests have reached the last cycle of the great count. Their numbers are posted in every market, and every day crossed off is a day less.", w: 1.5, req: { any: ["pious", "organised", "faith:sun", "faith:stars"] }, mods: [["seers", 2], ["gov:theocracy", 2]], tags: ["theme:final_count"] },
    { id: "ark_hoards", n: "The Ark-Vaults", d: "The great houses are digging sealed vaults into the mountains and stocking them with grain, books and their own children. There is no room for anyone else.", w: 1.2, req: { any: ["hierarchical", "mountain", "rich", "mercantile"] }, mods: [["mountain_folk", 2]], truthLink: "natural_wheel", tags: ["theme:arks"] },
    { id: "remnant_folk", n: "The Remnant Folk", d: "Small grey people of stone live in the high places, the last of an earlier sun's making. They say their age ended exactly like this one is ending.", w: 1, req: { any: ["mountain", "hills", "cold", "near:ruins"] }, tags: ["theme:remnants"], mark: { kind: "zone", n: "Remnant hills", color: "#8a8478", size: [1, 3], where: "mountain" } },
    { id: "sun_feeding", n: "The Feeding of the Sun", d: "The priests teach that the sun must be fed to keep turning. Wars are fought for captives, and the captives climb the stair at dawn.", w: 0.8, req: { any: ["sacrifice", "faith:sun", "zealous", "martial"] }, mods: [["autocracy", 1.5]], truthLink: "harvest", tags: ["theme:sun_feeding"] },
    { id: "count_heresy", n: "The Miscount Heresy", d: "A school of reckoners claims the count was wrong by a whole cycle: either there are centuries left, or the end is already overdue.", w: 1, req: { any: ["scholarly", "academies", "faith:philosophy", "learned"] }, truthLink: "broken_wheel", tags: ["theme:miscount"] },
    { id: "rememberer_child", n: "The Child Who Remembers", d: "A child was born speaking a language no one has heard, naming the cities of a sun before this one. The priests want the child; so do the ark-lords.", w: 0.7, req: { any: ["seers", "mystic", "ancestor_bound"] }, tags: ["theme:rememberer"] },
    { id: "nine_cities", n: "The City Built Nine Times", d: "A river cliff shows the same city eight times under the living town, each layer with the same streets and the same temple, each sealed under the same black ash.", w: 1, req: { any: ["river", "near:ruins", "river_folk"] }, truthLink: "harvest", tags: ["theme:strata"], mark: { kind: "zone", n: "The Strata", color: "#6e5a48", size: [1, 2], where: "any" } },
    { id: "revellers", n: "The Last Revels", d: "Many reason that if the world is ending anyway, work is pointless. Whole towns have given up planting for feasting, and the lords cannot collect taxes from the drunk.", w: 0.9, req: { any: ["urbane", "unstable", "poor", "egalitarian"] }, tags: ["theme:revels"] },
    { id: "wheel_breakers", n: "The Wheel-Breakers", d: "A secret society believes the cycle has a mechanism, and that a mechanism can be broken. They rob observatories and kill calendar-priests.", w: 0.8, req: { any: ["arcane", "near:ley", "near:rift", "spy_network"] }, truthLink: "broken_wheel", tags: ["theme:wheel_breakers"] },
    { id: "sleeping_heroes", n: "The Sleepers of the Last Sun", d: "Shepherds found a vault of armoured men and women asleep around a stone table. They wake for an hour at each solstice and ask whether the sun has turned.", w: 0.6, req: { any: ["mountain", "forest", "near:ruins"] }, truthLink: "natural_wheel", tags: ["theme:sleeping_heroes"] },
    { id: "signs_of_ending", n: "The Signs", d: "Rain that burns, birds that fly north in winter, a red rim on the sun at noon. Each sign is written in the codices, and each has now been seen.", w: 1.2, mods: [["seers", 1.5], ["pious", 1.3]], tags: ["theme:signs"] },
  ],

  sites: [
    { id: "strata_cliff", n: "The Ninefold Cliff of $", kind: "dig", where: "any", truthLink: "harvest", d: "A cliff face that shows nine cities stacked one on another, the eight lower ones each ended by the same black line.",
      layers: {
        surface: { n: "Bands in the cliff", text: "A river has cut a cliff 200 feet high near {place}, and its face is striped with brick and black ash, too many bands to count from below. Children throw stones at the layers and shout out numbers. Boatmen steer by it." },
        study: { n: "The same city", text: "{investigator} roped down and counted 8 buried cities under the present town, one on another. Every layer is the same city: the same streets, temple and well, each a little smaller than the one beneath. Every temple floor has the same mosaic of a fish." },
        dig: { n: "Clean-cut stumps", text: "In every layer the great works are missing. The towers end in stumps cut clean as cheese, and the libraries are empty shelves; the cheap houses were left to burn. Caravan-masters describe pits shaped like tower footings beyond {lead}.", points: "site:bone_field" },
        revelation: { n: "The reaping", text: "Each age was not destroyed. It was harvested: its best works taken whole by something from beyond the sky, the rest burned, and just enough people left to grow another crop. The 8 layers show 8 harvests. The ninth town, ours, stands on top of them, and its towers are the tallest yet." },
      } },
    { id: "calendar_stones", n: "The Count-Stones of $", kind: "ruin", where: "remote", d: "A ring of carved calendar stones whose count runs past the present age.",
      layers: {
        surface: { n: "Sheep pens", text: "Toppled wheel-stones carved with dots and bars lie near {place}, propped up as sheep pens. The shepherds count the dots on winter nights for something to do. They make it 3,600 years, give or take a ewe." },
        study: { n: "Eight back, and this one", text: "{investigator} read the full count. It runs back through 8 suns and on through this ninth one, then stops mid-carving, the chisel marks still sharp. The carving stops on the same day the Count now posts as the end." },
        dig: { n: "The smaller stone", text: "Beneath the centre stone lies a smaller stone with a different count, 19 days shorter per age. Reckoned forward, it ends 3 years before the posted date. The high reckoner's secretary, {official}, keeps the copies at {lead}.", points: "cast:official" },
        revelation: { n: "Two counts", text: "Two counts were kept. The large one was for the people. The small one was the true count, kept by the reckoners so they would know when to go to their own arks. The true count ends sooner. The high reckoner's office has had its numbers for 200 years." },
      } },
    { id: "ark_vault", n: "The Sealed Ark of $", kind: "dig", where: "mountain", truthLink: "natural_wheel", d: "A vault from the last age, built to carry its people across the ending.",
      layers: {
        surface: { n: "The bronze door", text: "A bronze door 20 feet high stands in a mountainside near {place}, and no tool will mark it. Goatherds shelter under its lintel. A miner's pick broke on it in {year}, and the head is still lying in the grass." },
        study: { n: "The manifest", text: "The carvings on the door are a manifest: seed, tools, songs and 400 names. {investigator} copied the names. 31 of them are still common in {realm}, and 4 are the names of ruling houses." },
        dig: { n: "Empty beds", text: "Inside, the seed-jars are full and the 400 beds are empty and made, the blankets folded. The 400 walked out long ago. A stonefolk elder who says they watched them leave lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "The ark worked", text: "The last age knew its sun was ending, built this vault and carried 400 people across. Everyone in this age descends from them, and forgot. The great houses now digging arks of their own are copying a door their ancestors walked out of." },
      } },
    { id: "dead_star_observatory", n: "The Blind Observatory of $", kind: "wonder", where: "mountain", truthLink: "broken_wheel", d: "A great observatory aimed at a star that is no longer in the sky.",
      layers: {
        surface: { n: "Pointing at nothing", text: "A stone sighting-tube 40 feet long stands on a peak above {place}, aimed at an empty patch of sky. The Count's priests keep it swept. Pilgrims look through it at nothing and come away pleased." },
        study: { n: "The Hub", text: "Old star charts show a bright star in that patch, named the Hub in every language {investigator} could find, 14 of them. The charts stop showing it in the eighth sun. The observatory log for that year has a struck entry." },
        dig: { n: "The downward stair", text: "A stair inside the mountain goes down, not up, 900 steps, to a chamber where a vast stone wheel sits on a bronze axle, warm to the touch. The building order for that stair is filed at {lead}.", points: "archive" },
        revelation: { n: "The keeper", text: "The star was not lost. It was the wheel's keeper, and in the eighth sun it came down to live under the mountain and turn the world by hand. The wheel was meant to stop at the fourth sun. The keeper has restarted it 5 times since, and each sun has come up smaller." },
      } },
    { id: "bone_field", n: "The Giants' Floor at $", kind: "anomaly", where: "desert", d: "A plain of enormous bones from creatures of an older making.",
      layers: {
        surface: { n: "Ribs in the sand", text: "Ribs the size of houses stand in the sand near {place}, across a plain 3 miles wide. Caravans camp inside them for shade. Bone-dealers saw off the smaller ones and sell them as roof-beams." },
        study: { n: "Tally marks", text: "The bones are carved with tally marks, each cut 2 hands wide, made by hands far larger than a man's. {investigator} read them as a count of days, 9 rows long, laid out the same way as the Count." },
        dig: { n: "The clay figures", text: "Among the bones lie clay figures of small people, 600 of them, buried with care in rows, like dolls or like gods. Their style matches the oldest figures in the temple treasury at {lead}.", points: "temple" },
        revelation: { n: "A promise", text: "The giants of an earlier sun thought of this age's people as a promise, and buried the figures to wish them into being before their own sun went out. The figures are the size of a child's hand. The giants knew each new people would be smaller." },
      } },
  ],

  beings: [
    { id: "stonefolk", n: "Stonefolk", kind: "small", d: "Grey, slow, patient people of an earlier making who live in high places and remember how their own age ended.", danger: 0, biomes: ["alpine", "peaks", "badlands", "colddesert"], look: { size: 1.1, group: [2, 6], move: "herd", speed: 3, col: "#8a8478", col2: "#5a5650", body: "biped", active: "dusk", visible: true } },
    { id: "hollow_wood_folk", n: "Hollow wood-folk", kind: "beast", d: "Tall, faceless figures of jointed wood, the failed people of an older sun. They walk the deep forests and mimic speech without understanding it.", danger: 2, biomes: ["tempforest", "rainforest", "temprain", "boreal"], look: { size: 2.4, group: [1, 3], move: "solo", speed: 5, col: "#5a4630", col2: "#8a7a5a", body: "biped", active: "night", visible: true } },
    { id: "ending_birds", n: "Omen-swifts", kind: "bird", d: "Black swifts that only appear in great numbers when an age is waning. Their flocks darken whole valleys at dusk.", danger: 0, biomes: ["grass", "savanna", "tempforest", "badlands", "coast"], look: { size: 0.3, group: [50, 400], move: "flock", speed: 60, col: "#1a1a20", col2: "#a03020", body: "bird", active: "dusk", visible: true } },
    { id: "elder_grazer", n: "Last-sun mammoth", kind: "grazer", d: "A shaggy giant grazer of the earlier age, surviving in a few cold valleys. Its tusks are carved with calendars by the remnant folk.", danger: 1, biomes: ["tundra", "coldsteppe", "boreal"], look: { size: 4, group: [3, 10], move: "herd", speed: 8, col: "#6a4a30", col2: "#c8b89a", body: "quad", active: "day", visible: true } },
  ],

  techs: [
    { id: "ws_long_count", n: "The long count", field: "astronomy", level: 1, d: "The ages are reckoned by a calendar of nested wheels, and every day has its place in the great count." },
    { id: "ws_strata_reading", n: "Reading the strata", field: "natural_philosophy", level: 2, d: "Ruins are dug layer by layer, and the age of each layer read from its ash and its pots." },
    { id: "ws_seed_vaults", n: "Seed-vaults", field: "agriculture", level: 2, d: "Grain and seed sealed in wax and clay jars that keep for a hundred years in the cold." },
    { id: "ws_ark_masonry", n: "Ark masonry", field: "architecture", level: 3, d: "Vaults cut deep into living rock and sealed with bronze doors, built to outlast the end of an age." },
    { id: "ws_true_count", n: "The true count", field: "astronomy", level: 4, d: "Reckoners recompute the cycle from the oldest stones and find the official count was wrong." },
    { id: "ws_wheel_mechanism", n: "The wheel's axle", field: "arcana", level: 5, d: "Scholars learn that the turning of ages has a mechanism, and that a mechanism has a place, and a keeper." },
  ],

  units: [
    { id: "ws_sun_guard", n: "Sun-stair guard", role: "infantry", wpn: "spear", kit: "mail", ranks: 4, gap: 1.2, size: 100, w: 0.6, mods: [["theme:sun_feeding", 8], ["gov:theocracy", 2]] },
  ],

  faiths: [
    { id: "ws_calendar", n: "The Count", d: "The priests keep the great calendar and perform the rites that hold the sun on its wheel a little longer.", tags: ["faith:ws_calendar", "organised"], w: 1.5, mods: [["seers", 2], ["faith:sun", 2], ["scholarly", 1.5]], names: ["The Keepers of the Count", "The Wheel of $", "The Ninth Sun's Church"] },
  ],

  mapMarks: [
    { kind: "zone", n: "Scorched plain", color: "#5a4a40", size: [2, 4], count: [0, 2], where: "remote", d: "A plain of black glassy stone, where the fire-rain of an earlier ending fell hardest." },
  ],

  storylines: [
    { id: "ws_last_cycle", n: "The Last Cycle of {realm}", scale: "realm", anchor: "realm", w: 1.5, req: ["age_wheel", { any: ["pious", "organised", "seers", "faith:sun"] }],
      stages: {
        start: { h: "The count reaches its final cycle in {realm}", b: "The calendar-priests of {capital} have announced that the last turning of the great count has begun. {person}, high reckoner, has read the number from the temple steps, and {official} has posted it in every market.", wait: [3, 8], fx: { unrest: 10 }, next: [{ to: "panic", w: 2 }, { to: "arks", w: 1, mods: [["hierarchical", 2], ["rich", 2]] }, { to: "miscount", w: 1, mods: [["scholarly", 2], ["learned", 2]] }] },
        panic: { h: "Fields lie unplanted in {realm}", b: "Farmers see no point in sowing what no one will reap. Across {realm} the granaries are being opened for feasts, and the tax-collectors are beaten at the gates.", wait: [3, 8], fx: { stability: -8, growth: -0.002 }, next: [{ to: "sun_war", w: 1, mods: [["sacrifice", 3], ["martial", 2]] }, { to: "dawn_comes", w: 2 }] },
        arks: { h: "The lords of {realm} seal themselves in the mountains", b: "The great houses have begun moving into their ark-vaults with their grain and their libraries. Those left outside have noticed.", wait: [4, 10], fx: { unrest: 15 }, next: [{ to: "ark_stormed", w: 2 }, { to: "dawn_comes", w: 1 }] },
        miscount: { h: "{person2} says the count is wrong", b: "A reckoner of {capital} has recomputed the great count from the oldest stones and found it a whole cycle out. The priests have called it heresy.", wait: [3, 8], fx: { science: { astronomy: 0.6 } }, next: [{ to: "count_corrected", w: 1, mods: [["learned", 2], ["tolerant", 2]] }, { to: "reckoner_burned", w: 1, mods: [["zealous", 3], ["theocratic", 2]] }, { to: "dawn_comes", w: 1 }] },
        sun_war: { h: "{realm} goes to war to feed the sun", b: "The priests demand captives for the sun-stair, and {ruler} has marched on {rival} to take them.", fx: { war: "rival", prestige: 5 }, end: true },
        ark_stormed: { h: "The ark of {realm} is stormed", b: "A mob broke the bronze doors of the great vault and dragged the lords out into the light. They took the grain and left the books to rot.", fx: { revolt: true, stability: -15 }, end: true },
        count_corrected: { h: "The count of {realm} is rewritten", b: "The reckoners have won: the true count gives the age another century, or so they say. Markets reopen, and fields are sown again.", fx: { stability: 10, discovery: "astronomy" }, end: true },
        reckoner_burned: { h: "A reckoner burns in {capital}", b: "{person2} was burned with the tables. Some of the ash was gathered by students, and the numbers were copied before the fire.", fx: { unrest: 8, stability: 3 }, end: true },
        dawn_comes: { h: "The sun rises over {realm} after all", b: "The appointed day passed and the sun rose, a little redder than before. The priests of {capital} say the rites held it. No one quite believes them.", fx: { stability: 5, prestige: -5 }, end: true },
      } },
    { id: "ws_remembering_child", n: "The Child of the Old Sun", scale: "local", anchor: "town", w: 1.2, req: "age_wheel",
      stages: {
        start: { h: "A child in {place} names a city no one knows", b: "{person}, a weaver's child of {place}, draws maps of streets that have never existed and sings in a tongue the priests call dead.", wait: [2, 6], next: [{ to: "priests_take", w: 1, mods: [["pious", 2], ["organised", 2]] }, { to: "scholars_listen", w: 1, mods: [["scholarly", 2], ["learned", 2]] }, { to: "forgotten", w: 1 }] },
        priests_take: { h: "The temple takes the child of {place}", b: "The priests of {faith} have taken {person} into the temple for safekeeping. The family has not been allowed to visit.", wait: [6, 14], next: [{ to: "child_silenced", w: 1 }, { to: "child_escapes", w: 1, mods: [["unstable", 2]] }] },
        scholars_listen: { h: "Scholars write down the child's maps", b: "{person2}, a reckoner, has spent a season transcribing the child's songs. They describe the end of an age in perfect detail.", wait: [4, 10], fx: { science: { writing: 0.5 } }, next: [{ to: "ruin_found", w: 2 }, { to: "child_silenced", w: 1 }] },
        ruin_found: { h: "The child's city is found beneath {place}", b: "Diggers following the child's map found the streets under the fields, exactly where the songs said, sealed under a black line of ash.", fx: { discovery: "natural_philosophy", prestige: 8 }, end: true },
        child_silenced: { h: "The child of {place} stops speaking", b: "{person} no longer sings the old songs. The priests call it a cure. The family calls it something else.", fx: { unrest: 5 }, end: true },
        child_escapes: { h: "The child of {place} is gone", b: "{person} vanished from the temple in the night. Remnant folk were seen on the hill road the next morning.", fx: { flag: "rememberer_free" }, end: true },
        forgotten: { h: "The child of {place} grows out of it", b: "By ten {person} remembered nothing of the songs. The maps were used to light the fire one winter.", end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "temple", bias: "pious", reliable: "partial", points: "temple", who: "{believer}, priest of the sun-stair", text: "From the opening of the Count, as recited at dawn by {believer}, priest of the sun-stair, {year}: 'Eight suns have burned and gone out. Each was smaller than the last and each people smaller than the last. We are the ninth, and we are counted.' {believer} adds for pilgrims: 'The full count, 4,009 days remaining, is posted at {lead}. Bring a tithe.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: true, who: "a skipping rhyme of {place}", text: "Skipping rhyme of the children of {place}, written down by {investigator} in {year} with a note: 'My grandmother sang it, and every child here knows it.' The rhyme: 'First sun gold, second sun bright, third sun stone and fourth sun light... ninth sun short, then comes the night.' {investigator} notes that the 4 missing lines are hummed, not sung." },
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: false, who: "{official}, secretary to the high reckoner", text: "Letter of {official}, secretary to the high reckoner, to the royal historians of {realm}, {year}: 'The so-called ages are a poetic device of the old calendar-priests. The world is as old as the founding of {realm}, and no older. The 8 black layers in the river cliffs are floods. The college thanks the historians for their 3 volumes and has filed them.'" },

    { depth: "core", about: "truth:natural_wheel", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:ark_vault", who: "carving over the ark door", text: "Carved over the door of the sealed vault at {lead}, read by {investigator} in {year}: 'Our sun is ending, as every sun ends; it cannot be stopped. We go down so that the next sun has hands to plant with. 400 of us, with seed and songs. Do not weep for this age. Carry it.' Below, a line added later, in a rougher hand: 'We came out. Plant.'" },
    { depth: "core", about: "truth:natural_wheel", source: "oral", bias: "garbled", reliable: "partial", who: "{survivor}, stonefolk elder", text: "{survivor}, a stonefolk elder, answering a priest who asked what the stonefolk pray for, at {place}, {year}: 'The wheel turns. You do not stop a wheel. You ride it, or you are the road. Our sun went out when I was 30. We had 2 arks and 1 of them opened. I would not pray, if I were you. I would dig.'" },
    { depth: "core", about: "truth:natural_wheel", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "an ark manifest of the sixth sun", text: "Ark manifest of the sixth sun, partly scraped, copied by {investigator} in {year}: 'Seed of barley, 40 jars. Songs, all that could be remembered. Names to be kept: ...' The rest is chiselled away, except one line at the foot: 'Left outside by lot: Ammar Tesh, mason, who cut this door, and 3,000 others. Ammar asked that the door be made well. It was.'" },
    { depth: "core", about: "truth:natural_wheel", source: "temple", bias: "official", reliable: false, who: "a decree of the Count", text: "Decree of the Count, read in every temple of {realm} in {year}: 'The rites of the Count hold the sun on its wheel. As long as the priests are fed and the stair is climbed, the age will not end. Ark-building by private persons is a lack of faith, and the stone is better given to the 12 new temples now under way.'" },
    { depth: "core", about: "truth:natural_wheel", source: "person", bias: "true", reliable: "partial", who: "a shepherd of {place}", text: "Account of a shepherd of {place}, who found the sleepers' vault, {year}: 'At midwinter one of them woke and sat up in its armour and asked me, has the sun turned? I said no. It said, then go home and teach your children to make fire without iron. They will need it. Then it lay down. I have taught my 3. I do not know what else to do.'" },

    { depth: "core", about: "truth:harvest", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:strata_cliff", who: "scratched on a cellar wall", text: "Scratched into a cellar wall in the third layer of the cliff at {lead}, copied by {investigator} in {year}: 'This is what happened. The lights came down from the sky at the height of our age and took the towers. Only the towers, and the books, and the best of the bronze. Then the fire, for everything else. 30 of us in this cellar. They left us to start again.'" },
    { depth: "core", about: "truth:harvest", source: "heretic", bias: "heretic", reliable: "partial", cost: true, who: "Senna Koll, wheel-breaker", text: "Tract of the wheel-breaker Senna Koll, written in a cell at {place} the night before the burning, {year}: 'Why do the endings always come when we are greatest? A farmer does not reap green wheat. Stop building towers. Stop building libraries. I was taken for saying so in the market, and I am to burn at dawn with my 2 books, which I suppose is a small harvest of its own.'" },
    { depth: "core", about: "truth:harvest", source: "traveller", bias: "exaggerated", reliable: "partial", points: "site:bone_field", who: "a caravan-master", text: "Tale of a caravan-master, told at an inn in {place}, {year}: 'In the deep desert past the giants' bones at {lead} there is a plain of pits, 70 or more, each the exact shape of a tower's footing, square, with the corners sharp. Nothing has grown in them since. The camels will not cross it. I made them once and lost 4.'" },
    { depth: "core", about: "truth:harvest", source: "library", bias: "official", reliable: false, who: "Royal Survey of the Rivers", text: "From the Royal Survey of the Rivers of {realm}, {year}, volume 3: 'The black layers in the river cliffs are the ash of ordinary fires and floods. Their regular spacing, about 400 years apart, is a coincidence of the river's moods. The survey recommends the cliff be quarried for its excellent brick.'" },
    { depth: "core", about: "truth:harvest", source: "oral", bias: "garbled", reliable: "partial", who: "a children's game of {place}", text: "A children's game of {place}, described by a schoolmaster in {year}: each child builds a tower of stones. One child is the Reaper and walks slowly along the line. Whoever has built the tallest tower is out, and their stones are taken. The schoolmaster notes that the children build low, about 3 stones high, and that the best players build none." },

    { depth: "core", about: "truth:broken_wheel", source: "archive", bias: "redacted", reliable: "partial", points: "site:dead_star_observatory", who: "observatory log of the eighth sun", text: "Log of the great observatory at {lead}, eighth sun, day 211: 'The Hub has left the sky. It moved downward over 3 nights and went behind the mountain. The high reckoner has forbidden us to note it. Entry struck.' The entry is struck through with a single line. Every word is still readable." },
    { depth: "core", about: "truth:broken_wheel", source: "heretic", bias: "heretic", reliable: true, plain: true, who: "a wheel-breaker's confession", text: "Confession of a wheel-breaker, taken by the Count's inquisitors at {place}, {year}: 'Someone keeps turning the wheel. It should have stopped at the fourth sun. There is an axle under the observatory mountain; 6 of us went down the stair and heard it. It groans when it turns, like something old being made to work. The thing turning it was the Hub. It is afraid to stop.'" },
    { depth: "core", about: "truth:broken_wheel", source: "ruin", bias: "true", reliable: "partial", points: "site:calendar_stones", who: "a carving on a calendar stone", text: "Carved along the edge of one calendar stone at {lead}, in a different hand from the count, read by {investigator} in {year}: 'By our reckoning, the count should have ended at the fourth sun. It is now the sixth. Why do we keep carving?' Under it, a later hand has added 2 more rows of dots, and stopped." },
    { depth: "core", about: "truth:broken_wheel", source: "temple", bias: "official", reliable: false, who: "a ruling of the Count", text: "Ruling of the Count on star charts, signed for the high reckoner by {official}, {year}: 'The empty place in the sky was never a star. Old charts showing one there are the work of drunken copyists, of whom there were many. Charts showing the so-called Hub are to be surrendered; 30 have been burned this year.'" },
    { depth: "core", about: "truth:broken_wheel", source: "person", bias: "true", reliable: "partial", cost: true, who: "{investigator}, reckoner, letter", text: "Letter of {investigator}, reckoner, to the college, {year}: 'My colleague Pell Arno went down the 900 steps under the observatory with a lamp to measure the axle. Pell came up 2 days later, blind, and has not spoken since except to count: 1 to 10, over and over, in time with something we cannot hear. I am told not to ask for an inquiry. I am asking.'" },

    { depth: "sub", about: "sub:final_count", source: "temple", bias: "propaganda", reliable: false, who: "posted by {official} in the market of {place}", text: "Posted in the market of {place} over the seal of {official}, secretary to the high reckoner, {year}: 'Days remaining in the Count: 4,009. The end is certain and orderly. Tithes are due as usual. Persons found altering the number on this board, upward or downward, will be fined 10 silver per day altered.'" },
    { depth: "sub", about: "sub:ark_hoards", source: "person", bias: "true", reliable: true, points: "cast:official", who: "a mason's diary", text: "Diary of a mason working on an ark-vault near {place}, {year}: '40 rooms, all for one family and its dogs. Grain for 12 years. I asked where my children would sleep. I was paid double to stop asking. The plans came stamped by the high reckoner's office; the secretary there, {official}, signs for 3 houses' arks out of {lead}.'" },
    { depth: "sub", about: "sub:remnant_folk", source: "traveller", bias: "exaggerated", reliable: "partial", points: "cast:survivor", who: "a salt-trader in the high passes", text: "Letter of a salt-trader from the high passes, {year}: 'The grey folk do not eat, I swear it. They sit in the sun like lizards and tell you how your world will end, very politely, with dates. One of them, {survivor}, gave me 2 hours on it and asked nothing for the trouble. If you want the same, the elder lives at {lead}.'" },
    { depth: "sub", about: "sub:count_heresy", source: "library", bias: "heretic", reliable: "partial", who: "{investigator}, reckoner, margin note", text: "Margin note by {investigator}, reckoner, in a college copy of the Count, {year}: 'If the leap-days were never added, the end is 3 years past and we are living on borrowed sun. If they were added twice, we have a century. Either way the posted number is wrong, and the high reckoner's office knows which way.'" },
    { depth: "sub", about: "sub:nine_cities", source: "ruin", bias: "true", reliable: true, points: "site:strata_cliff", who: "{investigator}, field notes", text: "Field notes of {investigator} at the ninefold cliff of {lead}, {year}: 'The same mosaic of a fish is on the temple floor in all 9 layers. In the lowest it is gold, with eyes of red glass. In the next, gilt. Then bronze, then tile, then painted clay. In the highest, ours, it is chalk. Each age made the same fish with less.'" },
    { depth: "sub", about: "sub:sleeping_heroes", source: "oral", bias: "garbled", reliable: "partial", who: "a herdsman of {place}", text: "A herdsman of {place}, to a travelling priest, {year}: 'They wake at midwinter, 12 of them, round the stone table, and ask if the sun has turned. Say no, and they sleep. Say yes, and they will ride, and no one knows where. Nobody here has ever said yes. We are not sure we'd want to see where.'" },

    { depth: "site", about: "site:dead_star_observatory", source: "archive", bias: "redacted", reliable: "partial", who: "the observatory's building order", text: "Building order for the great observatory above {place}, eighth sun, sealed by the high reckoner: 'The stair shall go downward, 900 steps. The tube above shall be kept and swept, so that pilgrims have something to look at. Those who ask why the stair goes down shall be sent to count sheep.' The order is countersigned in 3 hands." },
  ],
};
