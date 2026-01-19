import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Text } from "~/components/misc/text";
import { useAction } from "~/hooks/use-action";
import { fetchShiplogsActionDefinition } from "~/lib/actions/fetch-shiplogs/action-definition";
import { useEffect, useState } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useLoaderData } from "react-router";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";
import { Button } from "~/components/ui/button";
import type { Shiplog } from "~/lib/shiplog/fetcher.server";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [allShiplogs, setAllShiplogs] = useState<Shiplog[]>([]);

  // Load initial shiplogs on mount
  useEffect(() => {
    submit({ page: 1, limit: 12 });
  }, []);

  // Accumulate shiplogs when new data arrives
  useEffect(() => {
    if (data?.shiplogs) {
      if (currentPage === 1) {
        setAllShiplogs(data.shiplogs);
      } else {
        setAllShiplogs((prev) => [...prev, ...data.shiplogs]);
      }
    }
  }, [data?.shiplogs, currentPage]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    submit({ page: nextPage, limit: 12 });
  };

  const hasMore = data?.hasMore ?? false;
  const showLoadMore = !isLoading && hasMore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        {/* Shiplogs Content */}
        <Text as="h2" variant="heading-md" className="mb-6">
          Shiplogs
        </Text>
        {isLoading && currentPage === 1 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            Loading shiplogs...
          </Text>
        ) : allShiplogs.length === 0 ? (
          <Text as="p" variant="body" className="text-muted-foreground">
            No shiplogs found.
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

            {/* Load More Button */}
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
