import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { useAction } from "~/hooks/use-action";
import { fetchProjectShiplogsActionDefinition } from "~/lib/actions/fetch-project-shiplogs/action-definition";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";
import { Button } from "~/components/ui/button";
import { getProjectBySlug } from "~/lib/shiplog/project-db-service.server";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { data as routerData } from "react-router";
import type { ShiplogMeta } from "~/lib/shiplog/fetcher.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.project) {
    return [{ title: "Project Not Found | Ben Honda's Dev Blog" }];
  }
  return [
    { title: `${data.project.display_name} | Ben Honda's Dev Blog` },
    { name: "description", content: `Shiplogs for ${data.project.display_name}` },
    { tagName: "link", rel: "canonical", href: `https://bhonda.com/projects/${data.project.slug}` },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Error("Missing slug");

  const project = await getProjectBySlug(slug);
  if (!project) throw routerData(null, { status: 404 });

  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  return { project, userIsAdmin };
}

export const action = action_handler;

export default function ProjectDetail() {
  const { project, userIsAdmin } = useLoaderData<typeof loader>();
  const { data, isLoading, submit } = useAction(fetchProjectShiplogsActionDefinition);
  const currentPageRef = useRef(1);
  const [allShiplogs, setAllShiplogs] = useState<ShiplogMeta[]>([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    submit({ projectSlug: project.slug, page: 1, limit: 12 });
  }, [project.slug]);

  useLayoutEffect(() => {
    if (data?.shiplogs) {
      setAllShiplogs((prev) => {
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          return data.shiplogs;
        }
        return [...prev, ...data.shiplogs];
      });
    }
  }, [data?.shiplogs]);

  const handleLoadMore = () => {
    currentPageRef.current += 1;
    submit({ projectSlug: project.slug, page: currentPageRef.current, limit: 12 });
  };

  const hasMore = data?.hasMore ?? false;
  const showLoadMore = !isLoading && hasMore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <Text as="h2" variant="heading-md" className="mb-1">
          {project.display_name}
        </Text>
        <Text as="p" variant="body" className="text-muted-foreground text-sm font-mono mb-6">
          {project.repo_identifier}
        </Text>

        {isLoading && currentPageRef.current === 1 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            Loading shiplogs...
          </Text>
        ) : allShiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No shiplogs yet for this project.
          </Text>
        ) : (
          <>
            <div className="space-y-4">
              {allShiplogs.map((shiplog) => (
                <ShiplogListItem
                  key={shiplog.slug}
                  shiplog={shiplog}
                  userIsAdmin={userIsAdmin}
                />
              ))}
            </div>

            {showLoadMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary-filled"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
