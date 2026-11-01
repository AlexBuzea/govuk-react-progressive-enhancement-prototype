import type { RequestHandler } from "express";
import { CustomisePage } from "../../../frontend/pages/customise/CustomisePage";
import { hasErrors, validateCustomise } from "../../../frontend/pages/customise/options";
import type { CustomiseData } from "../../../shared/types";
import { csrfTokenFor } from "../../session/csrf";
import { emptyCustomise, getJourney } from "../../session/store";
import { render } from "../../utils/render";
import { text } from "../../utils/form-fields";

/* Permit options. The page is an island, so it also works as a plain form with JS off. */

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

export const showCustomisePage: RequestHandler = (req, res) => {
  const journey = getJourney(req);

  // Without JS, "Filter zones" submits the form as GET (?q=...&duration=...).
  // Read those values over the saved ones so nothing typed is lost on reload.
  const customise = readCustomise(req.query, journey.customise);

  render(
    res,
    <CustomisePage
      customise={customise}
      errors={{}}
      zoneQuery={text(req.query.q)}
      permitType={journey.application.permitType}
      csrfToken={csrfTokenFor(req)}
    />
  );
};

export const saveCustomise: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  const customise = readCustomise(req.body, emptyCustomise);
  const errors = validateCustomise(customise); // Same rules the island runs in the browser
  journey.customise = customise;

  if (hasErrors(errors)) {
    // Show the form again with the errors, keeping what the user entered
    render(
      res,
      <CustomisePage
        customise={customise}
        errors={errors}
        zoneQuery=""
        permitType={journey.application.permitType}
        csrfToken={csrfTokenFor(req)}
      />
    );
    return;
  }
  res.redirect(303, "/check");
};
