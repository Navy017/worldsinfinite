// Battle tactics. Each realm knows the tactics its troops, culture and ideals allow (req uses
// realm tags plus "units:<role>" for the troop roles in its army template). In a battle each side
// picks one; `strong` and `weak` list tactics it beats or loses to, and `terrain` scales it by the
// ground fought on (forest, hills, mountain, steppe, desert, marsh, river, cold, open).
// n reads after "with"/"using" in news text ("broke them with a pike square").

export const TACTICS = [
  { id: "shield_wall", n: "a shield wall", name: "Shield wall", d: "Locked shields and a slow, grinding advance.", w: 2, req: "units:infantry",
    strong: ["cavalry_charge", "night_raid", "beast_rampage"], weak: ["bombardment", "arcane_barrage", "flanking_march"], terrain: { open: 1.1, forest: 0.9 } },
  { id: "pike_square", n: "a pike square", name: "Pike square", d: "Hedges of pikes that no horse will charge.", w: 1, req: { any: ["units:infantry"] }, mods: [["mountain_folk", 3], ["republic", 2], ["standing_army", 1.5]],
    strong: ["cavalry_charge", "beast_rampage", "shield_wall"], weak: ["skirmish_screen", "bombardment", "horse_archers"], terrain: { open: 1.2, forest: 0.7, marsh: 0.7 } },
  { id: "cavalry_charge", n: "a heavy cavalry charge", name: "Heavy cavalry charge", d: "Knights or lancers hurled at the enemy line at full gallop.", w: 1.5, req: "units:cavalry", mods: [["hierarchical", 1.5], ["warrior_code", 2]],
    strong: ["skirmish_screen", "bombardment", "siege_starve"], weak: ["pike_square", "shield_wall", "high_ground"], terrain: { open: 1.3, steppe: 1.4, forest: 0.6, marsh: 0.5, mountain: 0.5 } },
  { id: "horse_archers", n: "horse-archer harassment", name: "Horse-archer harassment", d: "Endless volleys from riders who never close.", w: 0.5, req: "units:cavalry", mods: [["horse_lords", 12], ["nomadic", 4]],
    strong: ["pike_square", "shield_wall", "siege_starve"], weak: ["forest_ambush", "high_ground", "skirmish_screen"], terrain: { steppe: 1.5, desert: 1.3, open: 1.2, forest: 0.5, mountain: 0.5 } },
  { id: "feigned_retreat", n: "a feigned retreat", name: "Feigned retreat", d: "Flee, draw them out, turn and destroy them.", w: 0.8, req: "units:cavalry", mods: [["horse_lords", 4], ["martial", 1.5]],
    strong: ["cavalry_charge", "shield_wall", "beast_rampage"], weak: ["high_ground", "skirmish_screen"], terrain: { steppe: 1.3, open: 1.1, forest: 0.7 } },
  { id: "skirmish_screen", n: "a screen of skirmishers", name: "Skirmisher screen", d: "Archers and javelins bleed the enemy before the lines meet.", w: 1.5, req: "units:ranged",
    strong: ["pike_square", "shield_wall", "arcane_barrage"], weak: ["cavalry_charge", "feigned_retreat"], terrain: { forest: 1.2, hills: 1.1, open: 0.9 } },
  { id: "forest_ambush", n: "an ambush in the woods", name: "Forest ambush", d: "Hidden archers, felled trees, and an enemy caught on the march.", w: 0.8, req: "units:ranged", mods: [["forest_folk", 5], ["tribal", 2]],
    strong: ["cavalry_charge", "horse_archers", "flanking_march"], weak: ["scorched_earth", "high_ground"], terrain: { forest: 1.7, jungle: 1.7, open: 0.4, steppe: 0.3, desert: 0.3 } },
  { id: "high_ground", n: "a stand on the high ground", name: "High-ground defence", d: "Dig in on the ridge and let them come uphill.", w: 1.2, mods: [["mountain_folk", 3], ["frontier_forts", 2]],
    strong: ["cavalry_charge", "feigned_retreat", "horse_archers"], weak: ["bombardment", "siege_starve", "flanking_march"], terrain: { hills: 1.4, mountain: 1.6, open: 0.8, steppe: 0.7, marsh: 0.7 } },
  { id: "night_raid", n: "a night raid", name: "Night raid", d: "Strike the camp in the dark, before the sentries wake.", w: 0.7, mods: [["martial", 1.5], ["tribal", 2], ["spy_network", 2]],
    strong: ["siege_starve", "bombardment", "high_ground"], weak: ["shield_wall", "skirmish_screen"], terrain: { forest: 1.2, hills: 1.1 } },
  { id: "flanking_march", n: "a flanking march", name: "Flanking march", d: "Pin them in front, march around, hit them from the side.", w: 1, mods: [["standing_army", 2], ["scholarly", 1.3]],
    strong: ["shield_wall", "high_ground", "pike_square"], weak: ["forest_ambush", "skirmish_screen", "night_raid"], terrain: { open: 1.2, forest: 0.7, mountain: 0.6 } },
  { id: "siege_starve", n: "a slow siege", name: "Siege and starve", d: "Surround them, cut the roads, and wait.", w: 0.8, mods: [["gov:empire", 2], ["standing_army", 1.5]],
    strong: ["high_ground", "shield_wall"], weak: ["night_raid", "cavalry_charge", "horse_archers"], terrain: { open: 1, hills: 1.1 } },
  { id: "bombardment", n: "a bombardment by siege engines", name: "Siege bombardment", d: "Trebuchets and catapults smash walls and formations alike.", w: 1, req: "units:siege", mods: [["artisans", 2]],
    strong: ["shield_wall", "pike_square", "high_ground"], weak: ["cavalry_charge", "night_raid"], terrain: { open: 1.1, hills: 1.1, forest: 0.6, marsh: 0.6 } },
  { id: "arcane_barrage", n: "an arcane barrage", name: "Arcane barrage", d: "War-casters loose their power on packed ranks.", w: 3, req: "units:magic",
    strong: ["pike_square", "shield_wall", "siege_starve", "beast_rampage"], weak: ["skirmish_screen", "night_raid"], terrain: {} },
  { id: "beast_rampage", n: "a rampage of war beasts", name: "Beast rampage", d: "Tamed monsters let loose into the enemy line.", w: 3, req: "units:beast",
    strong: ["skirmish_screen", "horse_archers", "flanking_march"], weak: ["pike_square", "arcane_barrage", "shield_wall"], terrain: { forest: 1.1, open: 1.1 } },
  { id: "scorched_earth", n: "scorched earth", name: "Scorched earth", d: "Burn the fields, poison the wells, and let hunger fight for you.", w: 0.5, mods: [["autocracy", 2], ["harsh_law", 2], ["cold", 2]],
    strong: ["siege_starve", "flanking_march", "forest_ambush"], weak: ["skirmish_screen", "horse_archers"], terrain: { cold: 1.4, steppe: 1.2 } },
];

// Megaprojects and monuments, in three tiers: 1 local (a statue, a shrine), 2 national (a cathedral,
// a great library), 3 world wonders (a colossus, a great wall). place: where it is built:
// capital | river (on a river near the capital) | coast (a port) | border (along a border with a
// rival) | holy (the faith's holy site) | mountain. months: time to build; cost in treasury units;
// effects: +prestige, +stability, +science field levels, +trade, +defence (all small numbers).
export const PROJECTS = [
  { id: "statue", n: "Statue of {ruler}", tier: 1, place: "capital", months: 12, cost: 30, fx: { prestige: 2 }, w: 2 },
  { id: "shrine", n: "Shrine of {deity}", tier: 1, place: "capital", months: 10, cost: 25, fx: { stability: 3 }, w: 2, mods: [["pious", 2]] },
  { id: "bridge", n: "Great Bridge of {place}", tier: 1, place: "river", months: 18, cost: 40, fx: { trade: 0.05 }, w: 1 },
  { id: "arena", n: "Arena of {capital}", tier: 1, place: "capital", months: 20, cost: 45, fx: { stability: 4, prestige: 1 }, w: 0.8, mods: [["martial", 2]] },
  { id: "harbour", n: "Harbour works of {place}", tier: 1, place: "coast", months: 24, cost: 50, fx: { trade: 0.08 }, w: 1.2, req: "has:port", mods: [["seafaring", 2]] },
  { id: "cathedral", n: "Cathedral of {deity}", tier: 2, place: "capital", months: 60, cost: 160, fx: { stability: 8, prestige: 5 }, w: 1, mods: [["pious", 3], ["lavish", 2], ["organised", 1.5]], not: "faith:philosophy" },
  { id: "library", n: "Great Library of {capital}", tier: 2, place: "capital", months: 48, cost: 140, fx: { science: 0.4, prestige: 4 }, w: 0.8, mods: [["scholarly", 4], ["academies", 3]] },
  { id: "palace", n: "Palace of {ruler}", tier: 2, place: "capital", months: 54, cost: 170, fx: { prestige: 8, stability: 2 }, w: 0.8, req: "autocracy", mods: [["lavish", 2]] },
  { id: "observatory", n: "Observatory of {capital}", tier: 2, place: "mountain", months: 40, cost: 120, fx: { science: 0.3 }, w: 0.5, mods: [["faith:stars", 5], ["scholarly", 2], ["seers", 2]] },
  { id: "dam", n: "{place} Dam", tier: 2, place: "river", months: 72, cost: 200, fx: { trade: 0.06, growth: 0.004 }, w: 0.5, mods: [["artisans", 2], ["great_roads", 1.5]] },
  { id: "canal", n: "{place} Canal", tier: 2, place: "river", months: 90, cost: 240, fx: { trade: 0.15 }, w: 0.4, mods: [["mercantile", 3], ["gov:merchant", 3]] },
  { id: "fortress", n: "Fortress of {place}", tier: 2, place: "border", months: 48, cost: 150, fx: { defence: 0.2 }, w: 0.8, mods: [["frontier_forts", 4], ["martial", 1.5]] },
  { id: "lighthouse", n: "Lighthouse of {place}", tier: 2, place: "coast", months: 36, cost: 110, fx: { trade: 0.08, prestige: 3 }, w: 0.7, req: "has:port" },
  { id: "great_temple", n: "Great Temple at {holy}", tier: 3, place: "holy", months: 120, cost: 420, fx: { stability: 12, prestige: 15 }, w: 1, mods: [["pious", 3], ["gov:theocracy", 4]] },
  { id: "great_wall", n: "The Great Wall of {short}", tier: 3, place: "border", months: 160, cost: 520, fx: { defence: 0.45, prestige: 10 }, w: 0.8, req: { any: ["realm:large", "realm:vast"] }, mods: [["insular", 3], ["frontier_forts", 3]] },
  { id: "colossus", n: "The Colossus of {place}", tier: 3, place: "coast", months: 110, cost: 400, fx: { prestige: 18, trade: 0.05 }, w: 0.6, req: "has:port" },
  { id: "sky_citadel", n: "The Sky Citadel of {short}", tier: 3, place: "mountain", months: 150, cost: 500, fx: { prestige: 16, defence: 0.2 }, w: 0.4, req: { any: ["premise:strewn_sky", ["default:power", { any: ["arcane", "gov:magocracy", "magic:high"] }]] }, mods: [["premise:strewn_sky", 3]] },
  { id: "ley_spire", n: "The Ley Spire of {capital}", tier: 3, place: "capital", months: 130, cost: 450, fx: { science: 0.6, prestige: 12 }, w: 0.5, req: [{ any: ["faith:ley", "gov:magocracy", "arcane_council"] }, "default:power"] },
  { id: "titan_throne", n: "The Titan-Bone Throne", tier: 3, place: "capital", months: 100, cost: 380, fx: { prestige: 20 }, w: 1.5, req: "origin:titan_slayers" },
  { id: "imperial_road", n: "The Imperial Highway", tier: 3, place: "capital", months: 140, cost: 480, fx: { trade: 0.12, prestige: 8 }, w: 1, req: "gov:empire", mods: [["great_roads", 4]] },
];

// Character traits: w = how common; fx nudge decisions (war appetite, diplomacy, science, intrigue)
// and skills (mil, dip, sci, int). opp lists traits it cannot be combined with.
export const TRAITS = [
  { id: "brave", n: "Brave", fx: { war: 1.3, mil: 1 }, opp: ["craven"] }, { id: "craven", n: "Craven", fx: { war: 0.6, mil: -1 }, opp: ["brave"] },
  { id: "ambitious", n: "Ambitious", fx: { war: 1.4, projects: 1.3 }, opp: ["content"] }, { id: "content", n: "Content", fx: { war: 0.7 }, opp: ["ambitious"] },
  { id: "cruel", n: "Cruel", fx: { unrest: 1.3, war: 1.1 }, opp: ["just"] }, { id: "just", n: "Just", fx: { unrest: 0.8, dip: 1 }, opp: ["cruel"] },
  { id: "pious", n: "Pious", fx: { projects: 1.1, holy: 1.6 } }, { id: "scholar", n: "Scholarly", fx: { sci: 2 } },
  { id: "greedy", n: "Greedy", fx: { trade: 1.3, unrest: 1.1 }, opp: ["generous"] }, { id: "generous", n: "Generous", fx: { unrest: 0.85 }, opp: ["greedy"] },
  { id: "charismatic", n: "Charismatic", fx: { dip: 2 } }, { id: "paranoid", n: "Paranoid", fx: { int: 1, dip: -1 } },
  { id: "lazy", n: "Lazy", fx: { projects: 0.6, sci: -1 } }, { id: "brilliant", n: "Brilliant", fx: { sci: 2, mil: 1, dip: 1 } },
  { id: "sickly", n: "Sickly", fx: { death: 2.5 } }, { id: "strong", n: "Strong", fx: { death: 0.6, mil: 1 } },
  { id: "warlike", n: "Warlike", fx: { war: 1.8, mil: 1 }, opp: ["peaceful"] }, { id: "peaceful", n: "Peaceful", fx: { war: 0.4, dip: 1 }, opp: ["warlike"] },
  { id: "cunning", n: "Cunning", fx: { int: 2 } }, { id: "honest", n: "Honest", fx: { dip: 1, int: -1 } },
  { id: "reformer", n: "Reformer", fx: { reform: 2 }, opp: ["traditionalist"] }, { id: "traditionalist", n: "Traditionalist", fx: { reform: 0.3 }, opp: ["reformer"] },
];
export const EPITHETS = { brave: "the Bold", craven: "the Timid", ambitious: "the Ambitious", cruel: "the Cruel", just: "the Just", pious: "the Pious", scholar: "the Wise",
  greedy: "the Grasping", generous: "the Generous", charismatic: "the Beloved", paranoid: "the Watchful", lazy: "the Idle", brilliant: "the Great", warlike: "the Conqueror",
  peaceful: "the Peacemaker", cunning: "the Fox", reformer: "the Reformer", builder: "the Builder", victorious: "the Victorious" };
