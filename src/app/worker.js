import { runPipeline, toView } from "../gen/pipeline.js";
import { genChunk } from "../gen/region.js";
import { townChunk } from "../gen/city.js";
import { initHistory, simulate, historyView } from "../sim/history.js";

// Generation runs here so the page stays responsive. The full world (including name
// generators) is kept between requests so slider changes only rerun later stages, and so
// region and town maps can be generated from it on demand.
let G = null;

self.onmessage = ({ data }) => {
  const { id, type = "world" } = data;
  try {
    if (type === "world") {
      // a world that has lived through history is regenerated from scratch
      if (G && G.H) G = null;
      // helper workers (quiet) only need the world for themselves, not a copy on the page
      G = runPipeline(G, data.P, data.from, data.quiet ? () => {} : (k, state, ms) => self.postMessage({ type: "stage", id, k, state, ms }));
      self.postMessage({ type: "done", id, world: data.quiet ? null : toView(G) });
    } else if (type === "chunk") {
      const c = genChunk(G, data.cx, data.cy, data.level || 0);
      self.postMessage({ type: "chunk", id, chunk: c }, [c.ground.buffer, c.biome.buffer, c.elev.buffer, c.owner.buffer]);
    } else if (type === "sim") {
      // the history layer: advance the world month by month (up to a year per message)
      if (!G.H) G.H = initHistory(G);
      const since = G.H.newsSeq, r = simulate(G, G.H, data.to, 12);
      self.postMessage({ type: "sim", id, view: historyView(G, G.H, since, r.flags) });
    } else if (type === "townchunk") {
      const c = townChunk(G, data.sid, data.level, data.ci, data.cj);
      self.postMessage({ type: "townchunk", id, chunk: c }, [c.tile.buffer, c.lot.buffer, c.shade.buffer, c.district.buffer]);
    }
  } catch (err) {
    if (type === "world") G = null;
    self.postMessage({ type: "error", id, kind: type, message: (err && err.message) || String(err) });
  }
};
