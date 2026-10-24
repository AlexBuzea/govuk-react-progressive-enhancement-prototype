# Apply for a parking permit — React SSR prototype

A GOV.UK-style service built with Node/Express, TypeScript, and React. No meta-framework (no Next.js).

It shows one idea: **every page is a working HTML page first, and React makes parts of it better when JavaScript is available.**

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try it with JavaScript turned off in DevTools as well.

---

## How the app works

```
Browser requests /apply
  → Express (backend/routes.tsx) reads data from the store
  → renderApp() streams HTML with renderToPipeableStream (backend/ssr.tsx)
  → React Router (frontend/App.tsx) picks <ApplyPage /> from the URL
  → Browser shows the HTML      ← works here, with or without JS
  → If the page includes a <script> for an island, that JS loads and
    hydrateRoot makes that part interactive
```

Forms are plain HTML forms. They POST to Express, which saves the data and redirects. React never needs to be running for the service to work.

### What is an island?

An island is a React component that is rendered to HTML on the server (so it is visible immediately) and then **also** hydrated in the browser so it becomes interactive. Only the JavaScript for that island is sent. Pages with no island send no JavaScript at all.

| Where | What | Example |
|---|---|---|
| Server (in a page) | Island markup + `<script src="/islands/….js">` | `pages/apply/ApplyPage.tsx` |
| Browser (entry file) | `hydrateRoot(root, <Component {...props} />)` | `islands/counter.tsx` |

### The two islands in this prototype

**Counter on `/apply`** — smallest example: without JS the form POSTs (server waits 1.5 s); with JS the number updates instantly.

**Permit options on `/customise`** — whole form as an island:

| Feature | JS off (server) | JS on (React) |
|---|---|---|
| Validation | POST re-renders with errors | Checked before submit |
| Price | Shown on check page | Updates as you choose |
| Zone search | "Filter zones" reloads the page | Filters as you type |

Form choices and rules live in `pages/customise/options.ts` and run on **both** the server and the island, so they cannot drift apart.

---

## Project structure

```
src/
  backend/
    app.ts          # Express setup and static files
    routes.tsx      # Form POSTs, then one GET that renders the app
    ssr.tsx         # renderApp() → renderToPipeableStream
    store.ts        # In-memory data (prototype only)
  frontend/
    App.tsx         # URL → page component
    Document.tsx    # <html> shell and layout. Pages supply their own <title>
    islands/        # Browser entry points — one file per island
    pages/          # One folder per page
      apply/        # ApplyPage (+ PERMIT_TYPES), Counter
      customise/    # CustomisePage, CustomiseForm, options.ts
      check/        # CheckPage
      …
    components/     # GOV.UK UI pieces
    layout/         # Header, footer, width container
  shared/
    types.ts        # Data shapes + SERVICE_NAME (store, Express, React)
```

### Where to look for what

| Question | File |
|---|---|
| Which URL shows which page? | `frontend/App.tsx` |
| Browser tab title? | `<title>` at the top of the page component |
| Form POST handlers? | `backend/routes.tsx` |
| Customise validation / price / zones? | `pages/customise/options.ts` |
| How does an island hydrate? | `frontend/islands/counter.tsx` |
| How is HTML streamed? | `backend/ssr.tsx` (`renderToPipeableStream`) |
| How are island scripts built? | `vite.config.ts` |

---

## How to add a new page

1. Create `src/frontend/pages/<name>/<Name>Page.tsx`. Put the browser tab title on the page:

```tsx
import { SERVICE_NAME } from "../../../shared/types";

export function MyPage() {
  return (
    <>
      <title>{`My page — ${SERVICE_NAME} — GOV.UK`}</title>
      <h1 className="govuk-heading-l">My page</h1>
    </>
  );
}
```

React 19 moves that `<title>` into `<head>` while rendering.

2. In `App.tsx`, add a `<Route>`.
3. If it has a form, add a POST in `backend/routes.tsx`.

No new GET in Express — one catch-all renders every page.

## How to add an island

1. Build a normal component (props must be JSON-serialisable).
2. On the page, render the island and its script:

```tsx
<div id="my-island" data-props={JSON.stringify({ initialCount: 0 })}>
  <MyComponent initialCount={0} />
</div>
<script type="module" src="/islands/my-island.js" />
```

3. Add `src/frontend/islands/my-island.tsx`:

```tsx
import { hydrateRoot } from "react-dom/client";
import { MyComponent } from "../pages/.../MyComponent";

const root = document.getElementById("my-island");
if (root) {
  const props = JSON.parse(root.dataset.props ?? "{}");
  hydrateRoot(root, <MyComponent {...props} />);
}
```

Vite builds `public/islands/my-island.js` automatically.

Keep the no-JS path working: the form should still POST to a server route that does the same job.

> Look for `>>>` comments — they mark where the next piece goes.
