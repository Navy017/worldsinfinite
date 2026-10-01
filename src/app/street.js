import { TT, T_ } from "../gen/city.js";
import { ARCH } from "../gen/archstyles.js";
import { BIOMES, hexRgb, W } from "../core/tables.js";
import { localMinutes } from "./time.js";
import { roofsFor } from "./localview.js";
import * as FAC from "./facades.js";

// Street level: past a few pixels per metre the town stands up. It becomes an angled top-down
// view (the Stardew/Zelda look): every building is extruded from its footprint by its floor count,
// with walls in the style's materials, windows on every floor, a door on the street side and a
// pitched, hipped or flat roof. Town walls and towers rise from their tiles, trees grow out of
// the tree tiles, and people walk the streets. Everything is drawn back to front, into a canvas
// at 4 pixels per metre that is then scaled up without smoothing, so it reads as pixel art.

export const STREET_PX_PER_M = 3;
const ART_PX_PER_M = 4, HZ = 0.8, FLOOR_M = 3.1;
const hash = (a, b = 0, c = 0) => { let h = (a * 374761393 + b * 668265263 + c * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const css = (c, f = 1, a = 1) => `rgba(${Math.min(255, c[0] * f) | 0},${Math.min(255, c[1] * f) | 0},${Math.min(255, c[2] * f) | 0},${a})`;
// wall materials per architecture style: base colour, trim colour, and a pattern
const WALLS = {
  timber: { wall: [[228, 214, 184], [220, 204, 170], [232, 222, 196]], trim: [92, 62, 40], frame: true },
  stone: { wall: [[168, 164, 156], [150, 148, 142], [178, 172, 160]], trim: [96, 92, 88], blocks: true },
  courtyard: { wall: [[226, 206, 168], [236, 222, 190], [214, 190, 150]], trim: [170, 140, 100] },
  eastern: { wall: [[226, 222, 212], [214, 208, 196]], trim: [120, 44, 36], frame: true },
  tropical: { wall: [[186, 148, 96], [170, 134, 84]], trim: [110, 80, 48] },
};
const PEOPLE = [[150, 60, 50], [60, 90, 140], [90, 120, 70], [170, 150, 100], [110, 80, 120], [200, 190, 170], [70, 70, 80], [180, 110, 60]];
const SKIN = [[230, 195, 160], [200, 154, 116], [154, 108, 72], [110, 74, 48]];

export function makeStreetLayer(app) {
  const off = document.createElement("canvas"), g = off.getContext("2d");
  let lights = [];

  function active(v) { return !!app.world && app.towns.active(v) && v.k / app.towns.mPerW() >= STREET_PX_PER_M; }

  // the day's rhythm: how busy the streets are and how many windows are lit
  // local sun time at the middle of the screen (the same time the clock shows)
  function hourOf(v) { const wx = (app.cw / 2 - v.ox) / v.k; return localMinutes(app.clock.t, ((wx % W) + W) % W) / 60; }

  function draw(ctx, dpr, v, darkAt) {
    lights = [];
    if (!active(v)) return;
    const mPerW = app.towns.mPerW(), p = v.k / mPerW, f = Math.max(1, p / ART_PX_PER_M);
    // the art-pixel grid is anchored to the world (not the screen), so buildings don't shimmer
    // as the map is dragged; the offscreen canvas starts one art pixel before the screen edge
    const sx0 = ((v.ox % f) + f) % f - f, sy0 = ((v.oy % f) + f) % f - f;
    const W0 = Math.ceil(app.cw / f) + 2, H0 = Math.ceil(app.ch / f) + 2;
    if (off.width !== W0 || off.height !== H0) { off.width = W0; off.height = H0; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W0, H0);
    g.setTransform(1 / f, 0, 0, 1 / f, -sx0 / f, -sy0 / f);
    const items = [], seenLot = new Set(), seenStreet = new Set();
    const hour = hourOf(v), night = darkAt ? darkAt((-v.ox + app.cw / 2) / v.k, (-v.oy + app.ch / 2) / v.k) : 0;
    // buildings come from every loaded level (finest first), so none pop in while finer chunks load
    app.towns.around(v, c => {
      const kit = ARCH[c.summary.profile.style] || ARCH.timber, walls = WALLS[c.summary.profile.style] || WALLS.timber, roofs = roofsFor(c.summary.profile.style);
      const toS = (u, w) => [(c.cx + u / mPerW) * v.k + v.ox, (c.cy + w / mPerW) * v.k + v.oy];
      for (const l of c.lots) {
        if (seenLot.has(l.id)) continue; seenLot.add(l.id);
        const [bx, by] = toS(l.u, l.v), r = Math.hypot(l.w, l.d) * p;
        if (bx < -r || by < -r || bx > app.cw + r || by > app.ch + r + l.floors * FLOOR_M * p) continue;
        items.push({ y: by + r * 0.3, draw: () => building(l, c, kit, walls, roofs, toS, p, night, hour) });
      }
    });
    app.towns.current(v, (c, x, y, size) => {
      const toS = (u, w) => [(c.cx + u / mPerW) * v.k + v.ox, (c.cy + w / mPerW) * v.k + v.oy];
      // raised tiles (walls, towers, palisades, gates, market stalls) and trees, row by row
      const T = c.T, tpx = c.tw * v.k, step = Math.max(1, Math.round(2 / c.tsz));
      const j0 = Math.max(0, Math.floor((-y) / tpx) - 2), j1 = Math.min(T - 1, Math.ceil((app.ch - y) / tpx) + 30);
      const i0 = Math.max(0, Math.floor((-x) / tpx) - 2), i1 = Math.min(T - 1, Math.ceil((app.cw - x) / tpx) + 2);
      const green = hexRgb(BIOMES.find(b => b.k === c.summary.biome)?.c || "#5e8a4b");
      for (let j = j0; j <= j1; j++) {
        const row = [];
        for (let i = i0; i <= i1; i++) {
          const t = c.tile[j * T + i];
          if (t === T_.wall || t === T_.tower || t === T_.palisade || t === T_.gate || t === T_.stall) row.push(i);
          else if ((t === T_.tree || t === T_.park) && i % step === 0 && j % step === 0) {
            const I = Math.round((c.x0 - c.cx) / c.tw) + i, J = Math.round((c.y0 - c.cy) / c.tw) + j;
            if (hash(I, J, 5) < (t === T_.tree ? 0.55 : 0.18)) {
              const px = x + (i + hash(I, J, 6)) * tpx, py = y + (j + hash(I, J, 7)) * tpx;
              items.push({ y: py, draw: () => tree(px, py, p, green, hash(I, J, 8)) });
            }
          }
        }
        if (row.length) { const yy = y + (j + 1) * tpx; items.push({ y: yy - 0.01, draw: () => raisedRow(c, row, j, x, y, tpx, p) }); }
      }
      // people in the streets
      for (const st of c.streets) {
        const key = c.sid * 100000 + st.id; if (seenStreet.has(key)) continue; seenStreet.add(key);
        walkers(st, c, toS, p, hour, items);
      }
    });
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.draw();
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, sx0, sy0, W0 * f, H0 * f);
    ctx.restore();
  }

  function poly(pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }

  // one box (a whole building or one wing of a courtyard house)
  function box(l, c, cx, cy, hw, hd, H, roofCol, wall, trim, style, toS, p, roofKind, front, night, hour, frame, blocks) {
    const ca = Math.cos(l.ang), sa = Math.sin(l.ang), lift = H * p * HZ;
    const loc = (x, y) => toS(l.u + (cx + x) * ca - (cy + y) * sa, l.v + (cx + x) * sa + (cy + y) * ca);
    const G = [loc(-hw, -hd), loc(hw, -hd), loc(hw, hd), loc(-hw, hd)], Tp = G.map(([x, y]) => [x, y - lift]);
    // faces: local outward normals (0,-1), (1,0), (0,1), (-1,0) for edges 0-1, 1-2, 2-3, 3-0
    const normals = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let e = 0; e < 4; e++) {
      const [nx0, ny0] = normals[e], ny = nx0 * sa + ny0 * ca, nx = nx0 * ca - ny0 * sa;
      if (ny <= 0.02) continue; // faces away from the viewer
      const a = G[e], b = G[(e + 1) % 4], light = 0.78 + 0.22 * Math.max(0, -nx * 0.6 + ny * 0.8);
      const edgeM = e % 2 === 0 ? hw * 2 : hd * 2, floors = Math.max(1, Math.round(H / FLOOR_M));
      const at = (t, h) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - h * p * HZ];
      const isFront = front !== 0 && ((e === 0 && front < 0) || (e === 2 && front > 0)) || (front === 0 && e === 2);
      FAC.wallFace(g, { at, a, b, top: [Tp[e], Tp[(e + 1) % 4]], lift, light, p, H, floors, edgeM, style, kind: l.kind, wall, trim, frame, blocks, seed: l.id, face: e, isFront, night, hour, lights, poly, css, hash, FLOOR_M, HZ });
    }
    // roof
    const long = hw >= hd, R = Math.min(hw, hd) * (style === "tropical" ? 1.1 : style === "eastern" ? 0.75 : 0.95), rl = roofKind === "hip" ? Math.max(0.2, (long ? hw - hd : hd - hw)) : (long ? hw : hd);
    const eave = style === "tropical" || style === "eastern" ? 0.6 : 0.3;
    const up = (x, y, h) => { const [sx, sy] = loc(x, y); return [sx, sy - h * p * HZ]; };
    const info = { p, H, R, hw, hd, long, style, kind: l.kind, roofKind, roofCol, wall, trim, seed: l.id, up, loc, poly, css, hash, night, hour, lights, FLOOR_M, HZ, ang: l.ang };
    if (roofKind === "flat") { FAC.flatRoof(g, { ...info, pts: Tp }); FAC.extras(g, info); return; }
    const e0 = [up(-hw - eave, -hd - eave, H), up(hw + eave, -hd - eave, H), up(hw + eave, hd + eave, H), up(-hw - eave, hd + eave, H)];
    const r0 = long ? up(-rl, 0, H + R) : up(0, -rl, H + R), r1 = long ? up(rl, 0, H + R) : up(0, rl, H + R);
    const pieces = long
      ? [[[e0[0], e0[1], r1, r0], 0, -1], [[e0[3], e0[2], r1, r0], 0, 1], [[e0[0], e0[3], r0], -1, 0], [[e0[1], e0[2], r1], 1, 0]]
      : [[[e0[0], e0[3], r1, r0], -1, 0], [[e0[1], e0[2], r1, r0], 1, 0], [[e0[0], e0[1], r0], 0, -1], [[e0[3], e0[2], r1], 0, 1]];
    // back to front within the roof
    pieces.map(([pts, lx, ly]) => ({ pts, lx, ly, ny: lx * sa + ly * ca, nx: lx * ca - ly * sa, tri: pts.length === 3 }))
      .sort((a, b) => a.ny - b.ny)
      .forEach(pc => FAC.roofFace(g, { ...info, ...pc, ridge: [r0, r1] }));
    FAC.ridge(g, { ...info, ridge: [r0, r1] });
    FAC.extras(g, info);
  }

  function building(l, c, kit, walls, roofs, toS, p, night, hour) {
    const style = c.summary.profile.style, pal = roofs[l.kind] || roofs.house;
    const roofCol = pal[Math.floor(hash(l.id % 100003, l.id % 7919, 9) * pal.length)];
    const wall = walls.wall[Math.floor(hash(l.id % 7717, 3) * walls.wall.length)];
    const civic = l.kind === "temple" || l.kind === "keep" || l.kind === "hall";
    const H = l.floors * FLOOR_M + (l.kind === "temple" ? 4 : l.kind === "keep" ? 3 : 0.4);
    const flat = kit.roof === "flat" || l.kind === "keep";
    const roofKind = flat ? "flat" : style === "eastern" || style === "tropical" || (civic && style === "stone") ? "hip" : "gable";
    const wallCol = l.kind === "keep" ? [150, 146, 140] : l.kind === "temple" && style !== "eastern" ? [236, 230, 214] : wall;
    const hw = l.w / 2, hd = l.d / 2;
    if (l.court && hw > 5 && hd > 5) {
      // four wings around a yard; draw the far wing first
      const cm = 3.5, wings = [[0, -hd + cm / 2, hw, cm / 2, -1], [-hw + cm / 2, 0, cm / 2, hd - cm, 0], [hw - cm / 2, 0, cm / 2, hd - cm, 0], [0, hd - cm / 2, hw, cm / 2, 1]];
      const sa = Math.sin(l.ang), ca = Math.cos(l.ang);
      wings.map(w => ({ w, key: w[0] * sa + w[1] * ca })).sort((a, b) => a.key - b.key)
        .forEach(({ w }) => box(l, c, w[0], w[1], w[2], w[3], H, roofCol, wallCol, walls.trim, style, toS, p, roofKind, w[4] === l.front ? l.front : 0, night, hour, walls.frame, walls.blocks));
    } else box(l, c, 0, 0, hw, hd, H, roofCol, wallCol, walls.trim, style, toS, p, roofKind, l.front, night, hour, walls.frame && !civic, walls.blocks || civic);
    // a spire on the temple, crenellations on the keep
    if (l.kind === "temple" && style !== "eastern" && style !== "tropical") {
      const [sx, sy] = toS(l.u, l.v), top = (H + 14) * p * HZ, base = H * p * HZ, bw = Math.min(hw, hd) * 0.5 * p;
      g.fillStyle = css(wallCol, 0.95); g.fillRect(sx - bw, sy - base - 5 * p * HZ, bw * 2, 5 * p * HZ);
      g.beginPath(); g.moveTo(sx - bw, sy - base - 5 * p * HZ); g.lineTo(sx, sy - top); g.lineTo(sx + bw, sy - base - 5 * p * HZ); g.closePath(); g.fillStyle = css(roofCol, 0.9); g.fill();
    }
    if (l.kind === "keep" && p >= 3) {
      const ca = Math.cos(l.ang), sa = Math.sin(l.ang);
      g.fillStyle = css(wallCol, 1.1);
      for (let e = 0; e < 4; e++) {
        const len = e % 2 ? l.d : l.w, n = Math.floor(len / 2);
        for (let k = 0; k < n; k++) {
          const t = (k + 0.5) / n - 0.5, lx = e === 0 ? t * l.w : e === 2 ? -t * l.w : e === 1 ? hw : -hw, ly = e === 1 ? t * l.d : e === 3 ? -t * l.d : e === 0 ? -hd : hd;
          const [sx, sy] = toS(l.u + lx * ca - ly * sa, l.v + lx * sa + ly * ca);
          if (k % 2 === 0) g.fillRect(sx - 0.4 * p, sy - (H + 0.8) * p * HZ, 0.8 * p, 0.8 * p * HZ);
        }
      }
    }
  }

  // walls, towers, palisades and gates rise from their tiles; stalls get an awning
  const RAISE = { [T_.wall]: [8, [128, 122, 114]], [T_.tower]: [12, [112, 106, 100]], [T_.palisade]: [3.5, [120, 88, 56]], [T_.gate]: [8, [128, 122, 114]], [T_.stall]: [2.4, null] };
  function raisedRow(c, row, j, x, y, tpx, p) {
    const T = c.T;
    for (const i of row) {
      const t = c.tile[j * T + i], [h, col0] = RAISE[t], lift = h * p * HZ, sx = x + i * tpx, sy = y + j * tpx;
      const col = col0 || [[200, 60, 50], [224, 180, 60], [60, 120, 200], [232, 224, 208]][Math.floor(hash(i >> 2, j >> 2, 8) * 4)];
      const below = j < T - 1 ? c.tile[(j + 1) * T + i] : -1;
      if (below !== t) {
        // the face towards the viewer
        if (t === T_.gate) { g.fillStyle = css(col, 0.78); g.fillRect(sx, sy + tpx - lift, tpx + 0.5, lift * 0.45); }
        else if (t === T_.stall) { g.fillStyle = "#6a4a2a"; g.fillRect(sx, sy + tpx - lift, Math.max(1, tpx * 0.15), lift); }
        else { g.fillStyle = css(col, 0.8 + (hash(i, j >> 1) * 0.08)); g.fillRect(sx, sy + tpx - lift, tpx + 0.5, lift); }
      }
      g.fillStyle = css(col, t === T_.stall ? 1 : 1.12); g.fillRect(sx, sy - lift, tpx + 0.5, tpx + 0.5);
      // crenellations on the wall walk
      if ((t === T_.wall || t === T_.tower) && below !== t && (i % 2 === 0)) { g.fillStyle = css(col, 1.2); g.fillRect(sx, sy + tpx - lift - 0.9 * p * HZ, tpx * 0.9, 0.9 * p * HZ); }
      if (t === T_.palisade && below !== t) { g.fillStyle = css(col, 0.7); g.fillRect(sx + tpx * 0.45, sy + tpx - lift - 0.5 * p, Math.max(1, tpx * 0.1), 0.5 * p); }
    }
  }

  function tree(px, py, p, green, r) {
    const h = (4 + r * 5) * p * HZ, cr = (1.6 + r * 1.6) * p;
    g.fillStyle = "rgba(20,30,15,.28)"; g.beginPath(); g.ellipse(px, py, cr * 0.9, cr * 0.4, 0, 0, 7); g.fill();
    g.fillStyle = "#5a3e24"; g.fillRect(px - 0.2 * p, py - h * 0.55, 0.4 * p, h * 0.55);
    g.fillStyle = css(green, 0.62 + r * 0.15); g.beginPath(); g.arc(px, py - h, cr, 0, 7); g.fill();
    g.fillStyle = css(green, 0.85 + r * 0.15); g.beginPath(); g.arc(px - cr * 0.3, py - h - cr * 0.3, cr * 0.55, 0, 7); g.fill();
  }

  // people walk the streets at a real walking pace; crowds follow the time of day
  function walkers(st, c, toS, p, hour, items) {
    const pts = st.pts, n = pts.length / 2; if (n < 2) return;
    const busy = hour < 5 ? 0.04 : hour < 7 ? 0.35 : hour < 19 ? 1 : hour < 22 ? 0.5 : 0.12;
    let total = 0; const cum = [0];
    for (let i = 1; i < n; i++) { total += Math.hypot(pts[2 * i] - pts[2 * i - 2], pts[2 * i + 1] - pts[2 * i - 1]); cum.push(total); }
    const count = Math.round(total / (st.cls === 2 ? 9 : 14) * busy * (c.summary.tier >= 3 ? 1.4 : 0.8));
    const anim = app.clock.anim;
    for (let k = 0; k < count; k++) {
      const seed = (st.id * 131 + k) * 7 + c.sid, dir = hash(seed, 1) < 0.5 ? 1 : -1, speed = 1.1 + hash(seed, 2) * 0.6;
      let d = (hash(seed, 3) * total + dir * anim * speed) % total; if (d < 0) d += total;
      let i = 1; while (i < n - 1 && cum[i] < d) i++;
      const t = (d - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
      const u = pts[2 * i - 2] + (pts[2 * i] - pts[2 * i - 2]) * t, w = pts[2 * i - 1] + (pts[2 * i + 1] - pts[2 * i - 1]) * t;
      const tx = pts[2 * i] - pts[2 * i - 2], ty = pts[2 * i + 1] - pts[2 * i - 1], tl = Math.hypot(tx, ty) || 1;
      const lat = (hash(seed, 4) - 0.5) * st.w * 0.75;
      const [sx, sy] = toS(u - ty / tl * lat, w + tx / tl * lat);
      if (sx < -20 || sy < -20 || sx > app.cw + 20 || sy > app.ch + 40) continue;
      const cloth = PEOPLE[Math.floor(hash(seed, 5) * PEOPLE.length)], skin = SKIN[Math.floor(hash(seed, 6) * SKIN.length)];
      const step = Math.sin(anim * speed * 6 + k) > 0 ? 1 : 0, cart = st.cls === 2 && hash(seed, 7) < 0.06;
      items.push({ y: sy, draw: () => cart ? drawCart(sx, sy, p, tx / tl) : person(sx, sy, p, cloth, skin, step) });
    }
  }
  function person(x, y, p, cloth, skin, step) {
    g.fillStyle = "rgba(20,20,20,.25)"; g.fillRect(x - 0.35 * p, y - 0.1 * p, 0.7 * p, 0.2 * p);
    g.fillStyle = "#3a2e26"; g.fillRect(x - 0.22 * p, y - 0.75 * p * HZ, 0.18 * p, 0.75 * p * HZ - step * 0.1 * p); g.fillRect(x + 0.04 * p, y - 0.75 * p * HZ, 0.18 * p, 0.75 * p * HZ - (1 - step) * 0.1 * p);
    g.fillStyle = css(cloth); g.fillRect(x - 0.3 * p, y - 1.45 * p * HZ, 0.6 * p, 0.75 * p * HZ);
    g.fillStyle = css(skin); g.fillRect(x - 0.17 * p, y - 1.85 * p * HZ, 0.34 * p, 0.36 * p * HZ);
  }
  function drawCart(x, y, p, dx) {
    const s = dx >= 0 ? 1 : -1;
    g.fillStyle = "#6a4a30"; g.fillRect(x + s * 1.6 * p - 0.9 * p, y - 1.3 * p * HZ, 1.8 * p, 0.8 * p * HZ); // ox
    g.fillStyle = "#7a5a3a"; g.fillRect(x - 1.4 * p, y - 1.4 * p * HZ, 2.8 * p, 0.9 * p * HZ);
    g.fillStyle = "#d8c8a0"; g.fillRect(x - 1.3 * p, y - 1.9 * p * HZ, 2.6 * p, 0.6 * p * HZ);
    g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(x - 0.9 * p, y - 0.35 * p, 0.35 * p, 0, 7); g.arc(x + 0.9 * p, y - 0.35 * p, 0.35 * p, 0, 7); g.fill();
  }

  // lit windows glow after dark
  function drawLights(ctx, dpr) {
    if (!lights.length) return;
    ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = "lighter";
    for (const [x, y, r] of lights) {
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6); gr.addColorStop(0, "rgba(255,200,110,.5)"); gr.addColorStop(1, "rgba(255,160,60,0)");
      ctx.fillStyle = gr; ctx.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2);
    }
    ctx.restore();
  }
  return { active, draw, drawLights };
}
