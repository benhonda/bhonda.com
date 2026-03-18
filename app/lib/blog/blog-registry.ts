import type { PostMeta, PostModule } from "~/lib/blog/blog-types";

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
