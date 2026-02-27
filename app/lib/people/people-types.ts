import type { ComponentType } from "react";

export type PersonStatus = "draft" | "published";

export type PersonMeta = {
  name: string;
  slug: string;
  preview: string;
  status: PersonStatus;
  lastUpdated?: string; // YYYY-MM-DD
};

export type PersonModule = {
  personMeta: PersonMeta;
  default: ComponentType;
};
