import { shuffle } from "./util.js";

// A tiny phoneme-based language: each continent gets its own so place names sound regional.
// The inventory is fixed at creation; word() takes the caller's rng so stages stay deterministic.
export function makeLanguage(r) {
  const ON = ["b","c","d","f","g","h","k","l","m","n","p","r","s","t","v","z","th","sh","kh","dr","br","tr","gr","st","sk","vr","gl","ch","j","y","w","q","ph","fr","kr","sl"];
  const VO = ["a","e","i","o","u","a","e","o","ae","ai","ei","ou","ia","y","aa","ea","io","ue"];
  const CO = ["n","r","l","s","th","m","k","nd","rn","st","x","sh","ll","rd","g","t","ng","rk","ss","z","lm"];
  const SU = ["ia","or","heim","and","ar","os","eth","ium","al","ir","un","ath","ea","orn","esh","ova","ane","mar","gard","hold","wyn","dor","rim","tal","kar","is","ek","ul","era","oth"];
  const sub = (arr, n) => [...new Set(shuffle(r, arr.slice()))].slice(0, n);
  const on = sub(ON, r.int(8, 14)), vo = sub(VO, r.int(4, 7)), co = sub(CO, r.int(3, 7)), su = sub(SU, r.int(3, 6));
  const codaP = r.range(0.15, 0.5), vStart = r.range(0.05, 0.3), sufP = r.range(0.2, 0.5), maxS = r.int(2, 3);
  function word(rng, used) {
    for (let t = 0; t < 40; t++) {
      let w = ""; const n = rng.int(1, maxS);
      for (let i = 0; i < n; i++) w += (rng.chance(vStart) ? "" : rng.pick(on)) + rng.pick(vo) + (rng.chance(codaP) ? rng.pick(co) : "");
      if (n === 1 || rng.chance(sufP)) w += rng.pick(su);
      w = w.replace(/(.)\1\1+/g, "$1$1").replace(/([aeiouy]{2})[aeiouy]+/g, "$1");
      if (w.length < 4 || w.length > 11) continue;
      const cap = w[0].toUpperCase() + w.slice(1);
      if (used) { if (used.has(cap)) continue; used.add(cap); }
      return cap;
    }
    return "Nameless";
  }
  return { word };
}
