// Turns dist/index.html into dist/artifact.html: the artifact host supplies its own
// doctype/html/head/body skeleton, so those wrapper tags are stripped.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("dist/index.html", "utf8");
const out = src
  .replace(/<!doctype html>/i, "")
  .replace(/<\/?html[^>]*>/gi, "")
  .replace(/<\/?head>/gi, "")
  .replace(/<\/?body[^>]*>/gi, "")
  .replace(/<meta charset[^>]*>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
  .trim();
writeFileSync("dist/artifact.html", out + "\n");
console.log(`dist/artifact.html written (${(out.length / 1024).toFixed(0)} KB)`);
