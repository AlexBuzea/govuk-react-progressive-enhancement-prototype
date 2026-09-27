import type { ReactNode } from "react";
import { SERVICE_NAME } from "../../shared/types";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <a href="#main-content" className="govuk-skip-link">
        Skip to main content
      </a>

      <Header serviceName={SERVICE_NAME} />

      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">{children}</div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
