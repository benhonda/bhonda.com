import type { ProjectSlug } from "~/lib/projects/projects-config";
import { projectsBySlug } from "~/lib/projects/projects-config";
import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";

export type TagProps = { project: ProjectSlug };

/** Base pill className — shared by Tag and plain tag pills. */
export const tagPillClass = "bg-muted rounded px-2 py-0.5";

/** Inline project tag pill — links to /projects/:slug. `project` must be a known ProjectSlug. */
export function Tag({ project }: TagProps) {
  const config = projectsBySlug[project];
  return (
    <Link to="/projects/:slug" params={{ slug: project }}>
      <Text as="span" variant="microcopy" className={`${tagPillClass} hover:bg-muted/80 transition-colors`}>
        #{config.name}
      </Text>
    </Link>
  );
}
