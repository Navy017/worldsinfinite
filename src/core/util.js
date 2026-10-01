export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;

export function hashStr(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function makeRng(seedStr) {
  let a = hashStr(seedStr);
  const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  return {
    f, range: (lo, hi) => lo + (hi - lo) * f(), int: (lo, hi) => Math.floor(lo + (hi - lo + 1) * f()),
    pick: arr => arr[Math.floor(f() * arr.length)], chance: p => f() < p,
  };
}

export function shuffle(rng, a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng.f() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

export function weightedPick(rng, items, wfn) {
  let tot = 0; for (const it of items) tot += wfn(it);
  if (tot <= 0) return null;
  let r = rng.f() * tot;
  for (const it of items) { r -= wfn(it); if (r <= 0) return it; }
  return items[items.length - 1];
}

// 2D simplex noise with fbm and ridged variants
export function makeNoise(rng, periodX = 1600) {
  const p = [...Array(256).keys()]; shuffle(rng, p);
  const perm = new Uint8Array(512); for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const GX = new Int8Array([1, -1, 1, -1, 1, -1, 0, 0]), GY = new Int8Array([1, 1, -1, -1, 0, 0, 1, -1]);
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  function n2(x, y) {
    const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0, g;
    let t0 = 0.5 - x0 * x0 - y0 * y0; if (t0 > 0) { g = perm[ii + perm[jj]] & 7; t0 *= t0; n += t0 * t0 * (GX[g] * x0 + GY[g] * y0); }
    let t1 = 0.5 - x1 * x1 - y1 * y1; if (t1 > 0) { g = perm[ii + i1 + perm[jj + j1]] & 7; t1 *= t1; n += t1 * t1 * (GX[g] * x1 + GY[g] * y1); }
    let t2 = 0.5 - x2 * x2 - y2 * y2; if (t2 > 0) { g = perm[ii + 1 + perm[jj + 1]] & 7; t2 *= t2; n += t2 * t2 * (GX[g] * x2 + GY[g] * y2); }
    return 70 * n;
  }
  function fbm(x, y, oct = 5) { let a = 1, f = 1, s = 0, nm = 0; for (let o = 0; o < oct; o++) { s += a * n2(x * f, y * f); nm += a; a *= 0.5; f *= 2; } return s / nm; }
  function ridged(x, y, oct = 4) { let a = 1, f = 1, s = 0, nm = 0; for (let o = 0; o < oct; o++) { s += a * (1 - Math.abs(n2(x * f, y * f))); nm += a; a *= 0.5; f *= 2; } return s / nm; }

  // 3D simplex noise (Gustavson), used to build noise that wraps east-west
  const G3X = [1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0], G3Y = [1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1], G3Z = [0, 0, 0, 0, 1, 1, -1, -1, 1, 1, -1, -1];
  function n3(x, y, z) {
    const F3 = 1 / 3, G3 = 1 / 6, s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s), t = (i + j + k) * G3;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const ii = i & 255, jj = j & 255, kk = k & 255;
    const corner = (dx, dy, dz, gi) => {
      let tt = 0.6 - dx * dx - dy * dy - dz * dz;
      if (tt <= 0) return 0;
      tt *= tt;
      return tt * tt * (G3X[gi] * dx + G3Y[gi] * dy + G3Z[gi] * dz);
    };
    return 32 * (
      corner(x0, y0, z0, perm[ii + perm[jj + perm[kk]]] % 12) +
      corner(x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3, perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12) +
      corner(x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3, perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12) +
      corner(x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3, perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12));
  }
  // Noise that wraps east-west with the given period (the map width): x becomes an angle around a
  // circle in 3D noise space whose circumference matches the frequency, so features keep their size
  // and x = 0 and x = period sample the same point. Callers pass world coordinates and a frequency.
  const TAU = Math.PI * 2;
  function pn2(x, y, f, off = 0) {
    const a = x / periodX * TAU, r = periodX * f / TAU;
    return n3(Math.cos(a) * r + off, Math.sin(a) * r - off * 0.7, y * f + off * 1.3);
  }
  function pfbm(x, y, f, oct = 5, off = 0) { let a = 1, s = 0, nm = 0; for (let o = 0; o < oct; o++) { s += a * pn2(x, y, f, off + o * 17.3); nm += a; a *= 0.5; f *= 2; } return s / nm; }
  function pridged(x, y, f, oct = 4, off = 0) { let a = 1, s = 0, nm = 0; for (let o = 0; o < oct; o++) { s += a * (1 - Math.abs(pn2(x, y, f, off + o * 17.3))); nm += a; a *= 0.5; f *= 2; } return s / nm; }
  return { n2, fbm, ridged, n3, pn2, pfbm, pridged };
}

// binary min-heap on parallel arrays; pop() leaves the popped key in .lk
export class Heap {
  constructor() { this.k = []; this.v = []; this.lk = 0; }
  get size() { return this.v.length; }
  push(v, key) {
    const K = this.k, V = this.v; let i = V.length; K.push(key); V.push(v);
    while (i > 0) { const p = (i - 1) >> 1; if (K[p] <= key) break; K[i] = K[p]; V[i] = V[p]; i = p; }
    K[i] = key; V[i] = v;
  }
  pop() {
    const K = this.k, V = this.v, top = V[0]; this.lk = K[0];
    const lk = K.pop(), lv = V.pop(), n = V.length;
    if (n > 0) {
      let i = 0;
      for (;;) { const l = 2 * i + 1; if (l >= n) break; const r = l + 1; const m = (r < n && K[r] < K[l]) ? r : l; if (K[m] >= lk) break; K[i] = K[m]; V[i] = V[m]; i = m; }
      K[i] = lk; V[i] = lv;
    }
    return top;
  }
}
