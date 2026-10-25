import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../../public");
const govukDir = path.join(__dirname, "../../node_modules/govuk-frontend/dist/govuk");

/** Express app: static files first, then the pages in routes.tsx. */
export function createApp() {
  const app = express();

  // Parse HTML form submissions (application/x-www-form-urlencoded) into req.body
  app.use(express.urlencoded({ extended: false }));

  // GOV.UK Frontend CSS, fonts and images (the CSS expects them under /assets)
  app.use("/assets", express.static(path.join(govukDir, "assets")));
  app.get("/govuk-frontend.min.css", (_req, res) => {
    res.sendFile(path.join(govukDir, "govuk-frontend.min.css"));
  });

  // Our own files: styles.css and the island scripts Vite builds into public/islands/
  app.use(express.static(publicDir));

  // Pages and form handlers (must come after static files)
  app.use(routes);

  return app;
}
