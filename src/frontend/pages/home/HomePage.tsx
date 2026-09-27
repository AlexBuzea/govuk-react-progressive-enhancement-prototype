export function HomePage() {
  return (
    <>
      <h1 className="govuk-heading-xl">Apply for a parking permit</h1>
      <p className="govuk-body-l">
        Use this service to apply for a residential or visitor parking permit in
        the fictional borough of Rivermead.
      </p>

      <h2 className="govuk-heading-m">Before you start</h2>
      <p className="govuk-body">You will need:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>your full name</li>
        <li>the vehicle registration number</li>
        <li>to choose a permit type</li>
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
