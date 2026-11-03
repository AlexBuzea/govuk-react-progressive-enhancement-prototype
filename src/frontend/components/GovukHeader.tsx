import { GovukLogo } from "./GovukLogo";

type GovukHeaderProps = {
  serviceName: string;
};

/** GOV.UK Frontend v5+ header + service navigation (CSS only — no Design System JS). */
export function GovukHeader({ serviceName }: GovukHeaderProps) {
  return (
    <header className="govuk-template__header">
      <div className="govuk-header">
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <a href="/" className="govuk-header__homepage-link">
              <GovukLogo className="govuk-header__logotype" />
            </a>
          </div>
        </div>
      </div>

      <section
        className="govuk-service-navigation"
        aria-label="Service information"
      >
        <div className="govuk-width-container">
          <div className="govuk-service-navigation__container">
            <span className="govuk-service-navigation__service-name">
              <a href="/" className="govuk-service-navigation__link">
                {serviceName}
              </a>
            </span>
          </div>
        </div>
      </section>
    </header>
  );
}
