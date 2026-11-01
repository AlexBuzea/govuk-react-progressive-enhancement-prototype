import type { Request } from "express";
import type {
  ApplicationData,
  CustomiseData,
  DetailsData,
  OrganisationData,
} from "../../shared/types";

/**
 * Each visitor's answers, kept in their session (the session is set up in session.ts).
 *
 * Prototype: sessions live in server memory, so they are lost when the server
 * restarts. A real service would give express-session a Redis or database store
 * (the "store" option). Nothing in backend/routes/ would need to change.
 */

export const emptyApplication: ApplicationData = {
  vehicleReg: "",
  permitType: "",
};

export const emptyDetails: DetailsData = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  town: "",
  postcode: "",
};

export const emptyOrganisation: OrganisationData = {
  organisationName: "",
  companyNumber: "",
  contactEmail: "",
};

export const emptyCustomise: CustomiseData = {
  duration: "",
  visitorBay: "",
  visitorEndDate: "",
  zoneId: "",
};

/** Everything we remember about one visitor's application. */
export type Journey = {
  application: ApplicationData;
  details: DetailsData;
  organisation: OrganisationData;
  customise: CustomiseData;
  counter: number;
};

// Tell TypeScript what we keep on req.session
declare module "express-session" {
  interface SessionData {
    journey: Journey;
    csrfToken: string;
  }
}

/** This visitor's answers. Starts empty the first time it is asked for. */
export function getJourney(req: Request): Journey {
  req.session.journey ??= {
    application: { ...emptyApplication },
    details: { ...emptyDetails },
    organisation: { ...emptyOrganisation },
    customise: { ...emptyCustomise },
    counter: 0,
  };
  return req.session.journey;
}
