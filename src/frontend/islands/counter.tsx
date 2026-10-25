import { hydrateRoot } from "react-dom/client";
import { Counter } from "../pages/apply/Counter";

/**
 * Browser entry for the counter on /apply.
 * Vite builds this into public/islands/counter.js.
 * The id must match the <div id="counter"> in ApplyPage.
 *
 * The server already rendered the HTML; hydrateRoot attaches React to it
 * (using the props the server left in data-props) so it becomes interactive.
 */
const root = document.getElementById("counter");
if (root) {
  const props = JSON.parse(root.dataset.props ?? "{}");
  hydrateRoot(root, <Counter {...props} />);
}
