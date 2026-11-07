# Apply for a parking permit — React SSR prototype

> **This is a prototype.** It shows how a GOV.UK service could be built with React instead of Nunjucks while still following progressive enhancement. It is not a production service: answers are kept in server memory and lost on restart, and nothing is really submitted.

**Live demo:** https://react-progressive-enhancement-prototype.onrender.com/ (the free hosting plan sleeps when idle, so the first load can take up to a minute).

Built with Node, Express, TypeScript and React. No meta-framework (no Next.js).

The idea: **every page is a working HTML page first. React only runs in the browser where it makes a page better.**

## Quick start

```bash
npm install
npm run dev
```

Needs Node 22 or later. Open [http://localhost:3000](http://localhost:3000), then try it again with JavaScript turned off in DevTools. Everything still works.

To run it the way a host does: `npm run build && npm start`.

| Command | What it does |
|---|---|
| `npm run dev` | Rebuilds island scripts and restarts the server on change |
| `npm run build` | Builds the island scripts once (needed before `npm start`) |
| `npm start` | Starts the server (does not build) |
| `npm test` | Runs all tests |
| `npm run typecheck` | Type checks the whole project |

---

## Two types of page

Every page is written as a React component and turned into HTML **on the server**. The browser always receives a complete page. What differs is whether React also runs in the browser afterwards.

### 1. Server-only pages (most pages)

React is used like a template engine: it produces the HTML on the server and nothing else. No React is sent to the browser.

Forms are plain HTML forms. They post to the server, which checks the answers and either shows the page again with error messages or moves the user on to the next page.

```
User selects "Save and continue"
  → browser posts the form to /details
  → the server checks the answers (pages/details/validation.ts)
  → errors?    show the page again with error messages and what the user typed
  → no errors? save the answers and go to the next page
```

Examples: start page, `/help`, `/details`, `/organisation-details`, `/check`, `/confirmation`. **Copy `/help` for a simple page and `/details` for a form.**

### 2. Pages with an island

An **island** is one part of a page that becomes interactive in the browser.

1. The server renders the whole page to HTML, island included. The user sees it straight away.
2. A small script then loads React for that one part and attaches it to the HTML already on the page. This is called **hydrating**.
3. That part now reacts instantly to what the user does. The rest of the page stays plain HTML.

Without JavaScript, step 2 never happens and the island works as a normal server-rendered form. So an island must always have a no-JS version that does the same job.

| Island | Without JS | With JS |
|---|---|---|
| **Counter** on `/apply` (the smallest example) | Each click posts the form and reloads the page | The number updates instantly; the same request saves it in the background |
| **Permit options** on `/customise` (the realistic example) | Errors, price and zone filtering come from the server after a reload | Errors show before sending, the price updates as you choose, zones filter as you type |

The validation and price rules (`pages/customise/options.ts`) run on both the server and in the browser, so the two versions cannot disagree.

---

## Where things are

```
src/
  backend/
    routes/
      permit-application/
        index.ts      Every URL in the journey, one line per page (start here)
        details.tsx   What happens when a page is shown and when its form is posted
    session/          Each visitor's answers, and CSRF protection
    middleware/       Security headers and static files
    utils/render.tsx  Turns a page component into HTML
  frontend/
    Document.tsx      The <html> shell: head, header, footer
    components/       GOV.UK components (GovukInput, GovukRadios, GovukErrorSummary...)
    pages/            One folder per page
    islands/          Browser scripts, one per island
  shared/             Types and rules used by both server and browser
public/               CSS and small browser scripts
```

The route file reads like a React Router config: the URL, the component it shows, and where its form goes next.

```ts
router.route("/details").get(showDetailsPage).post(saveDetails); // <DetailsPage> → /customise
```

Search for `>>>` in the code to find where each kind of addition goes.

## How to add a server-only page

**A page with no form** is three small steps. `/help` is the example: [pages/help/HelpPage.tsx](src/frontend/pages/help/HelpPage.tsx) (the component, just a `<title>` and some HTML), [routes/help.tsx](src/backend/routes/help.tsx) (one `render(res, <HelpPage />)`), and one line in [routes/index.ts](src/backend/routes/index.ts):

```ts
routes.get("/help", showHelpPage); // <HelpPage>
```

**A page with a form** (part of a journey):

1. Create the component in `frontend/pages/<name>/`. Copy `pages/details/`.
2. Add its handlers in `backend/routes/permit-application/<name>.tsx`. Copy `details.tsx`.
3. Add one line for it in `backend/routes/permit-application/index.ts`.

Every form needs `<CsrfField token={csrfToken} />` inside it.

## How to add an island

The island component runs twice: on the server to make the HTML, then in the browser to make it interactive. Both runs need the same props, so the server writes them into the page as text. That means props can only be strings, numbers, booleans, arrays and plain objects.

In the page:

```tsx
const props = { initialCount: 0 };

<div id="my-island" data-props={JSON.stringify(props)}>   {/* props for the browser */}
  <MyComponent {...props} />                              {/* HTML from the server */}
</div>
<script type="module" src="/islands/my-island.js" />
```

Then add `frontend/islands/my-island.tsx`:

```tsx
import { hydrateRoot } from "react-dom/client";
import { MyComponent } from "../pages/.../MyComponent";

const root = document.getElementById("my-island");
if (root) {
  const props = JSON.parse(root.dataset.props ?? "{}"); // text back into an object
  hydrateRoot(root, <MyComponent {...props} />); // attach React to the server's HTML
}
```

Vite builds it to `public/islands/my-island.js` automatically.

---

## Deploy to Render

The repo includes a `render.yaml` that sets everything up.

1. Push the repo to GitHub.
2. In [Render](https://render.com), choose **New → Blueprint** and select the repository.
3. Approve the settings. Render builds it and gives you a URL.

Render generates the `SESSION_SECRET` for you. Other hosts that run Node work too: build with `npm install && npm run build`, start with `npm start`, and set `NODE_ENV=production` and `SESSION_SECRET`.

The free plan sleeps after about 15 minutes of no visits, so the first page load can take up to a minute. Answers are kept in memory, so they are lost when it sleeps. If a form says "Your session has ended", reload the page and start again.

---

## Why React instead of Nunjucks?

- **Type safety**: a missing prop or renamed field is a compile error, not a blank space on the page.
- **One set of rules**: validation runs on the server and in the browser from the same code.
- **Testable**: components and pages are tested, including automated accessibility checks with axe.
- **Interactivity only where needed**: islands, not a single-page app.

**Trade-offs:** the GOV.UK Design System maintains the Nunjucks macros for you, while the React components in this app are currently written by hand. There is also a build step, and designers used to the Prototype Kit would need support to edit JSX.

**The components here are a proof of concept.** In a real project they would be a component library published as an npm package, with Storybook so developers can build and test each component in isolation and designers can review every state without running a service.

## Not production-ready

Already in place: per-visitor sessions, CSRF protection, security headers, accessible GOV.UK markup and automated tests.

Still needed before real use: a shared session store (e.g. Redis), saving the submitted application, logging and monitoring, and testing with real assistive technology.
