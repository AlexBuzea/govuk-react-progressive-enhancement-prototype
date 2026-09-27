import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../../public");

export function createApp() {
  const app = express();

  // Read HTML form bodies (application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: false }));

  // CSS, client.js, etc.
  app.use(express.static(publicDir));

  // Pages + form handlers
  app.use(routes);

  return app;
}
