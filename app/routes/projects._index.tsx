import type { MetaFunction } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { Text } from "~/components/misc/text";
import { useLoaderData } from "react-router";
import { PageHeader } from "~/components/misc/page-header";
import { Link } from "~/lib/router/routes";
import { ExternalLink, Github } from "lucide-react";
import {
  PROJECTS_CONFIG,
  projectUrlLabel,
  projectDotColor,
  projectsBySlug,
  type ProjectConfig,
  type ProjectSlug,
} from "~/lib/projects/projects-config";
import { allShiplogs } from "~/lib/shiplogs/shiplog-registry";
import { getDateRangeFromISOWeek, isoWeekEndDateString } from "~/lib/shiplog/iso-week";
import { ProjectActivityMatrix } from "~/components/projects/project-activity-matrix";

/** Trailing window for the activity matrix. */
const WINDOW_DAYS = 90;

/** Build the project × week presence matrix for shiplogs in the trailing window. */
function buildActivityMatrix() {
  const now = new Date(); // request-time, server-side
  const cutoff = new Date(now);
  cutoff.setUTCDate(now.getUTCDate() - WINDOW_DAYS);

  const inWindow = allShiplogs.filter((s) => {
    const end = getDateRangeFromISOWeek(s.year, s.week).end;
    return end >= cutoff && end <= now;
  });

  const weekKey = (year: number, week: number) => `${year}-${week}`;

  // Week columns, oldest → newest, deduped (defends against >1 shiplog per ISO week).
  const weekMap = new Map<string, { year: number; week: number; date: string }>();
  for (const s of inWindow) {
    weekMap.set(weekKey(s.year, s.week), {
      year: s.year,
      week: s.week,
      date: isoWeekEndDateString(s.year, s.week),
    });
  }
  const weeks = [...weekMap.values()].sort((a, b) => a.year - b.year || a.week - b.week);

  // Projects tagged per week.
  const taggedByWeek = new Map<string, Set<ProjectSlug>>();
  const activeSlugs = new Set<ProjectSlug>();
  for (const s of inWindow) {
    const k = weekKey(s.year, s.week);
    const set = taggedByWeek.get(k) ?? new Set<ProjectSlug>();
    for (const slug of s.projectTags ?? []) {
      set.add(slug);
      activeSlugs.add(slug);
    }
    taggedByWeek.set(k, set);
  }

  const rows = [...activeSlugs]
    .map((slug) => {
      const cells = weeks.map((w) => taggedByWeek.get(weekKey(w.year, w.week))?.has(slug) ?? false);
      return {
        slug,
        name: projectsBySlug[slug]?.name ?? slug,
        color: projectDotColor(slug),
        cells,
        count: cells.filter(Boolean).length,
        lastActiveIdx: cells.lastIndexOf(true),
      };
    })
    // most-recently-active first, then most-active, then alphabetical
    .sort((a, b) => b.lastActiveIdx - a.lastActiveIdx || b.count - a.count || a.name.localeCompare(b.name))
    .map(({ lastActiveIdx: _drop, ...row }) => row);

  return {
    weeks,
    rows,
    rangeStart: weeks[0]?.date ?? null,
    rangeEnd: weeks[weeks.length - 1]?.date ?? null,
  };
}

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "Projects | Ben Honda's Dev Blog" },
    { name: "description", content: "A look at the projects I've been working on." },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/projects" },
    { property: "og:title", content: "Projects | Ben Honda's Dev Blog" },
    { property: "og:description", content: "A look at the projects I've been working on." },
    { property: "og:url", content: "https://www.bhonda.com/projects" },
  ]);

export function loader() {
  const projects = PROJECTS_CONFIG.map((p) => {
    const config = p as ProjectConfig;
    const tagged = allShiplogs.filter((s) => s.projectTags?.includes(p.slug));
    return {
      ...config,
      repoUrl: config.repos.find((r) => r.repoUrl)?.repoUrl ?? null,
      shiplogCount: tagged.length,
      latestShiplogDate: tagged[0] ? isoWeekEndDateString(tagged[0].year, tagged[0].week) : null,
    };
  });
  return { projects, matrix: buildActivityMatrix() };
}

export default function ProjectsIndex() {
  const { projects, matrix } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* DOM-first so it stacks above the cards when collapsed; pinned to the right column on lg */}
        <aside className="lg:col-start-3 lg:row-start-1 lg:sticky lg:top-8">
          <ProjectActivityMatrix
            weeks={matrix.weeks}
            rows={matrix.rows}
            rangeStart={matrix.rangeStart}
            rangeEnd={matrix.rangeEnd}
          />
        </aside>

        <section className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <Text as="h2" variant="heading-md" className="mb-6">
            All projects
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to="/projects/:slug"
              params={{ slug: project.slug }}
              className="flex flex-col border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
            >
              <Text as="h3" variant="heading-sm" className="mb-1">
                {project.name}
              </Text>
              {project.description && (
                <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
                  {project.description}
                </Text>
              )}
              <div className="mt-auto">
                {(project.url || project.repoUrl) && (
                  <div className="flex items-center gap-3 mb-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="size-3" />
                        {projectUrlLabel(project.url)}
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="size-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {project.shiplogCount} {project.shiplogCount === 1 ? "shiplog" : "shiplogs"}
                  </span>
                  {project.latestShiplogDate && (
                    <time dateTime={project.latestShiplogDate}>{project.latestShiplogDate}</time>
                  )}
                </div>
              </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
