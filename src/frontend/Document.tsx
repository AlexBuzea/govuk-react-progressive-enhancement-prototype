import type { ReactNode } from "react";

type DocumentProps = {
  children: ReactNode;
  title: string;
  /** Load /client.js (only needed on pages with islands, e.g. /check).
   *  Island = interactive browser React attached to existing server HTML
   *  (not a full client page). */
  loadClientJs?: boolean;
};

/** HTML wrapper around the React app (sent from the server). */
export function Document({
  children,
  title,
  loadClientJs = false,
}: DocumentProps) {
  return (
    <html lang="en" className="govuk-template">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0c0c" />
        <title>{title}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="govuk-template__body">
        <div id="root">{children}</div>

        {loadClientJs ? <script src="/client.js" defer /> : null}
      </body>
    </html>
  );
}
