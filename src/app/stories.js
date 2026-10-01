import { makeRng } from "../core/util.js";
import { test, weight } from "../core/rules.js";
import { fill } from "../core/text.js";
import { BIG, MEDIUM, SMALL } from "../content/stories.js";
import { provinceTags } from "../gen/society.js";

// Stories at three scales, tied to real places and to each other:
//   big     world arcs (a spreading shroud, waking titans...), chosen by what exists in this world
//           and anchored to matching sites, realms and faiths
//   medium  realm, war, faith and trade arcs; ones that can feed a chosen big story are preferred
//           and link to it
//   small   rumours and hooks in single provinces; they link up to the medium and big stories
//           they belong to
// Content lives in content/stories.js; this only decides which ones happen where.

const cache = new WeakMap();
const wdx = dx => { dx = Math.abs(dx); return Math.min(dx, 1600 - dx); };

export function storiesFor(G) {
  let s = cache.get(G); if (s) return s;
  const rng = makeRng(G.seed + "|stories");
  const { R, S, F, Y, Z, Q, X } = G, provs = R.provs, np = provs.length;
  const siteTypes = new Set(F.sites.map(x => x.type));
  const world = new Set();
  if (F.titans.length) world.add("has:titans");
  // the world's premises; ley lines and rifts only exist where no premise replaces them
  const wt = G.W ? G.W.tags : ["default:power", "default:cosmos"];
  for (const t of wt) world.add(t);
  if (siteTypes.has("Planar Rift")) { world.add("has:breach"); if (world.has("default:cosmos")) world.add("has:rifts"); }
  if (siteTypes.has("Ley Nexus")) { world.add("has:node"); if (world.has("default:power")) world.add("has:ley"); }
  if (siteTypes.has("Ancient Ruins")) world.add("has:ruins");
  if (F.volcanoes.length) world.add("has:volcanoes");
  if (Z.wars.length) world.add("has:wars");
  if (G.P.magic >= 60) world.add("magic:high"); else if (G.P.magic <= 25) world.add("magic:low");
  if (G.P.wildlife >= 60) world.add("wild:high");
  world.add("has:fallen_empire");
  if (Y.faiths.some(f => f.type === "void")) world.add("has:void_faith");
  if (Y.faiths.some(f => f.type === "titan")) world.add("has:titan_faith");
  if (R.masses.filter(m => !m.continent && m.name).length > 12) world.add("many_islands");

  const realmTags = S.states.map((st, i) => { const t = new Set(Y.realms[i].tags); const w = Z.wars.some(w => [...w.attackers, ...w.defenders].includes(i)); t.add(w ? "atwar" : "peace"); return t; });
  const ptagCache = new Map();
  const ptags = p => {
    let t = ptagCache.get(p); if (t) return t;
    t = provinceTags(G, p);
    // the world's own tags (premises, magic level) so rumours can be gated on them too
    for (const w of world) if (/^(premise|slot|default|tone|genre|access|magic|wild|truth):/.test(w)) t.add(w);
    if (S.own[p] >= 0) for (const r of Y.realms[S.own[p]].tags) if (r.startsWith("theme:")) t.add(r);
    if (Z.control[p] !== S.own[p] && Z.control[p] >= 0) t.add("occupied");
    if (Z.warOf[p] >= 0) { t.add("atwar"); t.add("frontline"); }
    ptagCache.set(p, t); return t;
  };
  const townOf = p => X.settlements[X.mainOf[p]].name;
  const siteNear = p => { if (F.mystery[p] >= 0) return F.sites[F.mystery[p]].name; for (const q of provs[p].adj) if (F.mystery[q] >= 0) return F.sites[F.mystery[q]].name; return null; };
  const titanNear = p => { let best = null, bd = Infinity; for (const t of F.titans) for (const q of t.provs) { const d = wdx(provs[q].cx - provs[p].cx) ** 2 + (provs[q].cy - provs[p].cy) ** 2; if (d < bd) { bd = d; best = t; } } return best ? best.name.split(",")[0] : null; };
  const beastNear = p => { if (F.hostile[p] >= 0) return F.hostRegions[F.hostile[p]].creature; for (const q of provs[p].adj) if (F.hostile[q] >= 0) return F.hostRegions[F.hostile[q]].creature; return null; };
  const warOfRealm = rid => Z.wars.find(w => [...w.attackers, ...w.defenders].some(a => a === rid || Z.actors[a].of === rid));
  const personName = (r2, p) => { const t = townOf(p); return `${r2.pick(["old", "young", "widow", "brother", "sister", "captain", "the miller", "the smith", "the ferryman", "the herbwife", "the tax-collector"])} ${t.slice(0, Math.min(t.length, r2.int(3, 5)))}${r2.pick(["a", "en", "o", "is", "ric", "wen", "ta", "an"])}`; };
  const slotsFor = (p, rid, r2) => {
    const owner = rid ?? S.own[p], st = owner >= 0 ? S.states[owner] : null, war = owner >= 0 ? warOfRealm(owner) : null;
    const fa = Y.faiths[Y.faithOf[p]], rival = owner >= 0 ? Y.relations.filter(x => (x.a === owner || x.b === owner) && x.op < -10).sort((a, b) => a.op - b.op)[0] : null;
    return {
      place: townOf(p), site: siteNear(p), good: Q.goods[p].length ? GOODS_N(Q.goods[p][0]) : null, beast: beastNear(p), faith: fa.name, realm: st ? st.name : null,
      short: st ? st.short : null, ruler: owner >= 0 ? Y.realms[owner].ruler : null, capital: st ? townOf(st.capital) : null, people: Y.cultures[Y.cultureOf[p]].adj,
      rival: rival ? S.states[rival.a === owner ? rival.b : rival.a].name : null, war: war ? war.name : null, titan: titanNear(p), person: personName(r2, p),
      river: provs[p].rivers.length ? R.rivers[provs[p].rivers[0]].name : null,
    };
  };

  /* ---- big ---- */
  const big = [];
  // a world story on a slot a premise fills is dropped, unless that premise absorbs it (it becomes
  // the premise's visible arc); on a soft slot it survives only as early rumour. One apocalypse at most.
  const active = G.W ? G.W.picks.map(p => p.id) : [];
  const absorbed = b => (b.absorbedBy || []).some(id => active.includes(id));
  const bigCand = BIG.filter(b => (!b.req || test(b.req, world)) && (absorbed(b) || !(b.slots || []).some(s => world.has("slot:" + s) && !(b.soft || []).includes(s))));
  const nBig = Math.min(bigCand.length, 2 + (rng.chance(0.5) ? 1 : 0) + (G.P.magic > 60 ? 1 : 0));
  const pool = bigCand.slice();
  while (big.length < nBig && pool.length) {
    const b = pool.splice(rng.int(0, pool.length - 1), 1)[0];
    if ((b.slots || []).includes("apocalypse") && big.some(x => (BIG.find(y => y.id === x.id).slots || []).includes("apocalypse"))) continue;
    // anchors: matching mystery sites, or realms whose tags match its factions
    const L = b.links || {}, anchors = [];
    for (const site of F.sites) if ((L.sites || []).includes(site.type)) anchors.push(site.prov);
    const realms = S.states.map((_, i) => i).filter(i => (L.factions || []).some(f => realmTags[i].has(f)) || (L.tags || []).some(t => realmTags[i].has(t)));
    for (const i of realms.slice(0, 3)) anchors.push(S.states[i].capital);
    if (!anchors.length) anchors.push(rng.int(0, np - 1));
    const clamp0 = !absorbed(b) && (b.soft || []).some(s => world.has("slot:" + s));
    const stage = clamp0 ? 0 : rng.int(0, Math.max(0, (b.stages || []).length - 1));
    const r2 = makeRng(G.seed + "|big|" + b.id);
    const signs = anchors.slice(0, 4).map(p => ({ p, text: fill(r2.pick(b.signs || ["Strange things are seen near {place}."]), slotsFor(p, null, r2)) })).filter(x => x.text);
    big.push({ scale: "big", id: b.id, title: fill(b.n, {}) || b.n, text: fill(b.d, {}) || b.d, stage, stages: (b.stages || []).map(x => fill(x, {}) || x), signs, anchors, realms, place: anchors[0], links: [] });
  }
  const bigIds = new Set(big.map(b => b.id));

  /* ---- medium ---- */
  const medium = [];
  const subjects = [];
  S.states.forEach((st, i) => subjects.push({ scope: "realm", rid: i, p: st.capital, tags: realmTags[i] }));
  for (const w of Z.wars) { const lead = w.defenders[0], front = Z.fronts.find(f => f.war === w.id); subjects.push({ scope: "war", rid: Z.actors[lead].rebel ? Z.actors[lead].of : lead, p: front ? front.a : S.states[Z.actors[lead].rebel ? Z.actors[lead].of : lead].capital, war: w, tags: realmTags[Z.actors[lead].rebel ? Z.actors[lead].of : lead] }); }
  for (const f of Y.faiths) subjects.push({ scope: "faith", rid: S.own[f.holy.prov], p: f.holy.prov, faith: f, tags: new Set([`faith:${f.type}`, ...f.doctrines]) });
  for (const n of Q.named) subjects.push({ scope: "trade", rid: S.own[n.a], p: n.a, route: n, tags: realmTags[S.own[n.a]] || new Set() });
  for (let k = 0; k < Math.min(12, np); k++) { const p = rng.int(0, np - 1); subjects.push({ scope: "region", rid: S.own[p], p, tags: ptags(p) }); }
  const nMed = Math.round(S.states.length * 0.35 + Z.wars.length + 3);
  const used = new Set();
  for (let t = 0; t < nMed * 6 && medium.length < nMed; t++) {
    const sub = subjects[rng.int(0, subjects.length - 1)];
    const opts = MEDIUM.filter(m => m.scope === sub.scope && !used.has(m.id + ":" + sub.p) && (!m.req || test(m.req, sub.tags)));
    if (!opts.length) continue;
    const m = opts[Math.floor(rng.f() * opts.length)];
    const pref = (m.links || []).some(l => bigIds.has(l));
    if (!pref && rng.chance(0.35)) continue; // stories that feed a world arc are more likely
    used.add(m.id + ":" + sub.p);
    const r2 = makeRng(G.seed + "|med|" + m.id + "|" + sub.p), slots = slotsFor(sub.p, sub.rid, r2);
    if (sub.war) slots.war = sub.war.name;
    if (sub.faith) slots.faith = sub.faith.name;
    if (sub.route) slots.good = GOODS_N(Q.goods[sub.route.a][0]);
    const title = fill(m.n, slots), text = fill(m.d, slots); if (!title || !text) continue;
    const links = (m.links || []).filter(l => bigIds.has(l));
    const item = { scale: "medium", id: m.id + ":" + sub.p, title, text, place: sub.p, realm: sub.rid, links, hooks: (m.hooks || []).map(h => fill(h, slots)).filter(Boolean).slice(0, 3) };
    medium.push(item);
    for (const l of links) big.find(b => b.id === l).links.push(item.id);
  }
  const medBase = new Map(); for (const m of medium) { const base = m.id.split(":")[0]; if (!medBase.has(base)) medBase.set(base, []); medBase.get(base).push(m); }

  /* ---- small ---- */
  const small = [];
  const smallFor = (p, r2, n) => {
    const t = ptags(p), town = X.settlements[X.mainOf[p]], out = [];
    const where = new Set(["any", town.tier >= 2 ? "town" : "village", "road", "wild"]); if (provs[p].coastal) where.add("coast"); if (F.mystery[p] >= 0) where.add("site");
    const opts = SMALL.filter(x => where.has(x.where || "any") && (!x.req || test(x.req, t)));
    const slots = slotsFor(p, null, r2);
    for (let k = 0; k < n && opts.length; k++) {
      // prefer rumours that belong to a story already happening
      const ws = opts.map(x => ((x.links || []).some(l => bigIds.has(l) || medBase.has(l)) ? 4 : 1) * (x.req ? 1.5 : 1));
      let tot = ws.reduce((a, b) => a + b, 0), r = r2.f() * tot, i = 0; while (i < opts.length - 1 && (r -= ws[i]) > 0) i++;
      const x = opts.splice(i, 1)[0], text = fill(x.t, slots); if (!text) { k--; continue; }
      const links = (x.links || []).flatMap(l => bigIds.has(l) ? [l] : medBase.has(l) ? medBase.get(l).map(m => m.id) : []);
      out.push({ scale: "small", id: x.id + ":" + p, title: townOf(p), text, place: p, realm: S.own[p], links });
    }
    return out;
  };
  // a scattering of rumours around the world, more near the big stories' anchors
  const rumourProvs = new Set();
  for (const b of big) for (const a of b.anchors.slice(0, 3)) { rumourProvs.add(a); for (const q of provs[a].adj.slice(0, 2)) rumourProvs.add(q); }
  for (const m of medium) rumourProvs.add(m.place);
  while (rumourProvs.size < Math.min(np, 40 + big.length * 6)) rumourProvs.add(rng.int(0, np - 1));
  for (const p of rumourProvs) small.push(...smallFor(p, makeRng(G.seed + "|small|" + p), 1));
  for (const x of small) for (const l of x.links) { const b = big.find(b => b.id === l) || medium.find(m => m.id === l); if (b) b.links.push(x.id); }

  const all = [...big, ...medium, ...small], byIdMap = new Map(all.map(x => [x.id, x]));
  s = {
    big, medium, small, world: [...world], get: id => byIdMap.get(id),
    byRealm: rid => [...big.filter(b => b.realms.includes(rid) || b.anchors.some(a => S.own[a] === rid)), ...medium.filter(m => m.realm === rid), ...small.filter(x => x.realm === rid).slice(0, 8)],
    // rumours for any province, generated on demand (the same every time)
    byProv: p => { const pre = small.filter(x => x.place === p); return pre.length ? pre : smallFor(p, makeRng(G.seed + "|small|" + p), 2); },
  };
  cache.set(G, s);
  return s;
}
import { GOODS } from "../content/goods.js";
const GOODS_N = g => GOODS[g].n.toLowerCase();
