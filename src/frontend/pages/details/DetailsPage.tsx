import { SERVICE_NAME, type DetailsData, type DetailsErrors } from "../../../shared/types";
import { GovukBackLink } from "../../components/GovukBackLink";
import { GovukButton } from "../../components/GovukButton";
import { CsrfField } from "../../components/CsrfField";
import { GovukErrorSummary } from "../../components/GovukErrorSummary";
import { GovukInput } from "../../components/GovukInput";

type DetailsPageProps = {
  details: DetailsData;
  errors: DetailsErrors;
  csrfToken: string;
};

/**
 * Server-only page: no island and no React sent to the browser.
 * It is a normal React component that the server turns into HTML.
 *
 * 1. The user selects "Save and continue" and the browser POSTs to /details.
 * 2. backend/routes/permit-application/details.tsx validates the answers (pages/details/validation.ts).
 * 3. If something is missing, the server renders this page again with
 *    `errors` and what the user typed. Otherwise it redirects to /customise.
 */
export function DetailsPage({ details, errors, csrfToken }: DetailsPageProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      {/* GOV.UK pattern: start the title with "Error:" so screen reader users hear it first */}
      <title>{`${hasErrors ? "Error: " : ""}Your name and address — ${SERVICE_NAME} — GOV.UK`}</title>
      <GovukBackLink href="/apply" />

      <form method="post" action="/details" noValidate>
        <CsrfField token={csrfToken} />
        <GovukErrorSummary errors={errors} />

        <h1 className="govuk-heading-l">Your name and address</h1>

        {/* defaultValue: the browser keeps track of what is typed, React only sets the starting value */}
        <GovukInput
          name="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={details.fullName}
          error={errors.fullName}
        />

        <GovukInput
          name="addressLine1"
          label="Address line 1"
          autoComplete="address-line1"
          defaultValue={details.addressLine1}
          error={errors.addressLine1}
        />

        <GovukInput
          name="addressLine2"
          label="Address line 2 (optional)"
          autoComplete="address-line2"
          defaultValue={details.addressLine2}
        />

        <GovukInput
          name="town"
          label="Town or city"
          autoComplete="address-level2"
          className="govuk-!-width-two-thirds"
          defaultValue={details.town}
          error={errors.town}
        />

        <GovukInput
          name="postcode"
          label="Postcode"
          autoComplete="postal-code"
          className="govuk-input--width-10"
          defaultValue={details.postcode}
          error={errors.postcode}
        />

        <GovukButton type="submit">Save and continue</GovukButton>
      </form>
    </>
  );
}
