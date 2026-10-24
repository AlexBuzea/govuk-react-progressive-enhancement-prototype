import { SERVICE_NAME, type ApplicationData } from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { Radios } from "../../components/Radios";
import { TextInput } from "../../components/TextInput";
import { Counter } from "./Counter";

/** Permit type choices — also used on the check-your-answers page. */
export const PERMIT_TYPES = [
  { value: "resident", label: "Resident permit" },
  { value: "visitor", label: "Visitor permit" },
];

type ApplyPageProps = {
  application: ApplicationData;
  counter: number;
};

/**
 * Application form followed by the counter demo island.
 * The form is handled by POST /apply in backend/routes.tsx.
 */
export function ApplyPage({ application, counter }: ApplyPageProps) {
  return (
    <>
      <title>{`Your application — ${SERVICE_NAME} — GOV.UK`}</title>
      <BackLink href="/" />
      <h1 className="govuk-heading-l">Your application</h1>
      <p className="govuk-body">
        Enter your details. This form works with JavaScript turned off.
      </p>

      <form method="post" action="/apply" noValidate>
        <TextInput
          name="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={application.fullName}
        />

        <TextInput
          name="vehicleReg"
          label="Vehicle registration number"
          hint="For example, AB12 CDE"
          className="govuk-input--width-10"
          defaultValue={application.vehicleReg}
        />

        <Radios
          name="permitType"
          legend="Permit type"
          options={PERMIT_TYPES}
          value={application.permitType}
        />

        <Button type="submit">Continue</Button>
      </form>

      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      {/*
        Server renders <Counter> as HTML. islands/counter.js then calls
        hydrateRoot on this div so the counter updates without a page reload.
        data-props is how the server passes state into the browser.
      */}
      <div id="counter" data-props={JSON.stringify({ initialCount: counter })}>
        <Counter initialCount={counter} />
      </div>

      {/* Load this page's island JS (pages with no island omit this tag). */}
      <script type="module" src="/islands/counter.js" />
    </>
  );
}
