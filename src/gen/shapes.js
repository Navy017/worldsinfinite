import { clamp, lerp, weightedPick } from "../core/util.js";

// Continent shape library. Every shape is a signed distance function in unit space
// (roughly radius 1): sd(u, v) < 0 inside, > 0 outside, 0 on the coast. Signed distances
// combine cleanly (union, subtraction, smooth blending), and the terrain stage only ever
// sees "how far inside land is this point", so new shapes plug in without other changes.

const len = Math.hypot;
// polynomial smooth minimum: joins two shapes with a rounded seam of width k
const smin = (a, b, k) => { const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return lerp(b, a, h) - k * h * (1 - h); };

function sdPolygon(px, py, vx, vy) {
  const n = vx.length;
  let d = (px - vx[0]) ** 2 + (py - vy[0]) ** 2, s = 1;
  for (let i = 0, j = n - 1; i < n; j = i, i++) {
    const ex = vx[j] - vx[i], ey = vy[j] - vy[i], wx = px - vx[i], wy = py - vy[i];
    const t = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey), 0, 1), bx = wx - ex * t, by = wy - ey * t;
    d = Math.min(d, bx * bx + by * by);
    const c1 = py >= vy[i], c2 = py < vy[j], c3 = ex * wy > ey * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
  }
  return s * Math.sqrt(d);
}
// a polyline with a width per point, tapering between them
function sdChain(px, py, xs, ys, ws) {
  let best = Infinity;
  for (let i = 0; i < xs.length - 1; i++) {
    const ax = xs[i], ay = ys[i], dx = xs[i + 1] - ax, dy = ys[i + 1] - ay, l2 = dx * dx + dy * dy;
    const t = l2 ? clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1) : 0;
    const d = len(ax + dx * t - px, ay + dy * t - py) - lerp(ws[i], ws[i + 1], t);
    if (d < best) best = d;
  }
  return best;
}
const polar = (rng, n, rLo, rHi, jitter) => {
  const a0 = rng.range(0, Math.PI * 2), vx = [], vy = [];
  for (let k = 0; k < n; k++) {
    const a = a0 + (k / n) * Math.PI * 2 + rng.range(-jitter, jitter), r = rng.range(rLo, rHi);
    vx.push(Math.cos(a) * r); vy.push(Math.sin(a) * r);
  }
  return [vx, vy];
};

// Each builder returns sd(u, v) plus an anchor: a point guaranteed to be inside the land,
// used as the origin for peninsulas and carved seas.
export const SHAPES = {
  oval(rng) {
    const a = rng.range(0.7, 1.45);
    return { sd: (u, v) => len(u / a, v * a) - 1, anchor: [0, 0] };
  },
  lobed(rng) {
    const a = rng.range(0.8, 1.3), lobes = [];
    for (let k = rng.int(2, 5); k > 0; k--) {
      const ang = rng.range(0, Math.PI * 2), d = rng.range(0.5, 0.95);
      lobes.push([Math.cos(ang) * d, Math.sin(ang) * d, rng.range(0.35, 0.7)]);
    }
    return {
      sd: (u, v) => { let s = len(u / a, v * a) - 0.85; for (const [x, y, r] of lobes) s = smin(s, len(u - x, v - y) - r, 0.3); return s; },
      anchor: [0, 0],
    };
  },
  wedge(rng) {
    const [vx, vy] = polar(rng, 3, 1.0, 1.4, 0.26), round = rng.range(0.12, 0.25);
    return { sd: (u, v) => sdPolygon(u, v, vx, vy) - round, anchor: [0, 0] };
  },
  angular(rng) {
    const [vx, vy] = polar(rng, rng.int(4, 6), 0.7, 1.3, 0.35), round = rng.range(0.05, 0.15);
    return { sd: (u, v) => sdPolygon(u, v, vx, vy) - round, anchor: [0, 0] };
  },
  spine(rng) {
    const n = rng.int(4, 6), L = rng.range(3, 4), step = L / (n - 1), xs = [0], ys = [0], ws = [];
    let ang = 0;
    for (let k = 1; k < n; k++) { ang += rng.range(-0.4, 0.4); xs.push(xs[k - 1] + Math.cos(ang) * step); ys.push(ys[k - 1] + Math.sin(ang) * step); }
    const mx = (xs[0] + xs[n - 1]) / 2, my = (ys[0] + ys[n - 1]) / 2;
    for (let k = 0; k < n; k++) { xs[k] -= mx; ys[k] -= my; }
    const peak = rng.range(0.35, 0.55);
    for (let k = 0; k < n; k++) { const t = k / (n - 1); ws.push(lerp(rng.range(0.12, 0.2), peak, Math.sin(Math.PI * t)) * rng.range(0.85, 1.15)); }
    const mid = Math.floor(n / 2);
    return { sd: (u, v) => sdChain(u, v, xs, ys, ws), anchor: [xs[mid], ys[mid]] };
  },
  crescent(rng) {
    const ang = rng.range(0, Math.PI * 2), off = rng.range(0.45, 0.7), rh = rng.range(0.75, 0.95);
    const hx = Math.cos(ang) * off, hy = Math.sin(ang) * off;
    return {
      sd: (u, v) => Math.max(len(u, v) - 1, -(len(u - hx, v - hy) - rh)),
      anchor: [-Math.cos(ang) * 0.75, -Math.sin(ang) * 0.75],
    };
  },
  branching(rng) {
    const core = rng.range(0.5, 0.65), arms = [], n = rng.int(3, 5), a0 = rng.range(0, Math.PI * 2);
    for (let k = 0; k < n; k++) {
      const ang = a0 + (k / n) * Math.PI * 2 + rng.range(-0.35, 0.35), L = rng.range(1.0, 1.6), bend = rng.range(-0.35, 0.35);
      const xs = [0, Math.cos(ang + bend) * L * 0.55, Math.cos(ang) * L], ys = [0, Math.sin(ang + bend) * L * 0.55, Math.sin(ang) * L];
      const w = rng.range(0.2, 0.32);
      arms.push([xs, ys, [w, w * 0.8, rng.range(0.06, 0.12)]]);
    }
    return {
      sd: (u, v) => { let s = len(u, v) - core; for (const [xs, ys, ws] of arms) s = smin(s, sdChain(u, v, xs, ys, ws), 0.2); return s; },
      anchor: [0, 0],
    };
  },
  ring(rng) {
    const rm = rng.range(0.75, 0.9), hw = rng.range(0.22, 0.32), gap = rng.range(0, Math.PI * 2), gapHalf = rng.range(0.15, 0.35);
    return {
      sd: (u, v) => {
        const r = len(u, v); let s = Math.abs(r - rm) - hw;
        const da = Math.abs(((Math.atan2(v, u) - gap) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
        return Math.max(s, (gapHalf - da) * r); // cut a strait through the ring
      },
      anchor: [-Math.cos(gap) * rm, -Math.sin(gap) * rm],
    };
  },
};

// Shape styles bias which shapes a world's continents use.
export const SHAPE_STYLES = {
  mixed: { n: "Mixed", w: { oval: 1, lobed: 3, wedge: 1.5, angular: 2, spine: 1, crescent: 0.7, branching: 1, ring: 0.4 } },
  organic: { n: "Rounded & lobed", w: { oval: 2, lobed: 4, crescent: 1 } },
  angular: { n: "Angular & wedged", w: { wedge: 3, angular: 3, lobed: 1 } },
  long: { n: "Long & curving", w: { spine: 4, crescent: 2, branching: 1 } },
  branching: { n: "Branching & broken", w: { branching: 4, ring: 1.2, lobed: 1, crescent: 1 } },
};

// Build one continent shape, normalised so its land area matches a disc of radius 1.
export function makeContinentShape(rng, style) {
  const weights = (SHAPE_STYLES[style] || SHAPE_STYLES.mixed).w;
  const kind = weightedPick(rng, Object.keys(weights), k => weights[k]);
  const shape = SHAPES[kind](rng);
  const G = 64, ext = 4, cell = (2 * ext / G) ** 2;
  let inside = 0, reach = 0;
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
    const u = -ext + (i + 0.5) * 2 * ext / G, v = -ext + (j + 0.5) * 2 * ext / G;
    if (shape.sd(u, v) < 0) { inside++; reach = Math.max(reach, Math.hypot(u, v)); }
  }
  const scale = Math.sqrt(Math.PI / Math.max(inside * cell, 0.05));
  // reach: how far the shape extends from its origin, in units of the equal-area radius
  return { kind, sd: shape.sd, anchor: shape.anchor, scale, reach: reach * scale };
}
