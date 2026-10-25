import type {
  ApplicationData,
  CustomiseData,
  DetailsData,
  OrganisationData,
} from "../shared/types";

/**
 * In-memory "database" for the prototype.
 *
 * One copy, shared by every visitor, reset when the server restarts.
 * A real service would keep this per user (session or database) — the
 * routes would not need to change, only where the data comes from.
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

export const store = {
  application: emptyApplication,
  details: emptyDetails,
  organisation: emptyOrganisation,
  customise: emptyCustomise,
  counter: 0,
};
