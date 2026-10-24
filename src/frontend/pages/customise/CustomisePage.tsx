import { SERVICE_NAME, type CustomiseData, type CustomiseErrors } from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { CustomiseForm } from "./CustomiseForm";

type CustomisePageProps = {
  customise: CustomiseData;
  errors: CustomiseErrors;
  /** Zone search text from ?q= after a no-JS "Filter zones" submit. */
  zoneQuery: string;
};

export function CustomisePage({ customise, errors, zoneQuery }: CustomisePageProps) {
  return (
    <>
      <title>{`Permit options — ${SERVICE_NAME} — GOV.UK`}</title>
      <BackLink href="/apply" />
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
      <div
        id="customise"
        data-props={JSON.stringify({
          initialValues: customise,
          initialErrors: errors,
          initialZoneQuery: zoneQuery,
        })}
      >
        <CustomiseForm
          initialValues={customise}
          initialErrors={errors}
          initialZoneQuery={zoneQuery}
        />
      </div>

      {/* Load this page's island JS (pages with no island omit this tag). */}
      <script type="module" src="/islands/customise.js" />
    </>
  );
}
