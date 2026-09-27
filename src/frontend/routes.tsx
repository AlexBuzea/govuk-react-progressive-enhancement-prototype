import { Route, Routes } from "react-router-dom";
import type { AppData } from "../shared/types";
import { ApplyPage } from "./pages/apply/ApplyPage";
import { CheckPage } from "./pages/check/CheckPage";
import { ConfirmationPage } from "./pages/confirmation/ConfirmationPage";
import { HomePage } from "./pages/home/HomePage";
import { NotFoundPage } from "./pages/not-found/NotFoundPage";

/** Browser tab titles for each page. */
export const pageTitles: Record<string, string> = {
  "/": "Apply for a parking permit — GOV.UK",
  "/apply": "Your application — Apply for a parking permit — GOV.UK",
  "/check": "Check your answers — Apply for a parking permit — GOV.UK",
  "/confirmation": "Application submitted — Apply for a parking permit — GOV.UK",
  // >>> When you add a new page, add its title here, e.g.:
  // "/payment": "Payment — Apply for a parking permit — GOV.UK",
};

type AppRoutesProps = {
  data: AppData;
};

/**
 * React Router pages — used on the server via StaticRouter.
 * This is the list of URLs → page components.
 */
export function AppRoutes({ data }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/apply"
        element={<ApplyPage application={data.application} />}
      />
      <Route
        path="/check"
        element={
          <CheckPage
            application={data.application}
            counter={data.counter}
          />
        }
      />
      <Route path="/confirmation" element={<ConfirmationPage />} />

      {/* >>> When you add a new page, add a Route here, e.g.:
          <Route path="/payment" element={<PaymentPage />} />
      */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
