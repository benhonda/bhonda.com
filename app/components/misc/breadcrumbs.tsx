import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";
import { ChevronRight } from "lucide-react";

type Crumb =
  | { label: string; to: "/projects" | "/ships" | "/" }
  | { label: string };

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-6">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />}
            {"to" in crumb ? (
              <Link to={crumb.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <Text as="span" variant="body-sm" className={isLast ? "text-foreground" : "text-muted-foreground"}>
                {crumb.label}
              </Text>
            )}
          </div>
        );
      })}
    </nav>
  );
}
