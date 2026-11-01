import express, { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../../../public");
const govukDir = path.join(__dirname, "../../../node_modules/govuk-frontend/dist/govuk");

/** Files the browser downloads. They need no session, so app.ts mounts this first. */
export const staticFiles = Router();

// GOV.UK Frontend CSS, JavaScript, fonts and images (the CSS expects them under /assets)
staticFiles.use("/assets", express.static(path.join(govukDir, "assets")));
staticFiles.get("/govuk-frontend.min.css", (_req, res) => {
  res.sendFile(path.join(govukDir, "govuk-frontend.min.css"));
});
staticFiles.get("/govuk-frontend.min.js", (_req, res) => {
  res.sendFile(path.join(govukDir, "govuk-frontend.min.js"));
});

// Our own files: styles.css, small scripts and the island scripts Vite builds into public/islands/
staticFiles.use(express.static(publicDir));
