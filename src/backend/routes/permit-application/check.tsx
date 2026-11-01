import type { RequestHandler } from "express";
import { CheckPage } from "../../../frontend/pages/check/CheckPage";
import { csrfTokenFor } from "../../session/csrf";
import { getJourney } from "../../session/store";
import { render } from "../../utils/render";

/* Check your answers. The form on this page posts back to /check. */

export const showCheckPage: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  render(
    res,
    <CheckPage
      application={journey.application}
      details={journey.details}
      organisation={journey.organisation}
      customise={journey.customise}
      csrfToken={csrfTokenFor(req)}
    />
  );
};

export const submitApplication: RequestHandler = (_req, res) => {
  // A real service would save the application here
  res.redirect(303, "/confirmation");
};
