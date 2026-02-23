import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";
import type { BlogPostModule } from "~/lib/blog/blog-types";

const blogPostModules = import.meta.glob<BlogPostModule>("../lib/blog/posts/*.tsx", { eager: true });

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = `https://www.${serverEnv.APP_FQDN}`;

  // Fetch all published shiplogs (non-admin = published only)
  const shiplogs = await fetchShiplogs(false);

  // Blog posts
  const blogRoutes = Object.values(blogPostModules)
    .filter((m): m is BlogPostModule => "blogMeta" in m && m.blogMeta.status === "published")
    .map((m) => ({
      path: `/blog/${m.blogMeta.slug}`,
      lastmod: m.blogMeta.lastUpdated ?? m.blogMeta.publishedAt,
      priority: 0.8,
      changefreq: "monthly",
    }));

  // Static routes
  const staticRoutes = [
    { path: "/", priority: 1.0, changefreq: "weekly" },
    { path: "/contact", priority: 0.8, changefreq: "monthly" },
    { path: "/ships", priority: 0.9, changefreq: "weekly" },
    { path: "/blog", priority: 0.9, changefreq: "weekly" },
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
${blogRoutes
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
