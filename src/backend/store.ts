import type { ApplicationData, AppData } from "../shared/types";

// Simple in-memory data (lost when the server restarts)

let application: ApplicationData = {
  fullName: "",
  vehicleReg: "",
  permitType: "",
};

let counter = 0;

export const store = {
  getAppData(): AppData {
    return { application, counter };
  },

  saveApplication(data: ApplicationData): void {
    application = { ...data };
  },

  incrementCounter(): number {
    counter += 1;
    return counter;
  },
};
