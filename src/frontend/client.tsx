import { hydrateRoot } from "react-dom/client";
import { Counter } from "./pages/check/Counter";

/**
 * Browser bundle entry (built to public/client.js).
 *
 * The page HTML already came from the server (SSR).
 * This file only hydrates islands when JavaScript is available.
 *
 * Island = interactive browser React attached to existing server HTML
 * (not a full client page).
 */

// Counter island on /check
const counterRoot = document.getElementById("counter-root");

if (counterRoot) {
  const initialCount = Number(counterRoot.dataset.initialCount ?? 0);

  hydrateRoot(counterRoot, <Counter initialCount={initialCount} />);
}

// >>> When you add another island, hydrate it here the same way, e.g.:
//
// const datePickerRoot = document.getElementById("date-picker-root");
// if (datePickerRoot) {
//   hydrateRoot(
//     datePickerRoot,
//     <DatePicker initialValue={datePickerRoot.dataset.initialValue ?? ""} />
//   );
// }
//
// Also: put that <div id="date-picker-root"> on the page, and load /client.js
// for that page in backend/ssr.tsx (see loadClientJs).
