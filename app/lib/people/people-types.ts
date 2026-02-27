import type { ComponentType } from "react";

export type PersonStatus = "draft" | "published";

export type PersonMeta = {
  name: string;
  slug: string;
  preview: string;
  metaDescription: string; // SEO meta description — accurate summary of page content
  status: PersonStatus;
  lastUpdated?: string; // YYYY-MM-DD
};

export type PersonModule = {
  personMeta: PersonMeta;
  default: ComponentType;
};
