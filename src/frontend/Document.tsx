import { Outlet } from "react-router-dom";
import { Layout } from "./layout/Layout";

/**
 * The <html> shell: head, stylesheets, header/footer, and the current page.
 *
 * The browser tab title is a <title> on each page. React 19 hoists it into
 * this <head> while rendering. Island <script> tags live on the pages that
 * need them — pages without an island send no JavaScript.
 */
export function Document() {
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
        {/* GOV.UK Frontend CSS uses these classes when JS is available */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');",
          }}
        />

        <div id="root">
          <Layout>
            <Outlet />
          </Layout>
        </div>
      </body>
    </html>
  );
}
