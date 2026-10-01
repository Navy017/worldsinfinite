import { clamp, makeRng, makeNoise } from "../core/util.js";
import { W, H } from "../core/tables.js";
import { findCell } from "./lookup.js";

// World-space sampling shared by every zoom level below the world map. Everything here is a
// pure function of world coordinates, so two provinces (or a province and a town inside it)
// that sample the same point always agree: coasts, heights, rivers and roads line up across
// borders without the provinces ever talking to each other.

const cache = new WeakMap();

export function localContext(G) {
  let ctx = cache.get(G);
  if (ctx) return ctx;
  const { M, T, C } = G, x = M.x, y = M.y, kmPx = G.worldKm / W;
  const nz = makeNoise(makeRng(G.seed + "|local"), W); // noise wraps east-west
  const sig2 = (0.75 * M.s) ** 2;
  // unit conversions: world units <-> km, and a frequency for a given wavelength in km
  const freq = km => kmPx / km;

  // smooth blend of the cells around a point: land share, lake share, elevation
  function blend(wx, wy, out) {
    const c = findCell(M, wx, wy);
    let sw = 0, sl = 0, sk = 0, se = 0, sle = 0;
    const add = i => {
      const w = Math.exp(-((x[i] - wx) ** 2 + (y[i] - wy) ** 2) / sig2), t = T.type[i];
      sw += w; if (t === 0) { sl += w; sle += w * T.e[i]; } else if (t === 2) sk += w;
      se += w * (t === 1 ? -T.depth[i] * 0.5 : T.e[i]);
    };
    add(c);
    for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) add(M.nbr[k]);
    out.cell = c; out.land = sl / sw; out.lake = sk / sw; out.e = se / sw; out.eLand = sl > 0 ? sle / sl : 0;
    return out;
  }

  // The coastline, shared by every zoom level. The smooth land share from blend() sets where the
  // coast roughly is; fractal detail from ~40 km down to ~25 m is added on top, each octave only
  // once the sampling is fine enough to show it (resKm = sample spacing). Coarse views are the same
  // coast minus its smallest wiggles, so zooming in adds detail instead of redrawing the shore.
  // Coasts have character: where high ground meets the sea they are rugged (rougher fractal,
  // offshore skerries, cliffs); low plains get smooth sweeping shores and beaches; cold mountain
  // coasts are cut by fjords. Returns the land value (land where > 0.5) and sets out.rug.
  const OCT = [40, 19, 9, 4.3, 2, 0.95, 0.45, 0.21, 0.1, 0.05, 0.024];
  const OCT_F = OCT.map(freq), WARP_F = freq(30), FJ_F = freq(16), CH_F = freq(160);
  function landAt(wx, wy, out, resKm = 0.05) {
    blend(wx, wy, out);
    const b = out.land;
    if (b < 0.06 || b > 0.94) { out.rug = 0; return b + coastSmooth(wx, wy); }
    const ch = nz.pfbm(wx, wy, CH_F, 2, 1200);
    const rug = clamp(0.3 + ch * 1.4 + (out.eLand - 0.15) * 3, 0, 1);
    const Hx = 0.8 - 0.4 * rug, A0 = 0.16 + 0.16 * rug;
    const wa = 5 / kmPx * (0.5 + rug);
    const qx = wx + nz.pn2(wx, wy, WARP_F, 21) * wa, qy = wy + nz.pn2(wx, wy, WARP_F, 22) * wa;
    let v = 0;
    for (let i = 0; i < OCT.length; i++) {
      if (OCT[i] < resKm * 1.6) break;
      v += nz.pn2(qx, qy, OCT_F[i], 30 + i) * A0 * Math.pow(OCT[i] / 40, Hx);
    }
    // fjords: long narrow inlets on cold, rugged coasts
    const lat = Math.abs(wy / H - 0.5) * 2, fj = clamp((lat - 0.5) * 4, 0, 1) * clamp((rug - 0.4) * 3, 0, 1);
    if (fj > 0 && b > 0.25) {
      const r = 1 - Math.abs(nz.pn2(qx, qy * 0.6, FJ_F, 60));
      v -= fj * Math.pow(r, 7) * 0.7 * clamp((0.97 - b) * 3, 0, 1);
    }
    out.rug = rug;
    return b + v;
  }
  // the cell whose biome/owner applies here, with a little warp so borders aren't straight lines
  function ownerCell(wx, wy) {
    const s = M.s * 0.35;
    const c = findCell(M, wx + nz.pn2(wx, wy, freq(9)) * s, wy + nz.pn2(wx, wy, freq(9), 40) * s);
    if (T.type[c] === 0) return c;
    // land tile over a water cell's area: fall back to the nearest land neighbour
    let best = -1, bd = Infinity;
    for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) {
      const n = M.nbr[k]; if (T.type[n] !== 0) continue;
      const d = (x[n] - wx) ** 2 + (y[n] - wy) ** 2; if (d < bd) { bd = d; best = n; }
    }
    return best;
  }
  // coast wiggle and terrain detail, all in world space
  const coastSmooth = (wx, wy) => nz.pfbm(wx, wy, freq(7), 4) * 0.2;
  const coastNoise = (wx, wy) => coastSmooth(wx, wy) + nz.pn2(wx, wy, freq(1.6), 3) * 0.05;
  const detail = (wx, wy) => nz.pfbm(wx, wy, freq(9), 5, 100);
  // forests: large coherent masses (~20 km) with ragged edges from a finer layer
  const forestNoise = (wx, wy) => nz.pfbm(wx, wy, freq(22), 3, -300) + nz.pfbm(wx, wy, freq(3), 3, 11) * 0.22;
  // farmland reach varies around each settlement
  const farmNoise = (wx, wy) => nz.pfbm(wx, wy, freq(5), 3, 900);
  const rockNoise = (wx, wy) => nz.pfbm(wx, wy, freq(3), 3, 500);

  // Walk a set of quadratic segments (river or road geometry from the world stage) and call
  // stamp(px, py, radiusWorld, segIndex) at points no further apart than `step` world units.
  // A meander offset along the normal, taken from world-space noise, keeps both sides of any
  // border in agreement.
  function traceSegs(segs, count, bbox, step, widthOf, meanderKm, meanderAmpKm, stamp) {
    const [bx0, by0, bx1, by1] = bbox;
    for (let q = 0; q < count; q++) {
      const o = q * 7, x0 = segs[o + 1], y0 = segs[o + 2], cx = segs[o + 3], cy = segs[o + 4], x1 = segs[o + 5], y1 = segs[o + 6];
      const r = widthOf(segs[o]), pad = r + meanderAmpKm / kmPx * 1.5;
      if (Math.max(x0, cx, x1) < bx0 - pad || Math.min(x0, cx, x1) > bx1 + pad || Math.max(y0, cy, y1) < by0 - pad || Math.min(y0, cy, y1) > by1 + pad) continue;
      const L = Math.hypot(cx - x0, cy - y0) + Math.hypot(x1 - cx, y1 - cy), n = Math.max(2, Math.ceil(L / step));
      for (let s = 0; s <= n; s++) {
        const t = s / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
        const px = a * x0 + b * cx + c * x1, py = a * y0 + b * cy + c * y1;
        let tx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), ty = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
        const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const m = nz.pn2(px, py, freq(meanderKm), 7) * meanderAmpKm / kmPx;
        stamp(px - ty * m, py + tx * m, r, q);
      }
    }
  }

  ctx = { G, M, T, C, nz, kmPx, freq, blend, landAt, ownerCell, coastNoise, coastSmooth, detail, forestNoise, farmNoise, rockNoise, traceSegs };
  cache.set(G, ctx);
  return ctx;
}

// river width in km from the world stage's (symbolic) segment width
export const riverWidthKm = w => 0.02 + 0.12 * Math.pow(Math.max(0, w - 0.35), 1.5);
export const RIVER_MEANDER = { km: 6, amp: 1.2 };
export const ROAD_MEANDER = { km: 4, amp: 0.35 };
