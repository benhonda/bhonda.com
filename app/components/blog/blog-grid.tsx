import { PostCard } from "~/components/blog/post-card";
import { ExternalPostCard } from "~/components/blog/external-post-card";
import type { BlogListItem } from "~/lib/blog/blog-registry";

/** Renders a grid of mixed native + external posts, picking the right card per item. */
export function BlogGrid({ items }: { items: BlogListItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) =>
        item.kind === "external" ? (
          <ExternalPostCard key={item.post.externalUrl} post={item.post} />
        ) : (
          <PostCard key={item.post.slug} post={item.post} />
        ),
      )}
    </div>
  );
}
