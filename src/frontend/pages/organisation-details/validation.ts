import type { OrganisationData, OrganisationErrors } from "../../../shared/types";

/** Companies House numbers are 8 characters, e.g. "01234567" or "SC123456". */
const COMPANY_NUMBER_PATTERN = /^[A-Z0-9]{8}$/;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/**
 * Rules for the organisation details form. Runs on the server only
 * (POST /organisation-details), because this page has no island.
 */
export function validateOrganisation(data: OrganisationData): OrganisationErrors {
  const errors: OrganisationErrors = {};

  if (!data.organisationName) {
    errors.organisationName = "Enter your organisation name";
  }
  if (!data.companyNumber) {
    errors.companyNumber = "Enter your company number";
  } else if (!COMPANY_NUMBER_PATTERN.test(data.companyNumber)) {
    errors.companyNumber = "Enter a real company number, like 01234567";
  }
  // Optional: only checked when the user fills it in
  if (data.contactEmail && !EMAIL_PATTERN.test(data.contactEmail)) {
    errors.contactEmail = "Enter an email address in the correct format, like name@example.com";
  }

  return errors;
}
