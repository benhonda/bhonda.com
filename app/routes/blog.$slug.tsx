import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, data as routerData } from "react-router";
import { postsBySlug } from "~/lib/blog/blog-registry";
import { mergeMeta } from "~/lib/meta-utils";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  if (!data?.postMeta) {
    return [{ title: "Not Found | Ben Honda" }];
  }
  const { postMeta } = data;
  return mergeMeta(matches, [
    { title: `${postMeta.title} | Ben Honda` },
    { name: "description", content: postMeta.metaDescription },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/blog/${postMeta.slug}` },
    { property: "og:type", content: "article" },
    { property: "og:title", content: `${postMeta.title} | Ben Honda` },
    { property: "og:description", content: postMeta.metaDescription },
    { property: "og:url", content: `https://www.bhonda.com/blog/${postMeta.slug}` },
  ]);
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = postsBySlug[slug];
  if (!module) throw routerData(null, { status: 404 });

  const user = await getUser(request);
  if (module.postMeta.status !== "published" && !isAdmin(user)) throw routerData(null, { status: 404 });

  return { postMeta: module.postMeta };
}

export default function BlogPostPage() {
  const { postMeta } = useLoaderData<typeof loader>();
  const Post = postsBySlug[postMeta.slug]?.default;

  if (!Post) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: postMeta.title,
            description: postMeta.metaDescription,
            datePublished: postMeta.publishedAt,
            url: `https://www.bhonda.com/blog/${postMeta.slug}`,
            author: {
              "@type": "Person",
              name: "Ben Honda",
              url: "https://www.bhonda.com",
            },
          }),
        }}
      />
      <Post />
    </>
  );
}
