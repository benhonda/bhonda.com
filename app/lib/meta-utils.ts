import type { MetaDescriptor } from "react-router";

type MetaMatch = { meta?: MetaDescriptor[] };

function metaKey(tag: MetaDescriptor): string | null {
  if ("title" in tag) return "title";
  const t = tag as Record<string, unknown>;
  if (typeof t.name === "string") return `name:${t.name}`;
  if (typeof t.property === "string") return `property:${t.property}`;
  if (t.tagName === "link" && typeof t.rel === "string") return `link:${t.rel}`;
  return null;
}

/**
 * Merges parent route meta with child overrides, deduplicating by tag key.
 * Pass `matches` from the meta function args and your route-specific tags.
 */
export function mergeMeta(matches: MetaMatch[], overrides: MetaDescriptor[]): MetaDescriptor[] {
  const overrideKeys = new Set(overrides.map(metaKey).filter(Boolean) as string[]);
  const parentMeta = matches.flatMap((m) => m.meta ?? []);
  const filtered = parentMeta.filter((tag) => {
    const key = metaKey(tag);
    return !key || !overrideKeys.has(key);
  });
  return [...filtered, ...overrides];
}
