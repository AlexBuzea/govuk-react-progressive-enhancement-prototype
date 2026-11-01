import type { RequestHandler } from "express";
import { NotFoundPage } from "../../frontend/pages/not-found/NotFoundPage";
import { render } from "../utils/render";

/** Runs for any URL no other route handled. */
export const showNotFoundPage: RequestHandler = (_req, res) => {
  render(res, <NotFoundPage />, 404);
};
