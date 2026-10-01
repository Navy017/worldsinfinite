import { BIOMES } from "../core/tables.js";
import { makeRng } from "../core/util.js";
import { compose } from "../core/text.js";
import { FLORA, FAUNA, ZONE_TEXT, SEASON_TEXT } from "../content/ecology.js";
import { MARINE, MARINE_FLORA, MARINE_FAUNA, LOOK, SEA_MONSTERS } from "../content/wildlife.js";
import { LOOKUP } from "../content/lookup.js";

// The page for one ecological zone: a description written from the ecology library's templates,
// then its plants and animals (picked by the ecology stage), its monsters, titans and strange
// places, and how the seasons pass there.

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const FL = Object.fromEntries([...FLORA, ...MARINE_FLORA].map(x => [x.id, x])), FA = LOOKUP.fauna;
const MON = Object.fromEntries(SEA_MONSTERS.map(m => [m.id, m]));
const GROUP = { herd: "Lives in herds", pack: "Hunts in packs", flock: "Flies in flocks", solo: "Solitary", school: "Swims in schools", pod: "Travels in pods", swarm: "Swarms", pair: "Lives in pairs" };
// one card for an animal group seen on the map
export function animalPage(gr) {
  const f = gr.f, l = gr.look;
  return `<p>${esc(f.d || "")}</p><dl class="kv"><dt>Kind</dt><dd>${esc(KIND[f.kind] || f.kind || "Creature")}</dd><dt>Size</dt><dd class="num">${l.size} m</dd>
    <dt>This group</dt><dd class="num">${gr.size}</dd><dt>Habits</dt><dd>${GROUP[l.move] || ""}${l.active && l.active !== "any" ? `, active by ${l.active}` : ""}</dd>
    ${f.danger != null ? `<dt>Danger</dt><dd class="${f.danger >= 2 ? "danger" : ""}">${DANGER[f.danger]}</dd>` : ""}<dt>Lives in</dt><dd>${esc(gr.zone.z.name)}</dd></dl>`;
}
// the page for a marine zone
export function marinePage(G, zid) {
  const z = G.E.marine.zones[zid], m = MARINE[z.key] || { n: z.key, d: "", text: [] }, rng = makeRng(G.seed + "|mzonepage|" + zid);
  const flora = z.flora.map(id => FL[id]).filter(Boolean), fauna = z.fauna.map(id => FA[id]).filter(Boolean);
  const fish = fauna.find(x => x.kind === "fish"), beast = fauna.find(x => x.kind === "marine" || x.kind === "beast"), bird = fauna.find(x => x.kind === "bird");
  const slots = { zone: z.name, fish: fish && fish.n, beast: beast && beast.n, plant: flora[0] && flora[0].n, bird: bird && bird.n, season: rng.pick(["spring", "summer", "autumn", "winter"]) };
  const intro = compose(rng, m.text || [], new Set(), slots, 2);
  const card = x => `<div><small>${esc(KIND[x.kind] || x.kind)}${x.rare ? " · rare" : ""}${x.magic ? " · strange" : ""}</small><b>${esc(x.n)}</b>${esc(x.d)}${x.danger > 0 ? `<br><span class="${x.danger >= 2 ? "danger" : ""}">${DANGER[x.danger]}</span>` : ""}</div>`;
  const mon = z.monster && MON[z.monster.id];
  return `<p class="lead">${esc(m.n)}: ${esc(m.d)}</p>` + intro.map(p => `<p>${esc(p)}</p>`).join("") +
    `<dl class="kv"><dt>Extent</dt><dd>${z.area.toLocaleString("en-US")} km²</dd><dt>Water</dt><dd>${z.temp < 2 ? "Icy" : z.temp < 12 ? "Cold" : z.temp < 20 ? "Temperate" : "Warm"}, ${z.depth < 0.15 ? "shallow" : z.depth < 0.5 ? "deep" : "very deep"}</dd></dl>` +
    (mon ? `<h4>Monster waters</h4><div class="tags"><div class="tag t-danger"><b>${esc(mon.n)}</b>${esc(mon.d)} Ships give these waters a wide berth.</div></div>` : "") +
    (fauna.length ? `<h4>Sea life</h4><div class="species">${fauna.map(card).join("")}</div>` : "") +
    (flora.length ? `<h4>Plants and reefs</h4><div class="species">${flora.map(card).join("")}</div>` : "");
}
const DANGER = ["Harmless", "Dangerous if provoked", "Dangerous", "Lethal"];
const KIND = { tree: "Tree", shrub: "Shrub", grass: "Grass", flower: "Flower", fungus: "Fungus", moss: "Moss", aquatic: "Water plant", crop: "Crop", vine: "Vine", cactus: "Cactus",
  coral: "Coral", kelp: "Kelp", plankton: "Plankton", seagrass: "Seagrass", algae: "Algae", invertebrate: "Invertebrate",
  grazer: "Grazer", predator: "Predator", small: "Small animal", bird: "Bird", raptor: "Bird of prey", fish: "Fish", insect: "Insect", reptile: "Reptile", amphibian: "Amphibian", marine: "Sea creature", beast: "Great beast" };

export function zonePage(G, zid) {
  const z = G.E.zones[zid], bk = BIOMES[z.biome].k, rng = makeRng(G.seed + "|zonepage|" + zid);
  const flora = z.flora.map(id => FL[id]).filter(Boolean), fauna = z.fauna.map(id => FA[id]).filter(Boolean);
  const of = (list, kinds) => list.find(x => kinds.includes(x.kind));
  const tree = of(flora, ["tree", "cactus", "grass", "shrub"]) || flora[0], plant = flora.find(x => x !== tree);
  const grazer = of(fauna, ["grazer", "small", "fish", "marine"]), predator = of(fauna, ["predator", "raptor", "beast"]), bird = of(fauna, ["bird", "raptor"]);
  const t = z.temp, m = z.moist;
  const climate = `${t < -2 ? "bitterly cold" : t < 6 ? "cold" : t < 14 ? "cool" : t < 22 ? "mild" : t < 27 ? "warm" : "hot"} and ${m < 0.25 ? "dry" : m < 0.45 ? "fairly dry" : m < 0.65 ? "moderately wet" : "wet"}`;
  const season = rng.pick(["spring", "summer", "autumn", "winter"]);
  const slots = { zone: z.name, land: G.R.masses[G.R.provs.find(p => G.E.zoneOf[p.id] === zid)?.mass ?? 0]?.name || null, tree: tree && tree.n, plant: plant && plant.n, grazer: grazer && grazer.n, predator: predator && predator.n, bird: bird && bird.n, season, climate };
  const intro = compose(rng, ZONE_TEXT[bk] || [], new Set(), slots, 2);
  if (z.coastal > 0.3 && ZONE_TEXT.coast) intro.push(...compose(rng, ZONE_TEXT.coast, new Set(), slots, 1));
  const seasons = ["spring", "summer", "autumn", "winter"].map(s => [s, compose(rng, (SEASON_TEXT || {})[s] || [], new Set(), { ...slots, season: s }, 1)[0]]).filter(e => e[1]);
  const card = x => `<div><small>${esc(KIND[x.kind] || x.kind)}${x.rare ? " · rare" : ""}${x.magic ? " · strange" : ""}</small><b>${esc(x.n)}</b>${esc(x.d)}${x.uses ? `<br><small>Used for ${esc(x.uses)}</small>` : ""}${x.danger != null && x.danger > 0 ? `<br><span class="${x.danger >= 2 ? "danger" : ""}">${DANGER[x.danger]}</span>` : ""}</div>`;
  const rain = Math.round((Math.pow(Math.max(0, m), 1.3) * 3200 + 80) / 10) * 10;
  return intro.map(p => `<p>${esc(p)}</p>`).join("") +
    `<dl class="kv"><dt>Biome</dt><dd>${esc(BIOMES[z.biome].n)}</dd><dt>Climate</dt><dd>${esc(climate)}, about ${Math.round(t)} °C on average, ${rain.toLocaleString("en-US")} mm of rain a year</dd>
     <dt>Extent</dt><dd>${z.provs} provinces, ${z.area.toLocaleString("en-US")} km²</dd>${z.coastal > 0.3 ? "<dt>Coast</dt><dd>Much of it borders the sea</dd>" : ""}${z.rivers > 0.3 ? "<dt>Rivers</dt><dd>Well watered by rivers</dd>" : ""}</dl>` +
    `<h4>Plants</h4><div class="species">${flora.map(card).join("")}</div>` +
    `<h4>Animals</h4><div class="species">${fauna.map(card).join("")}</div>` +
    (z.hostile.length || z.titans.length ? `<h4>Monsters</h4><div class="tags">${z.hostile.map(h => `<div class="tag t-danger"><b>${esc(h)}</b>Hunt in packs across part of this zone.</div>`).join("")}${z.titans.map(n => `<div class="tag t-titan"><b>${esc(n)}</b>A titan walks here.</div>`).join("")}</div>` : "") +
    (z.special.length ? `<h4>Strange growth</h4><div class="tags">${z.special.map(n => `<div class="tag t-wood"><b>${esc(n)}</b></div>`).join("")}</div>` : "") +
    (z.sites.length ? `<h4>Places of mystery</h4><div class="tags">${z.sites.map(n => `<div class="tag t-myst"><b>${esc(n)}</b></div>`).join("")}</div>` : "") +
    (seasons.length ? `<h4>The year here</h4><dl class="kv">${seasons.map(([s, x]) => `<dt>${s[0].toUpperCase() + s.slice(1)}</dt><dd>${esc(x)}</dd>`).join("")}</dl>` : "");
}
