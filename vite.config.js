import { defineConfig } from "vite";
import { resolve } from "node:path";
import { pages } from "./src/data.js";

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page, index) => [`page-${index}`, resolve(page.file)]),
      ),
    },
  },
});
