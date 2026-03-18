import type { ComponentType } from "react";
import type { ProjectSlug } from "~/lib/projects/projects-config";

export type ShiplogStatus = "draft" | "published" | "archived";

export type ShiplogMeta = {
  slug: string; // YYYY-WNN
  titleText: string;
  previewText: string;
  publishedAt: string; // YYYY-MM-DD (Sunday of that ISO week)
  week: number;
  year: number;
  status: ShiplogStatus;
  projectTags?: ProjectSlug[];
};

export type ShiplogModule = {
  shiplogMeta: ShiplogMeta;
  default: ComponentType;
};
