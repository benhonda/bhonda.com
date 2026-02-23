import { BlogPostLayout } from "~/components/blog/blog-post-layout";
import { Text } from "~/components/misc/text";
import type { BlogPostMeta } from "~/lib/blog/blog-types";

export const blogMeta = {
  title: "Hello, World",
  publishedAt: "2026-02-23",
  preview: "The first post on this blog — setting up the blog system.",
  slug: "hello-world",
} satisfies BlogPostMeta;

export default function HelloWorld() {
  return (
    <BlogPostLayout meta={blogMeta}>
      <Text as="p" variant="body">
        Hello, world. This is the first post.
      </Text>
    </BlogPostLayout>
  );
}
