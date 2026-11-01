/** Read one text field from a form body or query string. */
export function text(value: unknown): string {
  return String(value ?? "").trim();
}
