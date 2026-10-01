// The Unremembering: the world itself forgets, names and maps slip away in a mist, and something gains by it.
export default {
  id: "unremembering",
  name: "The Unremembering",
  family: "world",
  kind: "cycle",
  pitch: "A grey mist drifts across the world, and wherever it settles people forget: names, maps, whole centuries of history. Someone or something gains from everything that is lost.",
  slots: ["history-secret"],
  tone: ["melancholy", "grim"],
  era: ["bronze", "medieval", "renaissance"],
  scale: "world",
  genres: ["fantasy", "mythic", "grimdark"],
  w: 1,
  excludes: [],
  pairs: [{ id: "ward_walls", w: 2.5 }, { id: "falling_hour", w: 2 }, { id: "drowned_crown", w: 2 }, { id: "elder_lattice", w: 1.5 }, { id: "thinning", w: 1.5 }, { id: "wheel_of_suns", w: 1.3 }],

  cast: [
    { role: "investigator", n: "a copyist of a copying house who secretly keeps a second copy of everything", home: "inner", stance: "Believes the record matters more than the peace, and compares every new copy against the old one." },
    { role: "official", n: "a clerk of the crown's Office of Records", home: "capital", stance: "Holds that the realm is calmer for what it does not know, and files every order in triplicate." },
    { role: "believer", n: "a priest of the Church of Stillness who has walked into the mist 3 times", home: "remote", stance: "Teaches that forgetting is peace and that remembering is the root of every sin; is very calm about it." },
    { role: "survivor", n: "a rememberer, born immune to the mist and hunted since childhood", home: "mountain", stance: "Wants the forgotten history spoken aloud, whatever it costs, because the forgetting already cost the rememberer a family." },
  ],

  truths: [
    { id: "mercy", n: "The forgetting is a mercy", d: "At the end of a war that drew in every crown of its age, the survivors had killed too much to stop. So they laid the mist over the world on purpose and swore to forget the war rather than finish it. Wherever memory returns, the old hatreds return with it, and the war starts again where it paused.", tags: ["truth:forget_mercy"],
      known: [
        "A battlefield near the border holds the dead of every present-day people, fighting each other all at once. The crown calls it a minor skirmish. The farmers call it the old trouble and sell the iron.",
        "Where the mist lifted from one valley, neighbours who had traded for generations remembered who burned whose farm, and took up their spears within a season. The Church of Stillness preaches that remembering is the root of sin.",
        "A stone at the centre of the nameless battlefield carries a vow signed by every crown of that age: 'Let us forget, lest we finish this.' The Church keeps a copy and does not show it.",
        "Confirmed: the mist is a peace treaty. The crowns of a forgotten war chose to forget it because none of them could stop. Every place the mist lifts, the war resumes.",
      ] },
    { id: "feeder", n: "Something is eating", d: "A huge, old creature lives in a well under the marshes. It breathes out the mist and feeds on the memories the mist takes: names, faces, histories. For a century the memory brokers have fed it their unsold stock every month, and it has grown on that. It needs more every year, and it has started taking the brokers.", tags: ["truth:forget_feeder"],
      known: [
        "Marsh-folk say the fog is somebody's breath. Travellers in the deep fog describe a grey ridge longer than a town wall, rising and falling. The temple says nothing lives in the mist.",
        "The memory brokers buy memories from the poor and sell them to the rich. Their unsold stock goes out on carts along the marsh road every new moon. The carts come back empty.",
        "A ring of stones in a fog hollow breathes mist out in slow pulses. Ropes let down a hundred fathoms touch something warm that moves. A broker's tally-tag came back up knotted to one of them.",
        "Confirmed: a creature in the marsh-well breathes out the mist and eats the memories it takes. The memory brokers have fed it their unsold stock for a century, 6 carts a month, and now it is taking the brokers too.",
      ] },
    { id: "edit", n: "The crown chooses what is forgotten", d: "The mist is a tool. The crown's Office of Records has the books scraped by hand first, then sends the fog to finish the job, and so decides what the realm is allowed to remember. What looks like natural forgetting is censorship. In 1,400 recorded orders, the office has never once let the tax rolls be forgotten.", tags: ["truth:forget_edit"],
      known: [
        "The fog seems to come down on rebel towns and spare loyal ones. Chronicles have runs of blank lines that their copyists swear they did not leave. The crown calls itself the guardian of memory.",
        "In a library of 10,000 blank books, the pages were scraped with knives before the fog came. People born immune to the mist are ordered to present themselves to the provincial office, for their own protection.",
        "A sealed office under the blank library holds ledgers of what was removed, by whose order, and where the mist was sent next. The orders are countersigned by the crown's Office of Records.",
        "Confirmed: the crown edits the realm's memory. Clerks of the Office of Records choose what is to go, have the books scraped by hand, then send the fog to finish the job. In 1,400 orders, the tax rolls were always kept.",
      ] },
  ],

  tags: ["forgetting"],

  subthemes: [
    { id: "nameless_village", n: "The Village Without a Name", d: "A whole town woke one morning unable to say what it was called. The new name it chose has already begun to fade.", w: 1.3, req: { any: ["realm:small", "realm:tiny", "forest", "marsh", "hills"] }, tags: ["theme:nameless_village"] },
    { id: "rememberers", n: "The Hunted Rememberers", d: "A few people are born immune to the mist and remember everything. Some realms pay them; most burn them.", w: 1.3, req: { any: ["harsh_law", "zealous", "autocracy", "seers", "mystic"] }, truthLink: "edit", tags: ["theme:rememberers"] },
    { id: "copying_houses", n: "The Copying Houses", d: "Archivists who recopy every book every year, racing the fog. Their scriptoria are the realm's only memory, and they decide what gets copied first.", w: 1.4, req: { any: ["scholarly", "academies", "learned", "has:city", "faith:philosophy"] }, tags: ["theme:copying_houses"] },
    { id: "mist_church", n: "The Church of Stillness", d: "A faith that teaches forgetting is peace and remembrance is the root of every sin. Its priests walk into the mist to have their memories wiped, and come out calm.", w: 1.2, req: { any: ["pious", "pacifist", "ascetic", "faith:one_god", "organised"] }, truthLink: "mercy", tags: ["theme:mist_church"] },
    { id: "returning_war", n: "The War That Came Back", d: "In one valley the mist lifted. Within a season two peoples who had lived as neighbours remembered why they hated each other, and the old war resumed as if it had never paused.", w: 1, req: { any: ["martial", "frontier", "atwar", "has:rival"] }, truthLink: "mercy", tags: ["theme:returning_war"], mark: { kind: "zone", n: "The Waking Valley", color: "#8a4a3a", size: [1, 3], where: "border" } },
    { id: "memory_traders", n: "The Memory Brokers", d: "Merchants who buy memories from the poor and sell them to the rich: a first kiss, a mother's face, a trade secret. Nobody asks where the unsold memories go.", w: 1, req: { any: ["mercantile", "has:port", "urbane", "gov:merchant"] }, truthLink: "feeder", tags: ["theme:memory_brokers"] },
    { id: "moving_maps", n: "The Maps That Change", d: "Cartographers' maps redraw themselves in the night. Rivers move, towns vanish, and the royal surveyors have stopped admitting it.", w: 0.9, req: { any: ["navy", "great_roads", "scholarly", "realm:large", "realm:vast"] }, truthLink: "edit", tags: ["theme:moving_maps"] },
    { id: "feeder_cult", n: "The Mist-Fed", d: "People who walk into the fog on purpose and trade their memories for youth, luck or a dead child's voice. They come back younger, with most of their past gone.", w: 0.9, req: { any: ["marsh", "forest", "cold", "faith:spirits", "sacrifice"] }, truthLink: "feeder", tags: ["theme:mist_fed"] },
    { id: "forgotten_crime", n: "The King's Clean Slate", d: "The ruler has done something unforgivable, and the mist rolled over the capital the next week. Everyone agrees there was nothing to remember.", w: 0.8, req: { any: ["autocracy", "gov:absolute", "gov:empire", "spy_network"] }, truthLink: "edit", tags: ["theme:clean_slate"] },
    { id: "lost_lovers", n: "The Strangers' Weddings", d: "Husbands and wives wake not knowing each other. Courts are full of marriages no one can prove, and some couples marry again every spring, just in case.", w: 0.9, req: { any: ["egalitarian", "hospitable", "river_folk", "urbane"] }, tags: ["theme:strangers_weddings"] },
    { id: "carved_memory", n: "The Stone-Writers", d: "A people who carve everything that matters into rock, since stone is the only thing the mist does not wear away. Their cliffs are covered in grocery lists and love letters.", w: 1, req: { any: ["mountain", "mountain_folk", "hills", "artisans", "desert"] }, tags: ["theme:stone_writers"], mark: { kind: "zone", n: "The Written Cliffs", color: "#9a8a6a", size: [1, 2], where: "mountain" } },
  ],

  sites: [
    { id: "clear_valley", n: "The Clear Vale of $", kind: "anomaly", where: "mountain", d: "A high valley the mist has never entered, where everything is remembered.",
      layers: {
        surface: { n: "The sharp air", text: "A green high valley above {place} where the mist has never come. The air smells of cold stone. The shepherds can name their ancestors back 30 generations, and recite them at weddings, which take most of a day." },
        study: { n: "Two histories", text: "{investigator} wrote down the valley's history over 6 weeks: 30 generations and 212 kings by name. It does not match the official chronicle at any point. In the valley's version, the crown's founder is the ninth king of a much older line." },
        dig: { n: "The engine under the shrine", text: "Under the shrine floor is a buried engine of stone rings and channels. Every channel runs outward, and the mist at the valley's rim curls back from it. A builder's mark on the largest ring matches a mark in the old records at {lead}.", points: "archive" },
        revelation: { n: "Remembering on purpose", text: "The mist can be held back. Someone built this engine to keep one place remembering, as a spare copy of the world, and then the builders' own names were forgotten. The valley folk have oiled it for 30 generations without knowing what it does." },
      } },
    { id: "blank_library", n: "The Blank Library of $", kind: "ruin", where: "any", truthLink: "edit", d: "A great library whose ten thousand books are bound, catalogued and empty.",
      layers: {
        surface: { n: "White pages", text: "A great library in {place} holds 10,000 fine books with clean white pages. Thieves have taken the gilt and the clasps and left the paper. The town uses the books as account ledgers, at a penny a volume." },
        study: { n: "Knife marks", text: "The catalogue survives and lists titles: wars, kings, treaties. The pages were not wiped by fog. {investigator} held 40 of them to a lamp and found the scrape lines of knives, all made by right-handed scribes working the same way." },
        dig: { n: "The sealed office", text: "In a sealed office below are ledgers listing what was removed, by whose order, and where the mist was sent next. The orders are countersigned by the crown's Office of Records. Its present clerk, {official}, works at {lead}.", points: "cast:official" },
        revelation: { n: "The forgetting has clerks", text: "For centuries the crown's Office of Records has decided what the realm may know. It has the books scraped first, then sends the fog to finish the job. The ledgers list 1,400 orders. Not one of them touches the tax rolls." },
      } },
    { id: "nameless_field", n: "The Nameless Field near $", kind: "dig", where: "border", truthLink: "mercy", d: "A battlefield so large it spans three realms, and no one knows what war was fought there.",
      layers: {
        surface: { n: "The old trouble", text: "Rusted blades and bones turn up in the plough-soil near {place} for 20 miles, across three realms' borders. The farmers call it the old trouble and sell the iron to smiths by the cartload. Nobody knows which war it was." },
        study: { n: "Every army", text: "{investigator} sorted the gear from 500 graves. The dead wear the arms of every people of the present age, all fighting each other at once on one field. There are no victors' graves. Nobody buried anybody." },
        dig: { n: "The vow stone", text: "A stone at the centre of the field bears a vow signed by every crown of that age: 'Let us forget, lest we finish this.' The Church of Stillness holds a copy of the vow and does not show it. {believer} keeps it at {lead}.", points: "cast:believer" },
        revelation: { n: "The treaty of forgetting", text: "The mist was a peace treaty. The crowns of that age had killed so many that none could stop, so they laid the fog over the world and swore to forget. Their heirs still hold the same thrones. If people remember the war, they will finish it." },
      } },
    { id: "worn_statues", n: "The Faceless Avenue of $", kind: "ruin", where: "inner", d: "An avenue of royal statues whose faces have been smoothed away by something other than weather.",
      layers: {
        surface: { n: "Blank faces", text: "Two lines of tall stone figures flank the old avenue at {place}, 48 in all, each with a smooth oval where the face should be. The townsfolk hang lanterns on them at the new year and give them pet names." },
        study: { n: "Names gone, dates kept", text: "The inscriptions on the plinths are worn the same way, but only the names. The dates remain: {investigator} read 48 reigns covering 1,100 years. The realm's own chronicle begins 400 years ago." },
        dig: { n: "The lead box", text: "Under one plinth, sealed in lead, is a painted portrait that has kept its face. It looks very like the present ruler of {realm}, down to a scar over the left eye. A second sealed box is listed in the inventory kept at {lead}.", points: "archive" },
        revelation: { n: "The long dynasty", text: "The dynasty is far older than anyone knows, and it erases itself on purpose. Every few generations the ruling house has its own names scraped and the mist sent over its statues, so each new ruler can be a founder. The scar runs in the family." },
      } },
    { id: "memory_well", n: "The Breathing Well of $", kind: "anomaly", where: "remote", truthLink: "feeder", d: "A deep well in a fog-choked hollow, from which the mist rises like breath.",
      layers: {
        surface: { n: "The breathing stones", text: "A ring of old stones in a fog hollow beyond {place}. The fog comes out of it in slow pulses, about 4 a minute, like breathing. Brokers' carts go in on the marsh road every new moon, loaded, and come out empty." },
        study: { n: "Looking down", text: "Those who look down the well forget why they came, then their names, then how to walk. {investigator} looked for a count of 10, on a rope harness, and came up unable to read for 3 days." },
        dig: { n: "The rope", text: "Ropes let down 100 fathoms touch something warm that moves. Every rope comes back wet and smelling of old paper. One came back with a broker's tally-tag knotted to it. The brokers who use that tag trade at {lead}.", points: "sub:memory_traders" },
        revelation: { n: "The breather", text: "The mist is the breath of a creature below. The creature breathes in the world's memories and grows. The memory brokers have fed it their unsold stock every month for a century and taught it to expect more. Lately it has been taking the brokers." },
      } },
  ],

  beings: [
    { id: "mist_hound", n: "Mist-hound", kind: "predator", d: "A grey dog, almost invisible in fog, that runs ahead of the mist. Its bite does not wound; the bitten forget where they live and wander into the fog.", danger: 2, biomes: ["swamp", "temprain", "tempforest", "boreal", "grass"], look: { size: 1.1, group: [3, 8], move: "pack", speed: 20, col: "#c4c8cc", col2: "#8a9098", body: "quad", active: "night", visible: false } },
    { id: "the_breather", n: "The Breather", kind: "beast", d: "A creature too large to see whole, glimpsed as a ridge of grey hide in the deep fog or a slow eye opening in a marsh. Wherever it passes, whole villages forget it was ever there.", danger: 3, biomes: ["swamp", "temprain", "boreal", "tundra"], look: { size: 40, group: [1, 1], move: "solo", speed: 2, col: "#7a8088", col2: "#d0d4d8", body: "serpent", active: "night", visible: false } },
    { id: "hollow_folk", n: "Hollow folk", kind: "beast", d: "People emptied entirely by the mist. They walk the fog roads in patient lines, kind and smiling, and cannot be made to remember anything at all.", danger: 0, biomes: ["swamp", "grass", "tempforest", "temprain"], look: { size: 1.7, group: [4, 15], move: "herd", speed: 3, col: "#a8a49c", col2: "#e0dcd4", body: "biped", active: "any", visible: true } },
    { id: "ink_moth", n: "Ink moth", kind: "insect", d: "A grey moth that lays its eggs in books. Its larvae eat ink and only ink, and they gather thickest where the mist is coming.", danger: 0, biomes: ["tempforest", "temprain", "swamp", "grass"], look: { size: 0.05, group: [20, 200], move: "swarm", speed: 6, col: "#5a5a60", col2: "#c0b8a8", body: "insect", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "ur_daily_copy", n: "The daily copy", field: "writing", level: 1, d: "Scribes recopy every important record each season, so that something always survives the fog." },
    { id: "ur_stone_script", n: "Stone script", field: "architecture", level: 2, d: "A spare, deep-cut alphabet for writing on rock, which the mist does not wear away." },
    { id: "ur_memory_knots", n: "Memory knots", field: "writing", level: 2, d: "Corded records whose knots hold names and debts by touch, kept even by those who have forgotten how to read." },
    { id: "ur_mist_lamps", n: "Clearing lamps", field: "natural_philosophy", level: 3, d: "Lamps burning a bitter resin whose smoke pushes the mist back a few paces. Caravans travel inside their circle." },
    { id: "ur_memory_draught", n: "The remembering draught", field: "medicine", level: 4, d: "A tincture of the rememberers' blood that lifts the fog from one mind for a night. It is illegal in most realms, and the reason is never given." },
    { id: "ur_mist_engine", n: "The fog-engine", field: "arcana", level: 5, d: "A rite or machine that calls the mist and steers it. Whoever holds it decides what the world remembers." },
  ],

  units: [
    { id: "ur_editors", n: "Crown editors", role: "infantry", wpn: "sword", kit: "light", ranks: 2, gap: 2, size: 40, w: 0.4, mods: [["theme:clean_slate", 10], ["theme:rememberers", 4], ["spy_network", 2]] },
  ],

  govs: [
    { id: "ur_archive_state", n: "Archive state", d: "The keepers of the records rule, because they are the only ones who know what the law was yesterday.", tags: ["gov:ur_archive", "autocracy"], w: 0.4, forms: ["Archive of $", "The Recorded Realm of $", "Scriptorium of $"], ruler: "First Archivist", mods: [["scholarly", 4], ["theme:copying_houses", 6], ["academies", 2]] },
  ],

  faiths: [
    { id: "ur_stillness", n: "Stillness", d: "Forgetting is grace; the past is a wound and the mist its bandage. The faithful confess by walking into the fog.", tags: ["faith:ur_stillness"], w: 0.8, mods: [["pacifist", 2], ["ascetic", 2]], names: ["The Church of Stillness", "The Quiet of $", "The Grey Grace"] },
  ],

  mapMarks: [
    { kind: "zone", n: "Forgetting-mist", color: "#b4b8bc", size: [2, 6], count: [1, 3], where: "any", d: "Banks of grey mist that move like weather. Those who live inside forget a little more every year." },
    { kind: "zone", n: "Unmapped lands", color: "#d8d4c8", size: [1, 3], count: [0, 2], where: "remote", d: "Country that no map keeps for long; surveyors' lines fade off the page within the month." },
  ],

  storylines: [
    { id: "ur_rememberer", n: "The Child Who Remembers", scale: "local", anchor: "town", w: 2, req: "forgetting",
      stages: {
        start: { h: "A child in {place} remembers everything", b: "{person}, a cooper's child, can name every family that ever lived in {place} and what they did. Some of it the elders do not want named.", wait: [2, 6], next: [{ to: "hunted", w: 1, mods: [["harsh_law", 2], ["theme:rememberers", 3], ["autocracy", 1.5]] }, { to: "archivists", w: 1, mods: [["scholarly", 2], ["theme:copying_houses", 3]] }, { to: "mist_takes", w: 1 }] },
        hunted: { h: "Grey-coats come for the child of {place}", b: "Men with royal warrants and no names arrived in {place} asking for {person}. {person2}, a pedlar, smuggled the child out at night.", wait: [2, 6], fx: { unrest: 8 }, next: [{ to: "truth_spoken", w: 1, mods: [["unstable", 2]] }, { to: "caught", w: 1 }] },
        archivists: { h: "The copying house takes in {person}", b: "The scribes of {realm} have set {person} to dictating. The child has already filled forty books, and the history in them is not the one they were taught.", wait: [4, 10], fx: { science: { writing: 0.5 } }, next: [{ to: "truth_spoken", w: 1 }, { to: "war_returns", w: 1, mods: [["martial", 2], ["has:rival", 2]] }] },
        mist_takes: { h: "The mist comes to {place}", b: "A grey bank rolled in from the marsh and sat on {place} for three days. When it lifted, {person} was the only one who knew what the town had been called.", fx: { stability: -3, flag: "renamed" }, end: true },
        caught: { h: "{person} is taken to {capital}", b: "The child of {place} was caught on the river road. The child will be 'kept safe' in {capital}, and the town has already begun to forget the child ever lived.", fx: { stability: 2, unrest: 5 }, end: true },
        truth_spoken: { h: "{person} speaks the forgotten history", b: "Standing in the square of {capital}, {person} told the crowd what the crown had made them forget. Some wept. Some went home and found the knives.", fx: { stability: -15, revolt: true, discovery: "writing" }, end: true },
        war_returns: { h: "Old hatreds wake in {realm}", b: "The books of {person} reached the border. Now the people of {realm} remember what {rival} did to them, and {rival} remembers what was done back.", fx: { war: "rival", relation: { rival: -30 } }, end: true },
      } },
    { id: "ur_kings_forgetting", n: "What {ruler} Forgot", scale: "realm", anchor: "realm", w: 1.4, req: ["forgetting", { any: ["autocracy", "monarchy", "unstable", "big"] }],
      stages: {
        start: { h: "Something happened in {capital}", b: "There was a fire in {capital}, or a massacre, or a death; no one can agree. A week later the mist came down on the city and the question stopped mattering.", wait: [2, 5], fx: { flag: "edited" }, next: [{ to: "scribe_doubts", w: 1, mods: [["scholarly", 2], ["learned", 1.5]] }, { to: "quiet_years", w: 2 }] },
        scribe_doubts: { h: "A scribe of {capital} finds a missing page", b: "{investigator}, a copyist, found a ledger with one page cut out and a mist-order signed by the crown. The order is dated the day before the fog came.", wait: [3, 8], next: [{ to: "exposed", w: 1, mods: [["unstable", 2], ["republic", 1.5]] }, { to: "scribe_forgets", w: 1, mods: [["harsh_law", 2], ["spy_network", 2]] }] },
        quiet_years: { h: "{realm} enjoys a peaceful decade", b: "Nothing troubles {realm}. The harvests are good, the courts quiet, and nobody can quite remember the old ruler's face.", fx: { stability: 6 }, end: true },
        exposed: { h: "The crown's fog-orders are posted in {capital}", b: "The ledgers of the forgetting office were nailed to every temple door. The people of {realm} learned what they were made to forget, and who chose it.", fx: { stability: -20, revolution: true, prestige: -10 }, end: true },
        scribe_forgets: { h: "{investigator} is found wandering in the fog", b: "The copyist was found on the river road, smiling, unable to say their own name. The ledger was never found. {realm} is very calm.", fx: { stability: 3, unrest: 4 }, end: true },
      } },
    { id: "ur_feeder_hunt", n: "The Hunt for the Breather", scale: "realm", anchor: "frontier", w: 1, req: ["forgetting", { any: ["martial", "marsh", "frontier", "near:beasts", "learned"] }],
      stages: {
        start: { h: "Hunters of {realm} track the mist to its source", b: "{person}, who lost a whole family to the fog, leads a company of rememberers and lamp-bearers into the marshes beyond {place}, following the mist upstream.", wait: [3, 8], next: [{ to: "found_well", w: 2 }, { to: "company_lost", w: 1 }] },
        found_well: { h: "The hunters find a breathing well", b: "In a fog hollow the hunters found a ring of stones and something vast beneath it, breathing in. Their lamps guttered with every breath.", wait: [2, 6], next: [{ to: "slain", w: 1, mods: [["martial", 2], ["chance:high", 1.5]] }, { to: "bargain", w: 1, mods: [["mercantile", 2], ["theme:mist_fed", 3]] }, { to: "company_lost", w: 1 }] },
        company_lost: { h: "The company of {person} does not return", b: "Months later, a line of smiling strangers walked out of the marsh at {place}. One of them wore the coat of {person}, and did not know whose it was.", fx: { stability: -4 }, end: true },
        slain: { h: "The thing in the well is killed", b: "Burning oil and iron hooks: the hunters of {realm} killed the Breather in its hole. The mist burst outward in a great grey wave, and for a day every memory it had eaten fell back on the world at once.", fx: { prestige: 12, unrest: 25, discovery: "natural_philosophy", monument: { tier: 1, name: "The Hunters' Cairn" } }, end: true },
        bargain: { h: "{person} strikes a bargain with the mist", b: "{person} came home alone, looking years younger, and the fog no longer touches {realm}'s borders. Nobody asks what was traded, or whose memories feed it now.", fx: { stability: 8, flag: "mist_pact" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: false, who: "Treatise on Common Complaints", text: "From the Physician-Royal's Treatise on Common Complaints, {year}, chapter 8: 'Forgetfulness is the common lot of humankind. The so-called mist is marsh-fog, and its effect on memory is the effect of damp on the elderly; no more. The 2,000 cases reported to this office last year all came from damp districts. The remedy is a dry bed and less gossip.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: true, who: "a lullaby of the fog-villages", text: "Lullaby sung in the fog-villages around {place}, written down by {investigator} in {year}: 'Don't go in the grey, little one. The grey takes your name first, then your mother's, and then it takes the way home.' The singer, a mother of 4, sings it every night. There is a second verse. The singer has forgotten it, and so has everyone else in the village." },
    { depth: "lore", about: "truth", source: "archive", bias: "true", reliable: "partial", points: "archive", who: "{investigator}, copyist", text: "The chronicle of {realm}, as copied by {investigator} in {year}: a list of kings, then 40 blank lines, then the list resumes. In the margin {investigator} has written: 'I did not leave these empty. The copy I worked from had them full on Tuesday. The older copy it was made from should still be at {lead}, if nobody has been there first.'" },

    { depth: "core", about: "truth:mercy", source: "ruin", bias: "true", reliable: true, plain: true, who: "the vow stone, read by {investigator}", text: "Carved on the stone at the heart of the nameless battlefield, read by {investigator} in {year}: 'We, the 9 crowns of the world, have done too much to one another to ever stop. Our sons are all dead and we still cannot make peace. So we will lay the grey over the world and forget this war. Let us forget, lest we finish this.' Below are 9 royal seals." },
    { depth: "core", about: "truth:mercy", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, priest of the Church of Stillness", text: "Sermon of {believer}, priest of the Church of Stillness, given at {place} in {year} to 300 people: 'The grey is a mother's hand over your eyes. Do not pull it away. You would not like what you see. I have walked into the mist 3 times, and each time I came out lighter. Ask yourselves what you are so keen to remember, and why it is always a wrong.'" },
    { depth: "core", about: "truth:mercy", source: "person", bias: "true", reliable: "partial", cost: true, who: "a soldier of the Waking Valley", text: "Letter from a soldier of the Waking Valley to a brother, {year}: 'Last spring we traded wool with them across the ford. Then the mist lifted. Now I remember my father's farm, and who burned it, and the name of every man who held the torch. I cannot stop remembering. Three days ago I killed Dav Orrin at that same ford. We drank together last harvest. I sharpen my spear at night.'" },
    { depth: "core", about: "truth:mercy", source: "heretic", bias: "heretic", reliable: "partial", points: "site:nameless_field", who: "{survivor}, rememberer", text: "Pamphlet of {survivor}, a rememberer, printed in secret at {place}, {year}: 'The crown tells you forgetting keeps the peace. A peace you cannot remember making is not peace. It is a sleep, and we will wake with the knife already in our hands. Go and walk the field at {lead}. Count the graves: I counted 3,000 in one morning. Then tell me who signed for us to forget them.'" },
    { depth: "core", about: "truth:mercy", source: "library", bias: "official", reliable: false, who: "Short History of {realm}", text: "From the Short History of {realm}, issued to schools by the crown, {year}, page 4: 'There has been no great war in the history of {realm}. The ancient battlefield near {place} is the site of a minor border skirmish of perhaps 200 men, much exaggerated by local legend. Pupils who find bones on school outings should hand them to the teacher.'" },

    { depth: "core", about: "truth:feeder", source: "oral", bias: "garbled", reliable: "partial", who: "a reed-cutter of the marshes, to {investigator}", text: "A reed-cutter of the marshes beyond {place}, to {investigator}, {year}: 'Marsh-folk say the fog is a grandmother's breath. She's very old and very hungry, and she likes the taste of names best of all. That's what we tell the children. I've cut reeds here 40 years and I'll tell you the rest: you can hear her swallow on a still night.'" },
    { depth: "core", about: "truth:feeder", source: "traveller", bias: "exaggerated", reliable: "partial", cost: true, points: "site:memory_well", who: "Hob Fenner, carter", text: "Statement of Hob Fenner, carter, given at {place} in {year}: 'I took a broker's load out toward the well at {lead}. In the fog I saw a grey ridge longer than a town wall, rising and falling. Every time it rose, I forgot something. I came back without my wife's name. I have it written on my hand now: Liss. I read it each morning. I do not know her face.'" },
    { depth: "core", about: "truth:feeder", source: "person", bias: "true", reliable: true, plain: true, who: "a memory broker's ledger", text: "Last page of a memory broker's ledger, {place}, {year}: 'For the record, since I will not remember it: there is a beast in the marsh-well. The beast breathes out the fog and eats what the fog takes. We have fed it our unsold stock every new moon for 100 years, 6 carts a time. It always wants more now. Last month it wanted mine. I have written my name inside the cover.'" },
    { depth: "core", about: "truth:feeder", source: "ruin", bias: "true", reliable: "partial", who: "{investigator}, copyist", text: "Sketch and note by {investigator} from a drowned village near {place}, {year}: 'On the wall of the chapel, a great coiled shape drawn in charcoal, mouth open. Flowing into the mouth are little pictures of houses, faces, boats and names, 70 or more. The charcoal is fresh. The village has been empty 50 years.'" },
    { depth: "core", about: "truth:feeder", source: "temple", bias: "official", reliable: false, who: "a temple notice", text: "Notice from the temple of {place}, {year}: 'Nothing dwells in the mist. Tales of a beast within it are the confusion of those who wandered in, and should be pitied rather than believed. The temple offers a free bed for 3 nights to any person who has lost their name, and asks that they not frighten the other guests.'" },

    { depth: "core", about: "truth:edit", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "a royal order, seals scraped", text: "Royal order found in {year}, half its seals scraped away: '...the matter of the eastern towns is to be closed. Fog to be sent at the new moon. Books of the 4 eastern houses to be scraped beforehand. The copyist Arla Venn, found keeping a second copy, to be walked into the fog at {place}. Copyists of the third house to be...' The rest is cut off." },
    { depth: "core", about: "truth:edit", source: "heretic", bias: "exaggerated", reliable: "partial", points: "cast:official", who: "scratched on a tavern table", text: "Scratched into a tavern table at {place}, {year}, and copied by the magistrate's constable before the table was burned: 'THE FOG HAS A CLERK. THE CLERK HAS A LEDGER. ASK WHY IT NEVER FORGETS THE TAX ROLLS. THE CLERK LIVES AT {lead}.' The constable's report adds that 14 people had carved their initials underneath." },
    { depth: "core", about: "truth:edit", source: "person", bias: "true", reliable: true, plain: true, points: "site:blank_library", who: "a dying copyist, to {investigator}", text: "Confession of a dying copyist, taken down by {investigator} at {place}, {year}: 'The crown chooses what is forgotten. I worked 31 years for the Office of Records. We scraped the books first, then they sent the grey. Always that order. The grey only finished what the knives began. The ledgers are under the library at {lead}. I scraped half of them myself.'" },
    { depth: "core", about: "truth:edit", source: "library", bias: "propaganda", reliable: false, who: "{official}, Office of Records", text: "Preface to the Annual Register of {realm}, signed by {official} of the Office of Records, {year}: 'The crown is the great guardian of memory. Its 12 copying houses preserve the realm's history against the mist without fear or favour. Where records have been lost to the fog, the Office has kindly restored them from its own copies, with improvements.'" },

    { depth: "sub", about: "sub:nameless_village", source: "oral", bias: "true", reliable: true, points: "cast:survivor", who: "the reeve of a village near {place}", text: "The reeve of a village near {place}, to a tax assessor, {year}: 'We called it Heron's Ford for a while. Then Mill Green, then Three Oaks. Now we just say here, and it seems to stay put better. If you want the old names, there's a rememberer who knew us all, at {lead}. Mind, you'd have to find the rememberer before the grey-coats do.'" },
    { depth: "sub", about: "sub:rememberers", source: "archive", bias: "official", reliable: "partial", who: "an edict of {realm}", text: "Edict of {realm}, {year}, posted in 40 towns: 'All persons of unnatural memory are to present themselves to the provincial office for their own protection. They will be housed, fed and paid 2 shillings a week for their gift. Failure to present is treason.' A clerk has noted on the file copy: 'Presented this year: 6. Returned home: 0.'" },
    { depth: "sub", about: "sub:copying_houses", source: "library", bias: "true", reliable: "partial", who: "rule-board of a copying house", text: "Rule-board in the copying house of {place}, {year}, with a note by {investigator}: 'Laws first, deeds of land second, holy texts third, histories when there is time.' {investigator} writes underneath: 'There is never time. We have 9 scribes and 4,000 books, and the fog takes a book in about 3 years. Histories have not been copied since I was an apprentice.'" },
    { depth: "sub", about: "sub:memory_traders", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a ship's purser at {place}", text: "Letter of a ship's purser from the port market of {place}, {year}: 'I watched a lord pay 40 crowns for a fisherman's memory of his wedding day. The broker drew it out with a silver cup and a lot of talk. The fisherman walked off whistling, a stranger to his own wife, who was waiting outside with the boat.'" },
    { depth: "sub", about: "sub:moving_maps", source: "person", bias: "true", reliable: true, points: "library", who: "a royal surveyor, journal", text: "Journal of a royal surveyor, {place}, {year}: 'I have drawn the river at {place} 3 times. Each morning it is somewhere else on the page, a mile east, then two. The river itself has not moved; I have walked it with a chain. Somebody is changing the maps, not the land. I have sent all 3 drafts to {lead} to be kept apart.'" },
    { depth: "sub", about: "sub:carved_memory", source: "ruin", bias: "true", reliable: true, who: "cliff-writing, copied by {investigator}", text: "Cut into the cliff above the road at {place}, copied by {investigator} in {year}. The same line, 11 times, in one hand that grows older down the rock over perhaps 30 years: 'Ama loves Teo.' The last line is newer and shakier: 'Do not forget this, Ama.' Below it, in a different hand, someone has cut: 'Who is Ama?'" },

    { depth: "site", about: "site:clear_valley", source: "traveller", bias: "exaggerated", reliable: "partial", points: "site:worn_statues", who: "a wool buyer, letter from the high vale", text: "Letter of a wool buyer from the high vale, {year}: 'The shepherds told me the names of 212 kings I had never heard of, and laughed when I named ours. Him, they said, he is the one who came after the fire. The shepherds swear his real face is on a statue in the avenue at {lead}, if anyone digs. I bought 30 fleeces and left before supper.'" },
    { depth: "site", about: "site:blank_library", source: "ruin", bias: "true", reliable: "partial", points: "archive", who: "a note left in an empty book", text: "Note left in an empty book in the blank library at {place}, unsigned, {year}: 'Every page in this hall was scraped by hand. I found the knife marks on 600 pages and stopped counting. Fog does not use knives. The catalogue is the only thing they left whole. A copy of it went to {lead} before I came here.'" },
  ],
};
