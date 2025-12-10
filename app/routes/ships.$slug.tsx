import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Link } from "~/lib/router/routes";
import { fetchShiplogBySlug } from "~/lib/shiplog/fetcher.server";
import { Text } from "~/components/misc/text";
import { MarkdownContent } from "~/components/misc/markdown-content";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ArrowLeftIcon, EditIcon } from "lucide-react";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useState } from "react";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { useAction } from "~/hooks/use-action";
import { editShiplogActionDefinition } from "~/lib/actions/edit-shiplog/action-definition";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const shiplog = await fetchShiplogBySlug(slug);

  if (!shiplog) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  return { shiplog, userIsAdmin };
}

export const action = action_handler;

export default function ShiplogPage() {
  const { shiplog: initialShiplog, userIsAdmin } = useLoaderData<typeof loader>();
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const { data, isLoading, submit } = useAction(editShiplogActionDefinition);
  const shiplog = data?.shiplog ?? initialShiplog;

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;

    await submit({
      slug: shiplog.slug,
      editPrompt,
    });

    setEditPrompt("");
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link to="/">
        <Button variant="secondary-link" size="sm">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to home</span>
        </Button>
      </Link>

      {/* Header */}
      <header className="mt-4 mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <Text as="h1" variant="display-xs">
            {shiplog.title}
          </Text>
          {userIsAdmin && !isEditing && (
            <Button variant="secondary-filled" size="sm" onClick={() => setIsEditing(true)}>
              <EditIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
        <Text as="p" variant="body" className="text-muted-foreground mb-4">
          {shiplog.description}
        </Text>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={shiplog.publishedAt}>{shiplog.publishedAt}</time>
          <span>•</span>
          <span>Week {shiplog.week}</span>
          <span>•</span>
          <span>{shiplog.stats.repos} repos</span>
          <span>•</span>
          <span>{shiplog.stats.commits} commits</span>
        </div>
      </header>

      {/* Edit UI */}
      {userIsAdmin && isEditing && (
        <div className="mb-8 border border-border rounded-lg p-6 bg-muted/30">
          <Text as="h3" variant="heading-sm" className="mb-4">
            Edit Shiplog
          </Text>
          <Textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="Tell Claude what you want to change..."
            className="w-full min-h-32 mb-4"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <Button onClick={handleEdit} disabled={isLoading || !editPrompt.trim()}>
              {isLoading ? "Editing..." : "Submit"}
            </Button>
            <Button variant="secondary-filled" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate max-w-none">
        <MarkdownContent content={shiplog.content} />
      </article>
    </div>
  );
}
