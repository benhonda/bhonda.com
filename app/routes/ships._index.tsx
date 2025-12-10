import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Shiplogs | Ben Honda's Dev Blog" },
    { name: "description", content: "Weekly development shiplogs tracking commits and projects" },
    { tagName: "link", rel: "canonical", href: "https://bhonda.com/ships" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);
  return { userIsAdmin };
}

export const action = action_handler;

export default function ShipsIndex() {
  const { userIsAdmin } = useLoaderData<typeof loader>();
  const { data, isLoading, submit } = useAction(fetchShiplogsActionDefinition);
  const shiplogs = data?.shiplogs ?? [];

  // Load shiplogs on mount
  useEffect(() => {
    submit({});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        {/* Shiplogs Content */}
        <Text as="h2" variant="heading-md" className="mb-6">
          Shiplogs
        </Text>
        {isLoading ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            Loading shiplogs...
          </Text>
        ) : shiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No shiplogs found.
          </Text>
        ) : (
          <div className="space-y-4">
            {shiplogs.map((shiplog) => (
              <Link
                key={shiplog.slug}
                to="/ships/:slug"
                params={{ slug: shiplog.slug }}
                className="block border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                style={{ opacity: shiplog.status === "archived" && userIsAdmin ? 0.5 : 1 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Text as="h3" variant="heading-sm">
                        {shiplog.titleText}
                      </Text>
                      {userIsAdmin && (
                        <span
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              shiplog.status === "published"
                                ? "rgb(34 197 94 / 0.2)"
                                : shiplog.status === "draft"
                                ? "rgb(234 179 8 / 0.2)"
                                : "rgb(156 163 175 / 0.2)",
                            color:
                              shiplog.status === "published"
                                ? "rgb(34 197 94)"
                                : shiplog.status === "draft"
                                ? "rgb(234 179 8)"
                                : "rgb(156 163 175)",
                          }}
                        >
                          {shiplog.status}
                        </span>
                      )}
                    </div>
                    <Text as="p" variant="body" className="text-muted-foreground mb-3">
                      {shiplog.previewText}
                    </Text>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <time dateTime={shiplog.publishedAt}>{shiplog.publishedAt}</time>
                      <span>•</span>
                      <span>{shiplog.stats.repos} repos</span>
                      <span>•</span>
                      <span>{shiplog.stats.commits} commits</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">W{shiplog.week}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
