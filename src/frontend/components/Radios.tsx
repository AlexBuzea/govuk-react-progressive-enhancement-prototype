type RadioOption = {
  value: string;
  label: string;
};

type RadiosProps = {
  name: string;
  legend: string;
  options: RadioOption[];
  value?: string;
};

export function Radios({ name, legend, options, value }: RadiosProps) {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
          {legend}
        </legend>
        <div className="govuk-radios">
          {options.map((option) => {
            const id = `${name}-${option.value}`;
            return (
              <div className="govuk-radios__item" key={option.value}>
                <input
                  className="govuk-radios__input"
                  id={id}
                  name={name}
                  type="radio"
                  value={option.value}
                  defaultChecked={value === option.value}
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
