import assert from "node:assert/strict";
import { describe, it } from "node:test";
import axe from "axe-core";
import { JSDOM } from "jsdom";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Document } from "../Document";
import { ApplyPage } from "./apply/ApplyPage";
import { CheckPage } from "./check/CheckPage";
import { ConfirmationPage } from "./confirmation/ConfirmationPage";
import { CustomisePage } from "./customise/CustomisePage";
import { DetailsPage } from "./details/DetailsPage";
import { HomePage } from "./home/HomePage";
import { HelpPage } from "./help/HelpPage";
import { NotFoundPage } from "./not-found/NotFoundPage";
import { OrganisationDetailsPage } from "./organisation-details/OrganisationDetailsPage";
import { SessionExpiredPage } from "./session-expired/SessionExpiredPage";
import { emptyApplication, emptyCustomise, emptyDetails, emptyOrganisation } from "../../backend/session/store";

/**
 * Automated accessibility check (axe-core, the engine behind most accessibility
 * tools) on the HTML of every page, in the states users actually see:
 * empty, and with validation errors.
 *
 * This catches things like missing labels, bad ARIA and missing landmarks.
 * It does not replace testing with a screen reader. Colour contrast needs a
 * real browser, so it is switched off here.
 */
async function violationsFor(page: ReactNode): Promise<string[]> {
  const html = "<!DOCTYPE html>" + renderToStaticMarkup(<Document>{page}</Document>);

  // axe runs inside a fake browser window; "outside-only" lets us load axe into it
  const dom = new JSDOM(html, { runScripts: "outside-only" });
  dom.window.eval(axe.source);

  const results = await (dom.window as any).axe.run(dom.window.document, {
    rules: { "color-contrast": { enabled: false } },
  });

  // Array.from copies the result out of the fake window into a normal array
  return Array.from(
    results.violations as any[],
    (violation) => `${violation.id}: ${violation.help} (${Array.from(violation.nodes as any[], (n) => n.target).join(" | ")})`
  );
}

const csrfToken = "test-token";

const pages: Record<string, ReactNode> = {
  "start page": <HomePage />,
  "apply": <ApplyPage application={emptyApplication} counter={0} csrfToken={csrfToken} />,
  "details": <DetailsPage details={emptyDetails} errors={{}} csrfToken={csrfToken} />,
  "details with errors": (
    <DetailsPage
      details={emptyDetails}
      errors={{ fullName: "Enter your full name", postcode: "Enter postcode" }}
      csrfToken={csrfToken}
    />
  ),
  "organisation details with errors": (
    <OrganisationDetailsPage
      organisation={emptyOrganisation}
      errors={{ organisationName: "Enter your organisation name", contactEmail: "Enter an email address" }}
      csrfToken={csrfToken}
    />
  ),
  "customise": (
    <CustomisePage customise={emptyCustomise} errors={{}} zoneQuery="" permitType="resident" csrfToken={csrfToken} />
  ),
  "customise with errors": (
    <CustomisePage
      customise={emptyCustomise}
      errors={{ duration: "Select how long you need the permit", zoneId: "Select a parking zone" }}
      zoneQuery=""
      permitType="resident"
      csrfToken={csrfToken}
    />
  ),
  "check your answers": (
    <CheckPage
      application={{ vehicleReg: "AB12CDE", permitType: "resident" }}
      details={{ fullName: "Sam Smith", addressLine1: "1 High Street", addressLine2: "", town: "Rivermead", postcode: "SW1A 1AA" }}
      organisation={emptyOrganisation}
      customise={{ duration: "6", visitorBay: "no", visitorEndDate: "", zoneId: "RM-A1" }}
      csrfToken={csrfToken}
    />
  ),
  "confirmation": <ConfirmationPage />,
  "help and contact": <HelpPage />,
  "page not found": <NotFoundPage />,
  "session ended": <SessionExpiredPage />,
};

describe("accessibility (axe)", () => {
  for (const [name, page] of Object.entries(pages)) {
    it(`${name} has no violations`, async () => {
      assert.deepEqual(await violationsFor(page), []);
    });
  }
});
