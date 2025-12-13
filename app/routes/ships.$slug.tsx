import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { Link } from "~/lib/router/routes";
import { fetchShiplogBySlug } from "~/lib/shiplog/fetcher.server";
import type { ShiplogStatus } from "~/lib/shiplog/db-service.server";
import { Text } from "~/components/misc/text";
import { MarkdownContent } from "~/components/misc/markdown-content";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowLeftIcon, EditIcon, HistoryIcon } from "lucide-react";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";
import { useState, useEffect, useRef } from "react";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { useAction } from "~/hooks/use-action";
import { editShiplogActionDefinition } from "~/lib/actions/edit-shiplog/action-definition";
import { fetchShiplogVersionsActionDefinition } from "~/lib/actions/fetch-shiplog-versions/action-definition";
import { updateShiplogStatusActionDefinition } from "~/lib/actions/update-shiplog-status/action-definition";
import { VersionDiffModal } from "~/components/shiplog/version-diff-modal";
import { useRevalidator } from "react-router";
import { ShiplogReactions } from "~/components/shiplog/shiplog-reactions";
import { db } from "~/lib/db/index.server";
import { shiplogsTable, shiplogReactionsTable } from "~/lib/db/schemas/shiplog-schema";
import { eq } from "drizzle-orm";
import { getAnonymousIdFromRequest } from "~/lib/analytics/get-anonymous-id.server";
import { browserTrackEvent } from "~/lib/analytics/events.defaults.client";
import { getOrCreateStartTime, getElapsedSeconds } from "~/lib/analytics/session-utils";

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data?.shiplog) {
    return [
      { title: "Shiplog Not Found | Ben Honda's Dev Blog" },
      { name: "description", content: "The requested shiplog could not be found." },
    ];
  }

  const { shiplog } = data;
  const slug = params.slug || "";

  return [
    { title: `${shiplog.titleText} | Ben Honda's Dev Blog` },
    { name: "description", content: shiplog.previewText },
    { tagName: "link", rel: "canonical", href: `https://bhonda.com/ships/${slug}` },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await getUser(request);
  const userIsAdmin = isAdmin(user);

  const shiplog = await fetchShiplogBySlug(slug, userIsAdmin);

  if (!shiplog) {
    throw new Response("Not Found", { status: 404 });
  }

  // Get anonymous ID from Segment cookie
  const anonymousId = getAnonymousIdFromRequest(request);

  // Get shiplog from DB to get ID
  const shiplogFromDb = (await db.select().from(shiplogsTable).where(eq(shiplogsTable.slug, slug))).at(0);

  let reactionCounts: Record<string, number> = {};
  let userReactions: string[] = [];

  if (shiplogFromDb && anonymousId) {
    // Get all reactions for this shiplog
    const allReactions = await db
      .select()
      .from(shiplogReactionsTable)
      .where(eq(shiplogReactionsTable.shiplog_id, shiplogFromDb.id));

    // Calculate counts per reaction type
    allReactions.forEach((reaction) => {
      reactionCounts[reaction.reaction_type] = (reactionCounts[reaction.reaction_type] || 0) + 1;
    });

    // Get user's reactions
    userReactions = allReactions.filter((r) => r.anon_session_id === anonymousId).map((r) => r.reaction_type);
  }

  return { shiplog, userIsAdmin, reactionCounts, userReactions };
}

export const action = action_handler;

export default function ShiplogPage() {
  const { shiplog: initialShiplog, userIsAdmin, reactionCounts, userReactions } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<{
    versionId: string;
    timestamp: string;
  } | null>(null);

  const { data: editData, isLoading: isEditLoading, submit: submitEdit } = useAction(editShiplogActionDefinition);
  const { data: versionsData, submit: submitVersions } = useAction(fetchShiplogVersionsActionDefinition);
  const { submit: submitStatusUpdate } = useAction(updateShiplogStatusActionDefinition);

  const shiplog = editData?.shiplog ?? initialShiplog;
  const versions = versionsData?.versions ?? [];

  const hasTrackedOpenRef = useRef(false);
  const hasTrackedReadRef = useRef(false);
  const reactionsRef = useRef<HTMLDivElement>(null);
  const pageStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (userIsAdmin) {
      submitVersions({ slug: shiplog.slug });
    }
  }, [userIsAdmin, shiplog.slug]);

  useEffect(() => {
    if (hasTrackedOpenRef.current) return;

    pageStartTimeRef.current = getOrCreateStartTime();
    browserTrackEvent("Shiplog Opened", {
      slug: shiplog.slug,
      week: shiplog.week,
    });
    hasTrackedOpenRef.current = true;
  }, [shiplog.slug, shiplog.week]);

  useEffect(() => {
    if (!reactionsRef.current || hasTrackedReadRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedReadRef.current) {
            const timeToReadSeconds = getElapsedSeconds(pageStartTimeRef.current);
            browserTrackEvent("Shiplog Read", {
              slug: shiplog.slug,
              week: shiplog.week,
              time_to_read_seconds: timeToReadSeconds,
            });
            hasTrackedReadRef.current = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(reactionsRef.current);

    return () => observer.disconnect();
  }, [shiplog.slug, shiplog.week]);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;

    await submitEdit({
      slug: shiplog.slug,
      editPrompt,
    });

    setEditPrompt("");
    setIsEditing(false);

    submitVersions({ slug: shiplog.slug });
  };

  const handleRestoreComplete = () => {
    revalidator.revalidate();
    submitVersions({ slug: shiplog.slug });
  };

  const handleStatusChange = async (newStatus: ShiplogStatus) => {
    await submitStatusUpdate({
      slug: shiplog.slug,
      status: newStatus,
    });
    revalidator.revalidate();
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
        <div className="flex flex-col gap-3 mb-3">
          {userIsAdmin && !isEditing && (
            <div className="flex gap-2">
              <Select value={shiplog.status} onValueChange={(value) => handleStatusChange(value as ShiplogStatus)}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary-filled" size="sm" onClick={() => setIsEditing(true)}>
                <EditIcon className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              {versions.length > 1 && (
                <Select
                  value={dropdownValue}
                  onValueChange={(versionId) => {
                    setDropdownValue(versionId);
                    const version = versions.find((v) => v.versionId === versionId);
                    if (version) {
                      setSelectedVersion({
                        versionId: version.versionId,
                        timestamp: version.lastModified,
                      });
                    }
                  }}
                >
                  <SelectTrigger size="sm">
                    <HistoryIcon className="w-4 h-4" />
                    <SelectValue placeholder="Versions" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version, index) => (
                      <SelectItem key={version.versionId} value={version.versionId}>
                        v{versions.length - index} - {new Date(version.lastModified).toLocaleString()}
                        {version.isLatest && " (current)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
          <Text as="h1" variant="display-xs">
            {shiplog.titleText}
          </Text>
        </div>
        <Text as="p" variant="body" className="text-muted-foreground mb-4">
          {shiplog.introText}
        </Text>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <time dateTime={shiplog.publishedAt}>{shiplog.publishedAt}</time>
          <span>Week {shiplog.week}</span>
          <span>{shiplog.stats.repos} repos · {shiplog.stats.commits} commits</span>
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
            disabled={isEditLoading}
          />
          <div className="flex gap-2">
            <Button onClick={handleEdit} disabled={isEditLoading || !editPrompt.trim()}>
              {isEditLoading ? "Editing..." : "Submit"}
            </Button>
            <Button variant="secondary-filled" onClick={() => setIsEditing(false)} disabled={isEditLoading}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate max-w-none">
        <MarkdownContent content={shiplog.content} />
      </article>

      {/* Reactions */}
      <div ref={reactionsRef} className="mt-8 pt-8 border-t border-border">
        <ShiplogReactions
          shiplogSlug={shiplog.slug}
          shiplogWeek={shiplog.week}
          initialCounts={reactionCounts}
          initialUserReactions={userReactions}
        />
      </div>

      {/* AI Generation Notice */}
      <Text variant="microcopy" className="mt-8 text-muted-foreground">
        This shiplog is partially AI-generated from commit history.
      </Text>

      {/* Version Diff Modal */}
      {selectedVersion && (
        <VersionDiffModal
          open={!!selectedVersion}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedVersion(null);
              setDropdownValue("");
            }
          }}
          slug={shiplog.slug}
          versionId={selectedVersion.versionId}
          versionTimestamp={selectedVersion.timestamp}
          onRestoreComplete={handleRestoreComplete}
        />
      )}
    </div>
  );
}
