import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { data as routerData } from "react-router";
import { profilesBySlug } from "~/lib/people/people-registry";
import { mergeMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  if (!data?.personMeta) {
    return [{ title: "Not Found | Ben Honda" }];
  }
  const { personMeta } = data;
  return mergeMeta(matches, [
    { title: `${personMeta.name} | Ben Honda` },
    { name: "description", content: personMeta.metaDescription },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/people/${personMeta.slug}` },
    { property: "og:type", content: "article" },
    { property: "og:title", content: `${personMeta.name} | Ben Honda` },
    { property: "og:description", content: personMeta.metaDescription },
    { property: "og:url", content: `https://www.bhonda.com/people/${personMeta.slug}` },
  ]);
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
            "@type": "ProfilePage",
            name: personMeta.name,
            description: personMeta.metaDescription,
            url: `https://www.bhonda.com/people/${personMeta.slug}`,
            mainEntity: {
              "@type": "Person",
              name: personMeta.name,
              description: personMeta.metaDescription,
              url: `https://www.bhonda.com/people/${personMeta.slug}`,
            },
          }),
        }}
      />
      <Profile />
    </>
  );
}
