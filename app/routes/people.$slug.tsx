import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { data as routerData } from "react-router";
import { profilesBySlug } from "~/lib/people/people-registry";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.personMeta) {
    return [{ title: "Not Found | Ben Honda" }];
  }
  const { personMeta } = data;
  return [
    { title: `${personMeta.name} | Ben Honda` },
    { name: "description", content: personMeta.preview },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/people/${personMeta.slug}` },
    { property: "og:type", content: "article" },
    { property: "og:title", content: `${personMeta.name} | Ben Honda` },
    { property: "og:description", content: personMeta.preview },
    { property: "og:url", content: `https://www.bhonda.com/people/${personMeta.slug}` },
  ];
};

export function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = profilesBySlug[slug];
  if (!module || module.personMeta.status !== "published") throw routerData(null, { status: 404 });

  return { personMeta: module.personMeta };
}

export default function PersonPage() {
  const { personMeta } = useLoaderData<typeof loader>();
  const Profile = profilesBySlug[personMeta.slug]?.default;

  if (!Profile) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: personMeta.name,
            description: personMeta.preview,
            ...(personMeta.lastUpdated ? { dateModified: personMeta.lastUpdated } : {}),
            url: `https://www.bhonda.com/people/${personMeta.slug}`,
            author: {
              "@type": "Person",
              name: "Ben Honda",
              url: "https://www.bhonda.com",
            },
          }),
        }}
      />
      <Profile />
    </>
  );
}
