import type { ApplicationData, CustomiseData } from "../shared/types";

/**
 * In-memory "database" for the prototype.
 *
 * One copy, shared by every visitor, reset when the server restarts.
 * A real service would keep this per user (session or database) — the
 * routes would not need to change, only where the data comes from.
 */

export const emptyApplication: ApplicationData = {
  fullName: "",
  vehicleReg: "",
  permitType: "",
};

export const emptyCustomise: CustomiseData = {
  duration: "",
  visitorBay: "",
  visitorEndDate: "",
  zoneId: "",
};

export const store = {
  application: emptyApplication,
  customise: emptyCustomise,
  counter: 0,
};
