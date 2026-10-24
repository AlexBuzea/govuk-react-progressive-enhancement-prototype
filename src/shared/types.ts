/**
 * Data shapes used by the store, Express, and React pages.
 * Keep this file small — form choices/rules live next to the page that owns
 * them (see pages/customise/options.ts).
 */

export const SERVICE_NAME = "Apply for a parking permit";

/** Answers from the /apply form. */
export type ApplicationData = {
  fullName: string;
  vehicleReg: string;
  permitType: string;
};

/** Answers from the /customise form. Prices are calculated, not stored. */
export type CustomiseData = {
  duration: string;
  visitorBay: string;
  visitorEndDate: string;
  zoneId: string;
};

/** One error message per invalid field. An empty object means "all valid". */
export type CustomiseErrors = Partial<Record<keyof CustomiseData, string>>;

/** Everything Express passes into the React tree for one request. */
export type PageData = {
  application: ApplicationData;
  customise: CustomiseData;
  customiseErrors: CustomiseErrors;
  counter: number;
  /** Zone search text from ?q= after a no-JS "Filter zones" submit. */
  zoneQuery: string;
};
