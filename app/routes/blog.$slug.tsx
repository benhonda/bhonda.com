import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { data as routerData } from "react-router";
import type { BlogPostMeta, BlogPostModule } from "~/lib/blog/blog-types";

const postModules = import.meta.glob<BlogPostModule>("../lib/blog/posts/*.tsx", { eager: true });

const postsBySlug: Record<string, BlogPostModule> = Object.values(postModules)
  .filter((m): m is BlogPostModule => "blogMeta" in m)
  .reduce<Record<string, BlogPostModule>>((acc, m) => {
    acc[m.blogMeta.slug] = m;
    return acc;
  }, {});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.postMeta) {
    return [{ title: "Post Not Found | Ben Honda" }];
  }
  const { postMeta } = data;
  return [
    { title: `${postMeta.title} | Ben Honda` },
    { name: "description", content: postMeta.preview },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/blog/${postMeta.slug}` },
    { property: "og:type", content: "article" },
    { property: "og:title", content: `${postMeta.title} | Ben Honda` },
    { property: "og:description", content: postMeta.preview },
    { property: "og:url", content: `https://www.bhonda.com/blog/${postMeta.slug}` },
  ];
};

export function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = postsBySlug[slug];
  if (!module || module.blogMeta.status !== "published") throw routerData(null, { status: 404 });

  return { postMeta: module.blogMeta };
}

export default function BlogPost() {
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
            description: postMeta.preview,
            datePublished: postMeta.publishedAt,
            ...(postMeta.lastUpdated ? { dateModified: postMeta.lastUpdated } : {}),
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
