import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";
import { Tag } from "~/components/misc/tag";
import type { ExternalPost } from "~/lib/blog/blog-types";

/** Card for a post hosted on another domain — links to the internal pointer page at /blog/:slug. */
export function ExternalPostCard({ post }: { post: ExternalPost }) {
  return (
    <div className="flex flex-col border border-border rounded-lg p-6">
      <Link
        to="/blog/:slug"
        params={{ slug: post.slug }}
        className="flex flex-col flex-1 hover:opacity-80 transition-opacity"
      >
        <Text as="h3" variant="heading-sm" className="mb-1">
          {post.title}
        </Text>
        <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
          {post.description}
        </Text>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
            {post.publishedAt}
          </time>
          <Text as="span" variant="microcopy" className="bg-muted text-muted-foreground rounded px-2 py-0.5">
            {post.source}
          </Text>
        </div>
      </Link>
      {post.topics && post.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.topics.map((topic) => (
            <Tag key={topic} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
