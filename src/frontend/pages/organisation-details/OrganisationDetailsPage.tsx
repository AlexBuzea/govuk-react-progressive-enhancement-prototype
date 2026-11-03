import {
  SERVICE_NAME,
  type OrganisationData,
  type OrganisationErrors,
} from "../../../shared/types";
import { GovukBackLink } from "../../components/GovukBackLink";
import { GovukButton } from "../../components/GovukButton";
import { CsrfField } from "../../components/CsrfField";
import { GovukErrorSummary } from "../../components/GovukErrorSummary";
import { GovukInput } from "../../components/GovukInput";

type OrganisationDetailsPageProps = {
  organisation: OrganisationData;
  errors: OrganisationErrors;
  csrfToken: string;
};

/**
 * Server-only page, same pattern as pages/details/DetailsPage.tsx.
 * Commercial permits come here instead of /details (see shared/journey.ts).
 */
export function OrganisationDetailsPage({
  organisation,
  errors,
  csrfToken,
}: OrganisationDetailsPageProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <title>{`${hasErrors ? "Error: " : ""}Your organisation — ${SERVICE_NAME} — GOV.UK`}</title>
      <GovukBackLink href="/apply" />

      <form method="post" action="/organisation-details" noValidate>
        <CsrfField token={csrfToken} />
        <GovukErrorSummary errors={errors} />

        <h1 className="govuk-heading-l">Your organisation</h1>

        <GovukInput
          name="organisationName"
          label="Organisation name"
          autoComplete="organization"
          defaultValue={organisation.organisationName}
          error={errors.organisationName}
        />

        <GovukInput
          name="companyNumber"
          label="Company number"
          hint="8 characters, for example 01234567"
          className="govuk-input--width-10"
          autoComplete="off"
          defaultValue={organisation.companyNumber}
          error={errors.companyNumber}
        />

        <GovukInput
          name="contactEmail"
          label="Contact email address (optional)"
          type="email"
          autoComplete="email"
          spellCheck={false}
          defaultValue={organisation.contactEmail}
          error={errors.contactEmail}
        />

        <GovukButton type="submit">Save and continue</GovukButton>
      </form>
    </>
  );
}
