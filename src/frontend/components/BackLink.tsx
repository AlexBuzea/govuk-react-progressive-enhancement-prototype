type BackLinkProps = {
  href: string;
  children?: string;
};

export function BackLink({ href, children = "Back" }: BackLinkProps) {
  return (
    <a href={href} className="govuk-back-link">
      {children}
    </a>
  );
}
