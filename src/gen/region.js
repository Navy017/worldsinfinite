import { clamp, makeRng, Heap } from "../core/util.js";
import { BIOMES, B } from "../core/tables.js";
import { FERTILITY, TIERS, urbanRadiusKm } from "./settlements.js";
import { localContext, riverWidthKm, RIVER_MEANDER, ROAD_MEANDER } from "./local.js";
import { forCellsInRect } from "./lookup.js";
import { townProfile } from "./townprofile.js";

// Region level: the land at ~100 m per tile, generated in 128x128-tile chunks on a single global
// grid, so chunks tile seamlessly and the map can be explored in any direction. Everything in a
// chunk is a function of world coordinates plus per-province data (villages, tracks) that is
// computed once as world-space geometry, so it continues unbroken across chunk edges.

export const GROUND = [
  { k: "deep", n: "Open sea" }, { k: "sea", n: "Coastal waters" }, { k: "lake", n: "Lake" }, { k: "river", n: "River" },
  { k: "beach", n: "Beach" }, { k: "land", n: "Open land" }, { k: "forest", n: "Forest" }, { k: "rock", n: "Bare rock" },
  { k: "snow", n: "Snow and ice" }, { k: "farm", n: "Farmland" }, { k: "track", n: "Track" }, { k: "road", n: "Road" },
  { k: "urban", n: "Settlement" }, { k: "wall", n: "Town wall" }, { k: "marsh", n: "Marsh" }, { k: "bridge", n: "Bridge" },
];
export const GR = Object.fromEntries(GROUND.map((g, i) => [g.k, i]));
const WATER = new Set([GR.deep, GR.sea, GR.lake, GR.river]);
export const CHUNK = 128, TILE_KM = 0.1;
// land detail levels: 0 = 100 m tiles, 1 = 25 m, 2 = 6.25 m, 3 = 1.6 m; the same world functions at each,
// so finer levels only add detail (field strips, hedges, lanes, narrow roads)
export const LAND_LEVELS = 4;
export const levelTileKm = level => TILE_KM / Math.pow(4, level);

// forest cover by biome: lower threshold = more forest (the noise is roughly -0.6..0.6)
const FOREST_THR = { rainforest: -0.3, temprain: -0.2, mangrove: -0.15, boreal: -0.08, tempforest: 0.02, dryforest: 0.08 };

// Base terrain at one world point: ground class, biome, elevation and owning province.
export function classifyTerrain(L, wx, wy, out, resKm = TILE_KM) {
  const land = L.landAt(wx, wy, out, resKm);
  if (land < 0.5) {
    out.g = out.lake > (1 - out.land) * 0.5 ? GR.lake : out.land + L.coastSmooth(wx, wy) < 0.18 ? GR.deep : GR.sea;
    out.biome = 255; out.owner = -1; out.elev = out.e;
    return out;
  }
  const { C, R } = L.G;
  const oc = L.ownerCell(wx, wy);
  const b = oc >= 0 ? C.biome[oc] : B.grass, bk = BIOMES[b].k;
  out.owner = oc >= 0 ? R.owner[oc] : -1; out.biome = b;
  const rough = 0.04 + 0.33 * clamp((out.e - 0.2) / 0.5, 0, 1);
  const e = Math.max(0.005, out.e + L.detail(wx, wy) * rough);
  out.elev = e;
  const rn = L.rockNoise(wx, wy);
  let g = GR.land;
  if (bk === "glacier" || bk === "peaks" || e > 0.8 + rn * 0.05) g = GR.snow;
  else if (e > 0.56 + rn * 0.1 || (bk === "alpine" && rn > 0.15)) g = GR.rock;
  else if ((bk === "swamp" || bk === "mangrove") && rn > -0.1) g = GR.marsh;
  // shores: cliffs and rock on rugged coasts, beaches on low smooth ones
  else if (land < 0.57 && out.rug > 0.62) g = GR.rock;
  else if (land < 0.6 && e < 0.08 && out.rug < 0.55 && bk !== "tundra" && bk !== "boreal") g = GR.beach;
  else {
    const fn = L.forestNoise(wx, wy), thr = FOREST_THR[bk];
    if (thr !== undefined ? fn > thr : fn > 0.38) g = GR.forest;
  }
  out.g = g;
  return out;
}

// Every settlement of a province: the main one from the world stage plus villages and hamlets.
// Deterministic per (seed, province), so every view of the province agrees.
const villageCache = new WeakMap();
export function provinceSettlements(G, p) {
  let byProv = villageCache.get(G); if (!byProv) villageCache.set(G, byProv = new Map());
  if (byProv.has(p)) return byProv.get(p);
  const L = localContext(G), { M, C, R, F, X } = G, pr = R.provs[p], rng = makeRng(G.seed + "|villages|" + p);
  const main = X.settlements[X.mainOf[p]], list = [main];
  const areaKm2 = pr.size * M.cellArea * L.kmPx * L.kmPx;
  let fert = (FERTILITY[BIOMES[pr.biome].k] ?? 0.3) + (pr.rivers.length ? 0.2 : 0);
  if (F.titan[p] >= 0) fert *= 0.3;
  if (F.hostile[p] >= 0) fert *= 1 - 0.2 * F.hostRegions[F.hostile[p]].tier;
  const want = clamp(Math.round(areaKm2 * fert / 180 * rng.range(0.7, 1.3)), 0, 90);
  const lang = R.masses[pr.mass].lang, out = {};
  for (let t = 0; t < want * 14 && list.length - 1 < want; t++) {
    const c = pr.cells[rng.int(0, pr.cells.length - 1)];
    const px = M.x[c] + (rng.f() - 0.5) * M.sx, py = M.y[c] + (rng.f() - 0.5) * M.sy;
    const oc = L.ownerCell(px, py); if (oc < 0 || R.owner[oc] !== p) continue;
    if (L.landAt(px, py, out, TILE_KM) < 0.56 || out.e > 0.5) continue;
    if (!rng.chance(C.river[c] ? 0.9 : 0.45)) continue;
    if (list.some(s => Math.hypot(s.x - px, s.y - py) * L.kmPx < 3.5)) continue;
    const tier = rng.chance(0.3) ? 1 : 0, [lo, hi] = TIERS[tier].pop;
    list.push({ id: p * 100 + list.length, prov: p, x: px, y: py, tier, pop: Math.round(Math.exp(rng.range(Math.log(lo), Math.log(hi)))), walled: false, port: false, name: lang.word(rng, null), capital: false });
  }
  byProv.set(p, list);
  return list;
}

// Tracks from each village to the road network, as world-space polylines. Routed once per province
// on a coarse 800 m grid using the same terrain the chunks show, so chunks just draw the lines.
const trackCache = new WeakMap();
export function provinceTracks(G, p) {
  let byProv = trackCache.get(G); if (!byProv) trackCache.set(G, byProv = new Map());
  if (byProv.has(p)) return byProv.get(p);
  const L = localContext(G), { M, R, X, C } = G, pr = R.provs[p], setts = provinceSettlements(G, p);
  const cs = 0.8 / L.kmPx; // coarse cell size in world units
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of pr.cells) { x0 = Math.min(x0, M.x[c]); y0 = Math.min(y0, M.y[c]); x1 = Math.max(x1, M.x[c]); y1 = Math.max(y1, M.y[c]); }
  const mg = M.s * 1.2; x0 -= mg; y0 -= mg; x1 += mg; y1 += mg;
  const w = Math.ceil((x1 - x0) / cs), h = Math.ceil((y1 - y0) / cs), n = w * h;
  const cost = new Float32Array(n), goal = new Uint8Array(n), out = {};
  const COST = { [GR.land]: 1, [GR.beach]: 1.2, [GR.forest]: 2, [GR.marsh]: 4, [GR.rock]: 5, [GR.snow]: 8 };
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    classifyTerrain(L, x0 + (i + 0.5) * cs, y0 + (j + 0.5) * cs, out);
    cost[j * w + i] = WATER.has(out.g) ? Infinity : (COST[out.g] || 1) + out.elev * 3;
  }
  const cellOf = (wx, wy) => { const i = Math.floor((wx - x0) / cs), j = Math.floor((wy - y0) / cs); return i >= 0 && j >= 0 && i < w && j < h ? j * w + i : -1; };
  L.traceSegs(C.riverSegs, C.riverCount, [x0, y0, x1, y1], cs * 0.5, () => 0, RIVER_MEANDER.km, RIVER_MEANDER.amp, (px, py) => { const k = cellOf(px, py); if (k >= 0 && cost[k] !== Infinity) cost[k] += 10; });
  // where exactly each goal cell's road (or track, or town) is, so tracks end on it, not near it
  const exact = new Map();
  L.traceSegs(X.roadSegs, X.roadCount, [x0, y0, x1, y1], cs * 0.25, () => 0, ROAD_MEANDER.km, ROAD_MEANDER.amp, (px, py) => {
    const k = cellOf(px, py); if (k < 0) return;
    goal[k] = 1; cost[k] = 0.3;
    const cx0 = x0 + (k % w + 0.5) * cs, cy0 = y0 + (((k / w) | 0) + 0.5) * cs, e = exact.get(k);
    if (!e || (px - cx0) ** 2 + (py - cy0) ** 2 < (e[0] - cx0) ** 2 + (e[1] - cy0) ** 2) exact.set(k, [px, py]);
  });
  const mainK = cellOf(setts[0].x, setts[0].y); if (mainK >= 0) { goal[mainK] = 1; exact.set(mainK, [setts[0].x, setts[0].y]); }
  const lines = [], dist = new Float64Array(n), prev = new Int32Array(n), seen = new Int32Array(n); // Float64 so queue keys compare exactly
  const DI = [1, -1, 0, 0, 1, 1, -1, -1], DJ = [0, 0, 1, -1, 1, -1, 1, -1];
  let visit = 0;
  // closest villages first, so later ones can join the tracks of earlier ones
  const m0 = setts[0], order = setts.slice(1).sort((a, b) => Math.hypot(a.x - m0.x, a.y - m0.y) - Math.hypot(b.x - m0.x, b.y - m0.y));
  for (const s of order) {
    const start = cellOf(s.x, s.y); if (start < 0 || goal[start]) continue;
    visit++;
    const hp = new Heap(); dist[start] = 0; prev[start] = -1; seen[start] = visit; hp.push(start, 0);
    let end = -1, expanded = 0;
    while (hp.size && expanded < 40000) {
      const c = hp.pop(), dc = hp.lk; if (dc > dist[c]) continue;
      if (goal[c] && c !== start) { end = c; break; }
      expanded++;
      const ci = c % w, cj = (c / w) | 0;
      for (let d = 0; d < 8; d++) {
        const i2 = ci + DI[d], j2 = cj + DJ[d];
        if (i2 < 0 || j2 < 0 || i2 >= w || j2 >= h) continue;
        const nk = j2 * w + i2; if (cost[nk] === Infinity) continue;
        const nd = dc + cost[nk] * (d < 4 ? 1 : 1.414);
        if (seen[nk] !== visit || nd < dist[nk]) { seen[nk] = visit; dist[nk] = nd; prev[nk] = c; hp.push(nk, nd); }
      }
    }
    if (end < 0) continue;
    const at = c => [x0 + (c % w + 0.5) * cs, y0 + (((c / w) | 0) + 0.5) * cs];
    const pts = [exact.get(end) || at(end)];
    for (let c = prev[end]; c >= 0 && c !== start; c = prev[c]) { goal[c] = 1; if (!exact.has(c)) exact.set(c, at(c)); pts.push(at(c)); }
    pts.push([s.x, s.y]);
    // one round of corner cutting so tracks curve instead of zig-zagging
    const smooth = [pts[0]];
    for (let q = 0; q < pts.length - 1; q++) {
      const [ax, ay] = pts[q], [bx, by] = pts[q + 1];
      smooth.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    smooth.push(pts[pts.length - 1]);
    lines.push(smooth);
  }
  byProv.set(p, lines);
  return lines;
}

// One chunk of the global region grid. (cx, cy) are chunk coordinates; global tile (I, J)
// covers world [I*tw, (I+1)*tw) x [J*tw, (J+1)*tw).
export function genChunk(G, cx, cy, level = 0) {
  const tileKm = levelTileKm(level), L = localContext(G), { M, C, R, F, X } = G, tw = tileKm / L.kmPx, n = CHUNK * CHUNK;
  const bx0 = cx * CHUNK * tw, by0 = cy * CHUNK * tw, bx1 = bx0 + CHUNK * tw, by1 = by0 + CHUNK * tw;
  const ground = new Uint8Array(n), biome = new Uint8Array(n), elev = new Float32Array(n), owner = new Int32Array(n);
  const out = {};
  for (let j = 0; j < CHUNK; j++) for (let i = 0; i < CHUNK; i++) {
    classifyTerrain(L, bx0 + (i + 0.5) * tw, by0 + (j + 0.5) * tw, out, tileKm);
    const k = j * CHUNK + i;
    ground[k] = out.g; biome[k] = out.biome; elev[k] = out.elev; owner[k] = out.owner;
  }
  const disc = (wx, wy, r, fn) => {
    const ci = Math.floor(wx / tw) - cx * CHUNK, cj = Math.floor(wy / tw) - cy * CHUNK, rt = Math.max(0.5, r / tw), R2 = rt * rt, ri = Math.ceil(rt);
    if (ci + ri < 0 || cj + ri < 0 || ci - ri >= CHUNK || cj - ri >= CHUNK) return;
    for (let dj = -ri; dj <= ri; dj++) {
      const j = cj + dj; if (j < 0 || j >= CHUNK) continue;
      for (let di = -ri; di <= ri; di++) {
        const i = ci + di; if (i < 0 || i >= CHUNK || di * di + dj * dj > R2) continue;
        fn(j * CHUNK + i, i, j);
      }
    }
  };
  // provinces whose settlements could reach into this chunk (farmland extends ~12 km)
  const reach = 12 / L.kmPx, provs = new Set();
  forCellsInRect(M, bx0 - reach, by0 - reach, bx1 + reach, by1 + reach, c => { if (G.T.type[c] === 0) provs.add(R.owner[c]); });

  // settlements: farmland around them, then the built-up area and walls
  const setts = [];
  for (const q of provs) for (const s of provinceSettlements(G, q)) {
    const rKm = urbanRadiusKm(s.pop), fert = FERTILITY[BIOMES[R.provs[q].biome].k] ?? 0.3;
    const farmKm = rKm + [0.4, 1.2, 2.5, 4, 6][s.tier] * (0.4 + fert), far = farmKm * 1.5 / L.kmPx;
    if (s.x + far < bx0 || s.x - far > bx1 || s.y + far < by0 || s.y - far > by1) continue;
    if (fert >= 0.3) disc(s.x, s.y, far, (k, i, j) => {
      const g = ground[k]; if (g !== GR.land && g !== GR.forest && g !== GR.beach) return;
      const wx = bx0 + (i + 0.5) * tw, wy = by0 + (j + 0.5) * tw, d = Math.hypot(wx - s.x, wy - s.y) * L.kmPx;
      if (d < farmKm * (0.7 + 0.8 * (L.farmNoise(wx, wy) + 0.3))) ground[k] = GR.farm;
    });
    setts.push({ s, rKm });
  }
  // at the finer levels the towns themselves are drawn over the land, so no blob is painted for them
  for (const { s, rKm } of level === 0 ? setts : []) {
    const rng = makeRng(G.seed + "|footprint|" + s.id);
    const lobes = [rng.range(0, 6.28), rng.range(0, 6.28)], lf = [rng.range(0.1, 0.25), rng.range(0.05, 0.15)];
    const rt = Math.max(rKm / tileKm, 0.5), sx = s.x / tw, sy = s.y / tw;
    disc(s.x, s.y, (rt * 1.4 + 1.5) * tw, (k, i, j) => {
      if (WATER.has(ground[k])) return;
      const di = (cx * CHUNK + i + 0.5) - sx, dj = (cy * CHUNK + j + 0.5) - sy, a = Math.atan2(dj, di), d = Math.hypot(di, dj);
      const edge = Math.max(0.5, rt * (1 + lf[0] * Math.sin(2 * a + lobes[0]) + lf[1] * Math.sin(3 * a + lobes[1])));
      if (d <= edge) ground[k] = GR.urban;
      else if (s.walled && Math.abs(d - (edge + 1)) < 0.75) ground[k] = GR.wall;
    });
  }
  const bbox = [bx0, by0, bx1, by1], step = tw * 0.5;
  // rivers
  L.traceSegs(C.riverSegs, C.riverCount, bbox, step, wv => riverWidthKm(wv) / 2 / L.kmPx, RIVER_MEANDER.km, RIVER_MEANDER.amp, (px, py, r) => {
    disc(px, py, r, k => { if (ground[k] !== GR.deep && ground[k] !== GR.sea && ground[k] !== GR.lake) ground[k] = GR.river; });
  });
  // major roads
  // roads are drawn wide enough to see at 100 m tiles, at their real width (8-12 m) when finer
  const roadKm = cls => Math.max(cls ? 0.006 : 0.004, Math.min(cls ? 0.07 : 0.045, tileKm * (cls ? 0.7 : 0.45)));
  L.traceSegs(X.roadSegs, X.roadCount, bbox, step, cls => roadKm(cls) / L.kmPx, ROAD_MEANDER.km, ROAD_MEANDER.amp, (px, py, r) => {
    disc(px, py, r, k => {
      const g = ground[k];
      if (g === GR.river) ground[k] = GR.bridge;
      else if (g !== GR.deep && g !== GR.sea && g !== GR.lake && g !== GR.bridge) ground[k] = GR.road;
    });
  });
  // village tracks
  for (const q of provs) for (const line of provinceTracks(G, q)) {
    for (let a = 0; a < line.length - 1; a++) {
      const [ax, ay] = line[a], [bx, by] = line[a + 1];
      if (Math.max(ax, bx) < bx0 - tw || Math.min(ax, bx) > bx1 + tw || Math.max(ay, by) < by0 - tw || Math.min(ay, by) > by1 + tw) continue;
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (tw * 0.5)));
      for (let t = 0; t <= steps; t++) disc(ax + (bx - ax) * t / steps, ay + (by - ay) * t / steps, Math.max(tw * 0.5, 0.0015 / L.kmPx), k => {
        const g = ground[k];
        if (g === GR.river) ground[k] = GR.bridge;
        else if (g !== GR.road && g !== GR.urban && g !== GR.bridge && g !== GR.wall && !WATER.has(g)) ground[k] = GR.track;
      });
    }
  }
  // settlements and points of interest whose centre lies in this chunk
  const inBox = (wx, wy) => wx >= bx0 && wx < bx1 && wy >= by0 && wy < by1;
  // roadside stops: a few buildings beside the road (inns, hamlets, towers, border posts)
  const stops = [];
  if (G.Q && G.Q.stops) for (const st of G.Q.stops) {
    const pad = 0.2 / L.kmPx;
    if (st.x < bx0 - pad || st.x > bx1 + pad || st.y < by0 - pad || st.y > by1 + pad) continue;
    const rKm = { inn: 0.03, hamlet: 0.07, tower: 0.012, shrine: 0.01, border: 0.02 }[st.kind] || 0.02, rng = makeRng(G.seed + "|stop|" + st.x);
    // a little off the road so the buildings sit beside it
    const ox = st.x + (rKm + 0.02) / L.kmPx * (rng.f() < 0.5 ? 1 : -1), oy = st.y + (rng.f() - 0.5) * 0.04 / L.kmPx;
    const nB = st.kind === "hamlet" ? 5 : st.kind === "inn" ? 2 : 1;
    for (let b = 0; b < nB; b++) disc(ox + (rng.f() - 0.5) * rKm * 1.6 / L.kmPx, oy + (rng.f() - 0.5) * rKm * 1.6 / L.kmPx, Math.max(0.009, rKm / nB) / L.kmPx, k => { if (!WATER.has(ground[k]) && ground[k] !== GR.road && ground[k] !== GR.bridge) ground[k] = st.kind === "border" || st.kind === "tower" ? GR.wall : GR.urban; });
    if (inBox(st.x, st.y)) stops.push(st);
  }
  const settlements = setts.filter(({ s }) => inBox(s.x, s.y)).map(({ s, rKm }) => ({
    id: s.id, prov: s.prov, name: s.name, tier: s.tier, pop: s.pop, walled: s.walled, port: s.port, capital: s.capital, x: s.x, y: s.y, rKm,
    profile: townProfile(G, s),
  }));
  const sites = [];
  for (const s of F.sites) { const c = s.cell; if (inBox(M.x[c], M.y[c])) sites.push({ kind: "mystery", name: s.name, type: s.type, x: M.x[c], y: M.y[c] }); }
  for (const v of F.volcanoes) { const c = v.cell; if (inBox(M.x[c], M.y[c])) sites.push({ kind: "volcano", name: v.name, x: M.x[c], y: M.y[c] }); }
  return { cx, cy, level, tileKm, ground, biome, elev, owner, settlements, sites, stops };
}
