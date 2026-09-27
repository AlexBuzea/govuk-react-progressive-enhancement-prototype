export function ConfirmationPage() {
  return (
    <>
      <div className="govuk-panel govuk-panel--confirmation">
        <h1 className="govuk-panel__title">Application complete</h1>
        <div className="govuk-panel__body">
          Your reference number
          <br />
          <strong>RM-PARK-0001</strong>
        </div>
      </div>
      <p className="govuk-body">
        We have received your parking permit application. This is a prototype, so
        nothing has been sent.
      </p>
      <p className="govuk-body">
        <a className="govuk-link" href="/">
          Return to the start page
        </a>
      </p>
    </>
  );
}
