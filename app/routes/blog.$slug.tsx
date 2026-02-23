import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { data as routerData } from "react-router";
import type { BlogPostMeta, BlogPostModule } from "~/lib/blog/blog-types";

const postModules = import.meta.glob<BlogPostModule>("../lib/blog/posts/*.tsx", { eager: true });

const postsBySlug: Record<string, BlogPostModule> = Object.values(postModules)
  .filter((m): m is BlogPostModule => "blogMeta" in m)
  .reduce<Record<string, BlogPostModule>>((acc, m) => {
    acc[m.blogMeta.slug] = m;
    return acc;
  }, {});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.postMeta) {
    return [{ title: "Post Not Found | Ben Honda's Dev Blog" }];
  }
  return [
    { title: `${data.postMeta.title} | Ben Honda's Dev Blog` },
    { name: "description", content: data.postMeta.preview },
    { tagName: "link", rel: "canonical", href: `https://bhonda.com/blog/${data.postMeta.slug}` },
  ];
};

export function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = postsBySlug[slug];
  if (!module) throw routerData(null, { status: 404 });

  return { postMeta: module.blogMeta };
}

export default function BlogPost() {
  const { postMeta } = useLoaderData<typeof loader>();
  const Post = postsBySlug[postMeta.slug]?.default;

  if (!Post) return null;

  return <Post />;
}
