import { PREMISE } from "../content/premises/register.js";

// Lore in motion: as history runs, scholars copy and write treatises (so knowledge spreads and gets
// easier to find), diggers report what they find at the premise's sites (and sometimes what it
// means), and zealous realms burn the presses that print what they deny.
//   say(kind, imp, h, b, where) writes a news item.
export function loreStep(G, H, rng, alive, say) {
  const { L, W, S, X, Y, R } = G; if (!L || !W || !W.picks.length) return;
  const provs = R.provs, st = X.settlements;
  const realms = S.states.map((_, i) => i).filter(i => alive[i]);
  if (!realms.length) return;
  const pickW = (list, wf) => { let tot = 0; const ws = list.map(x => { const w = Math.max(0, wf(x)); tot += w; return w; }); if (tot <= 0) return null; let r = rng.f() * tot; for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; } return list[list.length - 1]; };
  const the = n => n.replace(/^The /, "the ");
  const learning = r => { const f = Object.values(H.realm[r].fields || {}); return f.length ? f.reduce((a, b) => a + b, 0) / f.length : 1; };
  const themed = (r, prem) => L.realmThemes[r] && L.realmThemes[r].some(t => L.themes[t].prem === prem);
  const library = r => {
    const towns = S.states[r].provs.map(p => st[X.mainOf[p]]).filter(s => s && !s.abandoned && s.tier >= 2).sort((a, b) => b.tier - a.tier || b.pop - a.pop);
    const t = towns[0]; if (!t) return -1;
    let h = L.holders.find(h => h.kind === "library" && h.prov === t.prov && !h.burned);
    if (!h) { h = { id: L.holders.length, kind: "library", prov: t.prov, name: `The library of ${t.name}`, realm: r, frags: [], founded: H.month }; L.holders.push(h); }
    return h.id;
  };
  const addFrag = (h, base) => { const f = { id: L.frags.length, holder: h, gen: true, month: H.month, ...base }; L.frags.push(f); L.holders[h].frags.push(f.id); H.loreDirty = true; return f; };
  const scholar = r => Y.cultures[Y.realms[r].culture].lang.word({ f: rng.f, int: (a, b) => Math.floor(a + (b - a + 1) * rng.f()), pick: a => a[Math.floor(rng.f() * a.length)], chance: p => rng.f() < p, range: (a, b) => a + (b - a) * rng.f() }, null);

  /* scholars publish: copies of what is already known somewhere, now kept in their own realm's library */
  if (rng.f() < 0.05 + 0.01 * Math.min(5, realms.length / 10)) {
    const pk = W.picks[Math.floor(rng.f() * W.picks.length)], prem = pk.id;
    const r = pickW(realms, r => learning(r) * (themed(r, prem) ? 3 : 1));
    const h = r == null ? -1 : library(r);
    if (h >= 0) {
      const have = new Set(L.holders[h].frags.map(f => L.frags[f].text));
      const src = L.frags.filter(f => f.prem === prem && !have.has(f.text) && !f.copyOf && f.depth !== "site" && L.holders[f.holder].kind !== "library");
      const f0 = pickW(src, f => (f.depth === "core" ? 2 : 1) * (f.truthful === false ? 0.6 : 1));
      if (f0) {
        const who = scholar(r), lib = L.holders[h];
        addFrag(h, { prem, k: f0.k, depth: f0.depth, about: f0.about, source: "library", bias: f0.bias === "true" ? "garbled" : f0.bias, reliable: f0.reliable, truthful: f0.truthful, lead: f0.lead, copyOf: f0.id,
          text: `Copied into ${who}'s commonplace book: "${f0.text}"` });
        say("treatise", 1, `A scholar of ${S.states[r].short} copies a strange text`, `${who} has gathered stories from across the land into a book now kept in ${the(lib.name)}. Few read it; fewer believe it.`, { realm: r, prov: lib.prov });
      }
    }
  }

  /* diggers at the premise's sites: the excavation layer becomes a report, and rarely the revelation leaks */
  for (const s of L.sites) {
    const r = S.own[s.prov]; if (r < 0 || !alive[r] || s.dug >= 2 || rng.f() > 0.004 * (1 + learning(r) / 3)) continue;
    const h = library(r); if (h < 0) continue;
    if (!s.dug) {
      s.dug = 1;
      addFrag(h, { prem: s.prem, k: -1, depth: "site", about: "site:" + s.key, source: "archive", bias: "true", reliable: true, truthful: true, text: `From the report of the diggers at ${the(s.name)}: "${s.layers.dig.text}"` });
      say("excavation", 2, `Diggers break into ${the(s.name)}`, `Workers sent from ${S.states[r].short} have opened ${the(s.name)}. What they found has been written up and locked in ${the(L.holders[h].name)}.`, { realm: r, prov: s.prov });
    } else if (rng.f() < 0.25) {
      s.dug = 2;
      const zealous = Y.realms[r].tags.some(t => t === "zealous" || t === "gov:theocracy");
      addFrag(h, { prem: s.prem, k: -1, depth: "core", about: s.truthLink ? "truth:" + s.truthLink : "truth", source: "archive", bias: zealous ? "redacted" : "true", reliable: zealous ? "partial" : true, truthful: zealous ? "partial" : true,
        text: zealous ? `A sealed finding on ${the(s.name)}, most of it blacked out: "...${s.layers.revelation.text.split(" ").slice(-9).join(" ")}"` : `The last page of the excavation journal at ${the(s.name)}: "${s.layers.revelation.text}"` });
      say("revelation", 3, `What lies beneath ${the(s.name)}`, zealous ? `The diggers at ${the(s.name)} have been recalled and their journals sealed by order of ${Y.realms[r].ruler}. Rumours are already spreading.` : `The scholars who opened ${the(s.name)} have published their conclusions. In the taverns of ${S.states[r].short}, nobody talks about anything else.`, { realm: r, prov: s.prov });
    }
  }

  /* zealots burn the hidden presses */
  if (rng.f() < 0.01) {
    const presses = L.holders.filter(h => h.kind === "heretic" && !h.burned && h.realm >= 0 && alive[h.realm] && Y.realms[h.realm].tags.some(t => ["zealous", "pious", "gov:theocracy", "autocracy"].includes(t)));
    if (presses.length) {
      const h = presses[Math.floor(rng.f() * presses.length)];
      h.burned = true; h.frags = []; H.loreDirty = true;
      say("press_burned", 2, `A hidden press burned in ${st[X.mainOf[h.prov]].name}`, `Soldiers of ${S.states[h.realm].short} broke down the door, carried out the type cases and burned every page in the square. Whatever it printed is now only in people's heads.`, { realm: h.realm, prov: h.prov });
    }
  }
  void PREMISE; void provs;
}
