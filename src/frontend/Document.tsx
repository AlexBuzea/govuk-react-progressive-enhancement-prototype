import type { ReactNode } from "react";
import { SERVICE_NAME } from "../shared/types";
import { GovukFooter } from "./components/GovukFooter";
import { GovukHeader } from "./components/GovukHeader";

type DocumentProps = {
  children: ReactNode;
};

/**
 * The <html> shell shared by every page: head, stylesheets, header, footer,
 * and the page itself (children).
 *
 * The browser tab title is a <title> on each page. React 19 hoists it into
 * this <head> while rendering.
 *
 * Scripts, all plain files (no inline scripts, so the strict
 * Content-Security-Policy in backend/middleware/security-headers.ts allows them):
 * - js-enabled.js: tells the GOV.UK CSS that JavaScript is available
 * - govuk-init.js: GOV.UK Design System behaviour, e.g. focusing the error summary
 * - Island scripts (React) are added by the pages that need them. Pages
 *   without an island send no React.
 */
export function Document({ children }: DocumentProps) {
  return (
    <html lang="en" className="govuk-template">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1d70b8" />
        <link rel="icon" sizes="any" href="/assets/images/favicon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/assets/images/govuk-icon-mask.svg" color="#1d70b8" />
        <link rel="apple-touch-icon" href="/assets/images/govuk-icon-180.png" />
        <link rel="stylesheet" href="/govuk-frontend.min.css" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="govuk-template__body">
        <script src="/js-enabled.js" />

        <a href="#main-content" className="govuk-skip-link">
          Skip to main content
        </a>

        <GovukHeader serviceName={SERVICE_NAME} />

        <div className="govuk-width-container">
          <main className="govuk-main-wrapper" id="main-content">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">{children}</div>
            </div>
          </main>
        </div>

        <GovukFooter />

        <script type="module" src="/govuk-init.js" />
      </body>
    </html>
  );
}
