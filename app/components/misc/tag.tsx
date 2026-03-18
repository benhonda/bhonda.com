import type { ProjectSlug } from "~/lib/projects/projects-config";
import { projectsBySlug } from "~/lib/projects/projects-config";
import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";

export type TagProps =
  | { project: ProjectSlug; topic?: never }
  | { topic: string; project?: never };

const pillClass = "bg-primary/20 text-primary-foreground dark:text-primary rounded px-2 py-0.5 hover:bg-primary/10 transition-colors";

/** Inline tag pill. `project` variant links to /projects/:slug; `topic` variant links to /topics/:topic. */
export function Tag({ project, topic }: TagProps) {
  if (topic !== undefined) {
    return (
      <Link to="/topics/:topic" params={{ topic }}>
        <Text as="span" variant="microcopy" className={pillClass}>
          #{topic}
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
