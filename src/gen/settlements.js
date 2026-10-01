import { clamp, makeRng, Heap } from "../core/util.js";
import { BIOMES } from "../core/tables.js";
import { localContext, RIVER_MEANDER } from "./local.js";

// World-level settlements and roads. Every province gets one main settlement whose size comes
// from reasons in the world (fertility, water, trade access, capitals, danger); a road network
// links them. Lower zoom levels treat these as fixed and connect to them.

export const TIERS = [
  { n: "Hamlet", pop: [20, 100] },
  { n: "Village", pop: [100, 1000] },
  { n: "Town", pop: [1000, 10000] },
  { n: "City", pop: [10000, 100000] },
  { n: "Metropolis", pop: [100000, 600000] },
];
export const FERTILITY = {
  glacier: 0, peaks: 0.02, tundra: 0.12, alpine: 0.15, colddesert: 0.15, badlands: 0.15, desert: 0.1,
  swamp: 0.3, mangrove: 0.35, boreal: 0.35, coldsteppe: 0.4, rainforest: 0.45, temprain: 0.6,
  savanna: 0.7, dryforest: 0.7, tempforest: 0.8, grass: 1,
};
// people per km² of built-up area; sets how much ground a settlement covers
export const URBAN_DENSITY = 9000;
export const urbanRadiusKm = pop => Math.sqrt(pop / URBAN_DENSITY / Math.PI);

export function genSettlements(G, P, seed) {
  const rng = makeRng(seed + "|settlements");
  const { M, T, C, R, S, F } = G, provs = R.provs, np = provs.length, { x, y, nStart, nbr } = M;

  // prosperity: why people would live here
  const isCap = new Uint8Array(np); for (const s of S.states) isCap[s.capital] = 1;
  const pros = new Float32Array(np);
  for (let p = 0; p < np; p++) {
    const pr = provs[p];
    let v = FERTILITY[BIOMES[pr.biome].k] ?? 0.3;
    if (pr.rivers.length) v += 0.35;
    if (pr.coastal) v += 0.25;
    if (pr.lakeShore >= 0) v += 0.15;
    if (pr.terr >= 2) v -= 0.25;
    if (F.hostile[p] >= 0) v -= 0.15 * F.hostRegions[F.hostile[p]].tier;
    if (F.titan[p] >= 0) v -= 0.5;
    if (S.own[p] < 0) v -= 0.5;
    if (isCap[p]) v += 0.6;
    pros[p] = v + rng.range(-0.25, 0.25);
  }
  // tiers by rank, so every world has a sensible mix: many villages, few cities
  const rank = new Float32Array(np), order = [...Array(np).keys()].sort((a, b) => pros[a] - pros[b]);
  order.forEach((p, k) => { rank[p] = np > 1 ? k / (np - 1) : 1; });
  const tierOf = p => {
    const q = rank[p];
    let t = q > 0.985 ? 4 : q > 0.9 ? 3 : q > 0.6 ? 2 : q > 0.2 ? 1 : 0;
    if (t === 4 && !isCap[p]) t = 3;
    if (isCap[p]) t = Math.max(t, S.states[S.own[p]] && S.states[S.own[p]].provs.length > 12 ? 3 : 2);
    return t;
  };

  // site: the best spot in the province (river, coast, flat, low, central)
  const settlements = [], mainOf = new Int32Array(np).fill(-1);
  const avgR = Math.sqrt(M.cellArea * R.land.length / Math.max(1, np)) * 0.6;
  for (let p = 0; p < np; p++) {
    const pr = provs[p], tier = tierOf(p);
    // towns and bigger in a coastal province always stand on the sea: a harbour is the reason
    // they grew, so only cells touching the sea are considered for them
    const onSea = c => { for (let k = nStart[c]; k < nStart[c + 1]; k++) if (T.type[nbr[k]] === 1) return true; return false; };
    const mustCoast = pr.coastal && tier >= 2 && pr.cells.some(onSea);
    let best = pr.cells[0], bs = -Infinity;
    for (const c of pr.cells) {
      if (mustCoast && !onSea(c)) continue;
      let s = 0, coast = false;
      for (let k = nStart[c]; k < nStart[c + 1]; k++) if (T.type[nbr[k]] === 1) { coast = true; break; }
      if (C.river[c]) s += 0.6;
      if (coast) s += 0.5;
      s -= T.slope[c] * 40 + T.e[c] * 0.8;
      s += (1 - Math.min(1, Math.hypot(x[c] - x[pr.heart], y[c] - y[pr.heart]) / avgR)) * 0.4;
      s += rng.f() * 0.3;
      if (s > bs) { bs = s; best = c; }
    }
    const [lo, hi] = TIERS[tier].pop;
    const pop = Math.round(Math.exp(rng.range(Math.log(lo), Math.log(hi))));
    let port = false; for (let k = nStart[best]; k < nStart[best + 1]; k++) if (T.type[nbr[k]] === 1) port = true;
    const frontier = pr.adj.some(q => S.own[q] !== S.own[p]);
    const walled = tier >= 3 || (tier === 2 && rng.chance(frontier ? 0.85 : 0.5));
    // a province is usually named after its main town; small ones get their own name
    const name = tier >= 2 ? pr.name : R.masses[pr.mass].lang.word(rng, null);
    // jitter within the cell so settlements don't sit exactly on cell centres
    const jx = (rng.f() - 0.5) * M.sx * 0.5, jy = (rng.f() - 0.5) * M.sy * 0.5;
    mainOf[p] = settlements.length;
    settlements.push({ id: p * 100, prov: p, cell: best, x: x[best] + jx, y: y[best] + jy, tier, pop, walled, port, name, capital: !!isCap[p] });
  }

  // Site each settlement precisely using the same world-space terrain the zoomed-in maps use:
  // ports move to the actual coastline, river towns onto the river's real course, and every
  // centre ends up on dry land.
  const L = localContext(G), probe = {}, kmU = km => km / L.kmPx;
  const landAt = (px, py) => L.landAt(px, py, probe, 0.1);
  for (const s of settlements) {
    const c = s.cell, rKm = urbanRadiusKm(s.pop);
    let px = s.x, py = s.y;
    if (s.port) {
      // the nearest real shoreline to the cell's centre (on the fine coast, not the cell grid),
      // found on rings of samples; the town then backs off it just enough to stand on dry land
      let wx = -1, wy = -1, found = false;
      // fast path: walk towards the nearest sea cell in 1 km steps
      {
        let sea = -1, bd = Infinity;
        for (let k = nStart[c]; k < nStart[c + 1]; k++) { const n = nbr[k]; if (T.type[n] !== 1) continue; const d = (x[n] - x[c]) ** 2 + (y[n] - y[c]) ** 2; if (d < bd) { bd = d; sea = n; } }
        if (sea >= 0) {
          const L0 = Math.sqrt(bd), ux = (x[sea] - x[c]) / L0, uy = (y[sea] - y[c]) / L0;
          for (let t = kmU(1); t <= L0 * 1.2; t += kmU(1)) {
            const qx = x[c] + ux * t, qy = y[c] + uy * t;
            if (landAt(qx, qy) < 0.5 && L.blend(qx, qy, probe).lake < 0.3) { wx = qx; wy = qy; found = true; break; }
          }
        }
      }
      for (let r = 1; r <= M.s * L.kmPx * 1.3 && !found; r += 1) {
        const n = Math.max(8, Math.round(r * 1.5)), a0 = rng.f();
        for (let i = 0; i < n; i++) {
          const a = (i + a0) / n * Math.PI * 2, qx = x[c] + Math.cos(a) * kmU(r), qy = y[c] + Math.sin(a) * kmU(r);
          if (landAt(qx, qy) < 0.5 && L.blend(qx, qy, probe).lake < 0.3) { wx = qx; wy = qy; found = true; break; }
        }
      }
      if (found) {
        // refine: bisect between the cell centre and the water point to find the shoreline itself
        let lx = x[c], ly = y[c];
        for (let it = 0; it < 12; it++) { const mx = (lx + wx) / 2, my = (ly + wy) / 2; if (landAt(mx, my) >= 0.5) { lx = mx; ly = my; } else { wx = mx; wy = my; } }
        const d = Math.hypot(x[c] - wx, y[c] - wy) || 1, ux = (x[c] - wx) / d, uy = (y[c] - wy) / d;
        let back = kmU(0.35 * rKm + 0.12);
        while (back < d && landAt(wx + ux * back, wy + uy * back) < 0.53) back += kmU(0.1);
        px = wx + ux * back; py = wy + uy * back;
      }
    } else if (C.river[c]) {
      let bd = Infinity, bx = px, by = py;
      L.traceSegs(C.riverSegs, C.riverCount, [x[c] - M.s, y[c] - M.s, x[c] + M.s, y[c] + M.s], kmU(0.2), () => 0, RIVER_MEANDER.km, RIVER_MEANDER.amp, (qx, qy) => {
        const d = (qx - x[c]) ** 2 + (qy - y[c]) ** 2; if (d < bd) { bd = d; bx = qx; by = qy; }
      });
      if (bd < (M.s * 0.8) ** 2) {
        // sit just beside the river so it runs along (or through) the town, not under the square
        const dd = Math.sqrt((x[c] - bx) ** 2 + (y[c] - by) ** 2) || 1, off = kmU(0.25 * rKm + 0.1);
        px = bx + (x[c] - bx) / dd * off; py = by + (y[c] - by) / dd * off;
      }
    }
    // A town needs solid ground around it, not just under its centre: at least 5 of 8 points on a
    // ring at the town's radius must be land, or it is sitting on an offshore islet or spit.
    // Walk back towards the cell centre, then search outward, until a site passes.
    const ringR = kmU(Math.max(0.3, rKm * 0.9));
    const solid = (qx, qy) => {
      if (landAt(qx, qy) < (s.port ? 0.52 : 0.56)) return false;
      let n = 0; for (let a = 0; a < 8; a++) if (landAt(qx + Math.cos(a * Math.PI / 4) * ringR, qy + Math.sin(a * Math.PI / 4) * ringR) >= 0.5) n++;
      // a port only needs its half of the ring on land, and must still have the sea within reach
      if (!s.port) return n >= 5;
      if (n < 3) return false;
      // and the harbour must actually be on the water: some of a slightly wider ring is sea
      const R2 = ringR + kmU(0.4);
      for (let a = 0; a < 12; a++) if (landAt(qx + Math.cos(a * Math.PI / 6) * R2, qy + Math.sin(a * Math.PI / 6) * R2) < 0.5) return true;
      return false;
    };
    if (!solid(px, py) && s.port) {
      // a port that doesn't fit here slides along the shore rather than retreating inland
      const ox = px, oy = py;
      search: for (let r = 0.3; r <= 6; r += 0.3) for (let a = 0; a < 16; a++) {
        const qx = ox + Math.cos(a / 16 * Math.PI * 2) * kmU(r), qy = oy + Math.sin(a / 16 * Math.PI * 2) * kmU(r);
        if (solid(qx, qy)) { px = qx; py = qy; break search; }
      }
    }
    // a port that found its shore stays on it even where the ground is cramped
    if (!solid(px, py) && !(s.port && landAt(px, py) >= 0.52)) {
      const d0 = Math.hypot(x[c] - px, y[c] - py), steps = Math.ceil(d0 / kmU(0.2));
      let ok = false;
      for (let t = 1; t <= steps && !ok; t++) {
        const qx = px + (x[c] - px) * t / steps, qy = py + (y[c] - py) * t / steps;
        if (solid(qx, qy)) { px = qx; py = qy; ok = true; }
      }
      if (!ok) search: for (let r = 0.2; r <= 10; r += 0.25) for (let a = 0; a < 16; a++) {
        const qx = x[c] + Math.cos(a / 16 * Math.PI * 2) * kmU(r), qy = y[c] + Math.sin(a / 16 * Math.PI * 2) * kmU(r);
        if (solid(qx, qy)) { px = qx; py = qy; break search; }
      }
    }
    s.x = px; s.y = py;
  }

  // roads: least-cost paths between the main settlements of neighbouring provinces
  const cellCost = (a, b) => {
    let c = Math.hypot(x[a] - x[b], y[a] - y[b]) * (1 + T.slope[b] * 60 + T.e[b] * 1.5);
    const bk = BIOMES[C.biome[b]] && BIOMES[C.biome[b]].k;
    if (bk === "swamp" || bk === "mangrove") c *= 1.8; else if (BIOMES[C.biome[b]] && BIOMES[C.biome[b]].forest) c *= 1.25;
    if (C.river[b] && !C.river[a]) c += M.s * 2.5; // bridge or ford
    return c;
  };
  const path = (s1, s2) => {
    const pa = s1.prov, pb = s2.prov, goal = s2.cell, dist = new Map(), prev = new Map(), hp = new Heap();
    dist.set(s1.cell, 0); hp.push(s1.cell, 0);
    while (hp.size) {
      // the queue holds distance + straight-line estimate (A*); compare distances without it
      const c = hp.pop(), dc = dist.get(c);
      if (c === goal) break;
      if (hp.lk - Math.hypot(x[c] - x[goal], y[c] - y[goal]) > dc + 1e-9) continue;
      for (let k = nStart[c]; k < nStart[c + 1]; k++) {
        const n = nbr[k]; if (T.type[n] !== 0) continue;
        const o = R.owner[n]; if (o !== pa && o !== pb) continue;
        const nd = dc + cellCost(c, n);
        if (nd < (dist.has(n) ? dist.get(n) : Infinity)) { dist.set(n, nd); prev.set(n, c); hp.push(n, nd + Math.hypot(x[n] - x[goal], y[n] - y[goal])); }
      }
    }
    if (!dist.has(goal)) return null;
    const cells = [goal]; while (cells[cells.length - 1] !== s1.cell) cells.push(prev.get(cells[cells.length - 1]));
    return { cells: cells.reverse(), cost: dist.get(goal) };
  };
  const cand = [];
  for (let p = 0; p < np; p++) for (const q of provs[p].adj) if (q > p) {
    const r = path(settlements[mainOf[p]], settlements[mainOf[q]]);
    if (r) cand.push({ a: mainOf[p], b: mainOf[q], ...r });
  }
  // a spanning tree keeps everything connected; extra links join important places directly
  cand.sort((u, v) => u.cost - v.cost);
  const parent = settlements.map((_, i) => i), find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const roads = [];
  for (const e of cand) {
    const ra = find(e.a), rb = find(e.b), ta = settlements[e.a].tier, tb = settlements[e.b].tier;
    const tree = ra !== rb;
    if (tree) parent[ra] = rb;
    if (tree || ta + tb >= 5 || rng.chance(0.2)) {
      roads.push({ a: e.a, b: e.b, cls: Math.min(ta, tb) >= 2 ? 1 : 0, cells: e.cells });
    }
  }

  // world-space road geometry: quadratic curves through cell centres, ending at the settlements
  const segs = [];
  for (const rd of roads) {
    const pts = rd.cells.map(c => [x[c], y[c]]);
    pts[0] = [settlements[rd.a].x, settlements[rd.a].y]; pts[pts.length - 1] = [settlements[rd.b].x, settlements[rd.b].y];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i === 0 ? pts[0] : [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
      const p2 = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      const ctrl = i === 0 ? [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2] : pts[i];
      segs.push(rd.cls, p0[0], p0[1], ctrl[0], ctrl[1], p2[0], p2[1]);
    }
  }
  return { settlements, roads, mainOf, roadSegs: Float32Array.from(segs), roadCount: segs.length / 7 };
}
