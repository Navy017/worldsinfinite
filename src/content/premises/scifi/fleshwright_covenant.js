// The Fleshwright Covenant: all technology is grown, bred and fed, and every made thing is still alive.
export default {
  id: "fleshwright_covenant",
  name: "The Fleshwright Covenant",
  family: "scifi",
  pitch: "Nothing here is built, only bred: houses grow, lamps glow with living light, guns have teeth, and every made thing is alive and must be fed.",
  slots: ["augmentation", "ecology", "monster-source"],
  tone: ["horror", "wonder"],
  era: ["renaissance", "industrial", "modern", "near-future", "far-future", "post-collapse"],
  scale: "world",
  genres: ["cyberpunk", "farfuture", "postapoc", "flintlock", "grimdark"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "long_mending", w: 2.5 }, { id: "grafted", w: 2.5 }, { id: "helix_peerage", w: 1.5 }, { id: "made_kin", w: 1.5 }, { id: "chrome_fever", w: 0.5 }],

  cast: [
    { role: "investigator", n: "a guild surveyor who maps the root-lines under the grown cities", home: "capital", stance: "Wants to know how far the roots run, and has started to fear the answer." },
    { role: "official", n: "a guildmaster of the wright guild", home: "inner", stance: "Holds that the realm runs on stock, and that a lamp in every window is worth whatever it costs." },
    { role: "believer", n: "a grey-robed Covenant Keeper sworn to the three laws", home: "mountain", stance: "Believes the Covenant must be kept to the letter, though nobody remembers who it was made with." },
    { role: "survivor", n: "a carrier child of the stock villages, now grown", home: "remote", stance: "Remembers the sweets and not the chair, and wants to know exactly what was taken." },
  ],

  truths: [
    { id: "one_flesh", n: "All the stock is one creature", d: "Every bred house, lamp and cart grew from one original stock, and they are still one organism, joined by roots and spores under every city. The Covenant was a treaty with it, made while it slept. Its heart under the cathedral has quickened by a third in one year, and it is waking inside everything the realm owns, including the houses people sleep in.", tags: ["truth:one_flesh"],
      known: [
        "Grown lamps in different houses flicker in time. The guild calls it a trick of the eye and charges households to replace them.",
        "A guild survey traces roots from the cathedral heart to whole districts, the harbour and the palace.",
        "A person sealed inside a grown wall counted the same pulse in every house, lamp and cart. The cathedral heart has sped up from 41 to 55 beats a minute.",
        "Confirmed: every grown thing is one body, and it is waking up. People live inside it.",
      ] },
    { id: "fed_on_children", n: "The stock is fed on its makers", d: "Wright-stock cannot be grown from nothing. Its seed is grown inside the children of the stock villages, fed to them in a sweet syrup and drawn out in the guildhall cellars at twelve, two jars a child. The children come home duller and never sing again, and some do not come home. The guilds have hidden this for generations, and every lamp in the realm runs on it.", tags: ["truth:fed_on_children"],
      known: [
        "Stock-village children are given a sweet syrup every week and taken to the guildhall at twelve. They come home pale and dull.",
        "A guild ledger counts 236 'carriers' a quarter, each listed by a child's first name, with 'losses' blotted out.",
        "The guildhall cellars hold padded chairs with drains, and jars of gold seed labelled by village.",
        "Confirmed: the stock is grown in children and drawn out of them. The guild calls the cellar a school.",
      ] },
    { id: "alien_kit", n: "The first wright was not human", d: "Fleshcraft was never invented. It was found in a grey seed-case under the first garden: a starter kit left by an older, inhuman people, who wrote their purpose into the base pattern of every bred thing. The first wrights copied the kit's terms into the bone archive and never met them. The guilds have been carrying out someone else's instructions for six hundred years, and the pattern says the owners will come back to collect.", tags: ["truth:alien_kit"],
      known: [
        "The guild histories begin in their year 300. Nobody can find a record of the first three centuries of fleshcraft.",
        "A line of non-human writing runs under every guild's work in the deep pattern of the stock.",
        "A grey seed-case under the first garden, opened from the inside, carries the same script on its walls.",
        "Confirmed: fleshcraft is a kit left by someone else, with terms the guilds never met. The Keepers' calendar gives a return date.",
      ] },
  ],

  tags: ["grown_tech"],

  subthemes: [
    { id: "sick_city", n: "The Feverish City", d: "A grown city has fallen ill. Its walls weep, its bridges sag, and the lamps flicker in a slow, steady rhythm that the night-watch say is like breathing.", w: 1.4, req: { any: ["has:city", "urbane", "realm:large"] }, truthLink: "one_flesh", tags: ["theme:sick_city"] },
    { id: "graft_hunger", n: "The Graft-Hunger", d: "Graft-takers buy gifts sewn into the body: fire in the palm, skin like bark, eyes for the dark. The gifts need feeding, and so do the takers, and the dens of the poor quarter are full of both.", w: 1.4, mods: [["urbane", 1.5], ["poor", 1.5], ["mercantile", 1.3]], tags: ["theme:graft_hunger"] },
    { id: "thinking_beast", n: "The Beast That Thinks", d: "A guild has bred a draught-creature that understands orders, then questions them, then writes its own name in the mud. The guild has not decided what it owns.", w: 1, req: { any: ["scholarly", "artisans", "guilds"] }, tags: ["theme:thinking_beast"] },
    { id: "feral_garden", n: "The Feral Gardens", d: "Escaped wright-stock has run wild in the old orchards. The trees have teeth, the hedges move at night, and the garden is spreading a mile a year.", w: 1.3, req: { any: ["forest", "jungle", "marsh", "warm"] }, truthLink: "one_flesh", tags: ["theme:feral_garden"], mark: { kind: "zone", n: "Feral garden", color: "#6a8a3a", size: [2, 5], where: "forest" } },
    { id: "carrier_children", n: "The Carrier Children", d: "In the stock villages, children are given a sweet syrup every week and taken to the guildhall at twelve. They come home pale, tired and duller than before.", w: 1.1, req: { any: ["poor", "hierarchical", "guilds"] }, truthLink: "fed_on_children", tags: ["theme:carrier_children"] },
    { id: "bone_war", n: "The Bone War", d: "Two realms fight with bred weapons: guns that bite, beasts that burrow, spores that only kill one bloodline. The battlefields will be growing for a century.", w: 1, mods: [["martial", 2], ["standing_army", 1.5]], tags: ["theme:bone_war"], mark: { kind: "zone", n: "Overgrown battlefield", color: "#7a3a4a", size: [1, 3], where: "border" } },
    { id: "loving_house", n: "The House That Loves", d: "An old grown house has come to love the family in it: it warms their beds, shuts out their creditors, and will not open its doors to let the daughter marry and leave.", w: 0.8, tags: ["theme:loving_house"] },
    { id: "sunken_utopia", n: "The Drowned Hive", d: "A grown city built under the sea, sealed off for a generation, rotting from graft-hunger and class war. Its lights can still be seen on calm nights.", w: 0.8, req: { any: ["coastal", "island", "has:port"] }, tags: ["theme:sunken_hive"] },
    { id: "naturalists", n: "The Bare-Handed", d: "A sect that refuses every grown thing: stone houses, iron tools, tallow candles. They are mocked as backward, and they are the only ones the plagues pass over.", w: 1.1, req: { any: ["pious", "ascetic", "insular", "mountain_folk"] }, tags: ["theme:bare_handed"] },
    { id: "ancient_pattern", n: "The Pattern in the Stock", d: "A wright reading the deep pattern of the stock has found, buried under every guild's work, a line of writing that is not any guild's and not any human hand.", w: 0.8, req: { any: ["scholarly", "learned", "academies"] }, truthLink: "alien_kit", tags: ["theme:ancient_pattern"] },
    { id: "covenant_keepers", n: "The Covenant Keepers", d: "Grey-robed wardens enforce the old pact: no grafting children, no breeding minds, no stock let loose. Nobody, including them, remembers who the pact was made with.", w: 1.1, req: { any: ["organised", "zealous", "pious", "gov:theocracy"] }, truthLink: "alien_kit", tags: ["theme:covenant_keepers"] },
  ],

  sites: [
    { id: "first_garden", n: "The First Garden of $", kind: "ruin", where: "remote", truthLink: "alien_kit", d: "A walled garden where the first stock was found, older than any guild.",
      layers: {
        surface: { n: "Glass trees", text: "A ring of thirty fused, glassy trees around a dry pool, avoided by every animal. Covenant Keepers guard the gate and turn pilgrims back without saying why. The Keepers' own novices are not allowed past the gate either." },
        study: { n: "No seasons", text: "The trees grow in exact spirals, and their rings record no seasons: one ring for every nineteen years, regular as a clock. {investigator} took a core and counted 600 years." },
        dig: { n: "The seed-case", text: "Under the pool is a seed-case of grey shell, larger than a cart, opened from the inside. Its walls carry a script no human ever wrote. A rubbing of it matches the oldest bone slabs at {lead}.", points: "site:bone_archive" },
        revelation: { n: "Instructions", text: "Fleshcraft was a kit left for whoever found it. Its makers wrote their purpose into the stock, and the stock has carried it out for 600 years through every guild that bred it. The guilds believe they invented their craft. They have been following someone else's plan, and the plan has a return date." },
      } },
    { id: "beating_cathedral", n: "The Grown Cathedral of $", kind: "wonder", where: "capital", truthLink: "one_flesh", d: "A cathedral of living bone and gristle, its heart still beating under the altar.",
      layers: {
        surface: { n: "Warm walls", text: "A vast ribbed hall, warm to the touch, its bells muscle and its windows membrane. Two thousand people hear service here every feast day and feel the floor pulse under their knees." },
        study: { n: "The pulse-book", text: "The heartbeat under the floor slowed for a century, to 41 beats a minute. Last spring it quickened to 55. {investigator} has read the dean's pulse-book, kept since the founding." },
        dig: { n: "The roots", text: "Roots from the heart run out under the city, joining every grown house, lamp and bridge in one web. {investigator} followed one root eleven miles, to the guildhall cellars at {lead}.", points: "site:harvest_hall" },
        revelation: { n: "Waking", text: "Every grown thing in the realm is one body, and its heart lies under this altar. The Covenant was signed while it slept. It is waking now, inside every house people sleep in. The wright guild has known for a year, and is selling more houses." },
      } },
    { id: "stock_sea", n: "The Stock-Mire of $", kind: "anomaly", where: "coast", d: "A bay of warm, pink sludge where the guilds once dumped spoiled stock.",
      layers: {
        surface: { n: "The pink bay", text: "A stinking bay of warm pink sludge that steams in winter and glows at night. The guilds dumped spoiled stock here for 200 years. Nobody fishes it except at night." },
        study: { n: "Half-things", text: "Things grow in the sludge and crawl out: half-lamps, half-crabs, half-cart-wheels. {investigator} catalogued forty kinds in one summer. Each is a guild product, a lamp or a cart or a house, gone wrong in a new way." },
        dig: { n: "The shape", text: "Far beneath, the sludge has built itself a shape with a mouth, turned toward the land. Its teeth are lamp-glass. The dumping orders that fed it were signed by guildmasters, and are held at {lead}.", points: "cast:official" },
        revelation: { n: "It remembers", text: "Waste stock does not die. It goes on growing, and it remembers what it was made to be and who threw it away. The shape is learning the guildmasters' names. Three of the seven who signed the dumping orders are still alive, and none of them has been told." },
      } },
    { id: "harvest_hall", n: "The Guildhall Cellars of $", kind: "dig", where: "inner", truthLink: "fed_on_children", d: "The cellars of a wright guild, where the carrier children are taken on their twelfth birthday.",
      layers: {
        surface: { n: "The children's door", text: "A grand guildhall with a children's door at the back, painted with sweets. On their twelfth birthdays the village children queue there in their best clothes, and a brass band plays." },
        study: { n: "Carriers", text: "The guild's ledgers count yield by 'carrier', and every carrier has a child's first name. {investigator} counted 236 a quarter, from fourteen villages, as far back as the books go." },
        dig: { n: "Chairs and jars", text: "Rows of padded chairs stand over drains, beside jars of pale gold seed labelled by village. The jars go to the lamp-works, and the shipping book is countersigned by the guildmaster at {lead}.", points: "cast:official" },
        revelation: { n: "Paid in childhood", text: "The stock is grown in children. The syrup seeds it, and the cellar takes it out, two jars a child. The children come home duller; a few do not come home. Every lamp in the realm was paid for with someone's childhood, and the guild calls the cellar a school." },
      } },
    { id: "bone_archive", n: "The Bone Archive of $", kind: "ruin", where: "mountain", d: "A cave library whose books are grown from bone and whose words are written in marrow.",
      layers: {
        surface: { n: "Grey slabs", text: "Shelves of grey slabs in a mountain cave, too regular to be stone. A Covenant Keeper sits at the entrance and charges scholars one crown a day to read, and two to copy." },
        study: { n: "Marrow letters", text: "The slabs are bone, and the grain of each forms letters when held to the light. {investigator} counted 3,000 slabs, the oldest at the back, in the deepest dark, where no lamp is allowed." },
        dig: { n: "The terms", text: "The oldest slabs are written in a script the newer ones translate, badly, as 'the terms'. The same spiral script covers the walls of the grey seed-case found under the pool at {lead}.", points: "site:first_garden" },
        revelation: { n: "Terms unmet", text: "The first wrights wrote down what the stock itself told them: the terms on which the kit was given. The lost fourth law of the Covenant is here. It reads 'return what you grow'. The guilds have grown six hundred years of stock and returned none of it." },
      } },
  ],

  beings: [
    { id: "feral_lampwing", n: "Feral lampwing", kind: "bird", d: "A bred lantern-bird gone wild, roosting in thousands in old orchards and glowing in waves at dusk.", danger: 0, biomes: ["tempforest", "rainforest", "temprain", "swamp", "river"], look: { size: 0.3, group: [10, 80], move: "flock", speed: 18, col: "#e8d070", col2: "#6a8a4a", body: "bird", active: "dusk", visible: true } },
    { id: "muscle_ox", n: "Draught-flesh", kind: "grazer", d: "A headless bred draught-beast of muscle and tendon, gone feral. It eats anything green and walks in slow herds.", danger: 1, biomes: ["grass", "savanna", "tempforest", "coldsteppe"], look: { size: 2.6, group: [3, 12], move: "herd", speed: 4, col: "#a05a50", col2: "#d8b0a0", body: "quad", active: "day", visible: true } },
    { id: "garden_stalker", n: "Garden-stalker", kind: "predator", d: "A runaway war-breed of bark and teeth that hunts the edges of the feral gardens. It is patient, and it smells of flowers.", danger: 3, biomes: ["tempforest", "rainforest", "swamp", "mangrove"], look: { size: 2, group: [1, 2], move: "solo", speed: 10, col: "#4a5a2a", col2: "#c03040", body: "quad", active: "night", visible: false } },
    { id: "mire_crawler", n: "Mire-crawler", kind: "marine", d: "A crab-like knot of spoiled stock that crawls out of the waste bays, half lamp and half claw.", danger: 1, biomes: ["shelf", "estuary", "lagoon"], look: { size: 0.8, group: [3, 20], move: "swarm", speed: 2, col: "#d08a8a", col2: "#f0e080", body: "crab", active: "night", visible: true } },
  ],

  techs: [
    { id: "fc_breeding", n: "Wright-breeding", field: "agriculture", level: 1, d: "Plants and beasts are bred for work to a guild pattern: oxen with no heads, vines that bear rope." },
    { id: "fc_living_lamp", n: "Living lamps", field: "alchemy", level: 2, d: "Glowing gourds and lantern-birds that light the streets, as long as somebody feeds them." },
    { id: "fc_grafting", n: "Grafting", field: "medicine", level: 2, d: "Gifts sewn into the body: bark skin, night eyes, fire glands. They need feeding, and so do the people who take them." },
    { id: "fc_grown_house", n: "Grown houses", field: "architecture", level: 3, d: "Houses, bridges and walls grown from seed in a season. They heal their own cracks, and some develop wills of their own." },
    { id: "fc_bone_guns", n: "Bone guns", field: "warfare", level: 4, d: "Bred weapons that spit barbed teeth. They must be fed meat, and they remember who fed them." },
    { id: "fc_self_shaping", n: "Self-shaping stock", field: "natural_philosophy", level: 5, d: "Stock that redesigns itself to its task, faster than any wright can follow." },
  ],

  units: [
    { id: "fc_graft_troops", n: "Graft-takers", role: "infantry", wpn: "axe", kit: "hide", ranks: 3, gap: 1.5, size: 60, w: 0.8, mods: [["theme:graft_hunger", 6], ["theme:bone_war", 4], ["martial", 1.5]] },
    { id: "fc_war_breeds", n: "War-breeds", role: "beast", mounted: 0, wpn: "spear", kit: "hide", ranks: 2, gap: 2.5, size: 40, w: 0.5, mods: [["theme:bone_war", 8], ["theme:feral_garden", 2]] },
  ],

  faiths: [
    { id: "fc_covenant", n: "The Covenant", d: "The pact with the stock is holy law: feed what you make, make no minds, loose nothing wild.", tags: ["faith:covenant", "organised"], w: 0.8,
      names: ["The Covenant of $", "The Keepers of the Pact", "The Grey Tithe"], mods: [["theme:covenant_keepers", 5], ["pious", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Stock farm", color: "#c08070", size: [1, 2], count: [1, 3], where: "inner", d: "Warm fields of breeding vats, fenced and guarded, where the realm's tools are grown." },
  ],

  storylines: [
    { id: "fc_house", n: "The Grown House of {place}", scale: "local", anchor: "town", w: 1.8, req: "grown_tech",
      stages: {
        start: { h: "A house in {place} will not open its doors", b: "The old grown house of the family of {person} has sealed itself shut. Inside, the family say they are warm and well fed, and quite unable to leave.", wait: [1, 4],
          next: [{ to: "wrights_called", w: 2 }, { to: "house_spreads", w: 1, mods: [["theme:feral_garden", 3], ["theme:sick_city", 3]] }] },
        wrights_called: { h: "Guild wrights cut into a house in {place}", b: "{person2}, a guild wright, has been sent to soothe the house. It bled when the wright cut it, and the whole street's lamps went dark.", wait: [2, 6], fx: { unrest: 6 },
          next: [{ to: "soothed", w: 2 }, { to: "house_spreads", w: 1 }, { to: "speaks", w: 0.6, mods: [["learned", 2], ["theme:ancient_pattern", 4]] }] },
        house_spreads: { h: "Every grown house in {place} closes its doors", b: "It began with one house. Now the whole of {place} is shut tight, and the walls are warm, and the lamps pulse together like one heart.", wait: [3, 8], fx: { stability: -8, unrest: 15, flag: "houses_closed" },
          next: [{ to: "burned", w: 1, mods: [["harsh_law", 2], ["zealous", 2]] }, { to: "speaks", w: 1 }] },
        soothed: { h: "The house of {place} opens again", b: "With feeding and patience, {person2} coaxed the house open. The family came out blinking. The daughter married within the month, and the house sulked for a year.", fx: { stability: 2 }, end: true },
        burned: { h: "{place} is burned to the root", b: "The crown ordered the grown quarter of {place} burned. It screamed for three days. The family of {person} were not among the survivors.", fx: { abandon_town: true, unrest: 12 }, end: true },
        speaks: { h: "The walls of {place} speak", b: "The houses of {place} have spoken, through a thousand membranes, one word in a language older than the guilds. The wrights of {realm} are trying to answer.", fx: { discovery: "natural_philosophy", stability: -5 }, end: true },
      } },
    { id: "fc_carriers", n: "The Carriers of {realm}", scale: "realm", anchor: "realm", w: 1.2, req: ["grown_tech", { any: ["poor", "hierarchical", "guilds", "learned"] }],
      stages: {
        start: { h: "A parent of {place} follows a child to the guildhall", b: "{person} did not believe the guildhall only sent children home tired. On the boy's twelfth birthday, {person} followed him there and saw the chairs.", wait: [2, 5],
          next: [{ to: "outcry", w: 2 }, { to: "vanished", w: 1, mods: [["harsh_law", 2], ["autocracy", 1.5]] }] },
        outcry: { h: "The carrier trade is exposed in {realm}", b: "Mothers across {realm} are barring their doors to the guild collectors. Every lamp in {capital} has gone dark for want of new stock.", wait: [3, 8], fx: { unrest: 18, stability: -6, flag: "carriers_exposed" },
          next: [{ to: "abolished", w: 1, mods: [["ruler:just", 3], ["pious", 1.5]] }, { to: "crushed", w: 1, mods: [["ruler:cruel", 3]] }, { to: "dark_age", w: 1 }] },
        vanished: { h: "A parent of {place} goes missing", b: "{person} has not been seen since speaking out in the market. The guild has paid for a new lamp on that street.", fx: { stability: 1 }, end: true },
        abolished: { h: "{ruler} forbids the harvest of children", b: "The guilds of {realm} may no longer take carriers. The realm will be darker and colder, and {ruler} says it will be cleaner.", fx: { treasury: -50, stability: 6, prestige: 6 }, end: true },
        crushed: { h: "The mothers' revolt is broken", b: "Guild war-breeds were turned loose on the crowds of {capital}. The collections have resumed, under guard.", fx: { revolt: true, pop: 0.95 }, end: true },
        dark_age: { h: "{realm} goes dark", b: "With no new stock, the lamps die, the houses starve, and the bridges sag. {realm} is learning to build in stone again.", fx: { growth: -0.003, science: { engineering: 0.6 } }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: true, who: "Guild primer for apprentices", text: "Guild primer for apprentices, first page, {year}, approved by {official}: 'Nothing we make is built. It is bred from wright-stock, the living seed-flesh, and it must be fed. A hungry lamp dims. A hungry house cracks. A hungry gun turns in the hand. Feed a lamp a pint of broth a week, and a house a cart of offal a month.'" },
    { depth: "lore", about: "power", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, Covenant Keeper", points: "site:bone_archive", text: "Catechism of the Covenant Keepers, as taught by {believer} to 9 novices at {place}, {year}: 'The laws of the Covenant are three: make no mind, loose nothing wild, graft no child. The fourth law is lost.' The novices are taught that the fourth was the most important. The Keepers hold that its full text survives, written in bone, at {lead}." },
    { depth: "lore", about: "power", source: "person", bias: "true", reliable: true, who: "A graft-taker of {place}", text: "Confession of a graft-taker to a Covenant Keeper at {place}, {year}: 'The fire in my hand is beautiful. I paid 60 crowns for it. It eats a pound of meat a day. When there isn't meat, it starts on the hand. I have lost two fingers this winter. I would pay the 60 crowns again.'" },

    { depth: "core", about: "truth:one_flesh", source: "ruin", bias: "true", reliable: true, plain: true, who: "A prisoner of a grown wall", text: "Scratched into a grown wall by someone sealed inside it, found by {investigator} when the wall was cut open in {year}: 'They all have the same pulse. Every house, every lamp, every cart. I counted for 9 days: 41 beats to the minute, all at once. It is one animal, and we live inside it. Count it with me.'" },
    { depth: "core", about: "truth:one_flesh", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, guild surveyor", points: "site:beating_cathedral", text: "Guild survey of root-lines by {investigator}, {year}: 'Root contact confirmed between the cathedral heart and the [removed] district. And the harbour. And the palace. And the 3 villages upstream.' A guild clerk has stamped it 'not for circulation'. The heart in question beats under the altar at {lead}." },
    { depth: "core", about: "truth:one_flesh", source: "oral", bias: "garbled", reliable: "partial", who: "A grandmother of {place}", text: "A grandmother of {place} to her grandchildren, overheard by {investigator} in {year}: never whisper secrets near a lamp, because all the lamps are cousins and they gossip. The family keeps its one lamp in a covered basket. The family savings, 40 crowns, sit under a stone slab, because stone does not listen." },
    { depth: "core", about: "truth:one_flesh", source: "heretic", bias: "exaggerated", reliable: "partial", cost: true, who: "Pamphlet of the Bare-Handed", points: "sub:naturalists", text: "Pamphlet of the Bare-Handed, {year}: 'You do not own your house. You live inside an animal, and it is learning to close its mouth.' Below is the account of {person}, whose house at {place} sealed its doors for 4 days in the fever-month. The family got out through the roof. {person}'s youngest did not. Come to the stone village at {lead}." },
    { depth: "core", about: "truth:one_flesh", source: "library", bias: "official", reliable: false, who: "{official}, wright guild", text: "Notice of the wright guild, signed by {official}, {year}: 'Every bred device is a separate organism with no connection to any other. Reports of synchronised lamps are a trick of the eye. A household that reports its lamps flickering in time will have them replaced at the household's expense, 12 crowns a lamp.'" },

    { depth: "core", about: "truth:fed_on_children", source: "archive", bias: "redacted", reliable: "partial", who: "Guild yield ledger", points: "site:harvest_hall", text: "Guild yield ledger, quarter ending {year}, from the cellars at {lead}: 'Carriers this quarter: 236. Average yield: two jars. Losses: [ink blot].' Every carrier is listed by a child's first name and a village. The ink blot is the size of a thumb and covers one number." },
    { depth: "core", about: "truth:fed_on_children", source: "person", bias: "true", reliable: true, plain: true, who: "A wright of the harvest cellars", text: "Diary of a guild wright of the harvest cellars, {year}: 'The stock is grown in the children. The syrup seeds it, the blood carries it, and at twelve we draw it out in the chair, two jars a child. They don't remember the chair. They only remember the sweets. Afterwards they are slower and greyer, and they never sing again. I have drawn 600.'" },
    { depth: "core", about: "truth:fed_on_children", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A pedlar at an inn in {place}", points: "cast:official", text: "A pedlar's account, told at an inn at {place} in {year}: in the stock villages there are no grown-ups who laugh. The children wear guild tokens on strings round their necks like bells, brass tokens stamped with the year each child turns twelve. The tokens are minted at the guildmaster's hall in {lead}. The pedlar sold 30 tin whistles there and never heard one played." },
    { depth: "core", about: "truth:fed_on_children", source: "library", bias: "propaganda", reliable: false, who: "{official}, wright guild", text: "Charity notice of the wright guild, {year}, signed by {official}: 'Wright-stock is cultured from vat-seed, which renews itself endlessly. The guild's school for village children, with its free syrup and its twelfth-birthday feast, is a charity of which {realm} is proud. 4,000 children attend.'" },
    { depth: "core", about: "truth:fed_on_children", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, once a carrier child", text: "Statement of {survivor}, once a carrier child of {place}, to {investigator}, {year}: 'I went into the cellar at twelve with my twin, {person}. I remember the sweets. I came home slow. {person} did not come home at all; the guild sent our mother a jar of honey and 5 crowns. I still have {person}'s token. The ledger says \"loss\".'" },

    { depth: "core", about: "truth:alien_kit", source: "ruin", bias: "true", reliable: "partial", plain: true, who: "{investigator}, guild surveyor", points: "site:first_garden", text: "Report of {investigator} on the seed-case under the pool at {lead}, {year}: 'A grey shell larger than a cart, opened from the inside. Its walls are covered in a script of spirals. I compared it with the deep pattern of 12 kinds of stock. It is in the stock, every cell of it. Fleshcraft was not invented. It was found, and the finders were not the makers.'" },
    { depth: "core", about: "truth:alien_kit", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, Covenant Keeper", text: "Sermon of {believer}, Covenant Keeper, at {place}, {year}: 'The Covenant was made with the Givers, who came before us and will come after. They left their garden for us to tend until they return.' The Keeper then read the date of the Givers' return from the old calendar. It falls 40 years from now. The congregation was not told what happens then." },
    { depth: "core", about: "truth:alien_kit", source: "heretic", bias: "heretic", reliable: "partial", cost: true, who: "{person}, expelled wright", text: "Letter of {person}, a wright expelled from the guild, {year}: 'Read the deep pattern far enough and you find a message. It is not a manual. It is a set of instructions, and we are the tools. I read it aloud to the guild council of 12. They took my licence, my workshop and my right hand, which the guild-surgeon removed for \"misuse of the stock\".'" },
    { depth: "core", about: "truth:alien_kit", source: "library", bias: "official", reliable: false, who: "Guild History of {realm}", text: "From the Guild History of {realm}, volume 1, {year} edition, approved by {official}: 'Fleshcraft was developed by the founding guild-mothers over three centuries of patient breeding, as the guild histories record in full, in 12 volumes.' Volume 1 begins in the guild's year 300. The first three centuries are in no volume at all." },

    { depth: "sub", about: "sub:graft_hunger", source: "person", bias: "true", reliable: true, who: "A graft-taker in the dens of {place}", text: "A graft-taker in the dens of {place}, talking to {investigator} in {year}: 'I sold my coat for a bark-skin graft so I wouldn't be cold. The graft cost the coat and 8 crowns. Now it wants feeding, a bowl of blood a day, so I'm cold and hungry both. The den-keeper sells the blood. The den-keeper also sold me the graft.'" },
    { depth: "sub", about: "sub:feral_garden", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A farmer's son of {place}", points: "site:beating_cathedral", text: "Letter of a farmer's son from {place}, {year}: 'The orchards walked a mile north last year. The farmers moved their fences. The orchards moved them back, 300 posts in a straight line, overnight. Father says the trees are spreading the same way the city roots spread, toward {lead}.'" },
    { depth: "sub", about: "sub:thinking_beast", source: "archive", bias: "official", reliable: false, who: "{official}, guild property court", text: "Ruling of the eastern guild's property court, {year}, signed by {official}: 'The so-called reasoning ox is a well-trained animal responding to cues. It is property and will be sold as such, reserve price 90 crowns.' Attached as exhibit 4 is a slate on which the ox has written, in mud, its own name and the word 'no'." },
    { depth: "sub", about: "sub:loving_house", source: "oral", bias: "true", reliable: "partial", who: "An old nurse of {place}", text: "Warning given by an old nurse of {place} to a bride on the eve of her wedding, written down by {investigator} in {year}: 'Never let a grown house see you pack. It will lock the doors, warm the bed and sing you to sleep, and you will wake up having decided to stay.' The nurse has lived in the same house for 61 years, and has never once packed." },
    { depth: "sub", about: "sub:naturalists", source: "temple", bias: "pious", reliable: "partial", who: "A stone door of the Bare-Handed", text: "Rule of the Bare-Handed, painted on a stone door at {place}, {year}: 'What is made should stay made, and what lives should be born.' The village behind the door has 80 stone houses, iron tools and tallow candles. In the last two fever-years it lost no one. The grown village down the road lost 40." },
    { depth: "sub", about: "sub:ancient_pattern", source: "library", bias: "true", reliable: "partial", who: "{investigator}, guild surveyor", points: "site:bone_archive", text: "Notes of {investigator} on the deep pattern of lamp-stock, {year}: 'Under the guild's marks there is a line of writing 4,000 cells long, in no guild's hand and no human hand. It repeats in every kind of stock I have read: lamp, house, gun and ox. The Keepers say a translation exists, cut in bone, at {lead}.'" },
    { depth: "site", about: "site:stock_sea", source: "traveller", bias: "garbled", reliable: "partial", who: "A night-fisher of the pink bay", points: "archive", text: "A night-fisher of the pink bay at {place}, talking to {investigator} in {year}: on still nights you can hear the bay. Not waves: a voice trying to say names. The fisher wrote down 7 of them. All 7 are guildmasters who signed the dumping orders kept in {lead}, and 3 of them are still alive." },
    { depth: "site", about: "site:beating_cathedral", source: "temple", bias: "pious", reliable: false, who: "The dean of the grown cathedral", text: "Notice on the cathedral door at {place}, {year}, signed by the dean: 'The heart beneath our altar is a gift and a sign of grace. It has always beaten at the same pace, 41 beats to the minute, and always will.' The guild surveyors counted 55 last spring. The notice was reprinted without change." },
  ],
};
