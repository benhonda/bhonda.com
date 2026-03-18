import type { ProjectSlug } from "~/lib/projects/projects-config";
import { projectsBySlug } from "~/lib/projects/projects-config";
import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";

export type TagProps =
  | { project: ProjectSlug; topic?: never }
  | { topic: string; project?: never };

/** Base pill className — shared by Tag and plain tag pills. */
export const tagPillClass = "bg-muted rounded px-2 py-0.5";

/** Inline tag pill. `project` variant links to /projects/:slug; `topic` variant links to /topics/:topic. */
export function Tag({ project, topic }: TagProps) {
  const pillClass = `${tagPillClass} hover:bg-muted/80 transition-colors`;

  if (topic !== undefined) {
    return (
      <Link to="/topics/:topic" params={{ topic }}>
        <Text as="span" variant="microcopy" className={pillClass}>
          {topic}
        </Text>
      </Link>
    );
  }

  const config = projectsBySlug[project];
  return (
    <Link to="/projects/:slug" params={{ slug: project }}>
      <Text as="span" variant="microcopy" className={pillClass}>
        #{config.name}
      </Text>
    </Link>
  );
}
