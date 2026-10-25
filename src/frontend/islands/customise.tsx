import { hydrateRoot } from "react-dom/client";
import { CustomiseForm } from "../pages/customise/CustomiseForm";

/**
 * Browser entry for the permit options form on /customise.
 * Vite builds this into public/islands/customise.js.
 * The id must match the <div id="customise"> in CustomisePage.
 *
 * The server already rendered the HTML; hydrateRoot attaches React to it
 * (using the props the server left in data-props) so it becomes interactive.
 */
const root = document.getElementById("customise");
if (root) {
  const props = JSON.parse(root.dataset.props ?? "{}");
  hydrateRoot(root, <CustomiseForm {...props} />);
}
