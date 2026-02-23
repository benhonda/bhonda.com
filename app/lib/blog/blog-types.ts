import type { ComponentType } from "react";

export type BlogPostMeta = {
  title: string;
  publishedAt: string; // YYYY-MM-DD
  preview: string;
  slug: string;
};

export type BlogPostModule = {
  blogMeta: BlogPostMeta;
  default: ComponentType;
};
