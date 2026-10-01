import { BIOMES, hexRgb } from "../core/tables.js";
import { GROUND, GR, CHUNK } from "../gen/region.js";
import { TT, T_ } from "../gen/city.js";
import { ARCH } from "../gen/archstyles.js";

// Pixel renderer for the zoomed-in levels. Each tile becomes one pixel of an offscreen image,
// which is drawn scaled up with smoothing off, so the maps read as blocky pixel art.

const hash = (i, j, s = 0) => { let h = (i * 374761393 + j * 668265263 + s * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const mul = (c, f) => [c[0] * f, c[1] * f, c[2] * f];
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const pack = c => (0xFF000000 | (Math.max(0, Math.min(255, c[2])) << 16) | (Math.max(0, Math.min(255, c[1])) << 8) | Math.max(0, Math.min(255, c[0]))) >>> 0;
const H = h => hexRgb(h);

const REGION_COL = {
  deep: H("#2b5673"), sea: H("#4a86a4"), lake: H("#5b95b5"), river: H("#4f8fbf"), beach: H("#dccb96"), rock: H("#8b8478"),
  snow: H("#eef2f3"), track: H("#9a7b4c"), road: H("#5e4a36"), wall: H("#46413c"), marsh: H("#6d7a55"), bridge: H("#7a5a3a"),
};
const SEA_SHALLOW = H("#8fbccd"), SEA_DEEP = H("#234c68");
const FIELDS = [H("#c9b765"), H("#a9b85d"), H("#b89d5a"), H("#9fae62"), H("#d1c17a")];
const ROOFS_REGION = [H("#a3563e"), H("#8a6a55"), H("#6f6a66"), H("#b56a4a")];

export function chunkImage(r) {
  const { ground, biome, elev, owner } = r, w = CHUNK, h = CHUNK;
  const img = new ImageData(w, h), buf = new Uint32Array(img.data.buffer);
  const bcol = BIOMES.map(b => H(b.c));
  // patterns are laid out in metres from the world origin, so every detail level (and every
  // chunk) agrees on where field strips, hedges and tree crowns are
  const tm = (r.tileKm || 0.1) * 1000, I0 = r.cx * w, J0 = r.cy * h, fine = tm < 50, finest = tm < 10;
  const shadeK = 18 * Math.min(4, 100 / tm);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i, g = GROUND[ground[k]].k, I = I0 + i, J = J0 + j, mx = I * tm, my = J * tm, d = hash(I, J), dv = 0.98 + d * 0.04;
    let c;
    if (g === "land") c = mix(bcol[biome[k]], [236, 228, 200], 0.14 + (fine ? (hash(Math.floor(mx / 12), Math.floor(my / 12), 31) - 0.5) * 0.08 : 0));
    else if (g === "forest") {
      // tree crowns at ~6 m once tiles are small enough to show them
      const crown = finest ? hash(Math.floor(mx / 6), Math.floor(my / 6), 7) : hash(I, J, 7);
      c = mul(bcol[biome[k]], crown < 0.18 ? 0.6 : crown > 0.8 ? 0.82 : 0.72);
    } else if (g === "farm") {
      // strips about 500 by 400 m, each its own crop; hedges on the strip edges and plough lines inside
      // blocks about 500 x 400 m, each split into two to four parcels of its own crop
      const u = mx + my * 0.35, vv = my - mx * 0.35, fx = Math.floor(u / 500), fy = Math.floor(vv / 400);
      const parts = 2 + Math.floor(hash(fx, fy, 4) * 3), eu = u - fx * 500, ev = vv - fy * 400, sub = Math.floor(eu / (500 / parts));
      c = FIELDS[Math.floor(hash(fx * 5 + sub, fy, 3) * FIELDS.length)];
      if (finest) {
        const es = eu - sub * (500 / parts), edge = Math.min(es, 500 / parts - es, ev, 400 - ev);
        if (edge < tm * 0.6) c = mul(bcol[biome[k]], 0.7);                                // hedgerow or field edge
        else if (Math.floor(u / 3) % 2 === 0) c = mul(c, 0.94);                           // furrows
      }
    }
    else if (g === "urban") c = ROOFS_REGION[Math.floor(hash(fine ? Math.floor(mx / 10) : I, fine ? Math.floor(my / 10) : J, 11) * ROOFS_REGION.length)];
    else if (g === "marsh") c = hash(fine ? Math.floor(mx / 20) : I, fine ? Math.floor(my / 20) : J, 5) < 0.3 ? REGION_COL.lake : REGION_COL.marsh;
    else c = REGION_COL[g];
    // hillshade from the height difference to the tiles above and to the left (light from the north-west)
    if (g !== "deep" && g !== "sea" && g !== "lake" && g !== "river") {
      const eL = i > 0 ? elev[k - 1] : elev[k], eU = j > 0 ? elev[k - w] : elev[k];
      c = mul(c, Math.max(0.72, Math.min(1.25, 1 + ((eL - elev[k]) + (eU - elev[k])) * shadeK)));
    } else if (g === "deep" || g === "sea") c = mix(SEA_SHALLOW, SEA_DEEP, Math.max(0, Math.min(1, 0.12 - elev[k] * 2.2))); // same ramp as the world map
    c = mul(c, dv);
    // province borders: darken land tiles whose right or lower neighbour belongs to another province
    if (owner[k] >= 0 && ((i < w - 1 && owner[k + 1] >= 0 && owner[k + 1] !== owner[k]) || (j < h - 1 && owner[k + w] >= 0 && owner[k + w] !== owner[k]))) c = mul(c, 0.72);
    buf[k] = pack(c);
  }
  return img;
}

const TOWN_COL = {
  deep: H("#2f5f80"), water: H("#4d88a6"), road: H("#a08462"), street: H("#8e8a82"), plaza: H("#b3a891"), wall: H("#5b5650"),
  tower: H("#46423d"), gate: H("#6b5a45"), bridge: H("#8a6a45"), dock: H("#7a5e3e"), sand: H("#d9c690"), rock: H("#8a857d"),
  snow: H("#eef1f3"), yard: H("#b8ad98"), palisade: H("#6e5236"), cemetery: H("#7e9468"),
};
const STALLS = [H("#c9463d"), H("#e0b33c"), H("#3d7cc9"), H("#e8e1d0")];
// roof colours come from the town's architecture style kit
export const roofsFor = style => Object.fromEntries(Object.entries((ARCH[style] || ARCH.timber).roofs).map(([k, v]) => [k, v.map(H)]));

// one chunk of a town: every tile coloured by type; buildings by kind in the town's style, with
// the roof shading worked out by the generator (lit edge, shaded edge, ridge) in each building's own frame
export function townChunkImage(c) {
  const { T, tile, lot, shade, lots, summary } = c, st = summary.profile.style;
  const kit = ARCH[st] || ARCH.timber, roofs = roofsFor(st), flat = kit.roof === "flat";
  const img = new ImageData(T, T), buf = new Uint32Array(img.data.buffer);
  const grass = mix(H(BIOMES.find(b => b.k === summary.biome)?.c || "#8fae62"), [150, 180, 100], 0.35);
  const lotCol = lots.map(l => { const p = roofs[l.kind] || roofs.house; return p[Math.floor(hash(l.id % 100003, l.id % 7919, 9) * p.length)]; });
  const F = [1, 1.12, 0.72, 0.86];
  // world-anchored pattern coordinates, so textures line up between chunks and levels
  const gx = Math.round((c.x0 - c.cx) / c.tw), gy = Math.round((c.y0 - c.cy) / c.tw);
  // large patterns (field strips) are laid out in 2 m units whatever the tile size
  const ms = c.tsz / 2;
  for (let j = 0; j < T; j++) for (let i = 0; i < T; i++) {
    const k = j * T + i, tk = TT[tile[k]].k, I = gx + i, J = gy + j, d = hash(I, J), dv = (ms < 1 ? 0.975 : 0.95) + d * (ms < 1 ? 0.05 : 0.1), I2 = Math.floor(I * ms), J2 = Math.floor(J * ms);
    let col;
    if (tk === "grass") col = mul(grass, 0.97 + hash(I, J, 2) * 0.06);
    else if (tk === "garden") col = mul(grass, hash(I2, J2, 4) < 0.2 ? 0.86 : 1.08);
    else if (tk === "tree") col = mul(grass, hash(I, J, 6) < 0.5 ? 0.55 : 0.68);
    else if (tk === "park") col = mul(grass, hash(I, J, 12) < 0.12 ? 0.6 : 1.18);
    else if (tk === "green") col = mul(grass, 1.22);
    else if (tk === "cemetery") col = hash(I, J, 13) < 0.1 ? [150, 150, 146] : TOWN_COL.cemetery;
    else if (tk === "field") { const band = Math.floor((I2 * 0.8 + J2 * 0.6) / 4); col = FIELDS[Math.floor(hash(band, Math.floor((J2 * 0.8 - I2 * 0.6) / 18), 1) * FIELDS.length)]; }
    else if (tk === "stall") col = STALLS[Math.floor(hash(I2, J2, 8) * STALLS.length)];
    else if ((tk === "street" || tk === "plaza") && ms < 1) col = mul(TOWN_COL[tk], 0.95 + hash(I, J, 21) * 0.08); // cobbles
    else if (tk === "building") col = mul(lotCol[lot[k]], flat && shade[k] === 1 ? 0.8 : F[shade[k]]);
    else if (tk === "wall" || tk === "tower" || tk === "palisade") { col = TOWN_COL[tk]; if (j > 0 && TT[tile[k - T]].k !== tk) col = mul(col, 1.25); }
    else col = TOWN_COL[tk];
    buf[k] = pack(mul(col, dv));
  }
  return img;
}

export const regionGroundName = g => GROUND[g].n;
export const townTileName = t => TT[t].n;
export { GR, T_ };

const css = c => `rgb(${c.map(v => Math.round(v)).join(",")})`;
export function regionLegend() {
  return [
    ["Open land (coloured by biome)", "#a8b56c"], ["Forest", "#4c6a4f"], ["Farmland", css(FIELDS[0])], ["Settlement", css(ROOFS_REGION[0])],
    ["Town wall", css(REGION_COL.wall)], ["Road", css(REGION_COL.road)], ["Track", css(REGION_COL.track)], ["Bridge", css(REGION_COL.bridge)],
    ["River", css(REGION_COL.river)], ["Lake", css(REGION_COL.lake)], ["Coastal waters", css(REGION_COL.sea)], ["Beach", css(REGION_COL.beach)],
    ["Marsh", css(REGION_COL.marsh)], ["Bare rock", css(REGION_COL.rock)], ["Snow and ice", css(REGION_COL.snow)], ["Province border", "#55504a"],
  ];
}
export function townLegend(t) {
  const r = roofsFor(t.profile.style);
  return [
    ["Houses", css(r.house[0])], ["Townhouses", css(r.rich[0])], ["Workshops", css(r.workshop[0])], ["Warehouses", css(r.warehouse[0])],
    ["Temple", css(r.temple[0])], ["Town hall", css(r.hall[0])], ["Keep", css(r.keep[0])], ["Cottages", css(r.shack[0])], ["Farmhouses and barns", css(r.farm[0])],
    ["Street", css(TOWN_COL.street)], ["Road", css(TOWN_COL.road)], ["Square", css(TOWN_COL.plaza)], ["Courtyard", css(TOWN_COL.yard)],
    ["Town wall", css(TOWN_COL.wall)], ["Palisade", css(TOWN_COL.palisade)], ["Gate", css(TOWN_COL.gate)], ["Bridge", css(TOWN_COL.bridge)],
    ["Dock", css(TOWN_COL.dock)], ["Cemetery", css(TOWN_COL.cemetery)], ["Water", css(TOWN_COL.water)],
  ];
}
