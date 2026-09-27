export type ApplicationData = {
  fullName: string;
  vehicleReg: string;
  permitType: string;
};

export type AppData = {
  application: ApplicationData;
  counter: number;
};

export const SERVICE_NAME = "Apply for a parking permit";
