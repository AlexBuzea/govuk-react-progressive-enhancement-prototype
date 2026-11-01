/**
 * Which "your details" page a permit type uses.
 *
 * Commercial permits ask for organisation details; every other permit asks
 * for a person's name and address. Used by POST /apply (where to go next),
 * the back link and "Change" links on later pages, and the details pages
 * themselves (to redirect anyone who types the wrong URL), so the rule is
 * written once.
 */
export function detailsPageFor(permitType: string): string {
  return permitType === "commercial" ? "/organisation-details" : "/details";
}
