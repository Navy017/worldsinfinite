export const W = 1600, H = 1000;

export const BIOMES = [
  { k: "glacier", n: "Glacier", c: "#e8edef" },
  { k: "tundra", n: "Tundra", c: "#b5b699" },
  { k: "coldsteppe", n: "Cold Steppe", c: "#b9b48b" },
  { k: "boreal", n: "Boreal Forest (Taiga)", c: "#4c6a4f", forest: 1 },
  { k: "grass", n: "Grassland", c: "#a8b56c" },
  { k: "tempforest", n: "Temperate Forest", c: "#5e8a4b", forest: 1 },
  { k: "temprain", n: "Temperate Rainforest", c: "#3d7254", forest: 1 },
  { k: "colddesert", n: "Cold Desert", c: "#c6bb98" },
  { k: "desert", n: "Desert", c: "#e1ca8e" },
  { k: "badlands", n: "Badlands", c: "#bd8a5e" },
  { k: "savanna", n: "Savanna", c: "#c5b864" },
  { k: "dryforest", n: "Tropical Dry Forest", c: "#8a9b46", forest: 1 },
  { k: "rainforest", n: "Tropical Rainforest", c: "#2e6a3a", forest: 1 },
  { k: "swamp", n: "Swamp", c: "#5e6d4b" },
  { k: "mangrove", n: "Mangrove", c: "#4a6b55", forest: 1 },
  { k: "alpine", n: "Alpine Meadow & Scree", c: "#9c947f" },
  { k: "peaks", n: "Snowcapped Peaks", c: "#f1efeb" },
];
export const B = Object.fromEntries(BIOMES.map((b, i) => [b.k, i]));
export const TERR = ["Plains", "Hills", "Mountains", "High peaks", "Plateau"];

export const SPECIAL = [null,
  { n: "Ancient Forest", c: "#23503a", d: "Old-growth trees older than any kingdom. Paths close behind travellers.", fits: [B.tempforest, B.temprain, B.boreal] },
  { n: "Fungal Forest", c: "#7c5a8f", d: "Mushroom caps as tall as towers and drifting clouds of spores.", fits: [B.rainforest, B.swamp, B.temprain, B.mangrove, B.dryforest] },
  { n: "Crystal Forest", c: "#8cc4d4", d: "Trees grown through with glassy mineral. They ring in the wind.", fits: [B.boreal, B.alpine, B.tundra] },
  { n: "Blighted Wood", c: "#5d544a", d: "Grey, dying woodland. The rot spreads a little every year.", fits: [B.tempforest, B.dryforest, B.boreal, B.rainforest] },
];

export const WILD = {
  glacier: ["Ice Wyrms", "Frost Wolves"], tundra: ["Frost Wolves", "Ice Bears", "Sabre Cats"], coldsteppe: ["Steppe Raptors", "Sabre Cats"],
  boreal: ["Dire Wolves", "Great Bears", "Shadow Elk"], grass: ["Terror Birds", "War Boars"], tempforest: ["Giant Spiders", "Dire Wolves", "Hookbeak Bears"],
  temprain: ["Moss Stalkers", "Giant Spiders"], colddesert: ["Rock Vultures", "Sand Wolves"], desert: ["Giant Scorpions", "Dune Stalkers", "Sand Wyrms"],
  badlands: ["Basilisks", "Carrion Rocs"], savanna: ["Great Lions", "Thunder Rhinos"], dryforest: ["Blood Panthers", "Razorback Swine"],
  rainforest: ["Venom Stalkers", "Giant Constrictors", "Blood Panthers"], swamp: ["Bog Hydras", "Giant Leeches", "Mire Crocodiles"],
  mangrove: ["Saltmarsh Crocodiles", "Razor Crabs"], alpine: ["Wyverns", "Cliff Rocs", "Rock Trolls"], peaks: ["Wyverns", "Storm Griffons"],
};
export const WILD_WEIGHT = { glacier: .4, tundra: 1, coldsteppe: .8, boreal: 1.5, grass: .7, tempforest: 1.5, temprain: 2, colddesert: 1, desert: 1.2, badlands: 2, savanna: 1.5, dryforest: 2, rainforest: 3, swamp: 3, mangrove: 2, alpine: 2, peaks: 1 };

export function titanKinds(bk) {
  if (bk === "peaks" || bk === "alpine") return ["Stone Colossus", "Elder Wyrm", "Storm Roc"];
  if (bk === "desert" || bk === "colddesert" || bk === "badlands") return ["Great Sand Wyrm", "Scarab Colossus", "Dune Leviathan"];
  if (bk === "tempforest" || bk === "temprain" || bk === "boreal") return ["Antlered Titan", "Elder World-Boar", "Great Moss Tortoise"];
  if (bk === "rainforest" || bk === "dryforest" || bk === "mangrove") return ["Primeval Serpent", "Thunder Ape", "Canopy Titan"];
  if (bk === "tundra" || bk === "glacier" || bk === "coldsteppe") return ["Frost Behemoth", "Mammoth King", "White Wyrm"];
  if (bk === "swamp") return ["Mire Leviathan", "Hundred-Headed Hydra"];
  return ["Thunderhoof Behemoth", "Titan Aurochs", "Sky Whale"];
}

export const MYST = [
  { n: "Ancient Ruins", d: "Toppled halls of a civilisation nobody remembers building.", ok: () => true },
  { n: "Ley Nexus", d: "Several ley lines cross here. Spells behave strangely.", ok: () => true },
  { n: "Planar Rift", d: "A tear in the world. Things come through at night.", ok: () => true },
  { n: "Petrified Titan", d: "The stone corpse of something enormous, half buried.", ok: () => true },
  { n: "Standing Stones", d: "A ring of stones whose shadows fall at the wrong angle.", ok: p => [B.grass, B.coldsteppe, B.tundra, B.tempforest, B.savanna].includes(p.biome) },
  { n: "Sunken Temple", d: "A temple visible beneath the waves at low tide.", ok: p => p.coastal },
  { n: "Eternal Storm", d: "A storm that has not moved or ended in living memory.", ok: p => p.coastal || p.terr >= 2 },
  { n: "Meteor Crater", d: "A glassy crater. The fallen star is still warm.", ok: p => [B.desert, B.colddesert, B.badlands, B.grass, B.savanna, B.tundra].includes(p.biome) },
  { n: "Whispering Grove", d: "The trees repeat what travellers said a day earlier.", ok: p => BIOMES[p.biome].forest },
  { n: "Frozen Citadel", d: "A fortress sealed in ice, its lamps still lit inside.", ok: p => [B.glacier, B.tundra, B.peaks].includes(p.biome) },
  { n: "Glass Desert", d: "Sand fused to glass by some ancient fire.", ok: p => [B.desert, B.badlands].includes(p.biome) },
  { n: "Floating Isles", d: "Rocks drift in the air above the peaks, trailing waterfalls.", ok: p => p.terr >= 2 },
  { n: "Singing Caves", d: "Wind through the caves makes a slow, deep music.", ok: p => p.terr === 1 || p.terr === 2 || p.terr === 4 },
  { n: "Bottomless Sinkhole", d: "Stones dropped in are never heard to land.", ok: p => p.terr <= 1 },
];

export const GOV = [["Kingdom of $", 3], ["Duchy of $", 2], ["Principality of $", 1.5], ["$ Republic", 1.2], ["Grand Duchy of $", 1], ["Realm of $", 1],
  ["Dominion of $", .8], ["Theocracy of $", .7], ["Free Cities of $", .6], ["$ League", .6], ["Khaganate of $", .6], ["$ Confederacy", .6], ["Sultanate of $", .6], ["Margraviate of $", .4]];
export const REALM_COLORS = ["#d6a676", "#a4b38a", "#cb897b", "#8fb1ca", "#baa1ca", "#dac47f", "#86b9a7", "#caa0ab", "#a0b4dc", "#ddac80", "#a8c897", "#c1b097", "#c8b8e1", "#e1b4a0"];
export const HOSTILE_COL = [null, "#c58a2a", "#c4532a", "#9c1e1e"];
export const TIER_NAME = [null, "Dangerous", "Deadly", "Lethal"];

export function hexRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
