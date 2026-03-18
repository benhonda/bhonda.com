import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, data } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { PostCard } from "~/components/blog/post-card";
import { allPosts, publishedPosts } from "~/lib/blog/blog-registry";
import { allShiplogs, publishedShiplogs } from "~/lib/shiplogs/shiplog-registry";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { ShiplogListItem } from "~/components/shiplog/shiplog-list-item";

export const meta: MetaFunction<typeof loader> = ({ data: loaderData, matches }) => {
  if (!loaderData) return [];
  const { topic } = loaderData;
  return mergeMeta(matches, [
    { title: `#${topic} | Ben Honda` },
    { name: "description", content: `Posts and shiplogs tagged with "${topic}".` },
  ]);
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const topic = params.topic;
  if (!topic) throw data(null, { status: 404 });

  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  const posts = (userIsAdmin ? allPosts : publishedPosts).filter((p) =>
    (p.topics ?? []).includes(topic),
  );
  const shiplogs = (userIsAdmin ? allShiplogs : publishedShiplogs).filter((s) =>
    (s.topics ?? []).includes(topic),
  );

  if (posts.length === 0 && shiplogs.length === 0) {
    throw data(null, { status: 404 });
  }

  return { topic, posts, shiplogs, userIsAdmin };
}

export default function TopicPage() {
  const { topic, posts, shiplogs, userIsAdmin } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="mb-8">
        <Text as="h2" variant="heading-md" className="mb-1">
          Topic: {topic}
        </Text>
        <Text as="p" variant="body-sm" className="text-muted-foreground">
          Posts and shiplogs tagged with &ldquo;{topic}&rdquo;.
        </Text>
      </div>

      {posts.length > 0 && (
        <section className="mb-10">
          <Text as="h3" variant="heading-sm" className="mb-4">
            Posts
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {shiplogs.length > 0 && (
        <section>
          <Text as="h3" variant="heading-sm" className="mb-4">
            Shiplogs
          </Text>
          <div className="space-y-4">
            {shiplogs.map((shiplog) => (
              <ShiplogListItem key={shiplog.slug} shiplog={shiplog} userIsAdmin={userIsAdmin} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
