import type { LoaderFunctionArgs } from "react-router";
import { useLocation } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect } from "react";
import GithubSvg from "~/components/svgs/GithubSvg";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function ShipsIndex() {
  const location = useLocation();
  const { data, isLoading, submit } = useAction(fetchShiplogsActionDefinition);
  const shiplogs = data?.shiplogs ?? [];

  // Load shiplogs on mount
  useEffect(() => {
    submit({});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <Text as="h1" variant="display-xs">
          bhonda.com
        </Text>
        <a
          href="https://github.com/benhonda"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-muted-foreground transition-colors"
        >
          <GithubSvg className="w-6 h-6" />
        </a>
      </div>
      <Text as="p" variant="body" className="text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </Text>

      {/* Navigation Tabs */}
      <div className="w-full">
        <div className="flex gap-0 mb-6">
          <Link
            to="/"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            latest
          </Link>
          <Link
            to="/ships"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/ships"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            ships
          </Link>
          <Link
            to="/other"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/other"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            other
          </Link>
        </div>

        {/* Ships Content */}
        <Text as="h2" variant="heading-md" className="mb-6">
          Ships
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
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Text as="h3" variant="heading-sm" className="mb-2">
                      {shiplog.title}
                    </Text>
                    <Text as="p" variant="body" className="text-muted-foreground mb-3">
                      {shiplog.description}
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
