import type { MetaFunction } from "react-router";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import type { BlogPostMeta, BlogPostModule } from "~/lib/blog/blog-types";

export const meta: MetaFunction = () => [
  { title: "Blog | Ben Honda's Dev Blog" },
  { name: "description", content: "Thoughts on software development, tools, and building." },
  { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/blog" },
];

const postModules = import.meta.glob<BlogPostModule>("../lib/blog/posts/*.tsx", { eager: true });

const posts: BlogPostMeta[] = Object.values(postModules)
  .filter((m): m is BlogPostModule => "blogMeta" in m)
  .map((m) => m.blogMeta)
  .filter((meta) => meta.status === "published")
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export default function BlogIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <Text as="h2" variant="heading-md" className="mb-6">
        Blog
      </Text>

      {posts.length === 0 ? (
        <Text as="p" variant="body" className="text-muted-foreground">
          No posts yet.
        </Text>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/:slug"
              params={{ slug: post.slug }}
              className="block group"
            >
              <Text as="h3" variant="heading-sm" className="group-hover:text-primary transition-colors">
                {post.title}
              </Text>
              <Text as="p" variant="body-sm" className="text-muted-foreground mt-1">
                {post.preview}
              </Text>
              <time dateTime={post.publishedAt}>
                <Text as="span" variant="microcopy" className="text-muted-foreground mt-1 block">
                  {post.publishedAt}
                </Text>
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
