import type { MetaFunction } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { Text } from "~/components/misc/text";
import { useLoaderData } from "react-router";
import { PageHeader } from "~/components/misc/page-header";
import { Link } from "~/lib/router/routes";
import { ExternalLink, Github } from "lucide-react";
import { PROJECTS_CONFIG, type ProjectConfig } from "~/lib/projects/projects-config";
import { allShiplogs } from "~/lib/shiplogs/shiplog-registry";

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "Projects | Ben Honda's Dev Blog" },
    { name: "description", content: "A look at the projects I've been working on." },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/projects" },
    { property: "og:title", content: "Projects | Ben Honda's Dev Blog" },
    { property: "og:description", content: "A look at the projects I've been working on." },
    { property: "og:url", content: "https://www.bhonda.com/projects" },
  ]);

export function loader() {
  const projects = PROJECTS_CONFIG.map((p) => {
    const config = p as ProjectConfig;
    const tagged = allShiplogs.filter((s) => s.projectTags?.includes(p.slug));
    return {
      ...config,
      repoUrl: config.repos.find((r) => r.repoUrl)?.repoUrl ?? null,
      shiplogCount: tagged.length,
      latestShiplogDate: tagged[0]?.publishedAt ?? null,
    };
  });
  return { projects };
}

export default function ProjectsIndex() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <Text as="h2" variant="heading-md" className="mb-6">
          Projects
        </Text>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/projects/:slug"
              params={{ slug: project.slug }}
              className="flex flex-col border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
            >
              <Text as="h3" variant="heading-sm" className="mb-1">
                {project.name}
              </Text>
              {project.description && (
                <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
                  {project.description}
                </Text>
              )}
              <div className="mt-auto">
                {(project.url || project.repoUrl) && (
                  <div className="flex items-center gap-3 mb-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        {new URL(project.url).hostname.replace("www.", "")}
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="size-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {project.shiplogCount} {project.shiplogCount === 1 ? "shiplog" : "shiplogs"}
                  </span>
                  {project.latestShiplogDate && (
                    <time dateTime={project.latestShiplogDate}>{project.latestShiplogDate}</time>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
