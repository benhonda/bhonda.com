import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { Text } from "~/components/misc/text";
import { PageHeader } from "~/components/misc/page-header";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useLoaderData } from "react-router";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";
import { allShiplogs, publishedShiplogs } from "~/lib/shiplogs/shiplog-registry";

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "Shiplogs | Ben Honda's Dev Blog" },
    { name: "description", content: "Weekly development shiplogs tracking commits and projects" },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/ships" },
    { property: "og:title", content: "Shiplogs | Ben Honda's Dev Blog" },
    { property: "og:description", content: "Weekly development shiplogs tracking commits and projects" },
    { property: "og:url", content: "https://www.bhonda.com/ships" },
  ]);

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);
  const shiplogs = userIsAdmin ? allShiplogs : publishedShiplogs;
  return { shiplogs, userIsAdmin };
}

export default function ShipsIndex() {
  const { shiplogs, userIsAdmin } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <Text as="h2" variant="heading-md" className="mb-6">
          Shiplogs
        </Text>
        {shiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No shiplogs yet.
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
