import { makeRng } from "../core/util.js";
import { test } from "../core/rules.js";

// Coats of arms. Each realm gets a shield: a field (plain or divided), sometimes an ordinary
// (a band across the shield), and a charge (the emblem) picked from what the realm is: a crown for
// monarchies, an anchor for seafarers, a sun for sun cults, a tower for mountain holds... The rule
// of tincture is kept: metals (gold, silver) sit on colours and colours on metals.
// Shapes are SVG path data on a 100 x 120 shield, used both for the page (SVG) and the map (Path2D).

const METALS = [["Or", "#e2b53c"], ["Argent", "#eeeae0"]];
const COLOURS = [["Gules", "#a8262a"], ["Azure", "#2a4d94"], ["Vert", "#2d6e3a"], ["Sable", "#23201e"], ["Purpure", "#633680"], ["Tenné", "#b3622a"]];
export const SHIELD = "M4 4 H96 V58 C96 92 72 108 50 116 C28 108 4 92 4 58 Z";
const DIV = {
  plain: () => "",
  pale: () => "M50 0 H100 V120 H50 Z",
  fess: () => "M0 58 H100 V120 H0 Z",
  bend: () => "M0 0 L100 120 H0 Z",
  quarterly: () => "M50 0 H100 V58 H50 Z M0 58 H50 V120 H0 Z",
  chevron: () => "M0 120 L50 50 L100 120 Z",
  saltire: () => "M0 0 L50 58 L0 120 Z M100 0 L50 58 L100 120 Z",
};
const ORD = {
  none: null, fess: "M4 44 H96 V70 H4 Z", pale: "M38 4 H62 V116 H38 Z", bend: "M4 14 L14 4 L96 96 L86 106 Z",
  chief: "M4 4 H96 V34 H4 Z", cross: "M42 4 H58 V116 H42 Z M4 46 H96 V62 H4 Z", bordure: "M4 4 H96 V58 C96 92 72 108 50 116 C28 108 4 92 4 58 Z M12 12 V58 C12 86 32 100 50 107 C68 100 88 86 88 58 V12 Z",
};
// charges, centred near (50, 62), about 44 units across
export const CHARGES = {
  star: "M50 38 L56 55 L74 55 L60 66 L65 84 L50 73 L35 84 L40 66 L26 55 L44 55 Z",
  sun: "M50 44 A18 18 0 1 1 49.9 44 Z M50 32 L53 42 L47 42 Z M50 92 L47 82 L53 82 Z M20 62 L30 59 L30 65 Z M80 62 L70 65 L70 59 Z M29 41 L37 48 L33 52 Z M71 83 L63 76 L67 72 Z M71 41 L67 52 L63 48 Z M29 83 L33 72 L37 76 Z",
  crescent: "M60 40 A24 24 0 1 0 60 84 A18 18 0 1 1 60 40 Z",
  crown: "M28 78 L28 50 L39 62 L50 44 L61 62 L72 50 L72 78 Z M28 82 H72 V88 H28 Z",
  tower: "M34 88 V52 H38 V44 H44 V52 H48 V44 H52 V52 H56 V44 H62 V52 H66 V88 Z M46 88 V74 A4 4 0 0 1 54 74 V88 Z",
  mountain: "M22 86 L42 52 L50 62 L60 44 L80 86 Z",
  tree: "M47 90 V72 H53 V90 Z M50 34 L70 60 L60 60 L74 76 L26 76 L40 60 L30 60 Z",
  anchor: "M47 40 A5 5 0 1 1 53 40 V46 H60 V51 H53 V82 C60 81 66 76 68 70 L64 70 L71 62 L76 72 L72 72 C69 82 60 88 50 88 C40 88 31 82 28 72 L24 72 L29 62 L36 70 L32 70 C34 76 40 81 47 82 V51 H40 V46 H47 Z",
  sword: "M48 34 H52 V76 H48 Z M38 76 H62 V80 H38 Z M47 80 H53 V90 H47 Z M48 34 L50 28 L52 34 Z",
  key: "M50 36 A10 10 0 1 1 49.9 36 Z M47 54 H53 V90 H47 Z M53 78 H62 V83 H53 Z M53 86 H60 V90 H53 Z",
  wave: "M24 56 C32 48 40 64 50 56 C60 48 68 64 76 56 V64 C68 72 60 56 50 64 C40 72 32 56 24 64 Z M24 72 C32 64 40 80 50 72 C60 64 68 80 76 72 V80 C68 88 60 72 50 80 C40 88 32 72 24 80 Z",
  eye: "M22 62 C34 44 66 44 78 62 C66 80 34 80 22 62 Z M50 52 A10 10 0 1 0 50.1 52 Z",
  paw: "M50 62 C62 62 68 76 62 84 C56 88 44 88 38 84 C32 76 38 62 50 62 Z M34 58 A6 7 0 1 1 34.1 58 Z M44 48 A6 7 0 1 1 44.1 48 Z M56 48 A6 7 0 1 1 56.1 48 Z M66 58 A6 7 0 1 1 66.1 58 Z",
  horseshoe: "M34 86 V62 A16 16 0 0 1 66 62 V86 H58 V62 A8 8 0 0 0 42 62 V86 Z",
  book: "M26 50 C36 46 44 48 49 52 V86 C44 82 36 80 26 84 Z M74 50 C64 46 56 48 51 52 V86 C56 82 64 80 74 84 Z",
  cross: "M44 40 H56 V56 H72 V68 H56 V90 H44 V68 H28 V56 H44 Z",
  lozenge: "M50 38 L70 62 L50 86 L30 62 Z",
  roundels: "M36 52 A8 8 0 1 1 35.9 52 Z M64 52 A8 8 0 1 1 63.9 52 Z M50 74 A8 8 0 1 1 49.9 74 Z",
  flame: "M50 34 C62 50 70 60 64 76 C60 86 40 86 36 76 C32 66 40 58 44 48 C46 58 50 60 52 62 C54 54 52 44 50 34 Z",
};
// which charge suits a realm, by tag (first match wins, in this order of precedence)
const CHARGE_RULES = [
  ["faith:void", "eye"], ["faith:titan", "paw"], ["origin:titan_slayers", "sword"], ["beast_tamers", "paw"], ["faith:sun", "sun"], ["faith:stars", "star"],
  ["faith:ley", "eye"], ["gov:magocracy", "star"], ["faith:sea", "wave"], ["seafaring", "anchor"], ["gov:merchant", "key"], ["horse_lords", "horseshoe"],
  ["origin:mountain_hold", "tower"], ["mountain_folk", "mountain"], ["forest_folk", "tree"], ["scholarly", "book"], ["faith:one_god", "cross"],
  ["gov:theocracy", "cross"], ["gov:empire", "crown"], ["monarchy", "crown"], ["martial", "sword"], ["desert_wanderers", "crescent"], ["mercantile", "roundels"],
  ["gov:commune", "roundels"], ["origin:rebellion", "flame"],
];

const cache = new WeakMap();
export function armsOf(G, rid) {
  let byR = cache.get(G); if (!byR) cache.set(G, byR = new Map());
  if (byR.has(rid)) return byR.get(rid);
  const rng = makeRng(G.seed + "|arms|" + rid), tags = new Set(G.Y.realms[rid].tags);
  // the field is usually in a colour close to the realm's map colour
  const rgb = G.S.states[rid].rgb, near = COLOURS.map(c => { const h = c[1], r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16); return [c, (r - rgb[0]) ** 2 + (g - rgb[1]) ** 2 + (b - rgb[2]) ** 2]; }).sort((a, b) => a[1] - b[1]);
  const colour = rng.chance(0.7) ? near[0][0] : rng.pick(COLOURS), metal = rng.pick(METALS), colour2 = rng.pick(COLOURS.filter(c => c !== colour));
  const div = rng.chance(0.45) ? "plain" : rng.pick(Object.keys(DIV).filter(d => d !== "plain"));
  const ord = div === "plain" && rng.chance(0.45) ? rng.pick(["fess", "pale", "bend", "chief", "cross", "bordure"]) : "none";
  const candidates = CHARGE_RULES.filter(([t]) => test(t, tags)).map(e => e[1]);
  const charge = candidates.length ? (rng.chance(0.75) ? candidates[0] : rng.pick(candidates)) : rng.pick(["star", "lozenge", "roundels", "crescent", "tower"]);
  // field colour and metal alternate so that the charge always stands out
  const fieldIsMetal = div === "plain" && rng.chance(0.25);
  const a = { field: fieldIsMetal ? metal : colour, second: div === "plain" ? null : fieldIsMetal ? colour : metal, ord, ordT: fieldIsMetal ? colour2 : metal, div, charge, chargeT: fieldIsMetal ? colour : ord !== "none" ? colour2 : metal };
  if (a.second && a.chargeT === a.second) a.chargeT = a.second === metal ? colour2 : metal;
  a.blazon = blazon(a);
  byR.set(rid, a);
  return a;
}
function blazon(a) {
  const f = a.div === "plain" ? a.field[0] : `Per ${a.div === "quarterly" ? "quarterly" : a.div} ${a.field[0]} and ${a.second[0]}`;
  const o = a.ord !== "none" ? `, a ${a.ord} ${a.ordT[0]}` : "";
  return `${f}${o}, a ${a.charge} ${a.chargeT[0]}`;
}
export function armsSvg(a, size = 40) {
  const h = Math.round(size * 1.2);
  return `<svg class="arms" width="${size}" height="${h}" viewBox="0 0 100 120" aria-label="${a.blazon}" role="img"><title>${a.blazon}</title>
    <clipPath id="sh${size}${a.charge}${a.div}"><path d="${SHIELD}"/></clipPath>
    <g clip-path="url(#sh${size}${a.charge}${a.div})"><rect width="100" height="120" fill="${a.field[1]}"/>${a.second ? `<path d="${DIV[a.div]()}" fill="${a.second[1]}"/>` : ""}
    ${ORD[a.ord] ? `<path d="${ORD[a.ord]}" fill="${a.ordT[1]}" fill-rule="evenodd"/>` : ""}<path d="${CHARGES[a.charge]}" fill="${a.chargeT[1]}" stroke="rgba(0,0,0,.35)" stroke-width="1.2" fill-rule="evenodd"/></g>
    <path d="${SHIELD}" fill="none" stroke="#1d1712" stroke-width="4"/></svg>`;
}
// draw on a canvas, centred at (x, y), `w` pixels wide
const pathCache = new Map();
const P2 = d => { let p = pathCache.get(d); if (!p) pathCache.set(d, p = new Path2D(d)); return p; };
export function drawArms(ctx, a, x, y, w) {
  const s = w / 100;
  ctx.save(); ctx.translate(x - w / 2, y - w * 0.6); ctx.scale(s, s);
  ctx.save(); ctx.clip(P2(SHIELD));
  ctx.fillStyle = a.field[1]; ctx.fillRect(0, 0, 100, 120);
  if (a.second) { ctx.fillStyle = a.second[1]; ctx.fill(P2(DIV[a.div]())); }
  if (ORD[a.ord]) { ctx.fillStyle = a.ordT[1]; ctx.fill(P2(ORD[a.ord]), "evenodd"); }
  ctx.fillStyle = a.chargeT[1]; ctx.fill(P2(CHARGES[a.charge]), "evenodd");
  ctx.restore();
  ctx.lineWidth = 5; ctx.strokeStyle = "#1d1712"; ctx.stroke(P2(SHIELD));
  ctx.restore();
}
