# Apply for a parking permit — React SSR prototype

A GOV.UK-style service built with Node, Express, TypeScript and React. No meta-framework (no Next.js).

The idea: **every page is a working HTML page first, and React makes parts of it better when JavaScript is available.**

> Prototype only. Data lives in memory (`backend/store.ts`) and is shared by all visitors until the server restarts.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try it with JavaScript turned off in DevTools too.

| Command | What it does |
|---|---|
| `npm run dev` | Rebuilds island scripts and restarts the server on change |
| `npm start` | Builds island scripts once, then starts the server |
| `npm run typecheck` | Type checks the whole project |

---

## How it works

```
Browser requests /apply
  → Express (backend/routes.tsx) reads data from the store
  → renderApp() streams HTML (backend/ssr.tsx)
  → React Router (frontend/App.tsx) picks <ApplyPage /> from the URL
  → Browser shows the HTML          ← works with or without JS
  → If the page has an island <script>, it loads and makes that part interactive
```

Forms are plain HTML forms. They POST to Express, which saves the data and redirects to the next page. The service works without React running in the browser.

### Islands

An island is a React component that is rendered to HTML on the server (visible immediately) and then **hydrated** in the browser so it becomes interactive. Only the JavaScript for that island is sent; pages without an island send no JavaScript.

| Part | Where | Example |
|---|---|---|
| Island markup and `<script>` tag | In the page component | `pages/apply/ApplyPage.tsx` |
| Browser entry (`hydrateRoot`) | `frontend/islands/` | `islands/counter.tsx` |

There are two islands:

- **Counter on `/apply`** — the smallest example. Both save the count through the same `POST /apply/increment`. Without JS the page reloads on every click; with JS the number updates instantly and the request is sent in the background. It is a teaching toy; the permit options form below is the realistic example.
- **Permit options on `/customise`** — the whole form is an island:

| Feature | JS off (server) | JS on (React) |
|---|---|---|
| Validation | POST re-renders the form with errors | Checked before submit |
| Price | Shown on the check page | Updates as you choose |
| Zone search | "Filter zones" reloads the page | Filters as you type |

Choices and rules live in `pages/customise/options.ts` and run on **both** the server and the island, so they cannot drift apart.

---

## Project structure

```
src/
  backend/
    app.ts          Express setup and static files
    routes.tsx      Form POSTs, then one GET that renders any page
    ssr.tsx         renderApp(): React → streamed HTML
    store.ts        In-memory data (prototype only)
  frontend/
    App.tsx         URL → page component
    Document.tsx    <html> shell: head, header, footer, current page
    components/     GOV.UK UI pieces (Button, TextInput, Radios…)
    islands/        Browser entry points, one file per island
    pages/          One folder per page (page component, plus any island and options)
  shared/
    types.ts        Data shapes and SERVICE_NAME, used by backend and frontend
```

### Where to look

| Question | File |
|---|---|
| Which URL shows which page? | `frontend/App.tsx` |
| Page header, footer, stylesheets? | `frontend/Document.tsx` |
| Browser tab title? | `<title>` at the top of the page component |
| What happens on form submit? | `backend/routes.tsx` |
| Customise validation, price, zones? | `pages/customise/options.ts` |
| How does an island hydrate? | `frontend/islands/counter.tsx` |
| How are island scripts built? | `vite.config.ts` |

Search for `>>>` in the code to find where each kind of addition goes.

---

## How to add a page

1. Create `src/frontend/pages/<name>/<Name>Page.tsx`. Each page sets its own tab title with a `<title>` (React 19 moves it into `<head>`):

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

2. In `App.tsx`, add a `<Route>` for it.
3. If it has a form, add a POST in `backend/routes.tsx` that saves the data and redirects.

You do not add a GET in Express: one catch-all renders every page.

## How to add an island

The component runs twice: the server renders it to HTML, then the browser script runs it again on top of that HTML so it becomes interactive. Both runs need the same props, so the server passes them to the browser as text.

1. Build a normal component. Its props travel as text, so use only strings, numbers, booleans, arrays and plain objects (no functions or dates).
2. In the page, create the props once and use them in both places:

```tsx
const props = { initialCount: 0 };

{/* 1. Browser: the island script reads these props from data-props */}
<div id="my-island" data-props={JSON.stringify(props)}>
  {/* 2. Server: renders the component to HTML using the same props */}
  <MyComponent {...props} />
</div>
<script type="module" src="/islands/my-island.js" />
```

3. Add `src/frontend/islands/my-island.tsx`:

```tsx
import { hydrateRoot } from "react-dom/client";
import { MyComponent } from "../pages/.../MyComponent";

const root = document.getElementById("my-island");
if (root) {
  const props = JSON.parse(root.dataset.props ?? "{}"); // text back into an object
  hydrateRoot(root, <MyComponent {...props} />); // attach React to the server's HTML
}
```

Vite builds it to `public/islands/my-island.js` automatically; no config change needed.

Keep the no-JS path working: the form should still POST to a server route that does the same job.
