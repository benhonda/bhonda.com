import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { BlogGrid } from "~/components/blog/blog-grid";
import { getBlogListItems } from "~/lib/blog/blog-registry";
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
  return { items: getBlogListItems(isAdmin(user)) };
}

export default function BlogIndex() {
  const { items } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <Text as="h2" variant="heading-md" className="mb-1">
        Blog
      </Text>
      <Text as="p" variant="body-sm" className="text-muted-foreground mb-6">
        Writing on software, ideas, and things I find interesting.
      </Text>

      {items.length === 0 ? (
        <Text as="p" variant="body" className="text-muted-foreground">
          No posts yet.
        </Text>
      ) : (
        <BlogGrid items={items} />
      )}
    </div>
  );
}
