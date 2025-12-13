import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useLoaderData } from "react-router";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";

export const meta: MetaFunction = () => {
  return [
    { title: "Ben Honda's Dev Blog" },
    { name: "description", content: "Weekly development shiplogs and projects" },
    { tagName: "link", rel: "canonical", href: "https://bhonda.com/" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);
  return { userIsAdmin };
}

export const action = action_handler;

export default function Index() {
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
              <ShiplogListItem
                key={shiplog.slug}
                shiplog={shiplog}
                userIsAdmin={userIsAdmin}
                showTypeLabel
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
