import "../content/premises/register.js";
import { clamp, makeRng } from "../core/util.js";
import { buildMesh } from "./mesh.js";
import { genTerrain } from "./terrain.js";
import { genClimate } from "./climate.js";
import { genRegions } from "./regions.js";
import { genStates } from "./states.js";
import { genFeatures } from "./features.js";
import { genSettlements } from "./settlements.js";
import { genSociety } from "./society.js";
import { genTrade } from "./trade.js";
import { genConflict } from "./conflict.js";
import { genEcology } from "./ecology.js";
import { genPremise, genLore, premiseView } from "./premise.js";

import { STAGES } from "./stages.js";
export { STAGES, PARAM_STAGE } from "./stages.js";

// Each stage depends only on the ones before it, so a slider change reruns from its stage onward.

export const cellCountFor = P => clamp(Math.round(P.provinces * 5.2 / Math.max(0.3, P.land / 100)), 14000, 300000);

export function resolveStart(prev, P, want) {
  if (!prev || prev.seed !== P.seed || prev.P.provinces !== P.provinces || prev.P.land !== P.land) return 0;
  return Math.max(0, Math.min(want, STAGES.length - 1));
}

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

export function runPipeline(prev, P, want, onStage = () => {}) {
  const seed = P.seed, from = resolveStart(prev, P, want);
  const G = from === 0 ? { seed, P, timings: {} } : { ...prev, P, timings: { ...prev.timings } };
  G.worldKm = Math.round(Math.sqrt(P.provinces) * 230); // needed by stages that sample in km
  const run = [
    () => { G.M = buildMesh(cellCountFor(P), makeRng(seed + "|mesh")); },
    () => { G.T = genTerrain(G.M, P, seed); },
    () => { G.C = genClimate(G.M, G.T, P, seed); },
    () => { G.R = genRegions(G.M, G.T, G.C, P, seed); },
    () => { G.W = genPremise(G, P, seed); },
    () => { G.S = genStates(G, P, seed); },
    () => { G.F = genFeatures(G, P, seed); },
    () => { G.X = genSettlements(G, P, seed); },
    () => { G.Y = genSociety(G, P, seed); },
    () => { G.L = genLore(G, P, seed); },
    () => { G.Q = genTrade(G, P, seed); },
    () => { G.Z = genConflict(G, P, seed); },
    () => { G.E = genEcology(G, P, seed); },
  ];
  for (let k = 0; k < run.length; k++) {
    if (k < from) { onStage(k, "cached", G.timings[STAGES[k].key] || 0); continue; }
    onStage(k, "start", 0);
    const t0 = now();
    run[k]();
    const ms = now() - t0;
    G.timings[STAGES[k].key] = ms;
    onStage(k, "done", ms);
  }
  G.worldKm = Math.round(Math.sqrt(P.provinces) * 230);
  G.from = from;
  return G;
}

// The main thread only needs what it draws and shows; closures (languages) stay in the worker.
export function toView(G) {
  const { M, T, C, R, S, F } = G;
  return {
    seed: G.seed, P: G.P, worldKm: G.worldKm, timings: G.timings, from: G.from,
    M,
    T: { e: T.e, depth: T.depth, type: T.type, filled: T.filled, coastDist: T.coastDist, shade: T.shade, contShapes: T.contShapes },
    C: { temp: C.temp, biome: C.biome, riverSegs: C.riverSegs, riverCount: C.riverCount },
    R: {
      owner: R.owner, provs: R.provs, masses: R.masses.map(({ lang, ...m }) => m), contCount: R.contCount,
      waterName: R.waterName, bodies: R.bodies, rivers: R.rivers, ranges: R.ranges, plats: R.plats, land: R.land,
    },
    S, F,
    X: { settlements: G.X.settlements, mainOf: G.X.mainOf, roadSegs: G.X.roadSegs, roadCount: G.X.roadCount, roads: G.X.roads.map(r => ({ a: r.a, b: r.b, cls: r.cls, cells: Int32Array.from(r.cells) })) },
    Y: {
      cultures: G.Y.cultures.map(({ lang, ...c }) => c), faiths: G.Y.faiths, cultureOf: G.Y.cultureOf, faithOf: G.Y.faithOf,
      realms: G.Y.realms, relations: G.Y.relations, calendar: G.Y.calendar, fallen: G.Y.fallen,
    },
    Q: G.Q,
    Z: G.Z,
    E: G.E,
    W: premiseView(G.W),
    L: G.L,
  };
}
