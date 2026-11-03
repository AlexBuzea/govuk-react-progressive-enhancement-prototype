type GovukSummaryListRowProps = {
  label: string;
  value: string;
  /** Page the user goes to when they click "Change". */
  changeHref: string;
};

/**
 * One row of a GOV.UK summary list — used on "Check your answers".
 * Wrap rows in <dl className="govuk-summary-list">.
 * https://design-system.service.gov.uk/components/summary-list/
 */
export function GovukSummaryListRow({ label, value, changeHref }: GovukSummaryListRowProps) {
  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{label}</dt>
      <dd className="govuk-summary-list__value">{value}</dd>
      <dd className="govuk-summary-list__actions">
        <a className="govuk-link" href={changeHref}>
          Change<span className="govuk-visually-hidden"> {label.toLowerCase()}</span>
        </a>
      </dd>
    </div>
  );
}
