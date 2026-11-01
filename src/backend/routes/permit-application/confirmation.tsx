import type { RequestHandler } from "express";
import { ConfirmationPage } from "../../../frontend/pages/confirmation/ConfirmationPage";
import { render } from "../../utils/render";

export const showConfirmationPage: RequestHandler = (_req, res) => {
  render(res, <ConfirmationPage />);
};
