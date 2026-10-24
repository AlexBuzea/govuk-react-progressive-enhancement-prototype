import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Form field name. Also used as the id, so error summary links can jump here. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** Hides the field, but keeps it in the form so its value is still submitted. */
  hidden?: boolean;
};

/**
 * GOV.UK text input: https://design-system.service.gov.uk/components/text-input/
 *
 * Any other <input> attribute can be passed through, e.g. defaultValue for a
 * plain HTML form, or value + onChange inside an island.
 */
export function TextInput({
  name,
  label,
  hint,
  error,
  hidden,
  className = "",
  ...inputProps
}: TextInputProps) {
  const hintId = `${name}-hint`;

  return (
    <div className={`govuk-form-group${error ? " govuk-form-group--error" : ""}`} hidden={hidden}>
      <label className="govuk-label" htmlFor={name}>
        {label}
      </label>

      {hint ? (
        <div id={hintId} className="govuk-hint">
          {hint}
        </div>
      ) : null}

      {error ? (
        <p className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {error}
        </p>
      ) : null}

      <input
        className={`govuk-input ${className}${error ? " govuk-input--error" : ""}`.trim()}
        id={name}
        name={name}
        aria-describedby={hint ? hintId : undefined}
        {...inputProps}
      />
    </div>
  );
}
