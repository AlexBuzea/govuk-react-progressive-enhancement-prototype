import { Router } from "express";
import { hasErrors, validateCustomise } from "../frontend/pages/customise/options";
import { validateDetails } from "../frontend/pages/details/validation";
import { validateOrganisation } from "../frontend/pages/organisation-details/validation";
import { detailsPageFor } from "../shared/journey";
import type { CustomiseData, PageData } from "../shared/types";
import { renderApp } from "./ssr";
import { emptyCustomise, store } from "./store";

/**
 * Form handlers, then one GET that renders whatever page React Router matches.
 *
 * The page list (which URL shows which component) is frontend/App.tsx:
 *
 *   /  →  /apply  →  /details  →  /customise  →  /check  →  /confirmation
 *                    (commercial permits: /organisation-details instead of /details)
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
    details: store.details,
    detailsErrors: {},
    organisation: store.organisation,
    organisationErrors: {},
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
    vehicleReg: text(req.body.vehicleReg).toUpperCase(),
    permitType: text(req.body.permitType),
  };
  // The permit type decides which details page comes next
  res.redirect(303, detailsPageFor(store.application.permitType));
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

// ───────────────────────────── Name and address ─────────────────────────────

// Server-only validation: the simplest form pattern, with no island.
routes.post("/details", (req, res) => {
  const details = {
    fullName: text(req.body.fullName),
    addressLine1: text(req.body.addressLine1),
    addressLine2: text(req.body.addressLine2),
    town: text(req.body.town),
    postcode: text(req.body.postcode).toUpperCase(),
  };
  const errors = validateDetails(details);
  store.details = details;

  if (Object.keys(errors).length > 0) {
    // Show the form again with error messages, keeping what the user typed
    renderApp("/details", pageData({ details, detailsErrors: errors }), res);
    return;
  }
  res.redirect(303, "/customise");
});

// ───────────────────────────── Organisation (commercial) ─────────────────────────────

// Same pattern as /details, for commercial permits.
routes.post("/organisation-details", (req, res) => {
  const organisation = {
    organisationName: text(req.body.organisationName),
    companyNumber: text(req.body.companyNumber).toUpperCase(),
    contactEmail: text(req.body.contactEmail),
  };
  const errors = validateOrganisation(organisation);
  store.organisation = organisation;

  if (Object.keys(errors).length > 0) {
    renderApp(
      "/organisation-details",
      pageData({ organisation, organisationErrors: errors }),
      res
    );
    return;
  }
  res.redirect(303, "/customise");
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
