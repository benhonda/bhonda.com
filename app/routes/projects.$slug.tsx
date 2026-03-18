import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { useLoaderData, data as routerData } from "react-router";
import { Text } from "~/components/misc/text";
import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { ExternalLink, Github } from "lucide-react";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";
import { projectsBySlug, type ProjectConfig, type ProjectSlug } from "~/lib/projects/projects-config";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { allShiplogs, publishedShiplogs } from "~/lib/shiplogs/shiplog-registry";

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  if (!data?.project) {
    return [{ title: "Project Not Found | Ben Honda's Dev Blog" }];
  }
  return mergeMeta(matches, [
    { title: `${data.project.name} | Ben Honda's Dev Blog` },
    { name: "description", content: `Shiplogs for ${data.project.name}` },
    { tagName: "link", rel: "canonical", href: `https://www.bhonda.com/projects/${data.project.slug}` },
    { property: "og:title", content: `${data.project.name} | Ben Honda's Dev Blog` },
    { property: "og:description", content: `Shiplogs for ${data.project.name}` },
    { property: "og:url", content: `https://www.bhonda.com/projects/${data.project.slug}` },
  ]);
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const project = (projectsBySlug as Record<string, ProjectConfig | undefined>)[slug];
  if (!project) throw routerData(null, { status: 404 });

  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  // project.slug is a valid ProjectSlug — confirmed by 404 guard above
  const projectSlug = project.slug as ProjectSlug;
  const shiplogs = (userIsAdmin ? allShiplogs : publishedShiplogs).filter((s) =>
    s.projectTags?.includes(projectSlug)
  );

  return { project, shiplogs, userIsAdmin };
}

export default function ProjectDetail() {
  const { project, shiplogs, userIsAdmin } = useLoaderData<typeof loader>();
  const repoUrl = project.repos.find((r) => r.repoUrl)?.repoUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <Breadcrumbs crumbs={[{ label: "Projects", to: "/projects" }, { label: project.name }]} />

        <Text as="h2" variant="heading-md" className="mb-1">
          {project.name}
        </Text>
        {project.description && (
          <Text as="p" variant="body" className="text-muted-foreground mb-3">
            {project.description}
          </Text>
        )}
        {(project.url || repoUrl) && (
          <div className="flex items-center gap-4 mb-6">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3.5" />
                {new URL(project.url).hostname.replace("www.", "")}
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="size-3.5" />
                GitHub
              </a>
            )}
          </div>
        )}

        {shiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No shiplogs yet for this project.
          </Text>
        ) : (
          <div className="space-y-4">
            {shiplogs.map((shiplog) => (
              <ShiplogListItem key={shiplog.slug} shiplog={shiplog} userIsAdmin={userIsAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
