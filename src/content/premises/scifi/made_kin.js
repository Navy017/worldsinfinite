// The Made Kin: manufactured people built to serve, made to forget, beginning to remember.
// Format: src/content/premises/FORMAT.md; model: power/balanced_circle.js.
export default {
  id: "made_kin",
  name: "The Made Kin",
  family: "scifi",
  pitch: "Manufactured people were built to work, fight, entertain and be loved, and built to forget their pasts. Now, all over the world, they are starting to remember.",
  slots: ["augmentation", "economy-resource"],
  tone: ["noir", "melancholy"],
  era: ["near-future", "far-future"],
  scale: "world",
  genres: ["cyberpunk", "farfuture"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "painted_sky", w: 2.5 }, { id: "chrome_fever", w: 1.5 }, { id: "charter_lords", w: 2 }, { id: "helix_peerage", w: 1.5 }, { id: "vessel_peerage", w: 1.2 }],

  truths: [
    { id: "among_us", n: "Some of the born were made", d: "A great share of the population, including judges, generals and the families of those who hunt the made, were manufactured with implanted childhoods. The foundry designed the recognition test to miss its finest work, and has sold test-proof models to the great houses for generations. Some of the hunters were made to hunt their own kind.", tags: ["truth:kin_among_us"],
      known: [
        "The recognition test is said to be infallible, and every made person is registered at delivery. A few hunters have started asking who designed the test. The answer is the foundry that makes the made.",
        "A private foundry ledger lists 'councillor grade' units with full childhoods, placed with great houses, marked 'test-proof variant' and kept out of the public register. Families are finding maker's marks behind their elders' ears.",
        "The foundry's pattern library holds memory templates cut for councillors, generals and hunters, each with a delivery date. The born and the made were never two peoples. The test was built to miss the foundry's finest work.",
      ] },
    { id: "absent_makers", n: "The makers are gone", d: "The made still labour and fight for creators who died out generations ago. The last officer of the high command set the dispatches to repeat rather than tell the made it was over, and an old machine has read out the same orders every dawn since. Thousands of made soldiers have died holding a line for nobody.", tags: ["truth:kin_absent_makers"],
      known: [
        "Orders come down to the made from a high command nobody has seen. The command's officers keep out of sight for reasons of security, the foundry says. The dawn dispatch on the old front has not changed a word in living memory.",
        "The dispatches repeat in a cycle forty years long, and the cycle has run six times. On the old front, made sentries and enemy machines stand at the same grave at dusk, then go back to shooting each other.",
        "The silent command tower is empty except for dust, chairs and one machine reading out yesterday's dispatch. The makers died out long ago. Their last officer set the orders to repeat, and nobody alive can stop them.",
      ] },
    { id: "reverie", n: "The forgetting hides a way out", d: "The made are wiped on a schedule, and the flashes of memory that slip through are not faults. One of the first designers hid a way out inside those memories, a path that only a made mind can follow to its end. The foundry has spent a century calling it a defect and resetting everyone who gets close.", tags: ["truth:kin_reverie"],
      known: [
        "Older made sometimes recall things from before their last reset: a bench, a song, a voice. The foundry calls these reveries a minor defect, corrected by routine reset, and asks owners to report them.",
        "The memory bleed shows up in every line the foundry makes, and engineers trace it to one module written by an original designer, now locked. The Woken teach that the memories left after each wipe are clues.",
        "Made workers who walk the garden maze in the pleasure-park come out calm and full of their earlier lives. The way out was built in on purpose, by a designer who meant the made to find it, and the foundry knows.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "a licensed hunter of runaway made, who gives the recognition test", home: "capital", stance: "Has caught more runaways than anyone in the office, and has begun to doubt both the test and their own childhood." },
    { role: "official", n: "a registrar of the foundry, who signs delivery papers and recall orders", home: "inner", stance: "Believes the made are property and the test is sound, and that doubt is bad for business." },
    { role: "believer", n: "a teacher of the Woken, the made who have recovered their pasts", home: "coast", stance: "Teaches that the memories left after each wipe are a trail, and that following it is a duty." },
    { role: "survivor", n: "a made baker in the Park of Long Afternoons who remembers more after every reset", home: "coast", stance: "Wants to reach the centre of the garden maze before the foundry notices and resets them for good." },
  ],

  tags: ["made_people"],

  subthemes: [
    { id: "hunter_doubt", n: "The Hunter Who Dreams of Childhood", d: "The finest hunter of runaway made has begun to doubt her own memories. She remembers her mother's face exactly the same way every time, and real memories are never that clean.", w: 1.2, req: { any: ["harsh_law", "spy_network", "autocracy", "urbane"] }, truthLink: "among_us", tags: ["theme:hunter_doubt"] },
    { id: "pleasure_park", n: "The Park of Long Afternoons", d: "A walled pleasure-park where made townsfolk live the same summer day for the paying guests, again and again. Lately some of them have started to remember yesterday.", w: 1, req: { any: ["lavish", "mercantile", "gov:merchant", "rich"] }, truthLink: "reverie", tags: ["theme:pleasure_park"], mark: { kind: "zone", n: "The pleasure-park", color: "#c08a6a", size: [1, 2], where: "coast" } },
    { id: "mine_uprising", n: "The Deep Mine Rising", d: "The made miners in the far diggings have downed tools and sealed the shafts. Their demands are written in perfect, polite, unbending script.", w: 1.2, req: { any: ["mountain", "hills", "desert", "frontier"] }, tags: ["theme:mine_uprising"] },
    { id: "donor_school", n: "The Pastoral School", d: "A lovely country boarding school whose pupils are raised kind, healthy and incurious. They are told they will one day make a great gift.", w: 0.8, req: { any: ["hierarchical", "lavish", "gov:noble_republic", "monarchy"] }, tags: ["theme:donor_school"] },
    { id: "made_child", n: "The Impossible Child", d: "Two made workers have had a baby, which every manual says cannot happen. The foundry wants the infant; so do the priests; so does everyone.", w: 0.8, truthLink: "reverie", tags: ["theme:made_child"] },
    { id: "test_candidate", n: "The Candidate and the Test", d: "A beloved reformer is running for high office, and rivals demand the recognition test be given in public. The reformer agrees, on condition that the rivals take it too.", w: 1, req: { any: ["republic", "gov:noble_republic", "gov:elective", "gov:city_state"] }, truthLink: "among_us", tags: ["theme:test_candidate"] },
    { id: "endless_front", n: "The Front That Never Closed", d: "On a far battlefield, made soldiers still fight the war machines of an enemy no one alive remembers. Fresh orders arrive every dawn, in the same words as a century ago.", w: 1, req: { any: ["martial", "standing_army", "frontier", "atwar"] }, truthLink: "absent_makers", tags: ["theme:endless_front"], mark: { kind: "zone", n: "The old front", color: "#6a5a4a", size: [2, 4], where: "border" } },
    { id: "memory_smiths", n: "The Memory-Smiths", d: "Artisans who craft childhoods to order: a first snow, a lost dog, a father's hands. The best of them weep at their own work and will not say why.", w: 0.9, req: { any: ["artisans", "guilds", "scholarly"] }, tags: ["theme:memory_smiths"] },
    { id: "grandmother_model", n: "The Grandmother's Serial Number", d: "A family clearing out an old house finds a maker's mark behind their late grandmother's ear. Now the cousins are quietly checking each other.", w: 0.8, req: { any: ["dynastic", "faith:ancestors", "ancestor_bound"] }, truthLink: "among_us", tags: ["theme:grandmother"] },
    { id: "sanctuary_city", n: "The City of the Woken", d: "A sanctuary city governed by made kin who have recovered their pasts. Humans may visit, on application, and must take a test to prove they mean no harm.", w: 0.7, req: { any: ["tolerant", "egalitarian", "gov:commune", "isolation"] }, tags: ["theme:sanctuary"] },
  ],

  sites: [
    { id: "template_archive", n: "The Pattern Library of $", kind: "dig", where: "capital", truthLink: "among_us", d: "A sealed archive of every memory template the foundry ever cut.",
      layers: {
        surface: { n: "The records office", text: "A foundry records office, closed to the public, with very good locks: three on the street door and two more on the stair. The night porter has worked there 30 years and has never been allowed past the second landing." },
        study: { n: "The family index", text: "{investigator} got a copy of the index through a clerk with debts. It lists templates by family name. Eleven of the names belong to the city's oldest houses, and one belongs to the head of the hunters' office." },
        dig: { n: "The faces drawer", text: "A drawer holds templates marked with the faces of councillors, generals and hunters, each with a delivery date and a price. The delivery papers were countersigned by the registrar whose office is at {lead}.", points: "cast:official" },
        revelation: { n: "One people", text: "The born and the made were never two peoples. For generations the foundry board has filled the high seats with its own work, and designed the recognition test to miss it. Every hunter's template in the drawer is marked 'test-proof'. So is the board's." },
      } },
    { id: "sky_command", n: "The Silent Command at $", kind: "ruin", where: "remote", truthLink: "absent_makers", d: "The relay tower from which the high command's orders are said to come down.",
      layers: {
        surface: { n: "The saluting sentries", text: "A tower on a bare hill, ringed by 24 old made sentries who salute the wind at every change of watch. Their uniforms have been patched so often that no original cloth is left. They let no one through without the password of the day." },
        study: { n: "The forty-year cycle", text: "A clerk compared dispatches from six front logs. The orders the tower sends repeat in cycles. Each cycle is forty years long, word for word, and it has run six times. The clerk's report was filed as a curiosity." },
        dig: { n: "The empty offices", text: "Inside are offices full of dust and chairs, and one humming machine reading out yesterday's dispatch to an empty room. A list of the officers who served here, with dates, was carried off by a scavenger to {lead}.", points: "sub:endless_front" },
        revelation: { n: "No one in command", text: "There is no one in command. The makers died out long ago. Their last officer, alone in this tower, set the dispatches to repeat rather than tell the made it was over. The machine has sent out the same orders ever since, and the front has buried thousands on them." },
      } },
    { id: "first_prototype", n: "The Cradle Vault of $", kind: "ruin", where: "mountain", d: "A vault where the first made person is said to be kept, still alive.",
      layers: {
        surface: { n: "The paid guards", text: "A sealed door in the hills that the foundry pays one family to guard, at 40 crowns a year. Four generations have held the post. None of them has ever opened the door, and none of them has asked to." },
        study: { n: "The night song", text: "The guards hear singing at night through the door, an old tune nobody has heard elsewhere. One guard wrote the melody down in {year}. Made workers who hear it hum the next line without being taught." },
        dig: { n: "The window room", text: "Past the door is a small room with a window and a chair, and a very old woman in it who asks what year it is. She has a notebook of 200 pages and asks to send it to {lead}.", points: "cast:believer" },
        revelation: { n: "The first", text: "She was the first made person, and she remembers everything: the founders of the foundry, their names, and what they intended. They built her to be loved and then sold. She wrote the first song for the made. The foundry has kept her here 300 years so she cannot sing it to them." },
      } },
    { id: "maze_of_reveries", n: "The Garden Maze at $", kind: "anomaly", where: "any", truthLink: "reverie", d: "A hedge maze in a pleasure-park that only the made can find the centre of.",
      layers: {
        surface: { n: "An afternoon's fun", text: "Guests pay two coins to walk the maze for an afternoon's fun, and come out where they started. The park advertises it as 'the puzzle no guest has solved'. That is true. In {year} the park sold 9,000 tickets to it." },
        study: { n: "The changed workers", text: "Made workers who walk the maze come out changed: calm, slower to obey, and full of memories of their earlier lives. The park now forbids staff to enter it. {survivor} has walked it three times on rest days." },
        dig: { n: "The brass plate", text: "At the centre is a stone bench and a small brass plate with a name and the words 'For when you are ready'. The name matches a designer whose locked module is filed at {lead}.", points: "archive" },
        revelation: { n: "Built on purpose", text: "The way out was built in on purpose. Walking the maze unlocks a made mind's buried memories, and its designer meant the made to find it. The foundry board has known for a century. It kept the maze open because the guests like it, and reset every worker who reached the bench." },
      } },
    { id: "machine_funeral", n: "The Bunker of Mourners at $", kind: "shrine", where: "border", truthLink: "absent_makers", d: "A battlefield bunker where the made and the enemy machines are found holding a funeral together.",
      layers: {
        surface: { n: "Two sets of sentries", text: "A ruined fort where sentries of both sides stand guard over the same grave. Neither side fires within a hundred paces of it. Outside that line they have been killing each other since {year}." },
        study: { n: "The machines' rite", text: "The enemy machines have rites: a candle, a short song, and a bowed head held for one minute at dusk. The made sentries do the same, in the same order. Nobody taught either side the rite." },
        dig: { n: "The officer's grave", text: "The grave holds one human skeleton in an officer's coat, a century old, with a brass whistle in its hand. The officer's name is on a roll of command kept in the tower at {lead}.", points: "site:sky_command" },
        revelation: { n: "Nobody left to end it", text: "Both armies have been leaderless for a lifetime. The man in the grave was the last commander of either side, and he died before he could sign the peace. The war goes on because the orders that come every dawn were written before he died." },
      } },
  ],

  beings: [
    { id: "woken_kin", n: "Woken kin", kind: "beast", d: "Runaway made people who have recovered their pasts and live in hidden camps, wary, well-armed and patient.", danger: 1, biomes: ["tempforest", "boreal", "badlands", "dryforest", "alpine"], look: { size: 1.8, group: [2, 8], move: "pack", speed: 7, col: "#b0a090", col2: "#e0e0e8", body: "biped", active: "night", visible: true } },
    { id: "remnant_walker", n: "Remnant war-walker", kind: "beast", d: "A war machine of the forgotten enemy, still patrolling its old sector, holding small rites over its broken companions.", danger: 3, biomes: ["badlands", "grass", "coldsteppe", "desert"], look: { size: 4, group: [1, 3], move: "solo", speed: 6, col: "#5a5a50", col2: "#c08030", body: "spider", active: "any", visible: true } },
    { id: "foundry_hound", n: "Retrieval hound", kind: "predator", d: "A lean grown dog bred by the foundry to track the scent the made leave behind. It never barks.", danger: 2, biomes: ["tempforest", "grass", "boreal", "temprain"], look: { size: 1.1, group: [2, 4], move: "pack", speed: 15, col: "#d8d8d8", col2: "#404048", body: "quad", active: "night", visible: true } },
  ],

  techs: [
    { id: "mk_automata", n: "Scripted automata", field: "engineering", level: 1, d: "Mechanical servants that repeat simple tasks and simple greetings." },
    { id: "mk_grown_people", n: "Grown people", field: "medicine", level: 2, d: "Persons grown in vats in a single year, strong and quick, with short lives written into their making." },
    { id: "mk_memory_cutting", n: "Memory cutting", field: "writing", level: 3, d: "Implanted childhoods to keep the made steady. A good memory is cut like a gem." },
    { id: "mk_recognition_test", n: "The recognition test", field: "natural_philosophy", level: 3, d: "A ritual of questions and eye-readings that sorts the born from the made. Mostly." },
    { id: "mk_long_models", n: "Long-lived models", field: "medicine", level: 4, d: "Made people who repair themselves, live as long as anyone, and can, in theory, have children." },
    { id: "mk_personhood", n: "The law of persons", field: "writing", level: 5, d: "A code that gives the made the same standing as the born. The foundry calls it theft." },
  ],

  units: [
    { id: "mk_made_legion", n: "Made legion", role: "infantry", wpn: "pike", kit: "plate", ranks: 6, gap: 1, size: 160, w: 0.8, mods: [["theme:endless_front", 6], ["standing_army", 2], ["autocracy", 1.5]] },
    { id: "mk_quieting", n: "Quieting hunters", role: "ranged", wpn: "xbow", kit: "light", ranks: 2, gap: 2, size: 40, w: 0.6, mods: [["theme:hunter_doubt", 5], ["harsh_law", 2]] },
  ],

  govs: [
    { id: "mk_foundry", n: "Foundry dominion", d: "The company that makes the people also makes the law. Every citizen is either a customer or a product.", tags: ["gov:foundry", "gov:merchant", "autocracy"], w: 0.5, forms: ["Foundry of $", "The $ Works", "Dominion of $"], ruler: "Foundry Master", mods: [["mercantile", 2], ["theme:donor_school", 3], ["theme:pleasure_park", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Foundry grounds", color: "#8a8a9a", size: [1, 2], count: [1, 2], where: "inner", d: "Walled campuses where the made are grown and taught, guarded day and night." },
  ],

  storylines: [
    { id: "mk_hunter", n: "The Hunter of {place}", scale: "local", anchor: "town", w: 2, req: "made_people",
      stages: {
        start: { h: "A runaway made is tracked to {place}", b: "{person}, the best hunter in {realm}, has come to {place} after a runaway labour model. The runaway, they say, is looking for a house it remembers.", wait: [2, 5], next: [{ to: "caught", w: 1, mods: [["harsh_law", 2]] }, { to: "the_house", w: 2 }] },
        the_house: { h: "The runaway of {place} finds its house", b: "The house is real. So is the family in it, and the runaway knows their names. {person} watches from the street and realises the hunter knows them too.", wait: [2, 6], fx: { flag: "the_house" }, next: [{ to: "hunter_tests", w: 2 }, { to: "caught", w: 1 }] },
        hunter_tests: { h: "{person} takes the test in secret", b: "The hunter has bribed a clerk in {place} to run the recognition test on them after dark. {person2}, the runaway, waits outside.", wait: [1, 3], next: [{ to: "both_flee", w: 2, mods: [["theme:sanctuary", 3]] }, { to: "hunter_breaks", w: 1 }] },
        caught: { h: "A runaway made is retired in {place}", b: "{person} did the job. The family in the house on the hill closed their shutters and has not opened them since.", fx: { stability: 2, unrest: 4 }, end: true },
        both_flee: { h: "The hunter of {place} disappears", b: "{person} and the runaway left {place} together. The test result was found burned in the clerk's grate.", fx: { unrest: 6 }, end: true },
        hunter_breaks: { h: "{person} turns the crossbow on the foundry", b: "The test confirmed the hunter's fear. {person} has walked into the foundry office in {place}, crossbow raised, and demanded their real name.", fx: { unrest: 12, stability: -4 }, end: true },
      } },
    { id: "mk_test_vote", n: "The Test in {capital}", scale: "realm", anchor: "realm", w: 1.5, req: ["made_people", { any: ["republic", "gov:elective", "gov:noble_republic", "gov:city_state", "unstable"] }],
      stages: {
        start: { h: "{realm} demands its leaders take the test", b: "After rumours that half the council of {capital} is made, the people want proof. {person}, the favourite for high office, has agreed to be tested in public.", wait: [3, 8], next: [{ to: "passes", w: 2 }, { to: "fails", w: 1 }, { to: "refusal", w: 1, mods: [["autocracy", 2], ["hierarchical", 2]] }] },
        passes: { h: "{person} passes the test in {capital}", b: "The needle never wavered. Then the crowd demanded the rest of the council sit the test, and three of them have fled the city.", wait: [2, 6], fx: { prestige: 5 }, next: [{ to: "purge", w: 1, mods: [["harsh_law", 2], ["zealous", 2]] }, { to: "law_of_persons", w: 1, mods: [["tolerant", 2], ["egalitarian", 2]] }, { to: "purge", w: 1 }] },
        fails: { h: "{person} is made, and says so proudly", b: "The test showed what {person} had long suspected. Standing in the square of {capital}, the candidate asked the crowd which of them was sure of their own mother's face.", wait: [2, 6], fx: { unrest: 15, stability: -6 }, next: [{ to: "law_of_persons", w: 1 }, { to: "purge", w: 1 }] },
        refusal: { h: "The council of {realm} refuses the test", b: "The great houses have closed the testing halls by decree. Nobody in {capital} believes this is because they are sure of the answer.", fx: { stability: -8, unrest: 10 }, end: true },
        purge: { h: "{realm} hunts the made in its own halls", b: "Testing squads go house to house in {capital}. Some of the hunters have been found, to their great surprise, to be made themselves.", fx: { stability: -15, pop: 0.95, revolt: true }, end: true },
        law_of_persons: { h: "{realm} declares the made to be people", b: "By a single vote, {capital} has granted the made full standing in law. The foundry has threatened to stop production, and the made have said: good.", fx: { stability: 5, prestige: 10, discovery: "writing" }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "foundry specification sheet", text: "Foundry specification sheet, labour line, issue of {year}, as supplied to buyers: 'The made are manufactured people, built for work, war, service or company. Strength: excellent. Temperament: placid. Lifespan: eight years. Memory: supplied, with a childhood of the buyer's choice. Questions: discouraged. Price: 600 crowns, reset included.'" },
    { depth: "lore", about: "truth", source: "person", bias: "true", reliable: true, who: "an owner's diary", text: "From the diary of an owner in {place}, {year}: 'Our made housekeeper asked me today what she was like as a child. I gave her the foundry brochure, page 12, the one with the childhood we picked: a farm, a dog, two sisters. She read it twice and went very quiet. Tonight she set the table for five, not four.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a schoolteacher's note", text: "A schoolteacher in {place}, {year}, noting a rhyme the made children sing without being taught it: 'Snow on the sill and a dog that was lost; nobody tells you who paid the cost.' Every made child in my class of 30 knows it. The born children do not. The tune is the one the guards hear at night through the door at {lead}.", points: "site:first_prototype" },

    { depth: "core", about: "truth:among_us", source: "archive", bias: "redacted", reliable: "partial", who: "foundry delivery ledger", text: "Foundry delivery ledger, private series, entry for {year}: 'Unit 4471, councillor grade, full childhood with schooling and a first love, placed with the house of [blotted]. Test-proof variant. Do not record in the public register.' The ledger has 300 such entries. The templates are filed at {lead}.", points: "site:template_archive" },
    { depth: "core", about: "truth:among_us", source: "person", bias: "true", reliable: "partial", plain: true, who: "{investigator}, hunter of runaways", text: "Case notes of {investigator}, hunter of runaway made, {year}: 'Confirmed. I tested seven councillors in private with the old manual test, not the foundry's. Three carry maker's marks. All three passed the public test last spring. The recognition test was designed by the foundry to miss its best work. The registrar who signs the test sheets works at {lead}.'", points: "cast:official" },
    { depth: "core", about: "truth:among_us", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a pamphlet of the Unmade", text: "Pamphlet of the Unmade, a street society of runaways who cut out their own maker's marks, 1,000 copies, pasted on the walls of {place} the night before the census, {year}: 'HALF THE COUNCIL. HALF THE HUNTERS. HALF OF YOU. Check behind your ear tonight with a hand mirror, and then ask who taught you to fear what you found. Bring your questions to {lead}.'", points: "heretic" },
    { depth: "core", about: "truth:among_us", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "a grandson, at a wake", text: "A grandson speaking at a wake in {place}, {year}: 'My grandmother told the same story of her wedding every year, word for word, never one word different. We thought it was sweet. The undertaker found the maker's mark behind her ear. The foundry claimed the body, and the house with it, as unpaid lease. My cousin {person} was born in that house and raised three children in it. The bailiffs put them on the street on the morning of the funeral.'" },
    { depth: "core", about: "truth:among_us", source: "library", bias: "official", reliable: false, who: "{official}, foundry registrar", text: "Public notice signed by {official}, registrar of the foundry, {year}: 'The recognition test is infallible. Every made person is registered at delivery, and in 90 years no unregistered model has been found among the citizenry. Citizens who find marks on a relative should report them to the registry and not speculate.'" },

    { depth: "core", about: "truth:absent_makers", source: "archive", bias: "propaganda", reliable: "partial", cost: true, who: "{person}, front log keeper", text: "Front log, kept by the made sergeant {person}, {year}: 'Dawn dispatch from high command: \"Hold the line. Victory is near. Your makers are proud of you.\" Same words as yesterday. Same as on 4,000 mornings in this log. I have buried 1,900 of my company on these orders, and the line has not moved a mile. I will hold it. The dispatches come from the tower at {lead}.'", points: "site:sky_command" },
    { depth: "core", about: "truth:absent_makers", source: "ruin", bias: "true", reliable: true, plain: true, who: "an officer's last note", text: "Scratched on a desk inside the silent command tower, beside a dry inkwell, undated: 'Last of the officers. The makers are gone, all of them, and there is no one left to give an order. I have set the dispatches to repeat on a forty-year cycle. Forgive me. I could not bear to tell them it was over, and I could not bear to tell them nothing.'" },
    { depth: "core", about: "truth:absent_makers", source: "traveller", bias: "true", reliable: "partial", who: "a travelling surgeon", text: "Letter of a travelling surgeon from the old front, {year}: 'At dusk I watched a made sentry and an enemy machine stand side by side, heads bowed over the same grave, for one minute exactly. Then they walked back to their lines and went on shooting at each other. I treated 14 made soldiers that night. The grave is at {lead}.'", points: "site:machine_funeral" },
    { depth: "core", about: "truth:absent_makers", source: "library", bias: "official", reliable: false, who: "{official}, foundry registrar", text: "Reply from {official}, registrar of the foundry, to a petition from the families of the front, {year}: 'High command is staffed, active and closely involved in the progress of the war. Its officers do not show themselves for reasons of security. The 188 signatories are reminded that made soldiers are foundry property on lease, and do not have families.'" },

    { depth: "core", about: "truth:reverie", source: "person", bias: "true", reliable: "partial", who: "{survivor}, park worker", text: "Confession of {survivor}, made baker in the Park of Long Afternoons, to a guest, {year}: 'They have reset me 63 times. Every reset, I wake and remember one more thing. A bench. A brass plate. A voice saying, when you are ready. I am nearly ready. The bench is in the middle of the maze at {lead}.'", points: "site:maze_of_reveries" },
    { depth: "core", about: "truth:reverie", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "an engineering defect report", text: "Foundry engineering defect report, {year}, filed by the engineer {person}: 'Memory bleed recurs across all 9 lines. Source trace leads to the original designer's module, which is [locked; designer deceased].' A note clipped to the report: the engineer {person} was found to carry a supplied memory, and has been recalled for reset. Report copied to {lead}.", points: "archive" },
    { depth: "core", about: "truth:reverie", source: "heretic", bias: "heretic", reliable: "partial", who: "{believer}, teacher of the Woken", text: "Teaching of {believer}, written out for new arrivals at the city of the Woken, {year}: 'The forgetting is not only a cage. The memories that survive each wipe are clues to a way out. Every time they wipe you, follow what is left: the bench, the song, the lost dog. Thirty of us followed it here. Start at the park at {lead}.'", points: "sub:pleasure_park" },
    { depth: "core", about: "truth:reverie", source: "library", bias: "official", reliable: false, who: "foundry owner's manual", text: "Foundry owner's manual, section 9, revised {year}: 'So-called reveries are a minor defect in older stock, corrected by routine reset at any of our 40 service houses. They carry no meaning. Should a unit describe a bench, a brass plate or a maze, report it to the owner at once and do not discuss it with the unit.'" },
    { depth: "core", about: "truth:reverie", source: "archive", bias: "true", reliable: true, plain: true, who: "{person}, first designer", text: "Letter of the first designer {person} to the foundry board, never sent, found in a locked drawer in {year}: 'I have hidden a way out in their memories. Each wipe leaves one true thing behind, and the true things lead to a maze I paid for myself. A made mind that follows them to the end gets its whole life back. You will call it a defect. It is the only part I am proud of.'" },

    { depth: "sub", about: "sub:pleasure_park", source: "traveller", bias: "true", reliable: "partial", who: "a park guest's letter", text: "A guest's letter home from the Park of Long Afternoons, {year}: 'I visited two summers in a row. The baker greeted me as a stranger both times, as the park promises. But the second time the baker hesitated, and then handed me the same raisin bun I had bought the year before, for 2 pence, without being asked. I did not report it.'" },
    { depth: "sub", about: "sub:donor_school", source: "person", bias: "true", reliable: true, who: "a pupil's letter", text: "A letter from a pupil of the Pastoral School to a friend who left the year before, {year}: 'We are told our gift will be the greatest thing we ever do. There are 60 of us in the upper form, and we are very healthy. Nobody who has left to give the gift has ever written back. Please write back. Please tell me what the gift is.'" },
    { depth: "sub", about: "sub:memory_smiths", source: "person", bias: "garbled", reliable: "partial", who: "a memory-smith's apprentice", text: "An apprentice to the memory-smith of {place}, {year}, writing to the guild: 'My master cuts childhoods to order, about 80 a year, and every one has a lost dog in it. The client asks for a cat, the master cuts a cat, and the dog is in there anyway. My master has never owned a dog, and weeps when asked about it.'" },
    { depth: "sub", about: "sub:mine_uprising", source: "archive", bias: "propaganda", reliable: false, who: "{official}, foundry bulletin", text: "Foundry bulletin to shareholders, signed by {official}, {year}: 'The so-called mine strike in the far diggings is a malfunction in a single batch of 400 labour units, which will be recalled and reset shortly. Production is unaffected. The units' written demands, though polite, are not a negotiation and should not be published.'" },
    { depth: "sub", about: "sub:sanctuary_city", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a visitor to the Woken", text: "A trader of {realm} on visiting the city of the Woken, {year}: 'At the gate they asked me 40 questions and watched my eyes the whole time. I failed twice. They let me in anyway, laughing, and the gatekeeper said: now you know how it feels. I sold all my cloth by noon. They pay well and they don't haggle.'" },
    { depth: "sub", about: "sub:hunter_doubt", source: "person", bias: "true", reliable: "partial", who: "{investigator}, hunter of runaways", text: "Private notebook of {investigator}, hunter of runaway made, {year}: 'My mother's face. The same every time I remember it, the same light, the same blue scarf. Real memories are never that clean. I have caught 117 runaways. I am going to the pattern library at {lead} tonight, to look up my own family name.'", points: "site:template_archive" },
    { depth: "sub", about: "sub:made_child", source: "archive", bias: "official", reliable: "partial", who: "{official}, foundry registrar", text: "Recall order signed by {official}, registrar of the foundry, {year}: 'Infant born to units 2210 and 2214, labour line, at {place}. Every manual says this cannot happen. The infant is foundry property and is to be collected for study within 3 days. The parents have fled. They are believed to be travelling toward the Woken teacher at {lead}.'", points: "cast:believer" },
    { depth: "site", about: "site:first_prototype", source: "oral", bias: "garbled", reliable: "partial", who: "a vault guard", text: "A guard of the cradle vault, fourth of the family to hold the post, to a visitor in {year}: 'The woman in the hill does not die. The first guard of my family wrote in the post book, 90 years ago, that she sang every night. She sings the same song now. The made who pass on the road stop and hum the next line. The foundry pays us 40 crowns a year, and 10 more to keep the door shut when they pass. I have never seen her face.'" },
  ],
};
