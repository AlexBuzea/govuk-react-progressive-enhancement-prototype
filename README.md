# Apply for a parking permit (React SSR prototype)

A small **GOV.UK-style** service with Node.js, Express, TypeScript, React, React Router, and `renderToPipeableStream`. No Next.js.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
src/
  backend/              # Node / Express
    index.ts            # start the server
    app.ts              # Express setup
    routes.ts           # form POSTs + SSR for every GET
    ssr.tsx             # render React → HTML
    store.ts            # in-memory data

  frontend/             # React
    routes.tsx          # React Router pages (look here for URLs)
    App.tsx
    Document.tsx        # <html> shell
    client.tsx          # browser entry → built as public/client.js
    pages/              # one folder per page
      check/
        CheckPage.tsx
        Counter.tsx     # island (browser React on SSR HTML)
    components/
    layout/

  shared/
    types.ts
```

### Who owns what

| Question | File |
| --- | --- |
| Which pages exist? | `frontend/routes.tsx` |
| What happens on form submit? | `backend/routes.ts` |
| How is HTML rendered? | `backend/ssr.tsx` |
| Where does browser JS start? | `frontend/client.tsx` → `/client.js` |

---

## What is an “island”?

**Island = interactive browser React attached to existing server HTML (not a full client page).**

Almost every page is server-rendered HTML first. An island is a small piece that React “wakes up” in the browser when JS is available.

Example: the counter on `/check`.

- **Without JS:** normal HTML form → POST → server → page reload  
- **With JS:** `client.tsx` hydrates the counter → click updates instantly  

The rest of the page stays plain SSR HTML.

---

## How to add a new page

### A) Normal page (SSR only — most pages)

No browser React needed. Forms and links work without JS.

1. Create the screen: `frontend/pages/payment/PaymentPage.tsx`
2. Register it in `frontend/routes.tsx`:
   - add a title in `pageTitles` (comment shows where)
   - add a `<Route path="/payment" …>` (comment shows where)
3. If the page has a form, add `POST /payment` in `backend/routes.ts`  
   (comment shows where).  
   You do **not** add a new GET — `GET *` already SSRs every page.

### B) Page with an island (interactive bit in the browser)

Do everything in **A**, then:

1. In the page JSX, wrap the interactive component in a root element:

   ```tsx
   <div id="date-picker-root" data-initial-value={value}>
     <DatePicker initialValue={value} />
   </div>
   ```

2. In `frontend/client.tsx`, hydrate that id (comment shows an example under the counter).

3. In `backend/ssr.tsx`, load `/client.js` on that path too (comment under `loadClientJs`).

Look for comments that start with `>>>` — they sit **exactly where** you add the next piece of code.

---

## Progressive enhancement (counter on `/check`)

```text
Server sends HTML (works with JS off)
   ↓
JS off  → form POST → server → redirect → new HTML
JS on   → /client.js hydrates Counter island → click updates instantly
```
