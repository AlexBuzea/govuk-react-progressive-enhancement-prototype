export function Footer() {
  return (
    <footer className="govuk-footer" role="contentinfo">
      <div className="govuk-footer__container">
        <div className="govuk-footer__meta">
          <h2 className="govuk-visually-hidden">Support links</h2>
          <ul className="govuk-footer__inline-list">
            <li className="govuk-footer__inline-list-item">
              <a className="govuk-footer__link" href="/">
                Home
              </a>
            </li>
            <li className="govuk-footer__inline-list-item">
              <span className="govuk-footer__licence-description">
                Prototype — not a real government service
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
