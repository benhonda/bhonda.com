import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";

/** A single week column in the matrix (week-ending Sunday). */
export interface MatrixWeek {
  year: number;
  week: number;
  /** Week-ending date, `"YYYY-MM-DD"`. */
  date: string;
}

/** One project's activity across the window; `cells` aligns 1:1 with `weeks`. */
export interface MatrixRow {
  slug: string;
  name: string;
  color: string;
  cells: boolean[];
  count: number;
}

export interface ProjectActivityMatrixProps {
  weeks: MatrixWeek[];
  rows: MatrixRow[];
  rangeStart: string | null;
  rangeEnd: string | null;
}

/**
 * Trailing-window heatmap: rows = projects active in the window, columns = the weekly
 * shiplogs (ISO weeks) in it. A filled cell means the project was tagged in that week's
 * shiplog — presence only, since per-project commit counts aren't tracked. Reads like a
 * per-project activity streak, left (oldest) → right (most recent).
 */
export function ProjectActivityMatrix({ weeks, rows, rangeStart, rangeEnd }: ProjectActivityMatrixProps) {
  if (rows.length === 0 || weeks.length === 0) return null;

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Text as="h3" variant="heading-sm">
          Active projects
        </Text>
        {rangeStart && rangeEnd && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {rangeStart} → {rangeEnd}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <div
            key={row.slug}
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: "minmax(0, 8rem) 1fr" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.color }}
                aria-hidden
              />
              <Link
                to="/projects/:slug"
                params={{ slug: row.slug }}
                className="truncate text-sm font-normal text-muted-foreground hover:text-foreground hover:underline"
              >
                {row.name}
              </Link>
            </div>

            <div
              className="grid gap-1"
              // single row, capped at ~12px per tile but shrinks to fit the rail → never wraps
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 0.75rem))` }}
            >
              {row.cells.map((active, i) => (
                <div
                  key={weeks[i].date}
                  className="aspect-square rounded-[2px] bg-muted"
                  style={active ? { backgroundColor: row.color } : undefined}
                  title={`${row.name} · ${weeks[i].date}${active ? "" : " · no activity"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
