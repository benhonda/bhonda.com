import { PostLayout } from "~/components/blog/post-layout";
import type { PostMeta } from "~/lib/blog/blog-types";

export const postMeta = {
  title: "Hello World",
  slug: "hello-world",
  preview: "A first post — just getting things set up.",
  metaDescription: "The inaugural post on bhonda.com, introducing the blog.",
  status: "draft",
  publishedAt: "2026-03-18",
  tags: ["meta"],
} satisfies PostMeta;

export default function HelloWorld() {
  return (
    <PostLayout meta={postMeta}>
      <p>Hello, world. This is the first post.</p>
    </PostLayout>
  );
}
