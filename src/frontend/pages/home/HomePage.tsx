import { SERVICE_NAME } from "../../../shared/types";

/** Start page — plain server-rendered HTML, no island needed. */
export function HomePage() {
  return (
    <>
      <title>{`${SERVICE_NAME} — GOV.UK`}</title>
      <h1 className="govuk-heading-xl">Apply for a parking permit</h1>
      <p className="govuk-body-l">
        Use this service to apply for a resident, visitor or commercial parking permit in
        the fictional borough of Rivermead.
      </p>

      <h2 className="govuk-heading-m">Before you start</h2>
      <p className="govuk-body">You will need:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>the vehicle registration number</li>
        <li>your name and address, or your organisation’s details for a commercial permit</li>
        <li>to choose a permit type and options</li>
      </ul>

      <p className="govuk-body">It takes about 5 minutes to apply.</p>

      <a href="/apply" role="button" draggable={false} className="govuk-button">
        Start now
      </a>

      <p className="govuk-body govuk-!-margin-top-6">
        <span className="govuk-!-font-weight-bold">This is a prototype.</span> It
        demonstrates React server-side rendering with a no-JavaScript fallback.
      </p>
    </>
  );
}
