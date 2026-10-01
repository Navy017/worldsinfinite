// The Unending Mobilization: the great war never ended; it became the economy, the faith and the calendar.
export default {
  id: "unending_mobilization",
  name: "The Unending Mobilization",
  family: "scifi",
  pitch: "The great war never ended. It became the economy, the religion and the calendar. No one alive remembers why it started, and nobody has seen the enemy up close.",
  slots: ["state-control", "economy-resource"],
  tone: ["grim", "satirical"],
  era: ["renaissance", "industrial", "modern"],
  scale: "world",
  genres: ["flintlock", "grimdark"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "luminous_aether", w: 3 }, { id: "balanced_circle", w: 2 }, { id: "charter_lords", w: 1.5 }, { id: "glyphwright_science", w: 1.5 }],

  truths: [
    { id: "staged", n: "The war is staged", d: "Both high commands answer to the same few forge families. They coordinate offensives by letter, trade provinces by appointment and set the casualty figures in advance, because a war keeps the factories full and the streets quiet. Every name on the casualty lists was agreed between cousins over dinner.", tags: ["truth:war_staged"],
      known: [
        "The war is older than anyone's grandparents. Leaflets from both sides carry the same misprints. A neutral merchant reports forge-barons of opposite sides dining together and arguing only over the wine.",
        "A ministry memorandum records an offensive 'agreed' to advance to the river and no further, with casualty figures 'as previously settled'. Staff officers say they knew enemy attack dates a month ahead.",
        "Both high commands answer to the same forge families. Offensives are arranged by letter, and the dead are counted before they die. The war is staged to keep the factories busy and the streets quiet.",
      ] },
    { id: "empty_front", n: "There is no enemy", d: "The enemy state collapsed generations ago. The front is held against an empty land, and a ministry office of frightened clerks writes the enemy's communiques, its atrocities and its casualty lists. Soldiers still die at the front every week, of our own shells, the winter and the fever, and the Bureau writes each death up as enemy action.", tags: ["truth:war_empty"],
      known: [
        "In forty years of logs, no observer has seen smoke from a chimney in the enemy capital. A scout who crossed the wire on a dare reported finding nobody, and was court-martialled for defeatism.",
        "An internal note asks for the enemy general's name to be varied, because the same name has been used for eleven years. The enemy's leaflets are printed on our own ministry's paper.",
        "The enemy is gone, and has been gone a long time. Our own Ministry of the Front writes the enemy's speeches and atrocities on a sealed floor in the capital. The front is held against an empty land.",
      ] },
    { id: "war_feeds", n: "The war feeds something", d: "Each death at the front sends power along buried cables to a huge engine under the capital. That power runs the city's furnaces and lights, and keeps the old founders alive. The founders built the war to feed the engine, and peace would starve it, and the city, and them.", tags: ["truth:war_engine"],
      known: [
        "The capital never goes cold, and its founders never seem to die. The Ministry of Works says the furnaces burn northern coal. A chaplain preaches that each of the fallen warms a hearth, and says it is no figure of speech.",
        "Sappers cut a buried cable far behind the lines stamped 'FRONT FEED, LINE 9. TO THE VAULT.' The front-line telegraph wires carry no messages. They are thick copper, and they all run to the capital.",
        "Under the War Ministry is an iron engine that beats faster whenever a casualty list is posted. The city runs on deaths at the front. The war is not fought to protect the capital. It is fought to feed it.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "an archivist of the War Ministry who keeps the three archives of the war's beginning", home: "capital", stance: "Has three records of the first battle, each stamped the only true one, and wants to know which is a lie, or whether all three are." },
    { role: "official", n: "a censor of the Bureau of Spirit, the ministry office that writes the war news", home: "capital", stance: "Believes the war holds the realm together, and that a true casualty figure would do more damage than a shell." },
    { role: "believer", n: "a regimental chaplain who preaches that the fallen warm the hearths of the realm", home: "inner", stance: "Believes every death at the front is a gift to the city, and means it more literally than the congregation knows." },
    { role: "survivor", n: "a one-legged veteran who speaks for the Mended Legion, the league of wounded soldiers", home: "border", stance: "Wants to be shown the hill the leg was given for, and wants the ministers to answer questions in public." },
  ],

  tags: ["endless_war"],

  subthemes: [
    { id: "empty_trench", n: "The Scout Who Came Back", d: "A scout crossed the wire on a dare, walked for a week and found no one. He has been arrested for spreading defeatism, and his regiment has been posted elsewhere.", w: 1, req: { any: ["frontier", "martial", "frontier_forts"] }, truthLink: "empty_front", tags: ["theme:empty_trench"] },
    { id: "shell_town", n: "The Shell Towns", d: "Whole towns exist to fill shells. Children sit at the benches from the age of eight and sing the regimental hymns to keep time.", w: 1.4, req: { any: ["artisans", "guilds", "has:city", "urbane"] }, tags: ["theme:shell_towns"], mark: { kind: "zone", n: "Factory belt", color: "#5a5048", size: [2, 4], where: "inner" } },
    { id: "pirate_radio", n: "The Night Choir", d: "A pacifist transmitter plays enemy folk songs after curfew. The Bureau of Spirit has hunted it for twenty years, and the songs sound a great deal like ours.", w: 1, req: { any: ["urbane", "scholarly", "egalitarian"] }, truthLink: "staged", tags: ["theme:night_choir"] },
    { id: "deserter_valley", n: "The Valley Off the Map", d: "Deserters from both sides have built a town in a valley the general staff maps leave blank. It trades quietly with everyone.", w: 0.9, req: { any: ["mountain", "forest", "hills", "marsh"] }, tags: ["theme:deserters"], mark: { kind: "zone", n: "The unmapped valley", color: "#6a8a5a", size: [1, 1], where: "remote" } },
    { id: "wonder_weapon", n: "The Wonder Programme", d: "A secret arsenal is building a weapon that frightens its own engineers. The test range has gone quiet, and so have the nearby villages.", w: 1, req: { any: ["scholarly", "academies", "standing_army", "autocracy"] }, tags: ["theme:wonder_weapon"] },
    { id: "walker_aces", n: "The Walker Aces", d: "The pilots of the great iron walkers are celebrities: their faces are on cigarette cards and their duels are serialised. Very few of them live to read their own.", w: 1.2, req: { any: ["martial", "warrior_code", "standing_army"] }, tags: ["theme:walker_aces"] },
    { id: "three_origins", n: "The Archivist's Three Wars", d: "A state archivist set out to find the war's first battle and found three, in three different centuries, each fought against a different enemy.", w: 0.8, req: { any: ["scholarly", "learned", "academies"] }, truthLink: "empty_front", tags: ["theme:three_origins"] },
    { id: "furnace_whisper", n: "The Hum Beneath the Capital", d: "Shell-shocked veterans in the capital's hospitals say they can hear a great engine under the floor, and that it speeds up on the days of big offensives.", w: 0.8, req: { any: ["has:city", "realm:large", "realm:vast"] }, truthLink: "war_feeds", tags: ["theme:furnace_hum"] },
    { id: "mended_legion", n: "The Mended Legion", d: "The maimed veterans are a political bloc of their own, with iron hands and wooden legs and a vote in every assembly. They are the only people who can say the war is pointless and not be shot.", w: 1.1, req: { any: ["republic", "egalitarian", "gov:commune", "martial"] }, tags: ["theme:mended"] },
    { id: "armistice_crash", n: "The Month of Peace", d: "Once, within living memory, an armistice was signed. Within a month the shell towns starved, the banks failed and a mob burned the peace commission. The war resumed to cheering.", w: 0.8, req: { any: ["mercantile", "gov:merchant", "rich", "guilds"] }, truthLink: "staged", tags: ["theme:month_of_peace"] },
    { id: "wire_truce", n: "The Wire Truces", d: "In some sectors the two front lines have not fired in years. They swap tobacco at the wire on feast days, and shoot over each other's heads when the inspectors come.", w: 1, req: { any: ["frontier", "pious", "hospitable"] }, tags: ["theme:wire_truce"] },
  ],

  sites: [
    { id: "first_trench", n: "The First Trench at $", kind: "shrine", where: "border", d: "The trench where the war is said to have begun, kept as a national shrine.",
      layers: {
        surface: { n: "The ribbons", text: "A preserved trench with a gilded firing step and a queue of pilgrims laying ribbons, about 3,000 a year. Ribbons cost a penny at the gate. The proceeds go to the Ministry of the Front." },
        study: { n: "The wrong way", text: "{investigator} measured the trench walls. The oldest layers are dug to face the other way, toward the capital. The firing step on that side is worn by feet, and the gilded step is not." },
        dig: { n: "Side by side", text: "Beneath the shrine floor is a second trench, older still, with bones in both uniforms lying side by side, facing the same direction. The archive that dates the first trench is held at {lead}.", points: "sub:three_origins" },
        revelation: { n: "Facing the capital", text: "The war did not begin against this enemy. The trench was first dug by both armies together, facing the capital, in a rising against the founders. The founders' Ministry invented the official story afterwards, and built the shrine on top of the evidence." },
      }, truthLink: "empty_front" },
    { id: "silent_capital", n: "The Smokeless City beyond $", kind: "anomaly", where: "border", d: "The enemy capital, visible from one high observation post through a long glass.",
      layers: {
        surface: { n: "The long glass", text: "Officers take visitors up the observation post to see the enemy capital's towers on a clear day. The glass is twelve feet long and was a gift of the forge families. Visitors sign a book. There are 9,000 signatures." },
        study: { n: "No smoke", text: "In forty years of logs, no observer has recorded smoke from a single chimney. One officer recorded a stork nesting on the enemy palace in {year}. The log was corrected by the Bureau to read 'enemy signal flag'." },
        dig: { n: "The cathedral nave", text: "A raiding party that reached the outskirts found roofs fallen in and birch trees growing through the cathedral nave. Its report was sent to the Translation Office at {lead}, and not seen again.", points: "site:enemy_desk" },
        revelation: { n: "Gone a long time", text: "The enemy is gone, and has been gone for three generations. The birches in the nave are 60 years old. Our own ministry keeps the war going anyway, because the shell towns, the banks and the Bureau would have nothing to do without it." },
      }, truthLink: "empty_front" },
    { id: "teletype_bunker", n: "The Sealed Command at $", kind: "ruin", where: "remote", d: "A sealed bunker of the old general staff, from which orders still arrive by teletype.",
      layers: {
        surface: { n: "The humming cable", text: "A concrete hill with a locked steel door and a humming cable running off toward the front. A sentry post outside has been manned for 140 years, though no sentry has ever been told what is inside." },
        study: { n: "Old generals", text: "Orders signed by generals who would now be 140 years old still arrive daily from this place, and are obeyed. {official} has the signatures on file and has never asked to meet the generals." },
        dig: { n: "The card drum", text: "Inside are dust, the generals' bones in their chairs, and a clockwork machine typing orders from a drum of punched cards. The cable it sends them down runs to a vault at {lead}.", points: "site:furnace_vault" },
        revelation: { n: "Routine", text: "The war is not being run by anyone in this room. It is a routine the old general staff set going and never switched off. Its last instruction reads 'Continue routine until further order'. The generals died before they punched the further order." },
      } },
    { id: "enemy_desk", n: "The Translation Office at $", kind: "dig", where: "capital", d: "A ministry building whose upper floors are closed even to ministers.",
      layers: {
        surface: { n: "Guarded floors", text: "A grey office of the Ministry of the Front, guarded more heavily than the palace. The upper three floors are closed even to ministers. Its staff of about 80 clerks are all paid at a captain's rate." },
        study: { n: "The paper", text: "Its paper orders match, sheet for sheet, the paper the enemy's leaflets are printed on: the same watermark, a lion and a wheel, from the same mill outside the capital." },
        dig: { n: "Atrocities, Spring", text: "On a sealed floor are type cases in the enemy's alphabet, drafts of enemy speeches, and a desk labelled 'Atrocities, Spring'. The clerks' pay sheets are countersigned by the Bureau censor at {lead}.", points: "cast:official" },
        revelation: { n: "Our own enemy", text: "The enemy's speeches, communiques and atrocities are written here, by our own ministry, on our own paper. The Bureau of Spirit has run the office for 60 years. Its clerks have written 700 enemy speeches. Several have been set for schoolchildren to learn by heart." },
      }, truthLink: "staged" },
    { id: "furnace_vault", n: "The Furnace Vault under $", kind: "dig", where: "capital", d: "A vault beneath the capital where every telegraph wire from the front comes to an end.",
      layers: {
        surface: { n: "Warm cellars", text: "Workmen say the cellars of the War Ministry are always warm, even in the hardest winter. Ice never forms on the pavements above them. The poor of the capital sleep on those pavements, about 200 a night." },
        study: { n: "The cables", text: "The front-line telegraph wires carry no messages. They are thick copper cables, buried 12 feet deep, and every one of them runs here. Line 9 alone is 300 miles long." },
        dig: { n: "The engine", text: "A vast iron engine, its pistons slick and red, beating faster whenever a casualty list is posted. The posting times are logged against the engine's speed in a ledger at {lead}.", points: "archive" },
        revelation: { n: "Fed", text: "The war is not fought to protect the capital. The capital runs on the deaths at the front, and so do the founders, who are kept alive in a warm room beside the engine. They built the war to feed it. A month of peace would put out every lamp in the city." },
      }, truthLink: "war_feeds" },
  ],

  beings: [
    { id: "trench_rat", n: "Wire rat", kind: "small", d: "Rats grown dog-sized on the front's unburied dead. They move in rivers at night and have learned to fear only gas.", danger: 1, biomes: ["grass", "tempforest", "swamp", "badlands"], look: { size: 0.6, group: [10, 80], move: "swarm", speed: 8, col: "#4a4038", col2: "#7a6a5a", body: "quad", active: "night", visible: true } },
    { id: "gas_crow", n: "Ash crow", kind: "bird", d: "Black crows with grey-burned throats that follow the guns and gather before an offensive, which soldiers say proves the birds read the orders.", danger: 0, biomes: ["grass", "badlands", "tempforest", "coldsteppe"], look: { size: 0.5, group: [5, 60], move: "flock", speed: 35, col: "#1a1a1a", col2: "#6a6a6a", body: "bird", active: "day", visible: true } },
    { id: "lost_walker", n: "Derelict walker", kind: "beast", d: "An abandoned iron war-walker whose clockwork pilot-brain still patrols an empty sector, firing at anything that moves.", danger: 3, biomes: ["badlands", "grass", "coldsteppe", "dryforest"], look: { size: 8, group: [1, 1], move: "solo", speed: 3, col: "#5a5248", col2: "#8a3a2a", body: "biped", active: "any", visible: true } },
  ],

  techs: [
    { id: "um_wire_and_trench", n: "Wire and trench", field: "warfare", level: 1, d: "Barbed wire, sandbags and the deep trench: the war becomes a place you can live in." },
    { id: "um_ration_books", n: "Ration books", field: "writing", level: 2, d: "Every mouth in the realm is counted, stamped and fed by quota. The counting never stops." },
    { id: "um_gas", n: "The yellow cloud", field: "alchemy", level: 2, d: "Poison drifted down the wind. Masks, rubber suits and dead lowlands follow." },
    { id: "um_walkers", n: "Iron walkers", field: "engineering", level: 3, d: "Two- and four-legged war engines that cross the mud no wheel can." },
    { id: "um_wireless_spirit", n: "The Bureau's voice", field: "writing", level: 4, d: "A speaking tube in every square: news, hymns and the day's victories, all approved." },
    { id: "um_earthshell", n: "Earthquake shells", field: "warfare", level: 5, d: "A shell that brings down a whole sector of the front. Both sides have them, and both sides know it." },
  ],

  units: [
    { id: "um_gas_troops", n: "Gas troopers", role: "infantry", wpn: "spear", kit: "light", ranks: 4, gap: 1.4, size: 120, w: 1, mods: [["theme:shell_towns", 2], ["standing_army", 2]] },
    { id: "um_raiders", n: "Trench raiders", role: "infantry", wpn: "axe", kit: "light", ranks: 2, gap: 1.5, size: 60, w: 1, mods: [["theme:empty_trench", 3], ["frontier", 2], ["martial", 1.5]] },
    { id: "um_walkers", n: "Walker company", role: "siege", wpn: "siege", kit: "plate", ranks: 1, gap: 12, size: 6, w: 0.5, mods: [["theme:walker_aces", 6], ["theme:wonder_weapon", 2]] },
  ],

  govs: [
    { id: "um_war_ministry", n: "War ministry", d: "Elections are suspended for the duration, and the duration has lasted ninety years. A council of ministers governs by emergency decree.", tags: ["gov:war_ministry", "autocracy"], w: 0.8, forms: ["Mobilised State of $", "Defence Council of $", "Wartime Commonwealth of $"], ruler: "Minister of the Front", mods: [["martial", 3], ["standing_army", 3], ["theme:shell_towns", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The Front", color: "#5a4a3a", size: [3, 6], count: [1, 1], where: "border", d: "A scar of trenches, craters and wire running across the continent." },
    { kind: "zone", n: "Gas lowlands", color: "#8a8a4a", size: [1, 3], count: [1, 2], where: "border", d: "Poisoned fields and dead woods where the yellow cloud settled and never fully lifted." },
  ],

  storylines: [
    { id: "um_crater_meeting", n: "Two Soldiers in a Crater", scale: "local", anchor: "frontier", w: 1.3, req: "endless_war",
      stages: {
        start: { h: "Two soldiers share a shell crater near {place}", b: "After a failed night attack, {person} found an enemy soldier, {person2}, sheltering in the same crater. Neither fired.", wait: [1, 3], next: [{ to: "compare_papers", w: 2 }, { to: "shot", w: 1, mods: [["harsh_law", 2], ["zealous", 1.5]] }] },
        compare_papers: { h: "The soldiers of {place} compare their newspapers", b: "{person} and {person2} swapped their side's papers by moonlight. The headlines were the same, word for word, with the names swapped.", wait: [2, 6], fx: { flag: "crater_papers" }, next: [{ to: "smuggled", w: 2 }, { to: "local_truce", w: 1, mods: [["theme:wire_truce", 3]] }] },
        shot: { h: "An enemy soldier is shot near {place}", b: "{person} did their duty. The soldier has been decorated, and no longer sleeps at night.", fx: { prestige: 1 }, end: true },
        smuggled: { h: "The twin newspapers reach {capital}", b: "Copies of the matching headlines are passing hand to hand in {capital}. The Bureau of Spirit calls them enemy forgeries; the Mended Legion is asking questions loudly.", fx: { unrest: 15, stability: -8 }, end: true },
        local_truce: { h: "A silent sector near {place}", b: "The trenches near {place} have stopped firing. The men trade tobacco at the wire, and the inspectors are paid not to notice.", fx: { stability: 2, peace: true }, end: true },
      } },
    { id: "um_armistice", n: "The Peace of {year}", scale: "realm", anchor: "realm", w: 1.2, req: ["endless_war", { any: ["unstable", "poor", "losing", "atwar"] }],
      stages: {
        start: { h: "{ruler} proposes an armistice", b: "Exhausted and broke, {realm} has sent envoys under a white flag. The forge cartels have sent their own envoys to {ruler}.", wait: [2, 6], next: [{ to: "signed", w: 2 }, { to: "ambushed", w: 1, mods: [["theme:month_of_peace", 3], ["autocracy", 1.5]] }] },
        signed: { h: "Peace is signed, and the factories fall quiet", b: "For the first time in living memory, the guns of {realm} are silent. The shell towns have no orders, and the banks are calling in their loans.", wait: [2, 5], fx: { stability: 4, treasury: -80 }, next: [{ to: "crash", w: 2, mods: [["theme:shell_towns", 2]] }, { to: "rebuilt", w: 1, mods: [["ruler:just", 2], ["egalitarian", 2]] }, { to: "nothing_there", w: 1, mods: [["learned", 1.5]] }] },
        ambushed: { h: "The peace envoys are killed on the road", b: "The delegation from {realm} was found shot in a ditch. Enemy bullets, says the Ministry. The bullets were stamped by a local foundry.", fx: { unrest: 10, war: "rival" }, end: true },
        crash: { h: "The war resumes to cheering in {capital}", b: "One month of peace emptied the bread queues of bread. When the Ministry announced new hostilities, crowds threw flowers.", fx: { stability: 6, unrest: -5, flag: "war_resumed" }, end: true },
        rebuilt: { h: "{realm} beats its shells into ploughshares", b: "{ruler} has turned the shell towns to making ploughs and rails. It is hungry, hard and quiet, and nobody has been shot for asking why.", fx: { growth: 0.002, stability: 8, prestige: 10 }, end: true },
        nothing_there: { h: "The peace commission crosses the wire and finds no one", b: "The commissioners of {realm} went to sign the treaty at the enemy capital. There was no one to sign it. The commission has not been allowed to report.", fx: { stability: -15, unrest: 20, discovery: "writing" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "propaganda", reliable: false, who: "school primer, fourth edition", text: "From the school primer, fourth edition, {year}, issued to 40,000 schoolrooms by the Bureau of Spirit: 'The War of Defence began when the enemy crossed our sacred border without warning, at dawn, with a thousand guns. We have never been the aggressor. Every child of {realm} owes the war a debt.'" },
    { depth: "lore", about: "truth", source: "library", bias: "propaganda", reliable: "partial", who: "{investigator}, ministry archivist", text: "Note by {investigator}, archivist of the War Ministry, on the school primer, ninth edition, {year}: 'This edition reads: \"The War of Defence began when the enemy sank our grain fleet.\" The fourth edition's border story is not mentioned, and no grain fleet appears in any shipping register. The three founding archives disagree as well. See {lead}.'", points: "sub:three_origins" },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: true, who: "a corporal in the line", text: "A corporal in the forward line, to a newspaper man visiting the trenches at {place}, {year}: 'We've got a saying here: the war is older than my grandfather and younger than the debt. Means the war started before any of us, and the loans started before the war. My pay's 4 pence a day. The interest on the war loan is 6.'" },

    { depth: "core", about: "truth:staged", source: "archive", bias: "redacted", reliable: "partial", who: "a ministry memorandum", text: "A memorandum of the Ministry of the Front, {year}, half blacked out: 'Agreed with ███ that the spring offensive will advance to the river and no further. Casualty figures as previously settled: 4,000 our side, 4,000 theirs. Wire to be cut at the third milestone.' The unredacted file copy is kept at {lead}.", points: "archive" },
    { depth: "core", about: "truth:staged", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a neutral merchant", text: "A neutral merchant, writing home from {place}, {year}: 'Last week I dined with a forge-baron of one side and his cousin, a forge-baron of the other, at a neutral inn. They had 9 courses and they argued only over who would pay for the wine. The war came up once, when one of them asked the other for a quieter sector next spring. It was granted.'" },
    { depth: "core", about: "truth:staged", source: "heretic", bias: "heretic", reliable: true, cost: true, who: "a Night Choir broadcast", text: "Night Choir broadcast, after curfew, {year}: 'Read their leaflets and read ours. Same misprints. Same printer. Ask who owns the press. Last week our singer {person} was taken from the stairs by the Bureau, and the transmitter with {person}. Tonight we sing from a cellar. The censor who signed the warrant works at {lead}.'", points: "cast:official" },
    { depth: "core", about: "truth:staged", source: "library", bias: "official", reliable: false, who: "{official}, Bureau of Spirit", text: "Notice issued by {official}, censor of the Bureau of Spirit, {year}, to be posted in every barracks: 'Any suggestion that the High Command communicates with the enemy is a lie of the enemy itself, and repeating it is treason under the Spirit Acts. The penalty is 10 years, or the front.'" },
    { depth: "core", about: "truth:staged", source: "person", bias: "true", reliable: "partial", plain: true, who: "a staff major's diary", text: "Diary of a staff major, {year}: 'We knew the date of their attack a month ahead, from a letter. Both commands answer to the same forge families. They arrange the offensives between them and set the dead in advance. We were told to thin the line there, 600 men. I asked why. I was promoted. The order came through the Bureau at {lead}.'", points: "site:enemy_desk" },

    { depth: "core", about: "truth:empty_front", source: "person", bias: "true", reliable: true, plain: true, who: "{person}, scout, at court-martial", text: "Statement of the scout {person} before a court-martial at {place}, {year}: 'I walked six days into their country. Nettles, empty barns, a church with no roof and a birch growing in it. Nobody. Their country is empty, and has been for years. There is no enemy. I swear it on my mother's grave.' The court found the scout guilty of defeatism. Sentence: the front." },
    { depth: "core", about: "truth:empty_front", source: "archive", bias: "redacted", reliable: "partial", who: "Enemy Affairs Office", text: "Internal note, Enemy Affairs Office, {year}: 'Communique for the month drafted, with 3 atrocities. Please vary the general's name; we have used ███ for eleven years and the man would now be ninety. Typesetting as usual on the top floor.' The office's sealed top floor is at {lead}.", points: "site:enemy_desk" },
    { depth: "core", about: "truth:empty_front", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "a sergeant's letter", text: "Letter of a sergeant at the front to the parents of {person}, {year}: 'The enemy shells always land in the same holes, as if one old gun has been firing from one spot for fifty years with nobody to aim it. One of them found {person} on the 9th. We took their trench next morning. It had been empty a long time. The towers you can see from {lead} are empty too.'", points: "site:silent_capital" },
    { depth: "core", about: "truth:empty_front", source: "library", bias: "official", reliable: false, who: "{official}, Bureau of Spirit", text: "Bureau of Spirit bulletin, signed by {official}, censor, {year}: 'The enemy's eastern armies number no fewer than a million men, as confirmed by the Bureau's latest count of their regimental colours: 230 colours seen through the long glass this year. Any citizen who doubts the count may volunteer for the front and count them personally.'" },

    { depth: "core", about: "truth:war_feeds", source: "person", bias: "garbled", reliable: "partial", cost: true, who: "an asylum physician's notes", text: "Notes of the physician at the capital asylum, {year}, on Sergeant {person}, who laid cable for the Ministry for 20 years: 'Patient lies with an ear to the floor. Says: \"It's under the floor. Every name they read out, it goes faster. Can't you hear it? It's eating the lists.\" Committed on the Ministry's order. The sergeant has not been allowed visitors.'" },
    { depth: "core", about: "truth:war_feeds", source: "ruin", bias: "true", reliable: true, plain: true, who: "a sapper officer's report", text: "Report of a sapper officer, far behind the lines, {year}: 'Cut a buried cable while digging a latrine. Stamped every yard: FRONT FEED, LINE 9. TO THE VAULT. DO NOT BREAK IN WARTIME. It carries no messages. It carries power, from the front to an engine under the War Ministry, and the deaths at the front are what drive it. We spliced it back. It ends at {lead}.'", points: "site:furnace_vault" },
    { depth: "core", about: "truth:war_feeds", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, regimental chaplain", text: "Sermon of {believer}, regimental chaplain, at the memorial service for 900 dead at {place}, {year}: 'The fallen give their lives for the city. Each one warms a hearth in {realm}, and lights a lamp, and turns a wheel. This is no figure of speech. When you post your son's name on the list, go home and feel the warmth.'" },
    { depth: "core", about: "truth:war_feeds", source: "library", bias: "official", reliable: false, who: "Ministry of Works accounts", text: "From the published accounts of the Ministry of Works, {year}: 'The capital's great furnaces are coal-fired and fed by the northern mines: 90,000 tons this year, as last year.' A clerk's pencil note in the archive copy: 'Northern mines closed in my father's time. Who signs for the coal?'" },
    { depth: "core", about: "truth:war_feeds", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a pamphlet", text: "A pamphlet left in the pews of the regimental chapel, {year}, 300 copies: 'Why do the founders never die? Why does the capital never go cold, though the northern mines closed 40 years ago? WE ARE THE COAL. Ask the chaplain at {lead} what \"no figure of speech\" means.'", points: "cast:believer" },

    { depth: "sub", about: "sub:shell_town", source: "oral", bias: "true", reliable: true, who: "a shell-town teacher", text: "A teacher in a shell town, {year}, writing down the skipping rhyme her pupils sing at the filling benches, where they start at eight years old: 'Fill it, cap it, paint it red, send it off to make them dead; one for Mother, one for Dad, one for the brother that I had.' She notes that 30 of her 40 pupils know the third line from experience." },
    { depth: "sub", about: "sub:pirate_radio", source: "archive", bias: "official", reliable: "partial", who: "{official}, Bureau of Spirit", text: "Bureau of Spirit circular, signed by {official}, censor, {year}: 'The so-called Night Choir is an enemy transmitter. Citizens who recognise its songs should report the singer who taught them. The Bureau notes that several songs resemble our own folk tunes. This is an enemy trick. 14 arrests this quarter.'" },
    { depth: "sub", about: "sub:walker_aces", source: "archive", bias: "propaganda", reliable: false, who: "a cigarette card", text: "A cigarette card, one of a set of 12, sold with Victory Brand, {year}: 'Captain {person}, Lion of the Mud, forty-one enemy walkers destroyed! Collect all twelve aces!' On the back: a picture of an enemy walker. A note in the archive copy: no enemy walker has been seen at close range by any surviving officer." },
    { depth: "sub", about: "sub:three_origins", source: "library", bias: "true", reliable: "partial", who: "{investigator}, ministry archivist", text: "Working notes of {investigator}, archivist of the War Ministry, {year}: 'First battle (Archive A): against the river-folk. First battle (Archive B): against the horse-kings. First battle (Archive C): against our own rebel south. Each is marked the only true record. All three are dated the same day. The shrine at {lead} matches none of them.'", points: "site:first_trench" },
    { depth: "sub", about: "sub:mended_legion", source: "person", bias: "true", reliable: true, who: "{survivor}, Mended Legion", text: "Speech of {survivor}, for the Mended Legion, to the assembly of {realm}, {year}: 'I gave this leg for a hill. Hill 70, the papers called it. Show me the hill on a map today. I'll wait. The archivist at {lead} looked for me, and Hill 70 has been taken and lost 31 times. It is the same hill every time.'", points: "cast:investigator" },
    { depth: "sub", about: "sub:armistice_crash", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a foreign correspondent", text: "A foreign correspondent's dispatch from {realm}, {year}: 'Peace lasted twenty-nine days. The shell towns were idle by the tenth, and the bread queues were empty of bread by the twentieth. By the thirtieth they were burning the peace commissioners in effigy and singing the old marching songs in the queues. The Ministry announced new hostilities to cheers.'" },
    { depth: "sub", about: "sub:empty_trench", source: "archive", bias: "true", reliable: "partial", who: "an observation post log", text: "Log of the observation post above the front, {year}, kept by the duty lieutenant: 'Clear day. Enemy capital visible through the long glass. No smoke from any chimney, 41st year without. Stork on the palace roof again. The scout who went over on a dare came back and said nobody is there. The scout has been arrested. The capital can be seen from {lead}.'", points: "site:silent_capital" },
    { depth: "site", about: "site:teletype_bunker", source: "ruin", bias: "true", reliable: true, who: "a scavenger's find", text: "A scavenger who broke into the sealed command, telling it to a pawnbroker at {place}, {year}: 'Old men's bones in chairs, 6 of them, in uniforms with gold on. A machine still typing. On the card drum somebody had painted: Continue routine until further order. The further order was never punched. I took the brass and left the rest.'" },
    { depth: "site", about: "site:first_trench", source: "temple", bias: "pious", reliable: "partial", who: "a shrine guide", text: "A guide at the First Trench shrine, to a party of 20 schoolchildren, {year}: 'Here the first ones stood and faced the dark. That is what the hymn says, and we sing it at the gilded step.' A child asked which way the dark lay. The guide pointed at the enemy. The oldest wall of the trench faces the other way." },
  ],
};
