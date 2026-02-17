import type { MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { useAction } from "~/hooks/use-action";
import { fetchProjectsActionDefinition } from "~/lib/actions/fetch-projects/action-definition";
import { useEffect } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Link } from "~/lib/router/routes";

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
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to="/projects/:slug"
                params={{ slug: project.slug }}
                className="block border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Text as="h3" variant="heading-sm" className="mb-1">
                      {project.display_name}
                    </Text>
                    <Text as="p" variant="body" className="text-muted-foreground text-sm font-mono">
                      {project.repo_identifier}
                    </Text>
                  </div>
                  <div className="text-right text-sm text-muted-foreground shrink-0">
                    <div>{project.shiplogCount} {project.shiplogCount === 1 ? "shiplog" : "shiplogs"}</div>
                    {project.latestShiplogDate && (
                      <time dateTime={project.latestShiplogDate} className="text-xs">
                        last: {project.latestShiplogDate}
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
