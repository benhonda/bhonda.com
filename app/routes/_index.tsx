import type { LoaderFunctionArgs } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect } from "react";

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
      {/* Header */}
      <Text as="h1" variant="display-xs" className="mb-2">
        bhonda.com
      </Text>
      <Text as="p" variant="body" className="text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </Text>

      {/* Tabs */}
      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto gap-0">
          <TabsTrigger
            value="latest"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            latest
          </TabsTrigger>
          <TabsTrigger
            value="ships"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            ships
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
            Latest
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
          </div>
        </TabsContent>

        <TabsContent value="ships">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
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
                        <time dateTime={shiplog.date}>{shiplog.date}</time>
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
        </TabsContent>

        <TabsContent value="other">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
            Other
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
