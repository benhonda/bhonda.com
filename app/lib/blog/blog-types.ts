import type { ComponentType } from "react";
import type { ProjectSlug } from "~/lib/projects/projects-config";

export type PostStatus = "draft" | "published";

export type PostMeta = {
  title: string;
  slug: string;
  preview: string;
  metaDescription: string;
  status: PostStatus;
  publishedAt: string; // YYYY-MM-DD
  /** Typed project links — rendered as linked Tag pills */
  projects?: ProjectSlug[];
  /** Free-form topic tags — rendered as linked Tag pills */
  topics?: string[];
};

export type PostModule = {
  postMeta: PostMeta;
  default: ComponentType;
};
