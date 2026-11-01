import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite builds the browser JavaScript for islands — nothing else.
 *
 * Every file in src/frontend/islands/ becomes public/islands/<name>.js.
 * Express serves public/ as static files, and each page that has an island
 * adds its own <script> tag (e.g. pages/apply/ApplyPage.tsx). Adding a file to
 * the islands folder is all it takes to add a new island — no changes needed here.
 */

const islandsDir = "src/frontend/islands";
const islands = Object.fromEntries(
  readdirSync(islandsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => [file.replace(".tsx", ""), `${islandsDir}/${file}`])
);

export default defineConfig({
  plugins: [react()],
  publicDir: false, // Express serves public/ itself
  build: {
    outDir: "public/islands",
    emptyOutDir: true,
    rollupOptions: {
      input: islands,
      output: {
        // Fixed file names (no content hash) so Document.tsx can link to them directly
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        // React in its own chunk so it is downloaded once and shared by every island
        manualChunks: { react: ["react", "react-dom", "react-dom/client"] },
      },
    },
  },
});
