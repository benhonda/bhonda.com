import type { ReactNode } from "react";
import { PageHeader } from "~/components/misc/page-header";
import { Breadcrumbs } from "~/components/misc/breadcrumbs";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import type { BlogPostMeta } from "~/lib/blog/blog-types";

type BlogPostLayoutProps = {
  meta: BlogPostMeta;
  children: ReactNode;
};

export function BlogPostLayout({ meta, children }: BlogPostLayoutProps) {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PageHeader />
        <Breadcrumbs crumbs={[{ label: "Blog", to: "/blog" }, { label: meta.title }]} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        <header className="mb-8">
          <Text as="h1" variant="display-xs">
            {meta.title}
          </Text>
          <Spacer size="xs" />
          <time dateTime={meta.publishedAt}>
            <Text as="span" variant="body-sm" className="text-muted-foreground">
              {meta.publishedAt}
            </Text>
          </time>
        </header>

        <article className="space-y-4">{children}</article>
      </div>
    </div>
  );
}
