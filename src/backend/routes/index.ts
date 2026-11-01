import { Router } from "express";
import { showNotFoundPage } from "./not-found";
import { permitApplicationRoutes } from "./permit-application";
import { showStartPage } from "./start";

/**
 * Everything the service serves, from the top.
 *
 * A "journey" is a series of pages that make up one task for the user. Each
 * journey has its own folder with its own route list that reads the same way
 * (see permit-application/index.ts).
 *
 * >>> To add a journey (e.g. renewing a permit): copy the permit-application
 *     folder, then add one line below. Give it a URL prefix with
 *     routes.use("/renew", renewRoutes) if its URLs should start with /renew.
 */
export const routes = Router();

routes.get("/", showStartPage); // <HomePage>

routes.use(permitApplicationRoutes); // /apply → /details → /customise → /check → /confirmation

// Last, so it only runs when no route above matched
routes.use(showNotFoundPage); // <NotFoundPage> (404)
