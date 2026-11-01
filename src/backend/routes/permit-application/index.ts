import { Router } from "express";
import { incrementCounter, saveApply, showApplyPage } from "./apply";
import { showCheckPage, submitApplication } from "./check";
import { showConfirmationPage } from "./confirmation";
import { saveCustomise, showCustomisePage } from "./customise";
import { saveDetails, showDetailsPage } from "./details";
import { saveOrganisationDetails, showOrganisationDetailsPage } from "./organisation-details";

/**
 * The permit application journey: one line per page, in the order a user visits them.
 *
 *   router.route(URL).get(show the page).post(handle its form)   // component, then where the form goes next
 *
 * The form on each page posts back to the page's own URL. If the answers are
 * invalid, the same page is shown again with errors; otherwise the user goes on
 * to the page after "→".
 *
 * The handlers live in this folder, one file per page. Their redirects are the
 * source of truth; keep the "→" comments here in step with them.
 *
 * >>> To add a page: create the component in frontend/pages/, add its handlers
 *     in a file here (copy details.tsx for a form), then add one line below.
 */
const router = Router();

router.route("/apply").get(showApplyPage).post(saveApply); // <ApplyPage> → /details, or /organisation-details for commercial
router.route("/details").get(showDetailsPage).post(saveDetails); // <DetailsPage> → /customise
router.route("/organisation-details").get(showOrganisationDetailsPage).post(saveOrganisationDetails); // <OrganisationDetailsPage> → /customise
router.route("/customise").get(showCustomisePage).post(saveCustomise); // <CustomisePage> (island) → /check
router.route("/check").get(showCheckPage).post(submitApplication); // <CheckPage> → /confirmation
router.route("/confirmation").get(showConfirmationPage); // <ConfirmationPage>

// Not a page: the counter demo on /apply posts here (→ /apply, or JSON for the island)
router.post("/apply/increment", incrementCounter);

export { router as permitApplicationRoutes };
