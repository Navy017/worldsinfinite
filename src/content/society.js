// Content for peoples and politics: culture traits, faiths, governments, origins, ideals, the rules
// that make neighbours like or hate each other, and reasons for war.
// Everything here is data for the rule engine in core/rules.js. See that file for the format.
//
// Tags a situation can carry (set by the generator):
//   land:    coastal island steppe desert forest jungle mountain river cold hot marsh
//   nearby:  near:titan near:beasts near:rift near:ley near:ruins near:mystery near:volcano
//            near:node near:breach (the same places as ley/rift, under any premise)
//   world:   magic:high magic:low wild:high, premise:<id> slot:<slot> tone:<tone> genre:<genre>,
//            default:power / default:cosmos (no premise replaces the ley lines / the rifts)
//   realm:   realm:tiny realm:small realm:large realm:vast has:port has:city frontier
//   and the ids of the realm's culture traits, faith type, faith doctrines, origin, government and ideals.

/* ---------------- culture traits ---------------- */
// the first few are heritage (how the land shaped a people), the rest are values
export const CULTURE_TRAITS = [
  { id: "seafaring", n: "Seafaring", d: "Born on the water; their best sons and daughters go to sea.", tags: ["seafaring"], w: 3, req: "coastal", mods: [["island", 2]] },
  { id: "horse_lords", n: "Horse lords", d: "They ride before they walk. Wealth is counted in horses.", tags: ["horse_lords"], w: 3, req: "steppe", excl: ["seafaring"] },
  { id: "mountain_folk", n: "Mountain folk", d: "Stubborn, patient people of high valleys and hill forts.", tags: ["mountain_folk"], w: 3, req: "mountain" },
  { id: "forest_folk", n: "Forest folk", d: "They know every path under the trees and distrust open ground.", tags: ["forest_folk"], w: 1.5, req: { any: ["forest", "jungle"] } },
  { id: "desert_wanderers", n: "Desert wanderers", d: "Masters of wells, stars and long silences.", tags: ["desert_wanderers"], w: 3, req: "desert" },
  { id: "river_folk", n: "River folk", d: "Their lives follow the floods: farming, fishing and barges.", tags: ["river_folk"], w: 2, req: "river" },
  { id: "nomadic", n: "Nomadic", d: "Few towns; the clans move with the seasons and the herds.", tags: ["nomadic"], w: 1.2, req: { any: ["steppe", "desert", "cold"] }, excl: ["urbane"], mods: [["horse_lords", 3]] },
  { id: "urbane", n: "Urbane", d: "City people: crowded, clever, fond of markets and gossip.", tags: ["urbane"], w: 1, excl: ["nomadic"], mods: [["river", 1.5], ["coastal", 1.3], ["has:city", 2]] },
  { id: "martial", n: "Martial", d: "Every adult has held a weapon; honour is won in battle.", tags: ["martial"], w: 1.4, mods: [["horse_lords", 1.5], ["mountain_folk", 1.4], ["frontier", 1.5]] },
  { id: "mercantile", n: "Mercantile", d: "A bargain is sacred. Their coin is trusted far from home.", tags: ["mercantile"], w: 1.1, mods: [["coastal", 1.8], ["river", 1.4], ["seafaring", 1.5]] },
  { id: "scholarly", n: "Scholarly", d: "Libraries, star charts and endless argument.", tags: ["scholarly"], w: 0.9, excl: ["nomadic"], mods: [["urbane", 2]] },
  { id: "pious", n: "Pious", d: "The gods are close and watching; temples outshine palaces.", tags: ["pious"], w: 1.3 },
  { id: "artisans", n: "Master artisans", d: "Famed for their crafts; guilds guard their secrets.", tags: ["artisans"], w: 1, mods: [["mountain_folk", 1.5], ["urbane", 1.5]] },
  { id: "insular", n: "Insular", d: "Outsiders are tolerated, never trusted.", tags: ["insular"], w: 1, excl: ["hospitable"], mods: [["island", 2], ["mountain_folk", 1.5]] },
  { id: "hospitable", n: "Hospitable", d: "A guest is sacred; feuds pause at the door.", tags: ["hospitable"], w: 1, excl: ["insular"], mods: [["desert_wanderers", 2], ["nomadic", 1.5]] },
  { id: "hierarchical", n: "Hierarchical", d: "Everyone knows their place and their better.", tags: ["hierarchical"], w: 1.1, excl: ["egalitarian"] },
  { id: "egalitarian", n: "Egalitarian", d: "Chiefs are chosen and can be unchosen.", tags: ["egalitarian"], w: 0.8, excl: ["hierarchical"], mods: [["nomadic", 1.5], ["forest_folk", 1.3]] },
  { id: "ancestor_bound", n: "Ancestor-bound", d: "The dead are consulted before anything important.", tags: ["ancestor_bound"], w: 0.9, mods: [["near:ruins", 2]] },
  { id: "beast_tamers", n: "Beast tamers", d: "They ride and fight beside the monsters others flee.", tags: ["beast_tamers"], w: 0.5, req: "near:beasts", mods: [["wild:high", 2], ["here:beasts", 2]] },
  { id: "titan_touched", n: "Titan-touched", d: "They live in a titan's shadow and have made it part of who they are.", tags: ["titan_touched"], w: 4, req: "near:titan" },
  { id: "arcane", n: "Arcane-gifted", d: "Workers of wonders are common here; every village has one.", tags: ["arcane"], w: 1.2, req: { any: ["magic:high", "near:node", "near:breach"] }, mods: [["near:node", 3]] },
  { id: "seers", n: "Seers", d: "Omens, dreams and oracles steer their decisions.", tags: ["seers"], w: 1, req: { any: ["near:mystery", "magic:high"] } },
];
export const HERITAGE = new Set(["seafaring", "horse_lords", "mountain_folk", "forest_folk", "desert_wanderers", "river_folk"]);

/* ---------------- faiths ---------------- */
export const FAITH_TYPES = [
  { id: "pantheon", n: "Pantheon", d: "Many gods, each with a temple, a feast and a temper.", tags: ["faith:pantheon"], w: 3,
    names: ["The $ Pantheon", "The Old Gods of $", "The Many Thrones"] },
  { id: "one_god", n: "One god", d: "A single god, a single truth, a church to keep it.", tags: ["faith:one_god", "organised"], w: 2, mods: [["hierarchical", 1.5]],
    names: ["The Church of $", "The Faith of $", "The Radiant Word"] },
  { id: "dualism", n: "Dualism", d: "Light and dark at war in every soul.", tags: ["faith:dualism"], w: 1, names: ["The Twin Flames", "The Faith of $ and $", "The Two Paths"] },
  { id: "ancestors", n: "Ancestor worship", d: "The honoured dead guard the living.", tags: ["faith:ancestors"], w: 1, mods: [["ancestor_bound", 4], ["near:ruins", 1.5]],
    names: ["The Way of the Ancestors", "The Hall of $", "The Remembered"] },
  { id: "spirits", n: "Spirit ways", d: "Every river, stone and beast has a spirit to be bargained with.", tags: ["faith:spirits"], w: 1.2, mods: [["forest_folk", 2.5], ["nomadic", 2.5], ["jungle", 2]],
    names: ["The Green Way", "The $ Spirit-Ways", "The Old Pacts"] },
  { id: "sun", n: "Sun cult", d: "The sun is king of the gods and the king is the sun's son.", tags: ["faith:sun", "organised"], w: 0.9, mods: [["desert", 2.5], ["hot", 2]],
    names: ["The Sun of $", "The Cult of the Dawn", "The Golden Eye"] },
  { id: "sea", n: "Sea gods", d: "The drowned mother gives fish and takes sailors.", tags: ["faith:sea"], w: 0.5, mods: [["seafaring", 5], ["island", 2]],
    names: ["The Tide-Faith of $", "The Deep Mother", "The Salt Covenant"] },
  { id: "titan", n: "Titan cult", d: "The titan is a living god. Its footsteps are scripture.", tags: ["faith:titan"], w: 2, req: "near:titan", mods: [["titan_touched", 5]],
    names: ["The Cult of $", "Children of $", "The Footstep Faith"] },
  { id: "void", n: "Rift cult", d: "Whatever comes through the rift is worshipped, fed and feared.", tags: ["faith:void", "sinister"], w: 1.2, req: "near:rift", mods: [["arcane", 2], ["seers", 2]],
    names: ["The Open Eye", "Children of the Rift", "The Hollow Choir"] },
  { id: "ley", n: "Ley mysticism", d: "The world's lines of power are the true divine; priests are mages.", tags: ["faith:ley"], w: 1.2, req: [{ any: ["near:ley", "magic:high"] }, "default:power"], mods: [["arcane", 3]],
    names: ["The Ley Wardens", "The Lattice of $", "The Weave"] },
  { id: "philosophy", n: "Philosophy", d: "No gods, only reason, virtue and a great many books.", tags: ["faith:philosophy"], w: 0.4, mods: [["scholarly", 5], ["urbane", 1.5]],
    names: ["The $ School", "The Way of Reason", "The Quiet Teaching"] },
  { id: "stars", n: "Star reading", d: "Fate is written in the sky; astrologers outrank priests.", tags: ["faith:stars"], w: 0.6, mods: [["seers", 4], ["desert", 1.5], ["desert_wanderers", 2]],
    names: ["The Star-Readers of $", "The Celestial Court", "The Written Sky"] },
];
export const DOCTRINES = [
  { id: "zealous", n: "Zealous", d: "Unbelievers must be converted or driven out.", tags: ["zealous"], excl: ["tolerant"], w: 1, mods: [["organised", 1.8], ["faith:void", 1.5]] },
  { id: "tolerant", n: "Tolerant", d: "Other faiths are welcome to their errors.", tags: ["tolerant"], excl: ["zealous"], w: 1.2, mods: [["faith:pantheon", 1.5], ["faith:philosophy", 3]] },
  { id: "militant", n: "Militant orders", d: "Warrior monks guard the faith with steel.", tags: ["militant"], excl: ["pacifist"], w: 0.8, mods: [["zealous", 2]] },
  { id: "pacifist", n: "Pacifist", d: "Bloodshed stains the soul; priests may not bear arms.", tags: ["pacifist"], excl: ["militant"], w: 0.5, mods: [["tolerant", 1.5]] },
  { id: "pilgrims", n: "Pilgrimages", d: "Every believer should walk to the holy site once.", tags: ["pilgrims"], w: 1 },
  { id: "ascetic", n: "Ascetic", d: "Wealth is suspect; the holy live in poverty.", tags: ["ascetic"], excl: ["lavish"], w: 0.8 },
  { id: "lavish", n: "Lavish temples", d: "Gold, incense and processions; the gods like a show.", tags: ["lavish"], excl: ["ascetic"], w: 0.9, mods: [["faith:sun", 2]] },
  { id: "sacrifice", n: "Blood offerings", d: "The gods are fed. Usually with animals.", tags: ["sacrifice"], w: 0.35, mods: [["faith:void", 5], ["faith:titan", 3]] },
  { id: "mystic", n: "Mystics", d: "Visions and trances matter more than scripture.", tags: ["mystic"], w: 0.8, mods: [["seers", 2], ["faith:ley", 2]] },
];
export const FESTIVALS = ["Feast of $", "Night of Lanterns", "Rite of $", "The Long Fast", "Day of the Drowned", "Festival of First Fruits", "Vigil of $",
  "Procession of $", "The Burning of the Old Year", "Day of Masks", "Blessing of the Boats", "The Quiet Night", "Harvest Offering", "Feast of the Returned"];

/* ---------------- governments ---------------- */
// forms: realm name patterns ($ = the realm's root name); ruler: title pairs
export const GOVERNMENTS = [
  { id: "feudal", n: "Feudal monarchy", d: "A crown held up by lords who each hold their own land.", tags: ["gov:feudal", "monarchy"], w: 4,
    forms: ["Kingdom of $", "Duchy of $", "Grand Duchy of $", "Realm of $"], ruler: "King", mods: [["hierarchical", 1.5], ["realm:tiny", 0.3]] },
  { id: "absolute", n: "Absolute monarchy", d: "The ruler's word is law and the court is everything.", tags: ["gov:absolute", "monarchy", "autocracy"], w: 1.5,
    forms: ["Kingdom of $", "Sultanate of $", "Tsardom of $"], ruler: "Sovereign", mods: [["hierarchical", 2], ["realm:large", 1.5], ["egalitarian", 0.2]] },
  { id: "elective", n: "Elective monarchy", d: "The great houses elect a monarch for life.", tags: ["gov:elective", "monarchy"], w: 0.8,
    forms: ["Kingdom of $", "Crown of $", "Commonwealth of $"], ruler: "Elected King", mods: [["egalitarian", 2]] },
  { id: "empire", n: "Imperial bureaucracy", d: "Governors, tax rolls and roads; an emperor at the top of it all.", tags: ["gov:empire", "monarchy", "autocracy"], w: 3,
    req: { any: ["realm:vast", "realm:large"] }, forms: ["$ Empire", "Empire of $", "High Kingdom of $"], ruler: "Emperor", mods: [["realm:vast", 3], ["urbane", 1.5]] },
  { id: "theocracy", n: "Theocracy", d: "Priests rule in the gods' name.", tags: ["gov:theocracy", "theocratic"], w: 0.7,
    forms: ["Theocracy of $", "Holy $", "Sacred Realm of $"], ruler: "High Priest", mods: [["pious", 4], ["zealous", 2], ["organised", 1.5], ["faith:philosophy", 0], ["origin:holy_mandate", 6]] },
  { id: "merchant", n: "Merchant republic", d: "The richest families sit on the council and trade is policy.", tags: ["gov:merchant", "republic"], w: 0.6,
    req: "has:port", forms: ["$ Republic", "Most Serene Republic of $", "Merchant League of $"], ruler: "Doge", mods: [["mercantile", 5], ["seafaring", 2], ["origin:merchant_charter", 6], ["realm:vast", 0.3]] },
  { id: "noble_republic", n: "Noble republic", d: "An assembly of landholders rules and the executive is weak.", tags: ["gov:noble_republic", "republic"], w: 0.5,
    forms: ["$ Republic", "Commonwealth of $", "Serene Council of $"], ruler: "Lord Protector", mods: [["egalitarian", 2], ["urbane", 1.5]] },
  { id: "city_state", n: "City-state", d: "One great city and the farmland that feeds it.", tags: ["gov:city_state", "republic"], w: 3,
    req: "realm:tiny", forms: ["Free City of $", "City of $", "$ Commune"], ruler: "First Citizen", mods: [["has:city", 2], ["urbane", 2]] },
  { id: "tribal", n: "Tribal confederation", d: "Clans bound by oath and marriage, led by a chosen chief.", tags: ["gov:tribal", "tribal"], w: 0.8,
    forms: ["$ Confederacy", "Clans of $", "Tribes of $"], ruler: "High Chief", mods: [["nomadic", 4], ["forest_folk", 2.5], ["egalitarian", 2], ["urbane", 0.2], ["has:city", 0.3]] },
  { id: "khaganate", n: "Horde", d: "A conquering host that became a state and never stopped riding.", tags: ["gov:khaganate", "tribal", "autocracy"], w: 0.2,
    req: { any: ["horse_lords", "nomadic"] }, forms: ["Khaganate of $", "$ Horde", "Great Horde of $"], ruler: "Khagan", mods: [["horse_lords", 12], ["martial", 2], ["origin:horde", 8]] },
  { id: "magocracy", n: "Magocracy", d: "Only masters of the world's power may rule. Everyone else is 'mundane'.", tags: ["gov:magocracy", "arcane_rule"], w: 0.2,
    req: { any: ["arcane", "magic:high"] }, forms: ["Arcanum of $", "Magocracy of $", "Conclave of $"], ruler: "Archmage", mods: [["arcane", 8], ["faith:ley", 5], ["scholarly", 2], ["origin:rift_touched", 3]] },
  { id: "stratocracy", n: "Stratocracy", d: "The army is the state; generals govern the provinces.", tags: ["gov:stratocracy", "autocracy"], w: 0.3,
    forms: ["Military Order of $", "March of $", "Protectorate of $"], ruler: "Lord Marshal", mods: [["martial", 5], ["frontier", 2.5], ["origin:frontier_march", 4], ["origin:titan_slayers", 3]] },
  { id: "commune", n: "Free commune", d: "Assemblies of free peasants and townsfolk, no lords at all.", tags: ["gov:commune", "republic"], w: 0.15,
    forms: ["Free Commune of $", "$ Union", "League of $"], ruler: "Speaker", mods: [["egalitarian", 6], ["origin:rebellion", 5], ["hierarchical", 0]] },
  { id: "beast_dominion", n: "Beast dominion", d: "Rule by whoever commands the greatest beast.", tags: ["gov:beast", "autocracy"], w: 0.4,
    req: "beast_tamers", forms: ["Dominion of $", "Beast-Throne of $", "$ Pridelands"], ruler: "Beastlord", mods: [["origin:beast_bond", 6], ["martial", 1.5]] },
];

/* ---------------- origins ---------------- */
// How the realm came to be. Picked before the government, so it can steer it.
export const ORIGINS = [
  { id: "old_dynasty", n: "Ancient dynasty", d: "The same bloodline has ruled here for centuries.", tags: ["origin:old_dynasty"], w: 3, mods: [["hierarchical", 1.5]] },
  { id: "successor", n: "Successor state", d: "Carved from the ruins of the fallen $F, and it still claims that empire's mantle.", tags: ["origin:successor"], w: 2, mods: [["near:ruins", 2]] },
  { id: "horde", n: "Conquering horde", d: "Riders from the far grasslands who conquered this land and stayed.", tags: ["origin:horde"], w: 0.5, req: { any: ["horse_lords", "nomadic"] }, mods: [["martial", 2], ["horse_lords", 3]] },
  { id: "merchant_charter", n: "Merchant charter", d: "Founded by a trading company whose charter still hangs in the council hall.", tags: ["origin:merchant_charter"], w: 0.6, req: "has:port", mods: [["mercantile", 4]] },
  { id: "holy_mandate", n: "Holy mandate", d: "A prophet founded this realm and the faith still names its rulers.", tags: ["origin:holy_mandate"], w: 0.6, mods: [["pious", 3], ["zealous", 2], ["organised", 1.5]] },
  { id: "exiles", n: "Exiles from across the sea", d: "Refugees who landed here generations ago and took the coast by the sword.", tags: ["origin:exiles"], w: 0.6, req: "coastal", mods: [["seafaring", 2], ["island", 1.5]] },
  { id: "rebellion", n: "Born in revolt", d: "Peasants and burghers threw off their old masters within living memory.", tags: ["origin:rebellion"], w: 0.5, mods: [["egalitarian", 3]] },
  { id: "union", n: "Union of crowns", d: "Several old kingdoms joined by a marriage that neither side has forgiven.", tags: ["origin:union"], w: 1.2, req: { any: ["realm:large", "realm:vast"] } },
  { id: "titan_slayers", n: "Titan-slayers", d: "Their founder brought down a titan; its bones are the palace roof.", tags: ["origin:titan_slayers"], w: 2, req: "near:titan", mods: [["martial", 2], ["titan_touched", 0.5]] },
  { id: "titan_worshippers", n: "Heralds of the titan", d: "The titan chose them, or so they say, and they follow where it walks.", tags: ["origin:titan_heralds"], w: 1.5, req: "near:titan", mods: [["faith:titan", 5], ["titan_touched", 3]] },
  { id: "rift_touched", n: "Rift-touched", d: "Something came through the rift and gave the first rulers their power.", tags: ["origin:rift_touched"], w: 1.5, req: "near:rift", mods: [["arcane", 2], ["faith:void", 3]] },
  { id: "beast_bond", n: "Beast-bonded", d: "The founders tamed the monsters of the wilds instead of fleeing them.", tags: ["origin:beast_bond"], w: 1.5, req: "beast_tamers" },
  { id: "ruin_heirs", n: "Heirs of the ruins", d: "They rebuilt on an ancient city and dig up its secrets still.", tags: ["origin:ruin_heirs"], w: 1.5, req: "near:ruins", mods: [["scholarly", 2], ["arcane", 1.5]] },
  { id: "frontier_march", n: "Frontier march", d: "Founded as a border fort against the wild; still armed to the teeth.", tags: ["origin:frontier_march"], w: 1, req: "frontier", mods: [["martial", 2]] },
  { id: "mountain_hold", n: "Mountain hold", d: "A fortress-kingdom that has never been taken.", tags: ["origin:mountain_hold"], w: 1.5, req: "mountain_folk" },
];

/* ---------------- ideals (like civics) ---------------- */
export const IDEALS = [
  { id: "warrior_code", n: "Warrior code", d: "Nobles must prove themselves in battle.", tags: ["warrior_code"], w: 1, mods: [["martial", 3]] },
  { id: "free_trade", n: "Free trade", d: "Low tolls and open markets.", tags: ["free_trade"], excl: ["isolation"], w: 0.8, mods: [["mercantile", 3], ["gov:merchant", 4]] },
  { id: "divine_right", n: "Divine right", d: "The ruler is chosen by the gods.", tags: ["divine_right"], w: 0.8, req: "monarchy", mods: [["pious", 2]] },
  { id: "academies", n: "Great academies", d: "Scholars are paid by the state.", tags: ["academies"], w: 0.6, mods: [["scholarly", 4], ["gov:magocracy", 3]] },
  { id: "guilds", n: "Guild cities", d: "Craft guilds run the towns and set every price.", tags: ["guilds"], w: 0.7, mods: [["artisans", 3], ["urbane", 1.5]] },
  { id: "navy", n: "Naval tradition", d: "The fleet is the pride of the realm.", tags: ["navy"], w: 0.4, req: "has:port", mods: [["seafaring", 6], ["gov:merchant", 2]] },
  { id: "levies", n: "Peasant levies", d: "In war, every village sends its men.", tags: ["levies"], excl: ["standing_army"], w: 1, mods: [["gov:feudal", 2], ["tribal", 1.5]] },
  { id: "standing_army", n: "Standing army", d: "Paid, drilled professionals in uniform.", tags: ["standing_army"], excl: ["levies", "mercenaries"], w: 0.6, mods: [["gov:empire", 3], ["gov:stratocracy", 5], ["gov:absolute", 1.5]] },
  { id: "mercenaries", n: "Mercenary companies", d: "Wars are fought by hired swords.", tags: ["mercenaries"], excl: ["standing_army"], w: 0.5, mods: [["mercantile", 3], ["republic", 2]] },
  { id: "isolation", n: "Closed borders", d: "Foreigners need a writ to enter.", tags: ["isolation"], excl: ["free_trade", "open_roads"], w: 0.5, mods: [["insular", 5]] },
  { id: "open_roads", n: "Open roads", d: "Travellers and pilgrims are protected by law.", tags: ["open_roads"], excl: ["isolation"], w: 0.6, mods: [["hospitable", 3], ["pilgrims", 2]] },
  { id: "harsh_law", n: "Harsh law", d: "Punishments are public and severe.", tags: ["harsh_law"], w: 0.6, mods: [["autocracy", 2]] },
  { id: "beast_cavalry", n: "Beast cavalry", d: "Tamed monsters serve in the army.", tags: ["beast_cavalry"], w: 3, req: "beast_tamers" },
  { id: "arcane_council", n: "Arcane council", d: "Wielders of power advise the ruler and fight in the wars.", tags: ["arcane_council"], w: 1.5, req: { any: ["arcane", "gov:magocracy"] }, mods: [["faith:ley", 2]] },
  { id: "great_roads", n: "Great roads", d: "Paved roads, milestones and post-houses.", tags: ["great_roads"], w: 0.5, mods: [["gov:empire", 4]] },
  { id: "frontier_forts", n: "Frontier forts", d: "A chain of forts along every border.", tags: ["frontier_forts"], w: 0.6, mods: [["frontier", 3], ["mountain_folk", 1.5]] },
  { id: "dynastic", n: "Dynastic marriages", d: "Alliances are sealed at the altar.", tags: ["dynastic"], w: 0.7, req: "monarchy" },
  { id: "spy_network", n: "Spymasters", d: "Whispers from every court on the continent.", tags: ["spy_network"], w: 0.4, mods: [["urbane", 2]] },
];

/* ---------------- how realms feel about each other ---------------- */
// Evaluated for each pair of neighbouring realms, both ways round. a/b are conditions on each side;
// same: a tag both must share (the tag prefix is matched, e.g. "culture" = same culture).
export const RELATION_RULES = [
  { same: "culture", d: 20, why: "Kindred peoples" },
  { same: "faith", d: 20, why: "Shared faith" },
  { differ: "faith", a: "zealous", d: -30, why: "Heretics at the border" },
  { differ: "faith", a: "origin:holy_mandate", d: -20, why: "A prophet's realm among unbelievers" },
  { a: "gov:theocracy", b: "gov:magocracy", d: -35, why: "Priests and mages" },
  { a: "faith:void", b: "!faith:void", d: -30, why: "They worship the thing in the rift" },
  { a: "republic", b: "autocracy", d: -12, why: "Councils and crowns" },
  { a: "tribal", b: "has:city", d: -15, why: "Raids along the border" },
  { a: "gov:khaganate", d: -20, why: "The horde looks for new pastures" },
  { a: "mercantile", b: "mercantile", d: 12, why: "Trading partners" },
  { a: "free_trade", b: "free_trade", d: 10, why: "Open markets" },
  { a: "isolation", d: -10, why: "Closed borders" },
  { a: "origin:successor", b: "origin:successor", sameF: true, d: -35, why: "Rival heirs of the fallen empire" },
  { a: "origin:exiles", d: -12, why: "Old grievances with the settlers" },
  { a: "origin:union", same: "culture", d: -18, why: "Claims on kin across the border" },
  { a: "origin:titan_slayers", b: "origin:titan_heralds", d: -40, why: "Titan-slayers and titan-worshippers" },
  { a: "dynastic", b: "dynastic", d: 15, why: "Royal marriages" },
  { a: "hospitable", d: 6, why: "Famous hospitality" },
  { a: "insular", d: -6, why: "Aloof neighbours" },
  { a: "martial", b: "martial", d: -8, why: "Old battlefield rivalry" },
];

/* ---------------- reasons for war ---------------- */
// a = attacker's tags, b = defender's, pair tags: same:culture differ:faith rel:rival
export const CASUS_BELLI = [
  { id: "conquest", n: "Conquest", w: 2, mods: [["a:martial", 1.5], ["a:autocracy", 1.5], ["a:realm:vast", 1.5]], names: ["The $ War", "The Conquest of $"] },
  { id: "holy_war", n: "Holy war", w: 3, req: ["pair:differ:faith", { any: ["a:zealous", "a:militant", "a:gov:theocracy"] }], names: ["The $ Crusade", "The Holy War for $"] },
  { id: "reunification", n: "Reunification", w: 3, req: "pair:same:culture", mods: [["a:origin:union", 3]], names: ["The War of Reunification", "The $ Reunion War"] },
  { id: "succession", n: "Succession dispute", w: 2, req: ["a:monarchy", "b:monarchy"], mods: [["a:dynastic", 4], ["b:dynastic", 2]], names: ["The War of the $ Succession"] },
  { id: "imperial_claim", n: "Imperial claim", w: 4, req: ["a:origin:successor", "b:origin:successor"], names: ["The War of the $ Mantle", "The Heirs' War"] },
  { id: "trade_war", n: "Trade war", w: 2, req: ["a:has:port", "b:has:port"], mods: [["a:mercantile", 3], ["a:gov:merchant", 3]], names: ["The $ Trade War", "The War of the Tolls"] },
  { id: "raid", n: "Great raid", w: 3, req: { any: ["a:tribal", "a:gov:khaganate"] }, names: ["The $ Raids", "The Riding of $"] },
  { id: "border", n: "Border dispute", w: 1.5, names: ["The $ Border War", "The War of the $ Marches"] },
  { id: "titan_war", n: "Titan war", w: 5, req: ["a:origin:titan_slayers", "b:origin:titan_heralds"], names: ["The War of the Titan", "The $ Beast War"] },
];

/* ---------------- the calendar ---------------- */
export const SEASON_MONTHS = {
  winter: ["Deepwinter", "Frostmoon", "Snowfall", "Longnight", "Icemoon"], spring: ["Thaw", "Seedtime", "Blossom", "Greening", "Rainmoon"],
  summer: ["Highsun", "Midsummer", "Goldmoon", "Haymoon", "Swelter"], autumn: ["Harvest", "Leaffall", "Mistmoon", "Emberfall", "Reaping"],
};
export const ERA_FORMS = ["Age of $", "Era of the $ Crown", "Years since the $ Founding", "Age of the Fallen $", "The $ Reckoning"];
