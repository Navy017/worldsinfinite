// The Balanced Circle: transmutation by equal exchange, and the hidden cost of its greatest works.
// This file is the model for every premise; the format is documented in src/content/premises/FORMAT.md.
export default {
  id: "balanced_circle",
  name: "The Balanced Circle",
  family: "power",
  pitch: "A strict science of transmutation in which nothing is made from nothing. The greatest works of the age are secretly paid for with human lives.",
  slots: ["power-source", "state-control", "economy-resource"],
  tone: ["grim", "heroic"],
  era: ["medieval", "renaissance", "industrial"],
  scale: "world",
  genres: ["fantasy", "shonen", "flintlock", "grimdark"],
  w: 1,
  excludes: [],
  pairs: [{ id: "grafted", w: 3 }, { id: "elder_lattice", w: 2.5 }, { id: "nursery_sea", w: 2 }, { id: "ward_walls", w: 1.5 }],

  // the power, as the world understands it (shown once enough is known)
  power: {
    name: "circlework", user: "circle-wright", users: "circle-wrights",
    taught: "Matter can be reshaped if what goes in balances what comes out. Energy rises from the earth-current beneath the land.",
    rules: ["Mass and kind must balance: iron becomes iron, never gold.", "Every working needs a drawn circle.", "Failed workings rebound on the body.", "Nothing is made from nothing."],
    forbidden: "Remaking or raising a human being.",
  },

  // the recurring people of this premise; each world names them and gives each a home town
  cast: [
    { role: "investigator", n: "a surveyor of the crown's mapping office who measures the earth-current", home: "mountain", stance: "Wants the numbers to add up, and has started to suspect the crown's own maps." },
    { role: "official", n: "a censor of the Academy of Circlework, who licenses wrights and approves the textbooks", home: "capital", stance: "Believes the Academy keeps wrights safe by keeping them ignorant of what the crown does with circles." },
    { role: "believer", n: "a circle-breaker preacher who calls circlework theft from the gods", home: "border", stance: "Hunts wrights as apostates, and knows more about the red stone than most wrights do." },
    { role: "survivor", n: "a survivor of the purged province, who was a child when it burned", home: "inner", stance: "Wants the province's dead named, and the crown to say why they died." },
  ],

  // the hidden truth: a world picks one
  truths: [
    { id: "souls", n: "The catalyst is made of souls", d: "The red catalyst that seems to break the law of balance does not break it at all. It is made from human lives, about three hundred prisoners to a stone, and every miracle worked with it spends some of them. The crown's workshops make it and call the prisoners a levy.", tags: ["truth:soul_catalyst"],
      known: [
        "Relic-hunters dig for a red stone that lets a wright work without balance. Every fake one found so far was made near a village that is now empty. The Academy says the stone is a myth.",
        "A half-burned royal requisition sends four hundred prisoners to the Twelfth Workshop 'for the catalyst trials'. A dying wright confessed to making one stone, which was warm and whispered for a week.",
        "Shards from the Red Grave each weigh exactly as much as one person on a wright's balance. The crown's workshops have taken in prisoners by the hundred, and none of them have come out.",
        "Confirmed: the red catalyst is made of people. About three hundred prisoners go into each stone, and each miracle worked with it uses some of them up. The crown's workshops make the stones to order.",
      ] },
    { id: "nation_circle", n: "The nation is the circle", d: "The founding realm's borders, roads and fortresses were laid out as one vast circle. The founders placed its wars and massacres at the nodes to charge it with deaths, and they are still in office, waiting for the last one.", tags: ["truth:nation_circle"],
      known: [
        "Every great battle of the old wars was fought on a spot chosen generations before. A surveyor's map from a sealed tower joins the border forts with one ruled line, and the line is a perfect circle.",
        "{survivor} grew up in a province purged for a rebellion that never happened. The soldiers burned the bodies in rings measured with chains. The province lies exactly on the line between two border forts.",
        "Tunnels under the capital join chambers that sit exactly where the city's old massacres happened, each cut with a circle pointing to the next. Seven ministers have had the same names and signatures for forty years.",
        "Confirmed: the realm is a circle. Its borders, wars and purges were laid out by the founders to charge one working with deaths. The founders still sit in the Inner Ministry, and one node is still uncharged.",
      ] },
    { id: "stolen_flow", n: "The flow is not ours", d: "The power does not rise from the earth. It is drawn from a huge creature asleep beneath the world, and every circle pulls a little from it. It has stirred faster since the crown put a wright in every regiment, and the lands where the most circlework is done are slowly dying.", tags: ["truth:stolen_flow"],
      known: [
        "In a few valleys no circle works at all, and wrights who enter fall sick with nosebleeds within a day. The Academy blames veins of inert stone and calls the valleys of geological interest only.",
        "Eastern flow-readers say the current is alive and in pain, and ask how much the west draws each year. A needle survey of a dead valley found the current running down into the ground, not up.",
        "A shaft under the Dead Valley breathes: warm air out for four minutes, in for four. An older tally in Academy chalk on the shaft wall shows the Academy measured the rhythm long before the miners did.",
        "Confirmed: the earth-current is drawn from a living animal asleep beneath the world. The Academy's flow ledger shows its breathing has quickened by a third since the crown put a wright in every regiment.",
      ] },
  ],

  // tags every realm in the world gets while this premise is active
  tags: ["alchemy"],

  // regional themes; each world assigns a few to realms, weighted by the realm's tags
  subthemes: [
    { id: "chimera_regiments", n: "The Chimera Regiments", d: "An army of beast-fused soldiers, made for a war and discarded after it. Some have gone feral; some want to be citizens.", w: 1.5, mods: [["martial", 2], ["autocracy", 1.5]], tags: ["theme:chimeras"], mark: { kind: "zone", n: "Chimera wilds", color: "#7a4a6a", size: [2, 5], where: "remote" } },
    { id: "sacrificed_province", n: "The Sacrificed Province", d: "A province was purged in a 'rebellion' that was really a charge for the great circle. The survivors were scattered and the records burned.", w: 1, req: { any: ["autocracy", "big", "realm:large", "realm:vast"] }, truthLink: "nation_circle", tags: ["theme:purge"], mark: { kind: "zone", n: "The Silent Province", color: "#5a5a5a", size: [1, 1], where: "inner" } },
    { id: "catalyst_hunt", n: "The Hunt for the Catalyst", d: "Relic-hunters scour ruins for the red stone. Every fake one found so far cost a village to make.", w: 1.2, truthLink: "souls", tags: ["theme:catalyst_hunt"] },
    { id: "eastern_flow", n: "The Eastern Flow-Readers", d: "A foreign school that reads the earth-current for healing and works where the state school fails. The state calls it superstition.", w: 1, req: { any: ["faith:spirits", "faith:philosophy", "mystic", "scholarly"] }, truthLink: "stolen_flow", tags: ["theme:flow_readers"] },
    { id: "circle_breakers", n: "The Circle-Breakers", d: "Zealots who hunt circle-wrights as blasphemers who unmake the forms of creation. Their own temple miracles are circlework.", w: 1, req: { any: ["zealous", "pious", "gov:theocracy"] }, tags: ["theme:inquisition"] },
    { id: "state_wrights", n: "The Licensed Wrights", d: "The crown ranks and pays its wrights as weapons. A yearly examination doubles as recruitment for the next war.", w: 1.4, req: { any: ["autocracy", "monarchy", "standing_army"] }, tags: ["theme:state_wrights"] },
    { id: "steel_limbs", n: "The Steel-Limb Guilds", d: "So many were maimed by rebounds and wars that limb-smiths are rich and respected. Their guilds keep their own secrets.", w: 0.8, req: { any: ["artisans", "urbane"] }, tags: ["theme:prosthetics"] },
    { id: "gold_crisis", n: "The Gold Crisis", d: "Someone has finally made gold. The markets are drowning in it, and nobody will say what it cost.", w: 0.6, req: { any: ["mercantile", "has:port"] }, truthLink: "souls", tags: ["theme:gold_crisis"] },
    { id: "homunculus_court", n: "The Ageless Ministers", d: "Certain ministers have not aged in sixty years. Each is named, oddly, for a vice.", w: 0.5, req: { any: ["autocracy", "gov:empire"] }, truthLink: "nation_circle", tags: ["theme:homunculi"] },
    { id: "vanished_city", n: "The City That Vanished", d: "An ancient desert city emptied in a single night. Its streets form a perfect circle, visible only from the mountains.", w: 0.8, req: { any: ["desert", "hot", "badlands"] }, tags: ["theme:vanished_city"] },
  ],

  // dig sites and anomalies; each has layers that are uncovered in turn
  sites: [
    { id: "circle_city", n: "The Ring of $", kind: "ruin", where: "remote", d: "A ruined city whose streets form a perfect circle. Everyone in it died on the same night.",
      layers: {
        surface: { n: "Rings of wall", text: "Seven rings of broken wall stand in the sand, each 220 paces from the next. Caravan guides camp outside the outer ring and will not sleep inside it. They say the city died in one night, and the Academy's maps give the same date." },
        study: { n: "The largest circle", text: "{investigator}, a crown surveyor, walked the streets with chain and compass in {year}. The streets are a working circle, the largest ever drawn, with balancing marks cut into the kerbstones. The outer ring is scorched black on its inner face, as if by one flash." },
        dig: { n: "Bones in spokes", points: "archive", text: "Beneath the central square lie thousands of bones laid out in spokes, heads to the middle, around a fist-sized hollow where something red was set. The gatehouse census lists 41,000 people. A copy of the census went to {lead}." },
        revelation: { n: "One stone", text: "The founders' wrights drew this city's streets as one circle and used up all 41,000 people in a single night to make one red stone. The stone went to the founders' treasury. The city's name was struck from the rolls, and the Academy teaches the night as a plague." },
      } },
    { id: "failed_lab", n: "The Sealed Workshop of $", kind: "ruin", where: "any", d: "A sealed laboratory with a skeleton missing exactly the limbs a failed working takes.",
      layers: {
        surface: { n: "The bricked cellar", text: "A bricked-up cellar lies under a wright's house in {place}. The house has stood empty for 60 years, and the neighbours avoid it. Children dare each other to touch the bricks, which stay warm all winter." },
        study: { n: "A child's notes", text: "Through a gap in the bricks, {investigator} recovered a notebook on raising the dead, in a child's careful hand. Every equation balances. The last page lists the 13 ingredients of a human body with their market prices: water, chalk, iron, salt and the rest." },
        dig: { n: "Two bodies", points: "cast:official", text: "Inside the circle lie two bodies: a child missing an arm and a leg, and one that was only partly human. A scorched licence names the wright of the house, struck off in {year}. The Academy's file on the house is held by the censor at {lead}." },
        revelation: { n: "What comes back", text: "Two children tried to raise their dead mother with the notebook's circle. The working balanced: the elder child paid an arm and a leg, and what came back was a body with nobody inside it. The Academy sealed the cellar and the file, and filed the notebook in its own library." },
      } },
    { id: "node_tunnels", n: "The Undercroft of $", kind: "dig", where: "capital", truthLink: "nation_circle", d: "Tunnels that trace a ring beneath a capital, with stained chambers at fixed intervals.",
      layers: {
        surface: { n: "Old drains", text: "Brick tunnels trace a ring nine miles round under {place}. The city engineers call them old drains, but they carry no water. A lamplighter who walked them in {year} counted 12 side chambers, each with a stained floor." },
        study: { n: "Where the massacres were", text: "{investigator} laid the chamber positions over the city's own chronicles. All 12 chambers sit under the sites of the city's old massacres, riots and executions, each within ten paces. The tunnels are older than the oldest of those killings." },
        dig: { n: "Circles pointing on", points: "sub:sacrificed_province", text: "Each chamber holds a circle cut into the floor, and each circle's outer mark points to the next chamber. The mark in the last chamber points out of the city, along the north road, toward the purged province at {lead}." },
        revelation: { n: "One design", text: "The founders planned the capital, the borders, the wars and the purges as a single working, and placed every death on a node to charge it. The Inner Ministry still keeps the plan. Eleven of the twelve chambers here are stained. The twelfth floor is clean and newly swept." },
      } },
    { id: "flowless_valley", n: "The Dead Valley of $", kind: "anomaly", where: "mountain", truthLink: "stolen_flow", d: "A valley where no circle works at all.",
      layers: {
        surface: { n: "Sick wrights", text: "Five licensed wrights of {realm} have entered the valley since {year}. All five came out within a day with nosebleeds and fever, and none of their circles did anything. The shepherds graze it happily and think wrights are soft." },
        study: { n: "The needle survey", text: "A survey party under {investigator} hung a current-needle on a thread at every mile. Everywhere else in {realm} the needle points up. Here all fourteen pointed down, toward a sinkhole at the head of the valley. The report asks for miners." },
        dig: { n: "The shaft", points: "archive", text: "Under the sinkhole is a shaft cut with tools, deeper than nine hundred feet of rope. Warm air flows out of it for four minutes, then in for four. Beside the miners' tally is an older tally in Academy chalk. The Academy's flow ledger is kept in {lead}." },
        revelation: { n: "What the wrights draw on", text: "The current is not heat from the earth. It is drawn from a living animal far beneath the valley, and every circle in {realm} pulls a little from it. The flow ledger records its breathing for 300 years. It has quickened by a third since the crown put a wright in every regiment." },
      } },
    { id: "red_grave", n: "The Red Grave at $", kind: "dig", where: "any", truthLink: "souls", d: "A mass grave salted with red crystal shards, each warm to the touch.",
      layers: {
        surface: { n: "A plague pit", text: "A mass grave by the old war road is marked on parish maps as a plague pit from {year}. The ground glitters with red crystal shards, each warm to the touch. Pedlars sell them as hand-warmers, two for a copper." },
        study: { n: "Shards that hum", text: "The shards hum when a living person stands over them and fall silent near the dead. {investigator} counted 340 shards in one cart-load of soil. The parish register records no plague that year, only 'the levy delivered'." },
        dig: { n: "A person's weight", points: "archive", text: "Each shard is a piece of a failed catalyst. On a wright's balance, each one weighs as much as a grown person. A royal requisition for 'four hundred, eastern levy' matches the grave's count, and the requisition book is held in {lead}." },
        revelation: { n: "What the stone is made of", text: "The Twelfth Workshop tried to make a red catalyst from 400 prisoners of the eastern levy. The stone cracked, and the workshop buried the shards with the bodies and called it plague. The catalyst is made of people. The workshop's master was promoted, and the next attempt worked." },
      } },
  ],

  // creatures and peoples this premise adds (land fauna format, plus how they look)
  beings: [
    { id: "feral_chimera", n: "Feral chimera", kind: "beast", d: "A beast-soldier gone wild: wolf, man and a third animal fused together by a circle. Clever, bitter, and dangerous.", danger: 3, biomes: ["tempforest", "boreal", "grass", "badlands", "dryforest"], look: { size: 2.2, group: [1, 4], move: "pack", speed: 9, col: "#6a4a3a", col2: "#9a8a7a", body: "quad", active: "dusk", visible: true } },
    { id: "circle_hound", n: "Circle-hound", kind: "predator", d: "A war-dog transmuted for speed and stamina, now breeding in the wild.", danger: 2, biomes: ["grass", "tempforest", "coldsteppe", "savanna"], look: { size: 1.4, group: [3, 8], move: "pack", speed: 14, col: "#4a3a2a", col2: "#8a2a2a", body: "quad", active: "any", visible: true } },
  ],

  // what realms can learn (content/tech.js INVENTIONS format); gated to this premise automatically
  techs: [
    { id: "bc_codified_balance", n: "The law of balance", field: "alchemy", level: 1, d: "Circlework is written down as a science: what goes in must balance what comes out." },
    { id: "bc_field_circles", n: "Field circles", field: "engineering", level: 2, d: "Wrights raise walls, bridges and trenches in a night on the battlefield." },
    { id: "bc_flesh_work", n: "Flesh-work", field: "medicine", level: 3, d: "Circles that close wounds and fuse bone, and, in the wrong hands, fuse creatures." },
    { id: "bc_steel_limbs", n: "Steel limbs", field: "engineering", level: 3, d: "Jointed prosthetics wired to the nerves by a small permanent circle." },
    { id: "bc_tattooed_arrays", n: "Tattooed circles", field: "arcana", level: 4, d: "Circles inked into the skin, so the wright never needs chalk." },
    { id: "bc_catalyst", n: "The red catalyst", field: "alchemy", level: 5, d: "A stone that seems to work without balance. Nobody who knows what it is made of will say." },
  ],

  // troops this premise adds (content/military.js UNITS format)
  units: [
    { id: "bc_wrights", n: "Battle wrights", role: "magic", wpn: "staff", kit: "robe", ranks: 2, gap: 3, size: 25, w: 2, mods: [["theme:state_wrights", 4], ["gov:magocracy", 2]] },
    { id: "bc_chimeras", n: "Chimera regiment", role: "beast", mounted: 0, wpn: "axe", kit: "hide", ranks: 3, gap: 1.6, size: 80, w: 0.6, mods: [["theme:chimeras", 10]] },
  ],

  // marks this premise leaves on the map regardless of subthemes
  mapMarks: [
    { kind: "zone", n: "Glass waste", color: "#c9c2b0", size: [2, 4], count: [0, 2], where: "desert", d: "Sand fused to glass where a great working went wrong." },
  ],

  // storylines that only happen in worlds with this premise (content/storylines.js format)
  storylines: [
    { id: "bc_resurrection", n: "The Siblings of {place}", scale: "local", anchor: "town", w: 2, req: "alchemy",
      stages: {
        start: { h: "Two orphans of {place} bury their mother", b: "{person} and {person2}, the wright's children, were seen carrying chalk and books into the cellar the night after the funeral.", wait: [2, 5], next: [{ to: "attempt", w: 2 }, { to: "talked_down", w: 1, mods: [["pious", 2], ["just", 1.5]] }] },
        attempt: { h: "A flash in a cellar in {place}", b: "Neighbours saw red light under the door. {person} was found missing an arm and a leg; {person2} was not found at all.", wait: [3, 8], fx: { unrest: 10, flag: "attempted" }, next: [{ to: "armour", w: 2 }, { to: "taken_by_crown", w: 1, mods: [["autocracy", 2], ["theme:state_wrights", 3]] }] },
        talked_down: { h: "A priest stops a foolish working in {place}", b: "The circle was scrubbed away before it was finished. {person} and {person2} were taken in by the temple.", fx: { stability: 2 }, end: true },
        armour: { h: "A suit of armour walks in {place}", b: "{person2} lives, after a fashion: a soul bound to an old suit of armour by a blood mark. The two have set out to find a way to undo it.", wait: [6, 18], fx: { flag: "armour" }, next: [{ to: "found_truth", w: 1, mods: [["learned", 2]] }, { to: "lost_on_road", w: 1 }] },
        taken_by_crown: { h: "The crown takes an interest in {person}", b: "A wright who survived the forbidden working is too valuable to ignore. {person} has been offered a licence, and a steel arm, by the court of {realm}.", fx: { science: { alchemy: 0.5 } }, end: true },
        found_truth: { h: "The siblings of {place} return with a terrible answer", b: "{person} and {person2} came home knowing what the red catalyst is made of. Some say they burned their notes; some say the court has them.", fx: { discovery: "alchemy", unrest: 15 }, end: true },
        lost_on_road: { h: "No word from the siblings of {place}", b: "It has been a year. A suit of armour was seen walking alone on the road east. Nobody has seen it since.", end: true },
      } },
    { id: "bc_catalyst_war", n: "The Red Stone of {realm}", scale: "realm", anchor: "realm", w: 1.5, req: ["alchemy", { any: ["autocracy", "big", "atwar"] }],
      stages: {
        start: { h: "{realm} sends its wrights after the red stone", b: "Royal circle-wrights have been ordered to find, or make, the red catalyst. Ruins across the realm are being dug up.", wait: [4, 10], next: [{ to: "fake_stone", w: 2 }, { to: "made_stone", w: 1, mods: [["atwar", 2], ["ruler:cruel", 3]] }] },
        fake_stone: { h: "A false stone crumbles in {capital}", b: "The stone the wrights brought back cracked on its first use. The village where it was made is gone.", wait: [3, 8], fx: { stability: -6, unrest: 20 }, next: [{ to: "made_stone", w: 1, mods: [["ruler:cruel", 2]] }, { to: "abandoned", w: 2, mods: [["ruler:just", 3], ["pious", 2]] }] },
        made_stone: { h: "{realm} wields the red stone", b: "The wrights of {realm} now work miracles at will, with no circle and no balance. Whole towns have emptied, and no one will say where the people went.", wait: [6, 14], fx: { prestige: 15, pop: 0.8, flag: "stone" }, next: [{ to: "stone_war", w: 2, mods: [["has:rival", 2]] }, { to: "revealed", w: 1, mods: [["learned", 2], ["unstable", 2]] }] },
        stone_war: { h: "{realm} turns the stone on its enemies", b: "With the red stone behind them, the wrights of {realm} marched. Rivers were turned and walls unmade in an afternoon.", fx: { war: "rival", prestige: 10 }, end: true },
        revealed: { h: "The secret of the stone is out in {realm}", b: "A deserter's letters reached the streets: the stone is made of the vanished towns. The capital is in uproar.", fx: { stability: -25, revolt: true }, end: true },
        abandoned: { h: "{ruler} forbids the search for the stone", b: "Whatever the stone is, {ruler} has decided the realm will not pay its price. The digs are closed and the wrights recalled.", fx: { stability: 5, prestige: 3 }, end: true },
      } },
  ],

  // lore fragments, scattered through the world. depth: core (about the truth), sub (a subtheme),
  // site (a site, beyond its layers), lore (general background about the premise).
  // about: "truth:<id>" | "truth" (true whichever truth) | "sub:<id>" | "site:<id>" | "power"
  // source: library | temple | ruin | oral | traveller | person | archive | heretic
  // bias: official | pious | heretic | propaganda | true | garbled | exaggerated | redacted
  // reliable: true (accurate) | partial | false (misleading or wrong)
  // who: the attribution shown under the text. points: where the fragment sends the reader ({lead} names it).
  // plain: states its truth outright (one per truth). cost: a named person pays for the truth (one per truth).
  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: true, who: "Academy primer, lesson one", text: "Academy of Circlework, primer for first-year wrights, lesson one, {year} edition: 'Balance is the first law. What you take from the world you must give back in kind and weight: a pound of iron for a pound of iron, never gold. Every working needs a drawn circle. The wright who forgets this loses a hand, and is lucky. Last year 23 students forgot.'" },
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", who: "Academy primer, lesson two, approved by {official}", text: "Academy primer, lesson two, approved by {official}, censor, {year}: 'The earth-current is the heat that rises from the hot stone beneath the crust, as heat rises from a hearth. A circle drawn on the ground catches it and spends it on the working. The current is inexhaustible and belongs to no one. Students who ask where it comes from are to be referred to this paragraph.'" },
    { depth: "lore", about: "power", source: "oral", bias: "garbled", reliable: true, who: "A farm wife of {place}, to {investigator}", text: "Told by a farm wife of {place} to {investigator}, a crown surveyor who stopped to ask the way, {year}: 'My grandmother says a circle is a promise to the ground. Break the promise and the ground keeps what you owe. My brother drew one to mend a plough in the dry year, and the ground kept two of his fingers. We use the smith now.'" },
    { depth: "core", about: "truth:souls", source: "ruin", bias: "true", reliable: true, cost: true, who: "{person}, prisoner of the eastern levy, cell 9", text: "Scratched on the wall of cell 9 under the Twelfth Workshop, signed {person}, prisoner of the eastern levy, {year}: 'They counted us in. Three hundred. The wright said each of us was worth a pebble's weight of red. I am a tanner from the eastern hills, and I stole one sheep. Tell my wife the sheep was for her.'" },
    { depth: "core", about: "truth:souls", source: "heretic", bias: "heretic", reliable: true, points: "site:red_grave", who: "{believer}, circle-breaker preacher", text: "Sermon of {believer}, circle-breaker preacher, at the market cross of {place}, {year}: 'The stone is made of people. Every miracle they work with it uses one of those people up, and one more voice stops screaming. You do not believe me? Go to the plague pit at {lead}. Pick up a red shard and stand over it. It hums for the living. Ask yourself why.'" },
    { depth: "core", about: "truth:souls", source: "archive", bias: "redacted", reliable: "partial", points: "archive", who: "A royal requisition, half-burned", text: "A royal requisition, half-burned, raked out of a workshop stove in {year}: '...prisoners from the eastern levy, four hundred, to be delivered to the Twelfth Workshop for the catalyst trials. Rations for six days only. No names are to be...' The rest is ash. The clerk's stamp gives the book number, and the full requisition book is held in {lead}." },
    { depth: "core", about: "truth:souls", source: "person", bias: "true", reliable: true, plain: true, who: "A dying wright, confession taken by a priest", text: "Confession of a dying wright, taken down by a priest of the {faith} at {place}, {year}: 'I worked at the Twelfth Workshop for eleven years. The red stone is made of prisoners, three hundred to a stone, and I made one. It was warm. It whispered for a week, and then it stopped, and then it worked. The crown has six more. I want this written down before I die.'" },
    { depth: "core", about: "truth:souls", source: "library", bias: "official", reliable: false, who: "{official}, censor of the Academy", text: "Statement of the Academy of Circlework, signed by {official}, censor, {year}: 'The so-called red catalyst is a myth of the old guilds, a crude metaphor for the purity of a perfected working. No such object exists, and the law of balance has no exceptions. Any wright who claims to have seen one will have their licence reviewed. The Academy has reviewed 14 licences this year.'" },
    { depth: "core", about: "truth:nation_circle", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, crown surveyor, field note", text: "Field note of {investigator}, crown surveyor, on a map found in a sealed tower, {year}: 'The map is the founders' own, dated year 1. It shows the border forts of {realm}, 19 of them, joined by one ruled line. The line is a perfect circle, and the great battles of the old wars are marked on it before they were fought. The realm was drawn as one working, and the battles were its price.'" },
    { depth: "core", about: "truth:nation_circle", source: "archive", bias: "redacted", reliable: "partial", points: "site:node_tunnels", who: "The founders' charter, Inner Ministry copy", text: "From the founders' charter of {realm}, in a hand older than the realm, kept in the Inner Ministry: 'The bounds shall be drawn as instructed. The blood shall fall where the bounds bend. The first bend is under the city, at {lead}.' The next three clauses are blacked out. A ministry clerk has written in the margin: 'Do not lend this to the Academy.'" },
    { depth: "core", about: "truth:nation_circle", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "{survivor}, to a temple scribe", text: "Told by {survivor} to a temple scribe in {place}, {year}: 'I was nine when the soldiers came to our province. They said we had rebelled. Nobody had rebelled; we had been arguing about a mill tax. They killed 4,000 of us in a week and burned the bodies in rings by the road, measured out with chains. My mother and both my sisters are in the third ring.'" },
    { depth: "core", about: "truth:nation_circle", source: "heretic", bias: "exaggerated", reliable: "partial", points: "sub:homunculus_court", who: "Pamphlet on a temple door, {place}", text: "Pamphlet nailed to the door of the {faith} temple in {place}, {year}, printed on a stolen ministry press: 'THE CROWN IS A CIRCLE. YOU ARE THE CHALK. Ask why the maps never change. Ask why every war is fought at the same 19 forts. Ask why the ministers in {lead} have the same faces they had forty years ago.'" },
    { depth: "core", about: "truth:nation_circle", source: "library", bias: "official", reliable: false, who: "Royal History of the Border, approved by {official}", text: "From the Royal History of the Border, school edition, approved by {official}, {year}: 'The 19 border forts of {realm} were sited by the founders for the best command of the passes and rivers, as any student of the old campaigns can confirm. That they lie on a curve is a natural result of the shape of the hills. Students who draw lines between them are wasting good paper.'" },
    { depth: "core", about: "truth:stolen_flow", source: "traveller", bias: "exaggerated", reliable: "partial", points: "sub:eastern_flow", who: "An eastern flow-reader, scroll to the Academy", text: "Scroll from an eastern flow-reader, a healer who reads the earth-current, sent to the Academy in {year}: 'The current is a living thing, and it is in pain. Your western wrights hurt it every time they draw on it. We count its pulse at the needle-pillars: 60 a day in my teacher's time, 80 now. Send someone who can count to {lead}, and we will show them.'" },
    { depth: "core", about: "truth:stolen_flow", source: "ruin", bias: "true", reliable: true, plain: true, who: "A mine overseer, carved in an unmapped mine", text: "Carved deep in an unmapped mine, signed by the mine's overseer, {year}: 'We broke into a hollow at 900 feet and felt it breathe. The current does not rise from hot stone. It comes from an animal asleep under the world, bigger than this mountain, and every circle drinks from it. Its breathing is faster every year. When it wakes, no circle anywhere will work.'" },
    { depth: "core", about: "truth:stolen_flow", source: "library", bias: "official", reliable: false, who: "Academy Gazette, commission chaired by {official}", text: "Academy Gazette, report of the commission on flowless valleys, chaired by {official}, {year}: 'The 7 flowless valleys are explained by veins of inert stone that do not conduct the current. They are of geological interest only. The commission recommends that licensed wrights avoid them, as the nosebleeds are unpleasant, and that the shaft reported in one of them be filled in.'" },
    { depth: "core", about: "truth:stolen_flow", source: "temple", bias: "pious", reliable: "partial", who: "Temple register of {place}, the sacristan", text: "Temple register of {place}, {year}, in the sacristan's hand: 'Third year running the harvest rite has failed. All five wrights who drew the field circle fell sick by noon. In the morning the chalk lines were smudged inward, toward the centre, as if pulled. At the rite we sing the old line about the land lying on a sleeper, and the wise not waking their beds. I always took it to be about thrift.'" },
    { depth: "core", about: "truth:stolen_flow", source: "person", bias: "true", reliable: true, cost: true, points: "site:flowless_valley", who: "{person}, regimental wright, letter home", text: "Letter of {person}, regimental wright, to a sister in {place}, {year}: 'The regiment drew 30 field circles at the pass this summer. Afterwards the grass went yellow for two miles and the spring dried up. The farmers there lost their whole season and spit at us. I have had nosebleeds since. The surgeon is sending me to rest at {lead}, where no circle works. I think we are taking it from something alive.'" },
    { depth: "sub", about: "sub:chimera_regiments", source: "oral", bias: "true", reliable: true, points: "sub:chimera_regiments", who: "A miller's daughter of {place}, to a pension clerk", text: "Told by a miller's daughter of {place} to a pension clerk, {year}: 'My uncle came back from the war with a wolf's ears and a wolf's teeth. The regiment gave him a paper and two silver pieces. He asked for his old job at the mill, and they set the dogs on him. He killed both dogs. Now he lives in the hills of {lead} with 30 others like him.'" },
    { depth: "sub", about: "sub:chimera_regiments", source: "library", bias: "propaganda", reliable: false, who: "Ministry of War notice, {place}", text: "Ministry of War notice on the Beast Regiments, posted in {place}, {year}: 'The Beast Regiments were volunteers, honoured for their sacrifice in the late war. All 2,000 were humanely retired at the end of hostilities, each with a pension. Reports of armed beast-men in the hills are exaggerated. Citizens are asked not to feed them.'" },
    { depth: "sub", about: "sub:sacrificed_province", source: "person", bias: "true", reliable: "partial", points: "archive", who: "A deserter of the 6th Foot, diary", text: "Diary of a deserter of the 6th Foot, found sewn into a coat lining in {year}: 'We were told the province had rebelled. It had not. We were told to burn the bodies in rings, measured with a surveyor's chain, 40 paces across. I thought it was hatred. Now I think it was arithmetic. The orders were signed by a minister in {lead}, under a seal older than the king.'" },
    { depth: "sub", about: "sub:eastern_flow", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A western wright's journal, in the east", text: "Journal of a western wright visiting an eastern healing school, {year}: 'They heal with needles and stone pillars and no circles at all. I set a broken arm in front of them with a circle in three minutes, and they laughed. Then they turned worried, and asked how many wrights our crown licenses each year. I said 6,000. Their master went outside and did not come back for dinner.'" },
    { depth: "sub", about: "sub:circle_breakers", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, catechism for new circle-breakers", text: "Catechism of the circle-breakers, as taught by {believer} to new members, {year}: 'The circle unmakes what the gods have made. Every wright is a small apostate, and every great work a great one. Question: why may our priests use circles at the altar? Answer: because the 12 altar circles were drawn by the gods, and are not circlework. Question: who drew them? Answer: the gods.'" },
    { depth: "sub", about: "sub:homunculus_court", source: "archive", bias: "redacted", reliable: true, points: "archive", who: "{investigator}, copy of two ministry payrolls", text: "Two payrolls of the Inner Ministry of {realm}, forty years apart, copied by {investigator} in {year}: 'Minister of Wrath, Minister of Sloth, Minister of Pride...' The same seven names and the same seven signatures, in the same hand. Nobody else appears on both pages. The older payroll is kept in {lead}. The newer one was paid last month." },
    { depth: "sub", about: "sub:catalyst_hunt", source: "archive", bias: "official", reliable: "partial", who: "A relic-dealer's bill of sale, with a crown agent's note", text: "Bill of sale from a relic-dealer of {place} to a crown agent, {year}: 'One red stone, genuine, warm to the hand, works without balance: 300 crowns. Found in a cellar in a village on the east road, the village being empty of people and full of chalk. No returns.' The agent's note beneath: 'Cracked on first use. Seventh fake this year. All seven came from empty villages.'" },
    { depth: "sub", about: "sub:gold_crisis", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A factor in the southern ports, letter to {place}", text: "Letter from a factor in the southern ports to the merchants' guild at {place}, {year}: 'Gold is cheaper than copper here: nine gold crowns buy a copper pot. The old houses are ruined. The crown's agents say the gold was made from ore. The village that supplied the ore has not been heard from in five months, and soldiers have closed the road to it.'" },
    { depth: "site", about: "site:circle_city", source: "traveller", bias: "true", reliable: "partial", points: "site:circle_city", who: "A caravan guide, to {investigator}", text: "Account of a caravan guide, given to {investigator} at a desert well, {year}: 'Seen from the pass, the dead city at {lead} is a ring inside a ring inside a ring, seven of them. Every house has its door facing the middle. The well-keepers say all 41,000 people died the same night, and their bones lie like the spokes of a cart wheel.'" },
    { depth: "site", about: "site:failed_lab", source: "person", bias: "true", reliable: true, points: "site:failed_lab", who: "A neighbour's statement to the town watch", text: "Statement of a neighbour of the wright's house in {place} to the town watch, {year}: 'The two children buried their mother on the Tuesday. That night they carried chalk and three books down to the cellar. At midnight there was red light under the door and a scream. The Academy men came by morning and bricked it up. The house at {lead} has been empty since. Nobody asked us about the children.'" },
  ],
};
