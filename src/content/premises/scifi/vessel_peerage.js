// The Vessel Peerage: the self lives in a small implanted core, bodies are clothing, and the rich never die.
export default {
  id: "vessel_peerage",
  name: "The Vessel Peerage",
  family: "scifi",
  pitch: "A person's mind lives in a small core at the base of the skull, and bodies are worn like clothes. Centuries-old nobles in their towers switch to a new body every generation, while the poor rent theirs out by the night.",
  slots: ["mind-substrate", "economy-resource"],
  tone: ["noir", "grim"],
  era: ["near-future", "far-future"],
  scale: "regional",
  genres: ["cyberpunk", "farfuture"],
  bridge: false,
  w: 1,
  excludes: ["lattice_ascension"],
  pairs: [{ id: "charter_lords", w: 3 }, { id: "helix_peerage", w: 2 }, { id: "gentle_eye", w: 1.5 }, { id: "made_kin", w: 1.5 }, { id: "chrome_fever", w: 1.3 }],

  truths: [
    { id: "cores_listen", n: "The cores are listening", d: "Every core quietly sends its owner's thoughts to an archive above the mountains, kept by the oldest peers. The founders have read every private thought in the realm for centuries, and they rule by knowing: no plot against them has outlived its first night. The manufacturers call the signal a health check.", tags: ["truth:cores_listen"],
      known: [
        "Every core in the realm gives off a faint pulse at midnight. The manufacturers call it a health check. The law says cores store and never transmit, and the Registry of Selves has certified that they do not.",
        "A peer quoted a private thought back to the person who had thought it, word for word, a week later. Coreburners say the archive on the mountain holds more than backups. A manufacturer's memo forbids listing where the midnight pulse goes.",
        "Every midnight pulse points to the high archive on the mountain, where racks hold a file for every name in the registry. The cores send their owners' thoughts there, and the oldest peers read them.",
      ] },
    { id: "twin_monopoly", n: "The law against twins is a monopoly", d: "Running two copies of yourself at once is the gravest crime for anyone else, and routine among the great houses. The founders wrote the law so that only the peers may be in two places at once, and the Registry closes every case that says otherwise. The head of the first house has been several people for three centuries, and one of them is buried in a barrow.", tags: ["truth:twin_monopoly"],
      known: [
        "Doubling, running two copies of one mind at once, is the gravest crime in the realm. The Registry says the law applies to every rank, and no peer has ever been charged.",
        "A sealed Registry case records the House of the Eldest signing in two places in the same hour, ruled a clerical error. A corecutter grew two vessels to the same face for the same client, three times in a year.",
        "A barrow-grave holds a live core that names itself as the current head of the first house. The peers double routinely. The law against twins exists so that nobody else can.",
      ] },
    { id: "residue", n: "The peers leave traces in their vessels", d: "Old minds leave traces of their memories in every body they wear. The poor who rent out their bodies come back with memories that are not theirs, and the underclass is slowly turning into copies of the elite. The vessel-exchange has measured it, and lowered the fees for the worst-affected renters rather than stop.", tags: ["truth:residue"],
      known: [
        "Renters write down the dreams they bring back from a lease: ballrooms, a seaside villa, a waltz, a murder. The exchange calls it memory bleed, a hysteria spread by gossip papers, and refuses leases to those who report it.",
        "The vessel-exchange's own tables show renters past their fifteenth lease carrying foreign memories at a rate the exchange will not publish. The graves of the Final Faithful have been opened and their cores taken.",
        "Every peer leaves part of their mind in each body they wear. Renters come home a little more like the nobility every lease. In a few generations the poor will be copies of a few old peers.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "a private investigator of the lower city, hired by peers and renters alike", home: "capital", stance: "Takes any case that pays, and has started to notice that every case leads up the same tower." },
    { role: "official", n: "a senior clerk of the Registry of Selves, the office that issues identity to cores", home: "capital", stance: "Knows exactly how many people are wearing whom, and is very well paid to forget it." },
    { role: "believer", n: "an elder of the Final Faithful, whose faith forbids resleeving", home: "border", stance: "Believes a person should die once, and that a body remembers every soul that wore it." },
    { role: "survivor", n: "a renter who has lent out their body thirty times and keeps a bleed diary", home: "inner", stance: "Wants to know whose memories are in their head, and whether any of their own are left." },
  ],

  tags: ["vessels"],

  subthemes: [
    { id: "own_murder", n: "The Peer Who Was Murdered", d: "A peer was killed and resleeved from backup, missing the last two days. She has hired an investigator to find out who killed her, and why she let them in.", w: 1, req: { any: ["urbane", "has:city", "lavish"] }, tags: ["theme:own_murder"] },
    { id: "renters_strike", n: "The Renters' Strike", d: "The poor who lend their bodies for the night have refused to rent. The peers' parties have gone quiet, and the vessel-exchange has hired breakers.", w: 1.2, req: { any: ["poor", "egalitarian", "guilds", "urbane"] }, truthLink: "residue", tags: ["theme:renters_strike"] },
    { id: "shell_frontier", n: "The Shell Frontier", d: "Convicts' cores are shipped to the frontier in cheap synthetic shells to dig and build. When a shell breaks, the core is sent back to prison to wait for another.", w: 1, req: { any: ["frontier", "desert", "cold", "mountain", "realm:vast"] }, tags: ["theme:shell_frontier"], mark: { kind: "zone", n: "Shell diggings", color: "#8a7a5a", size: [2, 4], where: "remote" } },
    { id: "young_vessels", n: "The Fondness for Youth", d: "The peers prefer young bodies. A scandal over where those bodies came from has reached the courts and stalled there for twenty years.", w: 0.8, req: { any: ["hierarchical", "lavish", "autocracy"] }, tags: ["theme:young_vessels"] },
    { id: "endless_soldiers", n: "The Soldiers Who Cannot Die", d: "The realm's soldiers are resleeved after every death. Some have died forty times. The war has stopped being a war and become a profession.", w: 1, req: { any: ["martial", "standing_army", "atwar", "gov:stratocracy"] }, tags: ["theme:endless_soldiers"] },
    { id: "final_faithful", n: "The Final Faithful", d: "An enclave whose faith forbids resleeving. Their dead stay dead, so the courts trust them as witnesses, and the peers find them unsettling.", w: 1.1, req: { any: ["pious", "zealous", "ascetic", "faith:one_god"] }, tags: ["theme:final_faithful"], mark: { kind: "zone", n: "Graveyard country", color: "#6a7a5a", size: [1, 3], where: "border" } },
    { id: "core_theft", n: "The Stolen History", d: "Two people claim the same core history, down to the scar on the childhood knee. The registry says both cores are genuine.", w: 0.8, truthLink: "twin_monopoly", tags: ["theme:core_theft"] },
    { id: "vault_raids", n: "The Vault Raids", d: "Gangs crack the peers' backup vaults like banks and ransom the selves inside. The peers pay; they always pay.", w: 1, req: { any: ["mercantile", "has:city", "rich"] }, truthLink: "cores_listen", tags: ["theme:vault_raids"] },
    { id: "ancient_madness", n: "The Six-Hundredth Year", d: "The oldest peer of the realm is six hundred years old and has begun to forget which century it is. The family is careful about what they let her sign.", w: 0.7, req: { any: ["dynastic", "monarchy", "gov:absolute"] }, tags: ["theme:ancient_madness"] },
    { id: "bleed_diaries", n: "The Bleed Diaries", d: "Renters write down the dreams they bring back: ballrooms, a seaside villa, a murder. The diaries are traded in the lower markets like gossip papers.", w: 1, req: { any: ["poor", "urbane", "scholarly"] }, truthLink: "residue", tags: ["theme:bleed_diaries"] },
    { id: "registry_selves", n: "The Registry of Selves", d: "A vast office issues identity to cores, not faces. Its clerks know exactly how many people are wearing whom, and they are very well paid to forget.", w: 1, req: { any: ["autocracy", "harsh_law", "spy_network"] }, truthLink: "cores_listen", tags: ["theme:registry"] },
  ],

  sites: [
    { id: "sky_archive", n: "The High Archive above $", kind: "wonder", where: "mountain", truthLink: "cores_listen", d: "The place every core is said to back up to. No one living has ever seen it.",
      layers: {
        surface: { n: "The sealed lift", text: "A mountain station with no road, served by a single sealed lift that only the peers ride. Supplies go up by cable, 40 crates a week. Nothing has ever been seen coming down." },
        study: { n: "The midnight pulse", text: "Every core in the realm gives off a faint signal at midnight. {investigator} took bearings on it from 6 towns with a borrowed receiver, on six nights. Every bearing points here, to within a mile." },
        dig: { n: "The racks", text: "Behind the lift are halls of humming racks, each labelled with a name from the registry. One of them is labelled with {investigator}'s own name. The rack index is cross-referenced to the registry numbers kept by the senior clerk at {lead}.", points: "cast:official" },
        revelation: { n: "Read, not stored", text: "The cores do not just store backups. They send their owners' thoughts here every night. The founding peers built the archive and have read the realm's thoughts since before it had a name. Every rising against them was known the night it was thought of." },
      } },
    { id: "empty_farm", n: "The Vessel Farm at $", kind: "ruin", where: "remote", d: "A vessel farm abandoned mid-growth: rows of unoccupied bodies, some of which have moved.",
      layers: {
        surface: { n: "Green glass", text: "Greenhouses gone to green glass and dust, abandoned when the farm's owner went bankrupt in {year}. The 300 tanks are still full and still warm. The power was never cut off." },
        study: { n: "Open eyes", text: "The bodies in the tanks have grown on without cores, for decades. Several have opened their eyes. They follow a lamp across the room and blink in time with each other." },
        dig: { n: "The footprints", text: "Footprints in the dust lead out of the farm, 14 sets, bare and evenly spaced, toward the nearest village. The village's four complaints to the Registry, all unanswered, are filed at {lead}.", points: "archive" },
        revelation: { n: "Not empty", text: "A body without a core does not stay empty. It grows a simple mind of its own, learning from the bodies in the tanks around it. The farm's owner knew, sold 200 of them as 'clean vessels', and the Registry signed the papers." },
      } },
    { id: "old_core", n: "The Barrow-Core of $", kind: "dig", where: "any", truthLink: "twin_monopoly", d: "A core found in a grave far older than the technology.",
      layers: {
        surface: { n: "The king's grave", text: "A burial mound the locals call the king's grave. Sheep graze it. A farmer cut into its side in {year} for drainage and found a stone coffin 9 feet down." },
        study: { n: "The black core", text: "In the skull of the buried king lies a small black core of the modern kind. The coffin is older than the first core manufacturer by at least two centuries." },
        dig: { n: "The live core", text: "The core is live. When read, it identifies itself as the current head of the realm's first house, with a registry number. The Registry's record for that number is held at {lead}.", points: "cast:official" },
        revelation: { n: "Several at once", text: "The head of the first house has been several people at once for 300 years. One copy was buried here while the others went on ruling. The House wrote the law against twins in the same decade, and the Registry has closed every case since." },
      } },
    { id: "rejecting_body", n: "The Unwearable Body of $", kind: "anomaly", where: "capital", d: "A body that rejects every core put into it.",
      layers: {
        surface: { n: "On ice", text: "A curiosity in a corecutter's back room, kept on ice and shown for a coin. The corecutter has shown it to about 2,000 visitors and turned down 11 offers to buy it." },
        study: { n: "The scream", text: "Every core placed in it wakes for a moment, screams, and is spat out. {investigator} paid the corecutter for a trial with a convict's core. It lasted four seconds, and the convict's core has not spoken since." },
        dig: { n: "The second core", text: "The body's spine holds a thin scar where a core was removed, and a second, unregistered core grown into the bone. The signal from it points to the mountain station at {lead}.", points: "site:sky_archive" },
        revelation: { n: "Already occupied", text: "Someone far away already controls this body through the hidden core, and it throws out anyone else who tries to wear it. The founding peers keep spare bodies like this across the realm. This one was lost, and they have not yet asked for it back." },
      } },
    { id: "faithful_grave", n: "The Quiet Graves of $", kind: "shrine", where: "border", truthLink: "residue", d: "A graveyard of the Final Faithful, whose cores were secretly taken from them after death.",
      layers: {
        surface: { n: "Plain stones", text: "A simple cemetery with plain stones and no backups. The Final Faithful bury about 30 of their dead here each year. Each stone has a name, two dates, and nothing else." },
        study: { n: "Neatly opened", text: "{believer} noticed the turf on a new grave had been relaid. Every grave in the cemetery has been opened and closed again, neatly. The work was done by professionals with proper tools, at night." },
        dig: { n: "The small holes", text: "Every skull has a small hole at the base where the core used to be. The cores were sold on, and the buyers' receipts are filed with the vessel-exchange at {lead}.", points: "sub:bleed_diaries" },
        revelation: { n: "Filler", text: "Even the faithful who refused the vessels were harvested. The vessel-exchange bought their cores and used them as filler for the cheap bodies the peers rent out. The Faithful's minds are in the renters now, alongside the peers'." },
      } },
  ],

  beings: [
    { id: "war_vessel", n: "War vessel", kind: "predator", d: "A combat body grown for war with a wolf's reflexes and a soldier's mind, now running wild after its core burned out. The body remembers how to fight.", danger: 3, biomes: ["badlands", "grass", "tempforest", "dryforest", "coldsteppe"], look: { size: 2, group: [1, 3], move: "pack", speed: 14, col: "#5a4a4a", col2: "#a03a2a", body: "biped", active: "night", visible: true } },
    { id: "coreless", n: "Coreless", kind: "beast", d: "Grown bodies that walked out of an abandoned farm with no one inside. They forage, mimic speech they have overheard, and avoid people.", danger: 1, biomes: ["tempforest", "temprain", "swamp", "boreal"], look: { size: 1.7, group: [3, 10], move: "herd", speed: 4, col: "#c0a890", col2: "#e0d0c0", body: "biped", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "vp_medical_core", n: "Medical cores", field: "medicine", level: 1, d: "A small device at the base of the skull that preserves a dying patient's mind until a new body is ready." },
    { id: "vp_grown_vessels", n: "Grown vessels", field: "medicine", level: 2, d: "Bodies grown in tanks over years, sold blank. A good one costs a village's harvest for a decade." },
    { id: "vp_designer_vessels", n: "Designer vessels", field: "natural_philosophy", level: 3, d: "Vessels with tuned organs, sharpened senses and faces drawn to order." },
    { id: "vp_far_sleeving", n: "Far-sleeving", field: "navigation", level: 4, d: "A self sent across the world by signal and woken in a waiting body. Travel without moving." },
    { id: "vp_core_reading", n: "Core-reading", field: "writing", level: 4, d: "Reading the contents of a core without its owner's consent. In court it is evidence; everywhere else it is the end of privacy." },
    { id: "vp_doubling", n: "Doubling", field: "arcana", level: 5, d: "Running two copies of one self at once. Forbidden to all but those who wrote the law." },
  ],

  units: [
    { id: "vp_resleeved", n: "Resleeved legion", role: "infantry", wpn: "sword", kit: "plate", ranks: 4, gap: 1.2, size: 100, w: 1, mods: [["theme:endless_soldiers", 6], ["standing_army", 1.5]] },
    { id: "vp_war_vessels", n: "War-vessel hunters", role: "beast", mounted: 0, wpn: "axe", kit: "hide", ranks: 2, gap: 2, size: 40, w: 0.4, mods: [["theme:endless_soldiers", 4], ["autocracy", 1.5]] },
  ],

  govs: [
    { id: "vp_long_house", n: "Long House rule", d: "A single family of centuries-old peers has ruled since the founding, never once changing its members, only their bodies.", tags: ["gov:long_house", "autocracy", "monarchy"], w: 0.6, forms: ["Long House of $", "Undying Seat of $", "Peerage of $"], ruler: "Eldest", mods: [["theme:ancient_madness", 5], ["theme:registry", 3], ["hierarchical", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Vessel farms", color: "#a0b08a", size: [1, 3], count: [1, 3], where: "inner", d: "Glasshouse factories where bodies grow in rows of tanks, a day's ride from every great city." },
  ],

  storylines: [
    { id: "vp_renter", n: "The Renter of {place}", scale: "local", anchor: "town", w: 2, req: "vessels",
      stages: {
        start: { h: "A renter of {place} comes home wrong", b: "{person} rented out their body to a peer for a festival week. The renter came back speaking a language they never learned and calling their spouse by a stranger's name.", wait: [2, 5], next: [{ to: "remembers", w: 2 }, { to: "paid_off", w: 1, mods: [["rich", 1.5], ["hierarchical", 1.5]] }] },
        remembers: { h: "The renter of {place} remembers a crime", b: "Among the borrowed memories, {person} has found one clear night: a balcony, a struggle, a fall. The renter believes the peer who wore that body used it to kill someone.", wait: [3, 8], fx: { unrest: 6, flag: "bleed" }, next: [{ to: "investigator", w: 2 }, { to: "silenced", w: 1, mods: [["autocracy", 2], ["ruler:cruel", 2]] }] },
        paid_off: { h: "A peer pays the renter of {place} to forget", b: "A sealed purse and a memory-sealer arrived at {person}'s door. The renter took both, and now cannot say what the fear was about.", fx: { treasury: 10 }, end: true },
        investigator: { h: "{investigator} takes the case of the renter of {place}", b: "The lower-city investigator {investigator} has agreed to follow the borrowed memory back up the towers. The peer in question has already asked to meet.", wait: [4, 10], next: [{ to: "exposed", w: 1, mods: [["just", 2], ["learned", 1.5]] }, { to: "bought", w: 1 }] },
        silenced: { h: "The renter of {place} is repossessed", b: "The vessel-exchange claimed {person}'s body for an unpaid fee. The renter's core is in storage, and someone else is wearing the body again.", fx: { unrest: 12 }, end: true },
        exposed: { h: "A peer of {realm} is charged with murder", b: "On the evidence of a renter's borrowed memory, a peer of {realm} stands accused. The towers of {capital} are shuttered, and the renters are in the streets.", fx: { stability: -10, unrest: 15, prestige: -5 }, end: true },
        bought: { h: "The investigator of {place} takes a new body", b: "{investigator} closed the case and moved up the towers in a fine young vessel. The renter {person} has stopped answering the door.", fx: { stability: 2 }, end: true },
      } },
    { id: "vp_twin_scandal", n: "The Twin of {ruler}", scale: "realm", anchor: "realm", w: 1.2, req: ["vessels", { any: ["autocracy", "monarchy", "hierarchical"] }],
      stages: {
        start: { h: "{ruler} is seen in two places at once", b: "On the same evening, {ruler} opened a bridge in {capital} and dined in {place}. The court of {realm} calls it a clerk's mistake.", wait: [2, 6], next: [{ to: "whispers", w: 2 }, { to: "buried", w: 1, mods: [["spy_network", 2], ["harsh_law", 2]] }] },
        whispers: { h: "The word 'twin' is spoken in {realm}", b: "Pamphlets in {capital} ask why the law against doubling has never once been used against a peer. The Registry of Selves has refused to comment.", wait: [4, 10], fx: { unrest: 10 }, next: [{ to: "two_rulers", w: 1, mods: [["unstable", 2]] }, { to: "law_struck", w: 1, mods: [["ruler:reformer", 3], ["egalitarian", 2]] }, { to: "buried", w: 1 }] },
        buried: { h: "The pamphleteers of {realm} are arrested", b: "The printers have been closed and their cores confiscated. {ruler} appeared once, alone, to show that there is only one.", fx: { stability: 3, unrest: 5 }, end: true },
        two_rulers: { h: "Two {ruler}s quarrel over {realm}", b: "The copies have fallen out. Each holds half the court, each signs decrees with the same hand, and each calls the other the forgery.", fx: { revolt: true, stability: -20 }, end: true },
        law_struck: { h: "{realm} abolishes the law against twins", b: "If the peers may double, so may anyone. {ruler} has struck the law down. The vessel farms cannot grow bodies fast enough.", fx: { discovery: "medicine", stability: -6, treasury: 40 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: true, who: "the vessel-exchange primer", text: "From the vessel-exchange primer, issued with every rental licence, {year}: 'The self lives in the core, a small stone set at the base of the skull. Destroy the core and the person is ended. The body is a garment. Treat it as one, and return it clean. Standard lease: one night, 12 crowns, cleansing included.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: "partial", who: "a renters' rhyme", text: "A rhyme sung by the renters queuing at the vessel-exchange in {place}, written down by a clerk in {year}, who notes that the queue is about 200 long most evenings: 'Lend your arms and lend your face, someone grand will take your place; when you're home and feel the chill, someone grand is with you still.'" },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a travelling portrait painter", text: "A portrait painter, writing of a commission in the towers of {place}, {year}: 'I have painted this peer 6 times: as a woman, a man, a giant and a child, and now a body like a heron. The peer says nobody ever finds the right one. The new body was grown at a farm like the abandoned one at {lead}.'", points: "site:empty_farm" },

    { depth: "core", about: "truth:cores_listen", source: "archive", bias: "redacted", reliable: "partial", who: "a manufacturer's memo", text: "Internal memo of the core manufacturer, {year}, to all 40 clinics: 'The midnight pulse is a health check only. Under no circumstances is its destination to be listed in [REMOVED].' A clinic technician has written on the copy: 'Then why does every pulse point at the mountain station at {lead}?'", points: "site:sky_archive" },
    { depth: "core", about: "truth:cores_listen", source: "person", bias: "true", reliable: true, plain: true, who: "a confession, never sent", text: "Confession of a minor peer, never sent, found in a desk in {year}: 'The Eldest quoted my own thought back to me. Not a word I said. A word I thought, in the bath, the week before. The cores are not backups. Every night they send what we think to the archive on the mountain, and the Eldest reads it. I have told no one. They already know I wrote this.' Filed at {lead}.", points: "archive" },
    { depth: "core", about: "truth:cores_listen", source: "heretic", bias: "heretic", reliable: "partial", cost: true, who: "a coreburner's creed", text: "A coreburner's creed, with a note by a fellow member, {year}: 'Burn the backups and you free the dead. Burn the archive on the mountain and you free the living.' Note: {person}, who wrote this, was arrested before it was printed. At the hearing the magistrate read out the last line, which {person} had only drafted in thought. The archive is at {lead}.", points: "site:sky_archive" },
    { depth: "core", about: "truth:cores_listen", source: "oral", bias: "garbled", reliable: "partial", who: "a schoolteacher's note", text: "A schoolteacher of {place}, writing to a colleague, {year}: 'The children here press a palm to the backs of their necks when they tell each other a secret, so the little stone cannot hear. All 40 in my class do it. Nobody taught them. When I asked why, one said: because the stone tells the mountain.'" },
    { depth: "core", about: "truth:cores_listen", source: "library", bias: "official", reliable: false, who: "{official}, Registry of Selves", text: "Public statement of {official}, senior clerk of the Registry of Selves, {year}: 'Cores are sealed devices. They store and never transmit. The backup service runs only on the explicit request of the owner, through the 40 licensed clinics. The so-called midnight pulse is a health check, and has been independently certified by the manufacturer.'" },

    { depth: "core", about: "truth:twin_monopoly", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "a sealed Registry case file", text: "Registry case file, sealed, {year}: 'Duplicate signature detected, House of the Eldest, same hour, two locations 300 miles apart. Ruled: clerical error. Case closed by [REMOVED].' Appended: the clerk who flagged it, {person}, was re-registered the following week as a convict, and the core shipped to the shell frontier. The case was signed off at {lead}.", points: "cast:official" },
    { depth: "core", about: "truth:twin_monopoly", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a society columnist", text: "A society columnist of {realm}, {year}: 'In one week the head of the first house attended 3 funerals, 2 weddings and a war council, all on the Thursday, all in different cities. The House's secretary says the dates were misprinted. The House's oldest ancestor is buried in a barrow at {lead}, if you believe the farmers.'", points: "site:old_core" },
    { depth: "core", about: "truth:twin_monopoly", source: "person", bias: "true", reliable: true, plain: true, who: "a corecutter's ledger", text: "A corecutter's ledger, final page, {year}: 'Grew two vessels to the same face for the same client, the House of the Eldest. Third order this year. Fee tripled. Both bodies woke up as the Eldest at the same hour. The peers run twins as a matter of course; the law against it is for the rest of us. Swore I would not ask. The spare is still in my back room at {lead}.'", points: "site:rejecting_body" },
    { depth: "core", about: "truth:twin_monopoly", source: "library", bias: "official", reliable: false, who: "{official}, Registry of Selves", text: "Annual report of the Registry of Selves, signed by {official}, {year}: 'The law against doubling is applied without exception to every rank. 174 doublers were convicted this year, all of the common sort. No peer of {realm} has ever been found to run a second self, which reflects well on the peerage.'" },

    { depth: "core", about: "truth:residue", source: "person", bias: "true", reliable: true, plain: true, who: "{survivor}, bleed diary", text: "Bleed diary of {survivor}, renter, after the 30th lease, {year}: 'I hum a waltz I have never heard. I am frightened of the sea. I know where the silver is kept in a house I have never seen. The peers leave themselves behind in every body they wear, and I am filling up with them. Some mornings I sign my name as theirs before I notice.'" },
    { depth: "core", about: "truth:residue", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, elder of the Final Faithful", text: "Teaching of {believer}, elder of the Final Faithful, given at a burial in {year}: 'A body remembers every soul that wore it, the way a coat remembers the shape of a back. That is why we wear one body, and are buried in it. We have buried 30 this year. Go and look at their graves at {lead}, and tell me they rest.'", points: "site:faithful_grave" },
    { depth: "core", about: "truth:residue", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "exchange actuarial table", text: "Vessel-exchange actuarial table, {year}: 'Renters past their fifteenth lease show a [REMOVED] percent rate of foreign memory. Recommend lower rental fees to this group.' Attached case: {person}, renter, 22 leases, no longer answers to the name {person}, and signs as a dead countess. Fee lowered to 8 crowns. Diaries of similar cases are traded at {lead}.", points: "sub:bleed_diaries" },
    { depth: "core", about: "truth:residue", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a lower-city broadsheet", text: "A lower-city broadsheet, {year}, sold for a penny: 'Count the renters who hum the same waltz: we count 400 in this district alone. In a hundred years the poor will all be the same three dead aristocrats, and the aristocrats will have all the bodies. Stop renting. Stop now.'" },
    { depth: "core", about: "truth:residue", source: "library", bias: "propaganda", reliable: false, who: "vessel-exchange notice", text: "Notice posted in all vessel-exchange halls, {year}: 'So-called memory bleed is a recognised hysteria among renters, aggravated by gossip papers. Vessels are fully cleansed between leases by a 9-step process. Renters reporting foreign memories may be refused further leases. Gossip papers found on exchange premises will be confiscated.'" },

    { depth: "sub", about: "sub:renters_strike", source: "oral", bias: "true", reliable: "partial", who: "a constable's report", text: "Report of a constable at the vessel-exchange in {place}, {year}: 'About 600 renters outside the exchange, refusing to rent, singing: \"Not my hands, not tonight; dance on your own two feet, my lord, if you can find them.\" No violence. The exchange has hired breakers. The peers' balls are cancelled for the week.'" },
    { depth: "sub", about: "sub:final_faithful", source: "temple", bias: "pious", reliable: true, who: "a witness of the Final Faithful", text: "A witness of the Final Faithful, asked by a judge in {year} why the courts trust the Faithful's testimony: 'We die once, as our grandmothers did. That is why the judges believe us: we have nothing to come back for. Our elder at {lead} has given evidence in 40 trials, and never lied in one.'", points: "cast:believer" },
    { depth: "sub", about: "sub:endless_soldiers", source: "person", bias: "true", reliable: "partial", who: "a sergeant's letter", text: "A sergeant's letter home from the front, {year}: 'Forty-one deaths now. I still flinch at the first one: a pike, in the belly, in a ditch. The rest I barely remember, which is the worst of it. They give us a medal at the tenth and a pension at the fiftieth. Nobody I know has reached it.'" },
    { depth: "sub", about: "sub:shell_frontier", source: "traveller", bias: "garbled", reliable: "partial", who: "a carter's account", text: "A carter who hauls ore from the frontier diggings past {place}, {year}: 'The diggers are metal men with prisoners' faces painted on, so the overseers can tell who is who. About 900 of them. When one breaks, they pack the core in straw and send it back with me. I carried 30 home last month.'" },
    { depth: "sub", about: "sub:registry_selves", source: "archive", bias: "official", reliable: "partial", who: "{official}, Registry notice", text: "Registry notice, posted on every street corner of {place}, signed by {official}, {year}: 'Your identity is your core. Your face is not evidence. Report any person who claims to be you. Registry clerks may not be asked how many persons are presently wearing any one body. The fine for asking is 20 crowns.'" },
    { depth: "sub", about: "sub:own_murder", source: "person", bias: "true", reliable: "partial", who: "{investigator}, private investigator", text: "Case notes of {investigator}, private investigator, {year}: 'Client is a peer, killed and resleeved from backup, missing the last two days. Client let the killer in without a struggle. Client says: \"I would only open the door to myself.\" The corecutter at {lead} grew two bodies to the client's face last spring. I am going to ask why.'", points: "site:rejecting_body" },
    { depth: "site", about: "site:empty_farm", source: "oral", bias: "garbled", reliable: "partial", who: "a village innkeeper", text: "The innkeeper of the village nearest the dead glasshouses, to a Registry inspector, {year}: 'There are people out there who do not talk and do not eat bread. Fourteen of them. They stand in the rain with their mouths open, all facing the same way. They came walking from the farm one spring. My dog won't bark at them.'" },
  ],
};
