import type { DetailsData, DetailsErrors } from "../../../shared/types";

/** Rough UK postcode check, e.g. "SW1A 1AA" or "sw1a1aa". */
const POSTCODE_PATTERN = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/**
 * Rules for the name and address form. Runs on the server only (POST /details),
 * because this page has no island.
 *
 * Error messages follow the GOV.UK style: say what to do, e.g. "Enter your full name".
 */
export function validateDetails(data: DetailsData): DetailsErrors {
  const errors: DetailsErrors = {};

  if (!data.fullName) {
    errors.fullName = "Enter your full name";
  }
  if (!data.addressLine1) {
    errors.addressLine1 = "Enter address line 1, typically the building and street";
  }
  if (!data.town) {
    errors.town = "Enter town or city";
  }
  if (!data.postcode) {
    errors.postcode = "Enter postcode";
  } else if (!POSTCODE_PATTERN.test(data.postcode)) {
    errors.postcode = "Enter a real postcode";
  }

  return errors;
}
