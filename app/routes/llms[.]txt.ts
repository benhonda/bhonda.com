import type { LoaderFunctionArgs } from "react-router";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { publishedShiplogs } from "~/lib/shiplogs/shiplog-registry";
import { externalPosts } from "~/lib/blog/external-posts";
import { PROJECTS_CONFIG } from "~/lib/projects/projects-config";
import type { PersonModule } from "~/lib/people/people-types";
import type { PostModule } from "~/lib/blog/blog-types";

const profileModules = import.meta.glob<PersonModule>("../lib/people/profiles/*.tsx", { eager: true });
const postModules = import.meta.glob<PostModule>("../lib/blog/posts/*.tsx", { eager: true });

/**
 * /llms.txt — a concise, machine-readable map of the site for AI systems
 * (ChatGPT, Claude, Perplexity). See https://llmstxt.org. Not required by Google,
 * but rewarded by non-Google engines. Auto-generated from published content.
 */
export function loader(_: LoaderFunctionArgs) {
  const baseUrl = `https://${serverEnv.APP_FQDN}`;

  const publishedPosts = Object.values(postModules).filter(
    (m): m is PostModule => "postMeta" in m && m.postMeta.status === "published",
  );
  const publishedProfiles = Object.values(profileModules).filter(
    (m): m is PersonModule => "personMeta" in m && m.personMeta.status === "published",
  );

  const topics = [
    ...new Set([
      ...publishedPosts.flatMap((m) => m.postMeta.topics ?? []),
      ...publishedShiplogs.flatMap((s) => s.topics ?? []),
      ...externalPosts.flatMap((p) => p.topics ?? []),
    ]),
  ].sort();

  const sections: string[] = [
    "# bhonda.com",
    "",
    "> Ben Honda is a software engineer who builds in public. The site publishes weekly shiplogs (development summaries auto-generated from real git commits), long-form cited technical write-ups, and an index of the projects behind the work.",
    "",
    "## Posts",
    ...publishedPosts.map(
      (m) => `- [${m.postMeta.title}](${baseUrl}/blog/${m.postMeta.slug}): ${m.postMeta.metaDescription}`,
    ),
    "",
    "## Shiplogs",
    ...publishedShiplogs.map((s) => `- [${s.titleText}](${baseUrl}/ships/${s.slug}): ${s.previewText}`),
    "",
    ...(externalPosts.length > 0
      ? [
          "## Writing elsewhere",
          ...externalPosts.map((p) => `- [${p.title}](${p.externalUrl}) (${p.source}): ${p.description}`),
          "",
        ]
      : []),
    "## Projects",
    ...PROJECTS_CONFIG.map(
      (p) => `- [${p.name}](${baseUrl}/projects/${p.slug})${p.description ? `: ${p.description}` : ""}`,
    ),
    "",
    "## People",
    ...publishedProfiles.map(
      (m) => `- [${m.personMeta.name}](${baseUrl}/people/${m.personMeta.slug}): ${m.personMeta.metaDescription}`,
    ),
    "",
    "## Topics",
    ...topics.map((t) => `- [#${t}](${baseUrl}/topics/${t})`),
    "",
  ];

  return new Response(sections.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
