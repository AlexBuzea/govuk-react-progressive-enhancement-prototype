import { GovukLogo } from "./GovukLogo";

export function Footer() {
  return (
    <footer className="govuk-footer">
      <div className="govuk-width-container">
        <GovukLogo
          className="govuk-footer__crown"
          useLogotype={false}
          ariaLabel=""
        />

        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href="/">
                  Home
                </a>
              </li>
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href="/help">
                  Help and contact
                </a>
              </li>
            </ul>
            <div className="govuk-footer__meta-custom">
              Prototype — not a real government service
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
