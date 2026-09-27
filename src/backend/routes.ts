import { Router } from "express";
import { pageTitles } from "../frontend/routes";
import { renderApp } from "./ssr";
import { store } from "./store";

/**
 * Express routes
 * - POST: handle HTML forms (works without JavaScript)
 * - GET *: render the matching React page as HTML
 */
export const routes = Router();

// Save the application form, then go to check answers
routes.post("/apply", (req, res) => {
  store.saveApplication({
    fullName: String(req.body.fullName ?? "").trim(),
    vehicleReg: String(req.body.vehicleReg ?? "").trim().toUpperCase(),
    permitType: String(req.body.permitType ?? "").trim(),
  });
  res.redirect(303, "/check");
});

// Counter form (no-JS fallback) — bump count and reload /check
routes.post("/check/increment", (_req, res) => {
  const next = store.incrementCounter();
  console.log("[server] counter incremented →", next);
  res.redirect(303, "/check");
});

// Accept and send → confirmation page
routes.post("/submit", (_req, res) => {
  res.redirect(303, "/confirmation");
});

// >>> When a new page has a form that must work without JS, add a POST here, e.g.:
// routes.post("/payment", (req, res) => {
//   store.savePayment({ ... });
//   res.redirect(303, "/confirmation");
// });

// Every page GET: React Router picks the page, we stream HTML.
// You do NOT need a new GET route for each page — GET * covers them all.
routes.get("*", (req, res) => {
  const isKnownPage = req.path in pageTitles;
  renderApp(req.originalUrl, store.getAppData(), res, isKnownPage ? 200 : 404);
});
