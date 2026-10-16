/**
 * Top-level sections of the old site (git tag `archive/v1`), taken down for the rebuild.
 * The catch-all route answers these with 410 Gone instead of 404, so search engines drop
 * the old pages for good. A real route at one of these paths outranks the catch-all, so
 * when the new site brings a section back, delete its entry here.
 */
const RETIRED_SECTIONS: ReadonlySet<string> = new Set([
  "blog",
  "ships",
  "people",
  "projects",
  "topics",
  "contact",
  "login",
  "llms.txt",
  "sitemap.xml",
]);

/** Whether `pathname` falls under a retired section — matched by whole first segment, so "/blogger" is not "/blog". */
export function isRetiredPath(pathname: string): boolean {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return firstSegment !== undefined && RETIRED_SECTIONS.has(firstSegment.toLowerCase());
}
