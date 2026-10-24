import { SERVICE_NAME } from "../../../shared/types";

export function NotFoundPage() {
  return (
    <>
      <title>{`Page not found — ${SERVICE_NAME} — GOV.UK`}</title>
      <h1 className="govuk-heading-l">Page not found</h1>
      <p className="govuk-body">
        If you typed the web address, check it is correct.
      </p>
      <p className="govuk-body">
        <a className="govuk-link" href="/">
          Return to the start page
        </a>
      </p>
    </>
  );
}
