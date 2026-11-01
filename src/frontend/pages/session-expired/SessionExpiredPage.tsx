import { SERVICE_NAME } from "../../../shared/types";

/**
 * Shown when a form is posted without a valid session or CSRF token
 * (see backend/session/csrf.tsx). In practice this means the session timed out.
 */
export function SessionExpiredPage() {
  return (
    <>
      <title>{`Your session has ended — ${SERVICE_NAME} — GOV.UK`}</title>
      <h1 className="govuk-heading-l">Your session has ended</h1>
      <p className="govuk-body">We could not save your answers. This can happen if you leave a page open for a long time.</p>
      <p className="govuk-body">
        <a className="govuk-link" href="/apply">
          Start your application again
        </a>
      </p>
    </>
  );
}
