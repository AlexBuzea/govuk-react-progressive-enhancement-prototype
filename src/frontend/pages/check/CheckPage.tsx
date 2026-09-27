import type { ApplicationData } from "../../../shared/types";
import { BackLink } from "../../components/BackLink";
import { Button } from "../../components/Button";
import { Counter } from "./Counter";

type CheckPageProps = {
  application: ApplicationData;
  counter: number;
};

function permitLabel(permitType: string): string {
  if (permitType === "resident") return "Resident permit";
  if (permitType === "visitor") return "Visitor permit";
  return "Not provided";
}

export function CheckPage({ application, counter }: CheckPageProps) {
  const hasAnswers =
    application.fullName || application.vehicleReg || application.permitType;

  return (
    <>
      <BackLink href="/apply" />
      <h1 className="govuk-heading-l">Check your answers</h1>

      {!hasAnswers ? (
        <p className="govuk-body">
          You have not entered any details yet.{" "}
          <a className="govuk-link" href="/apply">
            Go back to the application form
          </a>
          .
        </p>
      ) : (
        <>
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Full name</dt>
              <dd className="govuk-summary-list__value">
                {application.fullName || "Not provided"}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a className="govuk-link" href="/apply">
                  Change
                  <span className="govuk-visually-hidden"> full name</span>
                </a>
              </dd>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Vehicle registration</dt>
              <dd className="govuk-summary-list__value">
                {application.vehicleReg || "Not provided"}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a className="govuk-link" href="/apply">
                  Change
                  <span className="govuk-visually-hidden">
                    {" "}
                    vehicle registration
                  </span>
                </a>
              </dd>
            </div>

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Permit type</dt>
              <dd className="govuk-summary-list__value">
                {permitLabel(application.permitType)}
              </dd>
              <dd className="govuk-summary-list__actions">
                <a className="govuk-link" href="/apply">
                  Change
                  <span className="govuk-visually-hidden"> permit type</span>
                </a>
              </dd>
            </div>
          </dl>

          <form method="post" action="/submit">
            <Button type="submit">Accept and send</Button>
          </form>
        </>
      )}

      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      {/*
        Island = interactive browser React attached to existing server HTML
        (not a full client page).

        - Server already rendered this HTML
        - If JS is on, client.tsx hydrates #counter-root so clicks update instantly
        - If JS is off, the <form> still POSTs to the server

        >>> To add another island on a page, copy this pattern, e.g.:
        <div id="date-picker-root" data-initial-value={value}>
          <DatePicker initialValue={value} />
        </div>
        Then hydrate that id in frontend/client.tsx, and load /client.js
        for that page in backend/ssr.tsx (loadClientJs).
      */}
      <div id="counter-root" data-initial-count={counter}>
        <Counter initialCount={counter} />
      </div>
    </>
  );
}
