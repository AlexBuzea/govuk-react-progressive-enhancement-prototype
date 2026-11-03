import type { ButtonHTMLAttributes, ReactNode } from "react";

type GovukButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GovukButton({
  children,
  className = "",
  type = "submit",
  ...rest
}: GovukButtonProps) {
  const classes = ["govuk-button", className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
