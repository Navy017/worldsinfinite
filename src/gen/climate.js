import { clamp, makeRng, makeNoise } from "../core/util.js";
import { W, H, B } from "../core/tables.js";
import { findCell } from "./mesh.js";

// Temperature, moisture (prevailing winds + rain shadow), river flow and biomes.
export function genClimate(M, T, P, seed) {
  const rng = makeRng(seed + "|climate"), nz = makeNoise(rng, W); // noise wraps east-west
  const { N, x, y, nStart, nbr } = M, { e, type, down, order } = T;
  const clim = P.climate / 100, wet = P.moisture / 100;
  const temp = new Float32Array(N), moist = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const lat = Math.abs(y[i] / H - 0.5) * 2;
    let t = 30 - 44 * Math.pow(lat, 1.5) + clim * 9 + nz.pfbm(x[i], y[i], 0.005, 3) * 2.5;
    if (type[i] !== 1) t -= e[i] * 34;
    temp[i] = t;
  }

  // moisture: walk upwind until we hit water; mountains in between cast a rain shadow.
  // Trade winds blow from the east near the equator and poles, westerlies in between.
  const STEP = 26, STEPS = 14, FALL = 520;
  for (let i = 0; i < N; i++) {
    if (type[i] !== 0) { moist[i] = 1; continue; }
    const lat = Math.abs(y[i] / H - 0.5) * 2, dir = (lat < 0.33 || lat > 0.68) ? 1 : -1;
    let maxE = e[i], inf = 0;
    for (let k = 1; k <= STEPS; k++) {
      const px = x[i] + dir * k * STEP;
      if (px < 0 || px > W) { inf = Math.exp(-k * STEP / FALL); break; }
      const j = findCell(M, px, y[i]);
      if (type[j] !== 0) { inf = Math.exp(-k * STEP / FALL) * (type[j] === 1 ? 1 : 0.55); break; }
      if (e[j] > maxE) maxE = e[j];
    }
    const shadow = clamp((maxE - e[i]) * 1.8, 0, 0.8);
    const coast = Math.exp(-T.coastDist[i] * M.s / 260);
    const band = 0.13 * Math.cos(lat * Math.PI * 3);
    moist[i] = clamp(0.14 + 0.62 * Math.max(inf * (1 - shadow), coast * 0.75) + band - shadow * 0.25 + nz.pfbm(x[i], y[i], 0.006, 3, 40) * 0.14 + wet * 0.22, 0, 1);
  }

  // flow accumulation along the priority-flood drainage tree
  const flux = new Float32Array(N);
  for (let i = 0; i < N; i++) if (type[i] !== 1) flux[i] = 0.15 + moist[i];
  for (let q = order.length - 1; q >= 0; q--) { const c = order[q], d = down[c]; if (d >= 0 && type[d] !== 1) flux[d] += flux[c]; }
  const riverT = 2600 / (M.s * M.s);
  const river = new Uint8Array(N), bestUp = new Int32Array(N).fill(-1), bf = new Float32Array(N);
  for (let i = 0; i < N; i++) if (type[i] === 0 && flux[i] > riverT) river[i] = 1;
  for (let i = 0; i < N; i++) { const d = down[i]; if (d >= 0 && type[i] !== 1 && flux[i] > bf[d]) { bf[d] = flux[i]; bestUp[d] = i; } }
  for (let i = 0; i < N; i++) {
    if (!river[i]) continue;
    moist[i] = Math.min(1, moist[i] + 0.1);
    for (let k = nStart[i]; k < nStart[i + 1]; k++) { const n = nbr[k]; if (type[n] === 0) moist[n] = Math.min(1, moist[n] + 0.05); }
  }

  // river geometry: quadratic curves through cell midpoints, sorted by width for batched drawing
  const segs = [];
  for (let i = 0; i < N; i++) {
    if (!river[i]) continue; const d = down[i]; if (d < 0) continue;
    const u = bestUp[i], hasUp = u >= 0 && (river[u] || type[u] === 2);
    const sx = hasUp ? (x[u] + x[i]) / 2 : x[i], sy = hasUp ? (y[u] + y[i]) / 2 : y[i];
    let ex, ey;
    if (type[d] !== 0) { ex = x[i] + (x[d] - x[i]) * 0.75; ey = y[i] + (y[d] - y[i]) * 0.75; }
    else if (bestUp[d] === i) { ex = (x[i] + x[d]) / 2; ey = (y[i] + y[d]) / 2; }
    else { ex = x[d]; ey = y[d]; }
    const w = clamp(0.35 + 0.42 * Math.sqrt(flux[i] / riverT), 0.35, 4.2);
    segs.push([Math.round(w * 4) / 4, sx, sy, x[i], y[i], ex, ey]);
  }
  segs.sort((a, b) => a[0] - b[0]);
  const riverSegs = new Float32Array(segs.length * 7); segs.forEach((s, k) => riverSegs.set(s, k * 7));

  // biomes (Whittaker-style on temperature x moisture) and terrain classes
  const biome = new Uint8Array(N).fill(255), terr = new Uint8Array(N).fill(255);
  for (let i = 0; i < N; i++) {
    if (type[i] !== 0) continue;
    const t = temp[i], m = moist[i], ee = e[i];
    let b;
    if (ee > 0.72 || (ee > 0.55 && t < -6)) b = B.peaks;
    else if (ee > 0.55) b = B.alpine;
    else if (t < -10) b = B.glacier;
    else if (t < -1) b = B.tundra;
    else if (ee < 0.07 && T.slope[i] < 0.003 && m > 0.62 && t > 2) b = (t > 20 && T.coastDist[i] <= 1) ? B.mangrove : B.swamp;
    else if (t < 6) b = m < 0.28 ? B.coldsteppe : B.boreal;
    else if (t < 18) b = m < 0.16 ? B.colddesert : m < 0.34 ? ((ee > 0.2 && m < 0.25) ? B.badlands : B.grass) : m < 0.66 ? B.tempforest : B.temprain;
    else b = m < 0.18 ? (ee > 0.18 ? B.badlands : B.desert) : m < 0.36 ? B.savanna : m < 0.62 ? B.dryforest : B.rainforest;
    biome[i] = b;
    terr[i] = (T.plateau[i] && ee < 0.64) ? 4 : ee < 0.2 ? 0 : ee < 0.42 ? 1 : ee < 0.64 ? 2 : 3;
  }
  return { temp, moist, flux, river, riverT, bestUp, biome, terr, riverSegs, riverCount: segs.length };
}
