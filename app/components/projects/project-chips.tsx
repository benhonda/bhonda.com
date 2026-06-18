import { cn } from "~/lib/utils";
import { projectsBySlug, projectDotColor, type ProjectSlug } from "~/lib/projects/projects-config";

interface ProjectChipsProps {
  slugs: ProjectSlug[];
  className?: string;
}

/**
 * Tight, GitHub-language-dot style listing of the projects touched by a shiplog:
 * a small colored dot + project name per chip, wrapping. Rendered as plain spans
 * (no nested links) so it can live inside a shiplog card that is itself a link.
 */
export function ProjectChips({ slugs, className }: ProjectChipsProps) {
  if (slugs.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {slugs.map((slug) => {
        const project = projectsBySlug[slug];
        if (!project) return null; // tag references an unknown project — skip silently
        return (
          <span key={slug} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: projectDotColor(slug) }}
              aria-hidden
            />
            {project.name}
          </span>
        );
      })}
    </div>
  );
}
