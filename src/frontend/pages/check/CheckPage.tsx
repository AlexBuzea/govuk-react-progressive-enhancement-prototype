import { detailsPageFor } from "../../../shared/journey";
import {
  SERVICE_NAME,
  type ApplicationData,
  type CustomiseData,
  type DetailsData,
  type OrganisationData,
} from "../../../shared/types";
import { GovukBackLink } from "../../components/GovukBackLink";
import { GovukButton } from "../../components/GovukButton";
import { CsrfField } from "../../components/CsrfField";
import { GovukSummaryListRow } from "../../components/GovukSummaryListRow";
import { PERMIT_TYPES } from "../apply/options";
import {
  calculatePrice,
  DURATIONS,
  findZone,
  formatPrice,
  YES_NO,
} from "../customise/options";

type CheckPageProps = {
  application: ApplicationData;
  details: DetailsData;
  organisation: OrganisationData;
  customise: CustomiseData;
  csrfToken: string;
};

/** "Check your answers" — plain server-rendered HTML, no island needed. */
export function CheckPage({
  application,
  details,
  organisation,
  customise,
  csrfToken,
}: CheckPageProps) {
  const zone = findZone(customise.zoneId);
  const price = calculatePrice(customise.duration, customise.visitorBay);
  const address = [details.addressLine1, details.addressLine2, details.town, details.postcode]
    .filter(Boolean)
    .join(", ");

  // Commercial permits show organisation answers; everyone else shows name and address.
  // Answers for the other kind stay in the store but are not shown.
  const isCommercial = application.permitType === "commercial";
  const detailsHref = detailsPageFor(application.permitType);

  const hasAnswers =
    application.vehicleReg ||
    details.fullName ||
    organisation.organisationName ||
    customise.duration;

  return (
    <>
      <title>{`Check your answers — ${SERVICE_NAME} — GOV.UK`}</title>
      <GovukBackLink href="/customise" />
      <h1 className="govuk-heading-l">Check your answers</h1>

      {!hasAnswers ? (
        <p className="govuk-body">
          You have not entered any details yet.{" "}
          <a className="govuk-link" href="/apply">
            Go back to the application form
          </a>
          .
        </p>
      ) : (
        <>
          <dl className="govuk-summary-list">
            <GovukSummaryListRow
              label="Vehicle registration"
              value={application.vehicleReg || "Not provided"}
              changeHref="/apply"
            />
            <GovukSummaryListRow
              label="Permit type"
              value={labelFor(PERMIT_TYPES, application.permitType)}
              changeHref="/apply"
            />
            {isCommercial ? (
              <>
                <GovukSummaryListRow
                  label="Organisation name"
                  value={organisation.organisationName || "Not provided"}
                  changeHref={detailsHref}
                />
                <GovukSummaryListRow
                  label="Company number"
                  value={organisation.companyNumber || "Not provided"}
                  changeHref={detailsHref}
                />
                <GovukSummaryListRow
                  label="Contact email"
                  value={organisation.contactEmail || "Not provided"}
                  changeHref={detailsHref}
                />
              </>
            ) : (
              <>
                <GovukSummaryListRow
                  label="Full name"
                  value={details.fullName || "Not provided"}
                  changeHref={detailsHref}
                />
                <GovukSummaryListRow
                  label="Address"
                  value={address || "Not provided"}
                  changeHref={detailsHref}
                />
              </>
            )}
            <GovukSummaryListRow
              label="Duration"
              value={labelFor(DURATIONS, customise.duration)}
              changeHref="/customise"
            />
            <GovukSummaryListRow
              label="Visitor bay"
              value={labelFor(YES_NO, customise.visitorBay)}
              changeHref="/customise"
            />
            {customise.visitorBay === "yes" ? (
              <GovukSummaryListRow
                label="Visitor end date"
                value={customise.visitorEndDate || "Not provided"}
                changeHref="/customise"
              />
            ) : null}
            <GovukSummaryListRow
              label="Parking zone"
              value={zone ? `${zone.name} (${zone.id}) — ${zone.area}` : "Not provided"}
              changeHref="/customise"
            />
            <GovukSummaryListRow
              label="Estimated total"
              value={price == null ? "Not provided" : formatPrice(price)}
              changeHref="/customise"
            />
          </dl>

          <form method="post" action="/check">
            <CsrfField token={csrfToken} />
            <GovukButton type="submit">Accept and send</GovukButton>
          </form>
        </>
      )}
    </>
  );
}

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((option) => option.value === value)?.label ?? "Not provided";
}
