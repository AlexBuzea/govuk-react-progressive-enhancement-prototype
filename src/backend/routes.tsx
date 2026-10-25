import { Router } from "express";
import { hasErrors, validateCustomise } from "../frontend/pages/customise/options";
import type { CustomiseData, PageData } from "../shared/types";
import { renderApp } from "./ssr";
import { emptyCustomise, store } from "./store";

/**
 * Form handlers, then one GET that renders whatever page React Router matches.
 *
 * The page list (which URL shows which component) is frontend/App.tsx:
 *
 *   /  →  /apply  →  /customise  →  /check  →  /confirmation
 *
 * POST handlers live here because a form must work with JavaScript off.
 * Each one saves data and redirects to the next page in that list.
 *
 * >>> To add a form: add a POST below. Add the page itself in frontend/App.tsx.
 */
export const routes = Router();

/** Read one text field from a form body or query string. */
function text(value: unknown): string {
  return String(value ?? "").trim();
}

/** Current store, plus anything that only exists for this request (errors, ?q=). */
function pageData(overrides: Partial<PageData> = {}): PageData {
  return {
    application: store.application,
    customise: store.customise,
    customiseErrors: {},
    counter: store.counter,
    zoneQuery: "",
    ...overrides,
  };
}

/**
 * Read the permit options fields from a form body or query string.
 * Missing fields fall back to `fallback` (empty for a POST, saved values for a GET).
 */
function readCustomise(source: Record<string, unknown>, fallback: CustomiseData): CustomiseData {
  const visitorBay = text(source.visitorBay) || fallback.visitorBay;
  return {
    duration: text(source.duration) || fallback.duration,
    visitorBay,
    visitorEndDate:
      visitorBay === "yes" ? text(source.visitorEndDate) || fallback.visitorEndDate : "",
    zoneId: text(source.zoneId) || fallback.zoneId,
  };
}

// ──────────────────────────── Your application ────────────────────────────

routes.post("/apply", (req, res) => {
  store.application = {
    fullName: text(req.body.fullName),
    vehicleReg: text(req.body.vehicleReg).toUpperCase(),
    permitType: text(req.body.permitType),
  };
  res.redirect(303, "/customise");
});

// Counter island. One route serves both cases:
// - plain form post (no JS): redirect, so the browser reloads the page
// - fetch from the island (JS): reply with JSON, so the page does not reload
routes.post("/apply/increment", (req, res) => {
  store.counter += 1;

  if (req.accepts(["html", "json"]) === "json") {
    res.json({ count: store.counter });
  } else {
    res.redirect(303, "/apply");
  }
});

// ───────────────────────────── Permit options ─────────────────────────────

routes.post("/customise", (req, res) => {
  const customise = readCustomise(req.body, emptyCustomise);
  const errors = validateCustomise(customise); // Same rules the island runs in the browser
  store.customise = customise;

  if (hasErrors(errors)) {
    // Show the form again with the errors, keeping what the user entered
    renderApp("/customise", pageData({ customise, customiseErrors: errors }), res);
    return;
  }
  res.redirect(303, "/check");
});

// ──────────────────────────── Check and submit ────────────────────────────

routes.post("/submit", (_req, res) => {
  // A real service would save the application here
  res.redirect(303, "/confirmation");
});

// ───────────────────────────── Every page GET ─────────────────────────────

// React Router (frontend/App.tsx) chooses the page from the URL.
// You do not add a new GET when you add a page.
routes.get("*", (req, res) => {
  // Without JS, "Filter zones" submits the form as GET (?q=...&duration=...).
  // Read those values over the saved ones so nothing typed is lost on reload.
  const customise = readCustomise(req.query, store.customise);
  renderApp(
    req.originalUrl,
    pageData({ customise, zoneQuery: text(req.query.q) }),
    res
  );
});
