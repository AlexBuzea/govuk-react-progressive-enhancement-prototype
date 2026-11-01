/**
 * Data shapes shared by Express and the React pages.
 * Keep this file small — form choices/rules live next to the page that owns
 * them (see pages/customise/options.ts).
 */

export const SERVICE_NAME = "Apply for a parking permit";

/** Answers from the /apply form. */
export type ApplicationData = {
  vehicleReg: string;
  permitType: string;
};

/** Answers from the /details form. */
export type DetailsData = {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  postcode: string;
};

/** One error message per invalid field. An empty object means "all valid". */
export type DetailsErrors = Partial<Record<keyof DetailsData, string>>;

/** Answers from the /organisation-details form (commercial permits). */
export type OrganisationData = {
  organisationName: string;
  companyNumber: string;
  contactEmail: string;
};

/** One error message per invalid field. An empty object means "all valid". */
export type OrganisationErrors = Partial<Record<keyof OrganisationData, string>>;

/** Answers from the /customise form. Prices are calculated, not stored. */
export type CustomiseData = {
  duration: string;
  visitorBay: string;
  visitorEndDate: string;
  zoneId: string;
};

/** One error message per invalid field. An empty object means "all valid". */
export type CustomiseErrors = Partial<Record<keyof CustomiseData, string>>;
