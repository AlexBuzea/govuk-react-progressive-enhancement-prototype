import express from "express";
import { securityHeaders } from "./middleware/security-headers";
import { staticFiles } from "./middleware/static-files";
import { routes } from "./routes";
import { csrfProtection } from "./session/csrf";
import { sessionMiddleware } from "./session/session";

/**
 * The Express app. Order matters: each line runs for the request before the next.
 *
 *   security headers → static files → form parsing → session → CSRF check → pages
 */
export function createApp() {
  const app = express();

  // Hosts like Render put a proxy in front of the app that handles HTTPS. Trusting it
  // lets Express see the original HTTPS request, which the secure session cookie needs.
  if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

  app.use(securityHeaders);
  app.use(staticFiles);

  // Everything below is per visitor, so it comes after the static files.

  // Parse HTML form submissions (application/x-www-form-urlencoded) into req.body
  app.use(express.urlencoded({ extended: false }));

  app.use(sessionMiddleware());

  // Refuse form posts that do not carry this visitor's CSRF token
  app.use(csrfProtection);

  // Pages and form handlers (src/backend/routes/)
  app.use(routes);

  return app;
}
