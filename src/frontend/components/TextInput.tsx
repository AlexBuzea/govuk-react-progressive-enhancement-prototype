import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  name: string;
  label: string;
  hint?: string;
};

export function TextInput({
  id,
  name,
  label,
  hint,
  className = "",
  ...rest
}: TextInputProps) {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <div id={`${id}-hint`} className="govuk-hint">
          {hint}
        </div>
      ) : null}
      <input
        className={`govuk-input ${className}`.trim()}
        id={id}
        name={name}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...rest}
      />
    </div>
  );
}
