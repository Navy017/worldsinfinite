import { Delaunay } from "d3-delaunay";
import { W, H } from "../core/tables.js";
export { findCell, forCellsInRect } from "./lookup.js";

// Jittered-grid Voronoi mesh: one site per grid cell, jittered, so lookups can use the grid (see lookup.js).
export function buildMesh(n, rng) {
  const s0 = Math.sqrt(W * H / n), cols = Math.max(4, Math.round(W / s0)), rows = Math.max(4, Math.round(H / s0));
  const sx = W / cols, sy = H / rows, N = cols * rows, pts = new Float64Array(N * 2);
  for (let r = 0, k = 0; r < rows; r++) for (let c = 0; c < cols; c++, k++) {
    pts[2 * k] = (c + 0.5 + (rng.f() - 0.5) * 0.8) * sx;
    pts[2 * k + 1] = (r + 0.5 + (rng.f() - 0.5) * 0.8) * sy;
  }
  const del = new Delaunay(pts), vor = del.voronoi([0, 0, W, H]);
  const x = new Float32Array(N), y = new Float32Array(N);
  for (let i = 0; i < N; i++) { x[i] = pts[2 * i]; y[i] = pts[2 * i + 1]; }

  // cell polygons, packed
  const polyStart = new Int32Array(N + 1);
  let total = 0;
  const polys = new Array(N);
  for (let i = 0; i < N; i++) { const p = vor.cellPolygon(i); polys[i] = p; total += p ? p.length - 1 : 0; }
  const polyXY = new Float32Array(total * 2);
  for (let i = 0, o = 0; i < N; i++) {
    polyStart[i] = o; const p = polys[i]; if (!p) continue;
    for (let j = 0; j < p.length - 1; j++, o++) { polyXY[2 * o] = p[j][0]; polyXY[2 * o + 1] = p[j][1]; }
  }
  polyStart[N] = total;

  // Voronoi edges between neighbouring cells (dual of Delaunay halfedges)
  const tri = del.triangles, he = del.halfedges, cc = vor.circumcenters;
  let E = 0; for (let e = 0; e < he.length; e++) if (he[e] > e) E++;
  const eA = new Int32Array(E), eB = new Int32Array(E), eXY = new Float32Array(E * 4);
  const cl = (v, m) => v < 0 ? 0 : v > m ? m : v;
  for (let e = 0, q = 0; e < he.length; e++) {
    const o = he[e]; if (o < e) continue;
    const t1 = (e / 3) | 0, t2 = (o / 3) | 0;
    eA[q] = tri[e]; eB[q] = tri[e % 3 === 2 ? e - 2 : e + 1];
    eXY[4 * q] = cl(cc[2 * t1], W); eXY[4 * q + 1] = cl(cc[2 * t1 + 1], H); eXY[4 * q + 2] = cl(cc[2 * t2], W); eXY[4 * q + 3] = cl(cc[2 * t2 + 1], H);
    q++;
  }
  // CSR adjacency; nEdge[k] is the edge index for neighbour slot k
  const nStart = new Int32Array(N + 1);
  for (let e = 0; e < E; e++) { nStart[eA[e] + 1]++; nStart[eB[e] + 1]++; }
  for (let i = 0; i < N; i++) nStart[i + 1] += nStart[i];
  const fp = nStart.slice(0, N), nbr = new Int32Array(2 * E), nEdge = new Int32Array(2 * E);
  for (let e = 0; e < E; e++) {
    const a = eA[e], b = eB[e];
    nbr[fp[a]] = b; nEdge[fp[a]++] = e;
    nbr[fp[b]] = a; nEdge[fp[b]++] = e;
  }
  return { N, cols, rows, sx, sy, x, y, s: Math.sqrt(sx * sy), cellArea: sx * sy, polyStart, polyXY, E, eA, eB, eXY, nStart, nbr, nEdge };
}

export function bfsFrom(M, sources, allow) {
  const d = new Int32Array(M.N).fill(-1), q = new Int32Array(M.N); let h = 0, t = 0;
  for (const s of sources) { if (d[s] < 0) { d[s] = 0; q[t++] = s; } }
  while (h < t) {
    const c = q[h++];
    for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) { const n = M.nbr[k]; if (d[n] < 0 && (!allow || allow(n))) { d[n] = d[c] + 1; q[t++] = n; } }
  }
  return d;
}

// cells from the nearest land/water boundary, on both sides
export function coastDistance(M, isLand) {
  const src = [];
  for (let i = 0; i < M.N; i++) {
    const li = isLand(i);
    for (let k = M.nStart[i]; k < M.nStart[i + 1]; k++) if (isLand(M.nbr[k]) !== li) { src.push(i); break; }
  }
  const d = bfsFrom(M, src);
  for (let i = 0; i < M.N; i++) if (d[i] < 0) d[i] = 999;
  return d;
}

// distance from a region's border inward; used to place labels at a region's heart
export function innerDist(M, label) {
  const N = M.N, d = new Int32Array(N).fill(-1), q = new Int32Array(N); let h = 0, t = 0;
  for (let i = 0; i < N; i++) {
    if (label[i] < 0) continue;
    for (let k = M.nStart[i]; k < M.nStart[i + 1]; k++) if (label[M.nbr[k]] !== label[i]) { d[i] = 0; q[t++] = i; break; }
  }
  while (h < t) {
    const c = q[h++];
    for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) { const n = M.nbr[k]; if (d[n] < 0 && label[n] === label[c]) { d[n] = d[c] + 1; q[t++] = n; } }
  }
  return d;
}

export function heartCells(label, d, count) {
  const best = new Int32Array(count).fill(-1), bv = new Int32Array(count).fill(-2);
  for (let i = 0; i < label.length; i++) { const l = label[i]; if (l >= 0 && d[i] > bv[l]) { bv[l] = d[i]; best[l] = i; } }
  return best;
}
