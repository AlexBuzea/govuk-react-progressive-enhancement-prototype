type ErrorSummaryProps = {
  /** Field name → message. Each link jumps to the element with that id. */
  errors: Record<string, string | undefined>;
};

/**
 * GOV.UK error summary: https://design-system.service.gov.uk/components/error-summary/
 *
 * Moving focus to the summary makes screen readers announce it:
 * - Pages the server renders with errors: govuk-frontend's JS does it, because
 *   of data-module (started by public/govuk-init.js).
 * - Errors found in the browser by an island: the island calls
 *   document.getElementById("error-summary")?.focus() itself (see CustomiseForm).
 */
export function ErrorSummary({ errors }: ErrorSummaryProps) {
  const messages = Object.entries(errors).filter(([, message]) => message);
  if (messages.length === 0) return null;

  return (
    <div
      className="govuk-error-summary"
      id="error-summary"
      tabIndex={-1}
      data-module="govuk-error-summary"
    >
      {/* role="alert" sits on this inner div, as in the official template */}
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {messages.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
