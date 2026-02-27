import type { ReactNode } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import type { PersonMeta } from "~/lib/people/people-types";

type PersonLayoutProps = {
  meta: PersonMeta;
  children: ReactNode;
};

export function PersonLayout({ meta, children }: PersonLayoutProps) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader />
        <Breadcrumbs crumbs={[{ label: "People", to: "/people" }, { label: meta.name }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-border rounded-lg p-8">
          <header className="mb-8">
            <Text as="h1" variant="display-xs">
              {meta.name}
            </Text>
            <Spacer size="xs" />
            {meta.lastUpdated && (
              <time dateTime={meta.lastUpdated}>
                <Text as="span" variant="microcopy" className="text-muted-foreground">
                  updated {meta.lastUpdated}
                </Text>
              </time>
            )}
          </header>

          <article className="space-y-4">{children}</article>
        </div>
      </div>
    </div>
  );
}
