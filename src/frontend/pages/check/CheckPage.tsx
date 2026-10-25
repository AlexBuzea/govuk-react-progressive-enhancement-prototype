import { detailsPageFor } from "../../../shared/journey";
import {
  SERVICE_NAME,
  type ApplicationData,
  type CustomiseData,
  type DetailsData,
  type OrganisationData,
} from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { SummaryRow } from "../../components/SummaryRow";
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
};

/** "Check your answers" — plain server-rendered HTML, no island needed. */
export function CheckPage({ application, details, organisation, customise }: CheckPageProps) {
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
      <BackLink href="/customise" />
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
            <SummaryRow
              label="Vehicle registration"
              value={application.vehicleReg || "Not provided"}
              changeHref="/apply"
            />
            <SummaryRow
              label="Permit type"
              value={labelFor(PERMIT_TYPES, application.permitType)}
              changeHref="/apply"
            />
            {isCommercial ? (
              <>
                <SummaryRow
                  label="Organisation name"
                  value={organisation.organisationName || "Not provided"}
                  changeHref={detailsHref}
                />
                <SummaryRow
                  label="Company number"
                  value={organisation.companyNumber || "Not provided"}
                  changeHref={detailsHref}
                />
                <SummaryRow
                  label="Contact email"
                  value={organisation.contactEmail || "Not provided"}
                  changeHref={detailsHref}
                />
              </>
            ) : (
              <>
                <SummaryRow
                  label="Full name"
                  value={details.fullName || "Not provided"}
                  changeHref={detailsHref}
                />
                <SummaryRow
                  label="Address"
                  value={address || "Not provided"}
                  changeHref={detailsHref}
                />
              </>
            )}
            <SummaryRow
              label="Duration"
              value={labelFor(DURATIONS, customise.duration)}
              changeHref="/customise"
            />
            <SummaryRow
              label="Visitor bay"
              value={labelFor(YES_NO, customise.visitorBay)}
              changeHref="/customise"
            />
            {customise.visitorBay === "yes" ? (
              <SummaryRow
                label="Visitor end date"
                value={customise.visitorEndDate || "Not provided"}
                changeHref="/customise"
              />
            ) : null}
            <SummaryRow
              label="Parking zone"
              value={zone ? `${zone.name} (${zone.id}) — ${zone.area}` : "Not provided"}
              changeHref="/customise"
            />
            <SummaryRow
              label="Estimated total"
              value={price == null ? "Not provided" : formatPrice(price)}
              changeHref="/customise"
            />
          </dl>

          <form method="post" action="/submit">
            <Button type="submit">Accept and send</Button>
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
