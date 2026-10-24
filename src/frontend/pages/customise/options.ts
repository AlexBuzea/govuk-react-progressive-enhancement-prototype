import type { CustomiseData, CustomiseErrors } from "../../../shared/types";

/**
 * Choices and helpers for the permit-options form.
 *
 * Used by CustomiseForm (browser island), POST /customise (server), and
 * CheckPage — one place so labels, validation and prices cannot drift apart.
 */

export const DURATIONS = [
  { value: "1", label: "1 month", price: 30 },
  { value: "6", label: "6 months", price: 150 },
  { value: "12", label: "12 months", price: 270 },
] as const;

export const VISITOR_BAY_PRICE = 25;

export const YES_NO = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

export const PARKING_ZONES = [
  { id: "RM-A1", name: "Riverside North", area: "Riverside" },
  { id: "RM-A2", name: "Riverside South", area: "Riverside" },
  { id: "RM-B1", name: "Bridge Street", area: "Town centre" },
  { id: "RM-B2", name: "Market Square", area: "Town centre" },
  { id: "RM-C1", name: "Canal Walk", area: "Canal district" },
  { id: "RM-C2", name: "Wharf Lane", area: "Canal district" },
  { id: "RM-D1", name: "Station Approach", area: "Station" },
  { id: "RM-D2", name: "Platform Road", area: "Station" },
  { id: "RM-E1", name: "Hilltop Estate", area: "Residential" },
  { id: "RM-E2", name: "Meadow Close", area: "Residential" },
];

export function findZone(id: string) {
  return PARKING_ZONES.find((zone) => zone.id === id);
}

export function filterZones(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return PARKING_ZONES;
  return PARKING_ZONES.filter(
    (zone) =>
      zone.id.toLowerCase().includes(q) ||
      zone.name.toLowerCase().includes(q) ||
      zone.area.toLowerCase().includes(q)
  );
}

export function validateCustomise(data: CustomiseData): CustomiseErrors {
  const errors: CustomiseErrors = {};

  if (!data.duration) {
    errors.duration = "Select how long you need the permit";
  }
  if (!data.visitorBay) {
    errors.visitorBay = "Select yes or no";
  }
  if (data.visitorBay === "yes" && !data.visitorEndDate.trim()) {
    errors.visitorEndDate = "Enter an end date for the visitor bay";
  }
  if (!findZone(data.zoneId)) {
    errors.zoneId = "Select a parking zone";
  }

  return errors;
}

export function hasErrors(errors: CustomiseErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function calculatePrice(duration: string, visitorBay: string): number | null {
  const chosen = DURATIONS.find((option) => option.value === duration);
  if (!chosen) return null;
  return chosen.price + (visitorBay === "yes" ? VISITOR_BAY_PRICE : 0);
}

export function formatPrice(pounds: number): string {
  return `£${pounds}`;
}
