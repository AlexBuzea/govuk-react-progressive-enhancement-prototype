import type { ApplicationData } from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { Radios } from "../../components/Radios";
import { TextInput } from "../../components/TextInput";

type ApplyPageProps = {
  application: ApplicationData;
};

export function ApplyPage({ application }: ApplyPageProps) {
  return (
    <>
      <BackLink href="/" />
      <h1 className="govuk-heading-l">Your application</h1>
      <p className="govuk-body">
        Enter your details. This form works with JavaScript turned off.
      </p>

      <form method="post" action="/apply" noValidate>
        <TextInput
          id="fullName"
          name="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={application.fullName}
          required
        />

        <TextInput
          id="vehicleReg"
          name="vehicleReg"
          label="Vehicle registration number"
          hint="For example, AB12 CDE"
          className="govuk-input--width-10"
          defaultValue={application.vehicleReg}
          required
        />

        <Radios
          name="permitType"
          legend="Permit type"
          value={application.permitType}
          options={[
            { value: "resident", label: "Resident permit" },
            { value: "visitor", label: "Visitor permit" },
          ]}
        />

        <Button type="submit">Continue</Button>
      </form>
    </>
  );
}
