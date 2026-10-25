import {
  SERVICE_NAME,
  type OrganisationData,
  type OrganisationErrors,
} from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { ErrorSummary } from "../../components/ErrorSummary";
import { TextInput } from "../../components/TextInput";

type OrganisationDetailsPageProps = {
  organisation: OrganisationData;
  errors: OrganisationErrors;
};

/**
 * Server-only page, same pattern as pages/details/DetailsPage.tsx.
 * Commercial permits come here instead of /details (see shared/journey.ts).
 */
export function OrganisationDetailsPage({ organisation, errors }: OrganisationDetailsPageProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <title>{`${hasErrors ? "Error: " : ""}Your organisation — ${SERVICE_NAME} — GOV.UK`}</title>
      <BackLink href="/apply" />

      <form method="post" action="/organisation-details" noValidate>
        <ErrorSummary errors={errors} />

        <h1 className="govuk-heading-l">Your organisation</h1>

        <TextInput
          name="organisationName"
          label="Organisation name"
          autoComplete="organization"
          defaultValue={organisation.organisationName}
          error={errors.organisationName}
        />

        <TextInput
          name="companyNumber"
          label="Company number"
          hint="8 characters, for example 01234567"
          className="govuk-input--width-10"
          autoComplete="off"
          defaultValue={organisation.companyNumber}
          error={errors.companyNumber}
        />

        <TextInput
          name="contactEmail"
          label="Contact email address (optional)"
          type="email"
          autoComplete="email"
          spellCheck={false}
          defaultValue={organisation.contactEmail}
          error={errors.contactEmail}
        />

        <Button type="submit">Save and continue</Button>
      </form>
    </>
  );
}
