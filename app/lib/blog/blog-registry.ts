import type { ExternalPost, PostMeta, PostModule } from "~/lib/blog/blog-types";
import { externalPosts } from "~/lib/blog/external-posts";

const postModules = import.meta.glob<PostModule>("./posts/*.tsx", { eager: true });

const allModules: PostModule[] = Object.values(postModules).filter(
  (m): m is PostModule => "postMeta" in m,
);

export const postsBySlug: Record<string, PostModule> = allModules.reduce<Record<string, PostModule>>(
  (acc, m) => {
    acc[m.postMeta.slug] = m;
    return acc;
  },
  {},
);

export const allPosts: PostMeta[] = allModules
  .map((m) => m.postMeta)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const publishedPosts: PostMeta[] = allPosts.filter((p) => p.status === "published");

/** O(1) lookup of external posts by their internal slug (for the /blog/:slug pointer page). */
export const externalPostsBySlug: Record<string, ExternalPost> = externalPosts.reduce<Record<string, ExternalPost>>(
  (acc, p) => {
    acc[p.slug] = p;
    return acc;
  },
  {},
);

/** A blog listing entry — either a post hosted here or one linked out to its home domain. */
export type BlogListItem =
  | { kind: "native"; post: PostMeta }
  | { kind: "external"; post: ExternalPost };

/**
 * Native + external posts merged, newest first. `includeDrafts` only affects native
 * posts (external posts are published on their home domain, so always shown).
 */
export function getBlogListItems(includeDrafts: boolean): BlogListItem[] {
  const native: BlogListItem[] = (includeDrafts ? allPosts : publishedPosts).map((post) => ({
    kind: "native",
    post,
  }));
  const external: BlogListItem[] = externalPosts.map((post) => ({ kind: "external", post }));
  return [...native, ...external].sort((a, b) => b.post.publishedAt.localeCompare(a.post.publishedAt));
}
