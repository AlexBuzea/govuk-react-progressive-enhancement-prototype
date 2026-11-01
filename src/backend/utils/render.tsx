import type { Response } from "express";
import type { ReactNode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Document } from "../../frontend/Document";

/**
 * Turn a page component into HTML and stream it to the browser.
 *
 *   render(res, <ApplyPage ... />);          // 200
 *   render(res, <NotFoundPage />, 404);      // other status codes
 *
 * The page is wrapped in <Document> (head, header, footer). The result is a
 * complete HTML page, so forms work with or without JavaScript.
 *
 * renderToPipeableStream is React's standard server rendering API: the browser
 * starts receiving HTML as soon as the page shell is ready.
 */
export function render(res: Response, page: ReactNode, status = 200): void {
  let didError = false;

  const { pipe } = renderToPipeableStream(<Document>{page}</Document>, {
    onShellReady() {
      res.statusCode = didError ? 500 : status;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      // These pages contain personal answers, so the browser must not keep a copy
      res.setHeader("Cache-Control", "no-store");
      // React adds <!DOCTYPE html> itself because the root element is <html>
      pipe(res);
    },
    onShellError(error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Something went wrong while rendering the page.");
    },
    onError(error) {
      didError = true;
      console.error(error);
    },
  });
}
