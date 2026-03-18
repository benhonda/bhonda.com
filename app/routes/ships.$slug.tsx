import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, data as routerData } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { shiplogsBySlug } from "~/lib/shiplogs/shiplog-registry";
import { useEffect, useRef } from "react";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";
import { getOrCreateStartTime } from "~/lib/analytics/session-utils";

export const meta: MetaFunction<typeof loader> = ({ data, params, matches }) => {
  if (!data?.shiplogMeta) {
    return [{ title: "Shiplog Not Found | Ben Honda's Dev Blog" }];
  }
  const { shiplogMeta } = data;
  const slug = params.slug || "";
  return mergeMeta(matches, [
    { title: `${shiplogMeta.titleText} | Ben Honda` },
    { name: "description", content: shiplogMeta.previewText },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/ships/${slug}` },
    { property: "og:type", content: "article" },
    { property: "og:title", content: `${shiplogMeta.titleText} | Ben Honda` },
    { property: "og:description", content: shiplogMeta.previewText },
    { property: "og:url", content: `https://www.bhonda.com/ships/${slug}` },
  ]);
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = shiplogsBySlug[slug];
  if (!module) throw routerData(null, { status: 404 });

  const user = await getUser(request);
  if (module.shiplogMeta.status !== "published" && !isAdmin(user)) {
    throw routerData(null, { status: 404 });
  }

  return { shiplogMeta: module.shiplogMeta };
}

export default function ShiplogPage() {
  const { shiplogMeta } = useLoaderData<typeof loader>();
  const Shiplog = shiplogsBySlug[shiplogMeta.slug]?.default;

  const hasTrackedOpenRef = useRef(false);

  useEffect(() => {
    if (hasTrackedOpenRef.current) return;
    getOrCreateStartTime();
    browserTrackEvent("Shiplog Opened", {
      slug: shiplogMeta.slug,
      week: shiplogMeta.week,
    });
    hasTrackedOpenRef.current = true;
  }, [shiplogMeta.slug, shiplogMeta.week]);

  if (!Shiplog) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: shiplogMeta.titleText,
            description: shiplogMeta.previewText,
            datePublished: shiplogMeta.publishedAt,
            image: "https://www.bhonda.com/og.png",
            url: `https://www.bhonda.com/ships/${shiplogMeta.slug}`,
            author: {
              "@type": "Person",
              name: "Ben Honda",
              url: "https://www.bhonda.com/",
            },
          }),
        }}
      />
      <Shiplog />
    </>
  );
}
