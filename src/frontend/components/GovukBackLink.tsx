type GovukBackLinkProps = {
  href: string;
  children?: string;
};

export function GovukBackLink({ href, children = "Back" }: GovukBackLinkProps) {
  return (
    <a href={href} className="govuk-back-link">
      {children}
    </a>
  );
}
