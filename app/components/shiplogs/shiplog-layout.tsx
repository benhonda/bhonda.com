import type { ReactNode } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

type ShiplogLayoutProps = {
  meta: ShiplogMeta;
  children: ReactNode;
};

export function ShiplogLayout({ meta, children }: ShiplogLayoutProps) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader />
        <Breadcrumbs crumbs={[{ label: "Ships", to: "/ships" }, { label: meta.titleText }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-border rounded-lg p-8">
          <header className="mb-8">
            <Text as="h1" variant="display-xs">
              {meta.titleText}
            </Text>
            <Spacer size="xs" />
            <div className="flex items-center gap-3 flex-wrap">
              <time dateTime={meta.publishedAt}>
                <Text as="span" variant="microcopy" className="text-muted-foreground">
                  {meta.publishedAt}
                </Text>
              </time>
              <Text as="span" variant="microcopy" className="text-muted-foreground">
                Week {meta.week}
              </Text>
            </div>
            {meta.projectTags && meta.projectTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {meta.projectTags.map((tag) => (
                  <Tag key={tag} project={tag} />
                ))}
              </div>
            )}
          </header>

          <article className="prose prose-slate max-w-none">{children}</article>
        </div>
      </div>
    </div>
  );
}
