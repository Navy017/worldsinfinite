import GenWorker from "./worker.js?worker&inline";
import { W, H, BIOMES, SPECIAL, TERR, HOSTILE_COL, TIER_NAME } from "../core/tables.js";
import { clamp } from "../core/util.js";
import { STAGES, PARAM_STAGE } from "../gen/stages.js";
import { findCell } from "../gen/lookup.js";
import { rollTraits, describeClimate } from "../gen/traits.js";
import { SHAPE_STYLES } from "../gen/shapes.js";
import { MARINE_RGB } from "./render.js";
import { app, computeColors, computeEdges, computeRegionLabels, buildWorldCache, frame, invalidateView, HYPSO, UNCLAIMED } from "./render.js";
import { makeLifeLayer } from "./life.js";
import { makeStreetLayer } from "./street.js";
import { makeClock, resetClock, tick, dateOf, ordinal, moonPhase, phaseName, localMinutes, sunAlt, darkness, makeNight, SPEEDS } from "./time.js";
import { CULTURE_TRAITS, FAITH_TYPES, DOCTRINES, GOVERNMENTS, ORIGINS, IDEALS } from "../content/society.js";
import { UNITS, SHIPS } from "../content/military.js";
import { GOODS } from "../content/goods.js";
import { REALM_TABS, realmPage, marketPage } from "./codex.js";
import { storiesFor } from "./stories.js";
import { zonePage, marinePage, animalPage } from "./ecozone.js";
import { makeWildlife } from "./wildlife.js";
import { armsOf, armsSvg } from "./heraldry.js";
import { clearCodexCache } from "./codex.js";
import { clearScienceCache } from "./science.js";
import { regionGroundName, townTileName, townLegend } from "./localview.js";
import { DISTRICTS } from "../gen/city.js";
import { makeChunkLayer } from "./chunks.js";
import { makeTownLayer } from "./towns.js";
import { TIERS } from "../gen/settlements.js";
import { LOOKUP, addExtra } from "../content/lookup.js";
import { setPowerWords } from "../core/text.js";
import { journalFor, holderCard, journalReindex, loreSection, readHolder, studySite, journalPage, JOURNAL_TABS, setGod, siteLevel } from "./journal.js";

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => Math.round(n).toLocaleString("en-US");
const canvas = $("#map"), insp = $("#inspector"), tip = $("#tip");
app.canvas = canvas; app.ctx = canvas.getContext("2d");

/* ---------------- settings: rolled by the seed, overridable ---------------- */
const pct = v => v + "%";
const CONTROLS = [
  { g: "Scale", id: "provinces", label: "Provinces (fine-tune)", min: 500, max: 20000, step: 100, f: v => fmt(v), fixed: true },
  { g: "Scale", id: "states", label: "Realms", min: 3, max: 300, step: 1 },
  { g: "Landmass", id: "continents", label: "Continents", min: 1, max: 8, step: 1 },
  { g: "Landmass", id: "shapeStyle", label: "Continent shapes", select: SHAPE_STYLES },
  { g: "Landmass", id: "sizeVariety", label: "Continent size variety", min: 0, max: 100, step: 5, f: pct, ends: ["Even", "One giant"] },
  { g: "Landmass", id: "land", label: "Land coverage", min: 20, max: 65, step: 1, f: pct },
  { g: "Landmass", id: "peninsulas", label: "Peninsulas (average per continent)", min: 0, max: 5, step: 1 },
  { g: "Landmass", id: "islands", label: "Islands & archipelagos", min: 0, max: 100, step: 5, f: pct },
  { g: "Landmass", id: "seas", label: "Inland seas & gulfs", min: 0, max: 8, step: 1 },
  { g: "Terrain & climate", id: "mountains", label: "Mountain building", min: 0, max: 100, step: 5, f: pct },
  { g: "Terrain & climate", id: "plateaus", label: "Plateaus", min: 0, max: 6, step: 1 },
  { g: "Terrain & climate", id: "climate", label: "Global temperature", min: -100, max: 100, step: 5, f: v => (v >= 0 ? "+" : "−") + Math.abs(v * 0.09).toFixed(1) + " °C", ends: ["Ice age", "Hothouse"] },
  { g: "Terrain & climate", id: "moisture", label: "Rainfall", min: -100, max: 100, step: 5, f: v => (v >= 0 ? "+" : "−") + Math.abs(v) + "%", ends: ["Arid", "Drenched"] },
  { g: "Wilds & wonders", id: "wildlife", label: "Wildlife danger", min: 0, max: 100, step: 5, f: pct },
  { g: "Wilds & wonders", id: "magic", label: "Mysteries & strange lands", min: 0, max: 100, step: 5, f: pct },
  { g: "Wilds & wonders", id: "premise", label: "Hidden truth of the world", select: { random: { n: "Rolled by the seed" }, none: { n: "None: the world is what it seems" } } },
  { g: "Peoples & politics", id: "conflict", label: "Warfare", min: 0, max: 100, step: 5, f: pct, ends: ["Peaceful age", "World at war"] },
];
const AUTO_IDS = CONTROLS.filter(c => !c.fixed).map(c => c.id);
const GEO_IDS = ["continents", "sizeVariety", "land", "peninsulas", "islands", "seas"];
const manual = {};          // settings the user has overridden
let provinces = 1500, rolled = null;
const rows = {};
let debounce = 0, pendingStage = Infinity;
const seedText = () => $("#seed").value.trim() || "worldsinfinite";
const valueOf = id => id === "provinces" ? provinces : id in manual ? manual[id] : rolled.values[id];

function queueGen(stage) {
  pendingStage = Math.min(pendingStage, stage);
  clearTimeout(debounce);
  debounce = setTimeout(() => { const s = pendingStage; pendingStage = Infinity; request(s); }, 150);
}
function buildControls() {
  const host = $("#controls"); let cur = null, sec = null;
  for (const c of CONTROLS) {
    if (c.g !== cur) { cur = c.g; sec = document.createElement("section"); sec.className = "group"; sec.innerHTML = `<h2>${c.g}</h2>`; host.appendChild(sec); }
    const d = document.createElement("div"); d.className = "ctl";
    d.innerHTML = `<label for="c-${c.id}">${c.label}</label><button class="pill" type="button"${c.fixed ? " hidden" : ""}></button><output></output>` +
      (c.select
        ? `<select id="c-${c.id}">${Object.entries(c.select).map(([k, o]) => `<option value="${k}">${o.n}</option>`).join("")}</select>`
        : `<input type="range" id="c-${c.id}" min="${c.min}" max="${c.max}" step="${c.step}">`) +
      (c.ends ? `<div class="ends"><span>${c.ends[0]}</span><span>${c.ends[1]}</span></div>` : "");
    sec.appendChild(d);
    const inp = d.querySelector("input, select"), out = d.querySelector("output"), pill = d.querySelector(".pill");
    const read = () => c.select ? inp.value : +inp.value;
    rows[c.id] = { c, d, inp, out, pill };
    inp.addEventListener("input", () => {
      if (c.fixed) { provinces = +inp.value; syncSizes(); }
      else manual[c.id] = read();
      syncControls();
    });
    inp.addEventListener("change", () => {
      if (c.fixed) { reroll(); request(0); return; }
      queueGen(PARAM_STAGE[c.id]);
    });
    pill.addEventListener("click", () => {
      // Custom -> back to the seed's value; Auto -> pin the current value
      if (c.id in manual) { const before = manual[c.id]; delete manual[c.id]; syncControls(); if (rolled.values[c.id] !== before) queueGen(PARAM_STAGE[c.id]); }
      else { manual[c.id] = rolled.values[c.id]; syncControls(); }
    });
  }
}
function syncControls() {
  for (const id in rows) {
    const { c, d, inp, out, pill } = rows[id], v = valueOf(id), isManual = id in manual;
    inp.value = v; out.textContent = c.select ? "" : c.f ? c.f(v) : v;
    d.classList.toggle("auto", !c.fixed && !isManual);
    pill.textContent = isManual ? "Custom" : "Auto";
    pill.classList.toggle("on", isManual);
    pill.title = isManual ? "Overridden. Click to return to the seed's value" : "Follows the seed. Click to lock this value";
  }
  const n = Object.keys(manual).length;
  $("#overrideCount").textContent = n ? `· ${n} custom` : "";
  $("#resetAuto").disabled = !n;
  renderCharacter();
}
function renderCharacter() {
  const a = rolled.archetype, custom = GEO_IDS.some(id => id in manual);
  $("#archName").textContent = a.n + (custom ? " (customized)" : "");
  $("#archDesc").textContent = a.d;
  const chips = [
    `${valueOf("continents")} continent${valueOf("continents") > 1 ? "s" : ""}`, `${valueOf("land")}% land`,
    SHAPE_STYLES[valueOf("shapeStyle")].n.toLowerCase() + " coasts",
    describeClimate(valueOf("climate"), valueOf("moisture")), `${fmt(valueOf("states"))} realms`,
    valueOf("conflict") < 30 ? "a peaceful age" : valueOf("conflict") > 65 ? "an age of war" : "wars here and there",
  ];
  $("#archChips").innerHTML = chips.map(c => `<span>${esc(c)}</span>`).join("");
}
function syncSizes() {
  document.querySelectorAll("#sizes button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.p === provinces)));
}
function reroll() { rolled = rollTraits(seedText(), provinces); rolled.values.premise = "random"; syncControls(); }
// the premise list comes from the worker with the first world, so the page never loads the premise files
function fillPremiseChoices(cat) {
  const sel = rows.premise && rows.premise.inp; if (!sel || !cat || sel.dataset.filled) return;
  const fam = { power: "Powers", world: "World secrets", scifi: "Lost science" };
  for (const f of Object.keys(fam)) {
    const g = document.createElement("optgroup"); g.label = fam[f];
    for (const p of cat.filter(p => p.family === f).sort((a, b) => a.name.localeCompare(b.name))) { const o = document.createElement("option"); o.value = p.id; o.textContent = p.name; g.appendChild(o); }
    sel.appendChild(g);
  }
  sel.dataset.filled = "1"; sel.value = valueOf("premise");
}
const SEED_WORDS = ["alder", "ember", "hollow", "saltmere", "thorn", "gloam", "mirewood", "ashen", "tidefall", "ravel", "cinder", "frostholm", "duskmoor", "brine", "wyrmrest", "oakshade", "stormreach", "lanthorn"];
const randomSeed = () => SEED_WORDS[Math.floor(Math.random() * SEED_WORDS.length)] + "-" + Math.floor(Math.random() * 900 + 100);
const readParams = () => {
  const P = { seed: seedText(), provinces };
  for (const id of AUTO_IDS) P[id] = valueOf(id);
  return P;
};

/* ---------------- loading screen ---------------- */
const STAGE_W = [0.16, 0.22, 0.06, 0.21, 0.04, 0.04, 0.09, 0.05, 0.05, 0.03, 0.01], INK_W = 0.05;
const loader = $("#loader"), ldFill = $("#ldFill"), ldSteps = $("#ldSteps"), ldErr = $("#ldErr");
let ldTimer = 0, ldState = [];
function loaderBegin(P, first) {
  $("#ldTitle").textContent = first ? "Forging a world" : "Reshaping the world";
  $("#ldSeed").textContent = `${P.seed} · ${fmt(P.provinces)} provinces`;
  ldSteps.innerHTML = [...STAGES.map(s => s.label), "Inking the map"].map((l, k) => `<li data-k="${k}"><span class="dot"></span><span>${l}</span><span class="t"></span></li>`).join("");
  ldState = new Array(STAGES.length + 1).fill("pending");
  ldErr.hidden = true; ldFill.style.width = "0%";
  clearTimeout(ldTimer);
  const show = () => { loader.hidden = false; loader.classList.remove("fading"); };
  // quick partial regenerations finish before the overlay is worth showing
  if (first || !loader.hidden) show(); else ldTimer = setTimeout(show, 140);
}
function loaderStep(k, state, ms) {
  ldState[k] = state;
  const li = ldSteps.children[k]; if (!li) return;
  li.className = state === "start" ? "active" : state;
  li.querySelector(".t").textContent = state === "done" ? `${fmt(ms)} ms` : state === "cached" ? "kept" : "";
  let p = 0;
  ldState.forEach((s, j) => { const w = j < STAGES.length ? STAGE_W[j] : INK_W; if (s === "done" || s === "cached") p += w; else if (s === "start") p += w * 0.5; });
  ldFill.style.width = Math.min(100, p * 100) + "%";
}
function loaderEnd() {
  clearTimeout(ldTimer);
  ldFill.style.width = "100%";
  if (loader.hidden) return;
  loader.classList.add("fading");
  setTimeout(() => { loader.hidden = true; loader.classList.remove("fading", "first"); }, 260);
}
function loaderError(msg) {
  clearTimeout(ldTimer); loader.hidden = false; loader.classList.remove("fading");
  ldErr.textContent = "Generation failed: " + msg + ". Try another seed or different settings.";
  ldErr.hidden = false;
}

/* ---------------- worker ---------------- */
const worker = new GenWorker();
// Helper workers for streamed detail (land chunks and towns), so detail loads in parallel and
// never waits behind world generation. Towns always go to the same helper, which keeps its plan.
const helpers = [0, 1].map(() => ({ w: new GenWorker(), ready: false, world: 0 }));
for (const h of helpers) h.w.onmessage = ({ data: m }) => {
  if (m.type === "done") { if (m.id === h.world) h.ready = true; return; }
  if (m.type === "chunk" || m.type === "townchunk" || (m.type === "error" && m.kind !== "world")) onDetail(m);
};
const readyHelpers = () => helpers.filter(h => h.ready && h.world === reqId);
let rr = 0;
function sendDetail(msg, affinity) {
  const hs = readyHelpers();
  if (!hs.length || busy) { worker.postMessage(msg); return; }
  const h = affinity != null ? hs[affinity % hs.length] : hs[rr++ % hs.length];
  h.w.postMessage(msg);
}
let busy = false, queued = null, reqId = 0, genStart = 0, firstWorld = true;
function request(from) {
  if (busy) { queued = Math.min(queued ?? Infinity, from); return; }
  const P = readParams();
  busy = true; reqId++; genStart = performance.now();
  loaderBegin(P, firstWorld);
  worker.postMessage({ id: reqId, P, from });
  // the helpers build the same world (it is deterministic) so they can serve detail requests
  for (const h of helpers) { h.ready = false; h.world = reqId; h.w.postMessage({ id: reqId, P, from, quiet: true }); }
}
worker.onmessage = ({ data: m }) => {
  if (m.type === "sim") { applyHistory(m.view); return; }
  if (m.type === "chunk" || m.type === "townchunk" || (m.type === "error" && m.kind !== "world")) { onDetail(m); return; }
  if (m.id !== reqId) return;
  if (m.type === "stage") loaderStep(m.k, m.state, m.ms);
  else if (m.type === "error") { busy = false; queued = null; loaderError(m.message); }
  else if (m.type === "done") {
    busy = false;
    if (queued !== null) { const f = queued; queued = null; request(f); return; }
    const genMs = performance.now() - genStart;
    loaderStep(STAGES.length, "start", 0);
    // let the loader paint the "inking" step before the main thread gets busy;
    // the timeout covers background tabs, where animation frames are paused
    let ran = false;
    const go = () => { if (ran) return; ran = true; applyWorld(m.world, genMs); };
    requestAnimationFrame(() => setTimeout(go, 0));
    setTimeout(go, 80);
  }
};

const SOCIETY_STAGE = STAGES.findIndex(s => s.key === "society");
function applyWorld(w, genMs) {
  const t0 = performance.now(), keepView = !firstWorld && w.from > 0;
  addExtra(w.W && w.W.extra); fillPremiseChoices(w.W && w.W.catalog);
  { const pw = w.W && w.W.picks.map(p => p.power).find(Boolean); setPowerWords(pw ? { power: pw.name, user: pw.user, users: pw.users, node: pw.node || "the old places of power" } : null); }
  app.world = w; app.ui.sel = null; insp.hidden = true; codex.hidden = true;
  searchIndex = null; crumbKey = ""; setTimeout(updateCrumbs, 50);
  w.news = []; hist.month = 0; hist.pending = false; hist.world = reqId; clearCodexCache(); clearScienceCache();
  app.chunks.reset(); app.towns.reset();
  if (!keepView || w.from <= SOCIETY_STAGE) resetClock(app.clock, w.Y.calendar);
  app.life.reset(w); app.wild.reset(w);
  computeEdges(); computeColors(); computeRegionLabels();
  app.night.update(w.Y.calendar, app.clock.t);
  if (!keepView) setFitView();
  buildWorldCache(); invalidateView(); frame(true);
  const drawMs = performance.now() - t0;
  loaderStep(STAGES.length, "done", drawMs);
  firstWorld = false;
  updateStats(genMs, drawMs); buildLegend();
  loaderEnd();
}

/* ---------------- view + input ---------------- */
// the world map and the zoomed-in levels each keep their own pan/zoom
const V = () => app.view;
const FK = () => app.fitK;
const draw = crisp => { frame(crisp); if (app.world) { app.chunks.update(); app.towns.update(); updateDetailStatus(); updateTownLegend(); updateClock(); updateCrumbs(); } };
// deepest zoom: street level, about 16 px per metre
const maxZoom = () => app.world ? Math.max(app.fitK * 60, 32 / app.towns.tileW()) : app.fitK * 60;
let crispTimer = 0, rafId = 0;
function interactFrame() {
  if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; draw(false); });
  clearTimeout(crispTimer); crispTimer = setTimeout(() => draw(true), 150);
}
// fully zoomed out, the map's height fills the screen; horizontally it wraps round like a globe
const fitScale = () => app.ch / H;
function setFitView() {
  app.fitK = fitScale();
  app.view.k = app.fitK; app.view.ox = (app.cw - W * app.fitK) / 2; app.view.oy = 0;
  normaliseView();
}
// keep x within one copy of the world (the rest is drawn as wrapped copies) and y on the map
function normaliseView() {
  const v = app.view, Wk = W * v.k;
  v.ox -= Math.ceil(v.ox / Wk) * Wk;
  v.oy = Math.min(0, Math.max(app.ch - H * v.k, v.oy));
}
// a screen x converted to a world x, wrapped onto the map
const worldX = mx => { const wx = (mx - app.view.ox) / app.view.k; return ((wx % W) + W) % W; };
function fitView() { setFitView(); draw(true); }
let resizeTimer = 0;
function resize() {
  const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return;
  const oldCw = app.cw, oldCh = app.ch;
  app.dpr = Math.min(window.devicePixelRatio || 1, 2); app.cw = r.width; app.ch = r.height;
  canvas.width = Math.round(app.cw * app.dpr); canvas.height = Math.round(app.ch * app.dpr);
  if (!oldCw) { setFitView(); return; }
  // keep the same world point centred, then rebuild the cache for the new fit scale
  const cx = (oldCw / 2 - app.view.ox) / app.view.k, cy = (oldCh / 2 - app.view.oy) / app.view.k, rel = app.view.k / app.fitK;
  app.fitK = fitScale();
  app.view.k = Math.max(app.fitK, app.fitK * rel); app.view.ox = app.cw / 2 - cx * app.view.k; app.view.oy = app.ch / 2 - cy * app.view.k;
  normaliseView(); invalidateView(); draw(false);
  clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { buildWorldCache(); frame(true); }, 200);
}
function zoomAt(mx, my, f) {
  const v = V(), nk = clamp(v.k * f, FK(), maxZoom()), wx = (mx - v.ox) / v.k, wy = (my - v.oy) / v.k;
  v.k = nk; v.ox = mx - wx * nk; v.oy = my - wy * nk;
  normaliseView(); interactFrame();
}
const pointers = new Map(); let drag = null, pinch = null, moved = 0;
canvas.addEventListener("pointerdown", ev => {
  canvas.setPointerCapture(ev.pointerId);
  pointers.set(ev.pointerId, { x: ev.offsetX, y: ev.offsetY });
  if (pointers.size === 1) { drag = { x: ev.offsetX, y: ev.offsetY, ox: V().ox, oy: V().oy }; moved = 0; canvas.classList.add("dragging"); }
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, k: V().k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, ox: V().ox, oy: V().oy }; moved = 99;
  }
});
canvas.addEventListener("pointermove", ev => {
  if (!pointers.has(ev.pointerId)) { if (ev.pointerType === "mouse") hover(ev.offsetX, ev.offsetY); return; }
  pointers.set(ev.pointerId, { x: ev.offsetX, y: ev.offsetY });
  if (pointers.size === 2 && pinch) {
    const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    const nk = clamp(pinch.k * d / pinch.d, FK(), maxZoom()), wx = (pinch.cx - pinch.ox) / pinch.k, wy = (pinch.cy - pinch.oy) / pinch.k;
    const v = V(); v.k = nk; v.ox = cx - wx * nk; v.oy = cy - wy * nk; normaliseView(); interactFrame();
  } else if (drag) {
    const dx = ev.offsetX - drag.x, dy = ev.offsetY - drag.y; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    if (moved > 4) { V().ox = drag.ox + dx; V().oy = drag.oy + dy; normaliseView(); drag.ox = V().ox - dx; drag.oy = V().oy - dy; interactFrame(); tip.hidden = true; }
  }
});
const endPointer = ev => {
  if (!pointers.has(ev.pointerId)) return;
  const wasSingle = pointers.size === 1;
  pointers.delete(ev.pointerId);
  if (wasSingle && moved <= 4 && ev.type === "pointerup") select(ev.offsetX, ev.offsetY);
  if (pointers.size === 0) { drag = null; pinch = null; canvas.classList.remove("dragging"); }
  else if (pointers.size === 1) { const [p] = [...pointers.values()]; drag = { x: p.x, y: p.y, ox: V().ox, oy: V().oy }; pinch = null; }
};
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener("pointerleave", () => { tip.hidden = true; });
canvas.addEventListener("wheel", ev => { ev.preventDefault(); zoomAt(ev.offsetX, ev.offsetY, Math.exp(-ev.deltaY * 0.0015)); }, { passive: false });
$("#zin").onclick = () => zoomAt(app.cw / 2, app.ch / 2, 1.6);
$("#zout").onclick = () => zoomAt(app.cw / 2, app.ch / 2, 1 / 1.6);
$("#zfit").onclick = fitView;

function cellAt(mx, my) {
  const wx = worldX(mx), wy = (my - app.view.oy) / app.view.k;
  if (wx < 0 || wy < 0 || wx > W || wy > H) return -1;
  return findCell(app.world.M, wx, wy);
}
function hover(mx, my) {
  if (!app.world) return;
  const lp = app.life.pick(worldX(mx), (my - app.view.oy) / app.view.k, app.view, tokensShown());
  if (lp) { tip.textContent = lifeTip(lp); tip.style.left = mx + "px"; tip.style.top = my + "px"; tip.hidden = false; return; }
  const an = app.wild.pick(worldX(mx), (my - app.view.oy) / app.view.k, app.view);
  if (an) { tip.textContent = `${an.gr.f.n} · ${an.gr.size > 1 ? an.gr.size + " together" : "alone"} · ${an.gr.zone.z.name}`; tip.style.left = mx + "px"; tip.style.top = my + "px"; tip.hidden = false; return; }
  if (app.chunks.active(app.view)) { const t = detailHover(mx, my); if (t) { tip.textContent = t; tip.style.left = mx + "px"; tip.style.top = my + "px"; tip.hidden = false; return; } }
  const i = cellAt(mx, my); if (i < 0) { tip.hidden = true; return; }
  const { T, R, S } = app.world; let txt;
  if (T.type[i] === 0) { const p = R.provs[R.owner[i]], s = S.own[p.id]; txt = p.name + " · " + (s >= 0 ? S.states[s].name : "Unclaimed"); }
  else { const b = R.bodies[R.waterName[i]]; txt = b ? b.name : "Open water"; }
  tip.textContent = txt; tip.style.left = mx + "px"; tip.style.top = my + "px"; tip.hidden = false;
}

/* ---------------- inspector ---------------- */
const elev = e => Math.round(Math.pow(e, 1.6) * 7400 / 10) * 10;
const rain = m => Math.round((Math.pow(m, 1.3) * 3200 + 80) / 10) * 10;
function select(mx, my) {
  if (!app.world) return;
  const lp = app.life.pick(worldX(mx), (my - app.view.oy) / app.view.k, app.view, tokensShown());
  if (lp) { showLife(lp); return; }
  const an = app.wild.pick(worldX(mx), (my - app.view.oy) / app.view.k, app.view);
  if (an) { insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(an.gr.f.n)}</h3>` + animalPage(an.gr); insp.hidden = false; insp.querySelector(".close").onclick = () => { insp.hidden = true; }; return; }
  const mon = monumentAt(mx, my); if (mon) { openCodex({ kind: "monument", id: mon.id }); return; }
  // market and library icons drawn next to towns
  const mk = (app.ui.marks || []).find(m => Math.hypot(m.x - mx, m.y - my) < 9);
  if (mk) { if (mk.kind === "market") openMarket(mk.id); else showHolder(mk.id); return; }
  if (app.ui.mode === "trade" && !app.chunks.active(app.view)) { const h = hubAt(mx, my); if (h >= 0) { openMarket(h); return; } }
  if (app.ui.mode === "ecology" && app.world.E && !app.chunks.active(app.view)) {
    const i = cellAt(mx, my);
    if (i >= 0 && app.world.T.type[i] === 0) { openZone(app.world.E.zoneOf[app.world.R.owner[i]]); return; }
    if (i >= 0 && app.world.T.type[i] === 1 && app.world.E.marine.zoneOfCell[i] >= 0) { openCodex({ kind: "sea", id: app.world.E.marine.zoneOfCell[i] }); return; }
  }
  if (app.chunks.active(app.view) && detailSelect(mx, my)) return;
  showCell(cellAt(mx, my));
}
// the card for whatever is in a world cell (a province or a body of water)
function showCell(i) {
  app.ui.holder = null;
  if (i < 0) { app.ui.sel = null; insp.hidden = true; frame(true); return; }
  const G = app.world, { M, T, R, S, F } = G, kmPx = G.worldKm / W, cellKm2 = M.cellArea * kmPx * kmPx;
  if (T.type[i] !== 0) {
    const b = R.bodies[R.waterName[i]];
    app.ui.sel = { water: i, edges: null };
    const depthM = T.type[i] === 1 ? Math.round(Math.pow(T.depth[i], 1.2) * 6000 / 10) * 10 : Math.round((T.filled[i] - T.e[i]) * 3000 + 20);
    insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(b ? b.name : "Open water")}</h3><div class="sub">${b ? b.kind : "Water"}</div>
      <dl class="kv"><dt>Depth here</dt><dd class="num">${fmt(depthM)} m</dd><dt>Surface temp.</dt><dd class="num">${Math.round(G.C.temp[i])} °C</dd></dl>`;
  } else {
    const pid = R.owner[i], p = R.provs[pid], sid = S.own[pid], st = sid >= 0 ? S.states[sid] : null, mass = R.masses[p.mass];
    // outline = every neighbour slot that leaves the province
    const edges = [];
    for (const c of p.cells) for (let k = M.nStart[c]; k < M.nStart[c + 1]; k++) { const n = M.nbr[k]; if (T.type[n] !== 0 || R.owner[n] !== pid) edges.push(M.nEdge[k]); }
    app.ui.sel = { prov: pid, edges: Int32Array.from(edges) };
    const rows = [
      ["Terrain", TERR[p.terr]], ["Biome", BIOMES[p.biome].n],
      ["Elevation", `<span class="num">${fmt(elev(p.e))} m</span>`], ["Avg. temp.", `<span class="num">${Math.round(p.temp)} °C</span>`],
      ["Rainfall", `<span class="num">${fmt(rain(p.moist))} mm/yr</span>`], ["Area", `<span class="num">${fmt(p.size * cellKm2)} km²</span>`],
    ];
    const ms = G.X.settlements[G.X.mainOf[pid]];
    rows.unshift(["Main settlement", `${esc(ms.name)} · ${TIERS[ms.tier].n}, ${fmt(ms.pop)} people${ms.walled ? ", walled" : ""}${ms.port ? ", port" : ""}`]);
    if (p.coastal) rows.push(["Coast", esc(R.bodies[p.coastBody] ? R.bodies[p.coastBody].name : "Open sea")]);
    if (p.lakeShore >= 0) rows.push(["Lakeshore", esc(R.bodies[p.lakeShore].name)]);
    if (p.rivers.length) rows.push(["Rivers", esc(p.rivers.slice(0, 3).map(r => R.rivers[r].name).join(", "))]);
    if (p.range >= 0) rows.push(["Range", esc(R.ranges[p.range].name)]);
    if (p.plateau >= 0 && R.plats[p.plateau]) rows.push(["Plateau", esc(R.plats[p.plateau].name)]);
    const Y = G.Y, Z = G.Z, cu = Y.cultures[Y.cultureOf[pid]], fa = Y.faiths[Y.faithOf[pid]];
    rows.push(["People", `${esc(cu.adj)}`], ["Faith", esc(fa.name)], ["Produces", esc(G.Q.goods[pid].map(g => GOODS[g].n).join(", "))]);
    if (Z.control[pid] !== S.own[pid] && Z.control[pid] >= 0) rows.push(["Occupied by", `<span class="neg">${esc(Z.actors[Z.control[pid]].name)}</span>`]);
    if (Z.warOf[pid] >= 0) rows.push(["War", esc(Z.wars[Z.warOf[pid]].name)]);
    if (G.E) { const z = G.E.zones[G.E.zoneOf[pid]]; rows.push(["Ecology", `<a href="#" data-zone="${z.id}">${esc(z.name)}</a>`]); }
    if (G.Q.hubs.includes(pid)) rows.push(["Market", `<a href="#" data-market="${pid}">See what is sold here</a>`]);
    const tags = [];
    if (F.volcProv[pid] >= 0) tags.push(`<div class="tag t-danger"><b>Volcano: ${esc(F.volcanoes[F.volcProv[pid]].name)}</b>An active peak on a plate collision.</div>`);
    if (F.hostile[pid] >= 0) { const h = F.hostRegions[F.hostile[pid]]; tags.push(`<div class="tag t-danger"><b>Hostile wildlife · ${TIER_NAME[h.tier]}</b>${esc(h.creature)} roam ${h.provs.length} province${h.provs.length > 1 ? "s" : ""} here.</div>`); }
    if (F.titan[pid] >= 0) { const t = F.titans[F.titan[pid]]; tags.push(`<div class="tag t-titan"><b>Titan domain</b>${esc(t.name)} roams ${t.provs.length} provinces. Settlements here do not last.</div>`); }
    if (F.mystery[pid] >= 0) { const s = F.sites[F.mystery[pid]]; tags.push(`<div class="tag t-myst"><b>${esc(s.name)}</b>${esc(s.d)}</div>`); }
    if (F.special[pid]) { const sp = SPECIAL[F.special[pid]]; tags.push(`<div class="tag t-wood"><b>${sp.n}</b>${sp.d}</div>`); }
    const realm = st ? realmSection(st, pid, cellKm2) : "";
    insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(p.name)}</h3>
      <div class="sub">${st ? "Province of " + esc(st.name) : "Unclaimed wilderness"} · ${esc(mass.name || "Unnamed islet")}</div>
      <div class="cardactions"><button class="primary" id="enterProv">Zoom in</button>${st ? `<button data-codex-realm="${st.id}">Codex of ${esc(st.short)}</button>` : ""}${G.Q.hubs.includes(pid) ? `<button data-market="${pid}">Market</button>` : ""}${G.E ? `<button data-zone="${G.E.zoneOf[pid]}">Wildlife</button>` : ""}</div>
      <dl class="kv">${rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>
      ${tags.length ? `<div class="tags">${tags.join("")}</div>` : ""}
      ${loreSection(G, pid)}<h4>Rumours</h4>${storiesFor(G).byProv(pid).map(x => `<p class="note" style="margin:4px 0">“${esc(x.text)}”${x.links.length ? ` <a href="#" data-story="${esc(x.links[0])}">(part of a larger story)</a>` : ""}</p>`).join("")}${realm}`;
  }
  insp.hidden = false;
  insp.querySelector(".close").onclick = () => { app.ui.sel = null; insp.hidden = true; frame(true); };
  const eb = insp.querySelector("#enterProv"); if (eb) eb.onclick = () => zoomToProvince(app.ui.sel.prov);
  frame(true);
}

// a library, archive or temple on its own card
function showHolder(hid) {
  const w = app.world, h = w.L.holders[hid]; if (!h) return;
  const s = w.X.settlements[w.X.mainOf[h.prov]], r = w.S.own[h.prov];
  app.ui.sel = null; app.ui.holder = hid;
  insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(h.name)}</h3><div class="sub">${esc(s ? s.name : w.R.provs[h.prov].name)}${r >= 0 ? " · " + esc(w.S.states[r].name) : ""}</div>
    <div class="cardactions"><button data-prov="${h.prov}">The province</button>${r >= 0 ? `<button data-codex-realm="${r}">Codex of ${esc(w.S.states[r].short)}</button>` : ""}${w.Q.hubs.includes(h.prov) ? `<button data-market="${h.prov}">Market</button>` : ""}</div>${holderCard(w, hid)}`;
  insp.hidden = false; insp.querySelector(".close").onclick = () => { app.ui.holder = null; insp.hidden = true; };
}

/* ---------------- peoples and politics ---------------- */
const byId = list => Object.fromEntries(list.map(x => [x.id, x]));
const TRAIT = byId(CULTURE_TRAITS), FTYPE = LOOKUP.faith, DOCT = byId(DOCTRINES), GOVT = LOOKUP.gov, ORIG = byId(ORIGINS), IDEAL = byId(IDEALS);
const UNIT = LOOKUP.unit, SHIPT = byId(SHIPS);
const signed = n => `<span class="op ${n > 0 ? "pos" : n < 0 ? "neg" : ""}">${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}</span>`;
const STATUS = { alliance: "Allies", friendly: "Friendly", neutral: "Neutral", tense: "Tense", rival: "Rivals" };
function realmSection(st, pid, cellKm2) {
  const G = app.world, { R, Y, Z, S } = G, r = Y.realms[st.id], cu = Y.cultures[r.culture], fa = Y.faiths[r.faith], gov = GOVT[r.gov], org = ORIG[r.origin];
  let area = 0; for (const q of st.provs) area += R.provs[q].size;
  const cal = Y.calendar;
  const rels = Y.relations.filter(x => x.a === st.id || x.b === st.id).sort((a, b) => Math.abs(b.op) - Math.abs(a.op)).slice(0, 6);
  const wars = Z.wars.filter(w => [...w.attackers, ...w.defenders].some(a => a === st.id || Z.actors[a].of === st.id));
  const arms = armsOf(G, st.id);
  return `<h4>Realm</h4><div class="realmhead">${armsSvg(arms, 44)}<div><b>${esc(st.name)}</b><div class="sub">${esc(arms.blazon)}</div></div></div><button class="enter" data-codex-realm="${st.id}">Open the codex of ${esc(st.short)}</button><dl class="kv"><dt>Name</dt><dd>${esc(st.name)}</dd><dt>Ruler</dt><dd>${esc(r.ruler)}</dd>
    <dt>Government</dt><dd title="${esc(gov.d)}">${esc(gov.n)}</dd><dt>Origin</dt><dd>${esc(org.n)}</dd>
    <dt>Founded</dt><dd class="num">${r.founded} ${esc(cal.eraShort)}</dd>
    <dt>Capital</dt><dd>${esc(R.provs[st.capital].name)}${st.capital === pid ? " (this province)" : ""}</dd>
    <dt>Provinces</dt><dd class="num">${fmt(st.provs.length)}</dd><dt>Area</dt><dd class="num">${fmt(area * cellKm2)} km²</dd>
    <dt>People</dt><dd>${esc(cu.adj)}${r.minorities.length ? `, with ${r.minorities.map(m => `${esc(Y.cultures[m.culture].adj)} ${Math.round(m.share * 100)}%`).join(", ")}` : ""}</dd>
    <dt>State faith</dt><dd>${esc(fa.name)}</dd>
    <dt>Ideals</dt><dd>${r.ideals.map(i => `<span title="${esc(IDEAL[i].d)}">${esc(IDEAL[i].n)}</span>`).join(", ")}</dd></dl>
    <p class="note">${esc(r.originText)}</p>
    <h4>The ${esc(cu.adj)} people</h4><dl class="kv">${cu.traits.map(t => `<dt>${esc(TRAIT[t].n)}</dt><dd>${esc(TRAIT[t].d)}</dd>`).join("")}</dl>
    <h4>${esc(fa.name)}</h4><div class="sub">${esc(FTYPE[fa.type].n)}: ${esc(FTYPE[fa.type].d)}</div>
    <dl class="kv">${fa.doctrines.map(d => `<dt>${esc(DOCT[d].n)}</dt><dd>${esc(DOCT[d].d)}</dd>`).join("")}<dt>Holy site</dt><dd>${esc(fa.holy.name)}</dd></dl>
    ${wars.length ? `<h4>At war</h4><div class="tags">${wars.map(w => `<div class="tag t-danger"><b>${esc(w.name)}</b>${esc(w.cbName)} · ${w.attackers.map(a => esc(Z.actors[a].name)).join(" and ")} against ${w.defenders.map(a => esc(Z.actors[a].name)).join(" and ")}${w.why.length ? ". " + esc(w.why.join("; ")) : ""}</div>`).join("")}</div>` : ""}
    ${rels.length ? `<h4>Neighbours</h4><div class="rel">${rels.map(x => { const o = x.a === st.id ? x.b : x.a; return `<span>${esc(S.states[o].name)} · ${STATUS[x.status]}</span>${signed(x.op)}<span class="why">${x.why.map(([w, d]) => `${esc(w)} ${d > 0 ? "+" : "−"}${Math.abs(d)}`).join(" · ")}</span>`; }).join("")}</div>` : ""}`;
}

/* ---------------- things that move ---------------- */
const tokensShown = () => app.ui.mode === "conflict" || app.view.k / app.fitK > 2.5;
const goods = gs => gs.map(g => GOODS[g].n).join(", ");
const rigName = { square: "Square-rigged", lateen: "Lateen-rigged", junk: "Junk-rigged", oars: "Oared galley" };
function lifeTip(lp) {
  const G = app.world, st = G.X.settlements;
  if (lp.kind === "army") {
    const a = lp.A.a;
    if (lp.battalion != null) { const d = a.divisions[lp.division], rg = d.regiments[lp.regiment], b = rg.battalions[lp.battalion], u = UNIT[b.unit]; return `${u.n} · ${b.n}, ${rg.n} · ${fmt(b.men)} men`; }
    if (lp.division != null) return `${a.divisions[lp.division].n} · ${a.name}`;
    return `${a.name} · ${fmt(a.men)} men · ${G.Z.actors[a.actor].name}`;
  }
  if (lp.kind === "fleet") return lp.ship ? `${lp.ship.name} · ${lp.ty.n} · ${lp.F.f.name}` : `${lp.F.f.name} · ${lp.F.f.ships.length} ships`;
  if (lp.kind === "ship") return `${lp.s.name} · ${lp.s.type.n}, merchant · ${goods(lp.s.cargo)}`;
  if (lp.kind === "boat") return `${lp.b.name} · ${lp.b.type.n} out of ${st[lp.b.home].name}`;
  if (lp.kind === "caravan") return `Caravan · ${lp.c.wagons} wagons of ${goods(lp.c.goods)}`;
  if (lp.kind === "traveller") { const r = G.X.roads[lp.t.road]; return `${lp.t.ty.n} · road between ${st[r.a].name} and ${st[r.b].name}`; }
  return "";
}
function showLife(lp) {
  const G = app.world, { Z, X, S } = G, st = X.settlements;
  let h = "";
  if (lp.kind === "army") {
    const a = lp.A.a, actor = Z.actors[a.actor], war = a.war >= 0 ? Z.wars[a.war] : null;
    const byUnit = new Map(); for (const d of a.divisions) for (const r of d.regiments) for (const b of r.battalions) byUnit.set(b.unit, (byUnit.get(b.unit) || 0) + b.men);
    const foe = a.battle ? app.life.armies.find(B => B.a !== a && B.a.war === a.war && B.a.front === a.front && B.a.side !== a.side) : null;
    const status = a.garrison ? "In barracks at the capital" : foe ? `In battle with ${foe.a.name} (${Z.actors[foe.a.actor].name})`
      : a.mode === "siege" ? `Besieging ${a.siege.name}` : a.mode === "march" ? "On the march along the road" : "Encamped behind the front";
    const crumbs = [a.name];
    let detail = "";
    if (lp.division != null) {
      const d = a.divisions[lp.division]; crumbs.push(d.n);
      if (lp.battalion != null) {
        const rg = d.regiments[lp.regiment], b = rg.battalions[lp.battalion], u = UNIT[b.unit];
        crumbs.push(`${rg.n} “${rg.title}”`, b.n);
        if (lp.company >= 0) crumbs.push(`${ordinal(lp.company + 1)} Company`);
        detail = `<h4>${lp.soldier ? "A soldier of the " + esc(u.n) : esc(u.n)}</h4><dl class="kv"><dt>Role</dt><dd>${esc(u.role[0].toUpperCase() + u.role.slice(1))}${u.mounted ? ", mounted" : ""}</dd>
          <dt>Battalion</dt><dd class="num">${fmt(b.men)} men in ${b.companies.length} companies</dd>
          ${lp.company >= 0 ? `<dt>Company</dt><dd class="num">${fmt(b.companies[lp.company])} men</dd>` : ""}
          <dt>Formation</dt><dd class="num">${Math.round(b.w)} m wide, ${u.ranks} ranks deep</dd><dt>Armour</dt><dd>${esc(u.kit)}</dd></dl>`;
      } else {
        let men = 0; const regs = d.regiments.map(r => { const m = r.battalions.reduce((x, b) => x + b.men, 0); men += m; return `<dt>${esc(r.n)}</dt><dd>“${esc(r.title)}”, ${fmt(m)} men</dd>`; });
        detail = `<h4>${esc(d.n)}</h4><dl class="kv"><dt>Strength</dt><dd class="num">${fmt(men)} men</dd>${regs.join("")}</dl>`;
      }
    }
    h = `<h3>${esc(crumbs[crumbs.length - 1])}</h3><div class="sub">${esc(actor.name)}${war ? " · " + esc(war.name) : ""}</div>
      ${crumbs.length > 1 ? `<p class="crumbs">${crumbs.map(esc).join(" › ")}</p>` : ""}${detail}
      <h4>${esc(a.name)}</h4><dl class="kv"><dt>Commander</dt><dd>${esc(a.general)}</dd><dt>Strength</dt><dd class="num">${fmt(a.men)} men</dd>
      <dt>Divisions</dt><dd class="num">${a.divisions.length}</dd><dt>Status</dt><dd>${esc(status)}</dd>
      ${[...byUnit.entries()].sort((x, y) => y[1] - x[1]).map(([u, m]) => `<dt>${esc(UNIT[u].n)}</dt><dd class="num">${fmt(m)}</dd>`).join("")}</dl>
      <p class="note">Zoom in to see divisions, then battalions, companies and finally every soldier.</p>`;
  } else if (lp.kind === "fleet") {
    const f = lp.F.f, counts = new Map(); for (const s of f.ships) counts.set(s.type, (counts.get(s.type) || 0) + 1);
    const ship = lp.ship ? `<h4>${esc(lp.ship.name)}</h4>${shipKv(lp.ty, {})}` : "";
    h = `<h3>${esc(lp.ship ? lp.ship.name : f.name)}</h3><div class="sub">${lp.ship ? esc(lp.ty.n) + ", warship · " : ""}${esc(Z.actors[f.actor].name)}</div>${ship}
      <h4>${esc(f.name)}</h4><dl class="kv"><dt>Admiral</dt><dd>${esc(f.admiral)}</dd><dt>Orders</dt><dd>${esc(f.mission)}</dd><dt>Home port</dt><dd>${esc(st[X.mainOf[f.home]].name)}</dd>
      ${[...counts.entries()].map(([t, n]) => `<dt>${esc(SHIPT[t].n)}</dt><dd class="num">${n}</dd>`).join("")}</dl>`;
  } else if (lp.kind === "ship") {
    const s = lp.s, flag = s.realm >= 0 ? S.states[s.realm].name : "no flag";
    h = `<h3>${esc(s.name)}</h3><div class="sub">${esc(s.type.n)}, merchant · ${esc(flag)}</div>
      ${shipKv(s.type, { "Plies between": `${esc(st[s.route.a].name)} and ${esc(st[s.route.b].name)}`, "Home port": esc(st[s.home].name), Cargo: `${esc(goods(s.cargo))}, ${fmt(s.tonnes)} t`, Crew: fmt(s.crew), Speed: `${s.knots.toFixed(1)} knots` })}`;
  } else if (lp.kind === "boat") {
    const b = lp.b;
    h = `<h3>${esc(b.name)}</h3><div class="sub">${esc(b.type.n)} · fishing out of ${esc(st[b.home].name)}</div>${shipKv(b.type, { Crew: fmt(b.crew) })}`;
  } else if (lp.kind === "traveller") {
    const t = lp.t, r = G.X.roads[t.road];
    h = `<h3>${esc(t.ty.n)}</h3><div class="sub">On the road between ${esc(st[r.a].name)} and ${esc(st[r.b].name)}</div>
      <dl class="kv">${t.n > 1 ? `<dt>In the party</dt><dd class="num">${t.n}</dd>` : ""}<dt>Pace</dt><dd class="num">${t.kmh.toFixed(1)} km/h</dd><dt>Road</dt><dd>${r.cls ? "Main road" : "Country road"}</dd></dl>`;
  } else if (lp.kind === "caravan") {
    const c = lp.c;
    h = `<h3>Caravan from ${esc(st[c.home].name)}</h3><div class="sub">On the road between ${esc(st[c.route.a].name)} and ${esc(st[c.route.b].name)}</div>
      <dl class="kv"><dt>Goods</dt><dd>${esc(goods(c.goods))}</dd><dt>Wagons</dt><dd class="num">${c.wagons}</dd><dt>Guards</dt><dd class="num">${c.guards}</dd><dt>Pace</dt><dd class="num">${c.kmh.toFixed(1)} km/h</dd></dl>`;
  }
  insp.innerHTML = `<button class="close" aria-label="Close details">×</button>` + h;
  insp.hidden = false;
  insp.querySelector(".close").onclick = () => { insp.hidden = true; };
}
function shipKv(t, extra) {
  const rows = { ...extra, Length: `${t.len} m`, Beam: `${t.beam} m`, Rig: `${rigName[t.rig] || t.rig}${t.masts > 1 ? `, ${t.masts} masts` : ""}`, ...(t.guns ? { Guns: t.guns } : {}), ...(t.cargo && !extra.Cargo ? { Hold: `${t.cargo} t` } : {}) };
  return `<dl class="kv">${Object.entries(rows).map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>`;
}

/* ---------------- roadside stops ---------------- */
const STOP_KIND = { inn: "Roadside inn", hamlet: "Roadside hamlet", tower: "Watchtower", shrine: "Wayside shrine", border: "Border post" };
function stopTitle(st) { const S = app.world.S; return st.kind === "border" ? `Border post between ${S.states[st.from].short} and ${S.states[st.realm].short}` : `${st.name} · ${STOP_KIND[st.kind]}`; }
function showStop(st) {
  const G = app.world, S = G.S, x = G.X.settlements, rd = G.X.roads[st.road], rng = makeRngLocal(st.x);
  const what = {
    inn: "Travellers, drovers and caravan guards stop here for the night. The stables are full on market days.",
    hamlet: "A handful of houses grew up where the road needed a smithy, a well and somewhere to change horses.",
    tower: "A garrison of a dozen watches the road for bandits and sends riders ahead with news.",
    shrine: "A small roadside shrine where travellers leave coins and prayers for a safe journey.",
    border: `Soldiers of ${S.states[st.realm].name} check papers and collect tolls from everyone crossing from ${S.states[st.from].name}.`,
  }[st.kind];
  const war = G.Z.wars.find(w => { const sides = [w.attackers, w.defenders].map(l => l.map(a => G.Z.actors[a].rebel ? G.Z.actors[a].of : a)); return st.kind === "border" && ((sides[0].includes(st.realm) && sides[1].includes(st.from)) || (sides[1].includes(st.realm) && sides[0].includes(st.from))); });
  insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(st.kind === "border" ? "Border post" : st.name)}</h3>
    <div class="sub">${STOP_KIND[st.kind]} on the road between ${esc(x[rd.a].name)} and ${esc(x[rd.b].name)}</div>
    <p class="note">${esc(what)}${war ? ` The border is closed: ${esc(war.name)} is being fought.` : ""}</p>
    <dl class="kv"><dt>Realm</dt><dd>${esc(S.states[st.realm].name)}</dd><dt>Road</dt><dd>${rd.cls ? "Main road" : "Country road"}</dd>${st.kind === "border" ? `<dt>Toll</dt><dd>${(1 + rng() * 4).toFixed(1)} coins a wagon</dd>` : ""}</dl>`;
  insp.hidden = false;
  insp.querySelector(".close").onclick = () => { insp.hidden = true; };
}
const makeRngLocal = seed => { let a = Math.floor(seed * 1e6) | 0; return () => { a = (a * 1664525 + 1013904223) | 0; return ((a >>> 0) % 10000) / 10000; }; };

/* ---------------- codex ---------------- */
const codex = $("#codex");
let cxState = null;
function openCodex(state) {
  cxState = state; const G = app.world;
  let kicker = "", title = "", sub = "", tabs = null, body = "";
  if (state.kind === "realm") {
    const st = G.S.states[state.id], r = G.Y.realms[state.id];
    kicker = "Codex of the realm"; title = st.name; sub = `${r.ruler} · ${G.Y.cultures[r.culture].adj} · ${G.Y.faiths[r.faith].name}`;
    tabs = REALM_TABS; state.tab = state.tab || "overview"; body = realmPage(G, state.id, state.tab);
  } else if (state.kind === "market") {
    const t = G.X.settlements[state.id]; kicker = "Market"; title = `The market of ${t.name}`; sub = G.S.own[state.id] >= 0 ? G.S.states[G.S.own[state.id]].name : "";
    body = marketPage(G, state.id, state.compare);
  } else if (state.kind === "zone") {
    const z = G.E.zones[state.id]; kicker = "Ecological zone"; title = z.name; sub = `${BIOMES[z.biome].n} · ${fmt(z.area)} km²`;
    body = zonePage(G, state.id);
  } else if (state.kind === "atlas") {
    kicker = "Atlas"; title = "Everything in this world"; sub = "Click any row to open it";
    tabs = [["realms", "Nations"], ["stories", "Stories"], ["wars", "Wars"], ["history", "History"], ["trade", "Trade"], ["mysteries", "Mysteries"], ["wonders", "Wonders"], ["people", "People"], ["zones", "Wildlife on land"], ["seas", "Seas"]];
    state.tab = state.tab || "realms"; body = atlasPage(state.tab);
  } else if (state.kind === "sea") {
    const z = G.E.marine.zones[state.id]; kicker = "Sea zone"; title = z.name; sub = z.monster ? `Monster waters · ${z.monster.n}` : "";
    body = marinePage(G, state.id);
  } else if (state.kind === "news") {
    kicker = "Chronicle"; title = app.world.Hdate ? `The world in ${app.world.Hdate.year} ${app.world.Y.calendar.eraShort}` : "The world's news";
    sub = "Everything that happens as time passes, newest first"; body = newsPage();
  } else if (state.kind === "monument") {
    const m = app.world.H.monuments[state.id], S = app.world.S;
    kicker = ["", "Monument", "Great work", "Wonder of the world"][m.tier]; title = m.name; sub = `${S.states[m.realm] ? S.states[m.realm].name : ""} · completed ${m.year} ${app.world.Y.calendar.eraShort}`;
    body = `<p>Built under ${esc(m.builder)}. ${m.tier === 3 ? "Travellers come from across the world to see it." : m.tier === 2 ? "It is the pride of the realm." : "Locals are fond of it."}</p><a href="#" data-prov="${m.prov}">Go there</a>`;
  } else if (state.kind === "journal") {
    kicker = "Journal"; title = "What you have pieced together"; sub = "Secrets are found in libraries, temples, ruins, village tales, inns and people. Open a province to look.";
    tabs = JOURNAL_TABS; state.tab = state.tab || "mysteries"; body = journalPage(G, state.tab);
  } else if (state.kind === "stories") {
    kicker = "Stories of this world"; title = "What is happening"; sub = "World stories, the regional stories that feed them, and the rumours that hint at both";
    tabs = [["live", "Unfolding"], ["ended", "Concluded"], ["big", "World stories"], ["medium", "Regional stories"], ["small", "Rumours"]]; state.tab = state.tab || "live";
    body = state.tab === "live" || state.tab === "ended" ? storylinesPage(state.tab) : storiesPage(state.tab, state.focus);
  }
  $("#cxKicker").textContent = kicker; $("#cxTitle").textContent = title; $("#cxSub").textContent = sub;
  $("#cxArms").innerHTML = state.kind === "realm" ? armsSvg(armsOf(G, state.id), 52) : "";
  $("#cxTabs").hidden = !tabs;
  $("#cxTabs").innerHTML = tabs ? tabs.map(([k, n]) => `<button role="tab" data-tab="${k}" aria-selected="${k === state.tab}">${n}</button>`).join("") : "";
  const keep = state.keepScroll ? $("#cxBody").scrollTop : 0;
  $("#cxBody").innerHTML = body; $("#cxBody").scrollTop = keep;
  delete state.keepScroll;
  codex.hidden = false; insp.hidden = true;
}
function storiesPage(tab, focus) {
  const s = storiesFor(app.world), go = p => p != null ? ` <a href="#" data-prov="${p}">Go there</a>` : "";
  const titleOf = id => { const x = s.get(id); return x ? `<a href="#" data-story="${esc(id)}">${esc(x.title)}</a>` : ""; };
  const card = x => `<div class="story ${x.scale}" id="st-${esc(x.id).replace(/[^\w-]/g, "_")}"${x.id === focus ? ' style="box-shadow:0 0 0 2px var(--accent)"' : ""}><div class="scale">${x.scale === "big" ? "World story" : x.scale === "medium" ? "Regional story" : "Rumour from " + esc(x.title)}</div>
    ${x.scale !== "small" ? `<b>${esc(x.title)}</b>` : ""}<p>${esc(x.text)}</p>
    ${x.stages && x.stages.length ? `<div class="stage">${x.stages.map((t, i) => i === x.stage ? `<b>Now: ${esc(t)}</b>` : i < x.stage ? `<s>${esc(t)}</s>` : "").filter(Boolean).join("<br>")}</div>` : ""}
    ${x.signs && x.signs.length ? `<ul>${x.signs.map(g => `<li>${esc(g.text)}${go(g.p)}</li>`).join("")}</ul>` : ""}
    ${x.hooks && x.hooks.length ? `<ul>${x.hooks.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
    ${x.links && x.links.length ? `<p class="note">Connected: ${[...new Set(x.links)].slice(0, 8).map(titleOf).filter(Boolean).join(" · ")}</p>` : ""}${go(x.place)}</div>`;
  return s[tab].map(card).join("") || "<p>None in this world.</p>";
}
// the atlas: browsable lists of everything, each row opens or goes to its thing
const atlasGo = [];
function atlasPage(tab) {
  const w = app.world, { S, Y, Z, Q, X, E, H, R } = w; atlasGo.length = 0;
  const row = (lead, title, sub, right, go) => { atlasGo.push(go); return `<button class="atlasrow" data-atlas="${atlasGo.length - 1}">${lead}<span><b>${esc(title)}</b><br><small>${sub}</small></span><span class="num">${right}</span></button>`; };
  let rows = [];
  if (tab === "realms") rows = S.states.map((s, i) => ({ s, i })).filter(({ i }) => !(H && H.realm[i] && H.realm[i].dead)).sort((a, b) => b.s.provs.length - a.s.provs.length)
    .map(({ s, i }) => row(armsSvg(armsOf(w, i), 22), s.name, `${esc(GOVT[Y.realms[i].gov].n)} · ${esc(Y.realms[i].ruler)}${H ? ` · stability ${Math.round(H.realm[i].stability)}%` : ""}`, `${s.provs.length} prov.`, () => openCodex({ kind: "realm", id: i })));
  else if (tab === "wars") rows = Z.wars.map(war => row("⚔", war.name, `${war.attackers.map(a => esc(Z.actors[a] ? Z.actors[a].name : "?")).join(", ")} against ${war.defenders.map(a => esc(Z.actors[a] ? Z.actors[a].name : "?")).join(", ")} · ${esc(war.cbName)}`, `${war.score > 0 ? "+" : ""}${Math.round(war.score)}`, () => { codex.hidden = true; goWar(war); }));
  else if (tab === "stories") {
    const live = H && H.stories ? H.stories.slice().reverse() : [], st2 = storiesFor(w);
    rows = live.slice(0, 80).map(s => row(s.done ? "✓" : "◆", s.title, `${s.scale === "world" ? "World" : s.scale === "realm" ? "Realm" : "Local"} storyline · ${S.states[s.realm] ? esc(S.states[s.realm].name) : ""} · ${s.done ? "concluded" : "unfolding"}`, `${s.log.length} chapters`, () => openCodex({ kind: "stories", tab: s.done ? "ended" : "live" })))
      .concat(st2.big.map(b => row("✦", b.title, `World story · ${esc(b.stages[b.stage] || "")}`, "", () => openCodex({ kind: "stories", tab: "big", focus: b.id }))))
      .concat(st2.medium.slice(0, 60).map(m => row("·", m.title, `Regional story${m.realm >= 0 && S.states[m.realm] ? " · " + esc(S.states[m.realm].name) : ""}`, "", () => openCodex({ kind: "stories", tab: "medium", focus: m.id }))));
  }
  else if (tab === "history") rows = (w.news || []).filter(n => n.imp >= 2).slice(-150).reverse().map(n => row(n.imp >= 3 ? "●" : "○", n.h, `${n.year} ${esc(n.mon)} · ${esc(n.b)}`, "", () => { codex.hidden = true; if (n.prov >= 0) { zoomToProvince(n.prov, true); showCell(R.provs[n.prov].heart); } }));
  else if (tab === "trade") rows = Q.named.map(n => row("⇄", n.name, `${esc(X.settlements[n.a].name)} to ${esc(X.settlements[n.b].name)} · mostly ${n.sea ? "by sea" : "by road"} · ${esc(GOODS[n.good].n)}`, `${fmt(n.km)} km`, () => { setMode("trade"); const a = X.settlements[n.a]; zoomTo(a.x, a.y, 0.0004); codex.hidden = true; }))
      .concat(Q.hubs.slice().sort((a, b) => Q.through[b] - Q.through[a]).slice(0, 40).map(h => row("⚖", `Market of ${X.settlements[h].name}`, `${S.own[h] >= 0 ? esc(S.states[S.own[h]].name) : ""} · makes ${Q.goods[h].map(g => GOODS[g].n).join(", ")}`, "prices", () => openMarket(h))));
  else if (tab === "mysteries") rows = w.F.sites.map(si => row("◇", si.name, `${esc(si.type)} · ${esc(R.provs[si.prov].name)}${S.own[si.prov] >= 0 ? ", " + esc(S.states[S.own[si.prov]].name) : ""} · ${esc(si.d)}`, "", () => { codex.hidden = true; zoomToProvince(si.prov, true); showCell(si.cell); }))
      .concat(w.L ? w.L.sites.filter(si => siteLevel(w, si.id) >= 0).map(si => row("✧", si.name, `${esc(si.kind)} · ${esc(R.provs[si.prov].name)}${S.own[si.prov] >= 0 ? ", " + esc(S.states[S.own[si.prov]].name) : ""} · ${esc(si.d)}`, "", () => { codex.hidden = true; zoomToProvince(si.prov, true); showCell(si.cell); })) : [])
      .concat(w.L ? w.L.zones.map(z => row("▒", z.n, esc(z.d || ""), `${z.provs.length} prov.`, () => { codex.hidden = true; zoomToProvince(z.provs[0], true); showCell(R.provs[z.provs[0]].heart); })) : [])
      .concat(w.F.titans.map(t => row("♜", t.name, `Titan · roams ${t.provs.length} provinces`, "", () => { codex.hidden = true; zoomTo(w.M.x[t.heart], w.M.y[t.heart], 0.0006); })));
  else if (tab === "markets") rows = Q.hubs.slice().sort((a, b) => Q.through[b] - Q.through[a]).map(h => row("⚖", X.settlements[h].name, `${S.own[h] >= 0 ? esc(S.states[S.own[h]].name) : ""} · ${Q.goods[h].map(g => GOODS[g].n).join(", ")}`, `trade ${Math.round(Q.through[h] * 100)}`, () => openMarket(h)));
  else if (tab === "wonders") rows = (H ? H.monuments.slice().sort((a, b) => b.tier - a.tier || b.year - a.year) : []).map(m => row(m.tier === 3 ? "★" : "▲", m.name, `${["", "Monument", "Great work", "Wonder"][m.tier]} · ${S.states[m.realm] ? esc(S.states[m.realm].name) : ""} · ${m.year}`, "", () => openCodex({ kind: "monument", id: m.id })));
  else if (tab === "people" && !H) rows = S.states.map((s, i) => row(armsSvg(armsOf(w, i), 22), Y.realms[i].ruler, `Ruler of ${esc(s.name)}`, "", () => openCodex({ kind: "realm", id: i, tab: "figures" })));
  else if (tab === "people") rows = (H ? H.people.filter(p => p.alive && (p.role === "ruler" || p.fame >= 2)).sort((a, b) => b.fame - a.fame) : []).slice(0, 200).map(p => row("•", p.name + (p.epithet ? " " + p.epithet : ""), `${esc(p.role)} of ${S.states[p.realm] ? esc(S.states[p.realm].name) : ""} · age ${p.age}`, p.fame ? `fame ${p.fame}` : "", () => openCodex({ kind: "realm", id: p.realm, tab: "figures" })));
  else if (tab === "zones" && E) rows = E.zones.slice().sort((a, b) => b.area - a.area).map(z => row(`<span class="sw" style="background:${BIOMES[z.biome].c}"></span>`, z.name, `${esc(BIOMES[z.biome].n)} · ${fmt(z.area)} km²`, z.hostile.length ? "monsters" : "", () => openZone(z.id)));
  else if (tab === "seas" && E) rows = E.marine.zones.slice().sort((a, b) => b.area - a.area).map(z => row(`<span class="sw" style="background:rgb(${MARINE_RGB[z.key].join(",")})"></span>`, z.name, `${fmt(z.area)} km²${z.monster ? " · " + esc(z.monster.n) : ""}`, "", () => openCodex({ kind: "sea", id: z.id })));
  void R;
  const empty = { history: "Nothing has happened yet. Start the clock (the 1mo or 1yr speed is quickest) and history will be written here.", wars: "The world is at peace.", wonders: "Nothing has been built yet. Run the clock (1yr is quickest) and realms will raise monuments and wonders.", people: "Run the clock to bring people to life." }[tab] || "Nothing here.";
  return rows.length ? `<input class="atlasfilter" id="atlasFilter" type="search" placeholder="Filter this list…" aria-label="Filter the list"><div class="atlaslist">${rows.join("")}</div>` : `<p class="note">${empty}</p>`;
}
codex.addEventListener("click", ev => { const b = ev.target.closest("[data-atlas]"); if (b) { const go = atlasGo[+b.dataset.atlas]; if (go) go(); } });
codex.addEventListener("input", ev => {
  if (ev.target.id !== "atlasFilter") return;
  const q = norm(ev.target.value);
  codex.querySelectorAll(".atlasrow").forEach(r => { r.hidden = !!q && !norm(r.textContent).includes(q); });
});

// storylines unfolding in the history layer, each with the path it has taken so far
function storylinesPage(tab) {
  const w = app.world, H = w.H;
  if (!H || !H.stories) return `<p class="note">Storylines begin once history runs: start the clock (the 1mo and 1yr speeds are quickest). Each one unfolds over months or years, and which way it goes depends on the world at the time.</p>`;
  const list = H.stories.filter(s => tab === "live" ? !s.done : s.done && s.ending !== "faded").slice().reverse().slice(0, 60);
  const cal = w.Y.calendar, yr = m => cal.year + Math.floor(m / cal.months.length);
  if (!list.length) return `<p>${tab === "live" ? "No storylines are unfolding right now." : "No storyline has ended yet."}</p>`;
  return list.map(s => `<div class="story ${s.scale === "world" ? "big" : s.scale === "realm" ? "medium" : ""}"><div class="scale">${s.scale === "world" ? "World" : s.scale === "realm" ? "Realm" : "Local"} storyline · ${esc(w.S.states[s.realm] ? w.S.states[s.realm].name : "")} · since ${yr(s.started)}${s.done ? " · concluded" : ""}</div>
    <b>${esc(s.title)}</b>
    <ol class="timeline" style="margin-top:6px">${s.log.map(e => `<li><b>${yr(e.month)}</b><span><i>${esc(e.h)}</i>. ${esc(e.b)}</span></li>`).join("")}</ol>
    ${s.done ? "" : `<p class="note">What happens next depends on how things stand in ${esc(w.S.states[s.realm] ? w.S.states[s.realm].short : "the realm")}.</p>`}<a href="#" data-prov="${s.prov}">Go there</a></div>`).join("");
}
function openMarket(h, compare) { openCodex({ kind: "market", id: h, compare }); }
function openZone(z) { if (z >= 0) openCodex({ kind: "zone", id: z }); }
function monumentAt(mx, my) {
  const w = app.world; if (!w.H) return null;
  const v = app.view; let best = null, bd = 12;
  for (const m of w.H.monuments) { let px = m.x * v.k + v.ox; const Wk = W * v.k; px = ((px % Wk) + Wk) % Wk; if (px > app.cw + 20) px -= Wk; const d = Math.hypot(px - mx, m.y * v.k + v.oy - my); if (d < bd && (m.tier >= 2 || v.k / app.fitK > 4)) { bd = d; best = m; } }
  return best;
}
function hubAt(mx, my) {
  const G = app.world, v = app.view; let best = -1, bd = 14;
  for (const h of G.Q.hubs) {
    const s = G.X.settlements[h]; let px = s.x * v.k + v.ox; const Wk = W * v.k; px = ((px % Wk) + Wk) % Wk; if (px > app.cw + 20) px -= Wk;
    const d = Math.hypot(px - mx, s.y * v.k + v.oy - my); if (d < bd) { bd = d; best = h; }
  }
  return best;
}
$("#cxClose").onclick = () => { codex.hidden = true; cxState = null; };
$("#cxTabs").addEventListener("click", ev => { const b = ev.target.closest("button[data-tab]"); if (b && cxState) openCodex({ ...cxState, tab: b.dataset.tab, focus: null }); });
$("#storiesBtn").onclick = () => { if (app.world) openCodex({ kind: "stories" }); };
$("#journalBtn").onclick = () => { if (app.world) openCodex({ kind: "journal" }); };
codex.addEventListener("change", ev => { if (ev.target.id === "jGod") { setGod(app.world, ev.target.checked); openCodex({ ...cxState, keepScroll: true }); frame(true); } });
// reading a place of knowledge, or studying a site, from a province card
insp.addEventListener("click", ev => {
  const r = ev.target.closest("[data-read]"), s = ev.target.closest("[data-study]");
  if (!r && !s) return;
  ev.preventDefault();
  const pid = app.ui.sel && app.ui.sel.prov;
  if (r) readHolder(app.world, +r.dataset.read);
  if (s) { const res = studySite(app.world, +s.dataset.study); if (!res.ok && res.need) { const m = insp.querySelector("#studymsg" + s.dataset.study); if (m) m.textContent = " You need " + res.need + " first."; return; } }
  if (app.ui.holder != null && !insp.hidden && insp.querySelector(".holder")) { const keep = insp.scrollTop; showHolder(app.ui.holder); insp.scrollTop = keep; }
  else if (pid != null) { const keep = insp.scrollTop; showCell(app.world.R.provs[pid].heart); insp.scrollTop = keep; }
  frame(true);
});
$("#newsBtn").onclick = () => { if (app.world) openCodex({ kind: "news" }); };
$("#ticker").onclick = () => { if (app.world) openCodex({ kind: "news" }); };
// links inside the codex and the inspector
function onLink(ev) {
  const a = ev.target.closest("[data-goto],[data-prov],[data-realm],[data-market],[data-zone],[data-story],[data-codex-realm]"); if (!a) return;
  ev.preventDefault();
  const d = a.dataset;
  if (d.codexRealm) openCodex({ kind: "realm", id: +d.codexRealm });
  else if (d.realm) openCodex({ kind: "realm", id: +d.realm });
  else if (d.market) openMarket(+d.market);
  else if (d.zone) openZone(+d.zone);
  else if (d.story) { const x = storiesFor(app.world).get(d.story); if (x) openCodex({ kind: "stories", tab: x.scale, focus: x.id }); requestAnimationFrame(() => { const el = document.getElementById("st-" + d.story.replace(/[^\w-]/g, "_")); if (el) el.scrollIntoView({ block: "center" }); }); }
  else if (d.prov) { codex.hidden = true; zoomToProvince(+d.prov, true); showCell(app.world.R.provs[+d.prov].heart); }
  else if (d.goto) { const [x, y] = d.goto.split(",").map(Number); codex.hidden = true; zoomTo(x, y, 0.03); }
}
codex.addEventListener("click", onLink);
insp.addEventListener("click", onLink);
$("#legend").addEventListener("click", onLink);
codex.addEventListener("change", ev => { const sel = ev.target.closest("select[data-compare]"); if (sel) openMarket(+sel.dataset.compare, sel.value === "" ? undefined : +sel.value); });

/* ---------------- clock and calendar ---------------- */
app.clock = makeClock();
app.night = makeNight();
app.darkAt = (wx, wy) => app.world && app.ui.layers.night ? darkness(sunAlt(app.world.Y.calendar, app.clock.t, wx, wy)) : 0;
const SPEED_LABEL = ["❚❚", "1×", "1m", "1h", "1d", "1mo", "1yr"];
$("#clockSpeeds").innerHTML = SPEEDS.map((sp, i) => `<button data-i="${i}" title="${sp.n}" aria-label="${sp.n}" aria-pressed="${i === app.clock.speed}">${SPEED_LABEL[i]}</button>`).join("");
$("#clockSpeeds").addEventListener("click", ev => {
  const b = ev.target.closest("button"); if (!b) return;
  app.clock.speed = +b.dataset.i;
  document.querySelectorAll("#clockSpeeds button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
});
let clockKey = "";
function localNow() {
  const wx = worldX(app.cw / 2), t = app.clock.t + (wx / W - 0.5) * 1440;
  return dateOf(app.world.Y.calendar, t);
}
function updateClock() {
  if (!app.world) return;
  const cal = app.world.Y.calendar, d = localNow(), mm = Math.floor(d.minute);
  const key = d.year + ":" + d.doy + ":" + mm;
  if (key === clockKey) return; clockKey = key;
  $("#clock").hidden = false;
  $("#clockTime").textContent = `${String(Math.floor(mm / 60)).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`;
  const moons = cal.moons.map(m => phaseName(moonPhase(m, d.totalDays)).toLowerCase()).join(", ");
  $("#clockDay").textContent = `${d.weekday}, ${ordinal(d.day)} of ${cal.months[d.month].name}, ${d.year} ${cal.eraShort} · ${cal.moons.length > 1 ? "moons" : "moon"} ${moons}`;
}
function showCalendar() {
  const cal = app.world.Y.calendar, d = localNow(), Y = app.world.Y;
  const fest = new Map(); for (const f of Y.faiths) for (const x of f.festivals) { const k = x.month; if (!fest.has(k)) fest.set(k, []); fest.get(k).push(`${x.name} (${ordinal(x.day)}, ${f.name})`); }
  insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(cal.era)}</h3>
    <div class="sub">Year ${d.year} · ${cal.yearDays} days in ${cal.months.length} months · ${cal.weekdays.length}-day weeks</div>
    <div class="cal">${cal.months.map((m, i) => `<div class="${i === d.month ? "now" : ""}" title="${esc((fest.get(i) || []).join("; "))}"><b>${esc(m.name)}</b><small>${m.days} days · ${m.season}${fest.has(i) ? " · " + fest.get(i).length + " feast" + (fest.get(i).length > 1 ? "s" : "") : ""}</small></div>`).join("")}</div>
    <h4>Days of the week</h4><div class="sub">${cal.weekdays.map(esc).join(" · ")}</div>
    <h4>${cal.moons.length > 1 ? "Moons" : "The moon"}</h4><dl class="kv">${cal.moons.map(m => `<dt>${esc(m.name)}</dt><dd>${phaseName(moonPhase(m, d.totalDays))} · ${m.period}-day cycle</dd>`).join("")}</dl>
    <h4>Feasts this month</h4><div class="sub">${esc((fest.get(d.month) || ["None"]).join("; "))}</div>
    <p class="note">The clock shows local sun time at the middle of the screen. Pan east and the day moves on. The axial tilt is ${cal.tilt}°, so the seasons change the length of the day.</p>`;
  insp.hidden = false;
  insp.querySelector(".close").onclick = () => { insp.hidden = true; };
}
$("#clockDate").onclick = () => { if (app.world) showCalendar(); };
/* ---------------- the history layer ---------------- */
// The clock drives history: every new month is sent to the worker, which moves the world forward
// and sends back what changed. The generated world is never regenerated; history only adds to it.
const hist = { month: 0, pending: false, world: 0, lastRebuild: 0, rebuild: false };
function clockMonth() {
  const cal = app.world.Y.calendar, d0 = dateOf(cal, 0), d = dateOf(cal, app.clock.t);
  return (d.year - d0.year) * cal.months.length + d.month - d0.month;
}
function pumpHistory() {
  if (!app.world || busy || hist.pending) return;
  const target = clockMonth();
  if (target <= hist.month) return;
  hist.pending = true;
  worker.postMessage({ type: "sim", id: "h" + reqId, to: target });
}
function applyHistory(v) {
  hist.pending = false;
  const w = app.world; if (!w || hist.world !== reqId) return;
  hist.month = v.month; w.H = v.H; w.Hdate = v.date;
  let own = v.S.states.length !== w.S.states.length;
  if (!own) for (let p = 0; p < v.S.own.length; p++) if (v.S.own[p] !== w.S.own[p]) { own = true; break; }
  w.S.own = v.S.own; w.S.states = v.S.states;
  for (const i of w.R.land) w.S.cellState[i] = w.S.own[w.R.owner[i]];
  w.Y.realms = v.Y.realms; w.Y.relations = v.Y.relations;
  const st = w.X.settlements;
  for (let i = 0; i < Math.min(st.length, v.X.n); i++) { st[i].pop = v.X.pops[i]; st[i].tier = v.X.tiers[i]; st[i].abandoned = !!v.X.gone[i]; st[i].capital = !!v.X.caps[i]; }
  if (v.X.added) for (const s of v.X.added) if (!st.some(t => t.id === s.id)) st.push(s);
  if (v.X.roadSegs) { w.X.roadSegs = v.X.roadSegs; w.X.roadCount = v.X.roadCount; const have = w.X.roads.length; for (const r of v.X.roads) if (!w.X.roads.some(q => q.a === r.a && q.b === r.b)) w.X.roads.push(r); if (w.X.roads.length !== have) own = true; }
  if (v.Z) { Object.assign(w.Z, v.Z); app.life.reset(w); }
  if (v.L && w.L) { w.L.holders = v.L.holders; w.L.frags = v.L.frags; w.L.sites = v.L.sites; journalReindex(); }
  if (v.E) { w.E.zones = v.E.zones; w.E.marine.zones = v.E.marineZones; app.wild.reset(w); hist.rebuild = true; }
  delete w.__byTier;
  w.news.push(...v.news); if (w.news.length > 3000) w.news.splice(0, w.news.length - 3000);
  showTicker(v.news);
  if (own || v.news.length) searchIndex = null;
  clearCodexCache(); clearScienceCache();
  if (own || v.flags.towns) hist.rebuild = true;
  if (hist.rebuild && performance.now() - hist.lastRebuild > 1200) {
    hist.rebuild = false; hist.lastRebuild = performance.now();
    computeEdges(); computeColors(); computeRegionLabels(); buildWorldCache(); invalidateView();
    buildLegend();
  }
  frame(false); updateClock();
  if (cxState && (cxState.kind === "news" || (cxState.kind === "realm" && (cxState.tab === "chronicle" || cxState.tab === "overview" || cxState.tab === "figures")))) openCodex({ ...cxState, keepScroll: true });
  pumpHistory();
}
// the latest big headline, briefly, over the map
let tickerTimer = 0;
function showTicker(items) {
  const follow = followRealm();
  const it = [...items].reverse().find(n => n.imp >= 3 || (follow >= 0 && n.realms.includes(follow) && n.imp >= 2));
  if (!it) return;
  const el = $("#ticker"); el.innerHTML = `<small>${it.year} ${esc(it.mon)}</small> ${esc(it.h)}`; el.hidden = false; el.dataset.id = it.id;
  clearTimeout(tickerTimer); tickerTimer = setTimeout(() => { el.hidden = true; }, 7000);
}
const followRealm = () => { const s = $("#newsFollow"); return s ? +s.value : newsFilter.follow; };
const newsFilter = { level: 2, follow: -1, kind: "all" };
const NEWS_GROUPS = { all: null, war: ["war_declared", "battle_won", "battle_draw", "siege_started", "siege_fallen", "siege_lifted", "peace_signed", "province_ceded", "white_peace", "great_commander"],
  politics: ["alliance_formed", "alliance_broken", "rivalry_declared", "trade_deal", "embargo", "royal_marriage", "ruler_died", "ruler_abdicated", "succession", "election", "succession_crisis", "coronation", "revolt", "revolution", "rebels_crushed", "independence", "spy_caught", "tech_stolen", "assassination", "unrest_rising", "diplomat_mission", "treasury_crisis"],
  progress: ["discovery", "institution_founded", "great_scholar", "project_started", "project_completed", "monument_completed", "wonder_completed", "road_built", "town_founded", "town_grew"],
  world: ["plague", "famine", "earthquake", "titan_rampage", "mystery_stirs", "heresy", "festival", "town_declined", "town_abandoned", "treatise", "excavation", "revelation", "press_burned"] };
function newsPage() {
  const w = app.world, S = w.S;
  const realms = S.states.map((s, i) => [i, s.name]).filter(([i]) => !(w.H && w.H.realm[i] && w.H.realm[i].dead)).sort((a, b) => a[1].localeCompare(b[1]));
  const g = NEWS_GROUPS[newsFilter.kind];
  const list = (w.news || []).filter(n => (newsFilter.follow < 0 || n.realms.includes(newsFilter.follow)) && (n.imp >= newsFilter.level || (newsFilter.follow >= 0 && n.imp >= 1)) && (!g || g.includes(n.kind))).slice(-150).reverse();
  const d = w.Hdate;
  return `<div class="newsbar"><label>Show <select id="newsLevel"><option value="3"${newsFilter.level === 3 ? " selected" : ""}>World events</option><option value="2"${newsFilter.level === 2 ? " selected" : ""}>Important</option><option value="1"${newsFilter.level === 1 ? " selected" : ""}>Everything</option></select></label>
    <label>About <select id="newsKind">${Object.keys(NEWS_GROUPS).map(k => `<option value="${k}"${newsFilter.kind === k ? " selected" : ""}>${{ all: "Everything", war: "War", politics: "Politics", progress: "Progress", world: "The world" }[k]}</option>`).join("")}</select></label>
    <label>Follow <select id="newsFollow"><option value="-1">Every realm</option>${realms.map(([i, n]) => `<option value="${i}"${newsFilter.follow === i ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></label></div>
    ${d ? "" : `<p class="note">History starts when the clock runs. The month and year speeds (1mo, 1yr) make it move quickly.</p>`}
    ${list.map(n => `<div class="newsitem imp${n.imp}"><small>${n.year} ${esc(n.mon)}</small><b>${esc(n.h)}</b><span>${esc(n.b)}</span>${n.prov >= 0 ? `<a href="#" data-prov="${n.prov}">Go there</a>` : ""}</div>`).join("") || (d ? "<p>Nothing yet with these filters.</p>" : "")}`;
}
codex.addEventListener("change", ev => {
  const t = ev.target;
  if (t.id === "newsLevel") newsFilter.level = +t.value; else if (t.id === "newsFollow") newsFilter.follow = +t.value; else if (t.id === "newsKind") newsFilter.kind = t.value; else return;
  openCodex({ kind: "news" });
});

// the animation loop: fast while things move on screen, slow otherwise
let lastTs = 0, slowAcc = 0;
function loop(ts) {
  const dt = lastTs ? Math.min(250, ts - lastTs) : 16; lastTs = ts;
  if (app.world && !busy && tick(app.clock, dt)) {
    slowAcc += dt;
    const v = app.view, fast = app.life.busy(v) || app.street.active(v);
    pumpHistory();
    if (fast || slowAcc > 200) {
      slowAcc = 0;
      app.night.update(app.world.Y.calendar, app.clock.t);
      frame(false); updateClock();
    }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------------- sidebar stats + legend ---------------- */
function updateStats(genMs, drawMs) {
  const G = app.world, { M, R, S, F } = G, kmPx = G.worldKm / W;
  const rows = [
    ["World size", `${fmt(G.worldKm)} × ${fmt(G.worldKm * H / W)} km`],
    ["Land area", `${fmt(R.land.length * M.cellArea * kmPx * kmPx / 1e6)} M km²`],
    ["Continents", R.contCount], ["Continent shapes", G.T.contShapes.join(", ")], ["Named islands", R.masses.filter(m => !m.continent && m.name).length],
    ["Provinces", fmt(R.provs.length)], ["Realms", S.states.length],
    ["Mountain ranges", R.ranges.length], ["Named rivers", R.rivers.length], ["Lakes & inland seas", R.bodies.filter(b => b.lake).length],
    ["Titans", F.titans.length], ["Hostile zones", F.hostRegions.length], ["Mystery sites", F.sites.length], ["Volcanoes", F.volcanoes.length],
    ["Cultures", G.Y.cultures.length], ["Faiths", G.Y.faiths.length], ["Wars", G.Z.wars.length], ["Armies in the field", G.Z.armies.length], ["Fleets", G.Z.fleets.length],
    ["Trade links", fmt(G.Q.routes.length)], ["Markets", G.Q.hubs.length],
    ["Map cells", fmt(M.N)], ["Generated in", `${fmt(genMs)} ms`], ["Drawn in", `${fmt(drawMs)} ms`],
  ];
  $("#stats").innerHTML = rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("");
}
function buildLegend() {
  const G = app.world; if (!G) return;
  const { C, R, F, S } = G, ui = app.ui, mode = ui.mode, parts = [];
  const hatchCss = (c, cross) => `background:repeating-linear-gradient(45deg,${c} 0 1.5px,transparent 1.5px 5px)${cross ? `,repeating-linear-gradient(-45deg,${c} 0 1.5px,transparent 1.5px 5px)` : ""}`;
  if (mode === "biome" || mode === "terrain") {
    const counts = new Map(); for (const i of R.land) counts.set(C.biome[i], (counts.get(C.biome[i]) || 0) + 1);
    const list = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    parts.push(`<h5>Biomes</h5>` + list.map(([b]) => `<div class="li"><span class="sw" style="background:${BIOMES[b].c}"></span>${BIOMES[b].n}</div>`).join(""));
    if (ui.layers.mysteries) {
      const sp = new Set(F.special.filter(v => v));
      if (sp.size) parts.push(`<div class="sep"></div><h5>Strange lands</h5>` + [...sp].map(t => `<div class="li"><span class="sw" style="background:${SPECIAL[t].c}"></span>${SPECIAL[t].n}</div>`).join(""));
    }
  } else if (mode === "height") {
    const elevStr = e => fmt(elev(e));
    parts.push(`<h5>Elevation</h5><div class="bar" style="background:linear-gradient(90deg,${HYPSO.map(([t, c]) => `rgb(${c.join(",")}) ${t * 100}%`).join(",")})"></div><div class="barlab"><span>0 m</span><span>${elevStr(0.5)}</span><span>${elevStr(1)} m</span></div>`);
    parts.push(`<h5 style="margin-top:10px">Ocean depth</h5><div class="bar" style="background:linear-gradient(90deg,#b9d9e6,#16344f)"></div><div class="barlab"><span>0 m</span><span>6,000 m</span></div>`);
  } else if (mode === "culture" || mode === "faith") {
    const list = (mode === "culture" ? G.Y.cultures : G.Y.faiths).slice().sort((a, b) => b.provs - a.provs);
    const rgb = c => `rgb(${c.map(Math.round).join(",")})`;
    parts.push(`<h5>${mode === "culture" ? "Cultures" : "Faiths"}</h5>` + list.slice(0, 16).map(c => `<div class="li"><span class="sw" style="background:${rgb(c.rgb)}"></span>${esc(mode === "culture" ? c.adj : c.name)}</div>`).join("") + (list.length > 16 ? `<div class="li">and ${list.length - 16} more</div>` : ""));
  } else if (mode === "ecology" && G.E) {
    const counts = new Map(); for (const z of G.E.zones) counts.set(z.biome, (counts.get(z.biome) || 0) + 1);
    parts.push(`<h5>Ecological zones</h5><div class="li">${G.E.zones.length} on land, ${G.E.marine.zones.length} at sea. Click one to see what lives there.</div>` + [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([b, n]) => `<div class="li"><span class="sw" style="background:${BIOMES[b].c}"></span>${BIOMES[b].n} · ${n}</div>`).join(""));
    const mk = new Map(); for (const z of G.E.marine.zones) mk.set(z.key, (mk.get(z.key) || 0) + 1);
    const MN = { shelf: "Coastal shelf", reef: "Coral reef", kelp: "Kelp forest", lagoon: "Lagoon", estuary: "Estuary", open: "Open ocean", abyss: "Abyss", polar: "Polar sea" };
    parts.push(`<div class="sep"></div><h5>Seas</h5>` + [...mk.entries()].map(([k, n]) => `<div class="li"><span class="sw" style="background:rgb(${MARINE_RGB[k].join(",")})"></span>${MN[k]} · ${n}</div>`).join("") + `<div class="li"><span class="sw" style="background:repeating-linear-gradient(45deg,#963232 0 2px,transparent 2px 5px)"></span>Monster waters</div>`);
  } else if (mode === "trade") {
    const Q = G.Q;
    parts.push(`<h5>Trade</h5><div class="li"><span class="sw" style="background:#7a4a22;height:4px"></span>Road trade</div><div class="li"><span class="sw" style="background:repeating-linear-gradient(90deg,#2f5f86 0 5px,transparent 5px 8px);height:4px"></span>Sea lane</div><div class="li"><span class="sw" style="background:#b07c12;height:4px"></span>Named trade route</div><div class="li"><span class="sw" style="background:#f0c85a;border-radius:50%"></span>Market, sized by trade</div>`);
    parts.push(`<div class="sep"></div><h5>Great routes</h5>` + Q.named.map(n => `<div class="li">${esc(n.name)} · ${fmt(n.km)} km</div>`).join(""));
    parts.push(`<div class="sep"></div><h5>Largest markets</h5>` + Q.hubs.slice(0, 10).map(h => `<div class="li"><a href="#" data-market="${h}">${esc(G.X.settlements[h].name)}</a></div>`).join("") + `<div class="li">Click any market circle on the map.</div>`);
  } else if (mode === "conflict") {
    const Z = G.Z;
    parts.push(`<h5>Wars (${Z.wars.length})</h5>` + (Z.wars.length ? Z.wars.slice(0, 8).map(w => `<div class="li" style="display:block;line-height:1.35;margin-bottom:5px"><b>${esc(w.name)}</b><br>${w.attackers.map(a => esc(Z.actors[a].name)).join(", ")} against ${w.defenders.map(a => esc(Z.actors[a].name)).join(", ")}</div>`).join("") + (Z.wars.length > 8 ? `<div class="li">and ${Z.wars.length - 8} more (click a realm to see its wars)</div>` : "") : `<div class="li">The world is at peace.</div>`));
    parts.push(`<div class="sep"></div><div class="li"><span class="sw" style="background:#8e1b12;height:4px"></span>Front line</div><div class="li"><span class="sw" style="background:repeating-linear-gradient(45deg,#7a4030 0 2px,transparent 2px 5px)"></span>Occupied land</div><div class="li">Grey: realms at peace</div>`);
  } else {
    parts.push(`<h5>Realms</h5><div class="li">${S.states.length} realms, colored so neighbors differ</div><div class="li"><span class="sw" style="background:${UNCLAIMED}"></span>Unclaimed ice</div>`);
  }
  const f = [];
  if (ui.layers.wildlife) for (let t = 1; t <= 3; t++) f.push(`<div class="li"><span class="sw" style="${hatchCss(HOSTILE_COL[t])}"></span>Hostile wildlife: ${TIER_NAME[t]}</div>`);
  if (ui.layers.titans) f.push(`<div class="li"><span class="sw" style="${hatchCss("#6b2f86", true)}"></span>Titan domain</div>`);
  if (ui.layers.mysteries) f.push(`<div class="li"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M7.5 1 12 7.5 7.5 14 3 7.5Z" fill="#f2c75a" stroke="#3b2a10" stroke-width="1.3"/></svg>Mystery site</div>`);
  f.push(`<div class="li"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M7.5 3 13.5 13 1.5 13Z" fill="#5a3326"/><circle cx="7.5" cy="3" r="2.3" fill="#f06a2a"/></svg>Volcano</div>`);
  parts.push(`<div class="sep"></div><h5>Wilds & wonders</h5>` + f.join(""));
  $("#legend").innerHTML = parts.join("");
}

/* ---------------- detail levels, streamed onto the world map: region land, then towns ---------------- */
app.chunks = makeChunkLayer(app, req => sendDetail({ type: "chunk", ...req }), () => requestRedraw());
app.towns = makeTownLayer(app, req => sendDetail({ type: "townchunk", ...req }, req.sid), () => requestRedraw());
app.life = makeLifeLayer(app);
app.wild = makeWildlife(app);
app.street = makeStreetLayer(app);
let redrawQueued = false;
function requestRedraw() {
  if (redrawQueued) return; redrawQueued = true;
  // animation frame when visible; the timeout covers background tabs, where frames are paused
  const run = () => { if (!redrawQueued) return; redrawQueued = false; frame(false); app.towns.update(); updateDetailStatus(); updateTownLegend(); };
  requestAnimationFrame(run); setTimeout(run, 50);
}
function updateDetailStatus() {
  const el = $("#detailStatus"); if (!el || !app.world) return;
  const v = app.view, st = app.chunks.stats(), land = app.chunks.active(v), towns = app.towns.active(v);
  el.hidden = !land;
  if (!land) return;
  const busyLand = st.pending + st.queued, busyTowns = towns ? app.towns.busy() : 0;
  el.textContent = busyLand ? `Loading land detail… ${busyLand} areas to go`
    : busyTowns ? `Building towns… ${busyTowns} to go`
    : app.street.active(v) ? "Street level" : towns ? "Town detail" : `Land detail · ${["100", "25", "6", "1.6"][app.chunks.levelFor(v)]} m tiles`;
}
// at street level the legend shows the key for the town nearest the middle of the screen
let legendTown = null;
function updateTownLegend() {
  const t = app.world && app.towns.active(app.view) ? app.towns.nearest(app.view) : null;
  if ((t && t.sid) === (legendTown && legendTown.sid)) return;
  legendTown = t;
  if (!t) { buildLegend(); return; }
  const p = t.profile;
  $("#legend").innerHTML = `<h5>${esc(t.name)}</h5><div class="li">${t.tierName} · ${fmt(t.pop)} people · ${fmt(t.buildings)} buildings</div>` +
    `<div class="li">${esc(p.styleName)}</div><div class="li">${esc(p.layoutName)}</div><div class="li">${esc(p.fortName)}</div>` +
    `<div class="sep"></div><h5>Map key</h5>` + townLegend(t).map(([n, c]) => `<div class="li"><span class="sw" style="background:${c}"></span>${esc(n)}</div>`).join("");
}
function onDetail(m) {
  if (m.type === "chunk") { app.chunks.receive(m.id, m.chunk); app.towns.update(); updateDetailStatus(); return; }
  if (m.type === "townchunk") { app.towns.receive(m.id, m.chunk); updateDetailStatus(); return; }
  if (m.type === "error") (m.kind === "chunk" ? app.chunks : app.towns).failed(m.id);
  if (m.type === "error") console.warn("detail generation failed:", m.message);
}
function zoomToRect(x0, y0, x1, y1, minK) {
  const k = Math.max(Math.min(app.cw / (x1 - x0), app.ch / (y1 - y0)) * 0.9, minK);
  app.view.k = clamp(k, app.fitK, maxZoom()); app.view.ox = app.cw / 2 - (x0 + x1) / 2 * app.view.k; app.view.oy = app.ch / 2 - (y0 + y1) / 2 * app.view.k;
  normaliseView();
  insp.hidden = true; app.ui.sel = null; app.towns.clearSelection();
  draw(true);
}
// zoom the world map onto a province, far enough in that the detailed land streams in
function zoomToProvince(prov, keep) {
  const M = app.world.M, pr = app.world.R.provs[prov];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of pr.cells) for (let v = M.polyStart[c]; v < M.polyStart[c + 1]; v++) {
    const vx = M.polyXY[2 * v], vy = M.polyXY[2 * v + 1];
    x0 = Math.min(x0, vx); x1 = Math.max(x1, vx); y0 = Math.min(y0, vy); y1 = Math.max(y1, vy);
  }
  zoomToRect(x0, y0, x1, y1, keep ? app.fitK * 3 : 1.1 * 0.75 / app.chunks.tw());
}
// zoom onto a settlement until its streets are visible
function zoomToTown(s) {
  const r = (s.rKm * 1.3 + 0.2) / (app.world.worldKm / W);
  zoomToRect(s.x - r, s.y - r, s.x + r, s.y + r, 0.3 / app.towns.tileW());
}
const elevM = e => Math.round(Math.pow(Math.max(0, e), 1.6) * 7400 / 10) * 10;
// hover and click on the detailed levels, most detailed first
function detailHover(mx, my) {
  const v = app.view, wx = worldX(mx), wy = (my - v.oy) / v.k;
  if (app.towns.active(v)) {
    const p = app.towns.pick(wx, wy);
    if (p) {
      const dn = DISTRICTS[p.district], where = dn && dn !== "Countryside" ? `${dn}, ${p.town.name}` : p.town.name;
      return p.lot ? `${p.lot.name} · ${Math.round(p.lot.w)} × ${Math.round(p.lot.d)} m · ${where}` : `${townTileName(p.tile)} · ${where}`;
    }
  }
  const s = app.chunks.settlementNear(mx, my, v);
  if (s) return `${s.name} · ${TIERS[s.tier].n}, ${fmt(s.pop)} people`;
  const stp = app.chunks.stopNear(mx, my, v);
  if (stp) return stopTitle(stp);
  const t = app.chunks.tileAt(wx, wy); if (!t) return null;
  const land = t.biome !== 255;
  return [regionGroundName(t.g), land ? BIOMES[t.biome].n : "", land ? `${fmt(elevM(t.elev))} m` : "", t.owner >= 0 ? app.world.R.provs[t.owner].name : ""].filter(Boolean).join(" · ");
}
function detailSelect(mx, my) {
  const v = app.view, wx = worldX(mx), wy = (my - v.oy) / v.k;
  app.towns.clearSelection();
  if (app.towns.active(v)) {
    const p = app.towns.pick(wx, wy);
    if (p && p.lot) {
      const b = p.lot, t = p.town, courtM2 = b.court ? Math.max(0, b.w - 7) * Math.max(0, b.d - 7) : 0;
      app.towns.select(p);
      insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(b.name)}</h3>
        <div class="sub">${esc(b.district)}, ${esc(t.name)} · building ${b.id}</div>
        <dl class="kv"><dt>Footprint</dt><dd class="num">${Math.round(b.w)} × ${Math.round(b.d)} m</dd>
        <dt>Floors</dt><dd class="num">${b.floors}</dd>
        <dt>Floor area</dt><dd class="num">${fmt((b.w * b.d - courtM2) * b.floors)} m²</dd>
        <dt>Plan</dt><dd>${b.court ? "Around a courtyard" : "Solid block"}</dd><dt>Style</dt><dd>${esc(t.profile.styleName)}</dd></dl>
        <p class="note">Interiors are the next zoom level. The building ID stays the same every time this town is generated.</p>`;
      insp.hidden = false;
      insp.querySelector(".close").onclick = () => { insp.hidden = true; app.towns.clearSelection(); frame(false); };
      frame(false);
      return true;
    }
    if (p) { insp.hidden = true; frame(false); return true; }
  }
  const stp = app.chunks.stopNear(mx, my, v);
  if (stp && !app.chunks.settlementNear(mx, my, v)) { showStop(stp); return true; }
  const s = app.chunks.settlementNear(mx, my, v); if (!s) return false;
  const tierName = TIERS[s.tier].n;
  insp.innerHTML = `<button class="close" aria-label="Close details">×</button><h3>${esc(s.name)}</h3>
    <div class="sub">${tierName}${s.capital ? " · realm capital" : ""} · ${esc(app.world.R.provs[s.prov].name)}</div>
    <button class="primary enter" id="zoomTown">Zoom into ${tierName.toLowerCase()}</button>
    <dl class="kv"><dt>People</dt><dd class="num">${fmt(s.pop)}</dd><dt>Built-up area</dt><dd class="num">${(Math.PI * s.rKm * s.rKm).toFixed(s.rKm < 0.3 ? 3 : 1)} km²</dd>
    <dt>Architecture</dt><dd>${esc(s.profile.styleName)}</dd><dt>Layout</dt><dd>${esc(s.profile.layoutName)}</dd>
    <dt>Defences</dt><dd>${esc(s.profile.fortName)}</dd><dt>Harbour</dt><dd>${s.port ? "Yes" : "No"}</dd></dl>`;
  insp.hidden = false;
  insp.querySelector("#zoomTown").onclick = () => zoomToTown(s);
  insp.querySelector(".close").onclick = () => { insp.hidden = true; };
  return true;
}

/* ---------------- wiring ---------------- */
function redrawStyle() { computeColors(); buildWorldCache(); invalidateView(); frame(true); buildLegend(); }
$("#modes").addEventListener("click", ev => {
  const b = ev.target.closest("button"); if (!b) return;
  app.ui.mode = b.dataset.mode;
  document.querySelectorAll("#modes button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
  if (app.world) redrawStyle();
});
for (const key of Object.keys(app.ui.layers)) {
  const el = $("#L-" + key);
  el.addEventListener("change", () => {
    app.ui.layers[key] = el.checked;
    if (!app.world) return;
    if (key === "labels" || key === "military" || key === "traffic" || key === "night" || key === "animals") { frame(true); return; }
    redrawStyle();
  });
}
/* ---------------- getting around: panels, search, where you are, keys ---------------- */
const store = { get: k => { try { return localStorage.getItem("wf:" + k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem("wf:" + k, v); } catch { /* storage may be blocked */ } } };
const legendWrap = $("#legendWrap");
function setLegend(open) { legendWrap.classList.toggle("closed", !open); $("#legendHead").setAttribute("aria-expanded", String(open)); store.set("legend", open ? "1" : "0"); }
$("#legendHead").onclick = () => setLegend(legendWrap.classList.contains("closed"));
setLegend(store.get("legend") != null ? store.get("legend") === "1" : window.matchMedia("(min-width: 861px)").matches);
function setSidebar(open) { $(".app").classList.toggle("nosidebar", !open); $("#sideToggle").setAttribute("aria-expanded", String(open)); store.set("side", open ? "1" : "0"); }
$("#sideToggle").onclick = () => setSidebar($(".app").classList.contains("nosidebar"));
if (store.get("side") === "0") setSidebar(false);
// the layers menu
const layersMenu = $("#layers");
function setLayers(open) { layersMenu.hidden = !open; $("#layersBtn").setAttribute("aria-expanded", String(open)); }
$("#layersBtn").onclick = ev => { ev.stopPropagation(); setLayers(layersMenu.hidden); };
document.addEventListener("click", ev => { if (!layersMenu.hidden && !ev.target.closest(".pop")) setLayers(false); if (!$("#searchResults").hidden && !ev.target.closest(".searchbox")) $("#searchResults").hidden = true; });
// help
$("#helpBtn").onclick = () => { $("#help").hidden = false; };
$("#helpClose").onclick = () => { $("#help").hidden = true; };
$("#help").addEventListener("click", ev => { if (ev.target.id === "help") $("#help").hidden = true; });
$("#atlasBtn").onclick = () => { if (app.world) openCodex({ kind: "atlas" }); };
// the empty map invites a first look


// Search: everything with a name, ranked so that a realm beats a province beats a town of the same name
let searchIndex = null;
function buildSearch() {
  const w = app.world, out = [], { S, R, X, Y, E, Z, H } = w;
  S.states.forEach((s, i) => { if (!(H && H.realm[i] && H.realm[i].dead)) out.push({ t: s.name, sub: `Realm · ${GOVT[Y.realms[i].gov].n}`, r: 0, go: () => { openCodex({ kind: "realm", id: i }); zoomToProvince(s.capital, true); } }); });
  for (const s of X.settlements) if ((s.tier >= 2 || s.capital) && !s.abandoned) out.push({ t: s.name, sub: `${TIERS[s.tier].n} · ${R.provs[s.prov].name}`, r: 1 + (4 - s.tier) * 0.1, go: () => zoomToTown({ ...s, rKm: Math.sqrt(s.pop / 9000 / Math.PI) }) });
  R.provs.forEach(p => out.push({ t: p.name, sub: `Province${S.own[p.id] >= 0 ? " of " + S.states[S.own[p.id]].short : ""}`, r: 2, go: () => { zoomToProvince(p.id, true); showCell(p.heart); } }));
  Y.cultures.forEach(c => out.push({ t: c.adj, sub: "Culture", r: 3, go: () => { setMode("culture"); const lb = w.regionLabels.culture.find(l => l.name === c.adj); if (lb) zoomTo(lb.x, lb.y, 0.0006); } }));
  Y.faiths.forEach(f => out.push({ t: f.name, sub: `Faith · ${f.typeName}`, r: 3, go: () => { setMode("faith"); const lb = w.regionLabels.faith.find(l => l.name === f.name); if (lb) zoomTo(lb.x, lb.y, 0.0006); } }));
  if (E) { E.zones.forEach(z => out.push({ t: z.name, sub: `Wild land · ${BIOMES[z.biome].n}`, r: 4, go: () => openZone(z.id) })); E.marine.zones.forEach(z => out.push({ t: z.name, sub: z.monster ? `Sea · ${z.monster.n}` : "Sea", r: 4, go: () => openCodex({ kind: "sea", id: z.id }) })); }
  for (const b of R.bodies) if (b.name) out.push({ t: b.name, sub: b.kind || "Water", r: 4, go: () => zoomTo(b.x, b.y, 0.0005) });
  for (const r of R.ranges) out.push({ t: r.name, sub: "Mountain range", r: 4, go: () => zoomTo(w.M.x[r.cell], w.M.y[r.cell], 0.0008) });
  for (const s of w.F.sites) out.push({ t: s.name, sub: `Mystery · ${s.type}`, r: 4, go: () => { zoomToProvince(s.prov, true); showCell(s.cell); } });
  if (w.L) {
    for (const si of w.L.sites) if (siteLevel(w, si.id) >= 0) out.push({ t: si.name, sub: `Strange place · ${si.kind}`, r: 4, go: () => { zoomToProvince(si.prov, true); showCell(si.cell); } });
    for (const z of w.L.zones) out.push({ t: z.n, sub: "Marked land", r: 4, go: () => { zoomToProvince(z.provs[0], true); showCell(R.provs[z.provs[0]].heart); } });
  }
  for (const t of w.F.titans) out.push({ t: t.name, sub: "Titan", r: 3, go: () => zoomTo(w.M.x[t.heart], w.M.y[t.heart], 0.0006) });
  Z.wars.forEach(war => out.push({ t: war.name, sub: "War", r: 1, go: () => goWar(war) }));
  // armies, fleets and ships: zoom to where they are right now and open their card
  for (const m of app.life.findables()) out.push({ t: m.t, sub: m.sub, r: 3.5, go: () => { const [x, y] = m.pos(); codex.hidden = true; zoomTo(x, y, m.lp.kind === "ship" ? 0.02 : 0.004); showLife(m.lp); } });
  // animals and plants of the land and sea: open a zone where they live
  if (E) {
    const where = new Map();
    E.zones.forEach(z => { for (const id of z.fauna) { if (!where.has(id)) where.set(id, { land: [], sea: [] }); where.get(id).land.push(z.id); } });
    E.marine.zones.forEach(z => { for (const id of z.fauna) { if (!where.has(id)) where.set(id, { land: [], sea: [] }); where.get(id).sea.push(z.id); } });
    for (const [id, wz] of where) {
      const f = LOOKUP.fauna[id]; if (!f) continue;
      const n = wz.land.length + wz.sea.length;
      out.push({ t: f.n, sub: `Animal · lives in ${n} ${n > 1 ? "zones" : "zone"}`, r: 4, go: () => wz.land.length ? openZone(wz.land[0]) : openCodex({ kind: "sea", id: wz.sea[0] }) });
    }
  }
  // rulers, and the people of the world's mysteries once they are known
  S.states.forEach((s, i) => { if (!(H && H.realm[i] && H.realm[i].dead)) out.push({ t: Y.realms[i].ruler, sub: `Ruler of ${s.name}`, r: 2.5, go: () => openCodex({ kind: "realm", id: i, tab: "figures" }) }); });
  if (w.L && w.L.cast) for (const c of Object.values(w.L.cast).flatMap(o => Object.values(o))) if (journalFor(w).god || journalFor(w).read.has(c.holder)) out.push({ t: c.name, sub: `${c.n} · ${c.town}`, r: 3, go: () => openCodex({ kind: "journal", tab: "people" }) });
  // libraries, archives and temples that keep old texts, and markets
  if (w.L) for (const h of w.L.holders) if (["library", "archive", "temple"].includes(h.kind) && !h.burned) out.push({ t: h.name, sub: `${h.kind[0].toUpperCase() + h.kind.slice(1)} · ${R.provs[h.prov].name}`, r: 3.5, go: () => { zoomToProvince(h.prov, true); showHolder(h.id); } });
  for (const n of w.Q.named) out.push({ t: n.name, sub: "Trade route", r: 4, go: () => setMode("trade") });
  if (H) {
    for (const m of H.monuments) if (m.tier >= 2) out.push({ t: m.name, sub: ["", "Monument", "Great work", "Wonder"][m.tier], r: 3, go: () => openCodex({ kind: "monument", id: m.id }) });
    for (const p of H.people) if (p.alive && (p.role === "ruler" || p.fame >= 3)) out.push({ t: p.name + (p.epithet ? " " + p.epithet : ""), sub: `${p.role} · ${S.states[p.realm] ? S.states[p.realm].short : ""}`, r: 3, go: () => openCodex({ kind: "realm", id: p.realm, tab: "figures" }) });
    for (const s of H.stories || []) out.push({ t: s.title, sub: s.done ? "Storyline, concluded" : "Storyline", r: 3, go: () => openCodex({ kind: "stories", tab: s.done ? "ended" : "live" }) });
  }
  return out;
}
function goWar(war) {
  setMode("conflict");
  const f = app.world.Z.fronts.find(x => x.war === war.id);
  if (f) zoomTo(f.mx, f.my, 0.0012);
}
function setMode(m) {
  if (app.ui.mode === m) return;
  app.ui.mode = m;
  document.querySelectorAll("#modes button").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.mode === m)));
  redrawStyle();
}
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let searchHits = [], searchSel = 0;
function runSearch(q) {
  const box = $("#searchResults"); q = norm(q.trim());
  if (!q || !app.world) { box.hidden = true; return; }
  if (!searchIndex) searchIndex = buildSearch();
  const hits = [];
  for (const e of searchIndex) {
    const t = norm(e.t), at = t.indexOf(q); if (at < 0) continue;
    const word = at === 0 || t[at - 1] === " " || t[at - 1] === "'";
    hits.push([e, (at === 0 ? 0 : word ? 1 : 3) + e.r * 0.5 + t.length * 0.01]);
  }
  hits.sort((a, b) => a[1] - b[1]);
  searchHits = hits.slice(0, 12).map(h => h[0]); searchSel = 0;
  box.innerHTML = searchHits.length ? searchHits.map((e, i) => `<button role="option" data-i="${i}" aria-selected="${i === 0}"><b>${esc(e.t)}</b><small>${esc(e.sub)}</small></button>`).join("") : `<div class="note" style="padding:8px">Nothing called that.</div>`;
  box.hidden = false;
}
function pickSearch(i) { const e = searchHits[i]; if (!e) return; $("#searchResults").hidden = true; $("#search").blur(); e.go(); }
$("#search").addEventListener("input", ev => runSearch(ev.target.value));
$("#search").addEventListener("focus", ev => { if (ev.target.value) runSearch(ev.target.value); });
$("#search").addEventListener("keydown", ev => {
  const box = $("#searchResults");
  if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
    ev.preventDefault(); if (!searchHits.length) return;
    searchSel = (searchSel + (ev.key === "ArrowDown" ? 1 : -1) + searchHits.length) % searchHits.length;
    box.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-selected", String(i === searchSel)));
  } else if (ev.key === "Enter") { ev.preventDefault(); pickSearch(searchSel); }
  else if (ev.key === "Escape") { box.hidden = true; ev.target.blur(); }
});
$("#searchResults").addEventListener("click", ev => { const b = ev.target.closest("button[data-i]"); if (b) pickSearch(+b.dataset.i); });

// Where you are: world > continent > realm > province > town, at the middle of the screen
let crumbKey = "", crumbTimer = 0;
function updateCrumbs() {
  clearTimeout(crumbTimer);
  crumbTimer = setTimeout(() => {
    const w = app.world; if (!w) return;
    const v = app.view, i = cellAt(app.cw / 2, app.ch / 2), parts = [["world", "World"]];
    let p = -1;
    if (i >= 0 && w.T.type[i] === 0) {
      p = w.R.owner[i]; const pr = w.R.provs[p], m = w.R.masses[pr.mass], o = w.S.own[p];
      if (m && m.name) parts.push(["mass", m.name, pr.mass]);
      if (o >= 0) parts.push(["realm", w.S.states[o].name, o]);
      parts.push(["prov", pr.name, p]);
      const t = app.towns.active(v) ? app.towns.nearest(v) : null;
      if (t) parts.push(["town", t.name, t.sid]);
    } else if (i >= 0) {
      const b = w.R.bodies[w.R.waterName[i]]; parts.push(["water", b ? b.name : "Open sea"]);
    }
    const lvl = app.street.active(v) ? "Street" : app.towns.active(v) ? "Town" : app.chunks.active(v) ? `Land · ${["100", "25", "6", "1.6"][app.chunks.levelFor(v)]} m` : v.k / app.fitK < 1.6 ? "World" : "Region";
    const key = parts.map(x => x[1]).join("|") + lvl;
    if (key === crumbKey) return; crumbKey = key;
    $("#crumbs").innerHTML = parts.map((x, k) => `${k ? '<span class="sep">›</span>' : ""}<button data-c="${x[0]}" data-id="${x[2] ?? ""}" title="${x[0] === "realm" ? "Open this realm's codex" : x[0] === "world" ? "See the whole world" : "Go to " + esc(x[1])}">${esc(x[1])}</button>`).join("") + `<span class="lvl">${lvl}</span>`;
  }, 120);
}
$("#crumbs").addEventListener("click", ev => {
  const b = ev.target.closest("button[data-c]"); if (!b) return;
  const w = app.world, id = +b.dataset.id;
  if (b.dataset.c === "world") fitView();
  else if (b.dataset.c === "mass") { const m = w.R.masses[id], r = Math.sqrt(m.size * w.M.cellArea) * 0.7; zoomToRect(m.cx - r, m.cy - r, m.cx + r, m.cy + r, app.fitK); }
  else if (b.dataset.c === "realm") openCodex({ kind: "realm", id });
  else if (b.dataset.c === "prov") { zoomToProvince(id, true); showCell(w.R.provs[id].heart); }
  else if (b.dataset.c === "town") { const s = w.X.settlements.find(x => x.id === id); if (s) zoomToTown({ ...s, rKm: Math.sqrt(s.pop / 9000 / Math.PI) }); }
});

// keys
const MODE_KEYS = ["terrain", "biome", "height", "ecology", "political", "culture", "faith", "trade", "conflict"];
let lastSpeed = 2;
document.addEventListener("keydown", ev => {
  if (ev.target.closest && ev.target.closest("input, select, textarea")) return;
  if (ev.ctrlKey && ev.key.toLowerCase() === "k" || (!ev.ctrlKey && !ev.metaKey && ev.key === "/")) { ev.preventDefault(); $("#search").focus(); $("#search").select(); return; }
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const k = ev.key;
  if (k === "Escape") { $("#help").hidden = true; setLayers(false); if (!codex.hidden) { codex.hidden = true; cxState = null; } else { insp.hidden = true; app.ui.sel = null; app.towns.clearSelection(); frame(true); } return; }
  if (!app.world) return;
  if (k === " ") { ev.preventDefault(); const b = document.querySelectorAll("#clockSpeeds button"); if (app.clock.speed) { lastSpeed = app.clock.speed; b[0].click(); } else b[lastSpeed].click(); }
  else if (k >= "1" && k <= "9") setMode(MODE_KEYS[+k - 1]);
  else if (k === "0") fitView();
  else if (k === "+" || k === "=") zoomAt(app.cw / 2, app.ch / 2, 1.6);
  else if (k === "-" || k === "_") zoomAt(app.cw / 2, app.ch / 2, 1 / 1.6);
  else if (k === "l" || k === "L") setLayers(layersMenu.hidden);
  else if (k === "a" || k === "A") openCodex({ kind: "atlas" });
  else if (k === "c" || k === "C") openCodex({ kind: "news" });
  else if (k === "s" || k === "S") openCodex({ kind: "stories" });
  else if (k === "j" || k === "J") openCodex({ kind: "journal" });
  else if (k === "[") setSidebar($(".app").classList.contains("nosidebar"));
  else if (k === "?") $("#help").hidden = !$("#help").hidden;
});
$("#gen").onclick = () => { reroll(); request(0); };
$("#dice").onclick = () => { $("#seed").value = randomSeed(); reroll(); request(0); };
$("#seed").addEventListener("keydown", ev => { if (ev.key === "Enter") { reroll(); request(0); } });
$("#sizes").addEventListener("click", ev => {
  const b = ev.target.closest("button"); if (!b) return;
  provinces = +b.dataset.p; syncSizes(); reroll(); request(0);
});
$("#resetAuto").onclick = () => {
  const ids = Object.keys(manual); if (!ids.length) return;
  const stage = Math.min(...ids.map(id => PARAM_STAGE[id]));
  for (const id of ids) delete manual[id];
  syncControls(); queueGen(stage);
};

buildControls();
$("#seed").value = "aldermoor-17";
reroll();
resize();
new ResizeObserver(resize).observe(canvas);
request(0);
if (document.fonts) document.fonts.ready.then(() => frame(true));
window.__worldsinfinite = app; // handy for poking at the world from the dev console
// zoom onto a world point at a given scale in screen pixels per metre
function zoomTo(x, y, pxPerM) {
  const k = clamp(pxPerM * 1000 * app.world.worldKm / W, app.fitK, maxZoom());
  app.view.k = k; app.view.ox = app.cw / 2 - x * k; app.view.oy = app.ch / 2 - y * k; normaliseView(); draw(true);
}
app.debug = { zoomToProvince, zoomToTown, zoomTo };
