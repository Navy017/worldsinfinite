import { clamp, makeRng, Heap } from "../core/util.js";
import { pickSome } from "../core/rules.js";
import { GOODS, ROUTE_NAMES, SEA_ROUTE_NAMES } from "../content/goods.js";
import { styleFor } from "./archstyles.js";
import { localContext, ROAD_MEANDER } from "./local.js";
import { findCell } from "./lookup.js";

// Trade. Every province produces a good or two (from its land, its culture and whatever strange
// things are nearby). Goods move between market towns over a network of the existing roads plus
// sea lanes between ports. Flow on each link comes from a gravity model: big, different, nearby
// markets trade the most. The busiest paths between great markets get names.

export function genTrade(G, P, seed) {
  const S_own = p => G.S.own[p];
  const rng = makeRng(seed + "|trade"), nameRng = makeRng(seed + "|tradenames");
  const { M, T, R, X, Y } = G, provs = R.provs, np = provs.length, st = X.settlements, { x, y, nStart, nbr } = M;
  const avgSp = Math.sqrt(R.land.length * M.cellArea / Math.max(1, np));

  /* ---- what each province makes ---- */
  const goods = new Array(np), gIdx = Object.fromEntries(GOODS.map((g, i) => [g.id, i]));
  for (let p = 0; p < np; p++) {
    const ctx = new Set(Y.ptags[p]);
    for (const t of Y.cultures[Y.cultureOf[p]].traits) ctx.add(t);
    ctx.add("style:" + styleFor(G, st[p]));
    const picks = pickSome(rng, GOODS, ctx, rng.chance(0.45) ? 2 : 1);
    goods[p] = picks.length ? picks.map(g => gIdx[g.id]) : [gIdx.grain];
  }

  /* ---- the network: roads, plus sea lanes between ports ---- */
  const links = []; // { a, b, kind: 0 road | 1 sea, len, pts: [x,y,...] }
  const adj = Array.from({ length: np }, () => []);
  const addLink = (a, b, kind, len, pts) => { const id = links.length; links.push({ a, b, kind, len, pts }); adj[a].push(id); adj[b].push(id); };
  for (const rd of X.roads) {
    const pts = [];
    rd.cells.forEach((c, i) => { const px = i === 0 ? st[rd.a].x : i === rd.cells.length - 1 ? st[rd.b].x : x[c], py = i === 0 ? st[rd.a].y : i === rd.cells.length - 1 ? st[rd.b].y : y[c]; pts.push(px, py); });
    let len = 0; for (let i = 2; i < pts.length; i += 2) len += Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1]);
    addLink(rd.a, rd.b, 0, len, pts);
  }
  // sea: grow outward from every port over open water at once; where two ports' waters meet,
  // they get a lane (the path back from the meeting point to each port)
  const ports = []; for (const s of st) if (s.port && s.tier >= 1) ports.push(s);
  const N = M.N, lab = new Int32Array(N).fill(-1), dist = new Float64Array(N).fill(Infinity), par = new Int32Array(N).fill(-1), hp = new Heap();
  for (const s of ports) {
    const c = s.cell;
    for (let k = nStart[c]; k < nStart[c + 1]; k++) {
      const n = nbr[k]; if (T.type[n] !== 1) continue;
      const d = Math.hypot(x[n] - s.x, y[n] - s.y);
      if (d < dist[n]) { dist[n] = d; lab[n] = s.prov; par[n] = -1; hp.push(n, d); }
    }
  }
  while (hp.size) {
    const c = hp.pop(), dc = hp.lk; if (dc > dist[c]) continue;
    for (let k = nStart[c]; k < nStart[c + 1]; k++) {
      const n = nbr[k]; if (T.type[n] !== 1) continue;
      // lanes prefer to stay off the open ocean a little (coast-hugging), but not much
      const nd = dc + Math.hypot(x[n] - x[c], y[n] - y[c]) * (1 + Math.min(1, T.coastDist[n] * 0.02));
      if (nd < dist[n]) { dist[n] = nd; lab[n] = lab[c]; par[n] = c; hp.push(n, nd); }
    }
  }
  const meet = new Map();
  for (let e = 0; e < M.E; e++) {
    const a = M.eA[e], b = M.eB[e]; if (lab[a] < 0 || lab[b] < 0 || lab[a] === lab[b]) continue;
    const pa = lab[a], pb = lab[b], k = pa < pb ? pa * 100000 + pb : pb * 100000 + pa, d = dist[a] + dist[b];
    const cur = meet.get(k); if (!cur || d < cur.d) meet.set(k, { d, a: pa < pb ? a : b, b: pa < pb ? b : a });
  }
  const trace = c => { const out = []; while (c >= 0) { out.push(c); c = par[c]; } return out; };
  for (const [k, m] of meet) {
    const pa = Math.floor(k / 100000), pb = k % 100000;
    const cells = [...trace(m.a).reverse(), ...trace(m.b)], pts = [st[pa].x, st[pa].y];
    for (const c of cells) pts.push(x[c], y[c]);
    pts.push(st[pb].x, st[pb].y);
    let len = 0; for (let i = 2; i < pts.length; i += 2) len += Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1]);
    // short lanes between any ports; long ocean crossings only between real harbour cities
    const big = Math.min(st[pa].tier, st[pb].tier) >= 3;
    if (len > avgSp * (big ? 60 : 14)) continue;
    addLink(pa, pb, 1, len, pts);
  }
  const linkCost = l => l.len * (l.kind ? 0.6 : 1) + (l.kind ? avgSp * 1.2 : 0);

  /* ---- markets and flows ---- */
  const mass = st.map(s => s.pop * (s.port ? 1.4 : 1) * (s.capital ? 1.5 : 1));
  const order = st.map((_, i) => i).sort((a, b) => mass[b] - mass[a]);
  const nHub = clamp(Math.round(np / 9), 6, 260), hubs = order.slice(0, nHub), isHub = new Int32Array(np).fill(-1);
  hubs.forEach((h, k) => { isHub[h] = k; });
  // what each market has to sell: its own goods and its neighbours'
  const basket = st.map((_, p) => { const s = new Set(goods[p]); for (const q of provs[p].adj) for (const g of goods[q]) s.add(g); return s; });
  const flow = new Float64Array(links.length), gFlow = links.map(() => new Map()), through = new Float64Array(np);
  const D0 = avgSp * 5, cutoff = avgSp * 30;
  const dd = new Float64Array(np), pl = new Int32Array(np), seen = [];
  const pairs = [];
  const dijkstra = (src, cut = cutoff) => {
    for (const q of seen) { dd[q] = Infinity; pl[q] = -1; } seen.length = 0;
    const h = new Heap(); dd[src] = 0; pl[src] = -1; seen.push(src); h.push(src, 0);
    while (h.size) {
      const c = h.pop(), dc = h.lk; if (dc > dd[c]) continue;
      for (const li of adj[c]) {
        const l = links[li], q = l.a === c ? l.b : l.a, nd = dc + linkCost(l);
        if (nd > cut) continue;
        if (nd < dd[q]) { if (dd[q] === Infinity) seen.push(q); dd[q] = nd; pl[q] = li; h.push(q, nd); }
      }
    }
  };
  dd.fill(Infinity); pl.fill(-1);
  const walk = (from, to, f, gs) => {
    let c = to, n = 0;
    while (c !== from && pl[c] >= 0 && n++ < 5000) {
      const li = pl[c], l = links[li];
      flow[li] += f; through[c] += f;
      for (const g of gs) gFlow[li].set(g, (gFlow[li].get(g) || 0) + f);
      c = l.a === c ? l.b : l.a;
    }
    through[from] += f;
  };
  // market prices: every good a market can reach, priced by how far its nearest source is
  const nG = GOODS.length, prices = new Float32Array(nHub * nG).fill(NaN), source = new Int32Array(nHub * nG).fill(-1);
  for (const h of hubs) {
    dijkstra(h);
    const row = isHub[h] * nG, best = new Float64Array(nG).fill(Infinity);
    for (const q of seen) for (const g of goods[q]) if (dd[q] < best[g]) { best[g] = dd[q]; source[row + g] = q; }
    const prng = makeRng(seed + "|price|" + h);
    for (let g = 0; g < nG; g++) {
      if (best[g] === Infinity) continue;
      const local = best[g] <= avgSp * 1.5;
      prices[row + g] = GOODS[g].value * (local ? 0.7 : 1 + best[g] / D0 * 0.3) * prng.range(0.9, 1.12);
    }
    for (const j of hubs) {
      if (j <= h || !(dd[j] < Infinity)) continue;
      // complementarity: what each side has that the other lacks, weighted by value
      const sell = [], buy = [];
      for (const g of basket[h]) if (!basket[j].has(g)) sell.push(g);
      for (const g of basket[j]) if (!basket[h].has(g)) buy.push(g);
      const comp = 0.3 + [...sell, ...buy].reduce((a, g) => a + GOODS[g].value, 0) * 0.15;
      const f = Math.sqrt(mass[h] * mass[j]) * comp / (1 + (dd[j] / D0) ** 2);
      if (f <= 0) continue;
      const gs = [...sell, ...buy].sort((a, b) => GOODS[b].value - GOODS[a].value).slice(0, 3);
      walk(h, j, f, gs);
      pairs.push({ a: h, b: j, f, gs, cost: dd[j] });
    }
  }
  // Great markets: the biggest few also trade with each other across the whole world, on a much
  // longer distance scale. This is what makes long-haul routes in big worlds, where the local
  // market network alone only ever reaches its neighbours.
  const nGreat = clamp(Math.round(Math.sqrt(nHub) * 2), 5, 30), great = hubs.slice(0, nGreat), D1 = avgSp * 40;
  for (const h of great) {
    dijkstra(h, Infinity);
    for (const j of great) {
      if (j <= h || !(dd[j] < Infinity)) continue;
      const sell = [], buy = [];
      for (const g of basket[h]) if (!basket[j].has(g)) sell.push(g);
      for (const g of basket[j]) if (!basket[h].has(g)) buy.push(g);
      const comp = 0.3 + [...sell, ...buy].reduce((a, g) => a + GOODS[g].value, 0) * 0.15;
      const f = Math.sqrt(mass[h] * mass[j]) * comp * 0.8 / (1 + (dd[j] / D1) ** 2);
      const gs = [...sell, ...buy].sort((a, b) => GOODS[b].value - GOODS[a].value).slice(0, 3);
      walk(h, j, f, gs);
      pairs.push({ a: h, b: j, f, gs, cost: dd[j], great: true });
    }
  }
  // every town sends its goods to the nearest market
  {
    const h2 = new Heap(), d2 = new Float64Array(np).fill(Infinity), p2 = new Int32Array(np).fill(-1), root = new Int32Array(np).fill(-1);
    for (const hb of hubs) { d2[hb] = 0; root[hb] = hb; h2.push(hb, 0); }
    while (h2.size) {
      const c = h2.pop(), dc = h2.lk; if (dc > d2[c]) continue;
      for (const li of adj[c]) { const l = links[li], q = l.a === c ? l.b : l.a, nd = dc + linkCost(l); if (nd < d2[q]) { d2[q] = nd; p2[q] = li; root[q] = root[c]; h2.push(q, nd); } }
    }
    for (let p = 0; p < np; p++) {
      if (isHub[p] >= 0 || root[p] < 0) continue;
      const f = st[p].pop * 0.25;
      let c = p, n = 0;
      while (p2[c] >= 0 && n++ < 5000) { const li = p2[c], l = links[li]; flow[li] += f; for (const g of goods[p]) gFlow[li].set(g, (gFlow[li].get(g) || 0) + f); c = l.a === c ? l.b : l.a; }
      through[p] += f;
    }
  }

  /* ---- named routes: the busiest paths between great markets ---- */
  pairs.sort((a, b) => b.f * Math.sqrt(b.cost) * (b.great ? 3 : 1) - a.f * Math.sqrt(a.cost) * (a.great ? 3 : 1));
  const named = [], usedLinks = new Set(), usedNames = new Set(), goodUse = new Map();
  for (const pr of pairs) {
    if (named.length >= clamp(Math.round(nHub / 5), 3, 14)) break;
    dijkstra(pr.a, pr.great ? Infinity : cutoff);
    const path = []; let c = pr.b, sea = 0, len = 0;
    while (c !== pr.a && pl[c] >= 0) { const l = links[pl[c]]; path.push(pl[c]); if (l.kind) sea += l.len; len += l.len; c = l.a === c ? l.b : l.a; }
    if (path.length < 3) continue;
    const overlap = path.filter(li => usedLinks.has(li)).length / path.length;
    if (overlap > 0.5) continue;
    for (const li of path) usedLinks.add(li);
    // named after its most valuable good, preferring goods no other route is named for
    const gl = pr.gs.length ? pr.gs : goods[pr.a];
    const gi = gl.slice().sort((a, b) => (goodUse.get(a) || 0) - (goodUse.get(b) || 0))[0], good = GOODS[gi], isSea = sea > len * 0.5;
    goodUse.set(gi, (goodUse.get(gi) || 0) + 1);
    const forms = isSea ? SEA_ROUTE_NAMES : ROUTE_NAMES, word = good.n.replace(/([^s])s$/, "$1");
    let name = nameRng.pick(forms).replace("$", word);
    for (let t = 0; t < 6 && usedNames.has(name); t++) name = forms[t % forms.length].replace("$", word);
    if (usedNames.has(name)) name = name + " of " + st[pr.a].name;
    usedNames.add(name);
    named.push({ name, a: pr.a, b: pr.b, good: gIdx[good.id], sea: isSea, links: path, km: Math.round(len * G.worldKm / 1600) });
  }

  /* ---- output: links that carry real traffic ---- */
  const maxF = Math.max(1e-9, ...flow);
  const routes = [];
  links.forEach((l, i) => {
    if (flow[i] < maxF * 0.004) return;
    const top = [...gFlow[i].entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    // land routes follow the road exactly as the zoomed-in maps draw it, so caravans stay on it
    const pts = l.kind === 0 ? roadLine(G, X.roads[i]) : Float32Array.from(smooth(l.pts));
    routes.push({ id: i, a: l.a, b: l.b, sea: l.kind === 1, flow: flow[i] / maxF, goods: top, pts, len: l.len });
  });
  /* ---- along the roads: border posts where a road leaves a realm, inns and waystations between towns ---- */
  const stops = [], kmPx = G.worldKm / 1600, L = localContext(G);
  const INN = ["Inn", "Coaching Inn", "Waystation", "Hostel"], SIGNS = ["Grey Heron", "Wheel", "Crossed Keys", "Drover's Rest", "Black Ox", "Last Lantern", "Golden Sheaf", "Weary Mule", "Three Bells", "Salt Road", "Fox and Hound", "Pilgrim's Staff"];
  // walk each road piece by piece (one piece per map cell, as the road is drawn) and only work out
  // the exact point on the drawn road where a stop is actually placed
  X.roads.forEach((rd, ri) => {
    const cells = rd.cells, a = st[rd.a], b = st[rd.b], rng = makeRng(seed + "|stops|" + ri);
    const pts = cells.map(c => [M.x[c], M.y[c]]); pts[0] = [a.x, a.y]; pts[pts.length - 1] = [b.x, b.y];
    let lastRealm = S_own(R.owner[cells[0]]), since = rng.range(8, 20);
    for (let i = 0; i < pts.length - 1; i++) {
      since += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) * kmPx;
      const c = cells[i + 1], realm = S_own(R.owner[c]);
      const [x, y] = piecePoint(L, pts, i, 0.5);
      const nearTown = Math.min(Math.hypot(x - a.x, y - a.y), Math.hypot(x - b.x, y - b.y)) * kmPx;
      if (realm !== lastRealm && realm >= 0 && lastRealm >= 0) {
        stops.push({ kind: "border", x, y, road: ri, realm, from: lastRealm, cls: rd.cls, name: "Border post" });
        since = 0;
      } else if (since > (rd.cls ? 22 : 32) && nearTown > 6) {
        const r = rng.f(), kind = r < 0.55 ? "inn" : r < 0.75 ? "hamlet" : r < 0.9 ? "tower" : "shrine";
        const lang = R.masses[R.provs[R.owner[c]].mass].lang;
        const name = kind === "inn" ? `The ${rng.pick(SIGNS)} ${rng.pick(INN)}` : kind === "hamlet" ? `${lang ? lang.word(rng, null) : "Roadside"} Crossing` : kind === "tower" ? "Watchtower" : "Wayside shrine";
        stops.push({ kind, x, y, road: ri, realm, cls: rd.cls, name });
        since = rng.range(-6, 6);
      }
      if (realm >= 0) lastRealm = realm;
    }
  });
  void L;

  const maxT = Math.max(1e-9, ...through);
  return { stops,
    goods, routes, named, hubs, through: Float32Array.from(through, v => v / maxT), prices, source,
  };
}

// A road as a dense polyline: the same quadratic pieces and meander as the region maps (see
// settlements.js for the pieces and local.js traceSegs for the meander), sampled every ~250 m.
const lineCache = new WeakMap();
export function roadLine(G, rd, stepKm = 0.25) {
  // the same road is asked for by trade, stops, armies and traffic: keep it
  let byStep = lineCache.get(rd); if (!byStep) lineCache.set(rd, byStep = new Map());
  if (byStep.has(stepKm)) return byStep.get(stepKm);
  const res = roadLineRaw(G, rd, stepKm); byStep.set(stepKm, res); return res;
}
// one point on piece i of a road (t in 0..1), exactly as roadLine draws it
function piecePoint(L, pts, i, t) {
  const p0 = i === 0 ? pts[0] : [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
  const p2 = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
  const c = i === 0 ? [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2] : pts[i];
  const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, cc = t * t;
  const px = a * p0[0] + b * c[0] + cc * p2[0], py = a * p0[1] + b * c[1] + cc * p2[1];
  let tx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]), ty = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1]);
  const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
  const m = L.nz.pn2(px, py, L.freq(ROAD_MEANDER.km), 7) * ROAD_MEANDER.amp / L.kmPx;
  return [px - ty * m, py + tx * m];
}
function roadLineRaw(G, rd, stepKm) {
  const L = localContext(G), { x, y } = G.M, st = G.X.settlements, step = stepKm / L.kmPx, out = [];
  const pts = rd.cells.map(c => [x[c], y[c]]);
  pts[0] = [st[rd.a].x, st[rd.a].y]; pts[pts.length - 1] = [st[rd.b].x, st[rd.b].y];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i === 0 ? pts[0] : [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
    const p2 = i === pts.length - 2 ? pts[i + 1] : [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    const c = i === 0 ? [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2] : pts[i];
    const Ls = Math.hypot(c[0] - p0[0], c[1] - p0[1]) + Math.hypot(p2[0] - c[0], p2[1] - c[1]), n = Math.max(2, Math.ceil(Ls / step));
    for (let s = i === 0 ? 0 : 1; s <= n; s++) {
      const t = s / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, cc = t * t;
      const px = a * p0[0] + b * c[0] + cc * p2[0], py = a * p0[1] + b * c[1] + cc * p2[1];
      let tx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]), ty = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1]);
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const m = L.nz.pn2(px, py, L.freq(ROAD_MEANDER.km), 7) * ROAD_MEANDER.amp / L.kmPx;
      out.push(px - ty * m, py + tx * m);
    }
  }
  return Float32Array.from(out);
}

// one round of Chaikin smoothing, keeping the end points
function smooth(p) {
  if (p.length < 6) return p;
  const o = [p[0], p[1]];
  for (let i = 0; i < p.length - 2; i += 2) {
    o.push(p[i] * 0.75 + p[i + 2] * 0.25, p[i + 1] * 0.75 + p[i + 3] * 0.25, p[i] * 0.25 + p[i + 2] * 0.75, p[i + 1] * 0.25 + p[i + 3] * 0.75);
  }
  o.push(p[p.length - 2], p[p.length - 1]);
  return o;
}
