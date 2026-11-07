import { expect, test } from "@playwright/test";

/**
 * Progressive enhancement, tested in a real browser.
 *
 * 1. JavaScript off: the whole journey can be completed.
 * 2. JavaScript on, but the island scripts fail: the page still works as a plain form.
 * 3. JavaScript on and working: the islands improve the page (so 1 and 2 are
 *    really testing a fallback, not the only version).
 *
 * Each test starts with a new browser, so no answers carry over between tests.
 */

test.describe("JavaScript turned off", () => {
  // Chromium runs no scripts at all on the page, as if JavaScript were switched off in the browser
  test.use({ javaScriptEnabled: false });

  test("a resident can complete the whole journey", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start now" }).click();

    await page.getByLabel("Vehicle registration number").fill("AB12 CDE");
    await page.getByLabel("Resident permit").check();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Your name and address" })).toBeVisible();
    await page.getByLabel("Full name").fill("Sam Smith");
    await page.getByLabel("Address line 1").fill("1 High Street");
    await page.getByLabel("Town or city").fill("Rivermead");
    await page.getByLabel("Postcode").fill("SW1A 1AA");
    await page.getByRole("button", { name: "Save and continue" }).click();

    await expect(page).toHaveURL(/\/customise$/);
    await page.getByLabel("6 months").check();
    await page.getByLabel("No", { exact: true }).check();
    await page.getByLabel("Riverside North").check();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Check your answers" })).toBeVisible();
    await expect(page.getByText("AB12 CDE")).toBeVisible();
    await expect(page.getByText("Riverside North (RM-A1)")).toBeVisible();
    await expect(page.getByText("£150")).toBeVisible();
    await page.getByRole("button", { name: "Accept and send" }).click();

    await expect(page.getByRole("heading", { name: "Application complete" })).toBeVisible();
  });

  test("a commercial applicant is sent to organisation details", async ({ page }) => {
    await page.goto("/apply");
    await page.getByLabel("Vehicle registration number").fill("AB12 CDE");
    await page.getByLabel("Commercial permit").check();
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL(/\/organisation-details$/);
  });

  test("errors come from the server, with the answers kept", async ({ page }) => {
    await page.goto("/details");
    await page.getByLabel("Full name").fill("Sam Smith");
    await page.getByRole("button", { name: "Save and continue" }).click();

    await expect(page).toHaveTitle(/^Error: Your name and address/);
    await expect(page.getByRole("link", { name: "Enter address line 1, typically the building and street" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveValue("Sam Smith");
  });

  test("the customise page filters zones with a reload and validates on the server", async ({ page }) => {
    await page.goto("/customise");

    // Without JS there is a "Filter zones" button, which reloads the page with ?q=canal
    await page.getByLabel("Filter zones").fill("canal");
    await page.getByRole("button", { name: "Filter zones" }).click();
    await expect(page).toHaveURL(/q=canal/);
    await expect(page.getByLabel("Canal Walk")).toBeVisible();
    await expect(page.getByLabel("Riverside North")).toHaveCount(0);

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("link", { name: "Select how long you need the permit" })).toBeVisible();
  });

  test("the counter saves each click with a form post", async ({ page }) => {
    await page.goto("/apply");
    await expect(page.locator("#counter-value")).toHaveText("0");

    await page.getByRole("button", { name: "Increment counter" }).click();

    await expect(page).toHaveURL(/\/apply$/); // the server redirects back after the post
    await expect(page.locator("#counter-value")).toHaveText("1");
  });
});

test.describe("JavaScript on, but the island scripts fail", () => {
  // JavaScript is on, so the GOV.UK Frontend scripts still run. Only the island scripts
  // (and the React chunk they share, all under /islands/) are made to fail.

  test("the customise page still works when the island scripts cannot load", async ({ page }) => {
    // Cancel every request for an island script, like a network error or an outage
    await page.route("**/islands/**", (route) => route.abort());

    // networkidle: wait until nothing more is loading, so a working island would have had time to start
    await page.goto("/customise", { waitUntil: "networkidle" });

    // This button only shows before React has started, so seeing it means React never started
    await expect(page.getByRole("button", { name: "Filter zones" })).toBeVisible();

    // The plain HTML form still submits to the server
    await page.getByLabel("6 months").check();
    await page.getByLabel("No", { exact: true }).check();
    await page.getByLabel("Riverside North").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: "Check your answers" })).toBeVisible();
  });

  test("the customise page still works when the island scripts crash", async ({ page }) => {
    // Answer every request for an island script with a script that throws an error as soon as it runs
    await page.route("**/islands/**", (route) =>
      route.fulfill({ contentType: "text/javascript", body: 'throw new Error("island failed");' })
    );

    await page.goto("/customise", { waitUntil: "networkidle" });

    await expect(page.getByRole("button", { name: "Filter zones" })).toBeVisible();

    await page.getByLabel("6 months").check();
    await page.getByLabel("No", { exact: true }).check();
    await page.getByLabel("Riverside North").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: "Check your answers" })).toBeVisible();
  });
});

test.describe("JavaScript on and working", () => {
  test("the customise island updates the price, filters zones and checks answers without a reload", async ({ page }) => {
    await page.goto("/customise");

    // The "Filter zones" button disappears once React has started, so wait for that
    // before clicking anything (otherwise React could reset what was clicked)
    await expect(page.getByRole("button", { name: "Filter zones" })).toHaveCount(0);

    await page.getByLabel("6 months").check();
    await expect(page.locator(".app-price-box")).toContainText("£150");
    await page.getByLabel("Yes", { exact: true }).check();
    await expect(page.locator(".app-price-box")).toContainText("£175");

    await page.getByLabel("Filter zones").fill("canal");
    await expect(page.getByLabel("Canal Walk")).toBeVisible();
    await expect(page.getByLabel("Riverside North")).toHaveCount(0);

    // The form posts back to /customise, so the URL would look the same after a reload.
    // Instead, set a value on the page: a reload would wipe it.
    await page.evaluate(() => ((window as any).notReloaded = true));

    // The end date and zone are missing, so the error shows straight away
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("link", { name: "Enter an end date for the visitor bay" })).toBeVisible();
    expect(await page.evaluate(() => (window as any).notReloaded)).toBe(true);
  });
});
