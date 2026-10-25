import type { Response } from "express";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "../frontend/App";
import type { PageData } from "../shared/types";

/**
 * Turn the React app into HTML and stream it to the browser.
 *
 * StaticRouter tells React Router which URL this request is for, so
 * <Routes> in frontend/App.tsx picks the page. Express does not list
 * a GET for every page — one catch-all calls this function.
 *
 * renderToPipeableStream is React's standard server rendering API: the browser
 * starts receiving HTML as soon as the page shell is ready. The result is a
 * complete HTML page, so forms work with or without JavaScript.
 */
export function renderApp(url: string, data: PageData, res: Response): void {
  let didError = false;

  const { pipe } = renderToPipeableStream(
    <StaticRouter location={url}>
      <App data={data} />
    </StaticRouter>,
    {
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
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
    }
  );
}
