import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, data as routerData } from "react-router";
import { postsBySlug, externalPostsBySlug } from "~/lib/blog/blog-registry";
import { ExternalPostDetail } from "~/components/blog/external-post-detail";
import { mergeMeta } from "~/lib/meta-utils";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  if (!data) {
    return [{ title: "Not Found | Ben Honda" }];
  }

  if (data.kind === "external") {
    const { externalPost: post } = data;
    return mergeMeta(matches, [
      { title: `${post.title} | Ben Honda` },
      { name: "description", content: post.description },
      // The content's home is its own domain — point canonical there so this pointer page
      // never competes for the article and the post stays correctly attributed.
      { tagName: "link", rel: "canonical", href: post.externalUrl },
      { property: "og:type", content: "article" },
      { property: "og:title", content: `${post.title} | Ben Honda` },
      { property: "og:description", content: post.description },
      { property: "og:url", content: post.externalUrl },
    ]);
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
    { property: "article:published_time", content: postMeta.publishedAt },
  ]);
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw routerData(null, { status: 404 });

  const module = postsBySlug[slug];
  if (module) {
    const user = await getUser(request);
    if (module.postMeta.status !== "published" && !isAdmin(user)) throw routerData(null, { status: 404 });
    return { kind: "native" as const, postMeta: module.postMeta };
  }

  const externalPost = externalPostsBySlug[slug];
  if (externalPost) return { kind: "external" as const, externalPost };

  throw routerData(null, { status: 404 });
}

export default function BlogPostPage() {
  const data = useLoaderData<typeof loader>();

  if (data.kind === "external") {
    return <ExternalPostDetail post={data.externalPost} />;
  }

  const { postMeta } = data;
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
            dateModified: postMeta.publishedAt,
            keywords: postMeta.topics?.join(", "),
            image: "https://www.bhonda.com/og.png",
            url: `https://www.bhonda.com/blog/${postMeta.slug}`,
            author: {
              "@type": "Person",
              "@id": "https://www.bhonda.com/#person",
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
