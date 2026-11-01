import type { RequestHandler } from "express";
import { HomePage } from "../../frontend/pages/home/HomePage";
import { render } from "../utils/render";

export const showStartPage: RequestHandler = (_req, res) => {
  render(res, <HomePage />);
};
