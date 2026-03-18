import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { allPosts, publishedPosts } from "~/lib/blog/blog-registry";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "Blog | Ben Honda" },
    { name: "description", content: "Writing on software, ideas, and things I find interesting." },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/blog" },
    { property: "og:title", content: "Blog | Ben Honda" },
    { property: "og:description", content: "Writing on software, ideas, and things I find interesting." },
    { property: "og:url", content: "https://www.bhonda.com/blog" },
  ]);

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  return { posts: isAdmin(user) ? allPosts : publishedPosts };
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <Text as="h2" variant="heading-md" className="mb-1">
        Blog
      </Text>
      <Text as="p" variant="body-sm" className="text-muted-foreground mb-6">
        Writing on software, ideas, and things I find interesting.
      </Text>

      {posts.length === 0 ? (
        <Text as="p" variant="body" className="text-muted-foreground">
          No posts yet.
        </Text>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/:slug"
              params={{ slug: post.slug }}
              className="flex flex-col border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
            >
              <Text as="h3" variant="heading-sm" className="mb-1">
                {post.title}
              </Text>
              <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
                {post.preview}
              </Text>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
                  {post.publishedAt}
                </time>
                {post.status === "draft" && (
                  <Text as="span" variant="microcopy" className="bg-yellow-100 text-yellow-800 rounded px-2 py-0.5">
                    draft
                  </Text>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Text key={tag} as="span" variant="microcopy" className="bg-muted rounded px-2 py-0.5">
                        {tag}
                      </Text>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
