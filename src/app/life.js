import { W } from "../core/tables.js";
import { makeRng } from "../core/util.js";
import { UNITS, SHIPS, SHIP_NAME_WORDS, SHIP_NAME_ADJ } from "../content/military.js";
import { LOOKUP } from "../content/lookup.js";
import { GOODS } from "../content/goods.js";
import { roadLine } from "../gen/trade.js";
import { findCell } from "../gen/lookup.js";

// Everything that moves: armies, fleets, merchant ships, fishing boats and caravans.
// Positions are pure functions of the clock (see time.js), so there is nothing to simulate.
//
// Armies are drawn at the level of detail the zoom can carry:
//   counter      a map token with the army's size (world map)
//   divisions    one block per division, in formation
//   battalions   one block per battalion with its unit symbol
//   companies    blocks of ranks
//   soldiers     every soldier, with the weapon their unit carries; archers shoot, lines push
// Ships go from a small icon to a drawn hull with masts, sails, gun ports and a flag.

const UNIT = LOOKUP.unit; void UNITS;
const SHIP = Object.fromEntries(SHIPS.map(s => [s.id, s]));
const hash = (a, b = 0, c = 0) => { let h = (a * 374761393 + b * 668265263 + c * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shade = (c, f) => [c[0] * f, c[1] * f, c[2] * f];
const KIT = { light: [128, 96, 64], mail: [150, 152, 156], plate: [196, 200, 206], robe: null, hide: [110, 84, 58] };
const SKIN = ["#e6c3a0", "#c89a74", "#9a6c48", "#6e4a30", "#f0d2b4"];

export function makeLifeLayer(app) {
  let G = null, mPerW = 1, ships = [], boats = [], caravans = [], armies = [], fleets = [], battlesOf = new Map();
  let roadBoxes = [], roadCache = new Map();

  function reset(world) {
    G = world; mPerW = 1000 * G.worldKm / W;
    ships = []; boats = []; caravans = []; armies = []; fleets = [];
    if (!G.Q || !G.Z) return;
    const { Q, Z, X, M, T, S } = G, st = X.settlements;
    // routes: cumulative lengths for walking along them
    for (const r of Q.routes) {
      const p = r.pts, n = p.length / 2, cum = new Float64Array(n);
      for (let i = 1; i < n; i++) { let dx = p[2 * i] - p[2 * i - 2]; cum[i] = cum[i - 1] + Math.hypot(dx, p[2 * i + 1] - p[2 * i - 1]); }
      r.cum = cum; r.total = cum[n - 1];
    }
    const realmOf = p => S.own[p];
    for (const r of Q.routes) {
      if (r.flow < 0.01 || r.total <= 0) continue;
      const rng = makeRng(G.seed + "|traffic|" + r.id);
      if (r.sea) {
        const n = Math.min(14, Math.round(r.flow * 26 + 0.7));
        for (let i = 0; i < n; i++) {
          const fromA = rng.chance(0.5), home = fromA ? r.a : r.b, types = (Z.portShips[home] || Z.portShips[r.a] || { merchant: ["cog"] }).merchant;
          const type = SHIP[rng.pick(types.length ? types : ["cog"])] || SHIP.cog;
          ships.push({
            kind: "ship", route: r, type, phase: rng.f(), knots: type.rig === "oars" ? 3.5 : rng.range(3.5, 7.5), home, dest: fromA ? r.b : r.a,
            name: rng.chance(0.5) ? `${rng.pick(SHIP_NAME_ADJ)} ${rng.pick(SHIP_NAME_WORDS)}` : `${st[home].name} ${rng.pick(SHIP_NAME_WORDS)}`,
            realm: realmOf(home), cargo: r.goods.slice(0, 2), tonnes: Math.round(type.cargo * rng.range(0.5, 1)), crew: Math.round(type.crew * rng.range(0.8, 1.1)),
          });
        }
      } else {
        const n = Math.min(8, Math.round(r.flow * 18 + 0.4));
        for (let i = 0; i < n; i++) {
          caravans.push({ kind: "caravan", route: r, phase: rng.f(), kmh: rng.range(2.5, 4), wagons: rng.int(2, 9), guards: rng.int(2, 12), goods: r.goods.slice(0, 2), home: rng.chance(0.5) ? r.a : r.b, id: r.id * 16 + i });
        }
      }
    }
    // fishing boats around ports
    for (const s of st) {
      if (!s.port || s.tier < 1) continue;
      let best = -1, bd = Infinity;
      for (let k = M.nStart[s.cell]; k < M.nStart[s.cell + 1]; k++) { const nb = M.nbr[k]; if (T.type[nb] !== 1) continue; const d = (M.x[nb] - s.x) ** 2 + (M.y[nb] - s.y) ** 2; if (d < bd) { bd = d; best = nb; } }
      if (best < 0) continue;
      const rng = makeRng(G.seed + "|fish|" + s.id), n = Math.min(6, 1 + s.tier + rng.int(0, 2));
      const type = SHIP[(Z.portShips[s.prov] || { fishing: ["fishing"] }).fishing[0]] || SHIP.fishing;
      // boats work a patch of water between the town and the cell's sea neighbour
      const cx = s.x + (M.x[best] - s.x) * 0.6, cy = s.y + (M.y[best] - s.y) * 0.6;
      for (let i = 0; i < n; i++) boats.push({ kind: "boat", type, cx, cy, r: rng.range(0.4, 1.6) * 1000 / mPerW, phase: rng.f() * Math.PI * 2, speed: rng.range(0.4, 1) * (rng.chance(0.5) ? 1 : -1), home: s.prov, realm: realmOf(s.prov), name: `${rng.pick(SHIP_NAME_ADJ)} ${rng.pick(SHIP_NAME_WORDS)}`, crew: rng.int(2, type.crew) });
    }
    // armies: flatten battalions and work out each division's box
    for (const a of Z.armies) {
      const bats = [];
      a.divisions.forEach((d, di) => d.regiments.forEach((rg, ri) => rg.battalions.forEach((b, bi) => bats.push({ a, b, di, ri, bi, u: UNIT[b.unit] }))));
      const divBox = a.divisions.map(() => [Infinity, Infinity, -Infinity, -Infinity]);
      let half = 0;
      for (const B of bats) {
        const bx = divBox[B.di]; bx[0] = Math.min(bx[0], B.b.fx - B.b.w / 2); bx[2] = Math.max(bx[2], B.b.fx + B.b.w / 2); bx[1] = Math.min(bx[1], B.b.fy - B.b.d / 2); bx[3] = Math.max(bx[3], B.b.fy + B.b.d / 2);
        half = Math.max(half, Math.abs(B.b.fx) + B.b.w / 2);
      }
      const rgb = Z.actors[a.actor].rgb;
      const roles = {}; for (const B of bats) roles[B.u.role] = (roles[B.u.role] || 0) + B.b.men;
      const main = Object.entries(roles).sort((x, y) => y[1] - x[1])[0][0];
      const A = { a, bats, divBox, half, rgb, main, fx: Math.cos(a.ang), fy: Math.sin(a.ang), rx: -Math.sin(a.ang), ry: Math.cos(a.ang) };
      armyGeom(A);
      armies.push(A);
    }
    battlesOf = new Map();
    for (const A of armies) if (A.a.battle) {
      const foe = armies.find(B => B !== A && B.a.war === A.a.war && B.a.front === A.a.front && B.a.side !== A.a.side);
      if (foe) battlesOf.set(A, foe);
    }
    fleets = Z.fleets.map(f => ({ f, rgb: Z.actors[f.actor].rgb }));
    // every road's bounding box; its traffic is only built when the road comes into view
    roadCache = new Map();
    roadBoxes = (X.roads || []).map((rd, i) => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const c of rd.cells) { x0 = Math.min(x0, M.x[c]); x1 = Math.max(x1, M.x[c]); y0 = Math.min(y0, M.y[c]); y1 = Math.max(y1, M.y[c]); }
      const pad = M.s; return [x0 - pad, y0 - pad, x1 + pad, y1 + pad, i];
    });
  }

  /* ---------- everyday traffic on every road ---------- */
  const TRAVELLERS = [
    { k: "cart", n: "Carter with a loaded wagon", kmh: 3.5, w: 3, col: "#6b4a2a" },
    { k: "walkers", n: "Travellers on foot", kmh: 4.5, w: 3, col: "#7a5a8a" },
    { k: "rider", n: "Rider", kmh: 10, w: 1.5, col: "#3a3a3a" },
    { k: "pilgrims", n: "Pilgrims", kmh: 3.2, w: 0.8, col: "#d8d0b8" },
    { k: "patrol", n: "Road patrol", kmh: 5, w: 0.7, col: null },
    { k: "herd", n: "Drover with a herd", kmh: 2.8, w: 1, col: "#8a6a4a" },
  ];
  function roadTraffic(ri) {
    let t = roadCache.get(ri); if (t) return t;
    const rd = G.X.roads[ri], pts = roadLine(G, rd), n = pts.length / 2, cum = new Float64Array(n);
    for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(pts[2 * i] - pts[2 * i - 2], pts[2 * i + 1] - pts[2 * i - 1]);
    const route = { pts, cum, total: cum[n - 1] }, km = route.total * G.worldKm / W, rng = makeRng(G.seed + "|roadtraffic|" + ri);
    const count = Math.min(60, Math.round(km / 5 * (rd.cls ? 1.6 : 0.8)));
    const tot = TRAVELLERS.reduce((a, b) => a + b.w, 0), list = [];
    for (let i = 0; i < count; i++) {
      let r = rng.f() * tot, ty = TRAVELLERS[0]; for (const x of TRAVELLERS) { r -= x.w; if (r <= 0) { ty = x; break; } }
      list.push({ kind: "traveller", ty, route, phase: rng.f(), kmh: ty.kmh * rng.range(0.8, 1.2), side: rng.f() < 0.5 ? 1 : -1, n: ty.k === "walkers" ? rng.int(1, 4) : ty.k === "pilgrims" ? rng.int(3, 9) : ty.k === "patrol" ? rng.int(3, 6) : ty.k === "herd" ? rng.int(6, 16) : 1, id: ri * 64 + i, road: ri });
    }
    t = { route, list };
    roadCache.set(ri, t);
    if (roadCache.size > 400) roadCache.delete(roadCache.keys().next().value);
    return t;
  }
  function roadsInView(v, fn) {
    const x0 = -v.ox / v.k, y0 = -v.oy / v.k, x1 = (app.cw - v.ox) / v.k, y1 = (app.ch - v.oy) / v.k;
    for (const b of roadBoxes) if (b[2] >= x0 && b[0] <= x1 && b[3] >= y0 && b[1] <= y1) fn(b[4]);
  }
  function travellerPos(t, tMin) { return alongRoute(t.route, t.phase * 2 * t.route.total + tMin / 60 * t.kmh * kmW()); }
  function drawTraveller(ctx, t, px, py, h, p, owner) {
    const back = Math.cos(h), side = t.side * 3 * p, ox = -Math.sin(h) * side, oy = Math.cos(h) * side;
    px += ox; py += oy;
    if (p < 0.35) { ctx.fillStyle = t.ty.col || css(owner || [120, 40, 40]); ctx.fillRect(px - 1.5, py - 1.5, 3, 3); return; }
    const u = { kit: "light", wpn: "", role: "infantry" };
    switch (t.ty.k) {
      case "cart": drawCaravan(ctx, px, py, h, { wagons: 1, guards: 0, id: t.id }, p); break;
      case "rider": drawSoldier(ctx, px, py, p, { ...u, mounted: 1, wpn: "" }, [90, 80, 70], SKIN[t.id % SKIN.length], 0, back >= 0 ? 1 : -1); break;
      case "patrol": for (let i = 0; i < t.n; i++) drawSoldier(ctx, px - Math.cos(h) * i * 1.5 * p, py - Math.sin(h) * i * 1.5 * p, p, { kit: "mail", wpn: "spear", role: "infantry" }, owner || [120, 40, 40], SKIN[(t.id + i) % SKIN.length], 0, back >= 0 ? 1 : -1); break;
      case "herd": for (let i = 0; i < t.n; i++) { const hx = px - Math.cos(h) * (i % 6) * 2.2 * p + ((i * 7) % 3 - 1) * p, hy = py - Math.sin(h) * (i % 6) * 2.2 * p + (Math.floor(i / 6) - 1) * 1.4 * p; ctx.fillStyle = i % 3 ? "#8a6a4a" : "#e8e0d0"; ctx.fillRect(hx - 0.9 * p, hy - 1.1 * p, 1.8 * p, 0.9 * p); } drawSoldier(ctx, px + Math.cos(h) * 3 * p, py + Math.sin(h) * 3 * p, p, { ...u, wpn: "staff" }, [110, 90, 60], SKIN[t.id % SKIN.length], 0, 1); break;
      default: for (let i = 0; i < t.n; i++) drawSoldier(ctx, px - Math.cos(h) * i * 1.2 * p + (i % 2) * 0.6 * p, py - Math.sin(h) * i * 1.2 * p, p, { ...u, wpn: t.ty.k === "pilgrims" ? "staff" : "" }, t.ty.k === "pilgrims" ? [220, 210, 190] : [[150, 60, 50], [60, 90, 140], [90, 120, 70], [170, 150, 100]][(t.id + i) % 4], SKIN[(t.id + i) % SKIN.length], 0, back >= 0 ? 1 : -1);
    }
  }

  /* ---------- positions ---------- */
  const alongRoute = (r, dist) => {
    // ping-pong along the route; returns [x, y, heading]
    const L = r.total, d2 = ((dist % (2 * L)) + 2 * L) % (2 * L), back = d2 > L, d = back ? 2 * L - d2 : d2, cum = r.cum, p = r.pts;
    let lo = 0, hi = cum.length - 1; while (lo < hi - 1) { const m = (lo + hi) >> 1; if (cum[m] <= d) lo = m; else hi = m; }
    const t = (d - cum[lo]) / Math.max(1e-9, cum[hi] - cum[lo]);
    const x = p[2 * lo] + (p[2 * hi] - p[2 * lo]) * t, y = p[2 * lo + 1] + (p[2 * hi + 1] - p[2 * lo + 1]) * t;
    let h = Math.atan2(p[2 * hi + 1] - p[2 * lo + 1], p[2 * hi] - p[2 * lo]); if (back) h += Math.PI;
    return [x, y, h];
  };
  const kmW = () => 1000 / mPerW;      // world units per km
  const findCellLife = (x, y) => findCell(G.M, ((x % W) + W) % W, y);
  function shipPos(s, tMin) { return alongRoute(s.route, s.phase * 2 * s.route.total + tMin / 60 * s.knots * 1.852 * kmW()); }
  function boatPos(b, tMin) { const a = b.phase + tMin / 60 * b.speed * 3, r = b.r * (0.7 + 0.3 * Math.sin(a * 2.3)); return [b.cx + Math.cos(a) * r, b.cy + Math.sin(a) * r, a + (b.speed > 0 ? Math.PI / 2 : -Math.PI / 2)]; }
  function caravanPos(c, tMin) { return alongRoute(c.route, c.phase * 2 * c.route.total + tMin / 60 * c.kmh * kmW()); }
  function fleetShips(F, tMin) {
    const f = F.f, fx = Math.cos(f.ang), fy = Math.sin(f.ang), out = [];
    const drift = Math.sin(tMin / 90 + f.id) * 0.6 * kmW();
    f.ships.forEach((s, i) => {
      const ty = SHIP[s.type] || SHIP.war_brig, row = Math.floor(i / 6), col = i % 6, sp = ty.len * 3.5 / mPerW;
      const along = (col - 2.5) * sp + drift, across = (row - 0.5) * sp * 2.2;
      out.push({ s, ty, x: f.x + fx * along - fy * across, y: f.y + fy * along + fx * across, h: f.ang });
    });
    return out;
  }

  /* ---------- drawing helpers ---------- */
  const pxm = v => v.k / mPerW;  // screen px per metre
  const onScr = (px, py, pad = 40) => px > -pad && py > -pad && px < app.cw + pad && py < app.ch + pad;

  function drawShip(ctx, px, py, h, ty, p, rgb, war) {
    const L = ty.len * p, Bm = ty.beam * p;
    ctx.save(); ctx.translate(px, py); ctx.rotate(h);
    if (L < 11) {
      // icon: a small hull and a sail, a constant few pixels
      ctx.fillStyle = war ? "#3a2a1c" : "#6b4a2e"; ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-4, -2.2); ctx.lineTo(-4, 2.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = war ? "#fff" : "#f2ead6"; ctx.fillRect(-1.2, -3.2, 2.2, 6.4);
      ctx.restore(); return;
    }
    // wake
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = Math.max(1, Bm * 0.1);
    ctx.beginPath(); ctx.moveTo(-L * 0.5, -Bm * 0.3); ctx.lineTo(-L * 1.1, -Bm * 1.1); ctx.moveTo(-L * 0.5, Bm * 0.3); ctx.lineTo(-L * 1.1, Bm * 1.1); ctx.stroke();
    // hull, deck, rail
    const hull = war ? "#3b2a1d" : "#6a4629", deck = war ? "#8a6a48" : "#a88458";
    ctx.fillStyle = hull; ctx.beginPath();
    ctx.moveTo(L / 2, 0); ctx.quadraticCurveTo(L * 0.32, -Bm / 2, L * 0.1, -Bm / 2); ctx.lineTo(-L / 2, -Bm * 0.42); ctx.lineTo(-L / 2, Bm * 0.42); ctx.lineTo(L * 0.1, Bm / 2); ctx.quadraticCurveTo(L * 0.32, Bm / 2, L / 2, 0); ctx.fill();
    ctx.fillStyle = deck; ctx.beginPath();
    ctx.moveTo(L * 0.42, 0); ctx.quadraticCurveTo(L * 0.28, -Bm * 0.36, L * 0.08, -Bm * 0.36); ctx.lineTo(-L * 0.46, -Bm * 0.3); ctx.lineTo(-L * 0.46, Bm * 0.3); ctx.lineTo(L * 0.08, Bm * 0.36); ctx.quadraticCurveTo(L * 0.28, Bm * 0.36, L * 0.42, 0); ctx.fill();
    if (war) { ctx.fillStyle = "#d8b34a"; ctx.fillRect(-L * 0.46, -Bm * 0.47, L * 0.6, Math.max(1, Bm * 0.05)); ctx.fillRect(-L * 0.46, Bm * 0.42, L * 0.6, Math.max(1, Bm * 0.05)); }
    // gun ports
    if (ty.guns && L > 26) {
      const n = Math.min(18, Math.ceil(ty.guns / 2)); ctx.fillStyle = "#1a120a";
      for (let i = 0; i < n; i++) { const gx = -L * 0.38 + i * (L * 0.62 / n); ctx.fillRect(gx, -Bm * 0.5, Math.max(1, L * 0.012), Math.max(1, Bm * 0.06)); ctx.fillRect(gx, Bm * 0.44, Math.max(1, L * 0.012), Math.max(1, Bm * 0.06)); }
    }
    // oars
    if (ty.rig === "oars" || ty.oars) {
      ctx.strokeStyle = "#5a3a1e"; ctx.lineWidth = Math.max(1, p * 0.15); ctx.beginPath();
      const n = Math.max(4, Math.round(ty.len / 3)), sw = Math.sin(app.clock.anim * 2.5) * Bm * 0.25;
      for (let i = 0; i < n; i++) { const ox = -L * 0.35 + i * (L * 0.7 / n); ctx.moveTo(ox, -Bm * 0.45); ctx.lineTo(ox + sw, -Bm * 1.1); ctx.moveTo(ox, Bm * 0.45); ctx.lineTo(ox + sw, Bm * 1.1); }
      ctx.stroke();
    }
    // masts and sails, seen from above: square sails are bars across the ship, lateen sails lie along it
    const sail = war ? "#f4f1ea" : "#eadfc4", seam = "rgba(120,100,70,.5)";
    for (let m = 0; m < ty.masts; m++) {
      const mx = ty.masts === 1 ? 0 : L * (0.28 - m * 0.56 / (ty.masts - 1));
      if (ty.rig === "square") {
        const sw = Bm * (m === 0 && ty.masts > 1 ? 1.5 : 1.8), sd = Math.max(2, L * 0.1);
        ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(mx - sd / 2, -sw / 2); ctx.quadraticCurveTo(mx + sd, 0, mx - sd / 2, sw / 2); ctx.lineTo(mx - sd, sw / 2); ctx.quadraticCurveTo(mx, 0, mx - sd, -sw / 2); ctx.fill();
        ctx.strokeStyle = seam; ctx.lineWidth = 1; ctx.stroke();
      } else if (ty.rig === "lateen") {
        ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(mx + L * 0.28, -Bm * 0.15); ctx.lineTo(mx - L * 0.3, Bm * 0.1); ctx.lineTo(mx - L * 0.12, Bm * 0.55); ctx.closePath(); ctx.fill();
      } else if (ty.rig === "junk") {
        ctx.fillStyle = "#b8643a"; const sw = Bm * 1.1, sd = Math.max(2, L * 0.1);
        ctx.fillRect(mx - sd, -sw / 2, sd, sw);
        ctx.strokeStyle = "rgba(60,30,15,.7)"; ctx.lineWidth = 1; ctx.beginPath(); for (let b = 1; b < 4; b++) { ctx.moveTo(mx - sd, -sw / 2 + sw * b / 4); ctx.lineTo(mx, -sw / 2 + sw * b / 4); } ctx.stroke();
      }
      ctx.fillStyle = "#3a2410"; ctx.beginPath(); ctx.arc(mx, 0, Math.max(1, Bm * 0.07), 0, Math.PI * 2); ctx.fill();
    }
    // flag at the stern
    if (rgb) { ctx.fillStyle = css(rgb); ctx.fillRect(-L * 0.5 - Math.max(3, L * 0.08), -Math.max(1.5, Bm * 0.12), Math.max(3, L * 0.08), Math.max(3, Bm * 0.24)); }
    ctx.restore();
  }

  function drawCaravan(ctx, px, py, h, c, p) {
    const wagonPx = 5 * p;
    if (wagonPx < 2) {
      ctx.fillStyle = "#5a3a1a"; for (let i = 0; i < 3; i++) ctx.fillRect(px - Math.cos(h) * i * 3 - 1.5, py - Math.sin(h) * i * 3 - 1.5, 3, 3);
      return;
    }
    ctx.save(); ctx.translate(px, py); ctx.rotate(h);
    for (let i = 0; i < c.wagons; i++) {
      const x = -i * 9 * p;
      // oxen pulling
      ctx.fillStyle = "#6a4a30"; ctx.fillRect(x + 3 * p, -0.9 * p, 2.2 * p, 0.7 * p); ctx.fillRect(x + 3 * p, 0.2 * p, 2.2 * p, 0.7 * p);
      ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x - 2.5 * p, -1 * p, 5 * p, 2 * p);
      ctx.fillStyle = hash(c.id, i) < 0.5 ? "#e8dcc0" : "#d4c29a"; ctx.fillRect(x - 2.2 * p, -0.85 * p, 4.4 * p, 1.7 * p);
    }
    // guards walking alongside
    ctx.fillStyle = "#3a3a44";
    for (let g = 0; g < c.guards; g++) { const x = -hash(c.id, g, 3) * c.wagons * 9 * p, side = g % 2 ? -1 : 1; ctx.fillRect(x, side * 2.2 * p - 0.3 * p, 0.6 * p, 0.6 * p); }
    ctx.restore();
  }

  // one soldier, upright in the angled view: feet at (x, y)
  function drawSoldier(ctx, x, y, p, u, rgb, skin, pose, face) {
    const s = p;
    if (u.mounted) {
      // the horse (or beast) side on, facing the army's way across the screen
      const dir = face >= 0 ? 1 : -1, beast = u.role === "beast";
      ctx.fillStyle = beast ? "#4a4038" : u.id === "camel_riders" ? "#c8a56a" : "#6a4428";
      ctx.fillRect(x - 1.1 * s, y - 1.5 * s, 2.2 * s, 0.8 * s);              // body
      ctx.fillRect(x + dir * 0.9 * s - 0.2 * s, y - 2 * s, 0.45 * s, 0.7 * s); // neck and head
      ctx.fillRect(x - 0.9 * s, y - 0.75 * s, 0.25 * s, 0.75 * s); ctx.fillRect(x + 0.65 * s, y - 0.75 * s, 0.25 * s, 0.75 * s); // legs
      y -= 1.3 * s;
    }
    const kit = KIT[u.kit] || rgb;
    ctx.fillStyle = "#3a2e24"; ctx.fillRect(x - 0.22 * s, y - 0.75 * s, 0.44 * s, 0.75 * s);  // legs
    ctx.fillStyle = css(kit); ctx.fillRect(x - 0.3 * s, y - 1.45 * s, 0.6 * s, 0.75 * s);      // torso
    ctx.fillStyle = css(rgb); ctx.fillRect(x - 0.2 * s, y - 1.38 * s, 0.4 * s, 0.5 * s);        // tabard in the realm's colour
    ctx.fillStyle = skin; ctx.fillRect(x - 0.17 * s, y - 1.8 * s, 0.34 * s, 0.34 * s);          // head
    if (u.kit === "mail" || u.kit === "plate") { ctx.fillStyle = "#8a8e94"; ctx.fillRect(x - 0.19 * s, y - 1.86 * s, 0.38 * s, 0.14 * s); }
    const hx = x + face * 0.34 * s, lift = pose * 0.25 * s;
    switch (u.wpn) {
      case "spear": case "lance": ctx.fillStyle = "#6a4a2a"; ctx.fillRect(hx - 0.04 * s, y - 3.2 * s - lift, 0.08 * s, 2.3 * s); ctx.fillStyle = "#c0c4c8"; ctx.fillRect(hx - 0.07 * s, y - 3.4 * s - lift, 0.14 * s, 0.25 * s); break;
      case "pike": ctx.fillStyle = "#6a4a2a"; ctx.fillRect(hx - 0.04 * s, y - 5 * s, 0.08 * s, 4 * s); ctx.fillStyle = "#c0c4c8"; ctx.fillRect(hx - 0.07 * s, y - 5.2 * s, 0.14 * s, 0.25 * s); break;
      case "sword": case "axe": ctx.fillStyle = "#c8ccd0"; ctx.fillRect(hx - 0.05 * s, y - 1.9 * s - lift, 0.1 * s, 0.7 * s); if (u.wpn === "axe") ctx.fillRect(hx, y - 1.9 * s - lift, 0.22 * s, 0.2 * s); break;
      case "bow": ctx.strokeStyle = "#5a3a1a"; ctx.lineWidth = Math.max(1, 0.08 * s); ctx.beginPath(); ctx.arc(hx, y - 1.3 * s - lift, 0.55 * s, -Math.PI / 2 - 1, -Math.PI / 2 + 1); ctx.stroke(); break;
      case "xbow": ctx.fillStyle = "#5a3a1a"; ctx.fillRect(hx - 0.3 * s, y - 1.25 * s, 0.6 * s, 0.1 * s); break;
      case "javelin": ctx.fillStyle = "#7a5a3a"; ctx.fillRect(hx - 0.03 * s, y - 2.5 * s - lift, 0.06 * s, 1.5 * s); break;
      case "staff": ctx.fillStyle = "#5a3a1a"; ctx.fillRect(hx - 0.04 * s, y - 2.4 * s, 0.08 * s, 1.9 * s); ctx.fillStyle = "#8ff0ff"; ctx.fillRect(hx - 0.12 * s, y - 2.55 * s, 0.24 * s, 0.24 * s); break;
      case "siege": break;
    }
  }
  function drawEngine(ctx, x, y, p, face) {
    ctx.fillStyle = "#6a4a2a"; ctx.fillRect(x - 2.5 * p, y - 1.2 * p, 5 * p, 1.2 * p);
    ctx.fillRect(x - 0.3 * p, y - 5 * p, 0.6 * p, 3.8 * p);
    ctx.save(); ctx.translate(x, y - 4.6 * p); ctx.rotate(face * 0.9); ctx.fillRect(-0.2 * p, -3 * p, 0.4 * p, 4.5 * p); ctx.restore();
    ctx.fillStyle = "#3a2a1a"; ctx.beginPath(); ctx.arc(x - 1.8 * p, y, 0.7 * p, 0, 7); ctx.arc(x + 1.8 * p, y, 0.7 * p, 0, 7); ctx.fill();
  }
  // unit symbols, as on a staff map
  function symbol(ctx, x, y, w, h, role) {
    ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.3; ctx.beginPath();
    if (role === "infantry") { ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.moveTo(x + w / 2, y - h / 2); ctx.lineTo(x - w / 2, y + h / 2); }
    else if (role === "cavalry" || role === "beast") { ctx.moveTo(x - w / 2, y + h / 2); ctx.lineTo(x + w / 2, y - h / 2); if (role === "beast") { ctx.moveTo(x - w / 4, y - h / 2); ctx.lineTo(x - w / 4, y + h / 2); } }
    else if (role === "ranged") { ctx.arc(x, y + h * 0.1, h * 0.35, Math.PI * 1.05, Math.PI * 1.95); ctx.moveTo(x - h * 0.35, y + h * 0.1); ctx.lineTo(x + h * 0.35, y + h * 0.1); }
    else if (role === "siege") { ctx.arc(x, y, h * 0.3, 0, Math.PI * 2); }
    else if (role === "magic") { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 4 / 5; const px2 = x + Math.cos(a) * h * 0.38, py2 = y + Math.sin(a) * h * 0.38; if (i) ctx.lineTo(px2, py2); else ctx.moveTo(px2, py2); } ctx.closePath(); }
    ctx.stroke();
  }
  // an oriented rectangle in an army's frame, as a screen polygon
  function quad(ctx, A, v, cx, cy, w, d, sx, sy) {
    const k = v.k / mPerW, hw = w / 2, hd = d / 2;
    ctx.beginPath();
    [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].forEach(([a, b], i) => {
      const lx = cx + a, ly = cy + b, px = sx + (A.rx * lx + A.fx * ly) * k, py = sy + (A.ry * lx + A.fy * ly) * k;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    });
    ctx.closePath();
  }
  const toScr = (A, v, sx, sy, lx, ly) => { const k = v.k / mPerW; return [sx + (A.rx * lx + A.fx * ly) * k, sy + (A.ry * lx + A.fy * ly) * k]; };

  function armyLevel(A, p) {
    // one scale for every army, so tokens and formations never mix on screen
    if (p * 1000 < 45) return 0;
    const bw = Math.min(...A.bats.map(B => B.b.w));
    if (bw * p < 26) return 1;
    const cw = Math.min(...A.bats.map(B => B.b.w / B.b.companies.length));
    if (cw * p < 22) return 2;
    if (Math.min(...A.bats.map(B => B.u.gap)) * p < 3.2) return 3;
    return 4;
  }

  /* ---------- armies off the battle line: camps, barracks, sieges, columns on the march ---------- */
  function armyGeom(A) {
    const a = A.a, side = Math.min(700, Math.max(80, Math.sqrt(a.men) * 2.6));
    const camp = (cx, cy, ang, w, d) => ({ cx, cy, ang, w, d, ca: Math.cos(ang), sa: Math.sin(ang) });
    A.camps = [];
    if (a.mode === "siege") {
      // camps ringed around the town, each facing it
      const n = Math.min(5, Math.max(2, Math.round(a.men / 5000) + 2)), sz = side / Math.sqrt(n) * 1.15, R = a.siege.r + sz * 0.6 + 120;
      for (let i = 0; i < n; i++) { const t = a.ang + i * Math.PI * 2 / n; A.camps.push(camp(a.x + Math.cos(t) * R / mPerW, a.y + Math.sin(t) * R / mPerW, t + Math.PI / 2, sz * 1.3, sz)); }
    } else if (a.mode === "camp" || a.mode === "barracks") A.camps.push(camp(a.x, a.y, a.ang, side * 1.3, side));
    if (a.mode === "march") {
      const p = a.path, n = p.length / 2, cum = new Float64Array(n);
      for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(p[2 * i] - p[2 * i - 2], p[2 * i + 1] - p[2 * i - 1]) * mPerW;
      A.cum = cum; A.pathM = cum[n - 1];
      // the order of march: cavalry scouts ahead, then infantry and archers, siege and baggage last
      const rank = { cavalry: 0, beast: 0, infantry: 1, magic: 1, ranged: 2, siege: 3 };
      A.column = A.bats.slice().sort((x, y) => (rank[x.u.role] ?? 1) - (rank[y.u.role] ?? 1)).map(B => {
        const files = B.u.mounted ? 3 : 5, gap = B.u.mounted ? B.u.gap * 1.3 : B.u.gap * 1.1;
        return { B, files, gap, len: Math.ceil(B.b.men / files) * gap };
      });
    }
  }
  // where a march column's head is now, and which way it is going (along its stretch of road)
  function marchHead(A, tMin) {
    const L = A.pathM, d = ((A.a.phase * 2 * L + tMin / 60 * A.a.kmh * 1000) % (2 * L) + 2 * L) % (2 * L);
    return d > L ? { s: 2 * L - d, dir: -1 } : { s: d, dir: 1 };
  }
  function pathAt(A, sM) {
    const cum = A.cum, p = A.a.path, s2 = Math.max(0, Math.min(A.pathM, sM));
    let lo = 0, hi = cum.length - 1; while (lo < hi - 1) { const m = (lo + hi) >> 1; if (cum[m] <= s2) lo = m; else hi = m; }
    const t = (s2 - cum[lo]) / Math.max(1e-9, cum[hi] - cum[lo]);
    const x = p[2 * lo] + (p[2 * hi] - p[2 * lo]) * t, y = p[2 * lo + 1] + (p[2 * hi + 1] - p[2 * lo + 1]) * t, l = Math.hypot(p[2 * hi] - p[2 * lo], p[2 * hi + 1] - p[2 * lo + 1]) || 1;
    return [x, y, (p[2 * hi] - p[2 * lo]) / l, (p[2 * hi + 1] - p[2 * lo + 1]) / l];
  }
  // where to put the army's map token
  function anchorOf(A) {
    if (A.a.mode === "march") { const h = marchHead(A, app.clock.t), [x, y] = pathAt(A, h.s); return [x, y]; }
    return [A.a.x, A.a.y];
  }
  const campPt = (c, lx, ly) => [c.cx + (lx * c.ca - ly * c.sa) / mPerW, c.cy + (lx * c.sa + ly * c.ca) / mPerW];
  function drawCamp(ctx, v, A, c, lvl, anim) {
    const p = pxm(v), toS = (lx, ly) => { const [x, y] = campPt(c, lx, ly); return [x * v.k + v.ox, y * v.k + v.oy]; };
    const [cx, cy] = toS(0, 0); if (!onScr(cx, cy, Math.max(c.w, c.d) * p)) return;
    const barracks = A.a.mode === "barracks";
    // ground and palisade
    ctx.beginPath(); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], i) => { const [x, y] = toS(a * c.w / 2, b * c.d / 2); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.closePath();
    ctx.fillStyle = barracks ? "rgba(150,130,100,.55)" : "rgba(128,104,70,.4)"; ctx.fill();
    ctx.strokeStyle = barracks ? "#6a625a" : "#6a4a2a"; ctx.lineWidth = Math.max(1.2, (barracks ? 2.5 : 1.2) * p); ctx.stroke();
    if (lvl <= 1 || 4 * p < 2) {
      symbolBox(ctx, cx, cy, A);
      return;
    }
    // tents in rows with lanes, or long barrack halls
    const rng = makeRng("camp" + A.a.id + ":" + c.cx);
    if (barracks) {
      for (let y = -c.d / 2 + 14; y < c.d / 2 - 12; y += 20) for (let x = -c.w / 2 + 22; x < c.w / 2 - 20; x += 40) {
        const [x0, y0] = toS(x - 15, y - 4), [x1, y1] = toS(x + 15, y + 4);
        const [tx, ty] = toS(x, y); if (!onScr(tx, ty)) continue;
        ctx.fillStyle = "#8a6a4a"; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1) - 3 * p * 0.8, Math.abs(x1 - x0), Math.abs(y1 - y0));
        ctx.fillStyle = "#6a3a2a"; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1) - 3 * p * 0.8 - 2 * p, Math.abs(x1 - x0), 2 * p);
      }
    } else {
      for (let y = -c.d / 2 + 8, row = 0; y < c.d / 2 - 6; y += 9, row++) {
        if (row % 5 === 2) continue; // a lane
        for (let x = -c.w / 2 + 7, col = 0; x < c.w / 2 - 6; x += 7.5, col++) {
          if (col % 7 === 3) continue;
          const [tx, ty] = toS(x, y); if (!onScr(tx, ty, 6)) continue;
          const ts = 2.2 * p, own = (row * 31 + col) % 9 === 0;
          ctx.fillStyle = own ? css(A.rgb) : "#e6dac0"; ctx.beginPath(); ctx.moveTo(tx - ts, ty); ctx.lineTo(tx, ty - ts * 1.1); ctx.lineTo(tx + ts, ty); ctx.closePath(); ctx.fill();
          if (ts > 3) { ctx.fillStyle = "rgba(60,40,20,.4)"; ctx.fillRect(tx - ts * 0.15, ty - ts * 0.55, ts * 0.3, ts * 0.55); }
        }
      }
    }
    // the commander's banner
    const [fx, fy] = toS(0, 0), fh = Math.max(10, 9 * p);
    ctx.fillStyle = "#3a2a1a"; ctx.fillRect(fx - 1, fy - fh, 2, fh); ctx.fillStyle = css(A.rgb); ctx.fillRect(fx + 1, fy - fh, Math.max(6, 3 * p), Math.max(4, 2 * p));
    // soldiers about the camp
    if (lvl >= 4) {
      const n = Math.min(360, Math.round(A.a.men / 14));
      for (let i = 0; i < n; i++) {
        const B = A.bats[i % A.bats.length], lx = (rng.f() - 0.5) * c.w * 0.9 + Math.sin(anim * 0.25 + i) * 3, ly = (rng.f() - 0.5) * c.d * 0.9 + Math.cos(anim * 0.2 + i * 1.7) * 3;
        const [x, y] = toS(lx, ly); if (!onScr(x, y, 10)) continue;
        drawSoldier(ctx, x, y, p, { ...B.u, mounted: 0, wpn: B.u.wpn === "siege" ? "sword" : B.u.wpn }, A.rgb, SKIN[i % SKIN.length], 0, i % 2 ? 1 : -1);
      }
    }
  }
  function symbolBox(ctx, x, y, A) {
    ctx.fillStyle = css(A.rgb); ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.2; ctx.fillRect(x - 11, y - 7, 22, 14); ctx.strokeRect(x - 11, y - 7, 22, 14);
    ctx.fillStyle = "rgba(255,250,240,.85)"; ctx.fillRect(x - 8, y - 4, 16, 8); symbol(ctx, x, y, 14, 7, A.main);
  }
  function drawSiegeWorks(ctx, v, A, lvl, anim) {
    const p = pxm(v), a = A.a, cx = a.x * v.k + v.ox, cy = a.y * v.k + v.oy, R = (a.siege.r + 150) * p;
    if (!onScr(cx, cy, R + 50)) return;
    // earthworks round the town
    ctx.setLineDash([Math.max(4, 12 * p), Math.max(3, 6 * p)]); ctx.strokeStyle = "rgba(90,60,30,.85)"; ctx.lineWidth = Math.max(1.5, 4 * p);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    if (lvl < 2) return;
    // siege engines on the ring, lobbing stones into the town
    const n = 10, er = (a.siege.r + 90) * p;
    for (let i = 0; i < n; i++) {
      const t = a.ang + (i + 0.5) * Math.PI * 2 / n, x = cx + Math.cos(t) * er, y = cy + Math.sin(t) * er;
      if (!onScr(x, y)) continue;
      if (lvl >= 4) drawEngine(ctx, x, y, p, Math.cos(t) > 0 ? -1 : 1); else { ctx.fillStyle = "#4a3422"; ctx.fillRect(x - 3, y - 3, 6, 6); }
      const T = 6, f = ((anim + i * 0.83) % T) / T, tx = cx + Math.cos(t) * er * 0.35, ty = cy + Math.sin(t) * er * 0.35;
      const bx = x + (tx - x) * f, by = y + (ty - y) * f - Math.sin(f * Math.PI) * er * 0.3;
      ctx.fillStyle = "#3a3430"; ctx.beginPath(); ctx.arc(bx, by, Math.max(1.5, 0.6 * p), 0, 7); ctx.fill();
    }
  }
  function drawMarch(ctx, v, A, lvl, tMin) {
    const p = pxm(v), h = marchHead(A, tMin), w = Math.max(3, 6 * p);
    let s = h.s;
    const scr = sm => { const [x, y, tx, ty] = pathAt(A, sm); return [x * v.k + v.ox, y * v.k + v.oy, tx * h.dir, ty * h.dir]; };
    const [hx, hy] = scr(s); if (!onScr(hx, hy, (A.column.reduce((a, c) => a + c.len, 0) + 200) * p)) return;
    for (const col of A.column) {
      const s0 = s, s1 = s - h.dir * col.len;
      if (lvl <= 3) {
        // the battalion as a band along the road
        ctx.strokeStyle = css(A.rgb); ctx.lineWidth = Math.max(w * 0.7, col.files * col.gap * p); ctx.lineCap = "butt"; ctx.beginPath();
        const steps = Math.max(2, Math.ceil(col.len / 25));
        for (let k = 0; k <= steps; k++) { const [x, y] = scr(s0 + (s1 - s0) * k / steps); if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke(); ctx.lineCap = "round";
      } else {
        const ranks = Math.ceil(col.B.b.men / col.files);
        for (let r = 0; r < ranks; r++) {
          const [x, y, tx, ty] = scr(s0 - h.dir * r * col.gap); if (!onScr(x, y, 20)) continue;
          for (let f = 0; f < col.files; f++) {
            const off = (f - (col.files - 1) / 2) * col.gap * p, px = x - ty * off, py = y + tx * off;
            if (col.B.u.role === "siege") { if (f === 2 && r % 3 === 0) drawEngine(ctx, px, py, p, tx >= 0 ? 1 : -1); continue; }
            drawSoldier(ctx, px, py, p, col.B.u, A.rgb, SKIN[(r + f) % SKIN.length], 0, tx >= 0 ? 1 : -1);
          }
        }
      }
      s = s1 - h.dir * 14;
    }
    if (lvl <= 2) symbolBox(ctx, hx, hy - 14, A);
  }

  function drawArmy(ctx, v, A, anim) {
    if (A.a.mode && A.a.mode !== "line") {
      const p0 = pxm(v), lvl0 = armyLevel(A, p0); if (lvl0 === 0) return;
      if (A.a.mode === "march") return drawMarch(ctx, v, A, lvl0, app.clock.t);
      if (A.a.mode === "siege") drawSiegeWorks(ctx, v, A, lvl0, anim);
      for (const c of A.camps) drawCamp(ctx, v, A, c, lvl0, anim);
      return;
    }
    const p = pxm(v), sx = A.a.x * v.k + v.ox, sy = A.a.y * v.k + v.oy, span = A.half * p + 400 * p;
    if (!onScr(sx, sy, span + 60)) return;
    const lvl = armyLevel(A, p);
    if (lvl === 0) return; // tokens are drawn with the UI layer
    const side = A.rgb, dark = shade(side, 0.55);
    const foe = battlesOf.get(A);
    // camp behind armies that are not fighting
    if (!A.a.battle && lvl >= 2) {
      const rng = makeRng("camp" + A.a.id);
      for (let i = 0; i < 26; i++) {
        const lx = rng.range(-A.half * 0.8, A.half * 0.8), ly = rng.range(-320, -200);
        const [tx, ty] = toScr(A, v, sx, sy, lx, ly);
        const ts = 4 * p; if (!onScr(tx, ty)) continue;
        ctx.fillStyle = i % 5 ? "#e8dcc0" : css(side); ctx.beginPath(); ctx.moveTo(tx - ts, ty); ctx.lineTo(tx, ty - ts * 0.9); ctx.lineTo(tx + ts, ty); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(60,40,20,.35)"; ctx.fillRect(tx - ts * 0.15, ty - ts * 0.5, ts * 0.3, ts * 0.5);
      }
    }
    // the fallen, between the lines of a battle
    if (foe && lvl >= 2) {
      const rng = makeRng("fallen" + A.a.id), gapM = Math.hypot(foe.a.x - A.a.x, foe.a.y - A.a.y) * mPerW;
      for (let i = 0; i < 90; i++) {
        const [tx, ty] = toScr(A, v, sx, sy, rng.range(-A.half * 0.7, A.half * 0.7), rng.range(30, gapM * 0.55));
        if (!onScr(tx, ty)) continue;
        ctx.fillStyle = rng.chance(0.5) ? css(dark) : "#5a4a3a"; ctx.fillRect(tx - 0.8 * p, ty - 0.25 * p, 1.7 * p, Math.max(1, 0.5 * p));
      }
    }
    for (const B of A.bats) {
      const b = B.b, u = B.u;
      // battle: the line sways forward and back
      const push = foe && (u.role === "infantry" || u.role === "beast") ? Math.sin(anim * 1.3 + B.bi + B.ri * 2) * 1.2 : 0;
      const cy = b.fy + push;
      const [bx, by] = toScr(A, v, sx, sy, b.fx, cy); if (!onScr(bx, by, b.w * p)) continue;
      if (lvl === 1) continue;
      if (lvl === 2) {
        quad(ctx, A, v, b.fx, cy, b.w, Math.max(b.d, 8), sx, sy); ctx.fillStyle = css(side, 0.92); ctx.fill(); ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.2; ctx.stroke();
        const sw = Math.min(b.w * p * 0.5, 26), sh = Math.min(sw * 0.62, 16);
        ctx.fillStyle = "rgba(255,250,240,.9)"; ctx.fillRect(bx - sw / 2, by - sh / 2, sw, sh); symbol(ctx, bx, by, sw, sh, u.role);
        continue;
      }
      const nC = b.companies.length, cw = b.w / nC;
      for (let c = 0; c < nC; c++) {
        const ccx = b.fx - b.w / 2 + cw * (c + 0.5);
        if (lvl === 3) {
          quad(ctx, A, v, ccx, cy, cw - 1.5, b.d, sx, sy); ctx.fillStyle = css(side); ctx.fill();
          // rank lines
          ctx.strokeStyle = css(dark, 0.8); ctx.lineWidth = 1; ctx.beginPath();
          for (let r = 1; r < u.ranks; r++) { const ly = cy - b.d / 2 + b.d * r / u.ranks, [x1, y1] = toScr(A, v, sx, sy, ccx - cw / 2 + 0.8, ly), [x2, y2] = toScr(A, v, sx, sy, ccx + cw / 2 - 0.8, ly); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
          ctx.stroke();
          continue;
        }
        // every soldier
        const men = b.companies[c], files = Math.max(1, Math.ceil(men / u.ranks)), gx = u.gap, gy = u.mounted ? u.gap * 1.3 : u.gap;
        const face = A.fx >= 0 ? 1 : -1;
        let n = 0;
        for (let r = 0; r < u.ranks; r++) for (let f = 0; f < files && n < men; f++, n++) {
          const lx = ccx - cw / 2 + (f + 0.5) * (cw / files), ly = cy + b.d / 2 - (r + 0.5) * gy;
          const jit = (hash(A.a.id * 7 + B.bi, c * 131 + f, r) - 0.5) * 0.3;
          const [x, y] = toScr(A, v, sx, sy, lx + jit, ly + jit);
          if (!onScr(x, y, 10 * p)) continue;
          if (u.role === "siege") { drawEngine(ctx, x, y, p, face); continue; }
          const pose = foe ? (u.role === "ranged" ? (Math.sin(anim * 2 + f * 0.7 + r) > 0.3 ? 1 : 0) : Math.sin(anim * 4 + f * 1.3 + r * 2)) : 0;
          drawSoldier(ctx, x, y, p, u, side, SKIN[Math.floor(hash(f, r, B.bi) * SKIN.length)], pose, face);
        }
      }
    }
    // division blocks when that is all the zoom can carry
    if (lvl === 1) A.a.divisions.forEach((d, di) => {
      const bx = A.divBox[di], cx = (bx[0] + bx[2]) / 2, cy = (bx[1] + bx[3]) / 2;
      quad(ctx, A, v, cx, cy, bx[2] - bx[0], Math.max(bx[3] - bx[1], 20), sx, sy); ctx.fillStyle = css(side, 0.9); ctx.fill(); ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.5; ctx.stroke();
      const [lx, ly] = toScr(A, v, sx, sy, cx, cy), w = (bx[2] - bx[0]) * p;
      if (w > 60) { ctx.font = '700 11px "Alegreya Sans", system-ui, sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,250,238,.85)"; ctx.strokeText(d.n, lx, ly); ctx.fillStyle = "#1a120a"; ctx.fillText(d.n, lx, ly); }
    });
    // arrows and spells in the air
    if (foe && lvl >= 2) {
      const fsx = foe.a.x * v.k + v.ox + (Math.abs(foe.a.x - A.a.x) > W / 2 ? Math.sign(A.a.x - foe.a.x) * W * v.k : 0), fsy = foe.a.y * v.k + v.oy;
      for (const B of A.bats) {
        if (B.u.role !== "ranged" && B.u.role !== "magic" && B.u.role !== "siege") continue;
        const n = lvl === 4 ? 36 : 10;
        for (let i = 0; i < n; i++) {
          const T = B.u.role === "siege" ? 5 : 2.6, t = ((anim + hash(B.bi, i, A.a.id) * T) % T) / T;
          const [x0, y0] = toScr(A, v, sx, sy, B.b.fx + (hash(i, 1, B.bi) - 0.5) * B.b.w, B.b.fy);
          const [x1, y1] = toScr(foe, v, fsx, fsy, (hash(i, 2, B.bi) - 0.5) * foe.half * 0.6, foe.bats.length ? 10 : 0);
          const arc = Math.hypot(x1 - x0, y1 - y0) * 0.35, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * arc;
          if (!onScr(x, y)) continue;
          if (B.u.role === "magic") { ctx.fillStyle = "rgba(140,240,255,.9)"; ctx.beginPath(); ctx.arc(x, y, Math.max(2, 0.8 * p), 0, 7); ctx.fill(); continue; }
          if (B.u.role === "siege") { ctx.fillStyle = "#3a3430"; ctx.beginPath(); ctx.arc(x, y, Math.max(1.5, 0.5 * p), 0, 7); ctx.fill(); continue; }
          const dx = (x1 - x0), dy = (y1 - y0) - Math.cos(t * Math.PI) * arc * Math.PI, l = Math.hypot(dx, dy) || 1, al = Math.max(3, 0.9 * p);
          ctx.strokeStyle = "rgba(40,28,16,.85)"; ctx.lineWidth = Math.max(1, 0.06 * p); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dx / l * al, y - dy / l * al); ctx.stroke();
        }
      }
    }
  }

  /* ---------- layer API ---------- */
  function draw(ctx, dpr, v) {
    if (!G || !G.Z) return;
    const p = pxm(v), tMin = app.clock.t, anim = app.clock.anim, L = app.ui.layers;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pkm = p * 1000;
    if (L.traffic && pkm >= 3) {
      for (const b of boats) {
        const [x, y, h] = boatPos(b, tMin), px = x * v.k + v.ox, py = y * v.k + v.oy;
        if (onScr(px, py) && pkm >= 8) drawShip(ctx, px, py, h, b.type, p, null, false);
      }
      for (const s of ships) {
        const [x, y, h] = shipPos(s, tMin), px = x * v.k + v.ox, py = y * v.k + v.oy;
        if (onScr(px, py)) drawShip(ctx, px, py, h, s.type, p, s.realm >= 0 ? G.S.states[s.realm].rgb : null, false);
      }
      // everyday traffic on every road once roads are drawn in detail
      if (pkm >= 4) roadsInView(v, ri => {
        const tr = roadTraffic(ri), owner = null;
        for (const t of tr.list) {
          const [x, y, h] = travellerPos(t, tMin), px = x * v.k + v.ox, py = y * v.k + v.oy;
          if (!onScr(px, py)) continue;
          drawTraveller(ctx, t, px, py, h, p, t.ty.k === "patrol" ? patrolColour(x, y) : owner);
        }
      });
      if (pkm >= 6) for (const c of caravans) {
        const [x, y, h] = caravanPos(c, tMin), px = x * v.k + v.ox, py = y * v.k + v.oy;
        if (onScr(px, py)) drawCaravan(ctx, px, py, h, c, p);
      }
    }
    if (L.military) {
      if (pkm >= 3) for (const F of fleets) for (const fs of fleetShips(F, tMin)) {
        const px = fs.x * v.k + v.ox, py = fs.y * v.k + v.oy;
        if (onScr(px, py)) drawShip(ctx, px, py, fs.h, fs.ty, p, F.rgb, true);
      }
      const order = armies.slice().sort((a, b) => a.a.y - b.a.y);
      for (const A of order) drawArmy(ctx, v, A, anim);
    }
  }
  // lights after dark: ship lanterns and camp fires
  function drawLights(ctx, dpr, v, darkAt) {
    if (!G || !G.Z) return;
    const p = pxm(v), pkm = p * 1000, tMin = app.clock.t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    const glow = (px, py, r, a) => { const g = ctx.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, `rgba(255,190,90,${a})`); g.addColorStop(1, "rgba(255,150,60,0)"); ctx.fillStyle = g; ctx.fillRect(px - r, py - r, r * 2, r * 2); };
    if (app.ui.layers.traffic && pkm >= 3) for (const s of ships) {
      const [x, y] = shipPos(s, tMin), d = darkAt(x, y); if (d < 0.3) continue;
      const px = x * v.k + v.ox, py = y * v.k + v.oy; if (onScr(px, py)) glow(px, py, Math.max(4, 12 * p), 0.55 * d);
    }
    if (app.ui.layers.military && pkm >= 3) for (const A of armies) {
      const d = darkAt(A.a.x, A.a.y); if (d < 0.3) continue;
      if (A.camps && A.camps.length) {
        const flick = 0.85 + Math.sin(app.clock.anim * 7 + A.a.id) * 0.15;
        for (const c of A.camps) { const rng = makeRng("fires" + A.a.id + ":" + c.cx); for (let i = 0; i < 10; i++) { const [x, y] = campPt(c, (rng.f() - 0.5) * c.w * 0.8, (rng.f() - 0.5) * c.d * 0.8), fx = x * v.k + v.ox, fy = y * v.k + v.oy; if (onScr(fx, fy)) glow(fx, fy, Math.max(3, 16 * p), 0.7 * d * flick); } }
        continue;
      }
      if (A.a.mode === "march") continue;
      const sx = A.a.x * v.k + v.ox, sy = A.a.y * v.k + v.oy; if (!onScr(sx, sy, A.half * p + 300 * p)) continue;
      const rng = makeRng("fires" + A.a.id), flick = 0.85 + Math.sin(app.clock.anim * 7 + A.a.id) * 0.15;
      for (let i = 0; i < 14; i++) {
        const [fx, fy] = toScr(A, v, sx, sy, rng.range(-A.half * 0.8, A.half * 0.8), A.a.battle ? rng.range(-120, -40) : rng.range(-330, -190));
        if (onScr(fx, fy)) glow(fx, fy, Math.max(3, 18 * p), 0.7 * d * flick);
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }
  // map tokens for armies and fleets when zoomed out (drawn above the night)
  function drawUI(ctx, dpr, v, showTokens) {
    if (!G || !G.Z || !app.ui.layers.military || !showTokens) return;
    const p = pxm(v);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const drawn = [], zr = v.k / app.fitK;
    // armies in battle first, then the rest; garrisons only once zoomed in; a budget that grows with zoom
    let left = Math.round(40 * zr * zr);
    const order = armies.slice().sort((x, y) => (battlesOf.has(y) ? 2 : y.a.garrison ? 0 : 1) - (battlesOf.has(x) ? 2 : x.a.garrison ? 0 : 1));
    for (const A of order) {
      if (armyLevel(A, p) > 0) continue;
      if (A.a.garrison && zr < 4) continue;
      if (left <= 0) break;
      const [ax0, ay0] = anchorOf(A), px = ax0 * v.k + v.ox, py = ay0 * v.k + v.oy; if (!onScr(px, py)) continue;
      if (app.dc ? !app.dc.take(px - 13, py - 9, px + 13, py + 16) : drawn.some(([x, y]) => Math.abs(x - px) < 20 && Math.abs(y - py) < 14)) continue;
      drawn.push([px, py]); left--;
      const w = 24, h = 15;
      ctx.fillStyle = css(A.rgb); ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.4;
      ctx.fillRect(px - w / 2, py - h / 2, w, h); ctx.strokeRect(px - w / 2, py - h / 2, w, h);
      ctx.fillStyle = "rgba(255,250,240,.85)"; ctx.fillRect(px - w / 2 + 3, py - h / 2 + 3, w - 6, h - 6);
      symbol(ctx, px, py, w - 8, h - 7, A.main);
      ctx.font = '700 10.5px "IBM Plex Mono", ui-monospace, monospace'; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,250,238,.9)";
      const txt = A.a.men >= 1000 ? (A.a.men / 1000).toFixed(A.a.men < 10000 ? 1 : 0) + "k" : String(A.a.men);
      ctx.strokeText(txt, px, py + h / 2 + 7); ctx.fillStyle = "#1a120a"; ctx.fillText(txt, px, py + h / 2 + 7);
      if (battlesOf.has(A)) {
        // crossed swords: a battle is being fought here
        const bx = px + w / 2 + 7, by = py - h / 2;
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 5, by - 5); ctx.lineTo(bx + 5, by + 5); ctx.moveTo(bx + 5, by - 5); ctx.lineTo(bx - 5, by + 5); ctx.stroke();
        ctx.strokeStyle = "#a01a10"; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    if (p * 1000 < 3) for (const F of fleets) {
      const px = F.f.x * v.k + v.ox, py = F.f.y * v.k + v.oy; if (!onScr(px, py)) continue;
      ctx.fillStyle = css(F.rgb); ctx.strokeStyle = "#1a120a"; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(px - 9, py - 3); ctx.lineTo(px + 9, py - 3); ctx.lineTo(px + 6, py + 5); ctx.lineTo(px - 6, py + 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.fillRect(px - 1, py - 11, 2, 8); ctx.fillRect(px - 5, py - 10, 4, 5);
      ctx.font = '700 10px "IBM Plex Mono", ui-monospace, monospace'; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,250,238,.9)";
      ctx.strokeText(String(F.f.ships.length), px + 14, py); ctx.fillStyle = "#1a120a"; ctx.fillText(String(F.f.ships.length), px + 14, py);
    }
  }

  // a road patrol wears the colours of the realm whose land it is on
  function patrolColour(x, y) {
    const c = findCellLife(x, y); if (c < 0) return [120, 40, 40];
    const st = G.S.own[G.R.owner[c]]; return st >= 0 ? G.S.states[st].rgb : [120, 40, 40];
  }

  /* ---------- picking ---------- */
  function pick(wx, wy, v, showTokens) {
    if (!G || !G.Z) return null;
    const p = pxm(v), tMin = app.clock.t, tol = 9 / v.k;
    const dW = (ax, ay) => { let dx = wx - ax; if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W; return [dx, wy - ay]; };
    if (app.ui.layers.military) {
      for (const A of armies) {
        const lvl = armyLevel(A, p);
        const [ax0, ay0] = anchorOf(A), [dx, dy] = dW(ax0, ay0);
        if (lvl === 0) { if (showTokens && Math.abs(dx) < 14 / v.k && Math.abs(dy) < 10 / v.k) return { kind: "army", A }; continue; }
        if (A.a.mode === "march") {
          const h = marchHead(A, tMin), total = A.column.reduce((a, c) => a + c.len + 14, 0);
          for (let sM = 0; sM < total; sM += 20) { const [x, y] = pathAt(A, h.s - h.dir * sM), [ex, ey] = dW(x, y); if (Math.hypot(ex, ey) < Math.max(tol, 12 / mPerW)) return { kind: "army", A }; }
          continue;
        }
        if (A.camps && A.camps.length) {
          for (const c of A.camps) { const [ex, ey] = dW(c.cx, c.cy), lx = (ex * c.ca + ey * c.sa) * mPerW, ly = (-ex * c.sa + ey * c.ca) * mPerW; if (Math.abs(lx) <= c.w / 2 && Math.abs(ly) <= c.d / 2) return { kind: "army", A }; }
          if (A.a.mode === "siege" && Math.hypot(dx, dy) * mPerW < A.a.siege.r + 200) return { kind: "army", A };
          continue;
        }
        const lx = (dx * A.rx + dy * A.ry) * mPerW, ly = (dx * A.fx + dy * A.fy) * mPerW;
        for (const B of A.bats) {
          const b = B.b;
          if (Math.abs(lx - b.fx) > b.w / 2 + 1 || Math.abs(ly - b.fy) > Math.max(b.d, 8) / 2 + 1) continue;
          if (lvl === 1) return { kind: "army", A, division: B.di };
          const c = Math.min(b.companies.length - 1, Math.max(0, Math.floor((lx - (b.fx - b.w / 2)) / (b.w / b.companies.length))));
          return { kind: "army", A, division: B.di, regiment: B.ri, battalion: B.bi, company: lvl >= 3 ? c : -1, soldier: lvl >= 4 };
        }
      }
      for (const F of fleets) {
        if (p * 1000 < 3) { const [dx, dy] = dW(F.f.x, F.f.y); if (showTokens && Math.hypot(dx, dy) < tol * 1.4) return { kind: "fleet", F }; continue; }
        for (const fs of fleetShips(F, tMin)) { const [dx, dy] = dW(fs.x, fs.y); if (Math.hypot(dx, dy) < Math.max(tol, fs.ty.len / 2 / mPerW)) return { kind: "fleet", F, ship: fs.s, ty: fs.ty }; }
      }
    }
    if (app.ui.layers.traffic && p * 1000 >= 3) {
      for (const s of ships) { const [x, y] = shipPos(s, tMin), [dx, dy] = dW(x, y); if (Math.hypot(dx, dy) < Math.max(tol, s.type.len / 2 / mPerW)) return { kind: "ship", s }; }
      for (const b of boats) { const [x, y] = boatPos(b, tMin), [dx, dy] = dW(x, y); if (Math.hypot(dx, dy) < Math.max(tol, b.type.len / 2 / mPerW)) return { kind: "boat", b }; }
      for (const c of caravans) { const [x, y] = caravanPos(c, tMin), [dx, dy] = dW(x, y); if (Math.hypot(dx, dy) < Math.max(tol, c.wagons * 9 / mPerW)) return { kind: "caravan", c }; }
      if (p * 1000 >= 4) { let hit = null; roadsInView(v, ri => { if (hit) return; for (const t of roadTraffic(ri).list) { const [x, y] = travellerPos(t, tMin), [dx, dy] = dW(x, y); if (Math.hypot(dx, dy) < Math.max(tol, 8 / mPerW)) { hit = { kind: "traveller", t }; return; } } }); if (hit) return hit; }
    }
    return null;
  }
  // is anything that moves on screen? (drives the animation rate)
  function busy(v) { return !!G && pxm(v) * 1000 >= 3; }
  const goodsName = gs => gs.map(g => GOODS[g].n).join(", ");
  // everything that moves, for search: each entry knows where it is right now and what to open
  function findables() {
    const out = [], now = () => app.clock.t;
    for (const A of armies) out.push({ t: A.a.name, sub: `Army · ${A.a.men ? A.a.men.toLocaleString("en-US") + " men" : ""}`, pos: () => [A.a.x, A.a.y], lp: { kind: "army", A } });
    for (const F of fleets) {
      out.push({ t: F.f.name, sub: `Fleet · ${F.f.ships.length} ships`, pos: () => [F.f.x, F.f.y], lp: { kind: "fleet", F } });
      for (const sh of F.f.ships) out.push({ t: sh.name, sub: `Warship · ${F.f.name}`, pos: () => [F.f.x, F.f.y], lp: { kind: "fleet", F } });
    }
    for (const s of ships) out.push({ t: s.name, sub: `Merchant ship · ${s.type.n}`, pos: () => shipPos(s, now()), lp: { kind: "ship", s } });
    return out;
  }
  return { reset, draw, drawLights, drawUI, pick, busy, goodsName, findables, get armies() { return armies; } };
}
