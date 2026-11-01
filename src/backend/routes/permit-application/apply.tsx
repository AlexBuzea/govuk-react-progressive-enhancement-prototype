import type { RequestHandler } from "express";
import { ApplyPage } from "../../../frontend/pages/apply/ApplyPage";
import { detailsPageFor } from "../../../shared/journey";
import { csrfTokenFor } from "../../session/csrf";
import { getJourney } from "../../session/store";
import { render } from "../../utils/render";
import { text } from "../../utils/form-fields";

export const showApplyPage: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  render(
    res,
    <ApplyPage
      application={journey.application}
      counter={journey.counter}
      csrfToken={csrfTokenFor(req)}
    />
  );
};

export const saveApply: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  journey.application = {
    vehicleReg: text(req.body.vehicleReg).toUpperCase(),
    permitType: text(req.body.permitType),
  };
  // Which page comes next depends on the permit type
  res.redirect(303, detailsPageFor(journey.application.permitType));
};

// Counter island. One handler serves both cases:
// - plain form post (no JS): redirect, so the browser reloads the page
// - fetch from the island (JS): reply with JSON, so the page does not reload
export const incrementCounter: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  journey.counter += 1;

  if (req.accepts(["html", "json"]) === "json") {
    res.json({ count: journey.counter });
  } else {
    res.redirect(303, "/apply");
  }
};
