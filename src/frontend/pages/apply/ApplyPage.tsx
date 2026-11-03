import { SERVICE_NAME, type ApplicationData } from "../../../shared/types";
import { GovukBackLink } from "../../components/GovukBackLink";
import { GovukButton } from "../../components/GovukButton";
import { CsrfField } from "../../components/CsrfField";
import { GovukRadios } from "../../components/GovukRadios";
import { GovukInput } from "../../components/GovukInput";
import { Counter } from "./Counter";
import { PERMIT_TYPES } from "./options";

type ApplyPageProps = {
  application: ApplicationData;
  counter: number;
  csrfToken: string;
};

/**
 * Application form followed by the counter demo island.
 * The form is handled by POST /apply in backend/routes/permit-application/apply.tsx.
 */
export function ApplyPage({ application, counter, csrfToken }: ApplyPageProps) {
  const counterProps = { initialCount: counter, csrfToken };

  return (
    <>
      <title>{`Your application — ${SERVICE_NAME} — GOV.UK`}</title>
      <GovukBackLink href="/" />
      <h1 className="govuk-heading-l">Your application</h1>
      <p className="govuk-body">
        Enter your vehicle and choose a permit type. This form works with JavaScript turned off.
      </p>

      <form method="post" action="/apply" noValidate>
        <CsrfField token={csrfToken} />
        <GovukInput
          name="vehicleReg"
          label="Vehicle registration number"
          hint="For example, AB12 CDE"
          className="govuk-input--width-10"
          defaultValue={application.vehicleReg}
        />

        <GovukRadios
          name="permitType"
          legend="Permit type"
          options={PERMIT_TYPES}
          value={application.permitType}
        />

        <GovukButton type="submit">Continue</GovukButton>
      </form>

      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      {/*
        Server renders <Counter> as HTML. islands/counter.js then calls
        hydrateRoot on this div so the counter updates without a page reload.
        data-props is how the server passes state into the browser.
      */}
      <div id="counter" data-props={JSON.stringify(counterProps)}>
        <Counter {...counterProps} />
      </div>

      {/* Load this page's island JS (pages with no island omit this tag). */}
      <script type="module" src="/islands/counter.js" />
    </>
  );
}
