import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";
import type { ShiplogMeta } from "~/lib/shiplog/fetcher.server";

interface ShiplogListItemProps {
  shiplog: ShiplogMeta;
  userIsAdmin: boolean;
  showTypeLabel?: boolean;
}

export function ShiplogListItem({ shiplog, userIsAdmin, showTypeLabel = false }: ShiplogListItemProps) {
  return (
    <Link
      to="/ships/:slug"
      params={{ slug: shiplog.slug }}
      className="block border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
      style={{ opacity: shiplog.status === "archived" && userIsAdmin ? 0.5 : 1 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {showTypeLabel && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground uppercase">shiplog</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <Text as="h3" variant="heading-sm">
              {shiplog.titleText}
            </Text>
            {userIsAdmin && (
              <span
                className="px-2 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor:
                    shiplog.status === "published"
                      ? "rgb(34 197 94 / 0.2)"
                      : shiplog.status === "draft"
                      ? "rgb(234 179 8 / 0.2)"
                      : "rgb(156 163 175 / 0.2)",
                  color:
                    shiplog.status === "published"
                      ? "rgb(34 197 94)"
                      : shiplog.status === "draft"
                      ? "rgb(234 179 8)"
                      : "rgb(156 163 175)",
                }}
              >
                {shiplog.status}
              </span>
            )}
          </div>
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
  );
}
