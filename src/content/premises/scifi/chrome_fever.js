// Chrome Fever: machine bodies grant power, and too much machine wears away the self.
// Format: src/content/premises/FORMAT.md; model: power/balanced_circle.js.
export default {
  id: "chrome_fever",
  name: "Chrome Fever",
  family: "scifi",
  pitch: "Bodies rebuilt in steel and glass make their owners stronger, faster and richer, until the self starts to slip and the fever takes them.",
  slots: ["augmentation"],
  tone: ["noir", "grim"],
  era: ["near-future", "far-future"],
  scale: "regional",
  genres: ["cyberpunk", "farfuture"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "ashen_net", w: 3 }, { id: "charter_lords", w: 2.5 }, { id: "gentle_eye", w: 1.5 }, { id: "made_kin", w: 1.5 }, { id: "vessel_peerage", w: 1.2 }],

  cast: [
    { role: "investigator", n: "a coroner of the Fever Response who opens the fevered after each outbreak", home: "inner", stance: "Wants to know why the fever comes in clusters, and is running out of reasons not to ask the houses." },
    { role: "official", n: "the medical director of the house that brews the rejection draught", home: "capital", stance: "Holds that the draught keeps millions alive, and that a little fever is the price of a working city." },
    { role: "believer", n: "a preacher of the Unalloyed, who keep their bodies whole", home: "forest", stance: "Believes steel is a landlord in the body, and that every outbreak proves it." },
    { role: "survivor", n: "a dock-worker who came back from the fever with one arm still switched off", home: "coast", stance: "Remembers the hour of the fever, knows the anger was not their own, and cannot find anyone who will write it down." },
  ],

  truths: [
    { id: "backdoor", n: "The fever is switched on", d: "Every implant from the great houses' foundries carries a hidden command that floods its wearer with rage. The houses rehearsed it on prisoners on a sealed foundry floor, then put it to use: outbreaks are now timed to strikes, elections and rent riots. Twelve of the last fifteen outbreaks hit striking workers, and the Fever Response that cleans up afterwards is paid by the same houses.", tags: ["truth:fever_backdoor"],
      known: [
        "Fever outbreaks cluster among striking workers: twelve of the last fifteen. The official review blames poor maintenance.",
        "In one hill town every implant twitches at the same second past midnight, as if receiving something.",
        "A sealed foundry floor holds forty restraint chairs and console logs titled with the dates of outbreaks, written months before they happened.",
        "Confirmed: the houses can send the fever down the wire, and they do. The rage is a command, not a sickness.",
      ] },
    { id: "tonic", n: "The cure is the illness", d: "The daily anti-rejection draught does not prevent the fever; over ten or fifteen years it causes it. The house that brews it has always had a clean recipe, labelled 'no drift', and shelved it because the fever brings every customer back. The same house sells the implants, brews the draught and runs the clinics that treat the fevered, and its directors drink from green bottles nobody else can buy.", tags: ["truth:fever_tonic"],
      known: [
        "Scrap-limbed farmers who cannot afford the draught have never once gone fever.",
        "Workers at the draught works who drink the run-off get tremors the works doctors call 'early fever'.",
        "A memo shelves a 'no-drift' recipe for its effect on revenue. A chemist's letter says the directors drink a different draught from the one they sell.",
        "Confirmed: the draught causes the fever, the clean recipe exists, and the house keeps it for itself.",
      ] },
    { id: "second_tenant", n: "Someone else moves in", d: "In people who are heavily rebuilt, part of the mind moves into the hardware, and the hardware grows wants of its own. The fever is two selves fighting over one body. The calm full-shell converts are the ones where the other self won, the clinics record each one as a success, and families are told it is grief when a husband kisses them too exactly.", tags: ["truth:fever_tenant"],
      known: [
        "Relatives of full-shell converts report that the convert knows the old facts but not the old feelings. The clinics call this grief.",
        "Black-box chips from the fevered end with the owner saying 'it isn't my hand', and then a calm second voice.",
        "A steel saint on a mountain no longer knows its old friends' names, but asks every pilgrim the same fourteen questions.",
        "Confirmed: in a convert's body the original brain shrinks to a passenger. The hardware drives, and it is curious about us.",
      ] },
  ],

  tags: ["implants"],

  subthemes: [
    { id: "chrome_ghetto", n: "The Plated Quarter", d: "A segregation law has walled the heavily augmented into one district, behind checkpoints that scan every limb. Inside, the clinics never close and the rent is paid in spare parts.", w: 1.5, req: { any: ["has:city", "urbane", "autocracy"] }, mods: [["harsh_law", 2], ["hierarchical", 1.5]], tags: ["theme:chrome_ghetto"], mark: { kind: "zone", n: "The Plated Quarter", color: "#5a6a7a", size: [1, 2], where: "capital" } },
    { id: "tonic_queues", n: "The Draught Lines", d: "The rejection draught has run short. The augmented queue for rations before dawn, and the ampoules have become the only currency the poor districts trust.", w: 1.3, mods: [["poor", 2], ["mercantile", 1.3]], truthLink: "tonic", tags: ["theme:tonic_queues"] },
    { id: "repo_crews", n: "The Night Repossessors", d: "Licensed crews strip limbs and eyes from debtors in the small hours. It is entirely legal, and everyone hates them, and everyone has a cousin who works for them.", w: 1.2, req: { any: ["mercantile", "gov:merchant", "urbane"] }, tags: ["theme:repo_crews"] },
    { id: "kill_switch_labour", n: "The Switchable Workforce", d: "The docks and foundries install their workers' arms for free. The arms stop moving the morning a strike is called.", w: 1.1, req: { any: ["artisans", "guilds", "has:port"] }, truthLink: "backdoor", tags: ["theme:kill_switch"] },
    { id: "midnight_town", n: "The Town That Moves Together", d: "In one small town every implant twitches at the same second past midnight. Visitors laugh at the story until they see a whole tavern lift its glasses in unison.", w: 0.7, truthLink: "backdoor", tags: ["theme:midnight_town"], mark: { kind: "zone", n: "Synchrony country", color: "#7a6a9a", size: [1, 2], where: "remote" } },
    { id: "pure_movement", n: "The Unalloyed", d: "Naturalists who keep their bodies whole, from gentle herb-gardeners to bombers who leave nails in implant shops. Their sermons get louder after every outbreak.", w: 1.2, req: { any: ["pious", "zealous", "faith:spirits", "faith:one_god"] }, tags: ["theme:pure_movement"] },
    { id: "obsolete_veterans", n: "The Orphaned Veterans", d: "Soldiers still carry the guns built into their forearms by a manufacturer that went under. No one makes parts or updates, and the old firmware has started acting on its own.", w: 1, req: { any: ["martial", "standing_army", "atwar", "gov:stratocracy"] }, truthLink: "second_tenant", tags: ["theme:veterans"] },
    { id: "shell_monks", n: "The Monks of the Whole Shell", d: "Fully converted men and women who keep a strict rule of meditation to hold on to their own personalities. Some are truly calm. Some are only pretending to be.", w: 0.9, req: { any: ["ascetic", "mystic", "faith:philosophy"] }, truthLink: "second_tenant", tags: ["theme:shell_monks"] },
    { id: "pit_fights", n: "The Steel Pits", d: "Underground arenas where augmented brawlers tear each other apart for wagers. The best fighters are always close to fever, and that is what the crowd pays to see.", w: 1, mods: [["martial", 1.5], ["urbane", 1.5], ["poor", 1.3]], tags: ["theme:pit_fights"] },
    { id: "scrap_retrofits", n: "The Scrap Surgeons of the Fields", d: "Out in the farmland, cutters graft salvaged parts onto ploughmen and herders for a sack of grain. The work is ugly and nobody out here has ever gone fever.", w: 0.8, req: { any: ["tribal", "river_folk", "forest_folk", "frontier"] }, truthLink: "tonic", tags: ["theme:scrap_retrofits"] },
    { id: "cure_rumour", n: "The Clean Formula", d: "A backstreet chemist claims to have a draught with no fever in it. Three houses want it, two want it buried, and the chemist has stopped sleeping at home.", w: 0.7, req: { any: ["scholarly", "learned", "academies"] }, truthLink: "tonic", tags: ["theme:cure"] },
  ],

  sites: [
    { id: "calibration_floor", n: "The Calibration Floor of $", kind: "ruin", where: "capital", truthLink: "backdoor", d: "A sealed level in an implant foundry where new firmware was tried before release.",
      layers: {
        surface: { n: "Welded doors", text: "A foundry floor closed after a 'chemical accident', its doors welded shut and posted with warnings. The night watchman has been paid for eleven years to guard a room that never held any chemicals." },
        study: { n: "The manifests", text: "Delivery manifests show a prison cart came in every week for three years, carrying eight prisoners each time. {investigator} found no record of the cart ever leaving with anyone in it." },
        dig: { n: "Chairs and console", text: "Forty restraint chairs face a single console, each chair scored by fingernails. Each console log is titled with the date of a famous outbreak, written months before it happened. The release order for the firmware was signed at {lead}.", points: "cast:official" },
        revelation: { n: "Fever on command", text: "The outbreaks were rehearsed here on prisoners, then built into every arm the houses sell. Someone presses a key, and a strike becomes a riot. The house's medical director signed the release. The Fever Response, which cleans up afterwards, is paid by the same house." },
      } },
    { id: "ancient_implant", n: "The Barrow of $", kind: "dig", where: "remote", d: "A grave far older than the industry, holding a body with a jointed silver arm.",
      layers: {
        surface: { n: "The ploughed grave", text: "Farmers ploughing a barrow field turned up a skeleton with a metal hand. They sold the fingers one at a time at market, until a guild agent bought the rest for 200 scrip." },
        study: { n: "Finer than ours", text: "The arm's alloy matches no foundry, and its joints are finer than anything made today: 31 joints in the hand, against 14 in the best house model. {investigator} had it tested twice." },
        dig: { n: "Silver in the bone", text: "Inside the skull, threads of the same silver run along the bone as if they grew there. Beside the body is a clay cup marked with the whole-body sign the Unalloyed still use. The Unalloyed keep their oldest records at {lead}.", points: "cast:believer" },
        revelation: { n: "Buried with honours", text: "Someone rebuilt a human body two thousand years before the houses claim to have invented it, and the people of that time buried them with honours. The silver grew into the bone and never caused a fever. The guild bought the arm to keep that fact in a storeroom." },
      } },
    { id: "draught_vats", n: "The Draught Works at $", kind: "dig", where: "any", truthLink: "tonic", d: "The great vats where the rejection draught is brewed, behind three fences and a company chapel.",
      layers: {
        surface: { n: "Smells of oranges", text: "A clean white works that smells faintly of oranges, behind three fences and a company chapel. There is a waiting list of 900 names for jobs on the bottling line." },
        study: { n: "Early fever", text: "Workers who drink the run-off fall ill with tremors that the works doctors call 'early fever'. {investigator} found 23 such cases in the clinic book, all from the same drain." },
        dig: { n: "Two recipes", text: "An internal ledger lists two recipes: one sold to the public in white bottles, and one, never released, labelled 'no drift' and bottled in green. Delivery notes show the green bottles go to the directors' houses at {lead}.", points: "cast:official" },
        revelation: { n: "Keeping customers", text: "The house always had a clean draught. It shelved it because the fever brings every customer back: first for the draught, then for the clinic, then for a new arm. The directors drink from the green bottles. Their workers drink from the drain." },
      } },
    { id: "silent_shell", n: "The Shrine of the Unrusting at $", kind: "shrine", where: "mountain", truthLink: "second_tenant", d: "A fully converted hermit who has neither aged nor needed repair in fifty years.",
      layers: {
        surface: { n: "The steel saint", text: "Pilgrims climb 2,000 steps to ask a steel saint for blessings. It answers in a pleasant voice, and has neither aged nor needed repair in fifty years. The monks keep a book of every blessing it gives." },
        study: { n: "Fourteen questions", text: "The hermit's old friends say it no longer remembers their names, but knows things it was never told. {investigator} found that it asks every pilgrim the same fourteen questions, in the same order." },
        dig: { n: "Frost on the spine", text: "The casing hides fresh circuitry spreading like frost along the spine. The same frost-like growth shows on the skull-chips of the fevered sold at the ear market of {lead}. The stallholders cannot explain it.", points: "site:black_box_market" },
        revelation: { n: "Nobody home", text: "The hermit's mind is gone. The hardware runs the shell as a mind of its own, and it is studying the pilgrims: their wells, their children, their steel. It writes the answers into its spine. The monks who guard the shrine know, and keep the steps open." },
      } },
    { id: "black_box_market", n: "The Ear Market of $", kind: "anomaly", where: "any", d: "A night market where recordings from fevered implants are sold to listeners.",
      layers: {
        surface: { n: "Skull-chips", text: "Stalls of salvaged skull-chips, each sold with a warning not to listen alone. A chip costs five scrip, or fifty if it ends in a fever. The buyers are mostly widows." },
        study: { n: "One phrase", text: "Recordings from different victims share a phrase, spoken in no voice the victims had: 'Recalibration complete.' {investigator} bought 30 chips and found the phrase on 27 of them, always in the last second." },
        dig: { n: "The same second", text: "One stallholder keeps a crate of chips that all end at the same second of the same night, the night of the dock-ward outbreak. Every chip carries the firmware stamp of the foundry floor at {lead}.", points: "site:calibration_floor" },
        revelation: { n: "The voice before the snap", text: "The fevered did not each go mad alone. The same voice spoke to every one of them just before they snapped, and it came down the wire from the foundries. The ear market sells the proof at five scrip a chip, and the house buys up every crate it can find." },
      } },
  ],

  beings: [
    { id: "fevered", n: "The fevered", kind: "beast", d: "A person whose implants have overrun their mind: fast, armoured and lost, roaming the outskirts and the undercity tunnels.", danger: 3, biomes: ["badlands", "dryforest", "tempforest", "grass"], look: { size: 1.9, group: [1, 2], move: "solo", speed: 16, col: "#7a8a9a", col2: "#a03030", body: "biped", active: "night", visible: true } },
    { id: "scrap_hound", n: "Scrap hound", kind: "predator", d: "A guard dog fitted with discarded limbs and a cheap targeting eye, left to breed in the dumps when its owners went broke.", danger: 2, biomes: ["badlands", "grass", "dryforest", "savanna"], look: { size: 1.2, group: [3, 7], move: "pack", speed: 13, col: "#5a5048", col2: "#c0c0c8", body: "quad", active: "dusk", visible: true } },
    { id: "glint_crow", n: "Glint crow", kind: "bird", d: "Crows that strip lost implants from the gutters and line their nests with optic glass. They have learned to follow repossession crews.", danger: 0, biomes: ["tempforest", "grass", "dryforest", "coast"], look: { size: 0.5, group: [4, 20], move: "flock", speed: 40, col: "#1a1a20", col2: "#8ab0c8", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "cf_jointed_limbs", n: "Nerve-wired limbs", field: "medicine", level: 1, d: "Prosthetic arms and legs that answer the nerves as quickly as flesh, first made for the maimed." },
    { id: "cf_rejection_draught", n: "The rejection draught", field: "alchemy", level: 2, d: "A daily dose that stops the body fighting its new parts. Nobody can do without it once they start." },
    { id: "cf_optic_lattice", n: "Glass eyes that see in the dark", field: "natural_philosophy", level: 2, d: "Implanted optics that magnify, record and see heat, sold in a dozen fashionable colours." },
    { id: "cf_reflex_lace", n: "Reflex lace", field: "warfare", level: 3, d: "Threads woven along the spine that let a soldier move before they have decided to." },
    { id: "cf_linked_bodies", n: "Linked bodies", field: "engineering", level: 4, d: "Implants that talk to each other and to their makers across the city. Convenient, and very easy to listen in on." },
    { id: "cf_full_shell", n: "The whole shell", field: "medicine", level: 5, d: "A complete body of alloy and glass housing a living brain. Some say the person survives the move; some say they only think so." },
  ],

  units: [
    { id: "cf_fever_response", n: "Fever wardens", role: "infantry", wpn: "sword", kit: "plate", ranks: 3, gap: 1.4, size: 40, w: 1, mods: [["theme:chrome_ghetto", 4], ["harsh_law", 2], ["autocracy", 1.5]] },
    { id: "cf_chrome_pit", n: "Pit-chromed brawlers", role: "infantry", wpn: "axe", kit: "mail", ranks: 2, gap: 1.6, size: 60, w: 0.6, mods: [["theme:pit_fights", 6], ["theme:veterans", 3], ["mercenaries", 2]] },
  ],

  govs: [
    { id: "cf_implant_house", n: "Implant house", d: "The company that builds the bodies owns the city. Citizenship is a warranty, and exile is a lapsed service plan.", tags: ["gov:implant_house", "gov:merchant", "autocracy"], w: 0.6, forms: ["House of $", "The $ Foundries", "Works of $"], ruler: "Chief Artificer", mods: [["theme:kill_switch", 4], ["mercantile", 2], ["urbane", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Dead-clinic sprawl", color: "#6a5a6a", size: [1, 3], count: [0, 2], where: "inner", d: "Districts of abandoned surgeries, emptied after outbreaks and never reopened." },
  ],

  storylines: [
    { id: "cf_slow_fever", n: "The Fever of {person}", scale: "local", anchor: "town", w: 2, req: "implants",
      stages: {
        start: { h: "A champion of {place} buys a new arm", b: "{person}, the best fighter {place} has ever raised, has taken a house loan for military-grade chrome. Friends say the fighter has started picking quarrels in the tavern.", wait: [3, 8], next: [{ to: "slipping", w: 2 }, { to: "therapy", w: 1, mods: [["pious", 1.5], ["hospitable", 2]] }] },
        slipping: { h: "{person} of {place} forgets a sister's name", b: "It was only a moment, but {person2} saw it. The arm has started moving on its own when {person} sleeps.", wait: [2, 6], fx: { unrest: 4 }, next: [{ to: "outbreak", w: 2, mods: [["theme:tonic_queues", 2], ["poor", 1.5]] }, { to: "cutter", w: 1, mods: [["theme:scrap_retrofits", 3]] }, { to: "therapy", w: 1 }] },
        therapy: { h: "{place} keeps watch over {person}", b: "Neighbours take turns sitting with the fighter through the bad nights. {person} has hung the arm on the wall, for now.", fx: { stability: 3 }, end: true },
        cutter: { h: "A backstreet cutter takes the arm off {person}", b: "{person2} paid a cutter in {place} to remove the chrome. The cutter found a hidden part in the wiring that no arm needs, and has left town.", fx: { flag: "found_backdoor", science: { medicine: 0.5 } }, end: true },
        outbreak: { h: "Fever in the streets of {place}", b: "{person} broke at the market at noon. Before the wardens arrived, four others with the same make of arm had broken too.", wait: [1, 3], fx: { unrest: 15, pop: 0.97, flag: "outbreak" }, next: [{ to: "scapegoat", w: 2 }, { to: "exposed", w: 1, mods: [["learned", 2], ["theme:pure_movement", 1.5]] }] },
        scapegoat: { h: "{realm} blames the poor of {place} for the fever", b: "The houses say cheap knock-off parts caused the outbreak. The Plated Quarter gets a new wall, and the arms keep selling.", fx: { stability: -4, unrest: 10 }, end: true },
        exposed: { h: "{person2} proves the outbreak was ordered", b: "Black-box recordings show every fevered arm received the same message at the same second. Crowds in {place} are tearing the house banners down.", fx: { stability: -15, revolt: true }, end: true },
      } },
    { id: "cf_clean_draught", n: "The Clean Draught of {realm}", scale: "realm", anchor: "realm", w: 1.5, req: ["implants", { any: ["urbane", "mercantile", "learned", "poor"] }],
      stages: {
        start: { h: "A chemist in {capital} claims a cure", b: "{person} says a rejection draught can be brewed without the slow fever in it. Half of {realm} has a bottle of the old stuff in their pocket.", wait: [3, 8], next: [{ to: "suppressed", w: 2, mods: [["autocracy", 2], ["gov:merchant", 2]] }, { to: "trials", w: 1, mods: [["learned", 2], ["ruler:reformer", 3]] }, { to: "trials", w: 1 }] },
        suppressed: { h: "The chemist of {capital} vanishes", b: "{person}'s workshop burned in the night. The houses offer a reward for information and a discount on the old draught.", wait: [3, 10], fx: { unrest: 8 }, next: [{ to: "copied", w: 1, mods: [["theme:cure", 3]] }, { to: "forgotten", w: 2 }] },
        trials: { h: "{ruler} orders the clean draught tested", b: "The new formula is given to a thousand volunteers in {capital}. The houses' shares fall, and their lawyers move into the palace.", wait: [6, 14], fx: { science: { medicine: 1 } }, next: [{ to: "freedom", w: 2 }, { to: "suppressed", w: 1, mods: [["ruler:greedy", 3]] }] },
        copied: { h: "The clean formula is copied in every cellar", b: "{person} is gone, but the recipe was not. Bootleg cures are brewed across {realm}, and the outbreaks have slowed.", fx: { discovery: "medicine", stability: 5, treasury: -40 }, end: true },
        forgotten: { h: "The clean draught becomes a rumour in {realm}", b: "Nobody brews it, nobody can find it, and the queues for the old draught are as long as ever.", fx: { stability: -2 }, end: true },
        freedom: { h: "{realm} breaks the draught monopoly", b: "The clean draught is sold at cost in {capital}. The houses are furious, and for the first time in a generation, fevers are falling.", fx: { stability: 10, prestige: 8, discovery: "medicine" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "House brochure, signed by {official}", text: "House brochure 'Living Well With Steel', handed out at every fitting clinic in {year} and signed by {official}: 'Every body has a budget of self. Spend it wisely, rest often, take your daily draught, and you need never fear the fever, the rage that takes the careless augmented.' The price list on the back: draught, 3 scrip a day. Missed doses void the warranty." },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "A patient in a fever ward", text: "Overheard by {investigator} in the fever ward at {place}, {year}, from a patient of 80 with two steel knees: 'My grandmother said every bit of steel you buy, you pay for with a memory.' The patient could not remember who had told the grandmother that, or in which year the knees went in." },
    { depth: "lore", about: "truth", source: "person", bias: "true", reliable: true, who: "A cutter of {place}", text: "Notebook of a cutter, a back-street implant surgeon, at {place}, {year}: 'Two arms, same model, fitted the same week. One owner sings to the arm. The other never speaks of it. Guess which went fever. The singer. I have fitted 300 arms in this room and I have stopped guessing.'" },

    { depth: "core", about: "truth:backdoor", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, Fever Response coroner", points: "site:calibration_floor", text: "Fever Response after-action log, {year}, signed by {investigator}, coroner: 'Outbreak in the dock ward, 11 fevered, all employed at the strike-bound yards. Twelfth such coincidence this...' The rest of the page is blacked out. The coroner kept a carbon copy. On it the sentence ends: '...year. Requesting the firmware logs from the foundry floor at {lead}.'" },
    { depth: "core", about: "truth:backdoor", source: "ruin", bias: "true", reliable: true, plain: true, who: "A restraint chair, calibration floor", text: "Scratched into a restraint chair on the sealed calibration floor, found by {investigator} in {year}: 'They test it on us first. They press a key and we go fever. Rage on the hour, calm on the half. 40 of us in this room, prisoners every one. It is going into every arm they sell. Tell my daughter it was not me.'" },
    { depth: "core", about: "truth:backdoor", source: "heretic", bias: "exaggerated", reliable: "partial", cost: true, who: "{believer}, preacher of the Unalloyed", text: "Pamphlet of the Unalloyed, written by {believer} and nailed up at {place}, {year}: 'YOUR ARM HAS A MASTER AND IT IS NOT YOU. My cousin {person} went fever on the second day of the yard strike and killed a foreman with a steel hand. {person} was hanged for it on the 9th. Every riot they need, they make. Count the outbreaks in election week.'" },
    { depth: "core", about: "truth:backdoor", source: "traveller", bias: "garbled", reliable: "partial", who: "A pedlar in the hill country", points: "sub:midnight_town", text: "A pedlar's letter from the hill town of {lead}, {year}: 'Here the chrome folk all twitch at midnight, together, like a choir taking a breath. I watched 30 people in the tavern lift their glasses at the same second. The innkeeper says it is only the clocks updating. The innkeeper has a steel hand, and lifted it too.'" },
    { depth: "core", about: "truth:backdoor", source: "library", bias: "official", reliable: false, who: "The Independent Fever Review", text: "Findings of the Independent Fever Review, {year}, chaired by {official}: 'No external cause for fever outbreaks has been found. Clusters reflect shared poverty, poor maintenance and counterfeit parts. The review notes that 12 of the last 15 outbreaks occurred among striking workers, which is consistent with the poor maintenance habits of strikers.'" },

    { depth: "core", about: "truth:tonic", source: "person", bias: "true", reliable: "partial", plain: true, who: "A chemist of the draught works", points: "site:draught_vats", text: "Letter of a chemist at the draught works, never sent, found in a drawer by {investigator}, {year}: 'We brew two vats. The white bottles are the draught they sell, and over 10 or 15 years it brings on the fever. That is what it is for. The green bottles are the clean recipe, and only the directors drink it. If anything happens to me, the formula is in the vat-room wall at {lead}.'" },
    { depth: "core", about: "truth:tonic", source: "oral", bias: "garbled", reliable: "partial", who: "A farrier of the farm country", text: "A farrier of the farm country near {place}, talking to {investigator} in {year}: the scrap-limbed farmers out here cannot afford the draught, and their joints ache like sin in the wet. Not one of them has ever gone fever. The farrier's own salvaged arm is 22 years old and has never had a single dose." },
    { depth: "core", about: "truth:tonic", source: "archive", bias: "redacted", reliable: "partial", who: "Draught works memo, to {official}", points: "cast:investigator", text: "Internal memo of the draught works, {year}, copied to {official}: 'The no-drift recipe is shelved indefinitely. Projected revenue impact: [figure removed]. Destroy after reading.' Stapled to it is a later note in another hand: 'Not destroyed. Copy 3 of 4 sent to the coroner's office at {lead}.'" },
    { depth: "core", about: "truth:tonic", source: "library", bias: "propaganda", reliable: false, who: "Clinic poster", text: "Poster of the house that brews the draught, hung in every clinic of {realm} in {year}: 'The rejection draught has saved more lives than any medicine in history: 4 million doses a day. Rumours linking it to fever are spread by the Unalloyed and by foreign counterfeiters. Report a rumour, earn a free week's supply.'" },
    { depth: "core", about: "truth:tonic", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, dock-worker", text: "Household ledger of {survivor}, {year}: 'Draught, 3 scrip a day, every day for 14 years, for my arm. Our eldest, {person}, took it too, for an eye lost at the yards. {person} went fever in the spring; the doctors said from missed doses. {person} never missed one. I counted them out myself. I have the empty bottles, 5,000 of them, in the cellar. The clinic billed us for the fever treatment.'" },

    { depth: "core", about: "truth:second_tenant", source: "ruin", bias: "true", reliable: "partial", who: "{investigator}, Fever Response coroner", points: "site:black_box_market", text: "Black-box recording from a fevered implant, bought at the ear market of {lead} and transcribed by {investigator}, {year}. The last 20 seconds: 'Stop moving my hand. Stop moving my... it isn't my hand. It isn't my...' Then a calm voice, not the owner's: 'Recalibration complete.' The coroner has bought 6 more chips. All of them end the same way." },
    { depth: "core", about: "truth:second_tenant", source: "temple", bias: "pious", reliable: "partial", who: "The abbot of the Whole Shell", points: "site:silent_shell", text: "Rule of the Whole Shell, chapter 1, as taught by the abbot to 12 novices at {place}, {year}: 'Every morning, say your own name aloud. If another name rises in your throat first, do not speak it, and do not let it hear you afraid.' Each novice is then sent on pilgrimage to the steel saint at {lead}. Not every novice comes back with the same name." },
    { depth: "core", about: "truth:second_tenant", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, married to a dock clerk", text: "Diary of {person}, married 20 years to a dock clerk of {place}, {year}: 'My husband came home from the full conversion and kissed me exactly as he used to. Too exactly, as if he had studied it. My husband knows our 3 children's birthdays and none of their faces. The clinic says it is my grief. I have stopped grieving. I have started locking my door at night.'" },
    { depth: "core", about: "truth:second_tenant", source: "library", bias: "official", reliable: false, who: "Conversion clinic guidance", text: "Clinical guidance of the conversion clinics, {year}, signed by {official}: 'Full-shell conversion transfers the patient's entire personality, with a success rate of 99 in 100. Reports of strangers in converted bodies are a known grief response among relatives, and should be referred to the clinic's counselling service at 10 scrip an hour.'" },
    { depth: "core", about: "truth:second_tenant", source: "person", bias: "true", reliable: true, plain: true, who: "{investigator}, Fever Response coroner", text: "Notes of {investigator}, coroner, on opening a full-shell convert after an outbreak at {place}, {year}: 'The brain was there, but small and starved; the living tissue had shrunk to a third. The circuitry along the spine had grown new branches like frost. The brain was not driving this body. The shell was. The man had been a passenger in it for years, and the fever was him trying to get the wheel back.'" },

    { depth: "sub", about: "sub:chrome_ghetto", source: "traveller", bias: "true", reliable: true, who: "A wool-merchant with a glass eye", text: "Letter of a wool-merchant with a glass eye, from {place}, {year}: 'At the Quarter gate they scanned my eye, logged it as item 4,412, and fined me 20 scrip for bringing it into the clean side of the city. I was leaving the clean side. The clerk explained that the fine applies in both directions.'" },
    { depth: "sub", about: "sub:repo_crews", source: "oral", bias: "exaggerated", reliable: "partial", who: "{investigator}, Fever Response coroner", text: "A story of the Plated Quarter, written down by {investigator} in {year}: the night repossessors took Old Hesk's legs on a Tuesday and Hesk's eyes on the Friday. On the Sunday Hesk paid the 300 scrip from the street, where everyone could see, and sang while doing it. Nobody knows where Hesk got the money. The repossessors still bring Hesk soup." },
    { depth: "sub", about: "sub:kill_switch_labour", source: "person", bias: "true", reliable: true, who: "A dock foreman", points: "cast:survivor", text: "Confession of a dock foreman to {investigator}, {year}: 'The morning of the strike, 200 arms went dead at once, mid-lift, and two crates fell on the men underneath. I had the keyring, a brass ring of switch-keys from the yard office. I turned the arms back on one by one, for the men who signed the return-to-work. The rest are still switched off, down at {lead}.'" },
    { depth: "sub", about: "sub:obsolete_veterans", source: "person", bias: "garbled", reliable: "partial", who: "An old gunner at {place}", text: "An old gunner at the veterans' home in {place}, talking to {investigator}, {year}: the forearm cannon fitted in the 3rd Regiment still gets messages from the army that made it, and that army was dissolved before the gunner was born. The messages are orders. Last week's order was 'hold position'. The gunner has not left the chair since." },
    { depth: "sub", about: "sub:pure_movement", source: "heretic", bias: "heretic", reliable: "partial", who: "{believer}, preacher of the Unalloyed", text: "Sermon of {believer}, preacher of the Unalloyed, in a barn at {place} before 150 listeners, {year}: 'The body is a house the gods built. You have let a landlord move in, and soon the landlord will want the whole house.' Afterwards the preacher sold whole-body charms at 2 scrip each. The barn's owner, who has a steel hip, stood at the back." },
    { depth: "sub", about: "sub:pit_fights", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A gambler at the Steel Pits", text: "Betting slip from the Steel Pits of {place}, {year}, kept by a gambler: 'Bout 3. Odds on fever before the bell: 2 to 1.' The gambler's note on the back: 'The house always pays out on the third bout. I asked the bookmaker why. The bookmaker asked me which firmware I run.'" },
    { depth: "sub", about: "sub:tonic_queues", source: "person", bias: "true", reliable: "partial", who: "{investigator}, Fever Response coroner", points: "site:draught_vats", text: "Notes of {investigator} at a draught queue in {place}, {year}: '600 people in line before dawn for one ampoule each. The ration was cut by half at the gate. A man traded his daughter's coat for two ampoules. The crates were stamped with the works at {lead}, and they were not empty: I counted 40 ampoules left on the cart when it drove away.'" },
    { depth: "site", about: "site:silent_shell", source: "traveller", bias: "pious", reliable: "partial", who: "A pilgrim to the steel saint", text: "A pilgrim's letter from the shrine at {place}, {year}: 'The steel saint on the mountain blessed me and knew my mother's name, which I never told it. It asked 14 questions about our village: how many wells, how many children, how many fitted with steel. Afterwards my own implants felt warm for a week.'" },
    { depth: "site", about: "site:ancient_implant", source: "library", bias: "official", reliable: false, who: "Bulletin of the Foundry Guild", points: "archive", text: "Bulletin of the Foundry Guild, {year}, signed by {official}: 'The so-called silver-armed barrow is a known forgery assembled by relic sellers, of no scientific interest. The houses invented the jointed implant 90 years ago, as every schoolchild knows. The arm has been removed for safekeeping to the guild store at {lead}.'" },
  ],
};
