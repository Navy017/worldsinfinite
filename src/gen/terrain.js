import { clamp, lerp, makeRng, makeNoise, weightedPick, Heap } from "../core/util.js";
import { W, H } from "../core/tables.js";
import { bfsFrom, coastDistance, forCellsInRect } from "./mesh.js";
import { makeContinentShape } from "./shapes.js";

// Landmass shaping, plate tectonics, sea level, plateaus, depression filling, lakes and hillshade.
export function genTerrain(M, P, seed) {
  const rng = makeRng(seed + "|terrain"), nz = makeNoise(rng, W); // noise wraps east-west
  const { N, x, y, nStart, nbr } = M;
  const C = P.continents, landFrac = P.land / 100;
  const totalR = Math.sqrt(landFrac * W * H / Math.PI);
  const wAmp = totalR / Math.sqrt(C) * 0.42;

  // domain warp shared by all shape primitives, so coastlines wander
  const wx = new Float32Array(N), wy = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    wx[i] = x[i] + nz.pfbm(x[i], y[i], 0.0032, 4, 11.3) * wAmp;
    wy[i] = y[i] + nz.pfbm(x[i], y[i], 0.0032, 4, -5.7) * wAmp;
  }

  // continents: shapes from the shape library (see shapes.js), spread apart. Size weights are
  // log-normal, so size variety runs from near-equal continents (0) to one dominant landmass (100).
  const sigma = 0.08 + (P.sizeVariety ?? 40) / 100;
  const normal = () => Math.sqrt(-2 * Math.log(1 - rng.f())) * Math.cos(2 * Math.PI * rng.f());
  const ws = []; for (let c = 0; c < C; c++) ws.push(clamp(Math.exp(normal() * sigma), 0.08, 12));
  const wsum = ws.reduce((a, b) => a + b, 0), conts = [];
  ws.sort((a, b) => b - a); // place the biggest first; small ones fill the gaps
  for (let c = 0; c < C; c++) {
    const r = totalR * Math.sqrt(ws[c] / wsum) * 1.1, rot = rng.range(0, Math.PI * 2);
    const shape = makeContinentShape(rng, P.shapeStyle);
    // spacing radius: between the equal-area radius and the shape's full reach (long shapes need more room)
    const er = r * (0.5 + 0.5 * shape.reach);
    let best = null, bs = -Infinity;
    for (let t = 0; t < 80; t++) {
      const mx = Math.min(r * 0.7 + 60, W / 2), my = Math.min(r * 0.7 + 60, H / 2);
      const cx = rng.range(mx, W - mx), cy = rng.range(my, H - my);
      let s;
      if (!conts.length) s = C === 1 ? -Math.hypot(cx - W / 2, cy - H / 2) : rng.f();
      else { s = Infinity; for (const o of conts) s = Math.min(s, Math.hypot(cx - o.cx, cy - o.cy) - 0.95 * (er + o.er)); s += rng.f() * 30; }
      if (s > bs) { bs = s; best = { cx, cy }; }
    }
    const R = r * shape.scale, cs = Math.cos(rot), sn = Math.sin(rot), [au, av] = shape.anchor;
    conts.push({ cx: best.cx, cy: best.cy, r, er, R, cs, sn, sd: shape.sd, kind: shape.kind,
      ax: best.cx + (au * cs - av * sn) * R, ay: best.cy + (au * sn + av * cs) * R });
  }
  // how far inside a continent a point is: 1 near the heart, 0 on the coast, negative at sea
  const toLocal = (c, px, py) => { const dx = px - c.cx, dy = py - c.cy; return [(dx * c.cs + dy * c.sn) / c.R, (-dx * c.sn + dy * c.cs) / c.R]; };
  const cval = (c, px, py) => { const [u, w] = toLocal(c, px, py); return -c.sd(u, w); };
  // distance from the continent's anchor to its coast in a given direction (marched)
  const edgeR = (c, ang) => {
    const dx = Math.cos(ang), dy = Math.sin(ang), step = c.R * 0.03;
    for (let t = step; t < c.R * 4; t += step) if (cval(c, c.ax + dx * t, c.ay + dy * t) < 0) return t;
    return c.R * 4;
  };
  // keep the best and second-best continent value per cell; where two continents meet, a strait is
  // carved along the line halfway between them so they stay separate (noise may still bridge a few)
  const v = new Float32Array(N).fill(-3), strait = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let v1 = -3, v2 = -3;
    for (const c of conts) { const q = cval(c, wx[i], wy[i]); if (q > v1) { v2 = v1; v1 = q; } else if (q > v2) v2 = q; }
    strait[i] = C > 1 ? (v1 - v2) * 1.2 - 0.2 : 9;
    v[i] = Math.min(v1, strait[i]);
  }

  // peninsulas: tapered, bent arms reaching out from each continent. The setting is the
  // world average; each continent gets 0-2x of it, so some coasts are smooth and some ragged.
  const pens = [];
  for (const c of conts) {
    const n = Math.round(P.peninsulas * rng.range(0, 2));
    for (let k = 0; k < n; k++) {
      const ang = rng.range(0, Math.PI * 2), re = edgeR(c, ang), dx = Math.cos(ang), dy = Math.sin(ang);
      const ax = c.ax + dx * re * rng.range(0.55, 0.8), ay = c.ay + dy * re * rng.range(0.55, 0.8);
      const L = re * rng.range(0.55, 1.0), bx = ax + dx * L, by = ay + dy * L, bend = L * rng.range(-0.35, 0.35);
      const w0 = c.r * rng.range(0.1, 0.2);
      pens.push({ ax, ay, mx: (ax + bx) / 2 - dy * bend, my: (ay + by) / 2 + dx * bend, bx, by, w0, w1: w0 * rng.range(0.25, 0.5) });
    }
  }
  let segT = 0;
  const segD = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t; segT = t;
    const qx = ax + t * dx - px, qy = ay + t * dy - py; return Math.sqrt(qx * qx + qy * qy);
  };
  for (const p of pens) {
    const bx0 = Math.min(p.ax, p.mx, p.bx) - p.w0, bx1 = Math.max(p.ax, p.mx, p.bx) + p.w0;
    const by0 = Math.min(p.ay, p.my, p.by) - p.w0, by1 = Math.max(p.ay, p.my, p.by) + p.w0;
    for (let i = 0; i < N; i++) {
      const px = wx[i], py = wy[i];
      if (px < bx0 || px > bx1 || py < by0 || py > by1) continue;
      const d1 = segD(px, py, p.ax, p.ay, p.mx, p.my), t1 = segT;
      const d2 = segD(px, py, p.mx, p.my, p.bx, p.by), t2 = segT;
      const T = d1 < d2 ? t1 * 0.5 : 0.5 + t2 * 0.5, d = Math.min(d1, d2), w = lerp(p.w0, p.w1, T);
      const q = (1 - d / w) * 0.5; if (q > v[i]) v[i] = q;
    }
  }

  // islands and archipelago chains, placed in open water
  const oceanAt = (px, py) => { let b = -3; for (const c of conts) b = Math.max(b, cval(c, px, py)); return b; };
  const isles = [];
  const nSingle = Math.round(P.islands * 0.35), nChain = Math.round(P.islands / 16);
  for (let k = 0, tries = 0; k < nSingle && tries < nSingle * 30; tries++) {
    const px = rng.range(60, W - 60), py = rng.range(60, H - 60), o = oceanAt(px, py);
    if (o < -0.08 && o > -1.6) { isles.push({ x: px, y: py, r: rng.range(9, 28) }); k++; }
  }
  for (let k = 0, tries = 0; k < nChain && tries < nChain * 30; tries++) {
    let px = rng.range(80, W - 80), py = rng.range(80, H - 80);
    if (oceanAt(px, py) > -0.12) continue;
    let ang = rng.range(0, Math.PI * 2); const r0 = rng.range(8, 18), cnt = rng.int(4, 10);
    for (let j = 0; j < cnt; j++) {
      px += Math.cos(ang) * r0 * rng.range(1.6, 2.4); py += Math.sin(ang) * r0 * rng.range(1.6, 2.4); ang += rng.range(-0.35, 0.35);
      if (px < 50 || px > W - 50 || py < 50 || py > H - 50) break;
      isles.push({ x: px, y: py, r: r0 * rng.range(0.6, 1.3) });
    }
    k++;
  }
  for (const is of isles) {
    const lim = is.r * 2.5;
    forCellsInRect(M, is.x - lim, is.y - lim, is.x + lim, is.y + lim, i => {
      const qx = x[i] + (wx[i] - x[i]) * 0.2, qy = y[i] + (wy[i] - y[i]) * 0.2;
      const q = (1 - Math.hypot(qx - is.x, qy - is.y) / is.r) * 0.55; if (q > v[i]) v[i] = q;
    });
  }

  // inland seas and gulfs carved out of continents
  const seas = [];
  for (let k = 0; k < P.seas; k++) {
    const c = weightedPick(rng, conts, o => o.r), ang = rng.range(0, Math.PI * 2), re = edgeR(c, ang), off = rng.range(0.1, 0.95);
    const s = { x: c.ax + Math.cos(ang) * re * off, y: c.ay + Math.sin(ang) * re * off, r: c.r * rng.range(0.14, 0.3) };
    seas.push(s);
    const lim = s.r + wAmp * 0.3;
    forCellsInRect(M, s.x - lim, s.y - lim, s.x + lim, s.y + lim, i => {
      const qx = x[i] + (wx[i] - x[i]) * 0.3, qy = y[i] + (wy[i] - y[i]) * 0.3;
      const d = Math.hypot(qx - s.x, qy - s.y) / s.r; if (d < 1) v[i] -= 1.3 * (1 - d * d);
    });
  }

  const h = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let vv = Math.min(v[i], strait[i]); // peninsulas and islands may not grow across a strait
    const de = Math.min(x[i], W - x[i], y[i], H - y[i]);
    if (de < 100) { const f = 1 - de / 100; vv -= f * f * 2; }
    h[i] = 0.34 * Math.tanh(2.6 * vv) + 0.11 * nz.pfbm(x[i], y[i], 0.0045, 5, 3) + 0.035 * nz.pfbm(x[i], y[i], 0.028, 3, 0);
  }

  // tectonic plates: mountains rise where plates collide
  const nPl = C * 2 + 4, plates = [];
  for (let k = 0; k < nPl; k++) { const a = rng.range(0, Math.PI * 2), sp = rng.range(0.2, 1); plates.push({ x: rng.range(0, W), y: rng.range(0, H), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }); }
  const plX = new Float32Array(nPl), plY = new Float32Array(nPl);
  plates.forEach((p, k) => { plX[k] = p.x; plY[k] = p.y; });
  const plate = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    let b = 0, bd = Infinity; const px = wx[i], py = wy[i];
    for (let k = 0; k < nPl; k++) { let dx = px - plX[k]; dx -= W * Math.round(dx / W); const dy = py - plY[k], d = dx * dx + dy * dy; if (d < bd) { bd = d; b = k; } }
    plate[i] = b;
  }
  // The mesh doesn't wrap, so cells in the first and last grid columns are linked across the
  // east-west seam here, letting collisions and mountain ranges continue round the world.
  const { cols, rows } = M;
  const wrapDx = d => d - W * Math.round(d / W);
  const seamNbrs = (i, fn) => {
    const c = i % cols; if (c !== 0 && c !== cols - 1) return;
    const r = (i / cols) | 0, oc = c === 0 ? cols - 1 : 0;
    for (let dr = -1; dr <= 1; dr++) { const rr = r + dr; if (rr >= 0 && rr < rows) fn(rr * cols + oc); }
  };
  const conv = new Float32Array(N);
  const collide = (a, b) => {
    if (plate[a] === plate[b]) return;
    const dx = wrapDx(x[b] - x[a]), dy = y[b] - y[a], len = Math.hypot(dx, dy) || 1;
    const pa = plates[plate[a]], pb = plates[plate[b]];
    const c = ((pa.vx - pb.vx) * dx + (pa.vy - pb.vy) * dy) / len;
    if (c > 0.1) { const cc = Math.min(c, 1.2); if (cc > conv[a]) conv[a] = cc; if (cc > conv[b]) conv[b] = cc; }
  };
  for (let e = 0; e < M.E; e++) collide(M.eA[e], M.eB[e]);
  for (let r = 0; r < rows; r++) seamNbrs(r * cols, b => collide(r * cols, b));
  const mdist = new Float64Array(N).fill(Infinity), mstr = new Float32Array(N), heap = new Heap(); // Float64 so queue keys compare exactly
  for (let i = 0; i < N; i++) if (conv[i] > 0) { mdist[i] = 0; mstr[i] = conv[i]; heap.push(i, 0); }
  const width = rng.range(26, 42), maxD = width * 3.2;
  while (heap.size) {
    const c = heap.pop(), dc = heap.lk; if (dc > mdist[c]) continue;
    const relax = n => {
      const nd = dc + Math.hypot(wrapDx(x[n] - x[c]), y[n] - y[c]);
      if (nd < mdist[n] && nd < maxD) { mdist[n] = nd; mstr[n] = mstr[c]; heap.push(n, nd); }
    };
    for (let k = nStart[c]; k < nStart[c + 1]; k++) relax(nbr[k]);
    seamNbrs(c, relax);
  }
  const mStr = new Float32Array(N), amp = P.mountains / 100 * 0.62;
  for (let i = 0; i < N; i++) {
    if (mdist[i] === Infinity) continue;
    const d = mdist[i], rid = nz.pridged(x[i], y[i], 0.012, 4, 50);
    mStr[i] = mstr[i] * (Math.exp(-((d / width) ** 2)) + 0.3 * Math.exp(-d / (width * 2.2))) * (0.25 + 0.95 * rid * rid);
    h[i] += mStr[i] * amp * (h[i] > -0.05 ? 1 : 0.55);
  }

  // sea level chosen so land covers exactly the requested share
  const sorted = Float32Array.from(h).sort();
  const sl = sorted[Math.floor((1 - landFrac) * (N - 1))];
  const e = new Float32Array(N), depth = new Float32Array(N), type = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (h[i] > sl) e[i] = Math.min(1, (h[i] - sl) / 0.8);
    else depth[i] = Math.min(1, (sl - h[i]) / 0.45);
  }
  // ocean = water connected to the map edge
  const edgeSrc = [];
  for (let i = 0; i < N; i++) if (h[i] <= sl && (x[i] < M.s * 1.5 || x[i] > W - M.s * 1.5 || y[i] < M.s * 1.5 || y[i] > H - M.s * 1.5)) edgeSrc.push(i);
  const od = bfsFrom(M, edgeSrc, n => h[n] <= sl);
  const enclosed = new Uint8Array(N);
  for (let i = 0; i < N; i++) { if (od[i] >= 0) type[i] = 1; else if (h[i] <= sl) enclosed[i] = 1; }

  // plateaus: flat-topped raised tablelands
  let cd = coastDistance(M, i => type[i] === 0);
  const plateau = new Uint8Array(N), plateaus = [];
  const cand = []; for (let i = 0; i < N; i++) if (type[i] === 0 && !enclosed[i] && cd[i] >= 3 && e[i] > 0.05 && e[i] < 0.5) cand.push(i);
  for (let k = 0; k < P.plateaus && cand.length; k++) {
    const c0 = rng.pick(cand), px = x[c0], py = y[c0], rp = rng.range(35, 80), target = rng.range(0.38, 0.5), lim = rp * 1.6;
    forCellsInRect(M, px - lim, py - lim, px + lim, py + lim, i => {
      if (type[i] !== 0 || enclosed[i]) return;
      const d = Math.hypot(x[i] - px, y[i] - py) / rp; if (d > 1.6) return;
      const mask = clamp((1 - (d + nz.pfbm(x[i], y[i], 0.018, 3, k * 7) * 0.3)) * 4, 0, 1);
      if (mask <= 0) return;
      const eT = e[i] > target ? target + (e[i] - target) * 0.3 : target + nz.pn2(x[i], y[i], 0.05) * 0.01;
      e[i] += (eT - e[i]) * mask;
      if (mask > 0.5) plateau[i] = k + 1;
    });
    plateaus.push({ x: px, y: py });
  }

  // priority-flood: fills depressions and gives every land cell a downhill path to the sea
  const filled = new Float32Array(N), down = new Int32Array(N).fill(-1), vis = new Uint8Array(N);
  const order = new Int32Array(N); let on = 0;
  const hp = new Heap();
  for (let i = 0; i < N; i++) if (type[i] === 1) vis[i] = 1;
  for (let i = 0; i < N; i++) {
    if (type[i] !== 1) continue;
    for (let k = nStart[i]; k < nStart[i + 1]; k++) { const n = nbr[k]; if (!vis[n]) { vis[n] = 1; filled[n] = e[n]; down[n] = i; hp.push(n, e[n]); } }
  }
  while (hp.size) {
    const c = hp.pop(); order[on++] = c;
    for (let k = nStart[c]; k < nStart[c + 1]; k++) {
      const n = nbr[k]; if (vis[n]) continue;
      vis[n] = 1; filled[n] = Math.max(e[n], filled[c] + 1e-6); down[n] = c; hp.push(n, filled[n]);
    }
  }

  // lakes: the deepest depressions plus any enclosed water
  const lakeC = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (type[i] === 0 && (enclosed[i] || filled[i] - e[i] > 0.008)) lakeC[i] = 1;
  const seen = new Uint8Array(N), comps = [];
  for (let i = 0; i < N; i++) {
    if (!lakeC[i] || seen[i]) continue;
    const cells = [i]; seen[i] = 1; let enc = enclosed[i];
    for (let q = 0; q < cells.length; q++) { const c = cells[q]; for (let k = nStart[c]; k < nStart[c + 1]; k++) { const n = nbr[k]; if (lakeC[n] && !seen[n]) { seen[n] = 1; cells.push(n); if (enclosed[n]) enc = 1; } } }
    comps.push({ cells, enc });
  }
  comps.sort((a, b) => b.cells.length - a.cells.length);
  const maxLakes = 6 + Math.round(P.provinces / 45), lakes = [];
  for (const c of comps) {
    if (!c.enc && (lakes.length >= maxLakes || c.cells.length < 2)) continue;
    lakes.push({ cells: c.cells });
    for (const i of c.cells) type[i] = 2;
  }
  cd = coastDistance(M, i => type[i] === 0);

  // hillshade (light from the north-west) and slope
  const shade = new Float32Array(N), slope = new Float32Array(N);
  const Lx = -0.539, Ly = -0.539, Lz = 0.647;
  for (let i = 0; i < N; i++) {
    const ei = type[i] === 0 ? e[i] : 0; let gx = 0, gy = 0, cnt = 0;
    for (let k = nStart[i]; k < nStart[i + 1]; k++) {
      const n = nbr[k], dx = x[n] - x[i], dy = y[n] - y[i], d2 = dx * dx + dy * dy || 1, de = (type[n] === 0 ? e[n] : 0) - ei;
      gx += de * dx / d2; gy += de * dy / d2; cnt++;
    }
    gx /= (cnt * 0.5) || 1; gy /= (cnt * 0.5) || 1;
    slope[i] = Math.hypot(gx, gy);
    const nx = -gx * 38, ny = -gy * 38, len = Math.sqrt(nx * nx + ny * ny + 1);
    shade[i] = type[i] === 0 ? clamp(1 + ((nx * Lx + ny * Ly + Lz) / len - Lz) * 1.6, 0.5, 1.4) : 1;
  }
  // soften cell-to-cell shading so the relief reads as terrain, not a mosaic
  for (let pass = 0; pass < 2; pass++) {
    const prev = shade.slice();
    for (let i = 0; i < N; i++) {
      if (type[i] !== 0) continue;
      let s = prev[i] * 2, c = 2;
      for (let k = nStart[i]; k < nStart[i + 1]; k++) { const n = nbr[k]; if (type[n] === 0) { s += prev[n]; c++; } }
      shade[i] = s / c;
    }
  }
  return { e, depth, type, mStr, plateau, plateaus, seas, filled, down, order, lakes, coastDist: cd, shade, slope, contShapes: conts.map(c => c.kind) };
}
