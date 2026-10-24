type Option = {
  value: string;
  label: string;
};

type RadiosProps = {
  name: string;
  legend: string;
  options: Option[];
  value?: string;
  error?: string;
  /**
   * Provide onChange to make the radios controlled (React tracks state).
   * Leave it out for a plain HTML form (the browser tracks state).
   */
  onChange?: (value: string) => void;
};

/** GOV.UK radio buttons: https://design-system.service.gov.uk/components/radios/ */
export function Radios({ name, legend, options, value, error, onChange }: RadiosProps) {
  return (
    <div className={`govuk-form-group${error ? " govuk-form-group--error" : ""}`}>
      <fieldset className="govuk-fieldset" id={name}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{legend}</legend>

        {error ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        ) : null}

        <div className="govuk-radios">
          {options.map((option) => {
            const id = `${name}-${option.value}`;

            // Controlled (React island): onChange is provided, React owns the checked state.
            // Uncontrolled (plain HTML form): no onChange, the browser owns the checked state.
            const checkedProps = onChange
              ? { checked: value === option.value, onChange: () => onChange(option.value) }
              : { defaultChecked: value === option.value };

            return (
              <div className="govuk-radios__item" key={option.value}>
                <input
                  className="govuk-radios__input"
                  id={id}
                  name={name}
                  type="radio"
                  value={option.value}
                  {...checkedProps}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={id}>
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
