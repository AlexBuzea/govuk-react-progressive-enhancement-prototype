import { SERVICE_NAME } from "../../../shared/types";

/**
 * The simplest kind of page: no form, no island, no props.
 * It is a React component that the server turns into HTML, and nothing else.
 */
export function HelpPage() {
  return (
    <>
      <title>{`Help and contact — ${SERVICE_NAME} — GOV.UK`}</title>
      <h1 className="govuk-heading-l">Help and contact</h1>

      <p className="govuk-body">
        If you have a question about your parking permit application, contact
        Rivermead Borough Council.
      </p>

      <h2 className="govuk-heading-m">By email</h2>
      <p className="govuk-body">
        <a className="govuk-link" href="mailto:parking@rivermead.example">
          parking@rivermead.example
        </a>
      </p>
      <p className="govuk-body">We aim to reply within 5 working days.</p>

      <h2 className="govuk-heading-m">By phone</h2>
      <p className="govuk-body">Telephone: 01632 960 001</p>
      <p className="govuk-body">Monday to Friday, 9am to 5pm. Closed on bank holidays.</p>

      <p className="govuk-body">
        This is a prototype, so these contact details are not real.
      </p>

      <p className="govuk-body">
        <a className="govuk-link" href="/">
          Return to the start page
        </a>
      </p>
    </>
  );
}
