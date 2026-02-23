import type { ComponentType } from "react";

export type BlogPostStatus = "draft" | "published";

export type BlogPostMeta = {
  title: string;
  publishedAt: string; // YYYY-MM-DD
  lastUpdated?: string; // YYYY-MM-DD
  preview: string;
  slug: string;
  status: BlogPostStatus;
};

export type BlogPostModule = {
  blogMeta: BlogPostMeta;
  default: ComponentType;
};
