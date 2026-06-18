import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { Button } from "~/components/ui/button";
import type { ExternalPost } from "~/lib/blog/blog-types";

/**
 * Pointer page for a post hosted elsewhere. Shows the title/summary/topics in bhonda's
 * chrome (so clicking from the grid isn't jarring), then links out to the full post on its
 * home domain. Content is never duplicated; the route sets canonical → externalUrl.
 */
export function ExternalPostDetail({ post }: { post: ExternalPost }) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader />
        <Breadcrumbs crumbs={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-border rounded-lg p-8">
          <header className="mb-8">
            <Text as="h1" variant="display-xs">
              {post.title}
            </Text>
            <Spacer size="xs" />
            <time dateTime={post.publishedAt}>
              <Text as="span" variant="microcopy" className="text-muted-foreground">
                {post.publishedAt} · originally published on {post.source}
              </Text>
            </time>
            {post.topics && post.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.topics.map((topic) => (
                  <Tag key={topic} topic={topic} />
                ))}
              </div>
            )}
          </header>

          <article className="space-y-6">
            <Text as="p" variant="body" className="text-muted-foreground">
              {post.description}
            </Text>
            <Button asChild>
              <a href={post.externalUrl} target="_blank" rel="noopener">
                Read the full post on {post.source} ↗
              </a>
            </Button>
          </article>
        </div>
      </div>
    </div>
  );
}
