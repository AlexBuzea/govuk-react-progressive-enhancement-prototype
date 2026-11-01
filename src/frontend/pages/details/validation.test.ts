import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateDetails } from "./validation";

const valid = {
  fullName: "Sam Smith",
  addressLine1: "1 High Street",
  addressLine2: "",
  town: "Rivermead",
  postcode: "SW1A 1AA",
};

describe("validateDetails", () => {
  it("accepts a complete address, with address line 2 left blank", () => {
    assert.deepEqual(validateDetails(valid), {});
  });

  it("asks for every required field", () => {
    const errors = validateDetails({ fullName: "", addressLine1: "", addressLine2: "", town: "", postcode: "" });
    assert.equal(errors.fullName, "Enter your full name");
    assert.equal(errors.addressLine1, "Enter address line 1, typically the building and street");
    assert.equal(errors.town, "Enter town or city");
    assert.equal(errors.postcode, "Enter postcode");
    assert.equal(errors.addressLine2, undefined); // optional
  });

  it("rejects a postcode in the wrong format", () => {
    assert.equal(validateDetails({ ...valid, postcode: "12345" }).postcode, "Enter a real postcode");
  });

  it("accepts postcodes with or without a space", () => {
    assert.deepEqual(validateDetails({ ...valid, postcode: "SW1A1AA" }), {});
    assert.deepEqual(validateDetails({ ...valid, postcode: "M1 1AE" }), {});
  });
});
