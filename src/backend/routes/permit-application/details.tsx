import type { RequestHandler } from "express";
import { DetailsPage } from "../../../frontend/pages/details/DetailsPage";
import { validateDetails } from "../../../frontend/pages/details/validation";
import { detailsPageFor } from "../../../shared/journey";
import { csrfTokenFor } from "../../session/csrf";
import { getJourney } from "../../session/store";
import { render } from "../../utils/render";
import { text } from "../../utils/form-fields";

/*
 * Name and address. Server-only validation: the simplest form pattern, with no island.
 * Copy this file to add a form with validation.
 */

export const showDetailsPage: RequestHandler = (req, res) => {
  const journey = getJourney(req);

  // Commercial applicants use the organisation page instead
  const detailsPage = detailsPageFor(journey.application.permitType);
  if (detailsPage !== "/details") {
    res.redirect(detailsPage);
    return;
  }

  render(
    res,
    <DetailsPage details={journey.details} errors={{}} csrfToken={csrfTokenFor(req)} />
  );
};

export const saveDetails: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  const details = {
    fullName: text(req.body.fullName),
    addressLine1: text(req.body.addressLine1),
    addressLine2: text(req.body.addressLine2),
    town: text(req.body.town),
    postcode: text(req.body.postcode).toUpperCase(),
  };
  const errors = validateDetails(details);
  journey.details = details;

  if (Object.keys(errors).length > 0) {
    // Show the form again with error messages, keeping what the user typed
    render(res, <DetailsPage details={details} errors={errors} csrfToken={csrfTokenFor(req)} />);
    return;
  }
  res.redirect(303, "/customise");
};
