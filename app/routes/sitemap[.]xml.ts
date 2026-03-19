import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { publishedShiplogs } from "~/lib/shiplogs/shiplog-registry";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";
import type { PersonModule } from "~/lib/people/people-types";
import type { PostModule } from "~/lib/blog/blog-types";

const profileModules = import.meta.glob<PersonModule>("../lib/people/profiles/*.tsx", { eager: true });
const postModules = import.meta.glob<PostModule>("../lib/blog/posts/*.tsx", { eager: true });

interface SitemapRoute {
  path: string;
  lastmod?: string | null;
  priority: number;
  changefreq: string;
}

function urlEntry({ path, lastmod, priority, changefreq }: SitemapRoute, baseUrl: string): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${baseUrl}${path}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = `https://${serverEnv.APP_FQDN}`;

  const staticRoutes: SitemapRoute[] = [
    { path: "/", priority: 1.0, changefreq: "weekly" },
    { path: "/ships", priority: 0.9, changefreq: "weekly" },
    { path: "/blog", priority: 0.9, changefreq: "weekly" },
    { path: "/people", priority: 0.9, changefreq: "monthly" },
    { path: "/projects", priority: 0.9, changefreq: "monthly" },
    { path: "/contact", priority: 0.8, changefreq: "monthly" },
  ];

  const shiplogRoutes: SitemapRoute[] = publishedShiplogs.map((s) => ({
    path: `/ships/${s.slug}`,
    lastmod: s.publishedAt,
    priority: 0.9,
    changefreq: "monthly",
  }));

  const projectRoutes: SitemapRoute[] = PROJECTS_CONFIG.map((p) => ({
    path: `/projects/${p.slug}`,
    priority: 0.8,
    changefreq: "monthly",
  }));

  const peopleRoutes: SitemapRoute[] = Object.values(profileModules)
    .filter((m): m is PersonModule => "personMeta" in m && m.personMeta.status === "published")
    .map((m) => ({
      path: `/people/${m.personMeta.slug}`,
      lastmod: m.personMeta.lastUpdated ?? null,
      priority: 0.8,
      changefreq: "monthly",
    }));

  const blogRoutes: SitemapRoute[] = Object.values(postModules)
    .filter((m): m is PostModule => "postMeta" in m && m.postMeta.status === "published")
    .map((m) => ({
      path: `/blog/${m.postMeta.slug}`,
      lastmod: m.postMeta.publishedAt,
      priority: 0.8,
      changefreq: "monthly",
    }));

  const publishedPostsFromModules = Object.values(postModules).filter(
    (m): m is PostModule => "postMeta" in m && m.postMeta.status === "published",
  );
  const allTopics = [
    ...new Set([
      ...publishedPostsFromModules.flatMap((m) => m.postMeta.topics ?? []),
      ...publishedShiplogs.flatMap((s) => s.topics ?? []),
    ]),
  ];
  const topicRoutes: SitemapRoute[] = allTopics.map((topic) => ({
    path: `/topics/${topic}`,
    priority: 0.6,
    changefreq: "weekly",
  }));

  const allRoutes = [...staticRoutes, ...shiplogRoutes, ...projectRoutes, ...peopleRoutes, ...blogRoutes, ...topicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map((r) => urlEntry(r, baseUrl)).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
