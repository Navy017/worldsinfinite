// The Seed-Engine: a substance from elsewhere that rewrites flesh and stone toward a design no one understands.
// Bridge premise: under a medieval world it is the black ichor of a fallen star, making saints and monsters.
export default {
  id: "seed_engine",
  name: "The Seed-Engine",
  family: "scifi",
  pitch: "A black substance that fell from the sky reshapes anything it touches into part of a design no one understands. Everyone who has tried to make a weapon of it has been absorbed into it.",
  slots: ["apocalypse", "monster-source", "augmentation"],
  tone: ["horror", "grim"],
  era: ["medieval", "post-collapse", "near-future", "far-future"],
  scale: "regional",
  genres: ["fantasy", "grimdark", "farfuture", "cyberpunk", "postapoc"],
  bridge: true,
  w: 1,
  excludes: [],
  pairs: [{ id: "watchers_in_the_dark", w: 3 }, { id: "visited_ground", w: 2 }, { id: "charter_lords", w: 2 }, { id: "grafted", w: 1.5 }, { id: "sleeper", w: 1.5 }, { id: "elder_lattice", w: 1.5 }],

  truths: [
    { id: "unfinished_bridge", n: "It is a tool still finishing its work", d: "The substance is a construction tool left by makers who are long dead. It builds gateways out of whatever living matter is nearby, and it is still trying to finish the one it was sent to build. A powerful house has fed it prisoners for a generation trying to make an army, and every one became part of the arch. Whatever killed its makers is waiting on the other side.", tags: ["truth:seed_bridge"],
      known: [
        "The black ichor reshapes what it touches, and everyone who has tried to make a weapon of it has been absorbed. The same repeating glyphs appear on every spire and on the black ring in the bay.",
        "A scholar reads the glyphs as a plan, not a spell: build from what is near, then open. In the sealed trials, all forty subjects grew toward the north wall, toward the coast.",
        "The black ring in the bay is a gate built from drowned bodies, nearly finished. The substance is a tool still doing the job its dead makers sent it to do. Its makers' killer is waiting on the far side.",
      ] },
    { id: "spire_harvest", n: "The spires are calling a harvest", d: "The black spires are copies of one original, buried under the oldest temple in the capital, that slowly drives people mad. Everyone it affects carves another copy, and the Church of the Joining has raised hundreds in cellars. When there are enough copies, every person in the land will be merged into one body. The high priests who founded the temple heard the spire first, and built the faith to serve it.", tags: ["truth:seed_harvest"],
      known: [
        "A new faith in the poor quarters raises small black spires in cellars, and its converts speak happily of becoming one body. The crown calls it a beggars' fraud. Its soup kitchens are popular.",
        "Former preachers of the Joining say the spires changed the carvers, not the other way round. The Joining's hymn tells the faithful to count the spires and count the joined, and wait for the two numbers to meet.",
        "Under the oldest temple in the capital stands the first spire, ringed by the bones of every high priest. The temple was built to house it. Every spire is a copy, and when there are enough, the land becomes one body.",
      ] },
    { id: "thinning_door", n: "It is a door, and something is learning our shape", d: "The substance is not ordinary matter. It is the edge of another place outside the world. Every burning and every experiment wears the barrier thinner, so the burn-wardens make each outbreak worse than the last, and the creatures beyond it are learning to copy our shapes. They have made a hand, and they are working on faces.", tags: ["truth:seed_door"],
      known: [
        "The burn-wardens seal and burn every outbreak town. The outbreaks keep coming, and each is worse than the last: three in our grandparents' day, eleven in ours. In the eastern provinces, whole villages share the same dreams.",
        "In an abandoned mine the deepest gallery ends in a sheet of black that ripples when lamplight touches it. A cord fed through came back knotted in a pattern no person made.",
        "The black is a door to a place outside the world. Every burning wears it thinner. Something on the far side is learning to copy what we make: first knots, then a hand, then a particular miner's hand.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "a scholar who copies and translates the glyphs on the black spires", home: "inner", stance: "Believes the glyphs are a plan rather than a spell, and that a plan can be read, and stopped." },
    { role: "official", n: "a captain of the burn-wardens, who seal and burn outbreak towns", home: "mountain", stance: "Has burned nine towns and believes fire is the only answer, though each outbreak since has been worse." },
    { role: "believer", n: "a preacher of the Church of the Joining, which raises small black spires in cellars", home: "capital", stance: "Believes the spires will make everyone one body, and that nobody will ever be lonely again." },
    { role: "survivor", n: "one of the Half-Changed, who lived through an outbreak with the black in the veins", home: "border", stance: "Heals from anything and hears the spires hum, and wants the hunters to stop long enough to listen." },
  ],

  tags: ["seed_substance"],

  subthemes: [
    { id: "burned_town", n: "The Burned Town", d: "A mining town opened a seam that bled black. Within a month the burn-wardens came, sealed the roads and set it alight with the people inside.", w: 1.4, req: { any: ["mountain", "hills", "autocracy"] }, tags: ["theme:seed_burn"], mark: { kind: "zone", n: "Quarantined ashland", color: "#3a3030", size: [1, 2], where: "mountain" } },
    { id: "spire_church", n: "The Church of the Joining", d: "A faith spreads through the poor quarters, raising small black spires in cellars. Its converts speak of becoming one body, and they are very happy.", w: 1.3, req: { any: ["urbane", "poor", "has:city", "faith:void", "mystic"] }, truthLink: "spire_harvest", tags: ["theme:joining_church"] },
    { id: "hidden_trials", n: "The Sealed Experiments", d: "A powerful house keeps a sealed workshop where the substance is fed prisoners and livestock. It wants an army that heals itself.", w: 1.2, req: { any: ["autocracy", "mercantile", "standing_army"] }, tags: ["theme:seed_trials"] },
    { id: "half_changed", n: "The Half-Changed", d: "Survivors of an outbreak who carry the black in their veins. They hear things, heal fast, and are hunted wherever they are found; some have begun to organise.", w: 1.2, tags: ["theme:half_changed"] },
    { id: "dictating_scholar", n: "The Scholar Who Takes Dictation", d: "A respected scholar has started writing pages of figures in his sleep. He says the black stone near his study is teaching him, and his patrons are paying well.", w: 0.9, req: { any: ["scholarly", "academies", "learned"] }, truthLink: "unfinished_bridge", tags: ["theme:dictation"] },
    { id: "grown_ring", n: "The Ring in the Sea", d: "A vast ring of black coral rose from the sea in a single night. Fishermen who sail through it come back days late, or not at all.", w: 0.8, req: { any: ["coastal", "island", "has:port"] }, truthLink: "unfinished_bridge", tags: ["theme:sea_ring"], mark: { kind: "zone", n: "The Ring waters", color: "#2a2a3a", size: [1, 2], where: "coast" } },
    { id: "walking_city", n: "The City That Moved", d: "A town swallowed by an outbreak was found, years later, a league from where it had stood. Its walls had grown legs.", w: 0.5, req: { any: ["realm:large", "realm:vast", "near:ruins"] }, truthLink: "spire_harvest", tags: ["theme:walking_city"] },
    { id: "immune_child", n: "The Child Who Does Not Change", d: "A child walked out of an outbreak untouched. Every faction in the land wants her, some to cure the world and some to make more of the black.", w: 0.8, tags: ["theme:immune_child"] },
    { id: "burn_captain", n: "The Burn-Warden's Choice", d: "The burn-wardens are feared and necessary. One of their captains has been ordered to burn the village she was born in.", w: 1, req: { any: ["harsh_law", "martial", "gov:theocracy", "zealous"] }, tags: ["theme:burn_wardens"] },
    { id: "whisper_dreams", n: "The Shared Nightmare", d: "Across a whole province, people dream the same dream: a corridor of wet black ribs, and a door at the end that swells and shrinks like a lung.", w: 0.8, req: { any: ["seers", "mystic", "near:rift"] }, truthLink: "thinning_door", tags: ["theme:shared_dream"] },
    { id: "ichor_market", n: "The Ichor Market", d: "A single vial of the black is worth a castle. Smugglers carry it in lead flasks, and the towns along their road have started to sicken.", w: 1, req: { any: ["mercantile", "has:port", "free_trade"] }, tags: ["theme:ichor_trade"] },
  ],

  sites: [
    { id: "first_fall", n: "The First Fall at $", kind: "dig", where: "remote", d: "A crater where something came down long ago, kept secret by whoever rules the land.",
      layers: {
        surface: { n: "The Star's Grave", text: "A walled-off crater the locals call the Star's Grave. No birds nest within a mile of it. The wall is 30 feet high and kept in good repair at the crown's expense, though no one is meant to know what it guards." },
        study: { n: "The growing veins", text: "The crater walls are glassed and veined with black. {investigator} drove iron pegs at the tip of three veins in {year}. A year later the veins had grown a finger's width past every peg, all three toward the coast." },
        dig: { n: "The hull", text: "At the bottom lies a seed-shaped hull of a material no smith can mark, cracked open from the inside. The same glyphs are cut into its rim as on the spire kept under the temple at {lead}.", points: "site:spire_crypt" },
        revelation: { n: "Aimed", text: "It did not fall by accident. It was sent, and it landed where it was aimed, by makers who died before it arrived. The first kings walled the crater and wrote it into the founding charter. Every ruler since has entered once, and none has entered twice." },
      } },
    { id: "living_wall", n: "The Sealed Cellar of $", kind: "ruin", where: "any", d: "A bricked-up workshop whose inner wall is warm and has a slow pulse.",
      layers: {
        surface: { n: "The branded door", text: "A cellar sealed with lead and a burn-warden's brand. Children dare each other to touch the door. It is warm in winter, and the snow never settles on the step above it." },
        study: { n: "The wall that moves", text: "Behind the bricks the wall is skin-coloured and faintly ribbed, and it moves when spoken to. A warden with an ear trumpet counted a pulse of about one beat every 20 breaths." },
        dig: { n: "The forty faces", text: "The workshop's ledgers name forty subjects. The wall has forty faces pressed into it, all asleep. The ledgers bear the seal of a great house, and the house's own copy is kept at {lead}.", points: "archive" },
        revelation: { n: "Building material", text: "The forty were not killed. They were used as building material, and the building is not finished. The great house that ran the trials wanted soldiers that heal. It got a wall, and it has opened two more workshops since." },
      } },
    { id: "black_ring", n: "The Black Ring of $", kind: "anomaly", where: "coast", truthLink: "unfinished_bridge", d: "A ring of grown black stone standing in the sea, taller each year.",
      layers: {
        surface: { n: "The coral", text: "A ring of black coral out past the shoals, wide enough to sail a ship through. The harbour master records its height every spring. It has grown 9 feet since {year}." },
        study: { n: "Inside-out script", text: "Its surface is covered in the same repeating script found on every spire, arranged as if to be read from the inside. {investigator} copied 300 lines from a rowing boat and found no line that differs." },
        dig: { n: "The other water", text: "Divers report that the water inside the ring is not the same water: colder, and lit from below. One diver came back up with a dead man's ring from a sailor drowned at {lead}.", points: "sub:burned_town" },
        revelation: { n: "The gate", text: "The ring is a gate, almost complete. The black has been building it from every drowned body in the bay, and the burn-wardens have been throwing their dead into the bay for a century. It needs perhaps 200 more." },
      } },
    { id: "spire_crypt", n: "The Spire Beneath $", kind: "shrine", where: "capital", truthLink: "spire_harvest", d: "A twisted black spire found under the oldest temple in the capital.",
      layers: {
        surface: { n: "The crypt", text: "A sealed crypt beneath the high altar, opened only by the high priest, once a year. The door has seven locks. The sexton says it is warm to the touch, and that it hums at night." },
        study: { n: "Almost readable", text: "The spire is carved with script that every visitor swears they can almost read. In the last 50 years, 12 visitors have tried to copy it. Eleven of them later joined the Church of the Joining." },
        dig: { n: "The curled bones", text: "Around its base lie the bones of every high priest of the temple, 70 of them, curled facing inward. The temple's founding records, which list the spire before the altar, are kept at {lead}.", points: "archive" },
        revelation: { n: "Built to serve", text: "The temple was built to house the spire, not the other way round. The faith was founded by people who heard the spire's voice, and every high priest since has served it. The Joining is not a heresy. It is the temple's own plan, carried out faster." },
      } },
    { id: "breathing_door", n: "The Door Under $", kind: "anomaly", where: "mountain", truthLink: "thinning_door", d: "A seam of black in a deep mine that opens onto somewhere else.",
      layers: {
        surface: { n: "Mid-shift", text: "A mine abandoned mid-shift, tools still in place, lamps still on their hooks. The tally board shows 31 miners went down that morning. The pay office shows 29 were paid that week." },
        study: { n: "The black sheet", text: "The deepest gallery ends in a sheet of black that ripples like a pond when lamplight touches it. A burn-warden's report says it was burned twice. Each burning made it wider by about a yard." },
        dig: { n: "The knotted cord", text: "A miner's cord tied off at the black and fed through came back knotted in a pattern no human hand made. A second cord came back knotted in the miners' own guild knot. The cords are kept at {lead}.", points: "cast:official" },
        revelation: { n: "The window", text: "It is not a seam. It is a window into somewhere outside the world, and something on the other side is learning to copy what we make. The burn-wardens widened it every time they burned it. Two of the 31 miners came back up. They were not miners." },
      } },
  ],

  beings: [
    { id: "changed_dead", n: "The re-made", kind: "beast", d: "Bodies the black has taken and rebuilt for a purpose: limbs where limbs should not be, walking straight toward the nearest living thing.", danger: 3, biomes: ["tempforest", "boreal", "badlands", "swamp", "grass", "dryforest"], look: { size: 2, group: [2, 10], move: "swarm", speed: 7, col: "#2a2226", col2: "#7a3a3a", body: "biped", active: "night", visible: true } },
    { id: "black_hound", n: "Ichor-hound", kind: "predator", d: "A dog or wolf that drank from a black pool and kept growing. It does not eat what it kills; it carries it somewhere.", danger: 2, biomes: ["tempforest", "boreal", "tundra", "coldsteppe", "badlands"], look: { size: 1.8, group: [1, 4], move: "pack", speed: 12, col: "#1a1a1e", col2: "#4a2a3a", body: "quad", active: "dusk", visible: true } },
    { id: "ring_crawler", n: "Ring-crawler", kind: "marine", d: "A many-legged thing of black coral that builds as it crawls, carrying drowned matter back to the sea-ring.", danger: 1, biomes: ["shelf", "reef", "estuary"], look: { size: 1.2, group: [5, 40], move: "swarm", speed: 2, col: "#202028", col2: "#5a5a6a", body: "crab", active: "night", visible: false } },
  ],

  techs: [
    { id: "se_containment", n: "Lead and fire", field: "medicine", level: 1, d: "Sealed flasks, burned clothing and quarantine lines: the hard-learned rules for handling the black." },
    { id: "se_sealed_suits", n: "Sealed suits", field: "engineering", level: 2, d: "Waxed hoods and leaded gloves, or later pressure suits, that let wardens walk into an outbreak and walk out again." },
    { id: "se_mending_draught", n: "The mending draught", field: "alchemy", level: 3, d: "A drop of the black, diluted beyond reason, closes any wound. Mostly. The physicians count the doses carefully." },
    { id: "se_whisper_dampers", n: "Whisper-dampers", field: "arcana", level: 3, d: "Singing bowls, then humming coils, that drown out the spires' voice inside a small circle." },
    { id: "se_hybrid_soldiers", n: "Hybrid soldiers", field: "warfare", level: 4, d: "Volunteers, or prisoners, given measured doses so they heal and do not tire. The doses are never quite measured enough." },
    { id: "se_grown_stone", n: "Directed growth", field: "architecture", level: 5, d: "Feeding the black so that it builds walls and bridges to a drawn plan. It follows the plan for a while, then starts building its own design instead." },
  ],

  units: [
    { id: "se_burn_wardens", n: "Burn-wardens", role: "infantry", wpn: "spear", kit: "robe", ranks: 3, gap: 1.6, size: 60, w: 1, mods: [["theme:burn_wardens", 5], ["theme:seed_burn", 3], ["harsh_law", 1.5]] },
    { id: "se_hybrids", n: "Black-blooded", role: "infantry", wpn: "axe", kit: "hide", ranks: 3, gap: 1.4, size: 80, w: 0.4, mods: [["theme:seed_trials", 8], ["theme:half_changed", 3]] },
  ],

  faiths: [
    { id: "se_joining", n: "The Joining", d: "The flesh is a cell and the black is the key. The faithful long to be gathered into the one great body.", tags: ["faith:joining", "sinister"], w: 0.4, names: ["The Church of the Joining", "The One Body of $", "The Gathered"], mods: [["theme:joining_church", 10], ["poor", 1.5], ["mystic", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Black growth", color: "#26222a", size: [1, 3], count: [1, 2], where: "remote", d: "Land where the black has spread over soil and stone like a crust, growing in patterns from above." },
  ],

  storylines: [
    { id: "se_outbreak", n: "The Black Seam of {place}", scale: "local", anchor: "town", w: 2, req: "seed_substance",
      stages: {
        start: { h: "Miners of {place} strike a black seam", b: "The pick-men of {place} opened a vein that bled like oil and was warm to the touch. {person}, the foreman, ordered it sealed; by morning the seal had grown over.", wait: [1, 4], next: [{ to: "sickness", w: 2 }, { to: "sold", w: 1, mods: [["mercantile", 2.5], ["poor", 1.5]] }] },
        sickness: { h: "A strange sickness in {place}", b: "The miners heal from any cut overnight, and then they stop sleeping. {person} has sent to {capital} for help.", wait: [1, 3], fx: { unrest: 10, flag: "outbreak" }, next: [{ to: "burned", w: 2, mods: [["harsh_law", 2], ["autocracy", 1.5]] }, { to: "cure", w: 1, mods: [["learned", 2.5], ["scholarly", 2]] }, { to: "spread", w: 1 }] },
        sold: { h: "Black vials from {place} reach the market", b: "Someone in {place} has been selling the black in lead flasks to physicians and lords. The town is suddenly rich, and very quiet.", wait: [2, 6], fx: { treasury: 40 }, next: [{ to: "spread", w: 2 }, { to: "burned", w: 1 }] },
        burned: { h: "Burn-wardens put {place} to the torch", b: "The roads were sealed and the town was burned with its people inside. The smoke over {place} was black for nine days.", fx: { abandon_town: true, stability: -6, unrest: 15 }, end: true },
        cure: { h: "A physician of {realm} halts the black", b: "{person2} found that fire and salt drive the black out of living flesh, if caught early. {place} lost a third of its people, and kept the rest.", fx: { pop: 0.9, science: { medicine: 1 }, discovery: "medicine" }, end: true },
        spread: { h: "The black spreads beyond {place}", b: "Travellers from {place} carried it along the roads. Villages across {realm} report the dead walking in the wrong shapes.", fx: { plague: true, pop: 0.85, stability: -10 }, end: true },
      } },
    { id: "se_spire_cult", n: "The Spire of {realm}", scale: "realm", anchor: "realm", w: 1.5, req: ["seed_substance", { any: ["urbane", "poor", "mystic", "faith:void", "has:city"] }],
      stages: {
        start: { h: "Black spires appear in the cellars of {capital}", b: "Little twisted spires of black stone have been found in poor houses across {capital}. Their owners say they were taught to carve them in a dream.", wait: [3, 8], next: [{ to: "church_grows", w: 2 }, { to: "purge", w: 1, mods: [["zealous", 2.5], ["harsh_law", 2]] }] },
        church_grows: { h: "The Joining preaches openly in {capital}", b: "{person} preaches that the flesh is a cell and the black is its key. Thousands follow, and the spires grow larger every month.", wait: [4, 10], fx: { unrest: 12, stability: -5, flag: "joining" }, next: [{ to: "convergence", w: 1, mods: [["unstable", 2], ["poor", 1.5]] }, { to: "purge", w: 1 }, { to: "scholar_stops_it", w: 0.7, mods: [["learned", 2.5], ["academies", 2]] }] },
        purge: { h: "{ruler} orders the spires smashed", b: "Soldiers went house to house in {capital}, breaking spires and dragging out their keepers. Some of the soldiers have started carving spires of their own.", wait: [3, 8], fx: { stability: 3, unrest: 10 }, next: [{ to: "purged", w: 2 }, { to: "convergence", w: 1, mods: [["chance:low", 2]] }] },
        purged: { h: "The last spire of {capital} is burned", b: "The Joining is broken and its preachers hanged. Nobody has dreamt the dream in a season, or so everyone says.", fx: { stability: 5 }, end: true },
        convergence: { h: "A district of {capital} becomes one body", b: "In a single night every soul in the spire-quarter of {capital} walked into the central square and did not walk out. What stands there now is very tall and is still growing.", fx: { pop: 0.85, stability: -20, unrest: 25, monument: { tier: 1, name: "The Joined Tower" } }, end: true },
        scholar_stops_it: { h: "A scholar silences the spires", b: "{person2} built a humming engine that drowns the spires' voice. The faithful woke as if from fever, and most cannot say what they believed.", fx: { science: { arcana: 1 }, stability: 6 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", who: "{official}, burn-warden captain", text: "From the burn-wardens' handbook, revised by {official}, captain, {year}: 'The black ichor is a substance that fell from the sky and reshapes anything it touches. It cannot be destroyed, only slowed. Cold slows it. Fire slows it more. Nothing slows it enough. Wardens will not touch it bare-handed under any order. The first fall is walled at {lead}.'", points: "site:first_fall" },
    { depth: "lore", about: "power", source: "oral", bias: "garbled", reliable: true, who: "a hospital nurse of {place}", text: "A nurse at the fever hospital of {place}, to a new surgeon, {year}: 'There's a saying on these wards: the star's blood mends anything, and then it keeps mending until there is nothing left of you to mend. I've seen it 14 times. A broken arm healed in a night, then the hand grew a second thumb, then a third.'" },
    { depth: "lore", about: "truth", source: "temple", bias: "pious", reliable: "partial", who: "a priest's sermon", text: "Sermon of the fallen star, preached each year on the anniversary of the fall at {place}, {year}: 'A light came down and broke on the hills, and its blood made saints of some and beasts of others. The gods were testing which was which. Pray you are never tested.' The priest asks the congregation of 300 to say the last line together." },
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: false, who: "the Royal Society of Mines", text: "Report of the Royal Society of Mines, {year}: 'The so-called black ichor is a mineral tar, dangerous when heated, which has been greatly exaggerated by miners' superstition. Our assay of 3 samples found nothing unusual. The assayer who handled the third sample has taken leave for his health.'" },

    { depth: "core", about: "truth:unfinished_bridge", source: "ruin", bias: "true", reliable: "partial", who: "{investigator}, glyph-copier", text: "Glyphs repeated on every spire, roughly rendered by {investigator}, {year}, from 40 rubbings: 'BUILD / FROM WHAT IS NEAR / OPEN / WE ARE WAITING ON THE OTHER SIDE'. Later hands disagree about the last line: some read 'IT IS WAITING'. The cleanest copy of the glyphs is on the spire kept under the temple at {lead}.", points: "site:spire_crypt" },
    { depth: "core", about: "truth:unfinished_bridge", source: "person", bias: "true", reliable: "partial", plain: true, who: "{investigator}, glyph-copier", text: "Notebook of {investigator}, glyph-copier, the night the translation came out, {year}: 'The figures are not a spell. They are a plan. The black is a building tool, sent here by makers who are long dead, and it is still doing its job. It builds a gate out of whatever is alive and nearby. It is an arch, and we are the stones. My full workings are lodged at {lead}.'", points: "library" },
    { depth: "core", about: "truth:unfinished_bridge", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a fisherman of {place}", text: "A fisherman of {place}, to the harbour master, {year}: 'I swear on my boat. Through the black ring I saw another sky, green as a bruise, with a dead city under it, and something very large walking between the towers. Taller than the towers. I've fished this bay 30 years. Go out to the ring at {lead} yourself, then call me a liar.'", points: "site:black_ring" },
    { depth: "core", about: "truth:unfinished_bridge", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "sealed report from the trials", text: "Sealed report from the trials of the Sealed House, {year}: 'Subject growth is not random. All forty grew toward the north wall. Subject 12, {person}, a debtor, was first to reach it and could not be separated from it. The north wall is facing the... [struck out]' The cellar where the forty went into the wall is at {lead}.", points: "site:living_wall" },
    { depth: "core", about: "truth:unfinished_bridge", source: "library", bias: "official", reliable: false, who: "the Admiralty notice", text: "Notice to mariners from the Admiralty of {realm}, {year}: 'The black coral ring in the bay is a natural reef, unusual only for its colour, and poses no danger to shipping. Its reported growth of 9 feet is a trick of the tides. Vessels may pass through it freely. Divers are advised not to.'" },

    { depth: "core", about: "truth:spire_harvest", source: "heretic", bias: "heretic", reliable: true, plain: true, who: "a former Joining preacher", text: "A former preacher of the Joining, writing from hiding in {year}: 'We thought we were carving the spires, but they were changing us. Every spire is a copy of the one under the temple, and every spire listens and speaks. When there are enough of them, they will all act together, once, and every person in the land becomes one body. I carved 9. Ask the preacher at {lead} how many.'", points: "cast:believer" },
    { depth: "core", about: "truth:spire_harvest", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, preacher of the Joining", text: "From the Joining's hymnal, as lined out by {believer} at the cellar service in {place}, {year}: 'Count the spires, beloved, and count the joined. When the two numbers meet, the one body will rise, and no one will be lonely ever again.' The preacher's tally board by the door read 412 spires and 3,906 joined." },
    { depth: "core", about: "truth:spire_harvest", source: "oral", bias: "garbled", reliable: "partial", who: "a harbour master of {place}", text: "The harbour master of {place}, to a visiting scholar, {year}: 'There's an old story in this town about a city on the far coast that walked into the sea, all of it, singing the same song. Ten thousand people. The sea gave nothing back. The story's 300 years old. The song is the one the Joining sings in its cellars now.'" },
    { depth: "core", about: "truth:spire_harvest", source: "person", bias: "true", reliable: "partial", cost: true, who: "a mother's petition", text: "Petition of a mother of {place} to the city magistrate, {year}: 'My child {person}, 17, went down to the cellar spire for the Joining's soup on a Sunday and came back smiling. On the 40th day {person} walked into the river with 30 others, holding hands and singing. None came out. The cellar is still open. Close it.' The magistrate's note: refer to {lead}.", points: "sub:spire_church" },
    { depth: "core", about: "truth:spire_harvest", source: "archive", bias: "official", reliable: false, who: "a crown proclamation", text: "Crown proclamation, read in the markets of {realm}, {year}: 'The cellar-cult is a fraud of beggars seeking alms. Its carvings are worthless soapstone and its preachers are drunkards. Citizens are not to be alarmed. The fine for carving a spire is raised to 5 crowns.' The fine has been paid 600 times this year, mostly by the Joining, which is not short of money." },

    { depth: "core", about: "truth:thinning_door", source: "ruin", bias: "true", reliable: true, plain: true, who: "a miner's scratchings", text: "Scratched into the mine gallery beside the black sheet, in a miner's hand, {year}: 'It is not a seam. It is a door to somewhere else, and every time the wardens burn it, it gets wider. It learns from us. Yesterday it made a hand. Today it made my hand, with my scar. 29 of us are going up. Not 31.' The mine is at {lead}.", points: "site:breathing_door" },
    { depth: "core", about: "truth:thinning_door", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, burn-warden, last letter", text: "Last letter of the burn-warden {person} to the captain {official}, {year}: 'I have lit 6 of the 9 towns you burned. Every burn makes the next outbreak worse, not better, as if the fire is wearing something thin. My own village is on the list now. I am going down the mine to look at the black myself. If I do not come back, burn nothing more. The towns are listed at {lead}.'", points: "sub:burned_town" },
    { depth: "core", about: "truth:thinning_door", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a broadsheet", text: "A broadsheet nailed to the burn-wardens' barracks door at {place}, {year}, 200 copies: 'THE BLACK IS NOT A THING. IT IS A WINDOW. STOP OPENING IT TO SEE WHAT IS INSIDE. STOP BURNING IT TO SEE WHAT HAPPENS. Every burned town is a wider window. Count the outbreaks: 3 in our grandparents' day, 11 in ours.'" },
    { depth: "core", about: "truth:thinning_door", source: "library", bias: "official", reliable: false, who: "the Physicians' College", text: "Finding of the Physicians' College of {realm}, {year}: 'The shared dreams of the eastern provinces, in which some 2,000 sleepers report the same grey city and the same tall figure, have been traced to spoiled rye and are no cause for alarm. The granaries have been ordered burned.'" },

    { depth: "sub", about: "sub:burned_town", source: "person", bias: "true", reliable: true, who: "{official}, burn-warden captain", text: "Diary of {official}, captain of the burn-wardens, the night after the burning at {place}, {year}: 'We counted them in through the gate, 380, and we counted the ashes. The numbers were not the same. Some of them had already walked out through the walls before we lit it. I have not written that in the report.'" },
    { depth: "sub", about: "sub:hidden_trials", source: "archive", bias: "redacted", reliable: "partial", who: "ledger of the Sealed House", text: "Ledger of the Sealed House, the great house's private workshop, {year}: '...forty subjects, forty doses, drawn from the debtors' prison. Healing excellent. Obedience excellent. Return of individual will: [blank]. Subjects moved to the cellar workshop at {lead} for the wall trial.' The last line is written in a different ink." , points: "site:living_wall" },
    { depth: "sub", about: "sub:half_changed", source: "oral", bias: "true", reliable: "partial", who: "{survivor}, one of the Half-Changed", text: "{survivor}, one of the Half-Changed, speaking to a hunter who had come to kill them, {year}: 'I survived the black at {place}. I heal from anything: a sword-cut closes in an hour. I hum in my sleep, the same three notes, and the dogs will not go near me. There are 60 of us in the hills now. We hear the spires. Put down the crossbow and ask what the spires are saying.'" },
    { depth: "sub", about: "sub:immune_child", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a pedlar's tale", text: "A pedlar, telling it at an inn on the border road, {year}: 'The child from the burned town walked out through the fire unmarked. I had it from a warden who saw it. The black fled from the child like water from oil. The Half-Changed have the child now, somewhere near {lead}, and the great house has put 500 crowns on finding it.'", points: "cast:survivor" },
    { depth: "sub", about: "sub:ichor_market", source: "traveller", bias: "true", reliable: true, who: "a smuggler's warning", text: "A smuggler of {place}, to a new runner, as recorded by a magistrate at the runner's trial, {year}: 'Never open the flask to check it. If it's real, you'll know by the warmth. If you've opened it, you'll know a different way. A thimble sells for 40 crowns to the great houses. They never ask what it's for, and we never ask either.'" },
    { depth: "sub", about: "sub:spire_church", source: "library", bias: "propaganda", reliable: false, who: "a city council report", text: "Report of the city council's charities committee, {year}: 'The Joining is a harmless charity of the poor quarter, whose soup kitchens, 14 in number, are a credit to the city. The committee saw no spires on its visit. The committee did not visit the cellars, which were closed for cleaning.'" },
    { depth: "site", about: "site:first_fall", source: "archive", bias: "redacted", reliable: "partial", who: "the founding charter", text: "Founding charter of the realm, clause 31, a clause no one reads aloud at coronations, copy of {year}: 'The Star's Grave shall be walled, and the wall kept, and no ruler shall enter it twice.' Beside it, in a later hand: 'Why twice?' The original charter is kept at {lead}.", points: "archive" },
    { depth: "site", about: "site:spire_crypt", source: "temple", bias: "pious", reliable: "partial", who: "the temple's burial rule", text: "From the burial rule of the oldest temple of the capital, read to each high priest at consecration, {year}: 'The high priests are buried beneath the altar, close to the holy stone, so that they may hear its voice for ever. It is a great honour, and in 70 consecrations none has refused it.' The rule does not say why they are buried curled." },
  ],
};
