import { Route, Routes } from "react-router-dom";
import type { PageData } from "../shared/types";
import { Document } from "./Document";
import { ApplyPage } from "./pages/apply/ApplyPage";
import { CheckPage } from "./pages/check/CheckPage";
import { ConfirmationPage } from "./pages/confirmation/ConfirmationPage";
import { CustomisePage } from "./pages/customise/CustomisePage";
import { DetailsPage } from "./pages/details/DetailsPage";
import { HomePage } from "./pages/home/HomePage";
import { NotFoundPage } from "./pages/not-found/NotFoundPage";
import { OrganisationDetailsPage } from "./pages/organisation-details/OrganisationDetailsPage";

/**
 * Pages in visit order: / → /apply → /details → /customise → /check → /confirmation
 * (commercial permits visit /organisation-details instead of /details)
 *
 * Each page renders its own <title>. React 19 moves that into <head>.
 * Form POSTs are handled in backend/routes.tsx so they work without JavaScript.
 *
 * >>> To add a page: create the component and add a <Route> below.
 */

type AppProps = {
  data: PageData;
};

export function App({ data }: AppProps) {
  return (
    <Routes>
      <Route element={<Document />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/apply"
          element={<ApplyPage application={data.application} counter={data.counter} />}
        />
        <Route
          path="/details"
          element={<DetailsPage details={data.details} errors={data.detailsErrors} />}
        />
        <Route
          path="/organisation-details"
          element={
            <OrganisationDetailsPage
              organisation={data.organisation}
              errors={data.organisationErrors}
            />
          }
        />
        <Route
          path="/customise"
          element={
            <CustomisePage
              permitType={data.application.permitType}
              customise={data.customise}
              errors={data.customiseErrors}
              zoneQuery={data.zoneQuery}
            />
          }
        />
        <Route
          path="/check"
          element={
            <CheckPage
              application={data.application}
              details={data.details}
              organisation={data.organisation}
              customise={data.customise}
            />
          }
        />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
