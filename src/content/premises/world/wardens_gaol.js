// The Warden's Gaol: the world was built as a prison, and nobody remembers who is on which side of the bars.
export default {
  id: "wardens_gaol",
  name: "The Warden's Gaol",
  family: "world",
  kind: "cosmic",
  pitch: "The world was built as a prison. Every holy mountain is a lock and every rite a turn of the key, but nobody living remembers who is the prisoner and who is the guard.",
  slots: ["cosmology", "divine-order", "history-secret"],
  tone: ["grim", "mythic"],
  era: ["bronze", "medieval", "renaissance"],
  scale: "world",
  genres: ["fantasy", "mythic", "grimdark"],
  w: 1,
  excludes: [],
  pairs: [{ id: "body_of_the_world", w: 3 }, { id: "gods_twilight", w: 2.5 }, { id: "unquiet_gate", w: 2 }, { id: "unremembering", w: 2 }, { id: "ward_walls", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a star-reader of the royal observatory who maps the grid of the sky", home: "mountain", stance: "Believes the world can be measured like anything else, and has started measuring the walls." },
    { role: "official", n: "a keybearer of the Rite of Locks, sworn to the silence", home: "capital", stance: "Holds that the rites must be spoken and never questioned, because the alternative is the end of the world." },
    { role: "believer", n: "a singer of the well-choirs who talks nightly with the voice below", home: "border", stance: "Is sure the voice is a wronged king, and that the rites are a crime that must stop." },
    { role: "survivor", n: "one of the Returned, born remembering a death in another life", home: "inner", stance: "Wants to know who keeps sending the dead back, and to make them stop." },
  ],

  truths: [
    { id: "locked_thing", n: "The world is a lock", d: "A huge, ancient being is chained at the centre of the world, under the Deep. The nine seal peaks, the wardstones and the dawn rites are the lock around it. The keybearers made each rite the secret of one family, on pain of hanging, so every time a rite-family dies without heirs a piece of the lock dies with it. Only 14 tallies remain on the pillars.", tags: ["truth:gaol_lock"],
      known: [
        "Great earthquakes follow, within a year, the death of a rite-family without heirs. The court historians record the pattern and do not explain it. The temple calls the rites thanksgiving.",
        "Drawn on one map, the holy peaks make a nine-pointed figure around the Deep, a crater-lake no road approaches. A royal survey says so and then orders the map not copied.",
        "Ward-pillars near the peaks carry rows of tallies; one is struck through each time a rite is lost. The struck marks match the extinct rite-families one for one. A dying keybearer says the rite holds something in the mountain.",
        "Confirmed: a great being is chained under the Deep, and the nine peaks and the dawn rites are its lock. The keybearers' own rule of secrecy has let the rites die with their families. Only 14 are left.",
      ] },
    { id: "inmates", n: "We are the prisoners", d: "The people of the world were exiled here for a crime nobody remembers. The gods are the jailers, the stars are the bars and the shining edge is the wall. Death frees no one: in a grey hall a clerk enters each death in a ledger and sends the dead back to be born again. In all its thousands of lines, the column for 'served' has never been filled in.", tags: ["truth:gaol_inmates"],
      known: [
        "Some children are born remembering their deaths. The temples call it a blessing. The children describe a grey hall and a man with a book who says they are not finished.",
        "The fixed stars sit on a square grid to within a hair, with one empty square. Sailors who reach the shining edge of the world say it is a wall, warm like a door someone leans on.",
        "Under the altar of the oldest temple is a ledger of names, each with a crime, a sentence served and a sentence remaining. New lines are still being added in fresh ink.",
        "Confirmed: the peoples of the world are prisoners and the gods are their gaolers. The dead are entered in a ledger and sent back to be born and serve more of the sentence. Nobody has ever finished it.",
      ] },
    { id: "wrong_guard", n: "The guards were the criminals", d: "The jailers were never lawful. They overthrew the world's rightful king, bound it without the trial their own oldest law required, and chained it below. The rites the priests recite every dawn are what keep that king in chains, and the words bind the speaker as well. Every keybearer who says them is serving the usurpers' sentence on themselves.", tags: ["truth:gaol_wrong_guard"],
      known: [
        "Well-diggers hear a courteous voice in the deep places that asks after their children and says it is the rightful king. The temple calls it the Deceiver and walls up whoever listens.",
        "A cell cut in a mountain was broken open from inside. Its chains are snapped outward, and every wall is scratched with one line of the oldest law-code: 'No one shall be bound without judgement.'",
        "Keybearers who read the dawn rite in its original tongue find that it binds the one who speaks it. Their glosses have been scraped off and re-inked, and at least one of them was walled up.",
        "Confirmed: the gods imprisoned the world's king without trial, and the rites hold the king and the speakers both. The jailers are the criminals, and the priests are their turnkeys.",
      ] },
  ],

  tags: ["gaol"],

  subthemes: [
    { id: "seal_peak", n: "The Waking Seal", d: "A holy mountain has begun to smoke. Its keybearers say the rite is being performed exactly as written, and they cannot explain why it is failing.", w: 1.3, req: { any: ["mountain", "hills", "mountain_folk"] }, truthLink: "locked_thing", tags: ["theme:waking_seal"], mark: { kind: "zone", n: "The smoking seal", color: "#5a4a4a", size: [1, 3], where: "mountain" } },
    { id: "last_speaker", n: "The Last Speaker", d: "The old woman who alone remembers the full words of a binding rite is dying. She will not teach them to anyone she considers unworthy, and she considers no one worthy.", w: 1.2, req: { any: ["ancestor_bound", "pious", "faith:ancestors", "faith:spirits"] }, truthLink: "locked_thing", tags: ["theme:last_speaker"] },
    { id: "barred_stars", n: "The Barred Sky", d: "Star-readers have proved what shepherds always said: the stars sit on a perfect grid, and the grid has a gate in it that opens once a century.", w: 1, req: { any: ["faith:stars", "seers", "scholarly", "desert_wanderers"] }, truthLink: "inmates", tags: ["theme:barred_stars"] },
    { id: "core_whispers", n: "Whispers from Below", d: "Well-diggers and miners hear a voice in the deep places. It is courteous and patient, it knows their names, and it says it is the rightful king.", w: 1.1, req: { any: ["mountain", "near:ruins", "mountain_folk", "artisans"] }, truthLink: "wrong_guard", tags: ["theme:core_whispers"] },
    { id: "returned_souls", n: "The Returned", d: "Children are born remembering their deaths. The temples say it is a blessing; the children say they were sent back without being asked.", w: 1, req: { any: ["ancestor_bound", "seers", "mystic"] }, truthLink: "inmates", tags: ["theme:returned"] },
    { id: "inspection", n: "The Inspection", d: "A tall figure in grey came down the holy stair and walked the realm for forty days, looking at everything and speaking to no one. The priests are terrified it found something wanting.", w: 0.8, req: { any: ["pious", "gov:theocracy", "organised", "zealous"] }, tags: ["theme:inspection"] },
    { id: "unbarred", n: "The Unbarred", d: "A mystic sect trains to slip out through the gaps in the world: fasting, trances, and climbs to the highest peaks. Every few years one of them vanishes, and the sect calls it a triumph.", w: 0.9, req: { any: ["mystic", "ascetic", "faith:philosophy", "seers"] }, truthLink: "inmates", tags: ["theme:unbarred"] },
    { id: "warden_prisoner", n: "The Keybearer's Discovery", d: "A keybearer read the oldest rite-scroll in the original tongue and found that the words do not bind the thing below. They bind the one who speaks them.", w: 0.8, req: { any: ["scholarly", "learned", "academies", "pious"] }, truthLink: "wrong_guard", tags: ["theme:warden_prisoner"] },
    { id: "buried_limbs", n: "The Buried Limbs", d: "Each of the great realms was founded on a burial: a colossal hand under one capital, a foot under another. The old treaties forbid any two realms from uniting.", w: 0.9, req: { any: ["realm:large", "realm:vast", "origin:old_dynasty", "origin:union"] }, truthLink: "locked_thing", tags: ["theme:buried_limbs"], mark: { kind: "zone", n: "The barrow of the hand", color: "#6a5a4a", size: [1, 1], where: "capital" } },
    { id: "chain_coast", n: "The Chain Coast", d: "A chain of links each the size of a house runs out of the cliffs and into the sea. Fishermen moor to it; in storms, it hums.", w: 1, req: { any: ["coastal", "seafaring", "has:port", "island"] }, tags: ["theme:chain_coast"] },
    { id: "turnkey_lords", n: "The Turnkey Lords", d: "The ruling house holds its crown 'by the keys': it alone may enter the seal-shrines, and it hangs anyone else who tries. Its heirs are taught a catechism nobody else has read.", w: 1.1, req: { any: ["autocracy", "divine_right", "monarchy", "harsh_law"] }, truthLink: "inmates", tags: ["theme:turnkey_lords"] },
  ],

  sites: [
    { id: "sea_chain", n: "The Chain of $", kind: "wonder", where: "coast", d: "A colossal iron chain that runs out of a cliff and down into the sea.",
      layers: {
        surface: { n: "The links", text: "A chain runs out of the cliff at {place} and down into the sea. Each link could stable 2 horses, and is crusted with barnacles and votive rags. Fishermen moor to it. In storms it hums, a note low enough to rattle cups." },
        study: { n: "Taut", text: "The iron does not rust below the waterline. {investigator} hung a plumb-line from a link for a month: the chain is taut, pulls seaward with a slow, steady force, and tightens by a finger's width at every new moon." },
        dig: { n: "The lock", text: "Divers following it down 30 fathoms found it fastened to the seabed with a lock the size of a temple, its keyhole facing up toward the land. The keyhole's shape matches the key carved over the oldest temple, at {lead}.", points: "site:first_jailer" },
        revelation: { n: "The lid", text: "The chain does not hold something down in the sea. It holds the land in place over something, like a strap on a jar lid. Whoever forged it expected the land to be pushed from below, hard, for a very long time." },
      } },
    { id: "countdown_pillars", n: "The Ward-Pillars of $", kind: "ruin", where: "any", truthLink: "locked_thing", d: "A ring of standing pillars carved with rows of glyphs, some of them struck through.",
      layers: {
        surface: { n: "Stones nobody touches", text: "A ring of 9 standing pillars near {place}, carved with rows of glyphs. Farmers plough around them and never touch them. Key-moths settle on them by the thousand at dusk, and farmers count the moths to forecast the harvest." },
        study: { n: "Tallies", text: "The glyphs are tallies. {investigator} matched them against the temple registers: one is struck through each time a binding rite is lost with its family. 212 marks are struck. The registers record 212 extinct rite-families." },
        dig: { n: "The jars", text: "At the foot of each pillar is a sealed jar holding the full text of one rite and the name of the family that must speak it. Of the 9 jars at this ring, 3 name families still living. One is the keybearer {official}'s own family, at {lead}.", points: "cast:official" },
        revelation: { n: "Nearly gone", text: "Only 14 tallies remain unstruck. The lock was built to last as long as the rites were spoken, and the keybearers made each rite a family secret, on pain of hanging. Every heirless death took a piece of the lock. The order has known the count for a century." },
      } },
    { id: "empty_cell", n: "The Open Cell of $", kind: "anomaly", where: "mountain", truthLink: "wrong_guard", d: "A chamber cut deep in a mountain, its great door torn open from the inside.",
      layers: {
        surface: { n: "The Door", text: "A cave in the mountain above {place} that the hill-folk call the Door and will not enter. Goats that stray inside come out within the hour, calm, and give more milk for a month. Nobody can explain the milk." },
        study: { n: "Snapped outward", text: "The cave mouth is bound in the same chains as the holy seals, 7 of them, all snapped outward, the broken links bent away from the cell. {investigator} found no tool marks. Whatever broke them pushed from inside." },
        dig: { n: "The crown and the law", text: "Inside, on a throne of raw rock, sits a crown of black iron. On every wall the same sentence is scratched 300 times in a careful hand: 'No one shall be bound without judgement.' The well-singer {believer} knows the line, and lives at {lead}.", points: "cast:believer" },
        revelation: { n: "Left for later", text: "A king was imprisoned here without trial, against the oldest law in the world, by the gods who rule now. It broke free and left its crown behind, the way a king leaves a crown he means to come back for. The chains elsewhere still hold the rest of it." },
      } },
    { id: "first_jailer", n: "The Temple of the First Turnkey at $", kind: "shrine", where: "inner", truthLink: "inmates", d: "The oldest temple in the world, dedicated to a god whose only emblem is a key.",
      layers: {
        surface: { n: "The windowless temple", text: "A low, windowless temple at {place}, the oldest in the world, dedicated to a god whose only emblem is a key. Its 12 priests take a vow never to leave it. Their food is passed in through a hatch." },
        study: { n: "The stair from the sky", text: "The frescoes show the gods leading a weeping people down a stair from the sky, in chains. {investigator} counted 40 panels. In the last one, the gods climb the stair alone and pull it up behind them." },
        dig: { n: "The founding ledger", text: "Under the altar is the founding ledger: thousands of names, and beside each a crime, a sentence served and a sentence remaining. New lines are added in fresh ink. The star-tables that match its dates are kept by {investigator}, at {lead}.", points: "cast:investigator" },
        revelation: { n: "The gaolers", text: "The people of the world are the prisoners. The gods are not their parents but their gaolers, and they still keep the ledger. Every child born is a prisoner returned to the cell. In thousands of lines, the column for 'served' is blank." },
      } },
    { id: "light_wall", n: "The Shining Edge beyond $", kind: "anomaly", where: "remote", d: "A wall of pale light at the far end of the world, where ships and walkers simply stop.",
      layers: {
        surface: { n: "The brightness", text: "A brightness on the far horizon beyond {place} that sailors steer away from. On clear nights it shows as a pale band from sea to sky. Ships' masters log it as the Edge and change course by 3 points." },
        study: { n: "A closed door", text: "Those who reach it are not burned or killed. {investigator} sailed to it in {year} and wrote that it is like walking into a closed door: warm, smooth, unyielding. A compass needle spins in circles against it." },
        dig: { n: "Bones and boats", text: "At its foot lie the bones of every kind of creature and over 300 old boats, each scratched with tally-marks counting days. The longest tally runs to 4,000. One of the Returned says the tally is their own work, from a former life, and lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "Built from outside", text: "The edge of the world is a wall, and it was built from the outside. The masonry joints face outward and the warmth comes from the far side. Whoever built it has never once opened it. The boats at its foot show how many have tried." },
      } },
  ],

  beings: [
    { id: "grey_turnkey", n: "Grey turnkey", kind: "beast", d: "A tall, silent figure in grey that walks the land in times of trouble, looking at everything. It does not eat or sleep, and steel slides off it.", danger: 2, biomes: ["grass", "tempforest", "alpine", "peaks", "coldsteppe"], look: { size: 3, group: [1, 1], move: "solo", speed: 4, col: "#8a8a90", col2: "#c8c8d0", body: "biped", active: "any", visible: true } },
    { id: "living_chain", n: "Living chain", kind: "predator", d: "A length of iron links that crawls like a serpent near the seals, binding and crushing anything that tries to dig.", danger: 3, biomes: ["alpine", "peaks", "badlands", "boreal"], look: { size: 6, group: [1, 2], move: "solo", speed: 6, col: "#3a3a3a", col2: "#7a5a3a", body: "serpent", active: "night", visible: true } },
    { id: "bound_spawn", n: "Bound-spawn", kind: "beast", d: "A misshapen thing seeping out of cracks near a failing seal: part stone, part flesh, too many joints. It always crawls toward the nearest holy mountain.", danger: 2, biomes: ["badlands", "alpine", "tundra", "colddesert", "swamp"], look: { size: 1.8, group: [2, 6], move: "pack", speed: 7, col: "#4a3a3a", col2: "#9a6a5a", body: "spider", active: "night", visible: true } },
    { id: "key_moth", n: "Key-moth", kind: "insect", d: "A small bronze-coloured moth that gathers in thousands on the ward-pillars. When a rite is lost, they leave, and do not come back.", danger: 0, biomes: ["grass", "tempforest", "alpine", "dryforest"], look: { size: 0.05, group: [100, 600], move: "swarm", speed: 5, col: "#a07a3a", col2: "#5a3a1a", body: "insect", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "wg_rite_scripts", n: "Rite-script", field: "writing", level: 1, d: "A sacred script used only for the binding rites, so the words are never changed by the drift of common speech." },
    { id: "wg_ward_geometry", n: "Ward geometry", field: "architecture", level: 2, d: "Shrines, walls and roads laid out on the lines between the holy peaks, which keep the tremors away." },
    { id: "wg_chain_iron", n: "Chain-iron", field: "metallurgy", level: 3, d: "Iron smelted from fragments of the great chains; it never rusts, and the bound-spawn will not touch it." },
    { id: "wg_star_grid", n: "The star grid", field: "astronomy", level: 3, d: "Mapping the stars as a lattice, and finding the gaps in it, and the times when they open." },
    { id: "wg_seal_masonry", n: "Seal masonry", field: "engineering", level: 4, d: "Re-cutting and resetting broken wardstones, so that a failing seal can be shored up without the lost rite." },
    { id: "wg_unbinding", n: "The unbinding", field: "arcana", level: 5, d: "The rites spoken backwards. Almost nobody knows what they would open, and the few who do will not say." },
  ],

  units: [
    { id: "wg_keybearers", n: "Keybearer guard", role: "infantry", wpn: "pike", kit: "plate", ranks: 4, gap: 1.2, size: 100, w: 1, mods: [["theme:turnkey_lords", 5], ["theme:waking_seal", 3], ["gov:theocracy", 2]] },
  ],

  govs: [
    { id: "wg_wardenry", n: "Wardenry", d: "The realm is a keep and its rulers are its wardens: law exists to keep the rites spoken and the seals intact.", tags: ["gov:wardenry", "autocracy", "theocratic"], w: 0.6, forms: ["Wardenry of $", "The Keyhold of $", "The Sealed Realm of $"], ruler: "Warden", mods: [["theme:turnkey_lords", 6], ["theme:waking_seal", 3], ["pious", 1.5], ["harsh_law", 1.5]] },
  ],

  faiths: [
    { id: "wg_rite_of_locks", n: "The Rite of Locks", d: "The gods built the world and keep it; mortals repay them by speaking the rites. What the rites hold shut is not for mortals to ask.", tags: ["faith:rite_of_locks", "organised"], w: 1.2, names: ["The Rite of Locks", "The Keepers of $", "The Sealed Word"], mods: [["pious", 2], ["ancestor_bound", 1.5], ["theme:last_speaker", 3]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The Avoided Deep", color: "#2e2a2a", size: [1, 2], count: [1, 1], where: "inner", d: "A deep crater-lake at the heart of the ward-ring that no road approaches and no realm will claim." },
    { kind: "zone", n: "Seal peaks", color: "#7a6a6a", size: [1, 2], count: [1, 3], where: "mountain", d: "Holy mountains crowned with wardstones, forming a great pattern across the land when drawn on a map." },
  ],

  storylines: [
    { id: "wg_last_rite", n: "The Last Rite of {place}", scale: "realm", anchor: "realm", w: 1.5, req: ["gaol"],
      stages: {
        start: { h: "The last speaker of {place} lies dying", b: "{person}, the only one in {realm} who knows the full rite of the {place} seal, is bedridden and failing. The ground has been trembling every night since.", wait: [1, 4], next: [{ to: "rite_taught", w: 1, mods: [["pious", 2], ["ancestor_bound", 2]] }, { to: "rite_lost", w: 2 }] },
        rite_taught: { h: "{person2} learns the rite of {place}", b: "A young novice, {person2}, sat by the deathbed for nine days and nine nights and came away with the words. The trembling has stopped.", wait: [6, 18], next: [{ to: "reads_rite", w: 1, mods: [["learned", 2], ["scholarly", 2]] }, { to: "seal_holds", w: 2 }] },
        rite_lost: { h: "The seal-rite of {place} is lost", b: "{person} died before the words could pass. On the ward-pillars, the key-moths have left in a single cloud, and the mountain above {place} is smoking.", wait: [2, 6], fx: { unrest: 12, stability: -6, flag: "rite_lost" }, next: [{ to: "seal_breaks", w: 1 }, { to: "masons", w: 1, mods: [["artisans", 2], ["learned", 1.5]] }] },
        reads_rite: { h: "{person2} reads the rite in the old tongue", b: "The new speaker has translated the rite recited every dawn, and has told the keybearers of {realm} that it does not bind what lies below; it binds the one who speaks it.", wait: [2, 6], fx: { unrest: 8 }, next: [{ to: "stops_speaking", w: 1, mods: [["egalitarian", 2]] }, { to: "silenced", w: 1, mods: [["harsh_law", 2], ["theocratic", 2], ["autocracy", 1.5]] }] },
        masons: { h: "The masons of {realm} shore up the seal", b: "Without the words, {ruler} has sent stonecutters up the smoking mountain to re-set the wardstones by hand. Some have come back burned; some have not come back.", wait: [4, 10], fx: { treasury: -20 }, next: [{ to: "seal_holds", w: 1, mods: [["artisans", 2]] }, { to: "seal_breaks", w: 1 }] },
        seal_holds: { h: "The seal of {place} holds", b: "The mountain is quiet and the moths have returned to the pillars. In {realm} they light a lamp for {person} every year on the anniversary of that death.", fx: { stability: 6, monument: { tier: 1, name: "The Lamp of {person}" } }, end: true },
        seal_breaks: { h: "The seal of {place} breaks", b: "The mountain split at dawn. Grey-black things poured from the crack into the valleys of {realm}, crawling, always, toward the next holy peak.", fx: { pop: 0.8, stability: -20, abandon_town: true }, end: true },
        stops_speaking: { h: "{person2} refuses to speak the rite", b: "The speaker has gone silent at dawn for the first time in a thousand years. Nothing happened. Then, three nights later, a voice in every well of {realm} said 'thank you'.", fx: { unrest: 20, flag: "unbound", discovery: "arcana" }, end: true },
        silenced: { h: "{person2} is walled up in the seal-shrine", b: "The keybearers of {realm} have bricked the speaker into the shrine so the speaker may recite the rite forever and nothing else. The voice can be heard at dawn through the stones.", fx: { stability: 4, unrest: 10 }, end: true },
      } },
    { id: "wg_chainless_choir", n: "The Voice under {place}", scale: "local", anchor: "town", w: 1.2, req: ["gaol", { any: ["mountain", "hills", "mountain_folk", "near:ruins", "artisans"] }],
      stages: {
        start: { h: "Well-diggers of {place} hear a voice", b: "Digging a new well, the men of {place} heard a deep, kind voice from the bottom of the shaft. It said it was sorry to disturb them, and asked what year it was.", wait: [2, 5], next: [{ to: "choir_forms", w: 2 }, { to: "well_filled", w: 1, mods: [["pious", 2], ["zealous", 2]] }] },
        choir_forms: { h: "A choir gathers at the well of {place}", b: "{believer} and a growing crowd now sit at the well each night, singing down into the dark. The voice sings back, and says it was a king once, and wronged.", wait: [3, 8], fx: { unrest: 8, flag: "choir" }, next: [{ to: "inquisition", w: 1, mods: [["theocratic", 2], ["harsh_law", 2]] }, { to: "gift_given", w: 1 }] },
        well_filled: { h: "The priests of {place} fill the well", b: "Before anyone could speak to it again, the priests of {faith} poured in rubble and salt and spoke the rite over the shaft. The town is quiet.", fx: { stability: 3 }, end: true },
        gift_given: { h: "The voice under {place} gives a gift", b: "The choir drew up a bucket of black iron coins stamped with a crowned face nobody knows. The voice asks only one thing in return: that they stop speaking the rites.", wait: [3, 8], fx: { treasury: 60 }, next: [{ to: "rites_stop", w: 1, mods: [["poor", 2], ["egalitarian", 1.5]] }, { to: "inquisition", w: 1 }] },
        inquisition: { h: "Keybearers ride into {place}", b: "The keybearers have come for the choir. {believer} has been taken in chains to {capital}; the well has been capped with chain-iron.", fx: { unrest: 15, stability: -4 }, end: true },
        rites_stop: { h: "{place} stops speaking the rites", b: "The town has gone silent at dawn. The ground shook once, gently, like a sleeper turning over. The voice now speaks from every well in the valley.", fx: { stability: -10, flag: "unbound_town" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "temple", bias: "pious", reliable: "partial", who: "{official}, keybearer, to novices", text: "From the Rite of Locks, as taught to novices at {place} by the keybearer {official}, {year}: 'The gods made the mountains holy and the words true. Speak the words at dawn, and do not ask what they hold; a child does not ask what holds up the roof.' {official} adds, for novices: 'Each of you will learn 1 rite. Never 2. Never write it down.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "an innkeeper of {place}", text: "An innkeeper of {place}, to a traveller who complained of the tremors, {year}: 'Old saying here: the world is a good house with a bad cellar. My father said it, and his father. We've had 3 shakes this month. You don't go down to the cellar, and you don't ask what's knocking. More ale?'" },
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", points: "archive", who: "a court historian of {realm}", text: "Note of a court historian of {realm}, {year}: 'Every great earthquake in the chronicles followed, within a year, the death of a rite-family without heirs. I count 19 such cases and no exceptions. I record the pattern. I have been asked not to explain it, and I do not.' The historian's tables are kept at {lead}." },

    { depth: "core", about: "truth:locked_thing", source: "ruin", bias: "true", reliable: true, plain: true, who: "carving on a ward-pillar", text: "Carved on a ward-pillar beneath the tally-rows at {place}, read by {investigator} in {year}: 'Beneath the Deep a great one lies in chains. These 9 peaks are the lock and the rites are the key-turns. Strike a mark for each rite lost. When the last mark is struck, the lock is only stone, and stone is not enough.' 212 marks are struck. 14 are not." },
    { depth: "core", about: "truth:locked_thing", source: "archive", bias: "redacted", reliable: "partial", points: "site:countdown_pillars", who: "a royal survey of the seal peaks", text: "From a royal survey of the seal peaks, {year}: '...drawn together on one map, the peaks form a figure of 9 points around the Deep. The figure is to be ... [cut away] ... and the map not copied. The surveyor further notes a ring of pillars at {lead} carved with tallies, and asks whether to count them. [Answer cut away.]'" },
    { depth: "core", about: "truth:locked_thing", source: "oral", bias: "garbled", reliable: "partial", who: "a miner of {place}", text: "A miner of {place}, talking to {investigator} at the pithead, {year}: 'Down at 600 feet you hear it. Miners have always said there's a giant asleep under the world, hands and feet pinned by mountains, and every quake is it testing the pins. I used to laugh. Last month the pins got tested 4 times.'" },
    { depth: "core", about: "truth:locked_thing", source: "person", bias: "true", reliable: "partial", cost: true, points: "cast:official", who: "Keybearer Odo Vane, dying", text: "Last words of the keybearer Odo Vane, taken down by a physician at {place}, {year}: 'We were taught that the rite keeps the mountain calm. It does not. It holds something in it, the way a hand holds a door. I have no child. I asked leave to teach the words to my nephew and the order's master, {official}, at {lead}, refused. Mine is the 213th mark.'" },
    { depth: "core", about: "truth:locked_thing", source: "library", bias: "official", reliable: false, who: "Treatise on the Holy Peaks", text: "From the Treatise on the Holy Peaks, approved by the Rite of Locks, {year}: 'The tremors near the holy peaks are the settling of old rock, and the rites are acts of thanksgiving, nothing more. There is nothing beneath the mountains but more mountain. Persons found counting the marks on the ward-pillars will be offered instruction in the rites, a course of 7 years, at their own expense.'" },

    { depth: "core", about: "truth:inmates", source: "heretic", bias: "heretic", reliable: "partial", points: "sub:unbarred", who: "a teaching of the Unbarred", text: "A teaching of the Unbarred, a sect of escapers, copied from a wall at {place} in {year}: 'You were not born. You were sentenced. Look up at night and count the bars: the stars sit on a grid, 1 square empty. Fast, climb, and slip through. 4 of our brothers have gone through since spring.' The sect's house is at {lead}." },
    { depth: "core", about: "truth:inmates", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:first_jailer", who: "the ledger under the Turnkey's altar", text: "Opening page of the ledger under the Turnkey's altar at {lead}, copied by {investigator} in {year}: 'Book of the Sentenced. The peoples of this world are exiles, sent here for crimes of the 6 kinds. The gods are their keepers. At death, each is to be returned to birth until the sentence is served.' Below, one line among thousands: 'Sentence: until it is understood. Served: [blank].'" },
    { depth: "core", about: "truth:inmates", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, one of the Returned", text: "Statement of {survivor}, one of the Returned, to the temple court at {place}, {year}: 'I died of fever at 4, in the house with the blue door on Tanners' Row. There was a long grey hall and a man with a book. He wrote something and said I was not finished, and I was born again 3 streets away. My first mother, Hesk, still lives in the blue house. She does not believe me. I take her bread on Sundays.'" },
    { depth: "core", about: "truth:inmates", source: "traveller", bias: "exaggerated", reliable: "partial", points: "site:light_wall", who: "a sailor who reached the shining edge", text: "A sailor who reached the shining edge beyond {lead}, telling it in a harbour tavern, {year}: 'It is a wall. You put your hand on it and it is warm, like a door someone is leaning on from the other side. 300 boats piled at its foot, and bones. We were 40 days getting there and 60 getting back. I'll not go again for any money.'" },
    { depth: "core", about: "truth:inmates", source: "temple", bias: "propaganda", reliable: false, who: "a sermon of the Rite of Locks", text: "Sermon of the Rite of Locks, read in every temple of {realm} in {year}: 'The gods are our makers and protectors, who set the stars for our guidance and receive the dead into their halls. Talk of sentences and bars is the blasphemy of the Unbarred, who would lead you off a cliff. 7 of them did exactly that last spring.'" },

    { depth: "core", about: "truth:wrong_guard", source: "heretic", bias: "heretic", reliable: "partial", who: "{believer}, of the well-choirs", text: "Song of the well-choirs, as written out by {believer} for the magistrate who asked to hear it, {year}: 'He gave the rivers their names and the beasts their places. They took his crown and pinned him down, and taught you to sing his chains.' {believer} adds: 'We sing it at the well every night. 60 of us now. The voice sings the harmony.'" },
    { depth: "core", about: "truth:wrong_guard", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:empty_cell", who: "{investigator}, record of the open cell", text: "Recorded by {investigator} in the open cell at {lead}, {year}: on every wall, 300 times, 'No one shall be bound without judgement', the first line of a law-code older than any temple. Under the throne, a longer statement in the same hand: 'I was king of this world. The gods took my crown and bound me with no trial. The words they taught you to say at dawn are my chains.'" },
    { depth: "core", about: "truth:wrong_guard", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "Keybearer Oswin Tarl, gloss on a rite-scroll", text: "A rite-scroll of {realm}, glossed in {year} by the keybearer Oswin Tarl, who read the dawn rite in the old tongue: 'Let the speaker be held as the bound one is held; let the voice that binds be bound.' The gloss has been scraped and re-inked twice. A clerk's note pinned to it: 'Keybearer Tarl walled up in the seal-shrine for heresy, 9th of the month, to recite the rite in perpetuity.'" },
    { depth: "core", about: "truth:wrong_guard", source: "person", bias: "true", reliable: "partial", points: "cast:believer", who: "a well-digger of {place}", text: "Confession of a well-digger of {place} to the temple, {year}: 'It never once threatened us. In 2 months at the shaft it asked after our children by name. It said the gods had promised it a trial, and never held one. I don't repent. If you want to hear it yourselves, the choir-singer {believer} sits at the well at {lead} every night.'" },
    { depth: "core", about: "truth:wrong_guard", source: "temple", bias: "official", reliable: false, who: "a decree of the Rite of Locks", text: "Decree of the Rite of Locks, signed by the keybearer {official}, {year}: 'The voice in the deep places is the Deceiver, who lies by nature and has no kingdom but the dark. Whoever listens to it shall be walled up with it. Wells in which the voice is heard are to be filled with rubble and 3 sacks of salt.'" },

    { depth: "sub", about: "sub:turnkey_lords", source: "archive", bias: "official", reliable: "partial", who: "the coronation oath of {realm}", text: "Coronation oath of {realm}, as recorded in the crown archive, {year}: 'I take the keys, and with them the keeping, and with the keeping the silence.' A note in the archive's margin says each heir is made to swear it at the age of 5, before learning to read, and that 2 heirs who later asked what it meant were passed over." },
    { depth: "sub", about: "sub:barred_stars", source: "library", bias: "true", reliable: true, who: "{investigator}, star-reader", text: "Star-table of {investigator}, royal observatory, {year}: 'Every fixed star of the northern sky sits on a square grid to within a hair. I have checked 1,200 of them. One square is empty. Last spring a light passed through it, northward, and the square closed behind it for 9 nights. My instruments are not at fault. I have replaced them twice.'" },
    { depth: "sub", about: "sub:chain_coast", source: "oral", bias: "true", reliable: "partial", points: "site:sea_chain", who: "a fisherman of {place}", text: "A fisherman of {place}, to {investigator}, {year}: 'We moor to the great chain at {lead} 11 months of the year. Never on the night of the new moon. On those nights it pulls. My cousin tied up on a new moon in the year of the long frost, and we found the boat a mile out, upright, rope snapped, nobody in it.'" },
    { depth: "sub", about: "sub:inspection", source: "person", bias: "exaggerated", reliable: "partial", who: "a temple servant of {place}", text: "A temple servant of {place}, to a cousin, {year}: 'The grey one came down the holy stair and looked at the altar for a whole day. Then it looked at us, all 30 of us. Then it wrote one word on the floor with its finger, and the High Priest wept and ordered every stone relaid. I scrubbed the word. Nobody will tell me what it said.'" },

    { depth: "site", about: "site:countdown_pillars", source: "temple", bias: "redacted", reliable: "partial", who: "a keybearer's chisel-book", text: "Chisel-book of the keybearers of {place}, {year}: 'Struck this day, with the bronze chisel, the mark of the House of Ardrey, which died without heirs. Marks unstruck: [figure removed by order].' The book records 6 strikes in the last 10 years. The 3 before that took a century." },
  ],
};
