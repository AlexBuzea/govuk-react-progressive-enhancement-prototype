import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateOrganisation } from "./validation";

const valid = { organisationName: "Acme Ltd", companyNumber: "01234567", contactEmail: "" };

describe("validateOrganisation", () => {
  it("accepts valid answers with the optional email left blank", () => {
    assert.deepEqual(validateOrganisation(valid), {});
  });

  it("asks for the name and company number", () => {
    const errors = validateOrganisation({ organisationName: "", companyNumber: "", contactEmail: "" });
    assert.equal(errors.organisationName, "Enter your organisation name");
    assert.equal(errors.companyNumber, "Enter your company number");
  });

  it("rejects a company number that is not 8 letters or digits", () => {
    assert.equal(
      validateOrganisation({ ...valid, companyNumber: "123" }).companyNumber,
      "Enter a real company number, like 01234567"
    );
  });

  it("accepts a company number with letters, e.g. a Scottish company", () => {
    assert.deepEqual(validateOrganisation({ ...valid, companyNumber: "SC123456" }), {});
  });

  it("only checks the optional email when it is filled in", () => {
    assert.deepEqual(validateOrganisation({ ...valid, contactEmail: "name@example.com" }), {});
    assert.match(validateOrganisation({ ...valid, contactEmail: "nope" }).contactEmail ?? "", /correct format/);
  });
});
