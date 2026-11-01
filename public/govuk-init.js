// Starts the GOV.UK Design System JavaScript on every component marked with
// data-module (error summary, radios...). The file is served by backend/middleware/static-files.ts.
import { initAll } from "/govuk-frontend.min.js";

initAll();
