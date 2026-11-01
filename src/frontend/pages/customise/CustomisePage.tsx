import { detailsPageFor } from "../../../shared/journey";
import { SERVICE_NAME, type CustomiseData, type CustomiseErrors } from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { CustomiseForm } from "./CustomiseForm";

type CustomisePageProps = {
  /** From the /apply form. Decides which details page the back link goes to. */
  permitType: string;
  customise: CustomiseData;
  errors: CustomiseErrors;
  /** Zone search text from ?q= after a no-JS "Filter zones" submit. */
  zoneQuery: string;
  csrfToken: string;
};

export function CustomisePage({
  permitType,
  customise,
  errors,
  zoneQuery,
  csrfToken,
}: CustomisePageProps) {
  const formProps = {
    initialValues: customise,
    initialErrors: errors,
    initialZoneQuery: zoneQuery,
    csrfToken,
  };

  return (
    <>
      <title>{`${Object.keys(errors).length > 0 ? "Error: " : ""}Permit options — ${SERVICE_NAME} — GOV.UK`}</title>
      <BackLink href={detailsPageFor(permitType)} />
      <h1 className="govuk-heading-l">Permit options</h1>
      <p className="govuk-body">
        Choose duration, extras and your parking zone. With JavaScript on, the
        price updates as you choose options and the zone list filters as you
        type.
      </p>

      {/*
        Server renders the form as HTML. islands/customise.js then calls
        hydrateRoot on this div so validation, price and zone filter become live.
        data-props is how the server passes state into the browser.
      */}
      <div id="customise" data-props={JSON.stringify(formProps)}>
        <CustomiseForm {...formProps} />
      </div>

      {/* Load this page's island JS (pages with no island omit this tag). */}
      <script type="module" src="/islands/customise.js" />
    </>
  );
}
