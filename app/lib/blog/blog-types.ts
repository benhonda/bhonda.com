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

/**
 * A post published on another domain (e.g. theadpharm.com). Surfaced on bhonda.com
 * as the identity hub and linked out to — the content is NEVER duplicated here, and
 * these are deliberately excluded from the sitemap (they aren't bhonda.com URLs).
 */
export type ExternalPost = {
  title: string;
  /** Internal slug for the bhonda.com pointer page at /blog/:slug (links out to externalUrl). */
  slug: string;
  /** Short blurb shown in listings (the external post's own meta description). */
  description: string;
  /** Canonical URL where the post actually lives. */
  externalUrl: string;
  /** Human-readable host label, e.g. "theadpharm.com". */
  source: string;
  publishedAt: string; // YYYY-MM-DD
  /** Free-form topic tags — feed the same /topics/* hubs as native posts. */
  topics?: string[];
};
