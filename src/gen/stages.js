// Stage list and the stage each setting feeds into. Kept dependency-free so the
// main thread can import it without pulling in the generators.
export const STAGES = [
  { key: "mesh", label: "Scattering the land grid" },
  { key: "terrain", label: "Raising continents and colliding plates" },
  { key: "climate", label: "Turning the winds and carving rivers" },
  { key: "regions", label: "Surveying provinces and naming the land" },
  { key: "premise", label: "Deciding what lies beneath the world" },
  { key: "states", label: "Drawing the borders of realms" },
  { key: "features", label: "Releasing the beasts" },
  { key: "settlements", label: "Founding towns and laying roads" },
  { key: "society", label: "Raising peoples, faiths and crowns" },
  { key: "lore", label: "Burying secrets and scattering the old texts" },
  { key: "trade", label: "Opening markets and trade routes" },
  { key: "conflict", label: "Marching armies to the fronts" },
  { key: "ecology", label: "Cataloguing plants and beasts" },
];

export const PARAM_STAGE = {
  seed: 0, provinces: 0, land: 0, genre: 4, premise: 4,
  continents: 1, sizeVariety: 1, shapeStyle: 1, peninsulas: 1, islands: 1, seas: 1, mountains: 1, plateaus: 1,
  climate: 2, moisture: 2,
  states: 5,
  wildlife: 6, magic: 6,
  conflict: 11,
};
