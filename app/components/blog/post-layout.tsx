import type { ReactNode } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { PostMeta } from "~/lib/blog/blog-types";

type PostLayoutProps = {
  meta: PostMeta;
  children: ReactNode;
};

export function PostLayout({ meta, children }: PostLayoutProps) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader />
        <Breadcrumbs crumbs={[{ label: "Blog", to: "/blog" }, { label: meta.title }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="border border-border rounded-lg p-8">
          <header className="mb-8">
            <Text as="h1" variant="display-xs">
              {meta.title}
            </Text>
            <Spacer size="xs" />
            <time dateTime={meta.publishedAt}>
              <Text as="span" variant="microcopy" className="text-muted-foreground">
                {meta.publishedAt}
              </Text>
            </time>
            {(meta.projects?.length || meta.topics?.length) ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {meta.projects?.map((slug) => <Tag key={slug} project={slug} />)}
                {meta.topics?.map((topic) => <Tag key={topic} topic={topic} />)}
              </div>
            ) : null}
          </header>

          <article className="space-y-4">{children}</article>
        </div>
      </div>
    </div>
  );
}
