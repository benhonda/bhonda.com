import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";
import { getAllProjects } from "~/lib/shiplog/project-db-service.server";
import { publishedPeople } from "~/lib/people/people-registry";
import type { ReactNode } from "react";


export const meta: MetaFunction = () => [
  { title: "Ben Honda's Dev Blog" },
  { name: "description", content: "Weekly development shiplogs and projects" },
  { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  const [shiplogs, allProjects] = await Promise.all([
    fetchShiplogs(userIsAdmin, 4, 0),
    getAllProjects(),
  ]);

  const people = publishedPeople.slice(0, 4);

  const projects = allProjects.filter((p) => p.shiplogCount > 0).slice(0, 4);

  return { shiplogs, people, projects };
}

function LatestBox({ title, viewAll, children }: { title: string; viewAll: ReactNode; children: ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-6 flex flex-col">
      <Text as="h3" variant="heading-sm">
        {title}
      </Text>
      <div className="mt-4 divide-y divide-border flex-1">{children}</div>
      <div className="mt-4 pt-3 border-t border-border">{viewAll}</div>
    </div>
  );
}

export default function Index() {
  const { shiplogs, people, projects } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LatestBox
          title="Shiplogs"
          viewAll={
            <Link to="/ships" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          }
        >
          {shiplogs.length === 0 ? (
            <div className="py-3">
              <Text as="p" variant="body-sm" className="text-muted-foreground">
                No shiplogs yet.
              </Text>
            </div>
          ) : (
            shiplogs.map((s) => (
              <Link
                key={s.slug}
                to="/ships/:slug"
                params={{ slug: s.slug }}
                title={s.titleText}
                className="flex items-center justify-between py-3 gap-4 group"
              >
                <Text
                  as="span"
                  variant="body-sm"
                  className="group-hover:text-primary transition-colors line-clamp-1"
                >
                  {s.titleText}
                </Text>
                <Text as="span" variant="microcopy" className="text-muted-foreground shrink-0 whitespace-nowrap">
                  W{s.week}
                </Text>
              </Link>
            ))
          )}
        </LatestBox>

        <LatestBox
          title="People"
          viewAll={
            <Link to="/people" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          }
        >
          {people.length === 0 ? (
            <div className="py-3">
              <Text as="p" variant="body-sm" className="text-muted-foreground">
                No profiles yet.
              </Text>
            </div>
          ) : (
            people.map((p) => (
              <Link
                key={p.slug}
                to="/people/:slug"
                params={{ slug: p.slug }}
                title={p.name}
                className="flex items-center justify-between py-3 gap-4 group"
              >
                <Text
                  as="span"
                  variant="body-sm"
                  className="group-hover:text-primary transition-colors line-clamp-1"
                >
                  {p.name}
                </Text>
                {p.lastUpdated && (
                  <time dateTime={p.lastUpdated}>
                    <Text as="span" variant="microcopy" className="text-muted-foreground shrink-0 whitespace-nowrap">
                      {p.lastUpdated}
                    </Text>
                  </time>
                )}
              </Link>
            ))
          )}
        </LatestBox>

        <LatestBox
          title="Projects"
          viewAll={
            <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          }
        >
          {projects.length === 0 ? (
            <div className="py-3">
              <Text as="p" variant="body-sm" className="text-muted-foreground">
                No projects yet.
              </Text>
            </div>
          ) : (
            projects.map((p) => (
              <Link
                key={p.slug}
                to="/projects/:slug"
                params={{ slug: p.slug }}
                title={p.description ? `${p.display_name} | ${p.description}` : p.display_name}
                className="flex py-3 group min-w-0"
              >
                <span className="truncate font-body text-sm sm:text-sm-md font-normal tracking-normal">
                  <span className="group-hover:text-primary transition-colors">{p.display_name}</span>
                  {p.description && (
                    <span className="text-muted-foreground"><span className="opacity-30"> |</span> {p.description}</span>
                  )}
                </span>
              </Link>
            ))
          )}
        </LatestBox>
      </div>
    </div>
  );
}
