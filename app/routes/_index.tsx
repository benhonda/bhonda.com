import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect } from "react";
import { PageHeader } from "~/components/misc/page-header";

export const meta: MetaFunction = () => {
  return [
    { title: "Ben Honda's Dev Blog" },
    { name: "description", content: "Weekly development shiplogs and projects" },
    { tagName: "link", rel: "canonical", href: "https://bhonda.com/" },
  ];
};

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function Index() {
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
        {/* Latest Timeline Content */}
        <Text as="h2" variant="heading-md" className="mb-6">
          Latest
        </Text>
        {isLoading ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            Loading...
          </Text>
        ) : shiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No content found.
          </Text>
        ) : (
          <div className="space-y-4">
            {shiplogs.map((shiplog) => (
              <Link
                key={shiplog.slug}
                to="/ships/:slug"
                params={{ slug: shiplog.slug }}
                className="block border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground uppercase">shiplog</span>
                    </div>
                    <Text as="h3" variant="heading-sm" className="mb-2">
                      {shiplog.titleText}
                    </Text>
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
