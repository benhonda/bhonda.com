import type { ComponentType } from "react";

export type PostStatus = "draft" | "published";

export type PostMeta = {
  title: string;
  slug: string;
  preview: string;
  metaDescription: string;
  status: PostStatus;
  publishedAt: string; // YYYY-MM-DD
  tags?: string[];
};

export type PostModule = {
  postMeta: PostMeta;
  default: ComponentType;
};
