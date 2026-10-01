import { W } from "../core/tables.js";
import { makeRng } from "../core/util.js";
import { FAUNA } from "../content/ecology.js";
import { MARINE_FAUNA, LOOK, SEA_MONSTERS } from "../content/wildlife.js";
import { LOOKUP } from "../content/lookup.js";
import { BIOMES } from "../core/tables.js";

// Animals on the map. Each ecological zone (land and sea) keeps a few groups of its visible
// species: herds, packs and flocks on land, pods, shoals and serpents at sea. A group wanders
// around a home point as a function of time; grazing herds of the open plains also shift between
// summer and winter grounds with the seasons. Groups are only worked out for zones on screen.
// Far out they are coloured dots; close in each animal is drawn by its body type.

const FA = LOOKUP.fauna, LK = LOOKUP.look; void FAUNA; void MARINE_FAUNA; void LOOK;
const MON = Object.fromEntries(SEA_MONSTERS.map(m => [m.id, m]));
const MIGRANT = new Set(["grass", "savanna", "tundra", "coldsteppe"]);
const hash = (a, b = 0, c = 0) => { let h = (a * 374761393 + b * 668265263 + c * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

export function makeWildlife(app) {
  let G = null, mPerW = 1, zones = [];

  function reset(world) {
    G = world; mPerW = 1000 * G.worldKm / W; zones = [];
    if (!G.E) return;
    const { R, M, E } = G, kmPx = G.worldKm / W;
    // land zones: their provinces and bounds
    const provsOf = E.zones.map(() => []);
    for (let p = 0; p < R.provs.length; p++) if (E.zoneOf[p] >= 0) provsOf[E.zoneOf[p]].push(p);
    E.zones.forEach((z, zi) => {
      const ps = provsOf[zi]; if (!ps.length) return;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of ps) { const q = R.provs[p]; x0 = Math.min(x0, q.cx); x1 = Math.max(x1, q.cx); y0 = Math.min(y0, q.cy); y1 = Math.max(y1, q.cy); }
      const pad = M.s * 2;
      zones.push({ land: true, z, zi, bbox: [x0 - pad, y0 - pad, x1 + pad, y1 + pad], anchors: ps.map(p => [R.provs[p].cx, R.provs[p].cy]), groups: null, migrant: MIGRANT.has(BIOMES[z.biome].k) });
    });
    // sea zones: a sample of their cells as home points
    const cellsOf = E.marine.zones.map(() => []);
    const zc = E.marine.zoneOfCell;
    for (let i = 0; i < zc.length; i++) if (zc[i] >= 0 && cellsOf[zc[i]].length < 60 && hash(i, 7) < 0.3) cellsOf[zc[i]].push(i);
    E.marine.zones.forEach((z, zi) => {
      const cs = cellsOf[zi]; if (!cs.length) return;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const c of cs) { x0 = Math.min(x0, M.x[c]); x1 = Math.max(x1, M.x[c]); y0 = Math.min(y0, M.y[c]); y1 = Math.max(y1, M.y[c]); }
      const pad = M.s * 3;
      zones.push({ land: false, z, zi, bbox: [x0 - pad, y0 - pad, x1 + pad, y1 + pad], anchors: cs.map(c => [M.x[c], M.y[c]]), groups: null });
    });
    void kmPx;
  }

  // the groups of one zone, made the first time it comes into view
  function groupsOf(Z) {
    if (Z.groups) return Z.groups;
    const rng = makeRng(G.seed + "|wild|" + (Z.land ? "l" : "m") + Z.zi), out = [];
    const species = Z.z.fauna.map(id => ({ id, f: FA[id], look: LK[id] })).filter(e => e.f && e.look && e.look.visible);
    // favour the big and the social: they are what you would see from a hill
    species.sort((a, b) => (b.look.size * (b.look.group[1] > 1 ? 2 : 1)) - (a.look.size * (a.look.group[1] > 1 ? 2 : 1)));
    const pickN = Math.min(species.length, Z.land ? 4 : 3);
    const area = Z.z.area || 1000;
    for (const e of species.slice(0, pickN)) {
      const n = Math.max(1, Math.min(10, Math.round(area / 6000 * (e.look.move === "flock" ? 1.5 : 1))));
      for (let k = 0; k < n; k++) out.push(makeGroup(e.id, e.f, e.look, Z, rng));
    }
    if (!Z.land && Z.z.monster) { const m = MON[Z.z.monster.id]; if (m) out.push(makeGroup(m.id, { ...m, kind: "monster" }, { size: m.size, group: [1, 1], move: "solo", speed: 6, col: m.col, col2: m.col2, body: m.body === "squid" || m.body === "crab" || m.body === "turtle" ? m.body : m.body, active: "any", visible: true }, Z, rng)); }
    Z.groups = out;
    return out;
  }
  function makeGroup(id, f, look, Z, rng) {
    const a = Z.anchors[Math.floor(rng.f() * Z.anchors.length)], b = Z.anchors[Math.floor(rng.f() * Z.anchors.length)];
    const size = Math.max(1, Math.round(look.group[0] + rng.f() * (look.group[1] - look.group[0])));
    const rangeKm = look.move === "flock" ? 25 : look.move === "school" ? 4 : look.body === "whale" ? 30 : look.move === "herd" ? 10 : 6;
    return { id, f, look, zone: Z, home: a, away: b, size, r: rangeKm * 1000 / mPerW, ph: [rng.f() * 6.28, rng.f() * 6.28, rng.f() * 6.28], w: [0.7 + rng.f() * 0.6, 1.3 + rng.f(), 0.4 + rng.f() * 0.3], seed: Math.floor(rng.f() * 1e6) };
  }
  // where a group is now: wandering around home, and for migrants, between summer and winter grounds
  function groupPos(gr, tMin) {
    const cal = G.Y.calendar, doy = ((cal.startDay + tMin / 1440) % cal.yearDays + cal.yearDays) % cal.yearDays;
    let hx = gr.home[0], hy = gr.home[1];
    if (gr.zone.migrant && gr.look.move === "herd") { const s = 0.5 - 0.5 * Math.cos(doy / cal.yearDays * Math.PI * 2); hx += (gr.away[0] - hx) * s; hy += (gr.away[1] - hy) * s; }
    // speed sets how fast it wanders its range (a day's slow graze to a bird's quick loop)
    const t = tMin / 60 * Math.max(0.3, gr.look.speed) / (gr.r * mPerW / 1000) * 0.15;
    const x = hx + gr.r * (Math.sin(t * gr.w[0] + gr.ph[0]) * 0.7 + Math.sin(t * gr.w[1] + gr.ph[1]) * 0.3);
    const y = hy + gr.r * (Math.cos(t * gr.w[0] * 0.9 + gr.ph[2]) * 0.7 + Math.cos(t * gr.w[2] + gr.ph[1]) * 0.3);
    const dx = gr.r * (gr.w[0] * Math.cos(t * gr.w[0] + gr.ph[0]) * 0.7), dy = -gr.r * (gr.w[0] * 0.9 * Math.sin(t * gr.w[0] * 0.9 + gr.ph[2]) * 0.7);
    return [x, y, Math.atan2(dy, dx)];
  }
  function visible(v, fn) {
    const x0 = -v.ox / v.k, y0 = -v.oy / v.k, x1 = (app.cw - v.ox) / v.k, y1 = (app.ch - v.oy) / v.k;
    for (const Z of zones) { const b = Z.bbox; if (b[2] < x0 || b[0] > x1 || b[3] < y0 || b[1] > y1) continue; fn(Z); }
  }

  /* ---------- drawing ---------- */
  function drawOne(ctx, x, y, look, p, h, anim, i) {
    const L = Math.max(look.size * p, 1.5), c = look.col, c2 = look.col2 || look.col;
    if (L < 3) { ctx.fillStyle = c; ctx.fillRect(x - 1, y - 1, 2, 2); return; }
    const face = Math.cos(h) >= 0 ? 1 : -1;
    switch (look.body) {
      case "bird": {
        const flap = Math.sin(anim * 9 + i) * 0.5, s = Math.max(2, L * 0.6);
        ctx.strokeStyle = c; ctx.lineWidth = Math.max(1, L * 0.12); ctx.beginPath(); ctx.moveTo(x - s, y - s * flap); ctx.lineTo(x, y); ctx.lineTo(x + s, y - s * flap); ctx.stroke(); break;
      }
      case "fish": {
        ctx.save(); ctx.translate(x, y); ctx.rotate(h); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, L / 2, L / 6, 0, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.lineTo(-L * 0.75, -L / 6); ctx.lineTo(-L * 0.75, L / 6); ctx.closePath(); ctx.fill(); ctx.restore(); break;
      }
      case "whale": {
        ctx.save(); ctx.translate(x, y); ctx.rotate(h); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, 0, L / 2, L / 7, 0, 0, 7); ctx.fill();
        ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.lineTo(-L * 0.68, -L / 7); ctx.lineTo(-L * 0.6, 0); ctx.lineTo(-L * 0.68, L / 7); ctx.closePath(); ctx.fill(); ctx.restore();
        // blowing now and then
        if (((anim * 0.3 + i * 0.37) % 1) < 0.12) { ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(x + Math.cos(h) * L * 0.3, y + Math.sin(h) * L * 0.3 - L * 0.12, Math.max(1.5, L * 0.07), 0, 7); ctx.fill(); }
        break;
      }
      case "serpent": {
        // coils breaking the surface
        ctx.strokeStyle = c; ctx.lineWidth = Math.max(2, L * 0.05); ctx.lineCap = "round";
        for (let k = 0; k < 4; k++) { const u = (k - 1.5) * L * 0.22, ox = x + Math.cos(h) * u, oy = y + Math.sin(h) * u, rise = Math.sin(anim * 1.5 + k) * 0.3 + 0.7; ctx.beginPath(); ctx.arc(ox, oy, L * 0.08, Math.PI, 0); ctx.stroke(); void rise; }
        ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(x + Math.cos(h) * L * 0.45, y + Math.sin(h) * L * 0.45 - L * 0.05, L * 0.06, 0, 7); ctx.fill(); break;
      }
      case "squid": case "crab": case "turtle": {
        ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, L * 0.3, L * 0.22, h, 0, 7); ctx.fill();
        ctx.strokeStyle = c2; ctx.lineWidth = Math.max(1, L * 0.03);
        for (let k = 0; k < 6; k++) { const a = h + Math.PI + (k - 2.5) * 0.35, w = Math.sin(anim * 2 + k) * 0.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a + w) * L * 0.4, y + Math.sin(a + w) * L * 0.4, x + Math.cos(a) * L * 0.6, y + Math.sin(a) * L * 0.6); ctx.stroke(); }
        break;
      }
      case "insect": case "spider": {
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, Math.max(1, L * 0.3), 0, 7); ctx.fill(); break;
      }
      default: {
        // four-legged (and anything else that walks): side-on body, head, legs, markings
        const bw = L, bh = L * (look.body === "reptile" || look.body === "serpent" ? 0.25 : 0.42), step = Math.sin(anim * 5 + i) * bh * 0.25;
        if (look.body === "biped") { ctx.fillStyle = c; ctx.fillRect(x - bw * 0.15, y - bh * 2, bw * 0.3, bh * 1.6); ctx.fillStyle = c2; ctx.fillRect(x - bw * 0.1, y - bh * 2.4, bw * 0.2, bw * 0.2); break; }
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(x - bw / 2, y - 1, bw, 2);
        ctx.fillStyle = c; ctx.fillRect(x - bw / 2, y - bh * 1.6, bw, bh);
        ctx.fillStyle = c2; ctx.fillRect(x - bw / 2 + bw * 0.2, y - bh * 1.6, bw * 0.3, bh * 0.35);
        ctx.fillStyle = c; ctx.fillRect(face > 0 ? x + bw / 2 - bw * 0.05 : x - bw / 2 - bw * 0.2, y - bh * 2.1, bw * 0.25, bh * 0.7); // head
        if (look.body !== "reptile") { ctx.fillStyle = c2; for (const [lx, s] of [[-0.4, 1], [-0.25, -1], [0.25, 1], [0.4, -1]]) ctx.fillRect(x + bw * lx, y - bh * 0.6, Math.max(1, bw * 0.07), bh * 0.6 + s * step); }
      }
    }
  }
  function draw(ctx, dpr, v) {
    if (!G || !G.E || !app.ui.layers.animals) return;
    const p = v.k / mPerW, pkm = p * 1000; if (pkm < 2.5) return;
    const tMin = app.clock.t, anim = app.clock.anim;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    visible(v, Z => {
      for (const gr of groupsOf(Z)) {
        const [x, y, h] = groupPos(gr, tMin), px = x * v.k + v.ox, py = y * v.k + v.oy;
        if (px < -60 || py < -60 || px > app.cw + 60 || py > app.ch + 60) continue;
        const L = gr.look.size * p;
        if (L < 1.5) {
          // far out: a little cluster of dots in the species' colour
          const n = Math.min(6, gr.size); ctx.fillStyle = gr.look.col;
          for (let k = 0; k < n; k++) ctx.fillRect(px + (hash(gr.seed, k) - 0.5) * 8, py + (hash(gr.seed, k, 1) - 0.5) * 6, 2, 2);
          continue;
        }
        // close in: every animal, arranged as its kind moves together
        const n = Math.min(gr.look.move === "school" ? 30 : 40, gr.size), spread = Math.max(gr.look.size * 1.6, 2) * p;
        for (let k = 0; k < n; k++) {
          let ox, oy;
          if (gr.look.move === "flock") { const row = Math.floor((k + 1) / 2), side = k % 2 ? 1 : -1; ox = -Math.cos(h) * row * spread + -Math.sin(h) * side * row * spread * 0.6; oy = -Math.sin(h) * row * spread + Math.cos(h) * side * row * spread * 0.6; }
          else if (gr.look.move === "pod" || gr.look.move === "pair") { ox = -Math.cos(h) * k * spread * 1.4 + (hash(gr.seed, k) - 0.5) * spread; oy = -Math.sin(h) * k * spread * 1.4 + (hash(gr.seed, k, 2) - 0.5) * spread; }
          else { const r = Math.sqrt(n) * spread * 0.7; ox = (hash(gr.seed, k) - 0.5) * 2 * r + Math.sin(anim * 0.4 + k) * spread * 0.2; oy = (hash(gr.seed, k, 3) - 0.5) * 2 * r * 0.7; }
          drawOne(ctx, px + ox, py + oy, gr.look, p, h, anim, k);
        }
      }
    });
  }
  function pick(wx, wy, v) {
    if (!G || !G.E || !app.ui.layers.animals) return null;
    const p = v.k / mPerW; if (p * 1000 < 2.5) return null;
    const tMin = app.clock.t, tol = Math.max(10 / v.k, 0); let best = null, bd = Infinity;
    visible(v, Z => { for (const gr of groupsOf(Z)) { const [x, y] = groupPos(gr, tMin); let dx = wx - x; if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W; const d = Math.hypot(dx, wy - y), r = Math.max(tol, Math.sqrt(gr.size) * gr.look.size * 1.6 / mPerW); if (d < r && d < bd) { bd = d; best = gr; } } });
    return best ? { kind: "animal", gr: best } : null;
  }
  return { reset, draw, pick, invalidate: () => { for (const Z of zones) Z.groups = null; } };
}
