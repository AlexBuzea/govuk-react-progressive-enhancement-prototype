import type { RequestHandler } from "express";
import { OrganisationDetailsPage } from "../../../frontend/pages/organisation-details/OrganisationDetailsPage";
import { validateOrganisation } from "../../../frontend/pages/organisation-details/validation";
import { detailsPageFor } from "../../../shared/journey";
import { csrfTokenFor } from "../../session/csrf";
import { getJourney } from "../../session/store";
import { render } from "../../utils/render";
import { text } from "../../utils/form-fields";

/* Organisation details for commercial permits. Same pattern as details.tsx. */

export const showOrganisationDetailsPage: RequestHandler = (req, res) => {
  const journey = getJourney(req);

  // Everyone except commercial applicants uses the name and address page
  const detailsPage = detailsPageFor(journey.application.permitType);
  if (detailsPage !== "/organisation-details") {
    res.redirect(detailsPage);
    return;
  }

  render(
    res,
    <OrganisationDetailsPage
      organisation={journey.organisation}
      errors={{}}
      csrfToken={csrfTokenFor(req)}
    />
  );
};

export const saveOrganisationDetails: RequestHandler = (req, res) => {
  const journey = getJourney(req);
  const organisation = {
    organisationName: text(req.body.organisationName),
    companyNumber: text(req.body.companyNumber).toUpperCase(),
    contactEmail: text(req.body.contactEmail),
  };
  const errors = validateOrganisation(organisation);
  journey.organisation = organisation;

  if (Object.keys(errors).length > 0) {
    render(
      res,
      <OrganisationDetailsPage
        organisation={organisation}
        errors={errors}
        csrfToken={csrfTokenFor(req)}
      />
    );
    return;
  }
  res.redirect(303, "/customise");
};
