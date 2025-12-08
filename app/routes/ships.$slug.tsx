import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Link } from "~/lib/router/routes";
import { fetchShiplogBySlug } from "~/lib/shiplog/fetcher.server";
import { Text } from "~/components/misc/text";
import { MarkdownContent } from "~/components/misc/markdown-content";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const shiplog = await fetchShiplogBySlug(slug);

  if (!shiplog) {
    throw new Response("Not Found", { status: 404 });
  }

  return { shiplog };
}

export default function ShiplogPage() {
  const { shiplog } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
        ← Back to home
      </Link>

      {/* Header */}
      <header className="mb-8">
        <Text as="h1" variant="display-xs" className="mb-3">
          {shiplog.title}
        </Text>
        <Text as="p" variant="body" className="text-muted-foreground mb-4">
          {shiplog.description}
        </Text>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={shiplog.date}>{shiplog.date}</time>
          <span>•</span>
          <span>Week {shiplog.week}</span>
          <span>•</span>
          <span>{shiplog.stats.repos} repos</span>
          <span>•</span>
          <span>{shiplog.stats.commits} commits</span>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-slate max-w-none">
        <MarkdownContent content={shiplog.content} />
      </article>
    </div>
  );
}
