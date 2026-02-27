import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";
import type { PersonModule } from "~/lib/people/people-types";

const profileModules = import.meta.glob<PersonModule>("../lib/people/profiles/*.tsx", { eager: true });

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = `https://www.${serverEnv.APP_FQDN}`;

  // Fetch all published shiplogs (non-admin = published only)
  const shiplogs = await fetchShiplogs(false);

  // People profiles
  const peopleRoutes = Object.values(profileModules)
    .filter((m): m is PersonModule => "personMeta" in m && m.personMeta.status === "published")
    .map((m) => ({
      path: `/people/${m.personMeta.slug}`,
      lastmod: m.personMeta.lastUpdated,
      priority: 0.8,
      changefreq: "monthly",
    }));

  // Static routes
  const staticRoutes = [
    { path: "/", priority: 1.0, changefreq: "weekly" },
    { path: "/contact", priority: 0.8, changefreq: "monthly" },
    { path: "/ships", priority: 0.9, changefreq: "weekly" },
    { path: "/people", priority: 0.9, changefreq: "monthly" },
  ];

  // Dynamic shiplog routes
  const shiplogRoutes = shiplogs.map((shiplog) => ({
    path: `/ships/${shiplog.slug}`,
    lastmod: shiplog.publishedAt, // YYYY-MM-DD format
    priority: 0.9,
    changefreq: "monthly",
  }));

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (route) =>
      `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
${shiplogRoutes
  .map(
    (route) =>
      `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
${peopleRoutes
  .map(
    (route) =>
      `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
