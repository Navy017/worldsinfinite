// Building surfaces at street level: walls (material, windows, door), roofs (covering, ridge) and
// extras (chimneys, signs...). street.js works out the geometry of every building and calls these
// with everything they need; this file only decides how each surface looks. It is the place to
// add detail: a new material or window style never has to touch the geometry.
//
// wallFace(g, f): one visible wall. f.at(t, h) gives the screen point at fraction t along the wall
//   (0..1, left to right as seen) and height h metres above the ground; f.a/f.b are its bottom
//   corners, f.top its top corners, f.light its brightness (0.78..1), f.p pixels per metre,
//   f.H height in metres, f.floors, f.edgeM its length in metres, f.style (timber, stone,
//   courtyard, eastern, tropical), f.kind (house, rich, workshop, warehouse, farm, barn, inn,
//   shack, temple, keep, hall, market, library, barracks, mill), f.wall/f.trim rgb arrays,
//   f.frame/f.blocks hints, f.seed (stable per building), f.face, f.isFront (street side: door),
//   f.night (0..1) and f.hour, f.lights (push [x, y, radius] for glowing windows),
//   helpers f.poly(points) (path), f.css(rgb, factor, alpha), f.hash(a, b, c) -> 0..1.
// roofFace(g, r): one roof plane (r.pts, r.tri for a triangle, r.nx/r.ny its facing on screen, r.roofKind
//   gable|hip, r.roofCol, r.wall for gable ends, r.ridge [start, end] points, r.up(x, y, h) for points
//   in the building's own frame in metres (x along, y across, h height)).
// flatRoof(g, r): r.pts, the four top corners. ridge(g, r): the ridge line. extras(g, e): anything on
//   top of the finished building, using e.up(x, y, h), e.hw/e.hd half sizes, e.H wall height, e.R roof height.
//
// Everything is drawn into street.js's pixel-art canvas (ART art pixels per metre, then scaled up
// without smoothing), so details are sized in whole art pixels: `ap` is one art pixel in canvas
// units, and on a wall `mw`/`mh` are one art pixel across/up in metres. Fills are batched by colour
// (see batcher) so a building costs a few dozen fill calls at most; at small scales (lod 0) most
// small details are skipped. All variation comes from f.hash on the building's seed, never Math.random.

const ART = 4; // art pixels per metre of street.js's offscreen canvas (a caller may pass artPx instead)

const SHUTTER = [[64, 112, 72], [56, 86, 132], [150, 58, 46], [190, 146, 58], [58, 118, 118], [104, 70, 98], [226, 220, 204]];
const DOOR = [[98, 66, 42], [82, 54, 36], [118, 80, 50], [58, 92, 72], [66, 72, 112], [138, 58, 44]];
const CLOTH = [[196, 64, 52], [56, 98, 160], [66, 128, 78], [208, 166, 58], [128, 68, 128], [208, 112, 50]];
const HERALD = [[164, 40, 40], [40, 72, 148], [206, 164, 52], [40, 112, 64], [112, 42, 112], [232, 228, 214]];
const FLOWERS = ["#e2505c", "#f2c440", "#e884c6", "#f6f2e4", "#dc6a30"];
const BAND = [[64, 104, 150], [174, 86, 58], [64, 128, 110], [188, 146, 66]];
const BRICK = [[150, 78, 58], [138, 70, 54], [162, 92, 66]];
const WOOD = [112, 78, 50], DARKWOOD = [64, 46, 36], STONE = [150, 144, 134], TERRA = [168, 94, 60];
const GLASS = "rgb(42,38,48)", LIT = "#ffd27a", IRON = "#35302c", GOLD = "#d8b04a", VOID = "rgb(46,38,34)";

// Consecutive shapes of one colour share a single path and fill. Every shape is wound the same
// way, so overlapping shapes in one batch never cancel out.
function batcher(g) {
  let cur = null;
  const flush = () => { if (cur !== null) { g.fillStyle = cur; g.fill(); cur = null; } };
  const path = (col, pts) => {
    if (col !== cur) { flush(); cur = col; g.beginPath(); }
    const n = pts.length; let s = 0;
    for (let i = 0; i < n; i++) { const p0 = pts[i], p1 = pts[(i + 1) % n]; s += p0[0] * p1[1] - p1[0] * p0[1]; }
    if (s >= 0) { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) g.lineTo(pts[i][0], pts[i][1]); }
    else { g.moveTo(pts[n - 1][0], pts[n - 1][1]); for (let i = n - 2; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1]); }
    g.closePath();
  };
  const rect = (col, x, y, w, h) => path(col, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  return { path, rect, flush };
}

// the part of convex polygon `sub` inside convex polygon `clip` (Sutherland-Hodgman)
function clipConvex(sub, clip) {
  let s0 = 0; for (let i = 0; i < clip.length; i++) { const p0 = clip[i], p1 = clip[(i + 1) % clip.length]; s0 += p0[0] * p1[1] - p1[0] * p0[1]; }
  const sg = s0 >= 0 ? 1 : -1;
  let out = sub;
  for (let i = 0; i < clip.length && out.length; i++) {
    const [ax, ay] = clip[i], [bx, by] = clip[(i + 1) % clip.length];
    const side = q => sg * ((bx - ax) * (q[1] - ay) - (by - ay) * (q[0] - ax));
    const inp = out; out = [];
    for (let j = 0; j < inp.length; j++) {
      const P = inp[j], Q = inp[(j + 1) % inp.length], sp = side(P), sq = side(Q);
      if (sp >= 0) out.push(P);
      if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]); }
    }
  }
  return out;
}

// roof covering by style and building kind
function coverOf(style, kind) {
  if (style === "tropical") return "thatch";
  if (style === "eastern") return "glazed";
  if (style === "stone") return "slate";
  if (kind === "farm" || kind === "barn" || kind === "shack") return "thatch";
  if (kind === "workshop" || kind === "warehouse" || kind === "mill" || kind === "barracks") return "shingle";
  return "tile";
}

const lodOf = p => p >= 7 ? 2 : p >= 4.5 ? 1 : 0;

export function wallFace(g, f) {
  const { at, a, b, top, light, p, H, floors, edgeM: E, style, kind, wall, trim, frame, blocks, seed, face, isFront, night, hour, lights, poly, css, hash } = f;
  const F = f.FLOOR_M || 3.1, HZ = f.HZ || 0.8, ap = f.artPx || Math.max(1, p / ART);
  poly([a, b, top[1], top[0]]); g.fillStyle = css(wall, light); g.fill();
  const hx = Math.abs(b[0] - a[0]) / E; // screen px per metre along the wall, horizontally
  if (hx * E < 2.5 * ap) return; // seen almost edge-on: no detail would show
  const mw = Math.min(0.6, ap / hx), mh = ap / (p * HZ); // one art pixel across / up, in metres
  const lod = lodOf(p);
  const B = batcher(g);
  const Q = (col, m0, m1, h0, h1) => B.path(col, [at(m0 / E, h0), at(m1 / E, h0), at(m1 / E, h1), at(m0 / E, h1)]);
  // a slanted strip w metres wide from m0 at height h0 up to m1 at h1 (braces)
  const S = (col, m0, h0, m1, h1, w) => B.path(col, [at(m0 / E, h0), at((m0 + w) / E, h0), at((m1 + w) / E, h1), at(m1 / E, h1)]);
  // points standing out from the wall (awnings, signs, steps): the outward normal on screen faces the viewer
  let ox = a[1] - b[1], oy = b[0] - a[0]; const ol = Math.hypot(ox, oy) || 1; ox /= ol; oy /= ol; if (oy < 0) { ox = -ox; oy = -oy; }
  const O = (m, h, d) => { const q = at(m / E, h); return [q[0] + ox * d * p, q[1] + oy * d * p]; };
  const W = (k, j = 0) => hash(seed % 99991, k * 31 + j, face + 11); // varies per wall
  const Bh = k => hash(seed % 100003, k, 77); // same on every wall of the building
  const C = (c, k = 1, al = 1) => css(c, light * k, al);
  const flat = style === "courtyard" || kind === "keep";
  const grand = kind === "rich" || kind === "temple" || kind === "hall" || kind === "library";
  const civic = grand || kind === "keep" || kind === "barracks" || kind === "market";

  // --- what the wall is made of
  let mat;
  if (kind === "keep") mat = "stone";
  else if (style === "eastern") mat = "eastern";
  else if (style === "courtyard") mat = "stucco";
  else if (style === "tropical") mat = blocks ? "stone" : kind === "house" || kind === "shack" || kind === "farm" || kind === "barn" ? "bamboo" : "planks";
  else if (kind === "barn") mat = "planks";
  else if (kind === "warehouse" && (style === "timber" || Bh(1) < 0.5)) mat = "brick";
  else if (kind === "workshop" && style === "timber") mat = "brickTimber";
  else mat = blocks ? "stone" : frame ? "timber" : "stucco";
  const stilt = style === "tropical" && (mat === "bamboo" || mat === "planks") && kind !== "barn" && kind !== "warehouse" && kind !== "market" && kind !== "mill" ? 0.9 : 0;

  // --- the door (walls and windows need to know where it goes)
  let dW = 1.1, dH = 2.1, dbl = false, arch = false, barnDoor = false;
  if (kind === "rich") { dW = 1.3; dH = 2.4; }
  else if (kind === "inn") { dW = 1.6; dH = 2.3; dbl = true; }
  else if (kind === "temple") { dW = 2.2; dH = 3.6; dbl = arch = true; }
  else if (kind === "hall" || kind === "library") { dW = 2.0; dH = 2.9; dbl = arch = true; }
  else if (kind === "keep" || kind === "barracks") { dW = 1.8; dH = 2.7; dbl = arch = true; }
  else if (kind === "barn") { dW = Math.min(E * 0.5, 3.2); dH = 3.2; barnDoor = dbl = true; }
  else if (kind === "warehouse") { dW = 2.4; dH = 2.8; barnDoor = dbl = true; }
  else if (kind === "shack" || kind === "farm") { dW = 1.0; dH = 2.0; }
  if (style === "courtyard" && (kind === "rich" || (kind === "house" && Bh(14) < 0.4))) arch = true;
  if (style === "eastern" && (kind === "rich" || kind === "inn")) dbl = true;
  dW = Math.min(dW, E - 0.8); dH = Math.min(dH, H - 0.5 - stilt);
  const arcade = kind === "market";
  const dm = E / 2, d0 = dm - dW / 2, d1 = dm + dW / 2, door = isFront && !arcade && dW > 0.5 && dH > 1.2;
  const shop = isFront && (kind === "workshop" || (kind === "inn" && Bh(15) < 0.35)) && E > 4;
  const aw0 = Math.max(0.2, dm - 2.4), aw1 = Math.min(E - 0.2, dm + 2.4);
  const loading = isFront && kind === "warehouse" && floors >= 2;
  const banners = isFront && lod >= 1 && (kind === "hall" || kind === "barracks" || kind === "keep") && H > 5
    ? [dm - dW / 2 - 1.0, dm + dW / 2 + 1.0].filter(m => m > 0.6 && m < E - 0.6) : [];
  const st = Math.max(mh, 0.3); // the step of a pixel arch

  // --- window style
  let wW = 0.9, wH = 1.25, sill = 1.1, wt = "plain", nW = Math.max(1, Math.floor(E / 2.7)), rows = floors;
  if (kind === "barn") nW = 0;
  else if (kind === "keep" || kind === "barracks") { wt = "slit"; wW = 0.3; wH = 1.1; sill = 1.3; }
  else if (style === "eastern") { wt = "lattice"; wW = 1.3; wH = 1.0; sill = 1.2; }
  else if (kind === "temple") { wt = "stained"; wW = 1.0; rows = 1; sill = 1.4; wH = Math.max(1.6, Math.min(4.5, H - 3)); nW = Math.max(1, Math.floor(E / 3.2)); }
  else if (kind === "hall" || kind === "library") { wt = "arch"; wW = 1.0; wH = 1.8; sill = 0.9; }
  else if (style === "courtyard") { const ar = kind === "rich" || kind === "inn" || kind === "market"; wt = ar ? "arch" : "small"; wW = ar ? 0.7 : 0.6; wH = ar ? 1.1 : 0.7; sill = 1.6; }
  else if (style === "tropical") { wt = "open"; wW = 1.0; wH = 0.9; sill = 1.2; }
  else if (kind === "warehouse" || kind === "mill") { wt = "small"; wW = 0.8; wH = 0.6; sill = 1.9; nW = Math.max(1, Math.floor(E / 4.5)); }
  else if (kind === "market") { wt = "arch"; wW = 0.8; wH = 1.3; }
  else if ((kind === "house" || kind === "rich" || kind === "inn" || kind === "shack" || kind === "farm") && Bh(4) < 0.6) wt = "shutter";
  const sw = Math.max(mw, 0.3), shutters = wt === "shutter" && lod >= 1 && nW > 0 && E / nW >= wW + 2 * sw + 0.5;

  // --- materials
  const beamCol = C(mat === "eastern" ? DARKWOOD : trim), bw = Math.max(mh, 0.22), pw = Math.max(mw, 0.22);
  const nPanels = nW > 0 ? nW : Math.max(1, Math.round(E / 2.4));
  const postsAt = (col, h0, h1, n) => { for (let k = 0; k <= n; k++) { const m = Math.min(E - pw, Math.max(0, k * E / n - pw / 2)); Q(col, m, m + pw, h0, h1); } };
  const jsFor = (h0, h1, ch, js) => Math.max(js, Math.ceil((h1 - h0) / ch) * E / 36, 2 * mw); // joint spacing, capped in count
  const courses = (col, h0, h1, ch, js, joints) => {
    for (let h = h0 + ch; h < h1 - mh; h += ch) Q(col, 0, E, h, h + mh);
    if (joints) for (let i = 0, h = h0; h < h1 - mh; h += ch, i++) {
      const ht = Math.min(h1, h + ch);
      for (let m = js * (i % 2 ? 0.5 : 1); m < E - mw; m += js) Q(col, m, m + mw, h, ht);
    }
  };
  // single blocks in a lighter or darker shade, lined up with the joints
  const tints = (col, n, h0, h1, ch, js, salt) => {
    for (let k = 0; k < n; k++) {
      const row = Math.floor(W(k, salt) * (h1 - h0) / ch), h = h0 + row * ch;
      const m = Math.floor(W(k, salt + 1) * E / js) * js - (row % 2 ? js / 2 : 0);
      Q(col, Math.max(0, m), Math.min(E, m + js), h, Math.min(h1, h + ch));
    }
  };
  const timber = h0 => {
    const hb = h0 > 0 ? h0 : 0.45, reach = shutters ? 0.45 : 0.7;
    if (h0 === 0) Q(C(STONE, 0.85), 0, E, 0, 0.45);
    // braces first, then posts and beams over them (one colour: one fill)
    if (lod >= 1) for (let fl = 0; fl < floors; fl++) {
      const s0 = Math.max(hb, fl * F) + bw, s1 = Math.min(H, (fl + 1) * F) - bw, bh = Math.min(1.5, s1 - s0 - 0.2);
      if (bh < 0.6 || Bh(20 + fl) > 0.8) continue;
      for (let k = 0; k <= nPanels; k++) {
        const pl = Math.min(E - pw, Math.max(0, k * E / nPanels - pw / 2)), pr = pl + pw;
        if (fl === 0 && door && pr > d0 - reach - 0.4 && pl < d1 + reach + 0.4) continue;
        if (k < nPanels) S(beamCol, pr + reach, s0, pr, s0 + bh, pw);
        if (k > 0) S(beamCol, pl - reach - pw, s0, pl - pw, s0 + bh, pw);
      }
    }
    postsAt(beamCol, hb, H, nPanels);
    Q(beamCol, 0, E, hb, hb + bw);
    for (let fl = 1; fl < floors; fl++) if (fl * F > hb + bw) Q(beamCol, 0, E, fl * F - bw / 2, fl * F + bw / 2);
    Q(beamCol, 0, E, H - bw, H);
  };

  if (mat === "stone") {
    const ch = Math.max(0.5, 2 * mh), js = jsFor(0.6, H, ch, 1.3);
    if (lod >= 1) {
      const n = Math.min(6, Math.floor(E * H / 10));
      tints(C(wall, 1.07), n, 0.6, H, ch, js, 1); tints(C(wall, 0.92), n, 0.6, H, ch, js, 3);
      const ns = Math.floor(W(9) * 3); // rain streaks from the eaves
      for (let k = 0; k < ns; k++) { const m = W(k, 10) * (E - 0.4); Q(C(wall, 0.86), m, m + Math.max(mw, 0.3), H - 0.8 - W(k, 11) * 1.6, H); }
    }
    Q(C(wall, 0.72), 0, E, 0, 0.6);
    if (lod >= 1) courses(C(wall, 0.8), 0.6, H, ch, js, lod >= 2);
  } else if (mat === "brick" || mat === "brickTimber") {
    const bc = BRICK[Math.floor(Bh(2) * BRICK.length)], hT = mat === "brick" ? H : Math.min(H, F);
    Q(C(bc), 0, E, 0, hT);
    const ch = Math.max(0.4, 2 * mh), js = jsFor(0.45, hT, ch, 0.9);
    if (lod >= 1) { tints(C(bc, 1.12), Math.min(5, Math.floor(E * hT / 8)), 0.45, hT, ch, js, 1); courses(C([206, 190, 168], 0.9), 0.45, hT, ch, js, lod >= 2); }
    Q(C(STONE, 0.8), 0, E, 0, 0.45);
    if (mat === "brickTimber" && H > hT + 0.5) timber(hT);
  } else if (mat === "timber") {
    timber(0);
  } else if (mat === "eastern") {
    Q(C([128, 124, 118]), 0, E, 0, 0.55);
    if (lod >= 1) Q(C(WOOD, 0.9), 0, E, 0.55, 1.0);
    postsAt(beamCol, 0.55, H, nPanels);
    const red = C(trim);
    for (let fl = 1; fl < floors; fl++) Q(red, 0, E, fl * F - bw / 2, fl * F + bw / 2);
    Q(red, 0, E, H - Math.max(0.45, 2 * mh), H);
  } else if (mat === "stucco") {
    if (lod >= 1) { const n = 1 + Math.floor(W(5) * 3); for (let k = 0; k < n; k++) { const m = W(k, 6) * (E - 0.4); Q(C(wall, 0.9), m, m + Math.max(mw, 0.3), H - 0.8 - W(k, 7) * 1.6, H); } }
    Q(C(wall, 0.82), 0, E, 0, 0.45);
    if (Bh(3) < 0.6) { const hb = H - 0.5; Q(C(BAND[Math.floor(Bh(13) * BAND.length)]), 0, E, hb - Math.max(mh, 0.25), hb); }
    if (flat) Q(C(wall, 1.1), 0, E, H - mh, H);
  } else if (mat === "bamboo") {
    if (lod >= 1) for (let h = stilt + 2 * mh; h < H - mh; h += 3 * mh) Q(C(wall, 0.84), 0, E, h, h + mh);
    postsAt(C(WOOD, 0.8), stilt, H, Math.max(1, Math.round(E / 1.8)));
  } else if (mat === "planks") {
    const wc = style === "tropical" ? wall : [134, 92, 58], sp = Math.max(0.5, 2 * mw);
    if (wc !== wall) Q(C(wc), 0, E, 0, H);
    if (lod >= 2) for (let k = 0; k < 4; k++) { const m = Math.floor(W(k, 8) * E / sp) * sp; Q(C(wc, 1.08), m, Math.min(E, m + sp), stilt, H); }
    if (lod >= 1) for (let m = sp; m < E - mw; m += sp) Q(C(wc, 0.76), m, m + mw, stilt, H);
    if (style !== "tropical") Q(C(STONE, 0.8), 0, E, 0, 0.4);
  }
  if (stilt) {
    Q(VOID, 0, E, 0, stilt);
    postsAt(C(WOOD, 0.85), 0, stilt, Math.max(1, Math.round(E / 2.2)));
    Q(C(WOOD, 0.7), 0, E, stilt - bw, stilt);
  }
  // corner quoins on grand stone, brick and stucco buildings
  if (lod >= 1 && grand && (mat === "stone" || mat === "stucco" || mat === "brick")) {
    const qc = mat === "brick" ? C(STONE, 1.05) : C(wall, 1.13), qh = Math.max(0.5, 2 * mh);
    for (let i = 0, h = mat === "stone" ? 0.6 : 0.45; h < H - 0.2; h += qh, i++) {
      const len = i % 2 ? 0.5 : 0.9, ht = Math.min(H, h + qh - mh);
      Q(qc, 0, len, h, ht); Q(qc, E - len, E, h, ht);
    }
  }
  // the eaves cast a shadow on the top of the wall
  if (!flat) Q("rgba(24,18,14,.3)", 0, E, H - Math.max(mh, 0.3), H);

  // --- windows
  const wins = [];
  for (let fl = 0; fl < rows && nW > 0; fl++) {
    if (fl === 0 && arcade) continue;
    for (let k = 0; k < nW; k++) {
      const mc = (k + 0.5) * E / nW, m0 = mc - wW / 2, m1 = mc + wW / 2, h0 = stilt + fl * F + sill, h1 = h0 + wH;
      if (h1 > H - 0.25) continue;
      if (fl === 0 && door && m1 > d0 - 0.3 && m0 < d1 + 0.3) continue;
      if (fl === 0 && shop && m1 > aw0 && m0 < aw1) continue;
      if (fl > 0 && loading && Math.abs(mc - dm) < 1.3) continue;
      if (banners.some(bm => m1 > bm - 0.5 && m0 < bm + 0.5)) continue;
      if (fl === 0 && style === "courtyard" && kind === "house" && W(k, 3) < 0.5) continue; // blank street walls
      const lit = night > 0.25 && hash(seed % 99991, fl * 17 + k, face) < (hour > 22 || hour < 5 ? 0.12 : 0.55) * night;
      wins.push([m0, m1, h0, h1, lit, k, fl]);
    }
  }
  if (shutters) { const sc = C(SHUTTER[Math.floor(Bh(5) * SHUTTER.length)]); for (const w of wins) { Q(sc, w[0] - sw, w[0], w[2], w[3]); Q(sc, w[1], w[1] + sw, w[2], w[3]); } }
  if (lod >= 1 && wins.length) {
    if (wt === "lattice") { const fc = C(trim); for (const w of wins) Q(fc, w[0] - mw, w[1] + mw, w[2] - mh, w[3] + mh); }
    else if (mat === "stone" || mat === "brick") {
      const lc = mat === "brick" ? C(STONE, 1.05) : C(wall, 1.16);
      for (const w of wins) { Q(lc, w[0] - mw * 0.5, w[1] + mw * 0.5, w[3], w[3] + Math.max(mh, 0.25)); Q(lc, w[0], w[1], w[2] - mh, w[2]); }
    } else if (wt !== "open" && wt !== "slit") {
      const sc = mat === "timber" || mat === "brickTimber" ? C(trim) : C(wall, mat === "stucco" ? 1.12 : 0.8);
      for (const w of wins) Q(sc, w[0] - mw * 0.5, w[1] + mw * 0.5, w[2] - mh, w[2]);
    }
  }
  const pane = (col, w) => {
    if ((wt === "arch" || wt === "stained") && w[3] - w[2] > 2 * st) { const i = (w[1] - w[0]) * 0.22; Q(col, w[0], w[1], w[2], w[3] - st); Q(col, w[0] + i, w[1] - i, w[3] - st - 0.01, w[3]); }
    else Q(col, w[0], w[1], w[2], w[3]);
  };
  const dark = wt === "stained" ? "rgb(46,54,90)" : GLASS;
  for (const w of wins) if (!w[4]) pane(dark, w);
  for (const w of wins) if (w[4]) { pane(LIT, w); const [lx, ly] = at((w[0] + w[1]) / 2 / E, (w[2] + w[3]) / 2); lights.push([lx, ly, Math.max(3, 1.6 * p)]); }
  if (lod >= 2 && wins.length) {
    if (wt === "lattice") {
      const lc = C(trim, 1.25);
      for (const w of wins) { const hm = (w[2] + w[3]) / 2, t3 = (w[1] - w[0]) / 3; Q(lc, w[0], w[1], hm - mh / 2, hm + mh / 2); Q(lc, w[0] + t3 - mw / 2, w[0] + t3 + mw / 2, w[2], w[3]); Q(lc, w[1] - t3 - mw / 2, w[1] - t3 + mw / 2, w[2], w[3]); }
    } else if ((wt === "plain" || wt === "shutter") && wW >= 0.8) {
      const mc = mat === "timber" || mat === "brickTimber" ? C(trim) : C(wall, 1.05);
      for (const w of wins) { const c = (w[0] + w[1]) / 2, hm = (w[2] + w[3]) / 2; Q(mc, c - mw / 2, c + mw / 2, w[2], w[3]); Q(mc, w[0], w[1], hm - mh / 2, hm + mh / 2); }
    } else if (wt === "stained") {
      for (const w of wins) if (!w[4]) { const c = (w[0] + w[1]) / 2; Q("rgb(176,52,48)", c - mw, c, w[3] - 1.2, w[3] - 1.2 + mh); Q(GOLD, c, c + mw, w[3] - 0.8, w[3] - 0.8 + mh); }
    }
  }
  if (wt === "open" && lod >= 1) { // plank shutters propped open above the openings
    const pc = C(WOOD, 0.9);
    for (const w of wins) B.path(pc, [at((w[0] - 0.1) / E, w[3]), at((w[1] + 0.1) / E, w[3]), O(w[1] + 0.1, w[3] - 0.25, 0.55), O(w[0] - 0.1, w[3] - 0.25, 0.55)]);
  }
  // flower boxes
  if (lod >= 1 && wt !== "small" && wt !== "slit" && (kind === "house" || kind === "rich" || kind === "inn") && mat !== "bamboo" && mat !== "eastern" && Bh(6) < 0.4) {
    const fw = wins.filter(w => W(w[5], w[6] + 40) < 0.75), bc = C(WOOD, 0.8), leaf = C([70, 118, 56]), fc = FLOWERS[Math.floor(Bh(7) * FLOWERS.length)];
    for (const w of fw) Q(bc, w[0] - mw * 0.5, w[1] + mw * 0.5, w[2] - Math.max(mh, 0.28), w[2]);
    for (const w of fw) Q(leaf, w[0] - mw * 0.5, w[1] + mw * 0.5, w[2], w[2] + mh);
    if (lod >= 2) for (const w of fw) { const c = (w[0] + w[1]) / 2; for (const m of [w[0] - mw * 0.5, c - mw / 2, w[1] - mw * 0.5]) Q(fc, m, m + mw, w[2] + mh * 0.6, w[2] + mh * 1.6); }
  }

  // --- market arcade: open arches all along the ground floor
  if (arcade) {
    const nA = Math.max(1, Math.round(E / 2.8)), aw = Math.min(1.9, E / nA - 0.6), ah = Math.min(2.7, H - 0.6);
    for (let k = 0; k < nA; k++) { const c = (k + 0.5) * E / nA; Q(VOID, c - aw / 2, c + aw / 2, 0, ah - st); Q(VOID, c - aw * 0.3, c + aw * 0.3, 0, ah); }
    if (lod >= 2) {
      const cc = C(WOOD), gc = C(CLOTH[Math.floor(Bh(16) * CLOTH.length)]);
      for (let k = 0; k < nA; k++) { const c = (k + 0.5) * E / nA; Q(cc, c - aw * 0.4, c - aw * 0.05, 0, 0.55); }
      for (let k = 0; k < nA; k++) { const c = (k + 0.5) * E / nA; Q(gc, c + aw * 0.05, c + aw * 0.4, 0, 0.4); }
    }
  }

  // --- warehouse loading doors on the upper floors, with a hoist beam
  if (loading) {
    const lc = C(WOOD, 0.85);
    for (let fl = 1; fl < floors; fl++) { const h0 = fl * F + 0.3; if (h0 + 2 < H - 0.3) Q(lc, dm - 0.6, dm + 0.6, h0, h0 + 2); }
    if (lod >= 1) { const hb = H - 0.35; B.path(C(DARKWOOD), [at((dm - mw / 2) / E, hb), at((dm + mw / 2) / E, hb), O(dm + mw / 2, hb, 0.9), O(dm - mw / 2, hb, 0.9)]); }
  }

  // --- the door
  if (door) {
    const base = stilt, fw = Math.max(mw, 0.18), fh = Math.max(mh, 0.18);
    const dcol = kind === "keep" || kind === "barracks" ? DARKWOOD : style === "eastern" ? (civic ? [150, 52, 40] : DARKWOOD)
      : barnDoor ? (kind === "barn" && Bh(17) < 0.6 ? [150, 70, 50] : WOOD) : DOOR[Math.floor(Bh(8) * DOOR.length)];
    const surround = style === "eastern" ? C(trim) : mat === "stone" || grand || kind === "keep" ? C(mat === "stone" ? wall : STONE, 1.15) : C(trim, 0.9);
    Q(surround, d0 - fw, d1 + fw, base, base + dH + fh);
    const doorLit = night > 0.3 && (kind === "inn" || (kind === "temple" && hour < 22 && hour > 5));
    const leaf = doorLit ? "#f2b85a" : C(dcol);
    if (arch && dH - st > 1.2) { Q(leaf, d0, d1, base, base + dH - st); Q(leaf, d0 + dW * 0.18, d1 - dW * 0.18, base, base + dH); }
    else Q(leaf, d0, d1, base, base + dH);
    if (doorLit) { const [lx, ly] = at(dm / E, base + dH * 0.5); lights.push([lx, ly, Math.max(4, 2 * p)]); }
    else if (lod >= 1) {
      const lc = C(dcol, 0.7), hTop = base + dH - (arch ? st : 0);
      if (barnDoor) {
        const bc = C(dcol, 1.22);
        Q(bc, d0, d1, base + dH - fh, base + dH); Q(bc, d0, d1, base, base + fh);
        S(bc, d0, base + fh, dm - pw - mw / 2, base + dH - fh, pw); S(bc, d1 - pw, base + fh, dm + mw / 2, base + dH - fh, pw);
        if (lod >= 2) { S(bc, dm - pw - mw / 2, base + fh, d0, base + dH - fh, pw); S(bc, dm + mw / 2, base + fh, d1 - pw, base + dH - fh, pw); }
        Q(lc, dm - mw / 2, dm + mw / 2, base, base + dH);
      } else {
        if (lod >= 2) { const sp = Math.max(0.35, 2 * mw); for (let m = d0 + sp; m < d1 - mw; m += sp) if (!dbl || Math.abs(m - dm) > mw) Q(lc, m, m + mw, base, hTop); }
        if (dbl) Q(lc, dm - mw / 2, dm + mw / 2, base, base + dH);
        if (lod >= 2) { const hx0 = dbl ? dm + mw * 0.6 : d1 - Math.max(0.3, 1.5 * mw); Q(grand || civic ? GOLD : IRON, hx0, hx0 + mw, base + 1.0, base + 1.0 + mh); }
      }
      if (grand && kind === "rich" && !arch && lod >= 1) Q(dark, d0, d1, base + dH - Math.max(mh, 0.3), base + dH); // fanlight
    }
    if (stilt) { // a ladder down from the raised floor
      const lc = C(WOOD, 0.75), r0 = d0 + 0.1, r1 = d1 - 0.1 - mw;
      for (const m of [r0, r1]) B.path(lc, [O(m, 0, 0.8), O(m + mw, 0, 0.8), at((m + mw) / E, base), at(m / E, base)]);
      for (let k = 1; k <= 2; k++) { const t = k / 3, h = base * t, d = 0.8 * (1 - t); B.path(lc, [O(r0, h, d), O(r1 + mw, h, d), O(r1 + mw, h + mh, d), O(r0, h + mh, d)]); }
    } else if (lod >= 1) { // a stone step
      const s0 = d0 - 0.2, s1 = d1 + 0.2, sh = Math.max(mh, 0.2), sd = grand ? 0.7 : 0.45;
      B.path(C(STONE, 1.05), [O(s0, sh, 0), O(s1, sh, 0), O(s1, sh, sd), O(s0, sh, sd)]);
      B.path(C(STONE, 0.78), [O(s0, sh, sd), O(s1, sh, sd), O(s1, 0, sd), O(s0, 0, sd)]);
    }
  }

  // --- shop fronts: display windows either side of the door, under a striped awning
  if (shop) {
    const lit = night > 0.25 && hour > 6 && hour < 21, fc = C(trim, 0.9), fw = Math.max(mw, 0.15);
    const spans = [[aw0 + 0.25, (door ? d0 : dm) - 0.45], [(door ? d1 : dm) + 0.45, aw1 - 0.25]].filter(s => s[1] - s[0] >= 0.7);
    for (const s of spans) Q(fc, s[0] - fw, s[1] + fw, stilt + 0.75 - mh, stilt + 2.05 + mh);
    for (const s of spans) Q(lit ? LIT : GLASS, s[0], s[1], stilt + 0.8, stilt + 2.0);
    if (lit) for (const s of spans) { const [lx, ly] = at((s[0] + s[1]) / 2 / E, stilt + 1.4); lights.push([lx, ly, Math.max(3, 1.8 * p)]); }
    if (lod >= 2 && !lit) { // goods on the counter
      const gc = [C(TERRA), C(CLOTH[Math.floor(Bh(18) * CLOTH.length)]), C([214, 176, 110])];
      for (let i = 0; i < 3; i++) for (const s of spans) { const m = s[0] + (s[1] - s[0]) * (0.15 + 0.3 * i); Q(gc[i], m, m + Math.max(mw, 0.25), stilt + 0.8, stilt + 0.8 + Math.max(mh, 0.3) * (1 + (i % 2))); }
    }
    const ht = Math.min(H - 0.3, stilt + 2.75), hb = ht - 0.5, out = 1.0;
    Q("rgba(20,14,10,.28)", aw0, aw1, ht - 0.9, ht); // the awning's shadow on the wall
    const cl = CLOTH[Math.floor(Bh(9) * CLOTH.length)], nS = Math.max(2, Math.round((aw1 - aw0) / 0.5)), sw2 = (aw1 - aw0) / nS;
    const stripe = (col, i) => { const m0 = aw0 + i * sw2, m1 = m0 + sw2; B.path(col, [at(m0 / E, ht), at(m1 / E, ht), O(m1, hb, out), O(m0, hb, out)]); };
    for (let i = 0; i < nS; i += lod >= 1 ? 2 : 1) stripe(C(cl), i);
    if (lod >= 1) for (let i = 1; i < nS; i += 2) stripe(C([236, 228, 210]), i);
    const vh = Math.max(mh, 0.25);
    B.path(C(cl, 0.72), [O(aw0, hb, out), O(aw1, hb, out), O(aw1, hb - vh, out), O(aw0, hb - vh, out)]);
    if (lod >= 1) for (const m of [aw0 + 0.1, aw1 - 0.1 - mw]) B.path(C(WOOD, 0.7), [O(m, 0, out), O(m + mw, 0, out), O(m + mw, hb - vh, out), O(m, hb - vh, out)]);
  }

  // --- a hanging sign for the inn
  if (isFront && kind === "inn" && !arcade) {
    const ms = d1 + 1.0 + 0.5 < E ? d1 + 1.0 : Math.max(0.6, d0 - 1.0), hs = Math.min(H - 0.4, stilt + 3.5), out = 0.8;
    B.path(IRON, [at(ms / E, hs), at((ms + mw) / E, hs), O(ms + mw, hs, out), O(ms, hs, out)]);
    B.path(C(DOOR[Math.floor(Bh(19) * DOOR.length)], 1.1), [O(ms - 0.45, hs - 0.1, out), O(ms + 0.45, hs - 0.1, out), O(ms + 0.45, hs - 0.8, out), O(ms - 0.45, hs - 0.8, out)]);
    if (lod >= 1) B.path(GOLD, [O(ms - 0.15, hs - 0.3, out), O(ms + 0.15, hs - 0.3, out), O(ms + 0.15, hs - 0.3 - Math.max(mh * 1.5, 0.3), out), O(ms - 0.15, hs - 0.3 - Math.max(mh * 1.5, 0.3), out)]);
  }

  // --- banners either side of the door of halls, barracks and keeps
  if (banners.length) {
    const bc = C(HERALD[Math.floor(Bh(10) * HERALD.length)]), ht = H - 0.6, hb = Math.max(stilt + dH + 0.6, ht - 2.6);
    if (ht - hb > 1) {
      for (const m of banners) { Q(bc, m - 0.35, m + 0.35, hb + 0.3, ht); B.path(bc, [at((m - 0.35) / E, hb + 0.3), at((m + 0.35) / E, hb + 0.3), at(m / E, hb)]); }
      for (const m of banners) Q(GOLD, m - Math.max(mw, 0.15), m + Math.max(mw, 0.15), ht - 1.0, ht - 1.0 + Math.max(mh, 0.3));
      for (const m of banners) Q(IRON, m - 0.5, m + 0.5, ht, ht + mh);
    }
  }
  B.flush();
}

export function roofFace(g, r) {
  const { pts, tri, roofKind, roofCol, wall, nx, ny, p, poly, css, style, kind, seed, hash } = r;
  const ap = r.artPx || Math.max(1, p / ART), HZ = r.HZ || 0.8;
  const gableEnd = tri && roofKind === "gable";
  const lf = gableEnd ? 0.85 + 0.15 * Math.max(0, ny) : 0.72 + 0.34 * Math.max(0, ny * 0.8 - nx * 0.4) + (ny < 0 ? -0.08 : 0);
  poly(pts); g.fillStyle = css(gableEnd ? wall : roofCol, lf); g.fill();
  if (p < 3.5 || !hash) return;
  const lod = lodOf(p);
  // the plane as a (possibly degenerate) quad: eave edge A-B, ridge edge D-C (C = D = apex for a triangle)
  const A = pts[0], Bq = pts[1], Cq = pts[2], D = tri ? pts[2] : pts[3];
  const Le = Math.hypot(Bq[0] - A[0], Bq[1] - A[1]); if (Le < 3 * ap) return;
  const ex = (Bq[0] - A[0]) / Le, ey = (Bq[1] - A[1]) / Le;
  const mx = (D[0] + Cq[0] - A[0] - Bq[0]) / 2, my = (D[1] + Cq[1] - A[1] - Bq[1]) / 2, al = mx * ex + my * ey;
  let kx = mx - al * ex, ky = my - al * ey; const Ls = Math.hypot(kx, ky); if (Ls < 3 * ap) return; kx /= Ls; ky /= Ls; // k: up the slope, square to the eave
  const P = (u, s) => { const x0 = A[0] + (Bq[0] - A[0]) * u, y0 = A[1] + (Bq[1] - A[1]) * u, x1 = D[0] + (Cq[0] - D[0]) * u, y1 = D[1] + (Cq[1] - D[1]) * u; return [x0 + (x1 - x0) * s, y0 + (y1 - y0) * s]; };
  const add = (q, dx, dy) => [q[0] + dx, q[1] + dy];
  const B = batcher(g), col = k => css(roofCol, lf * k);
  const R = k => hash(seed % 100003, k, 500 + Math.round(nx * 7) * 13 + Math.round(ny * 7)); // varies per plane
  const rowLine = (c, s, th = 1) => { const q0 = P(0, s), q1 = P(1, s); B.path(c, [q0, q1, add(q1, kx * ap * th, ky * ap * th), add(q0, kx * ap * th, ky * ap * th)]); };
  const colLine = (c, u, s0, s1) => { const q0 = P(u, s0), q1 = P(u, s1); B.path(c, [q0, add(q0, ex * ap, ey * ap), add(q1, ex * ap, ey * ap), q1]); };
  const cell = (c, u0, u1, s0, s1) => B.path(c, [P(u0, s0), P(u1, s0), P(u1, s1), P(u0, s1)]);

  if (gableEnd) {
    if (ny > 0.05 && lod >= 1) {
      const M0 = [(A[0] + Bq[0]) / 2, (A[1] + Bq[1]) / 2], c = [M0[0] + (Cq[0] - M0[0]) * 0.3, M0[1] + (Cq[1] - M0[1]) * 0.3];
      const wHalf = Math.max(ap, Math.abs(Bq[0] - A[0]) * (kind === "barn" ? 0.13 : 0.06)), hHalf = (kind === "barn" ? 0.75 : 0.4) * p * HZ;
      if (wHalf * 2 < Math.abs(Bq[0] - A[0]) * 0.6) B.rect(kind === "barn" ? VOID : GLASS, c[0] - wHalf, c[1] - hHalf, 2 * wHalf, 2 * hHalf);
      if (style === "timber" && kind !== "barn" && kind !== "temple" && kind !== "hall") { // gable framing
        const tc = css(r.trim || [92, 62, 40], lf), L = [A[0] + (Cq[0] - A[0]) * 0.5, A[1] + (Cq[1] - A[1]) * 0.5], Rr = [Bq[0] + (Cq[0] - Bq[0]) * 0.5, Bq[1] + (Cq[1] - Bq[1]) * 0.5];
        B.path(tc, [A, Bq, add(Bq, 0, -ap), add(A, 0, -ap)]);
        B.path(tc, [add(M0, -ap / 2, 0), add(M0, ap / 2, 0), add(Cq, ap / 2, 0), add(Cq, -ap / 2, 0)]);
        B.path(tc, [L, Rr, add(Rr, 0, ap), add(L, 0, ap)]);
      }
    }
    B.flush(); return;
  }

  const cover = coverOf(style, kind), front = ny > -0.25;
  const dark = col(0.8), lite = col(1.12);
  if (cover === "glazed") {
    // rows of half-round tiles running down the slope, a bright line of tile ends at the eave
    const nC = Math.min(40, Math.floor(Le / (3 * ap)));
    for (let j = 0; j < nC; j++) colLine(dark, (j + 0.5) / nC, 0, 1);
    if (lod >= 1) for (let j = 0; j < nC; j++) colLine(lite, (j + 0.5) / nC + ap / Le, 0, 1);
    rowLine(col(1.3), 0, 1.2);
  } else {
    const rowPx = cover === "thatch" ? 5 * ap : 3 * ap, nR = Math.min(22, Math.floor(Ls / rowPx));
    if (lod >= 1 && front && cover !== "thatch") { // a few odd tiles
      const n = Math.min(6, Math.floor(Le * Ls / (90 * ap * ap))), du = 3 * ap / Le;
      for (const [k0, c] of [[0, col(1.1)], [50, cover === "slate" ? "rgba(96,112,140,.35)" : col(0.9)]]) for (let i = 0; i < n; i++) {
        const row = Math.floor(R(k0 + i) * Math.max(1, nR)), u = R(k0 + i + 20) * (1 - du);
        cell(c, u, u + du, row / Math.max(1, nR), (row + 1) / Math.max(1, nR));
      }
    }
    if (cover === "thatch") {
      rowLine(col(0.7), 0, 2); // the cut edge of the thatch at the eave
      // straw: short strokes running down the slope, a couple of faint layer lines
      if (lod >= 1) for (const s of [0.34, 0.67]) rowLine(col(0.92), s);
      const n = Math.min(front ? (lod >= 2 ? 64 : lod >= 1 ? 40 : 14) : 14, Math.floor(Le * Ls / (10 * ap * ap)));
      for (const [k0, c] of [[0, col(0.8)], [1, col(1.16)]]) for (let i = k0; i < n; i += 2) {
        const u = R(i * 3 + 1), s = 0.04 + R(i * 3 + 2) * 0.86, len = (3 + R(i * 3 + 3) * 4) * ap, q = P(u, s);
        B.path(c, [q, add(q, ex * ap, ey * ap), add(q, ex * ap + kx * len, ey * ap + ky * len), add(q, kx * len, ky * len)]);
      }
    } else {
      for (let i = 1; i < nR; i++) rowLine(dark, i / nR);
      if (cover === "tile" && lod >= 2) for (let i = 1; i < nR; i++) rowLine(lite, i / nR + 1.2 * ap / Ls);
      if (lod >= 2 && front && nR > 0) {
        const jointPx = cover === "tile" ? 4 * ap : 3 * ap;
        const nJ = Math.max(1, Math.min(Math.round(Le / jointPx), Math.floor(48 / nR)));
        for (let i = 0; i < nR; i++) for (let j = 0; j < nJ; j++) {
          const u = (j + (cover === "tile" ? 0.5 : (i % 2) * 0.5 + 0.25) + (cover === "shingle" ? (R(i * 37 + j) - 0.5) * 0.5 : 0)) / nJ;
          if (u > 0.02 && u < 0.98) colLine(dark, u, i / nR, (i + 1) / nR);
        }
      }
      rowLine(col(0.66), 0); // shadowed eave edge
    }
    // moss and weathering on some old roofs
    if (lod >= 1 && front && hash(seed % 100003, 91, 3) < 0.35) {
      const mc = cover === "thatch" ? "rgba(70,84,44,.5)" : "rgba(88,108,56,.55)", du = 2.5 * ap / Le, ds = 2 * ap / Ls;
      for (let i = 0, n = 2 + Math.floor(R(99) * 3); i < n; i++) {
        const u = R(100 + i) * (1 - 2 * du), s = R(200 + i) * 0.75;
        cell(mc, u, u + du, s, Math.min(1, s + ds)); cell(mc, u + du * 0.5, u + du * 1.6, s + ds * 0.5, Math.min(1, s + ds * 1.3));
      }
    }
  }
  B.flush();
  if (p >= 6) { g.strokeStyle = css(roofCol, 0.6, 0.5); g.lineWidth = ap; poly(pts); g.stroke(); }
}

export function flatRoof(g, r) {
  const { pts, roofCol, p, poly, css, up, hw, hd, H, kind } = r;
  const HZ = r.HZ || 0.8, ap = r.artPx || Math.max(1, p / ART);
  poly(pts); g.fillStyle = css(roofCol, 1.08); g.fill(); // parapet coping
  // the roof floor lies 0.8 m below the parapet; inside the parapet we see the floor and
  // the inner faces of the far parapets
  const ins = Math.max(0.4, 1.2 * ap / p);
  if (up && hw > ins + 0.5 && hd > ins + 0.5 && p >= 3.5) {
    const I = [up(-hw + ins, -hd + ins, H), up(hw - ins, -hd + ins, H), up(hw - ins, hd - ins, H), up(-hw + ins, hd - ins, H)];
    const dz = 0.8 * p * HZ, Fl = I.map(([x, y]) => [x, y + dz]), vis = clipConvex(Fl, I);
    const B = batcher(g);
    B.path(css(roofCol, 0.7), I);
    if (vis.length >= 3) B.path(css(roofCol, kind === "keep" ? 0.88 : 0.93), vis);
    B.flush();
  }
  g.strokeStyle = css(roofCol, 0.8); g.lineWidth = Math.max(1, 0.35 * p); poly(pts); g.stroke();
}

export function ridge(g, r) {
  const [r0, r1] = r.ridge, p = r.p, css = r.css, roofCol = r.roofCol;
  const ap = r.artPx || Math.max(1, p / ART), HZ = r.HZ || 0.8, zp = p * HZ;
  const cover = coverOf(r.style, r.kind), B = batcher(g);
  const dx = r1[0] - r0[0], dy = r1[1] - r0[1], L = Math.hypot(dx, dy);
  const ux = L > 1e-6 ? dx / L : 1, uy = L > 1e-6 ? dy / L : 0;
  let px = -uy, py = ux; if (py > 0) { px = -px; py = -py; } // square to the ridge, up the screen
  const band = (c, o0, th) => { if (L < ap) return; const o1 = o0 + th; B.path(c, [[r0[0] + px * o0, r0[1] + py * o0], [r1[0] + px * o0, r1[1] + py * o0], [r1[0] + px * o1, r1[1] + py * o1], [r0[0] + px * o1, r0[1] + py * o1]]); };
  if (cover === "thatch") {
    band(css(roofCol, 0.62), -ap, 2 * ap); band(css(roofCol, 1.06), ap, ap);
    if (p >= 7 && L > 2 * p) { const nb = Math.floor(L / (1.5 * p)), bc = css(roofCol, 0.5); for (let i = 0; i < nb; i++) { const t = (i + 0.5) / nb; B.rect(bc, r0[0] + dx * t - ap / 2, r0[1] + dy * t - 1.5 * ap, ap, 3 * ap); } }
    if (L < ap) B.rect(css(roofCol, 0.55), r0[0] - ap, r0[1] - 0.8 * zp, 2 * ap, 0.8 * zp); // the tied top of a round hut
  } else if (cover === "glazed") {
    band(css(roofCol, 0.45), -ap, 2 * ap); band(css(roofCol, 0.95), ap, ap);
    const hc = css(roofCol, 0.42);
    if (L >= ap) for (const [E0, s] of [[r0, -1], [r1, 1]]) { // curled ridge-end ornaments
      const ox = ux * s, oy = uy * s;
      B.path(hc, [[E0[0] - ox * 0.5 * p, E0[1] - oy * 0.5 * p], [E0[0] + ox * 0.25 * p, E0[1] + oy * 0.25 * p], [E0[0] + ox * 0.45 * p, E0[1] + oy * 0.45 * p - 1.0 * zp], [E0[0] - ox * 0.05 * p, E0[1] - oy * 0.05 * p - 0.6 * zp]]);
    } else { // a finial on a pyramid roof
      B.rect(hc, r0[0] - ap, r0[1] - 0.9 * zp, 2 * ap, 0.9 * zp);
      B.rect(GOLD, r0[0] - ap, r0[1] - 0.9 * zp - 2 * ap, 2 * ap, 2 * ap);
    }
  } else {
    band(css(roofCol, 0.55), -ap / 2, ap); band(css(roofCol, 1.08), ap / 2, ap);
  }
  if (L < ap && cover !== "thatch" && cover !== "glazed") B.rect(css(roofCol, 0.55), r0[0] - ap / 2, r0[1] - ap / 2, ap, ap);
  B.flush();
}

// a flag on a pole: x, yb the foot of the pole, ph its height and fw/fh the flag size, in canvas units
function flag(B, x, yb, ph, fw, fh, c1, c2, ap, lod) {
  const yt = yb - ph;
  B.rect(IRON, x - ap / 2, yt, ap, ph);
  B.path(c1, [[x, yt], [x + fw, yt + fh * 0.12], [x + fw * 0.78, yt + fh * 0.55], [x + fw, yt + fh], [x, yt + fh * 0.88]]);
  if (lod >= 1) B.path(c2, [[x, yt + fh * 0.36], [x + fw * 0.88, yt + fh * 0.42], [x + fw * 0.82, yt + fh * 0.6], [x, yt + fh * 0.62]]);
  B.rect(GOLD, x - ap, yt - ap, 2 * ap, ap);
}

export function extras(g, e) {
  const { p, H, R, hw, hd, long, style, kind, roofKind, roofCol, wall, seed, up, hash, css, night, lights } = e;
  if (!up || !hash || p < 3) return;
  const HZ = e.HZ || 0.8, ap = e.artPx || Math.max(1, p / ART), zp = p * HZ, lod = lodOf(p);
  const ang = e.ang || 0, ca = Math.cos(ang), sa = Math.sin(ang);
  const B = batcher(g);
  const wing = Math.round(hw * 10) * 131 + Math.round(hd * 10); // wings of one courtyard house differ
  const rnd = k => hash(seed % 100003, k, 313 + wing), bR = k => hash(seed % 100003, k, 77);
  const big = Math.min(hw, hd) >= 2.5; // not a narrow courtyard wing
  const heraldry = () => { const i = Math.floor(bR(10) * HERALD.length); return [css(HERALD[i]), css(HERALD[(i + 2) % HERALD.length])]; };

  if (roofKind === "flat") {
    const Hf = H - 0.8;
    if (kind === "keep") { // the lord's banner over the back corner
      let best = null;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const q = up(sx * Math.max(0.5, hw - 1), sy * Math.max(0.5, hd - 1), Hf); if (!best || q[1] < best[1]) best = q; }
      const [c1, c2] = heraldry();
      flag(B, best[0], best[1], 6.5 * zp, 2.4 * p, 1.5 * zp, c1, c2, ap, lod);
    } else if (style === "courtyard") roofTerrace();
  } else pitched();
  if (kind === "mill" && style !== "eastern") millSails();
  B.flush();

  function pitched() {
    const eave = style === "tropical" || style === "eastern" ? 0.6 : 0.3;
    const span = (long ? hd : hw) + eave, rl = roofKind === "hip" ? Math.max(0.2, long ? hw - hd : hd - hw) : (long ? hw : hd);
    const L = (a, c, h) => long ? up(a, c, h) : up(c, a, h); // a along the ridge, c across it
    const roofH = c => H + R * Math.max(0, 1 - Math.abs(c) / span);
    const fc = (long ? ca : sa) >= 0 ? 1 : -1, square = Math.abs(long ? ca : sa); // the slope facing the viewer

    // upturned eave corners
    if (style === "eastern" && lod >= 1) {
      const cx = up(0, 0, H), hc = css(roofCol, 0.6);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        const c = up(sx * (hw + eave), sy * (hd + eave), H); let ox = c[0] - cx[0], oy = c[1] - cx[1]; const ol = Math.hypot(ox, oy) || 1; ox /= ol; oy /= ol;
        B.path(hc, [[c[0] - ox * 0.7 * p, c[1] - oy * 0.7 * p], [c[0] + ox * 0.2 * p, c[1] + oy * 0.2 * p], [c[0] + ox * 0.55 * p, c[1] + oy * 0.55 * p - 0.9 * zp]]);
      }
    }

    // dormers on the front slope of big gabled roofs
    if (roofKind === "gable" && (style === "timber" || style === "stone") && (kind === "house" || kind === "rich" || kind === "inn" || kind === "library" || kind === "hall")
      && rl >= 4 && span >= 3.5 && square > 0.6 && p >= 4 && rnd(11) < (kind === "rich" ? 0.9 : 0.55)) {
      const n = rl >= 6.5 ? 2 : 1, c = fc * span * 0.5;
      for (let i = 0; i < n; i++) {
        const a = n === 1 ? 0 : (i ? 1 : -1) * rl * 0.4, fb = L(a, c, roofH(c)), bk = L(a, c - fc * 1.6, roofH(c));
        const bx = bk[0] - fb[0], by = bk[1] - fb[1], w = 0.9 * p, yt = fb[1] - 1.3 * zp, apex = yt - 0.9 * zp, ew = w + 0.2 * p;
        B.path(css(roofCol, 0.72), [[fb[0] - ew, yt], [fb[0], apex], [fb[0] + bx, apex + by], [fb[0] - ew + bx, yt + by]]);
        B.path(css(roofCol, 1.12), [[fb[0] + ew, yt], [fb[0], apex], [fb[0] + bx, apex + by], [fb[0] + ew + bx, yt + by]]);
        B.path(css(wall), [[fb[0] - w, fb[1]], [fb[0] + w, fb[1]], [fb[0] + w, yt], [fb[0], apex + ap], [fb[0] - w, yt]]);
        const lit = night > 0.25 && rnd(12 + i) < 0.4 * night;
        B.rect(css(e.trim || WOOD), fb[0] - 0.45 * p, yt + 0.15 * zp, 0.9 * p, 0.85 * zp);
        B.rect(lit ? LIT : GLASS, fb[0] - 0.3 * p, yt + 0.25 * zp, 0.6 * p, 0.65 * zp);
        if (lit) lights.push([fb[0], yt + 0.5 * zp, Math.max(3, 1.4 * p)]);
      }
    }

    // chimneys, some of them smoking
    const chimP = { house: 0.7, rich: 1, inn: 1, workshop: 1, shack: 0.5, farm: 0.6, library: 0.5, barracks: 0.6, hall: 0.35 }[kind] || 0;
    if (style !== "tropical" && style !== "eastern" && span > 1.5 && rnd(1) < chimP) {
      const n = (kind === "rich" || kind === "inn") && rl > 3 ? 2 : 1, cc = style === "stone" ? [126, 122, 116] : [146, 80, 60];
      for (let i = 0; i < n; i++) {
        const sgn = n === 2 ? (i ? 1 : -1) : (rnd(2) < 0.5 ? -1 : 1);
        const a = rl > 1.2 ? sgn * rl * (0.7 + rnd(3 + i) * 0.15) : 0, c = (rnd(5 + i) < 0.5 ? -1 : 1) * span * 0.28;
        const top = L(a, c, H + R + 0.9), base = L(a, c, roofH(c)), hwp = Math.max(ap, 0.35 * p), faceH = Math.max(ap, base[1] - top[1]);
        B.rect(css(cc, 0.95), top[0] - hwp, top[1] + hwp, 2 * hwp, faceH);
        if (lod >= 1) B.rect(css(cc, 0.75), top[0] + hwp - ap, top[1] + hwp, ap, faceH);
        B.rect(css(cc, 1.18), top[0] - hwp, top[1] - hwp, 2 * hwp, 2 * hwp);
        if (hwp >= 1.5 * ap) B.rect("rgb(36,30,28)", top[0] - hwp * 0.5, top[1] - hwp * 0.5, hwp, hwp);
        if (rnd(7 + i) < (kind === "workshop" ? 1 : 0.5)) {
          const sc = kind === "workshop" ? [118, 114, 110] : [226, 226, 230];
          for (let k = 0; k < (lod >= 1 ? 3 : 1); k++) {
            const s = (0.5 + 0.25 * k) * p;
            B.rect(css(sc, 1, 0.55 - k * 0.14), top[0] - s / 2 + (0.15 + 0.55 * k) * p, top[1] - (1.0 + 1.05 * k) * zp - s / 2, s, s * 0.8);
          }
        }
      }
    }

    // a bell turret with a weathervane on halls and markets
    if ((kind === "hall" || kind === "market" || (kind === "library" && bR(12) < 0.4)) && style !== "eastern" && style !== "tropical" && big) {
      const s = Math.max(0.7, Math.min(1.2, Math.min(hw, hd) / 5)), half = 0.9 * s * p, bodyH = 2.0 * s * zp;
      const tc = L(0, 0, H + R + 2.0 * s), x = tc[0], y = tc[1], faceTop = y + half;
      B.rect(css(wall), x - half, faceTop, 2 * half, bodyH);
      if (lod >= 1) B.rect(css(wall, 0.8), x + half * 0.55, faceTop, half * 0.45, bodyH);
      B.rect(VOID, x - half * 0.42, faceTop + bodyH * 0.2, half * 0.84, bodyH * 0.62);
      if (kind !== "library") B.rect("#c9a23e", x - half * 0.22, faceTop + bodyH * 0.24, half * 0.44, Math.max(ap, bodyH * 0.24));
      const ph = half * 1.3, apx = [x, y - 1.7 * s * zp];
      B.path(css(roofCol, 0.6), [[x - ph, y - ph], [x + ph, y - ph], apx]);
      B.path(css(roofCol, 0.85), [[x - ph, y - ph], [x - ph, y + ph], apx]);
      B.path(css(roofCol, 0.68), [[x + ph, y - ph], [x + ph, y + ph], apx]);
      B.path(css(roofCol, 1.0), [[x - ph, y + ph], [x + ph, y + ph], apx]);
      if (lod >= 1) vane(apx[0], apx[1]);
    }

    // weathervanes on some townhouses and inns
    if ((kind === "rich" || kind === "inn") && lod >= 1 && bR(13) < 0.5 && style !== "eastern" && style !== "tropical") {
      const v = L((rnd(14) < 0.5 ? -1 : 1) * rl * 0.9, 0, H + R); vane(v[0], v[1]);
    }

    // a flag over the barracks
    if (kind === "barracks") {
      const q = L(-Math.max(0, rl - 0.5), 0, H + R), [c1, c2] = heraldry();
      flag(B, q[0], q[1], 3.8 * zp, 1.8 * p, 1.1 * zp, c1, c2, ap, lod);
    }
  }

  function vane(x, y) {
    B.rect(IRON, x - ap / 2, y - 1.4 * zp, ap, 1.4 * zp);
    B.rect(IRON, x - 0.55 * p, y - 1.05 * zp, 1.1 * p, ap);
    B.path(IRON, [[x + 0.55 * p, y - 1.05 * zp - ap], [x + 0.55 * p + 2 * ap, y - 1.05 * zp + ap / 2], [x + 0.55 * p, y - 1.05 * zp + 2 * ap]]);
    if (lod >= 2) B.rect(GOLD, x - ap, y - 1.4 * zp - ap, 2 * ap, 2 * ap);
  }

  // rugs, water jars, plants, water tanks, wind catchers and washing on a courtyard-style roof
  function roofTerrace() {
    const Hf = H - 0.8, ax = hw - 0.35 - 0.7, ay = hd - 0.35 - 0.7;
    if (ax < 0.4 || ay < 0.2) return;
    let slots;
    if (ax >= 1.5 && ay >= 1.5) slots = [[-ax, -ay], [ax, -ay], [-ax, ay], [ax, ay], [0, 0]];
    else if (ax >= ay) slots = [[-ax, 0], [-ax / 3, 0], [ax / 3, 0], [ax, 0]];
    else slots = [[0, -ay], [0, -ay / 3], [0, ay / 3], [0, ay]];
    const items = [];
    const catcher = (kind === "rich" || kind === "hall" || (kind === "inn" && bR(21) < 0.5)) && big && rnd(20) < 0.6;
    let back = 0; slots.forEach((s, i) => { if (up(s[0], s[1], Hf)[1] < up(slots[back][0], slots[back][1], Hf)[1]) back = i; });
    slots.forEach(([x, y], i) => {
      if (catcher && i === back) { items.push(["catcher", x, y]); return; }
      const v = rnd(30 + i), roomX = ax - Math.abs(x), roomY = ay - Math.abs(y);
      const t = v < 0.18 ? "jars" : v < 0.34 ? "plant" : v < 0.44 ? "tank" : v < 0.54 ? "hatch" : v < 0.66 && roomX >= 0.9 && roomY >= 0.4 ? "rug" : v < 0.74 && roomX >= 0.9 ? "laundry" : null;
      if (t && (lod >= 1 || t === "tank" || t === "catcher")) items.push([t, x, y]);
    });
    // flat things first, then upright things back to front
    for (const [t, x, y] of items) {
      if (t === "rug") {
        const rw = Math.min(1.2, ax * 0.8), rd = Math.min(0.8, Math.max(0.5, ay * 0.8)), c = CLOTH[Math.floor(rnd(40) * CLOTH.length)];
        B.path(css(c), [up(x - rw, y - rd, Hf), up(x + rw, y - rd, Hf), up(x + rw, y + rd, Hf), up(x - rw, y + rd, Hf)]);
        if (lod >= 1) B.path(css(c, 1.35), [up(x - rw * 0.7, y - rd * 0.2, Hf), up(x + rw * 0.7, y - rd * 0.2, Hf), up(x + rw * 0.7, y + rd * 0.2, Hf), up(x - rw * 0.7, y + rd * 0.2, Hf)]);
      } else if (t === "hatch") {
        B.path(css(roofCol, 0.78), [up(x - 0.5, y - 0.5, Hf), up(x + 0.5, y - 0.5, Hf), up(x + 0.5, y + 0.5, Hf), up(x - 0.5, y + 0.5, Hf)]);
        B.path(VOID, [up(x - 0.32, y - 0.32, Hf), up(x + 0.32, y - 0.32, Hf), up(x + 0.32, y + 0.32, Hf), up(x - 0.32, y + 0.32, Hf)]);
      }
    }
    const upright = items.filter(it => it[0] !== "rug" && it[0] !== "hatch").map(it => ({ it, sy: up(it[1], it[2], Hf)[1] })).sort((m, n) => m.sy - n.sy);
    for (const { it: [t, x, y] } of upright) {
      const q = up(x, y, Hf);
      if (t === "jars") {
        const js = [[-0.3, -0.1], [0.3, 0.15]].map(([dx, dy]) => up(x + dx, y + dy, Hf)).sort((m, n) => m[1] - n[1]);
        for (const j of js) { B.rect(css(TERRA), j[0] - 0.22 * p, j[1] - 0.7 * zp, 0.44 * p, 0.7 * zp); B.rect(css(TERRA, 1.2), j[0] - 0.15 * p, j[1] - 0.7 * zp - ap, 0.3 * p, ap); }
      } else if (t === "plant") {
        B.rect(css(TERRA, 0.95), q[0] - 0.25 * p, q[1] - 0.45 * zp, 0.5 * p, 0.45 * zp);
        B.rect(css([66, 116, 58]), q[0] - 0.5 * p, q[1] - 1.15 * zp, p, 0.72 * zp);
        if (lod >= 1) B.rect(css([104, 156, 78]), q[0] - 0.4 * p, q[1] - 1.15 * zp, 0.45 * p, 0.32 * zp);
        if (lod >= 2 && rnd(41) < 0.5) B.rect(FLOWERS[Math.floor(rnd(42) * FLOWERS.length)], q[0] + 0.1 * p, q[1] - 1.05 * zp, ap, ap);
      } else if (t === "tank") {
        const r = 0.7 * p, ty = q[1] - 1.1 * zp;
        B.rect(css([176, 146, 108]), q[0] - r, ty, 2 * r, 1.1 * zp + 0.6 * r);
        if (lod >= 1) B.rect(css([130, 104, 76]), q[0] - r, ty + 0.55 * zp + 0.3 * r, 2 * r, ap);
        const o = 0.42 * r;
        B.path(css([198, 170, 130]), [[q[0] - o, ty - r], [q[0] + o, ty - r], [q[0] + r, ty - o], [q[0] + r, ty + o], [q[0] + o, ty + r], [q[0] - o, ty + r], [q[0] - r, ty + o], [q[0] - r, ty - o]]);
        B.rect("rgb(66,98,118)", q[0] - 0.55 * r, ty - 0.55 * r, 1.1 * r, 1.1 * r);
      } else if (t === "laundry") {
        const a0 = up(x - 0.9, y, Hf), a1 = up(x + 0.9, y, Hf), hh = 1.4 * zp, pc = css(WOOD, 0.8);
        B.rect(pc, a0[0] - ap / 2, a0[1] - hh, ap, hh); B.rect(pc, a1[0] - ap / 2, a1[1] - hh, ap, hh);
        B.path("rgba(70,60,50,.9)", [[a0[0], a0[1] - hh], [a1[0], a1[1] - hh], [a1[0], a1[1] - hh + ap], [a0[0], a0[1] - hh + ap]]);
        for (let k = 0; k < 3; k++) {
          const tt = 0.25 + 0.25 * k, cx = a0[0] + (a1[0] - a0[0]) * tt, cy = a0[1] + (a1[1] - a0[1]) * tt - hh + ap;
          B.rect(k === 1 ? css([236, 232, 220]) : css(CLOTH[Math.floor(rnd(43 + k) * CLOTH.length)]), cx - 0.2 * p, cy, 0.4 * p, 0.55 * zp);
        }
      } else if (t === "catcher") {
        const s = 0.8 * p, tp = up(x, y, Hf + 3.4), fh = q[1] - tp[1];
        B.rect(css(wall, 0.95), tp[0] - s, tp[1] + s, 2 * s, fh);
        B.rect(css(wall, 1.12), tp[0] - s, tp[1] - s, 2 * s, 2 * s);
        if (lod >= 1) { B.rect(VOID, tp[0] - s * 0.7, tp[1] + s + 0.4 * zp, s * 0.45, 1.2 * zp); B.rect(VOID, tp[0] + s * 0.25, tp[1] + s + 0.4 * zp, s * 0.45, 1.2 * zp); }
        B.rect(css(wall, 0.8), tp[0] - s - ap, tp[1] + s, 2 * s + 2 * ap, ap);
      }
    }
  }

  // windmill sails in front of the wall that faces the viewer
  function millSails() {
    const nrm = [[0, -1], [1, 0], [0, 1], [-1, 0]]; let best = 2, bv = -2;
    for (let i = 0; i < 4; i++) { const v = nrm[i][0] * sa + nrm[i][1] * ca; if (v > bv) { bv = v; best = i; } }
    const hh = H + (roofKind === "flat" ? 0.3 : R * 0.35), hub = up(nrm[best][0] * (hw + 0.6), nrm[best][1] * (hd + 0.6), hh);
    const rad = Math.min(8 * p, 0.92 * hh * zp), th = rnd(40) * Math.PI / 2, sail = css([228, 220, 198]), spar = "rgb(70,52,38)";
    const dirs = [0, 1, 2, 3].map(i => [Math.cos(th + i * Math.PI / 2), Math.sin(th + i * Math.PI / 2)]);
    for (const [dx, dy] of dirs) {
      const qx = -dy * rad * 0.2, qy = dx * rad * 0.2;
      B.path(sail, [[hub[0] + dx * rad * 0.22, hub[1] + dy * rad * 0.22], [hub[0] + dx * rad, hub[1] + dy * rad], [hub[0] + dx * rad + qx, hub[1] + dy * rad + qy], [hub[0] + dx * rad * 0.22 + qx, hub[1] + dy * rad * 0.22 + qy]]);
    }
    for (const [dx, dy] of dirs) {
      const qx = -dy * ap / 2, qy = dx * ap / 2;
      B.path(spar, [[hub[0] - qx, hub[1] - qy], [hub[0] + qx, hub[1] + qy], [hub[0] + dx * rad + qx, hub[1] + dy * rad + qy], [hub[0] + dx * rad - qx, hub[1] + dy * rad - qy]]);
      if (lod >= 2) { const m0 = [hub[0] + dx * rad * 0.22 - dy * rad * 0.1, hub[1] + dy * rad * 0.22 + dx * rad * 0.1]; B.path(spar, [[m0[0] - qx, m0[1] - qy], [m0[0] + qx, m0[1] + qy], [m0[0] + dx * rad * 0.78 + qx, m0[1] + dy * rad * 0.78 + qy], [m0[0] + dx * rad * 0.78 - qx, m0[1] + dy * rad * 0.78 - qy]]); }
    }
    B.rect(spar, hub[0] - ap, hub[1] - ap, 2 * ap, 2 * ap);
  }
}
