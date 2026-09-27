import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { Response } from "express";
import { App } from "../frontend/App";
import { Document } from "../frontend/Document";
import { pageTitles } from "../frontend/routes";
import type { AppData } from "../shared/types";

/**
 * Turn a React app into HTML and stream it to the browser.
 * React Router (StaticRouter) chooses which page to render from the URL.
 */
export function renderApp(
  url: string,
  data: AppData,
  res: Response,
  statusCode = 200
): void {
  const pathname = url.split("?")[0] || "/";
  const title = pageTitles[pathname] ?? "Page not found — GOV.UK";

  // Load /client.js only on pages that have an island
  // (Island = interactive browser React attached to existing server HTML
  //  — not a full client page).
  //
  // >>> When another page needs browser JS, add its path here, e.g.:
  // const loadClientJs =
  //   pathname === "/check" ||
  //   pathname === "/apply"; // e.g. Apply page got a date-picker island
  const loadClientJs = pathname === "/check";

  let didError = false;

  const { pipe } = renderToPipeableStream(
    <Document title={title} loadClientJs={loadClientJs}>
      <StaticRouter location={url}>
        <App data={data} />
      </StaticRouter>
    </Document>,
    {
      onShellReady() {
        res.statusCode = didError ? 500 : statusCode;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write("<!DOCTYPE html>");
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
    }
  );
}
