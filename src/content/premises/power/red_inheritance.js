// The Red Inheritance: blood as power, a first hunger behind every noble line and holy cure, and the breath-schools that hunt it.
export default {
  id: "red_inheritance",
  name: "The Red Inheritance",
  family: "power",
  pitch: "Blood carries power, the older the blood the greater, and every noble line, healing church and monster of the night traces back to a single first hunger that is still alive, still hiding, and still afraid.",
  slots: ["divine-order", "bloodline", "monster-source", "power-access"],
  tone: ["grim", "horror"],
  era: ["medieval", "renaissance", "industrial"],
  scale: "regional",
  genres: ["fantasy", "grimdark", "flintlock", "shonen"],
  w: 1,
  excludes: [],
  pairs: [{ id: "blood_debt", w: 2.5 }, { id: "long_dark", w: 2 }, { id: "ward_walls", w: 1.5 }, { id: "unquiet_gate", w: 1.5 }],

  power: {
    name: "the red inheritance", user: "blood-heir", users: "blood-heirs",
    taught: "Power lives in the blood. The old noble lines carry the most, the church's holy blood heals, and the hunters' breath-forms flood their own blood with vigour to fight the night-hungry.",
    rules: ["The older the blood, the stronger the power.", "The turned die in sunlight and on sun-ore steel.", "Each of the turned gains one blood-art of its own.", "A hunter who masters the deepest breath-form wears a mark on the skin, and will not see twenty-five."],
    forbidden: "Turning a child, or drinking from the living for pleasure.",
  },

  cast: [
    { role: "investigator", n: "a hospital clerk of the healing church who keeps the ministration ledgers", home: "capital", stance: "Has started comparing the ministration book with the hunt-night tallies, and cannot stop." },
    { role: "official", n: "a deacon of the healing church who blesses the hunts", home: "capital", stance: "Believes the holy blood is a gift and the hunts a sad necessity, and does not go down the stair." },
    { role: "believer", n: "a master of the breath-forms who runs the mountain trial for the hunter corps", home: "mountain", stance: "Holds that the hunt is righteous and the first hunger pure appetite, and trains recruits to believe it." },
    { role: "survivor", n: "a young hunter who carries a turned sister in a basket on the back", home: "remote", stance: "Wants the sister cured and will not let anyone kill her, church, corps or Thorn." },
  ],

  truths: [
    { id: "church_hive", n: "The healing church is the hive", d: "The holy blood given to cure the sick is the first hunger's own blood, drawn from its veins under the cathedral and thinned. Anyone it heals may later turn into a beast; one hospital gave four thousand ministrations in a year, and its hunt killed three hundred and ten of the same patients. The church knows, and the great hunts are culls of its own patients. It keeps taking new ones.", tags: ["truth:church_hive"],
      known: [
        "Patients cured by the holy blood are changing: they sleep by day and their eyes darken. The church says the beasts of the hunt are those who took the blood unworthily.",
        "One hospital's accounts record four thousand ministrations and three hundred and ten hunt-night dead in a year, with the overlap inked out. A clerk's pencil note in the margin says: all 310.",
        "An abandoned church ward has bitten-through straps and a log of doubled doses. Deacons carry empty jars down a sealed stair under the cathedral every Thursday, the day before ministrations.",
        "Confirmed: the holy blood is the first hunger's own, drawn from its veins under the cathedral. Every cure can turn the patient, and the hunts are culls of the church's own patients. The church keeps taking new ones.",
      ] },
    { id: "noble_infection", n: "Nobility is infection", d: "The noble houses' old blood is the first hunger's line, and the first king was the first one turned; one house has had the same master for eight centuries. Killing the first hunger would kill every noble alive. The hunters are quietly paid by revolutionaries who know it, and who mean to be the ones left.", tags: ["truth:noble_infection"],
      known: [
        "The eldest lords of the old houses are never seen by day, their portraits never age, and they will not cross running water without a bridge. The heralds call it a courtesy of the evening court.",
        "A merchant who bought noble blood by transfusion dreams of a cellar under the old house, and of someone in it looking back. Someone is paying the hunter corps large sums to kill the first hunger.",
        "A noble crypt holds 31 portraits over 800 years with the same face in every one, and one coffin full of soil, recently slept in. A servant scratched on the oldest: he was the first king.",
        "Confirmed: the first king was the first turned, and every noble line is his bloodline. Killing the first hunger would kill every noble alive, and the people paying the hunters know it.",
      ] },
    { id: "afraid_progenitor", n: "The first hunger is afraid", d: "The first hunger wants only to stop burning in the sun. It has tried a thousand bloods, draining each owner, and crossed out every name. It is close to finding the one that will let it: a hunter's sister, turned last winter, who did not burn. One of its own Thorns has found her and has not yet told it where.", tags: ["truth:sun_blood"],
      known: [
        "The hunter corps' primer says the first hunger is pure appetite and conquest, with no other desire. Yet strangers who never come by day have paid hospital nurses a crown a vial for the blood of anyone who comes in sunburned.",
        "A hill-palace sealed with silver has every window facing east, forty scorched chairs set before them, and a thousand names under the salt, each marked 'burned'. Whoever sits in those chairs has watched the dawn from them, again and again.",
        "A hunter's sister, turned last winter, has been seen crossing a square at noon without burning. A Thorn's letter says she has been found, and that the Thorn has not yet told its maker where.",
        "Confirmed: the first hunger only wants to stand in the sun again. It has burned through a thousand bloods trying, and the one it needs runs in a hunter's sister. Its own children are deciding whether to tell it.",
      ] },
  ],

  tags: ["blood_power"],

  subthemes: [
    { id: "night_of_hunt", n: "The Night of the Hunt", d: "Once a season the city gates are locked and the hunters go out with saws and lanterns. The beasts they kill were citizens yesterday.", w: 1.3, req: { any: ["has:city", "urbane"] }, mods: [["pious", 1.5]], truthLink: "church_hive", tags: ["theme:night_of_hunt"] },
    { id: "turned_sister", n: "The Turned Sister", d: "A young hunter travels with his turned sister in a basket on his back. She refuses to feed, and he refuses to let anyone kill her.", w: 0.8, truthLink: "afraid_progenitor", tags: ["theme:turned_sister"] },
    { id: "thorns", n: "The Twelve Thorns", d: "The first hunger's strongest children are ranked and replaceable. One rules a pleasure quarter; one keeps a family of spiders; one weeps as he duels, because he was a hunter once.", w: 1, mods: [["autocracy", 1.5], ["near:ruins", 1.5]], tags: ["theme:thorns"] },
    { id: "ministration_plague", n: "The Ministration Plague", d: "Patients cured by the holy blood are changing. They sleep by day, their eyes have darkened, and they ask the nurses how they smell.", w: 1, req: { any: ["pious", "faith:one_god", "organised", "gov:theocracy"] }, truthLink: "church_hive", tags: ["theme:ministration_plague"] },
    { id: "bought_blood", n: "Bought Blood", d: "A merchant bought a noble's blood by transfusion to raise his house. Now he sees an old lord's cellar in his dreams, and the lord can see out through his eyes.", w: 0.8, req: { any: ["mercantile", "gov:merchant", "has:port"] }, truthLink: "noble_infection", tags: ["theme:bought_blood"] },
    { id: "mountain_trial", n: "The Mountain Trial", d: "To join the hunter corps, candidates spend seven days on a mountain among caged turned. The gates are opened on the first night.", w: 1, mods: [["mountain", 2], ["martial", 1.5]], tags: ["theme:mountain_trial"] },
    { id: "sea_blood", n: "The Drowned Village", d: "A fishing village worships a creature in the sea whose blood is older than the first hunger's, and works differently. Hunters sent there come back changed, and never hunt again.", w: 0.7, req: { any: ["coastal", "island"] }, tags: ["theme:sea_blood"], mark: { kind: "zone", n: "The drowned coast", color: "#2a3a4a", size: [1, 2], where: "coast" } },
    { id: "sun_smiths", n: "The Sun-Ore Smiths", d: "In a hidden mountain village, smiths forge blades of colour-shifting steel. Flowering hedges ring every house, and the turned cannot pass them.", w: 0.9, mods: [["mountain_folk", 2], ["artisans", 2]], tags: ["theme:sun_smiths"], mark: { kind: "zone", n: "Hedge villages", color: "#a07ab0", size: [1, 2], where: "mountain" } },
    { id: "blood_court", n: "The Court of Old Blood", d: "The noble houses rank themselves by how near their blood is to the first. The eldest lords never appear by day, and their portraits never age.", w: 1.1, req: { any: ["monarchy", "hierarchical", "dynastic"] }, truthLink: "noble_infection", tags: ["theme:blood_court"] },
    { id: "hunters_dream", n: "The Hunters' Workshop", d: "Between hunts, the exhausted dream of the same workshop: a quiet room with a doll that speaks and the ghosts of hunters who never woke.", w: 0.5, tags: ["theme:hunters_dream"] },
    { id: "sun_blood_search", n: "The Search for Sun-Blood", d: "The turned are hunting for someone whose blood resists the sun. Nurses in every hospital have been bribed for samples.", w: 0.9, mods: [["has:city", 1.5]], truthLink: "afraid_progenitor", tags: ["theme:sun_blood_search"] },
  ],

  sites: [
    { id: "under_cathedral", n: "The Under-Cathedral of $", kind: "ruin", where: "capital", truthLink: "church_hive", d: "A labyrinth of tombs beneath the cathedral's high altar.",
      layers: {
        surface: { n: "The sealed stair", text: "A sealed stair behind the high altar of the cathedral in {place}. The verger says it leads to the bishops' tombs and that its key was lost in {year}. Deacons go down it every Thursday, the day before ministrations, carrying empty glass jars." },
        study: { n: "The kneeling fathers", text: "The labyrinth's walls are lined with 300 tombs, and the carvings show the church fathers kneeling to a tall, thin figure with long hands. The figure holds a cup. In the oldest carving it holds the cup to its own wrist." },
        dig: { n: "Channels to the font", text: "In the deepest tomb lies a body not quite human, its veins opened into stone channels that run up towards the font. The channels are wet. The deacons' jar-ledger, recording what they collect each Thursday, is kept in {lead}.", points: "archive" },
        revelation: { n: "Built on its veins", text: "The holy blood comes from below. The church fathers built the cathedral on the first hunger's veins, and every cure plants a little of the first hunger in the patient. Their successors still keep the bargain. Thursday's jars cure the city, and each season's hunt clears away the result." },
      } },
    { id: "open_graves", n: "The Open Graves of $", kind: "anomaly", where: "any", d: "A village churchyard where every grave was opened from the inside.",
      layers: {
        surface: { n: "Open graves", text: "A churchyard at {place} where every grave stands open, 140 of them. The village beside it is empty, doors unlocked, tables laid. The parish register stops in the middle of a word in {year}." },
        study: { n: "Broken outwards", text: "The coffin lids were broken outwards, all in the same week. Every one of the dead had been given the holy blood at the church hospital in their last illness. The priest's name is missing from the list of burials." },
        dig: { n: "Footprints north", text: "Footprints in the hardened clay lead north, hundreds of them, walking in step, through a gap where the flowering hedge had been cut down. The priest's last letter, sent to the bishop at {lead}, asked for hunters.", points: "temple" },
        revelation: { n: "Called north", text: "The village's dead were all turned at once. They broke out in the same week and walked north together at night, because the first hunger called them. Someone cut the flowering hedge to let them out. The bishop never sent the hunters, and sealed the register instead." },
      } },
    { id: "portrait_crypt", n: "The Portrait Crypt of $", kind: "ruin", where: "inner", truthLink: "noble_infection", d: "A noble family's crypt hung with eight centuries of portraits.",
      layers: {
        surface: { n: "Eight centuries of lords", text: "A noble crypt near {place} hung with portraits of the house's lords, 31 of them, the oldest 800 years old. The house opens it to visitors on its founding day. The candles are lit only after sundown." },
        study: { n: "One face", text: "Eight hundred years of portraits, and the same face in every one, down to a small scar on the left cheek. The painters' bills survive for 20 of them. Every painter was paid extra to work by lamplight." },
        dig: { n: "The slept-in coffin", text: "The coffins are empty except one, which is full of soil and was very recently slept in. The house's own genealogy, kept at {lead}, gives each lord a different name and a dutiful son.", points: "archive" },
        revelation: { n: "One master", text: "The house has had one master for eight centuries. The first king was the first turned, and the nobility is his bloodline: every old house drinks from him, and will die with him. The revolutionaries paying the hunters know this. The house's young heirs do not." },
      } },
    { id: "salted_throne", n: "The Salted Throne-Room of $", kind: "ruin", where: "remote", truthLink: "afraid_progenitor", d: "A throne room sealed in silver and salt, every window facing east.",
      layers: {
        surface: { n: "Silver doors", text: "A hill-palace near {place} whose doors are barred with silver, the bars worn bright where hands have tested them from inside. Shepherds say lights move in it before dawn and go out at sunrise. Nobody has gone in since {year}." },
        study: { n: "Facing east", text: "Inside, salt lies knee-deep across the floor, and every window faces east. Before each window stands a chair, 40 chairs in all, and every chair is scorched black on the seat and arms." },
        dig: { n: "The letter on the throne", text: "On the throne lies a letter in an old hand: 'I have tried a thousand bloods. None will let me see the sunrise. Find me the one.' The list of those bloods lies under the salt. The last name on it leads to {lead}.", points: "cast:survivor" },
        revelation: { n: "Afraid of the sun", text: "The first hunger is not a conqueror. It has sat in this room before a thousand dawns and burned each time. It wants to stand in the sun again, and drained a thousand people trying. It will drain the world to manage it, and its children have just found the blood it needs." },
      } },
    { id: "restraint_ward", n: "The Restraint Ward of $", kind: "ruin", where: "any", d: "An abandoned hospital ward whose beds still have their straps.",
      layers: {
        surface: { n: "Iron beds", text: "An abandoned church hospital ward near {place} with 60 iron beds in two rows. The hospital closed in {year}, after a hunt-night. The church still owns the building and pays a man to keep the door locked." },
        study: { n: "Bitten straps", text: "Every bed has leather restraints at wrist and ankle, and the leather is bitten through. Deep scratches on the bed-frames come in sets of four. A chalice on the nurses' table is crusted dark." },
        dig: { n: "The nurses' log", text: "The nurses' log reads: 'Patients restless after the evening ministration. Doubled the dose. They are calmer now, and their eyes have changed colour.' The last entry asks for the hunt. The ward's admissions book was sent to {lead}.", points: "archive" },
        revelation: { n: "Fed until they turned", text: "The hospital was not curing anyone. On the deacons' orders it fed its patients holy blood twice a day until they turned, then called the hunt to clear the ward. Sixty beds were filled and emptied this way nine times. The church opened a new hospital the next spring." },
      } },
    { id: "lily_mine", n: "The Lily Mine of $", kind: "dig", where: "mountain", d: "A sun-ore mine whose ore smells of iron and lilies.",
      layers: {
        surface: { n: "The hedged mine", text: "A mine in the hills above {place}, ringed with flowering hedges three deep. The ore smells of iron and lilies. The smiths of the hedge village buy all of it, and the hunter corps buys everything they make." },
        study: { n: "Shifting ore", text: "The ore shifts colour in the hand, from grey to violet to gold. The turned will not come within a mile of it. A corps survey in {year} found the seams only near old burials, never in clean rock." },
        dig: { n: "The unrotted body", text: "Deep in the mine, a seam of ore has grown around a buried body that has never decayed. A ring on its hand names a family from a village culled on a hunt night. The corps' records of that cull are kept at {lead}.", points: "archive" },
        revelation: { n: "Blades from the unturned", text: "Sun-ore grows around the bodies of those whose blood refused the hunger: people given the holy blood who never turned, and were killed in the hunts anyway. The hunters' blades are made from the dead who would not turn. The corps knows, and the smiths say thank you before each pour." },
      } },
  ],

  beings: [
    { id: "blood_beast", n: "Blood-beast", kind: "beast", d: "A citizen gone to the beast: long-armed, furred in patches, still wearing the rags of a nightshirt. It remembers the way home.", danger: 3, biomes: ["tempforest", "grass", "boreal", "temprain"], look: { size: 2.2, group: [1, 3], move: "solo", speed: 14, col: "#3a2a2a", col2: "#a01a1a", body: "biped", active: "night", visible: true } },
    { id: "night_hungry", n: "Night-hungry", kind: "predator", d: "One of the turned: pale, quick and courteous, with a single blood-art of its own. It cannot cross a flowering hedge.", danger: 2, biomes: ["tempforest", "boreal", "grass", "swamp"], look: { size: 1.8, group: [1, 4], move: "pack", speed: 12, col: "#d0c8c0", col2: "#6a0a1a", body: "biped", active: "night", visible: false } },
    { id: "messenger_crow", n: "Messenger crow", kind: "bird", d: "A talking crow kept by the hunter corps. It carries orders, scolds its hunter, and mourns loudly when he dies.", danger: 0, biomes: ["tempforest", "grass", "boreal", "alpine"], look: { size: 0.5, group: [1, 2], move: "pair", speed: 50, col: "#1a1a1a", col2: "#4a4a5a", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "ri_blood_rites", n: "Blood rites", field: "arcana", level: 1, d: "Offerings of blood at the hearth and the field edge: the oldest power, and the first door the hunger came through." },
    { id: "ri_transfusion", n: "Transfusion", field: "medicine", level: 3, d: "The church's needles and glass: blood moved from one body to another, and, though nobody admits it, some of the donor's mind with it." },
    { id: "ri_breath_forms", n: "The breath-forms", field: "warfare", level: 3, d: "Breathing disciplines named for flame, current, thunder, gale, mist, stone and moon that flood a hunter's blood with strength." },
    { id: "ri_sun_ore", n: "Sun-ore smithing", field: "metallurgy", level: 4, d: "Colour-shifting steel from one mountain's ore, the only blade that ends the turned for good." },
    { id: "ri_folding_arms", n: "Folding weapons", field: "engineering", level: 4, d: "Blades that unfold into saws and canes that lengthen into whips, made in the hunters' workshops." },
    { id: "ri_blood_serum", n: "Blood serums", field: "medicine", level: 5, d: "Refined serums that might, at last, turn the turned back." },
  ],

  units: [
    { id: "ri_breath_hunters", n: "Breath-school hunters", role: "infantry", wpn: "sword", kit: "light", ranks: 2, gap: 2, size: 30, w: 0.5, mods: [["theme:mountain_trial", 6], ["martial", 1.5]] },
    { id: "ri_church_hunters", n: "Church hunters", role: "infantry", wpn: "axe", kit: "mail", ranks: 3, gap: 1.5, size: 60, w: 0.5, mods: [["theme:night_of_hunt", 6], ["gov:theocracy", 3]] },
  ],

  govs: [
    { id: "ri_blood_peerage", n: "Peerage of Old Blood", d: "The great houses rule by the age of their blood. The eldest lords are never seen by day, and the court meets after dark.", tags: ["gov:ri_blood_peerage", "monarchy", "autocracy"], w: 0.4, forms: ["Night Court of $", "Peerage of $", "Elder Houses of $"], ruler: "Eldest", mods: [["hierarchical", 2.5], ["dynastic", 2]] },
  ],

  faiths: [
    { id: "ri_healing", n: "The Healing Church", d: "A faith of hospitals and holy blood, whose sacrament is three red drops on the tongue.", tags: ["faith:ri_healing", "organised"], w: 1, names: ["The Healing Church of $", "The Church of the Holy Blood", "The Red Communion"], mods: [["pious", 1.5], ["urbane", 1.5], ["hierarchical", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Quarantine districts", color: "#5a2a2a", size: [1, 2], count: [0, 2], where: "any", d: "Walled districts behind quarantine gates, where the night of the hunt comes early." },
  ],

  storylines: [
    { id: "ri_hunt_night", n: "The Night of the Hunt in {place}", scale: "local", anchor: "town", w: 1.5, req: "blood_power",
      stages: {
        start: { h: "The bells of {place} ring for the hunt", b: "The healing church has declared a night of the hunt in {place}. Everyone who took the holy blood this year has been asked to stay indoors; the hunters are oiling their saws.", wait: [1, 3], next: [{ to: "hunt", w: 2 }, { to: "refused", w: 1, mods: [["egalitarian", 2], ["unstable", 1.5]] }] },
        hunt: { h: "Beasts in the streets of {place}", b: "By midnight half the patients of the church hospital had climbed out of their windows. The hunters worked until dawn; {person} counted forty kills, and recognised eleven of them.", wait: [2, 5], fx: { pop: 0.94, unrest: 8 }, next: [{ to: "cover_up", w: 2 }, { to: "exposed", w: 1, mods: [["learned", 2], ["theme:ministration_plague", 3]] }] },
        refused: { h: "{place} refuses the hunt", b: "The townsfolk of {place} barred the gates against the hunters and hid their sick in cellars.", wait: [2, 5], fx: { unrest: 5 }, next: [{ to: "beasts_loose", w: 1 }, { to: "cover_up", w: 1 }] },
        cover_up: { h: "The church of {place} gives thanks", b: "The priests thanked the hunters and blessed the dead. The hospital is taking new patients.", fx: { stability: 2 }, end: true },
        exposed: { h: "{person} reads the hospital ledgers", b: "Every beast killed in {place} had taken the holy blood within the year. {person} has nailed the ledger to the cathedral door.", fx: { stability: -12, unrest: 18, flag: "exposed" }, end: true },
        beasts_loose: { h: "The beasts of {place} run free", b: "With no hunt to stop them, the changed ones of {place} have gone into the woods. Livestock is vanishing, and then children.", fx: { pop: 0.9, unrest: 12 }, end: true },
      } },
    { id: "ri_noon_girl", n: "The Girl Who Walks at Noon", scale: "local", anchor: "town", w: 1.2, req: "blood_power",
      stages: {
        start: { h: "A turned girl walks in daylight at {place}", b: "{person}, a hunter's sister turned last winter, was seen crossing the square of {place} at noon. {person} did not burn.", wait: [1, 4], next: [{ to: "thorns_come", w: 2 }, { to: "church_claims", w: 1, mods: [["pious", 2], ["gov:theocracy", 2]] }] },
        thorns_come: { h: "Strangers take the inn at {place}", b: "Guests in old-fashioned clothes have taken every room at the inn. They pay in very old coin and never come down before dusk.", wait: [1, 3], next: [{ to: "taken", w: 1 }, { to: "defended", w: 1, mods: [["martial", 1.5], ["theme:mountain_trial", 3]] }] },
        church_claims: { h: "The healing church claims {person}", b: "The church has taken {person} into its hospital to study the miracle. The hunter {person2}, {person}'s sibling, has been turned away at the door.", wait: [2, 6], next: [{ to: "taken", w: 1 }, { to: "cure", w: 1, mods: [["learned", 2]] }] },
        taken: { h: "{person} is taken into the night", b: "{person} is gone. Weeks later, on a hilltop far away, the first hunger stood and watched the sunrise for the first time in a thousand years, and wept.", fx: { unrest: 12, stability: -6, flag: "sun_walker" }, end: true },
        defended: { h: "{person2} drives the strangers from {place}", b: "{person2} and two hunters of the corps fought the strangers through the night. At dawn there was ash on the inn stairs, and {person} was safe.", fx: { prestige: 5, stability: 3 }, end: true },
        cure: { h: "A cure is made from {person}'s blood", b: "Physicians have drawn a serum from {person}'s blood that turns the turned back to the living. The first patients woke up crying.", fx: { discovery: "medicine", stability: 5 }, end: true },
      } },
    { id: "ri_eldest", n: "The Eldest of {realm}", scale: "realm", anchor: "realm", w: 1, req: ["blood_power", { any: ["monarchy", "hierarchical", "dynastic"] }],
      stages: {
        start: { h: "Pamphlets in {capital} call the nobles infected", b: "Pamphlets claim the old houses of {realm} are not noble but infected. Someone is paying the hunter corps very well, and nobody will say who.", wait: [3, 8], next: [{ to: "hunt_eldest", w: 2 }, { to: "purge", w: 1, mods: [["harsh_law", 2], ["ruler:paranoid", 2]] }] },
        purge: { h: "{ruler} purges the pamphleteers", b: "The printing presses of {capital} have been smashed and the hunters' lodges raided by night.", wait: [2, 6], fx: { stability: -4, unrest: 10 }, next: [{ to: "uprising", w: 1, mods: [["unstable", 2]] }, { to: "silenced", w: 1 }] },
        hunt_eldest: { h: "The hunters go down beneath {capital}", b: "{person}, a master of the breath-forms, has led the hunters into the old crypts beneath {capital}.", wait: [3, 8], next: [{ to: "eldest_slain", w: 1 }, { to: "hunters_fall", w: 1 }] },
        eldest_slain: { h: "The Eldest dies, and the nobles with it", b: "{person} drove sun-ore through the first hunger's heart. Across {realm}, the great houses woke to find their lords dead in their beds.", fx: { revolution: true, stability: -20 }, end: true },
        hunters_fall: { h: "The hunters do not return from beneath {capital}", b: "None of the hunters came back up from the crypts. The old houses held a ball that week.", fx: { unrest: 8, prestige: -3 }, end: true },
        uprising: { h: "{realm} rises against its blood-lords", b: "The raids were one too many. The streets of {capital} are barricaded, and the hedges of flowers have been planted around the barricades.", fx: { revolt: true, unrest: 15 }, end: true },
        silenced: { h: "{realm} falls silent", b: "The pamphlets have stopped. The hunters keep to the villages, and the court of {realm} still meets only after dark.", fx: { stability: 2 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", points: "library", who: "{believer}, breath-school manual", text: "From the breath-school manual issued to recruits by {believer}, master of the mountain school, {year}: 'Breathe so the blood burns. Breathe so the heart drums. Breathe until the night is afraid of you. Form one: flame. Form seven: moon. Do not attempt form eight.' Page 40, about the mark that comes with mastery, is torn out of every copy. The intact original is said to be in {lead}." },
    { depth: "lore", about: "power", source: "oral", bias: "garbled", reliable: true, who: "A hedge-woman, overheard by {investigator}", text: "Said by a hedge-woman of the hill villages near {place} to a child planting cuttings, overheard by {investigator} in {year}: 'Plant the hedge, child, and keep it flowering. The pale ones cannot abide the blossom, and nobody knows why.' Every house in that village has a hedge at least 3 feet deep. No house with a flowering hedge has lost anyone in 40 years." },
    { depth: "lore", about: "power", source: "person", bias: "true", reliable: true, who: "A noble child's diary", text: "Diary of a noble child of fourteen, of an old house near {place}, {year}, page 12: 'Today I was given my first cup at table. The blood of the stable boy was coarse but honest. Mother says I shall acquire a taste for the finer vintages with age.' Below, in the same hand: 'The stable boy was given a silver crown and the rest of the day off, and sat down in the yard.'" },
    { depth: "core", about: "truth:church_hive", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:under_cathedral", who: "{investigator}, beneath the cathedral", text: "Notes of {investigator}, hospital clerk, after going down the sealed stair beneath the cathedral of {lead} in {year}: 'Carved above the deepest tomb: From this cup the faithful drink, and through this cup the First drinks the faithful. Below it, channels in the stone run from a body up to the font. I will write it plainly. The holy blood is drawn from the first hunger, and every patient we cure carries it.'" },
    { depth: "core", about: "truth:church_hive", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, a patient in the asylum ward", text: "Notes of {person}, a patient in the asylum ward of {place}, {year}, cured of a fever by the holy blood two years before: 'The blood in the chalice is warm and it knows my name. I can hear the others who drank it. We are all in one room, and the room is hungry. They have strapped me to the bed for 30 nights. I bit through the first strap. Please tell my children I was cured.'" },
    { depth: "core", about: "truth:church_hive", source: "archive", bias: "redacted", reliable: "partial", points: "site:restraint_ward", who: "{investigator}, hospital accounts", text: "Hospital accounts for {year}, kept by {investigator}, clerk of the healing church at {place}: 'Ministrations given: four thousand. Hunt-night casualties: three hundred and ten. Overlap...' The rest is inked out. In the margin, in pencil: 'All 310. Every one. Check the old ward at {lead}, where the straps are.'" },
    { depth: "core", about: "truth:church_hive", source: "heretic", bias: "exaggerated", reliable: "partial", who: "A placard outside the cathedral", text: "Placard carried by a crowd of about 60 outside the cathedral of {place} on hunt-night eve, {year}: 'THEY HEAL YOU SO THEY CAN HARVEST YOU. EVERY HUNT IS A HARVEST FESTIVAL. STOP TAKING THE DROPS.' The bearer, a widow whose son was cured in spring and killed on the autumn hunt, was arrested and released the next day without charge." },
    { depth: "core", about: "truth:church_hive", source: "temple", bias: "official", reliable: false, who: "{official}, deacon, before the hunt", text: "Homily of {official}, deacon of the healing church, before the hunt at {place}, {year}: 'The holy blood is the gift of {deity}, pure and cleansing. Three drops on the tongue, and the fever leaves. The beasts of the hunt are those who took it unworthily, and their sin is their own. Pray for the hunters, and come to the hospital for your ministration on Thursday as usual.'" },
    { depth: "core", about: "truth:noble_infection", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:portrait_crypt", who: "A servant's scratch on a portrait", text: "Scratched into the varnish of the oldest portrait in the crypt of {lead}, by a servant whose name is lost, found by {investigator} in {year}: 'He was the first king and the first one turned, and every lord of every house drinks his blood. He is still the first king.' The portrait is 800 years old. The face is the face in all 31 portraits on that wall, down to a small scar on the cheek." },
    { depth: "core", about: "truth:noble_infection", source: "archive", bias: "redacted", reliable: "partial", points: "heretic", who: "An unsigned letter to the hunter corps", text: "Letter to the hunter corps, delivered with a chest of 2,000 crowns in {year}, unsigned: 'Enclosed, the sum agreed. Kill the first one and every noble line dies with it. Do not ask who we are; we are the ones who will be left. Further sums can be collected at {lead}.' The corps' quartermaster filed it under 'donations, anonymous'." },
    { depth: "core", about: "truth:noble_infection", source: "oral", bias: "garbled", reliable: "partial", who: "A ferryman, to a traveller", text: "Said by a ferryman on the river below {place} to a traveller, {year}: 'Twenty-two years on this ferry and I have never carried a lord of the old houses. A true lord cannot cross running water without a bridge. That is why the old houses build their own bridges, all 9 of them on this river, and why they charge us a penny to use them.'" },
    { depth: "core", about: "truth:noble_infection", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, a merchant, to an only son", text: "Letter of {person}, a merchant of {place}, to an only son, {year}: 'Since the transfusion I dream of a cellar beneath the old house on the hill. Last night someone in the cellar turned and looked straight at me, and this morning I could not bear the window. I paid 500 crowns for a noble's blood to raise our house. I think I have sold the house instead. Do not come home.'" },
    { depth: "core", about: "truth:noble_infection", source: "library", bias: "official", reliable: false, who: "Herald's book of the great houses", text: "From 'The Great Houses of {realm}', a herald's book printed in {year}, preface: 'The old blood of the great houses is the blood of heroes, refined by centuries of noble marriage. Its long life and vigour are the reward of virtue. That the eldest lords prefer the evening is a mark of their dedication to study, and no cause for comment.'" },
    { depth: "core", about: "truth:afraid_progenitor", source: "person", bias: "true", reliable: true, plain: true, who: "A Thorn, to its maker", text: "Letter from a Thorn, one of the first hunger's twelve strongest children, to its maker, {year}: 'Father, you have tried a thousand bloods so that you might stand in the sun again, and burned each time. I have found the one. A hunter's sister, turned last winter, who stood in the square at {place} at noon and did not burn. Forgive me, but I have not yet told you where.'" },
    { depth: "core", about: "truth:afraid_progenitor", source: "ruin", bias: "true", reliable: "partial", points: "site:salted_throne", who: "{survivor}, under the salt", text: "Found by {survivor} under the salt in the throne room of {lead}, {year}: a list of a thousand names on 40 sheets, in one old hand. Each is crossed out, and beside each is written 'burned'. Beside the most recent name, not yet crossed out, is written 'perhaps'. The hunter has burned the sheet with that name on it." },
    { depth: "core", about: "truth:afraid_progenitor", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A sailor in a harbour tavern", text: "Told by a sailor in a harbour tavern at {place}, {year}, who swore to it: 'The first hunger once walked into the sea at dawn just to feel the light. Burned to the bone in a minute, grew back by dusk, and screamed for a year. You could hear it from the lighthouse, 3 miles off. The keeper wrote it in his log. It never tried the sea again.'" },
    { depth: "core", about: "truth:afraid_progenitor", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "A hospital orderly, to {investigator}", text: "Told by an orderly of the hospital at {place} to {investigator}, {year}: 'The nurses were paid a crown a vial for the blood of anyone who came in sunburned. The strangers who paid never came by day. One nurse, {person}, sold them a vial of the nurse's own blood after a long day in the hayfield. They came back for the rest. We found {person} in the linen room, white as the sheets.'" },
    { depth: "core", about: "truth:afraid_progenitor", source: "library", bias: "official", reliable: false, who: "Hunter corps primer, issued by {believer}", text: "From the hunter corps' primer, {year} edition, chapter 1, issued to every recruit by {believer}: 'The first hunger is a creature of pure appetite and conquest, and it fears nothing but the righteous hunter. It has no other desire. Do not listen to the turned who say otherwise. They lie as easily as they breathe, which is to say not at all.'" },
    { depth: "sub", about: "sub:night_of_hunt", source: "oral", bias: "true", reliable: "partial", who: "A hunt-night rule, noted by {investigator}", text: "A hunt-night rule taught to the children of {place}, written down by {investigator} in {year}: 'On hunt night you lock the door and you do not open it for anyone, not even if it's your mother. Especially not if it's your mother.' That year the hunters killed 40 in {place}. Eleven were found at their own front doors." },
    { depth: "sub", about: "sub:mountain_trial", source: "person", bias: "true", reliable: true, points: "cast:believer", who: "A recruit's letter home", text: "Letter of a recruit home from the mountain trial, {year}: 'Seven days. Forty of us went up. Nine came down. They opened the cages on the first night, as they said they would. I have the uniform now, and a sun-ore blade. I don't sleep. Please send the blue scarf. The master's school is at {lead}; do not let my brother come.'" },
    { depth: "sub", about: "sub:sea_blood", source: "traveller", bias: "garbled", reliable: "partial", who: "A hunter at the drowned village", text: "Journal of a hunter sent to the drowned village near {place}, {year}, last entry: 'The fisherfolk have webbed fingers and very kind eyes. They asked me twice whether I could swim. Their priest showed me the old blood in a shell, darker than ours and cold. I have put away my blade. I think I will stay a while.' The hunter never reported back to the corps." },
    { depth: "sub", about: "sub:blood_court", source: "library", bias: "propaganda", reliable: false, who: "Court calendar, notes for envoys", text: "From the court calendar of {realm}, {year}, notes for foreign envoys: 'The custom of the evening court is an ancient courtesy of the great houses, who spend their days in study and their nights in service to the realm. Audiences begin at the ninth hour after noon. Envoys are asked not to bring garlic, mirrors or flowering plants into the hall.'" },
    { depth: "sub", about: "sub:turned_sister", source: "oral", bias: "exaggerated", reliable: "partial", points: "cast:survivor", who: "A carter at a roadside inn", text: "Told at a roadside inn near {place} by a carter, {year}: 'There's a young hunter on the roads with a basket on the back. Hunters say the basket breathes. I gave the hunter a lift for 20 miles once. Never a word, and the basket was cold as a cellar. Last I heard, the pair of them were heading home to {lead}.'" },
    { depth: "sub", about: "sub:thorns", source: "archive", bias: "official", reliable: "partial", points: "archive", who: "Hunter corps tally", text: "Hunter corps tally for {year}, signed by the quartermaster: 'Thorns slain this century: nine. Thorns in the field: twelve. Note: the count does not go down. Each slain Thorn is replaced within the year, three of the last nine by turned who were once our own hunters.' The corps' full file on the Thorns is held in {lead}." },
    { depth: "site", about: "site:lily_mine", source: "oral", bias: "true", reliable: "partial", who: "The mine captain, to new hands", text: "Rules of the lily mine above {place}, read aloud by the mine captain to new hands, {year}: 'The best ore lies close to old graves. In 50 years we have opened 28. Every body was whole, and none had turned. Nine tons in ten of what we sell came from around them. You will say thank you before the pick goes in. New hands who laugh at this are fined a shilling. New hands who laugh twice are sent down the hill.'" },
    { depth: "site", about: "site:open_graves", source: "traveller", bias: "true", reliable: "partial", points: "temple", who: "A tinker's letter", text: "Letter of a tinker who passed through the village of {place} in {year}: 'Every grave in the churchyard is open and the village is empty. Supper was laid in every house, and the bread had burned black in the ovens. On the church door hangs a hospital notice thanking the parish for 212 ministrations this year. The graves are 140, the lids broken outwards. I am writing to ask the bishop at {lead} whether anyone has followed the footprints north.'" },
  ],
};
