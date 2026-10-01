import { makeRng, weightedPick } from "../core/util.js";
import { ARCH, styleFor } from "./archstyles.js";

// What kind of place a settlement is, decided before any streets are drawn: its architecture,
// its street layout and its fortifications. Cheap and deterministic, so land chunks can show it
// on the settlement card and the town generator builds exactly what the card promised.

export const LAYOUT_NAMES = {
  organic: "Organic medieval streets", grid: "Planned grid", mixed: "Old town with a planned extension",
  linear: "Street village along the road", green: "Village around a green",
};

export function townProfile(G, s) {
  const rng = makeRng(G.seed + "|profile|" + s.id), style = styleFor(G, s), kit = ARCH[style];
  const p = s.prov, danger = G.F.hostile[p] >= 0 || G.F.titan[p] >= 0;
  let layout;
  if (s.tier <= 1) layout = rng.chance(0.55) ? "linear" : "green";
  else if (s.tier === 2) layout = weightedPick(rng, Object.keys(kit.layouts), k => kit.layouts[k]);
  else { const w = { ...kit.layouts, mixed: 3 }; layout = weightedPick(rng, Object.keys(w), k => w[k]); }
  // fortifications grow with size and wealth; danger nearby makes even villages fence themselves in
  let fort = "none", citadel = false, moat = false;
  if (s.tier <= 1) fort = danger && rng.chance(0.7) ? "palisade" : "none";
  else if (s.tier === 2) fort = s.walled ? (rng.chance(0.3) ? "palisade" : "wall") : danger ? "palisade" : "none";
  else {
    fort = s.tier === 4 && rng.chance(0.35) ? "star" : "wall";
    citadel = rng.chance(s.tier === 4 ? 0.8 : 0.5);
    moat = !s.port && rng.chance(0.4);
  }
  const fortName = { none: "Unfortified", palisade: "Wooden palisade", wall: "Stone walls with towers", star: "Bastioned star fort" }[fort] +
    (citadel ? ", citadel" : "") + (moat ? ", moat" : "");
  return { style, styleName: kit.n, layout, layoutName: LAYOUT_NAMES[layout], fort, citadel, moat, fortName };
}
