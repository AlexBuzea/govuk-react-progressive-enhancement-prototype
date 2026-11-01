import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculatePrice, filterZones, hasErrors, validateCustomise } from "./options";

const valid = { duration: "6", visitorBay: "no", visitorEndDate: "", zoneId: "RM-A1" };

// These rules run on the server AND in the browser island, so they matter twice
describe("validateCustomise", () => {
  it("accepts valid answers", () => {
    assert.equal(hasErrors(validateCustomise(valid)), false);
  });

  it("asks for every required answer", () => {
    const errors = validateCustomise({ duration: "", visitorBay: "", visitorEndDate: "", zoneId: "" });
    assert.deepEqual(Object.keys(errors).sort(), ["duration", "visitorBay", "zoneId"]);
  });

  it("only asks for the end date when a visitor bay is chosen", () => {
    assert.equal(validateCustomise({ ...valid, visitorBay: "yes" }).visitorEndDate, "Enter an end date for the visitor bay");
    assert.equal(validateCustomise(valid).visitorEndDate, undefined);
  });
});

describe("calculatePrice", () => {
  it("adds the visitor bay price", () => {
    assert.equal(calculatePrice("6", "no"), 150);
    assert.equal(calculatePrice("6", "yes"), 175);
  });

  it("has no price until a duration is chosen", () => {
    assert.equal(calculatePrice("", "yes"), null);
  });
});

describe("filterZones", () => {
  it("matches name, id or area, ignoring case", () => {
    assert.deepEqual(filterZones("riverside").map((zone) => zone.id), ["RM-A1", "RM-A2"]);
    assert.deepEqual(filterZones("rm-b1").map((zone) => zone.id), ["RM-B1"]);
  });

  it("returns every zone for an empty search", () => {
    assert.equal(filterZones("  ").length, 10);
  });
});
