import type { MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { useAction } from "~/hooks/use-action";
import { fetchProjectsActionDefinition } from "~/lib/actions/fetch-projects/action-definition";
import { useEffect } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Link } from "~/lib/router/routes";
import { ExternalLink, Github } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Projects | Ben Honda's Dev Blog" },
    { name: "description", content: "A look at the projects I've been working on." },
    { tagName: "link", rel: "canonical", href: "https://bhonda.com/projects" },
  ];
};

export const action = action_handler;

export default function ProjectsIndex() {
  const { data, isLoading, submit } = useAction(fetchProjectsActionDefinition);

  useEffect(() => {
    submit({});
  }, []);

  const projects = data?.projects ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <Text as="h2" variant="heading-md" className="mb-6">
          Projects
        </Text>

        {isLoading ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            Loading projects...
          </Text>
        ) : projects.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No projects found.
          </Text>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects
              .filter((p) => p.shiplogCount > 0)
              .map((project) => (
                <Link
                  key={project.slug}
                  to="/projects/:slug"
                  params={{ slug: project.slug }}
                  className="flex flex-col border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  <Text as="h3" variant="heading-sm" className="mb-1">
                    {project.display_name}
                  </Text>
                  {project.description && (
                    <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
                      {project.description}
                    </Text>
                  )}
                  <div className="mt-auto">
                    {(project.url || project.repo_url) && (
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
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
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
                      <span>{project.shiplogCount} {project.shiplogCount === 1 ? "shiplog" : "shiplogs"}</span>
                      {project.latestShiplogDate && (
                        <time dateTime={project.latestShiplogDate}>
                          {project.latestShiplogDate}
                        </time>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
