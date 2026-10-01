import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Builds to one self-contained dist/index.html (worker inlined) that opens offline or publishes as an artifact.
export default defineConfig({
  plugins: [viteSingleFile()],
  worker: { format: "iife" },
  build: { target: "es2020" },
});
