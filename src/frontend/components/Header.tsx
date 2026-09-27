type HeaderProps = {
  serviceName: string;
};

export function Header({ serviceName }: HeaderProps) {
  return (
    <header className="govuk-header" role="banner">
      <div className="govuk-header__container">
        <div className="govuk-header__logo">
          <a href="/" className="govuk-header__link govuk-header__link--homepage">
            <span className="govuk-header__logotype-text">GOV.UK</span>
          </a>
        </div>
        <div className="govuk-header__content">
          <a href="/" className="govuk-header__link govuk-header__service-name">
            {serviceName}
          </a>
        </div>
      </div>
    </header>
  );
}
