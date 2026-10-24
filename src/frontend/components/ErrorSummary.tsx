type ErrorSummaryProps = {
  /** Field name → message. Each link jumps to the element with that id. */
  errors: Record<string, string | undefined>;
};

/** GOV.UK error summary: https://design-system.service.gov.uk/components/error-summary/ */
export function ErrorSummary({ errors }: ErrorSummaryProps) {
  const messages = Object.entries(errors).filter(([, message]) => message);
  if (messages.length === 0) return null;

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert">
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <ul className="govuk-list govuk-error-summary__list">
        {messages.map(([field, message]) => (
          <li key={field}>
            <a href={`#${field}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
