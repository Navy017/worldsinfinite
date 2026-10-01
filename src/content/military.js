// Soldiers and ships. Picked per realm with the rule engine, from the realm's culture, faith,
// government, ideals and land. See core/rules.js for the format.
//
// Unit fields: role (infantry | ranged | cavalry | siege | magic | beast), mounted, wpn (what the
// sprite carries: spear pike sword axe bow xbow lance javelin staff siege), ranks (formation depth),
// gap (metres between soldiers), size (soldiers per company), kit (armour look: light, mail, plate, robe, hide)

export const UNITS = [
  { id: "levy_spear", n: "Levy spearmen", role: "infantry", wpn: "spear", kit: "light", ranks: 6, gap: 1.1, size: 150, w: 3, mods: [["levies", 3], ["gov:feudal", 1.5], ["standing_army", 0.3]] },
  { id: "pike", n: "Pikemen", role: "infantry", wpn: "pike", kit: "mail", ranks: 8, gap: 1, size: 160, w: 1, mods: [["mountain_folk", 3], ["republic", 2], ["gov:commune", 3], ["standing_army", 1.5]] },
  { id: "men_at_arms", n: "Men-at-arms", role: "infantry", wpn: "sword", kit: "plate", ranks: 4, gap: 1.2, size: 100, w: 1.5, mods: [["hierarchical", 1.5], ["standing_army", 2], ["tribal", 0.2]] },
  { id: "axemen", n: "Axe warriors", role: "infantry", wpn: "axe", kit: "hide", ranks: 4, gap: 1.3, size: 120, w: 0.8, mods: [["tribal", 3], ["forest_folk", 2], ["seafaring", 1.5], ["martial", 1.5], ["urbane", 0.4]] },
  { id: "temple_guard", n: "Temple guard", role: "infantry", wpn: "sword", kit: "plate", ranks: 4, gap: 1.2, size: 100, w: 0.3, mods: [["gov:theocracy", 8], ["militant", 6]] },
  { id: "marines", n: "Marines", role: "infantry", wpn: "sword", kit: "light", ranks: 4, gap: 1.2, size: 120, w: 0.2, req: "has:port", mods: [["seafaring", 6], ["navy", 4]] },
  { id: "archers", n: "Archers", role: "ranged", wpn: "bow", kit: "light", ranks: 4, gap: 1.3, size: 120, w: 2, mods: [["forest_folk", 2]] },
  { id: "longbow", n: "Longbowmen", role: "ranged", wpn: "bow", kit: "light", ranks: 4, gap: 1.4, size: 120, w: 0.6, mods: [["gov:feudal", 1.5], ["forest_folk", 2], ["egalitarian", 1.5]] },
  { id: "crossbow", n: "Crossbowmen", role: "ranged", wpn: "xbow", kit: "mail", ranks: 4, gap: 1.2, size: 120, w: 0.9, mods: [["urbane", 2], ["mercenaries", 3], ["republic", 2], ["artisans", 1.5], ["tribal", 0.2]] },
  { id: "skirmish", n: "Javelin skirmishers", role: "ranged", wpn: "javelin", kit: "light", ranks: 2, gap: 2, size: 100, w: 0.8, mods: [["jungle", 3], ["hot", 1.5], ["tribal", 2]] },
  { id: "light_cav", n: "Light cavalry", role: "cavalry", mounted: 1, wpn: "spear", kit: "light", ranks: 3, gap: 2.5, size: 80, w: 1.2, mods: [["steppe", 2]] },
  { id: "knights", n: "Knights", role: "cavalry", mounted: 1, wpn: "lance", kit: "plate", ranks: 2, gap: 2.8, size: 60, w: 0.8, req: "monarchy", mods: [["hierarchical", 2.5], ["gov:feudal", 2], ["warrior_code", 2], ["pious", 1.3]] },
  { id: "horse_archers", n: "Horse archers", role: "cavalry", mounted: 1, wpn: "bow", kit: "light", ranks: 3, gap: 2.8, size: 80, w: 0.2, mods: [["horse_lords", 25], ["nomadic", 6], ["gov:khaganate", 8]] },
  { id: "camel_riders", n: "Camel riders", role: "cavalry", mounted: 1, wpn: "spear", kit: "robe", ranks: 3, gap: 3, size: 70, w: 0.1, req: "desert", mods: [["desert_wanderers", 30]] },
  { id: "beast_riders", n: "Beast riders", role: "beast", mounted: 1, wpn: "spear", kit: "hide", ranks: 2, gap: 4, size: 40, w: 0.1, req: { any: ["beast_tamers", "beast_cavalry"] }, mods: [["beast_cavalry", 40], ["gov:beast", 20]] },
  { id: "war_mages", n: "Battle mages", role: "magic", wpn: "staff", kit: "robe", ranks: 2, gap: 3, size: 30, w: 0.05, req: { any: ["arcane", "arcane_council", "gov:magocracy", "faith:ley"] }, not: { any: ["slot:power-source", "slot:power-access"] }, mods: [["arcane_council", 50], ["gov:magocracy", 60], ["arcane", 15]] },
  { id: "siege", n: "Siege engines", role: "siege", wpn: "siege", kit: "light", ranks: 1, gap: 14, size: 8, w: 0.6, mods: [["standing_army", 2], ["artisans", 2], ["gov:empire", 2], ["tribal", 0.1]] },
];

// Ships. style: which building-style families (see archstyles) favour the hull; era lists are
// just a feel for how "advanced" the look is. len and beam in metres, cargo in tonnes.
export const SHIPS = [
  { id: "cog", n: "Cog", role: "merchant", len: 24, beam: 7, masts: 1, rig: "square", guns: 0, crew: 14, cargo: 120, w: 2, mods: [["style:timber", 3], ["style:stone", 2]] },
  { id: "hulk", n: "Hulk", role: "merchant", len: 28, beam: 9, masts: 1, rig: "square", guns: 0, crew: 18, cargo: 200, w: 0.8, mods: [["style:stone", 2], ["style:timber", 1.5]] },
  { id: "carrack", n: "Carrack", role: "merchant", len: 36, beam: 11, masts: 3, rig: "square", guns: 8, crew: 60, cargo: 400, w: 1, mods: [["style:stone", 3], ["mercantile", 1.5]] },
  { id: "caravel", n: "Caravel", role: "merchant", len: 22, beam: 7, masts: 2, rig: "lateen", guns: 2, crew: 20, cargo: 60, w: 1, mods: [["style:courtyard", 2], ["seafaring", 1.5]] },
  { id: "dhow", n: "Dhow", role: "merchant", len: 20, beam: 6, masts: 1, rig: "lateen", guns: 0, crew: 16, cargo: 80, w: 0.4, mods: [["style:courtyard", 8], ["hot", 2]] },
  { id: "junk", n: "Junk", role: "merchant", len: 32, beam: 9, masts: 3, rig: "junk", guns: 2, crew: 40, cargo: 300, w: 0.2, mods: [["style:eastern", 30]] },
  { id: "outrigger", n: "Outrigger trader", role: "merchant", len: 16, beam: 4, masts: 1, rig: "lateen", guns: 0, crew: 10, cargo: 20, w: 0.1, mods: [["style:tropical", 30]] },
  { id: "brig", n: "Brig", role: "merchant", len: 30, beam: 8, masts: 2, rig: "square", guns: 6, crew: 40, cargo: 180, w: 0.8, mods: [["mercantile", 1.5], ["style:stone", 1.5]] },
  { id: "fluyt", n: "Fluyt", role: "merchant", len: 34, beam: 7, masts: 3, rig: "square", guns: 4, crew: 25, cargo: 350, w: 0.5, mods: [["gov:merchant", 5], ["mercantile", 2]] },
  { id: "galley", n: "War galley", role: "war", len: 40, beam: 5, masts: 1, rig: "oars", guns: 1, crew: 180, cargo: 0, w: 1, mods: [["style:courtyard", 3], ["style:stone", 1.5]] },
  { id: "longship", n: "Longship", role: "war", len: 26, beam: 5, masts: 1, rig: "square", oars: 1, guns: 0, crew: 60, cargo: 0, w: 0.3, mods: [["tribal", 8], ["seafaring", 2], ["style:timber", 2], ["cold", 3]] },
  { id: "war_brig", n: "Brig", role: "war", len: 30, beam: 8, masts: 2, rig: "square", guns: 16, crew: 90, cargo: 0, w: 1.2, mods: [["style:stone", 1.5], ["style:timber", 1.5]] },
  { id: "frigate", n: "Frigate", role: "war", len: 42, beam: 11, masts: 3, rig: "square", guns: 32, crew: 250, cargo: 0, w: 0.8, mods: [["navy", 3], ["standing_army", 1.5]] },
  { id: "ship_line", n: "Ship of the line", role: "war", len: 55, beam: 15, masts: 3, rig: "square", guns: 74, crew: 600, cargo: 0, w: 0.15, req: { any: ["realm:large", "realm:vast"] }, mods: [["navy", 6], ["gov:empire", 3]] },
  { id: "war_junk", n: "War junk", role: "war", len: 34, beam: 9, masts: 3, rig: "junk", guns: 12, crew: 120, cargo: 0, w: 0.1, mods: [["style:eastern", 40]] },
  { id: "war_canoe", n: "War canoe", role: "war", len: 20, beam: 3, masts: 0, rig: "oars", guns: 0, crew: 40, cargo: 0, w: 0.1, mods: [["style:tropical", 30], ["tribal", 3]] },
  { id: "fishing", n: "Fishing smack", role: "fishing", len: 12, beam: 4, masts: 1, rig: "square", guns: 0, crew: 5, cargo: 10, w: 1, mods: [["style:eastern", 0.2]] },
  { id: "sampan", n: "Sampan", role: "fishing", len: 9, beam: 2.5, masts: 1, rig: "junk", guns: 0, crew: 3, cargo: 4, w: 0.1, mods: [["style:eastern", 40]] },
];

// Echelon names, largest to smallest
export const ECHELONS = ["Army", "Division", "Regiment", "Battalion", "Company"];
export const ARMY_NAMES = ["Army of the $", "$ Host", "Grand Army of $", "Army of $", "$ Legion"];
export const ARMY_DIRS = ["North", "South", "East", "West", "Coast", "Hills", "River", "March", "Crown", "Border"];
export const SHIP_NAME_WORDS = ["Heron", "Gull", "Star", "Wolf", "Maiden", "Crown", "Serpent", "Tide", "Lantern", "Hope", "Fortune", "Dawn", "Swan",
  "Hammer", "Rose", "Falcon", "Whale", "Queen", "Pilgrim", "Mercy", "Storm", "Anchor", "Dolphin", "Thistle", "Otter", "Comet", "Lion", "Raven"];
export const SHIP_NAME_ADJ = ["Salt", "Golden", "Swift", "Grey", "Red", "Faithful", "Silver", "Black", "Bold", "Merry", "Lucky", "Iron", "Proud", "Wandering", "Dancing", "Northern", "Crimson"];
