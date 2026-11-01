import type { RequestHandler } from "express";
import { HelpPage } from "../../frontend/pages/help/HelpPage";
import { render } from "../utils/render";

// A page with no form and no data needs just this: render the component.
export const showHelpPage: RequestHandler = (_req, res) => {
  render(res, <HelpPage />);
};
