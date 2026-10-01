import { clamp, makeRng, shuffle } from "../core/util.js";
import { W } from "../core/tables.js";
import { pickSome, pickOne } from "../core/rules.js";
import { CASUS_BELLI } from "../content/society.js";
import { UNITS, SHIPS, ARMY_NAMES, ARMY_DIRS, SHIP_NAME_WORDS, SHIP_NAME_ADJ } from "../content/military.js";
import { findCell } from "./lookup.js";
import { styleFor } from "./archstyles.js";
import { roadLine } from "./trade.js";
import { urbanRadiusKm } from "./settlements.js";

// The world as it is today: who is at war with whom and why, which provinces are occupied, where
// the front lines run, and every army and fleet in the field, down to the company.
//   wars      picked from the most hostile neighbours; the reason (casus belli) comes from the rules
//   control   each war has a score; the winning side occupies land to a depth set by that score
//   fronts    province borders between enemies, as world-space lines
//   armies    spread along each front; where both sides meet, a battle. Each army is divisions of
//             regiments of battalions of companies, with a formation laid out in metres
//   fleets    every realm with ports keeps a navy; at war they blockade or fight at sea
// Units and ships are chosen per realm by the rule engine, so a horse-lord horde fields horse
// archers and a magocracy brings battle mages.

const wrapDx = dx => { dx = Math.abs(dx); return Math.min(dx, W - dx); };
const ORD = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
const REGT = ["Lions", "Wolves", "Ravens", "Bears", "Stags", "Hawks", "Oaks", "Towers", "Lances", "Shields", "Blades", "Suns", "Stars", "Boars", "Serpents", "Griffins", "Thorns", "Hammers"];
const REGT_ADJ = ["Red", "Black", "White", "Iron", "Golden", "Grey", "Green", "Silver", "Blue", "Old", "King's", "Queen's", "Royal", "Border", "Free"];

export function genConflict(G, P, seed) {
  const rng = makeRng(seed + "|conflict"), nameRng = makeRng(seed + "|conflictnames");
  const { M, T, R, S, X, Y } = G, provs = R.provs, np = provs.length, st = X.settlements, nS = S.states.length;
  const mPerW = 1000 * G.worldKm / W, wOfM = m => m / mPerW;
  const warLevel = (P.conflict ?? 50) / 100;
  const tags = Y.realms.map(r => new Set(r.tags));
  const langOf = p => Y.cultures[Y.cultureOf[p]].lang;

  /* ---- actors: every realm, plus rebel factions ---- */
  const actors = S.states.map(s => ({ id: s.id, name: s.name, short: s.short, rgb: s.rgb, realm: s.id, rebel: false }));
  const control = new Int32Array(np); for (let p = 0; p < np; p++) control[p] = S.own[p];
  const warOf = new Int16Array(np).fill(-1);
  const wars = [], atWar = new Set();

  /* ---- wars between neighbours ---- */
  const nWars = Math.round(warLevel * nS * 0.14 + (warLevel > 0.1 ? 0.6 : 0));
  const cands = Y.relations.filter(r => r.op < 10).map(r => ({ r, key: r.op + rng.range(-25, 25) })).sort((a, b) => a.key - b.key);
  const relOf = new Map(Y.relations.map(r => [r.a < r.b ? r.a * 100000 + r.b : r.b * 100000 + r.a, r]));
  const rel = (a, b) => relOf.get(a < b ? a * 100000 + b : b * 100000 + a);
  for (const { r } of cands) {
    if (wars.length >= nWars) break;
    if (atWar.has(r.a) || atWar.has(r.b)) continue;
    // the attacker is usually the bigger or the angrier side
    const sa = S.states[r.a].provs.length, sb = S.states[r.b].provs.length;
    const [A, D] = rng.chance(sa / (sa + sb) * 0.7 + 0.15) ? [r.a, r.b] : [r.b, r.a];
    const ctx = new Set();
    for (const t of tags[A]) ctx.add("a:" + t);
    for (const t of tags[D]) ctx.add("b:" + t);
    if (Y.realms[A].culture === Y.realms[D].culture) ctx.add("pair:same:culture");
    if (Y.realms[A].faith !== Y.realms[D].faith) ctx.add("pair:differ:faith");
    if (r.status === "rival") ctx.add("pair:rival");
    const cb = pickOne(rng, CASUS_BELLI, ctx, CASUS_BELLI[0]);
    const border = S.states[D].provs.find(p => provs[p].adj.some(q => S.own[q] === A)) ?? S.states[D].capital;
    const nameWord = cb.id === "succession" ? S.states[D].short : rng.chance(0.5) ? S.states[D].short : provs[border].name;
    const war = {
      id: wars.length, name: rng.pick(cb.names).replace("$", nameWord), cb: cb.id, cbName: cb.n,
      attackers: [A], defenders: [D], score: Math.round(rng.range(-55, 70)), days: rng.int(20, 3000), civil: false,
      why: r.why.filter(w => w[1] < 0).map(w => w[0]).slice(0, 2),
    };
    atWar.add(A); atWar.add(D);
    // allies answer the call
    for (const [side, lead] of [[war.attackers, A], [war.defenders, D]]) {
      for (const q of Y.relations) {
        if (q.status !== "alliance" || (q.a !== lead && q.b !== lead)) continue;
        const ally = q.a === lead ? q.b : q.a;
        if (atWar.has(ally) || !rng.chance(0.65)) continue;
        side.push(ally); atWar.add(ally);
      }
    }
    wars.push(war);
  }
  // civil wars: a big realm splits
  const nCivil = Math.round(warLevel * nS * 0.04 + (rng.chance(warLevel * 0.8) ? 1 : 0));
  const bigRealms = shuffle(rng, S.states.filter(s => s.provs.length >= 10 && !atWar.has(s.id)));
  for (const s of bigRealms.slice(0, nCivil)) {
    const hop = new Map([[s.capital, 0]]), q = [s.capital];
    for (let h = 0; h < q.length; h++) for (const r of provs[q[h]].adj) if (S.own[r] === s.id && !hop.has(r)) { hop.set(r, hop.get(q[h]) + 1); q.push(r); }
    const far = q.slice(Math.floor(q.length * 0.75));
    const seedP = rng.pick(far.length ? far : q), target = Math.max(2, Math.round(s.provs.length * rng.range(0.15, 0.35)));
    const region = [seedP], inR = new Set(region);
    for (let h = 0; h < region.length && region.length < target; h++) {
      for (const r of shuffle(rng, provs[region[h]].adj.slice())) if (S.own[r] === s.id && !inR.has(r) && r !== s.capital && region.length < target) { inR.add(r); region.push(r); }
    }
    const realm = Y.realms[s.id], monarchy = tags[s.id].has("monarchy"), place = provs[seedP].name;
    const rname = monarchy ? rng.pick(["Free Commune of $", "$ Republic", "Kingdom of $", "Rightful Crown of $"]) : rng.pick(["Kingdom of $", "Holy $", "Free $"]);
    const rid = actors.length;
    actors.push({ id: rid, name: rname.replace("$", place), short: place, rgb: s.rgb.map(v => v * 0.55), realm: -1, rebel: true, of: s.id });
    for (const p of region) control[p] = rid;
    const war = {
      id: wars.length, name: rng.pick(["The $ Rebellion", "The $ Uprising", "The War of $ Independence", "The $ Revolt"]).replace("$", place),
      cb: "rebellion", cbName: "Rebellion", attackers: [rid], defenders: [s.id], score: 0, days: rng.int(10, 900), civil: true,
      why: [realm.culture !== Y.cultureOf[seedP] ? "A different people wants its own crown" : Y.faithOf[seedP] !== realm.faith ? "A persecuted faith rose up" : rng.pick(["Crushing taxes", "A disputed heir", "A lord defied the crown", "Famine and anger"])],
    };
    atWar.add(s.id);
    wars.push(war);
  }

  /* ---- occupation ---- */
  const sideOf = (war, a) => war.attackers.includes(a) ? 1 : war.defenders.includes(a) ? -1 : 0;
  for (const war of wars) {
    if (war.civil) continue;
    const A = war.attackers[0], D = war.defenders[0];
    const [win, lose] = war.score >= 0 ? [A, D] : [D, A], depthF = Math.abs(war.score) / 60;
    const loseProvs = S.states[lose].provs;
    const maxHop = clamp(Math.round(Math.sqrt(loseProvs.length) * 0.7), 1, 7);
    const border = loseProvs.filter(p => provs[p].adj.some(q => control[q] === win));
    let startSet = border;
    if (!border.length) {
      // no land border: a landing on the loser's nearest coast
      const wc = provs[S.states[win].capital];
      const coast = loseProvs.filter(p => provs[p].coastal).sort((a, b) => (wrapDx(provs[a].cx - wc.cx) ** 2 + (provs[a].cy - wc.cy) ** 2) - (wrapDx(provs[b].cx - wc.cx) ** 2 + (provs[b].cy - wc.cy) ** 2));
      startSet = coast.slice(0, 1);
      war.naval = true;
    }
    const hop = new Map(); const q = [];
    for (const p of startSet) { hop.set(p, 0); q.push(p); }
    for (let h = 0; h < q.length; h++) for (const r of provs[q[h]].adj) if (S.own[r] === lose && !hop.has(r)) { hop.set(r, hop.get(q[h]) + 1); q.push(r); }
    for (const [p, h] of hop) {
      if (p === S.states[lose].capital && Math.abs(war.score) < 55) continue;
      const reach = depthF * maxHop + rng.range(-0.8, 0.8);
      if (h < reach || (h === 0 && rng.chance(0.25))) control[p] = win;
    }
    // a few counter-raids the other way along the border
    for (const p of S.states[win].provs) if (provs[p].adj.some(r => S.own[r] === lose && control[r] === lose) && rng.chance(0.12)) control[p] = lose;
  }

  /* ---- army templates per realm ---- */
  const templates = S.states.map(s => {
    const ctx = tags[s.id];
    const picks = pickSome(rng, UNITS, ctx, rng.int(4, 6));
    if (!picks.some(u => u.role === "infantry")) picks.unshift(UNITS[0]);
    if (!picks.some(u => u.role === "ranged")) picks.push(UNITS.find(u => u.id === "archers"));
    return picks.map((u, i) => ({ unit: u.id, w: u.role === "infantry" ? 3 : u.role === "ranged" ? 2 : u.role === "siege" ? 0.4 : u.role === "magic" ? 0.5 : 1.2 }));
  });
  const unitById = Object.fromEntries(UNITS.map(u => [u.id, u]));

  /* ---- ships: merchant types per port, and navies ---- */
  const shipCtx = p => { const s = new Set(tags[S.own[p]] || []); for (const t of Y.ptags[p]) s.add(t); s.add("style:" + styleFor(G, st[p])); return s; };
  const portShips = new Map();
  for (const s of st) if (s.port) {
    const ctx = shipCtx(s.prov);
    portShips.set(s.prov, {
      merchant: pickSome(rng, SHIPS.filter(x => x.role === "merchant"), ctx, 2).map(x => x.id),
      fishing: pickSome(rng, SHIPS.filter(x => x.role === "fishing"), ctx, 1).map(x => x.id),
    });
  }
  const Z = { actors, wars, control, templates, portShips: Object.fromEntries(portShips) };
  computeFronts(G, Z);
  deployForces(G, Z, 0);
  return Z;
}

// Front lines: every border between provinces controlled by enemies in some war. Called again by
// the history layer whenever control changes.
export function computeFronts(G, Z) {
  const { M, T, R, S } = G, np = R.provs.length, { wars, control } = Z;
  const warOf = new Int16Array(np).fill(-1);
  const sideOf = (war, a) => war.attackers.includes(a) ? 1 : war.defenders.includes(a) ? -1 : 0;
  /* ---- front lines ---- */
  const enemy = (a, b) => { if (a < 0 || b < 0 || a === b) return -1; for (const w of wars) { const sa = sideOf(w, a), sb = sideOf(w, b); if (sa && sb && sa !== sb) return w.id; } return -1; };
  const pairSegs = new Map();
  for (let e = 0; e < M.E; e++) {
    const ca = M.eA[e], cb = M.eB[e]; if (T.type[ca] !== 0 || T.type[cb] !== 0) continue;
    const pa = R.owner[ca], pb = R.owner[cb]; if (pa === pb) continue;
    const w = enemy(control[pa], control[pb]); if (w < 0) continue;
    const k = pa < pb ? pa * 100000 + pb : pb * 100000 + pa;
    let f = pairSegs.get(k); if (!f) pairSegs.set(k, f = { war: w, a: Math.min(pa, pb), b: Math.max(pa, pb), segs: [] });
    f.segs.push(M.eXY[4 * e], M.eXY[4 * e + 1], M.eXY[4 * e + 2], M.eXY[4 * e + 3]);
  }
  const fronts = [];
  for (const f of pairSegs.values()) {
    warOf[f.a] = f.war; warOf[f.b] = f.war;
    let mx = 0, my = 0; const n = f.segs.length / 4;
    for (let i = 0; i < f.segs.length; i += 4) { mx += f.segs[i] + f.segs[i + 2]; my += f.segs[i + 1] + f.segs[i + 3]; }
    fronts.push({ war: f.war, a: f.a, b: f.b, segs: Float32Array.from(f.segs), mx: mx / (2 * n), my: my / (2 * n), len: n });
  }
  for (let p = 0; p < np; p++) if (control[p] !== S.own[p] && control[p] >= 0) { for (const w of wars) if (sideOf(w, control[p])) { warOf[p] = w.id; break; } }

  Z.fronts = fronts; Z.warOf = warOf;
}

// Armies and fleets for the wars as they stand: field armies along each front (in battle, camped,
// marching or besieging), garrisons in realms at peace, and navies. Called again by the history
// layer when wars start, end or move; `salt` keeps each deployment deterministic.
export function deployForces(G, Z, salt) {
  const rng = makeRng(G.seed + "|forces|" + salt), nameRng = makeRng(G.seed + "|forcenames|" + salt), seed = G.seed + "|" + salt;
  const { M, T, R, S, X, Y } = G, provs = R.provs, st = X.settlements, { actors, wars, control, fronts, templates } = Z;
  const mPerW = 1000 * G.worldKm / W, wOfM = m => m / mPerW;
  const sideOf = (war, a) => war.attackers.includes(a) ? 1 : war.defenders.includes(a) ? -1 : 0;
  const atWar = new Set(); for (const w of wars) for (const a of [...w.attackers, ...w.defenders]) atWar.add(actors[a].rebel ? actors[a].of : a);
  const tags = Y.realms.map(r => new Set(r.tags));
  const unitById = Object.fromEntries(UNITS.map(u => [u.id, u]));
  const manpower = S.states.map(s => { let v = 0; for (const p of s.provs) v += st[X.mainOf[p]].pop; return v * 6 * 0.03; });
  /* ---- armies ---- */
  let armySeq = 0;
  const armies = [];
  const buildArmy = (actor, realm, men, name, general) => {
    const tpl = templates[realm], rngA = makeRng(seed + "|army|" + armySeq);
    const divisions = [], nDiv = clamp(Math.round(men / 7000), 1, 6);
    let bn = 0, total = 0;
    for (let d = 0; d < nDiv; d++) {
      const regiments = [], nReg = rngA.int(2, 4);
      for (let r = 0; r < nReg; r++) {
        const battalions = [], nBat = rngA.int(2, 4);
        for (let b = 0; b < nBat; b++) {
          const w = tpl.reduce((a, t) => a + t.w, 0);
          let rr = rngA.f() * w, u = tpl[0].unit; for (const t of tpl) { rr -= t.w; if (rr <= 0) { u = t.unit; break; } }
          const U = unitById[u], nCo = U.role === "siege" ? rngA.int(2, 4) : rngA.int(4, 7);
          const companies = []; let bm = 0;
          for (let c = 0; c < nCo; c++) { const m = Math.max(1, Math.round(U.size * rngA.range(0.7, 1))); companies.push(m); bm += m; }
          battalions.push({ n: `${ORD(b + 1)} Battalion`, unit: u, men: bm, companies });
          bn++; total += bm;
        }
        regiments.push({ n: `${ORD(d * 4 + r + 1)} Regiment`, title: `${rngA.pick(REGT_ADJ)} ${rngA.pick(REGT)}`, battalions });
      }
      divisions.push({ n: `${ORD(d + 1)} Division`, regiments });
    }
    layoutArmy(divisions, unitById);
    armySeq++;
    return { id: armies.length, actor, realm, name, general, men: total, divisions };
  };
  const place = (px, py, backX, backY) => {
    // step back towards the army's own side until it stands on land
    for (let t = 0; t < 12; t++) {
      const c = findCell(M, ((px % W) + W) % W, py);
      if (c >= 0 && T.type[c] === 0) return [px, py];
      px += (backX - px) * 0.2; py += (backY - py) * 0.2;
    }
    return [backX, backY];
  };
  // which road runs through each cell, so armies off the battle line can march along one
  const roadAt = new Map();
  X.roads.forEach((rd, i) => { for (const c of rd.cells) if (!roadAt.has(c)) roadAt.set(c, i); });
  const nearRoad = (px, py) => {
    const c = findCell(M, ((px % W) + W) % W, py); if (c < 0) return -1;
    if (roadAt.has(c)) return roadAt.get(c);
    for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) if (roadAt.has(M.nbr[k])) return roadAt.get(M.nbr[k]);
    return -1;
  };
  // a stretch of road around a point, long enough for a column of this many men
  const roadStretch = (ri, px, py, men) => {
    const pts = roadLine(G, X.roads[ri]), n = pts.length / 2;
    let bi = 0, bd = Infinity; for (let i = 0; i < n; i++) { const d = (pts[2 * i] - px) ** 2 + (pts[2 * i + 1] - py) ** 2; if (d < bd) { bd = d; bi = i; } }
    const colM = men / 5 * 1.6, span = Math.ceil(colM * 1.6 / 250) + 6;
    const a = Math.max(0, bi - span), b = Math.min(n - 1, bi + span);
    return b - a >= 3 ? pts.slice(2 * a, 2 * b + 2) : null;
  };
  const sieged = new Set();
  for (const war of wars) {
    const wf = fronts.filter(f => f.war === war.id);
    if (!wf.length) continue;
    const sides = [war.attackers, war.defenders];
    // spread the field armies along the front
    const nA = clamp(Math.round(wf.length / 3) + 1, 1, 8), chosen = [wf[rng.int(0, wf.length - 1)]];
    while (chosen.length < Math.min(nA, wf.length)) {
      let best = null, bd = -1;
      for (const f of wf) { if (chosen.includes(f)) continue; let md = Infinity; for (const c of chosen) md = Math.min(md, wrapDx(f.mx - c.mx) ** 2 + (f.my - c.my) ** 2); if (md > bd) { bd = md; best = f; } }
      if (!best) break; chosen.push(best);
    }
    const perSide = sides.map(side => side.reduce((a, s) => a + (actors[s].rebel ? manpower[actors[s].of] * 0.4 : manpower[s]), 0));
    let dirIdx = 0;
    for (const f of chosen) {
      const battle = rng.chance(0.45);
      for (let si = 0; si < 2; si++) {
        // which province of this pair belongs to this side
        const mine = sideOf(war, control[f.a]) === (si === 0 ? 1 : -1) ? f.a : f.b, theirs = mine === f.a ? f.b : f.a;
        const actor = control[mine], realm = actors[actor].rebel ? actors[actor].of : actor;
        if (realm < 0) continue;
        let dx = provs[theirs].cx - provs[mine].cx, dy = provs[theirs].cy - provs[mine].cy;
        if (Math.abs(dx) > W / 2) dx -= Math.sign(dx) * W;
        const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
        const gap = battle ? rng.range(110, 220) : rng.range(1800, 5000);
        const [ax, ay] = place(f.mx - dx * wOfM(gap / 2 + 60), f.my - dy * wOfM(gap / 2 + 60), provs[mine].cx, provs[mine].cy);
        const men = clamp(Math.round(perSide[si] / chosen.length * rng.range(0.5, 1.3)), 2500, 60000);
        const cu = Y.cultures[Y.cultureOf[mine]];
        const name = rng.pick(ARMY_NAMES).replace("$", actors[actor].rebel ? actors[actor].short : rng.chance(0.5) ? ARMY_DIRS[(dirIdx++) % ARMY_DIRS.length] : provs[mine].name);
        const general = `${rng.pick(["General", "Marshal", "Lord", "Lady", "Captain-General", "Warlord"])} ${cu.lang.word(nameRng, null)}`;
        const army = buildArmy(actor, realm, men, name, general);
        Object.assign(army, { war: war.id, x: ax, y: ay, ang: Math.atan2(dy, dx), battle, front: fronts.indexOf(f), side: si === 0 ? 1 : -1, mode: battle ? "line" : "camp" });
        // off the battle line an army besieges a town across the front, marches along a road, or camps
        if (!battle) {
          const town = st[X.mainOf[theirs]];
          if (town && town.tier >= 1 && !sieged.has(theirs) && rng.chance(0.4)) {
            sieged.add(theirs);
            Object.assign(army, { mode: "siege", x: town.x, y: town.y, siege: { name: town.name, prov: theirs, r: urbanRadiusKm(town.pop) * 1000 + 260 } });
          } else if (rng.chance(0.55)) {
            const ri = nearRoad(ax, ay), path = ri >= 0 ? roadStretch(ri, ax, ay, army.men) : null;
            if (path) Object.assign(army, { mode: "march", path, phase: rng.f(), kmh: rng.range(2, 3.5) });
          }
        }
        armies.push(army);
      }
    }
  }
  // realms at peace keep a garrison army at the capital
  for (const s of S.states) {
    if (atWar.has(s.id) || s.provs.length < 4) continue;
    const c = provs[s.capital], sm = st[X.mainOf[s.capital]], a = rng.range(0, Math.PI * 2), off = wOfM(sm ? 900 + Math.sqrt(sm.pop) * 4 : 1200);
    const [ax, ay] = place(sm.x + Math.cos(a) * off, sm.y + Math.sin(a) * off, c.cx, c.cy);
    const army = buildArmy(s.id, s.id, clamp(Math.round(manpower[s.id] * 0.25), 800, 20000), `${S.states[s.id].short} Guard`, `Lord Commander ${Y.cultures[Y.cultureOf[s.capital]].lang.word(nameRng, null)}`);
    Object.assign(army, { war: -1, x: ax, y: ay, ang: rng.range(0, Math.PI * 2), battle: false, front: -1, side: 0, garrison: true, mode: "barracks" });
    armies.push(army);
  }

  const fleets = [];
  const seaNear = (sx, sy, cell) => {
    // nearest open-water cell next to a port town, stepped a little offshore
    let best = -1, bd = Infinity;
    for (let k = M.nStart[cell]; k < M.nStart[cell + 1]; k++) { const n = M.nbr[k]; if (T.type[n] !== 1) continue; const d = (M.x[n] - sx) ** 2 + (M.y[n] - sy) ** 2; if (d < bd) { bd = d; best = n; } }
    if (best < 0) return null;
    let b2 = best, bc = T.coastDist[best];
    for (let k = M.nStart[best]; k < M.nStart[best + 1]; k++) { const n = M.nbr[k]; if (T.type[n] === 1 && T.coastDist[n] > bc) { bc = T.coastDist[n]; b2 = n; } }
    return [M.x[b2], M.y[b2], Math.atan2(M.y[b2] - sy, M.x[b2] - sx)];
  };
  for (const s of S.states) {
    const myPorts = s.provs.map(p => st[X.mainOf[p]]).filter(t => t.port).sort((a, b) => b.pop - a.pop);
    if (!myPorts.length) continue;
    const ctx = tags[s.id], naval = (ctx.has("navy") ? 2.5 : 1) * (ctx.has("seafaring") ? 1.8 : 1);
    const nShips = clamp(Math.round(Math.sqrt(myPorts.length) * 3 * naval * rng.range(0.6, 1.3)), 2, 60);
    const types = pickSome(rng, SHIPS.filter(x => x.role === "war"), new Set([...ctx, "style:" + styleFor(G, myPorts[0])]), 2);
    if (!types.length) continue;
    const warHere = wars.find(w => sideOf(w, s.id));
    const nFleets = clamp(Math.round(nShips / 12), 1, 4);
    for (let f = 0; f < nFleets; f++) {
      let home = myPorts[f % myPorts.length], mission = "In harbour", target = home;
      if (warHere) {
        const enemies = (sideOf(warHere, s.id) === 1 ? warHere.defenders : warHere.attackers).filter(a => !actors[a].rebel);
        const ePorts = enemies.flatMap(e => S.states[e].provs.map(p => st[X.mainOf[p]]).filter(t => t.port));
        if (ePorts.length && rng.chance(0.7)) {
          ePorts.sort((a, b) => (wrapDx(a.x - home.x) ** 2 + (a.y - home.y) ** 2) - (wrapDx(b.x - home.x) ** 2 + (b.y - home.y) ** 2));
          target = ePorts[0]; mission = `Blockading ${target.name}`;
        } else mission = "Patrolling home waters";
      } else if (rng.chance(0.5)) mission = "Patrolling home waters";
      const at = seaNear(target.x, target.y, target.cell); if (!at) continue;
      const ships = [], n = Math.max(1, Math.round(nShips / nFleets));
      for (let i = 0; i < n; i++) {
        const ty = types[i % types.length] || types[0];
        ships.push({ type: ty.id, name: shipName(nameRng, Y.cultures[Y.cultureOf[home.prov]].lang) });
      }
      fleets.push({
        id: fleets.length, actor: s.id, realm: s.id, name: `${ORD(f + 1)} ${rng.pick(["Fleet", "Squadron", "Flotilla"])} of ${s.short}`,
        admiral: `Admiral ${Y.cultures[Y.cultureOf[home.prov]].lang.word(nameRng, null)}`, x: at[0], y: at[1], ang: at[2] + Math.PI / 2 + rng.range(-0.4, 0.4),
        mission, war: warHere ? warHere.id : -1, home: home.prov, ships,
      });
    }
  }

  Z.armies = armies; Z.fleets = fleets;
}

export function shipName(rng, lang) {
  const r = rng.f();
  if (r < 0.35) return `${rng.pick(SHIP_NAME_ADJ)} ${rng.pick(SHIP_NAME_WORDS)}`;
  if (r < 0.6) return `${lang.word(rng, null)}'s ${rng.pick(SHIP_NAME_WORDS)}`;
  if (r < 0.8) return `The ${rng.pick(SHIP_NAME_WORDS)} of ${lang.word(rng, null)}`;
  return lang.word(rng, null);
}

// Formation, in metres, in the army's own frame: +x along the line (to the right), +y towards the
// enemy. Each division puts ranged troops in front, infantry in the main line, mages behind,
// cavalry on the flanks and siege engines at the rear; divisions stand side by side.
function layoutArmy(divisions, unitById) {
  const gapDiv = 70;
  const dims = b => {
    const U = unitById[b.unit], files = Math.ceil(b.men / U.ranks), gx = U.gap, gy = U.mounted ? U.gap * 1.3 : U.gap;
    return { w: files * gx, d: U.ranks * gy };
  };
  const widths = [];
  for (const div of divisions) {
    const rows = { ranged: [], infantry: [], magic: [], flank: [], siege: [] };
    for (const reg of div.regiments) for (const b of reg.battalions) {
      const role = unitById[b.unit].role;
      (role === "cavalry" || role === "beast" ? rows.flank : rows[role] || rows.infantry).push(b);
    }
    const rowY = { ranged: 38, infantry: 0, magic: -30, siege: -140 };
    let maxW = 0;
    for (const [r, list] of Object.entries(rows)) {
      if (r === "flank") continue;
      let w = 0; for (const b of list) { Object.assign(b, dims(b)); w += b.w + 8; }
      let x = -w / 2;
      for (const b of list) { b.fx = x + b.w / 2; b.fy = rowY[r] + (r === "infantry" ? -b.d / 2 : r === "ranged" ? b.d / 2 : -b.d / 2); x += b.w + 8; }
      maxW = Math.max(maxW, w);
    }
    let lx = -maxW / 2 - 20, rx = maxW / 2 + 20;
    rows.flank.forEach((b, i) => {
      Object.assign(b, dims(b));
      if (i % 2 === 0) { b.fx = rx + b.w / 2; rx += b.w + 12; } else { b.fx = lx - b.w / 2; lx -= b.w + 12; }
      b.fy = -8 - b.d / 2;
    });
    div.w = rx - lx; div.cx0 = (rx + lx) / 2;
    widths.push(div.w);
  }
  const total = widths.reduce((a, b) => a + b, 0) + gapDiv * (divisions.length - 1);
  let x = -total / 2;
  divisions.forEach((div, i) => {
    const shift = x + widths[i] / 2 - div.cx0;
    for (const reg of div.regiments) for (const b of reg.battalions) b.fx += shift;
    div.fx = x + widths[i] / 2; x += widths[i] + gapDiv;
  });
}
