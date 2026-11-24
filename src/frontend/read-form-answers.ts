/**
 * Reads what the user has already chosen or typed in the form inside `root`.
 * Island scripts call this just before hydrateRoot.
 *
 * Why: on a slow connection the page can be used for a few seconds before its
 * island script runs. When React then hydrates, it sets the form back to the
 * values the server sent, so anything answered in that gap would be lost.
 * Reading the form first lets the island give those answers back to React.
 *
 * Returns field name → answer:
 * - text inputs, textareas, radios and single selects: a string. A radio group
 *   with nothing selected is left out.
 * - checkboxes and multi-selects: a list of the ticked values. The list is empty
 *   when nothing is ticked, so a box the server sent ticked and the user then
 *   unticked is still reported (the browser leaves unticked boxes out of a form).
 * - file inputs are left out. Browsers never let a script set a file input, so
 *   React cannot reset a chosen file.
 * - disabled fields are left out. The user cannot change them, so there is
 *   nothing to restore.
 */
export function readFormAnswers(root: HTMLElement): Record<string, string | string[]> {
  const answers: Record<string, string | string[]> = {};
  const form = root.querySelector("form");
  if (!form) return answers;

  // What the browser would send if the form were submitted now
  const sent = new FormData(form);

  // Fields with a single answer. A field with several answers ends up with its
  // last one here, and is replaced with the full list below.
  sent.forEach((value, name) => {
    if (typeof value === "string") answers[name] = value;
  });

  // Checkbox groups and multi-selects have a list of answers, which can be empty
  const listFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
    'input[type="checkbox"], select[multiple]'
  );
  for (const field of listFields) {
    if (field.disabled || !field.name) continue;
    answers[field.name] = sent.getAll(field.name).filter((value) => typeof value === "string");
  }

  return answers;
}
