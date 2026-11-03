import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GovukErrorSummary } from "./GovukErrorSummary";
import { GovukRadios } from "./GovukRadios";
import { GovukInput } from "./GovukInput";

// The components should produce the same markup as the GOV.UK Design System
// Nunjucks macros. These tests check the parts screen readers depend on.

describe("GovukInput", () => {
  it("links the hint and the error to the input with aria-describedby", () => {
    const html = renderToStaticMarkup(
      <GovukInput name="town" label="Town" hint="For example, Leeds" error="Enter town" />
    );
    assert.match(html, /<div id="town-hint"/);
    assert.match(html, /<p id="town-error" class="govuk-error-message">/);
    assert.match(html, /aria-describedby="town-hint town-error"/);
    assert.match(html, /govuk-input--error/);
  });

  it("has no aria-describedby when there is no hint or error", () => {
    const html = renderToStaticMarkup(<GovukInput name="town" label="Town" />);
    assert.doesNotMatch(html, /aria-describedby/);
  });

  it("labels the input", () => {
    const html = renderToStaticMarkup(<GovukInput name="town" label="Town" />);
    assert.match(html, /<label class="govuk-label" for="town">Town<\/label>/);
  });
});

describe("GovukRadios", () => {
  const options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  it("gives the first radio the field name as its id, so error summary links land on it", () => {
    const html = renderToStaticMarkup(<GovukRadios name="bay" legend="Bay?" options={options} />);
    assert.match(html, /id="bay"[^>]*name="bay"[^>]*value="yes"/);
    assert.match(html, /id="bay-2"[^>]*name="bay"[^>]*value="no"/);
  });

  it("links the error to the fieldset with aria-describedby", () => {
    const html = renderToStaticMarkup(
      <GovukRadios name="bay" legend="Bay?" options={options} error="Select yes or no" />
    );
    assert.match(html, /<fieldset class="govuk-fieldset" aria-describedby="bay-error">/);
    assert.match(html, /<p id="bay-error" class="govuk-error-message">/);
  });
});

describe("GovukErrorSummary", () => {
  it("renders nothing when there are no errors", () => {
    assert.equal(renderToStaticMarkup(<GovukErrorSummary errors={{ town: undefined }} />), "");
  });

  it("can take focus, is announced, and links to each field", () => {
    const html = renderToStaticMarkup(<GovukErrorSummary errors={{ town: "Enter town", postcode: "Enter postcode" }} />);
    assert.match(html, /data-module="govuk-error-summary"/); // GOV.UK JS focuses it on page load
    assert.match(html, /id="error-summary"[^>]*tabindex="-1"|tabindex="-1"[^>]*id="error-summary"/);
    assert.match(html, /<div role="alert">/);
    assert.match(html, /<a href="#town">Enter town<\/a>/);
    assert.match(html, /<a href="#postcode">Enter postcode<\/a>/);
  });
});
