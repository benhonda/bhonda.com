import type { ComponentType } from "react";
import type { ProjectSlug } from "~/lib/projects/projects-config";

export type ShiplogStatus = "draft" | "published" | "archived";

export type ShiplogMeta = {
  slug: string; // YYYY-WNN
  titleText: string;
  previewText: string;
  /**
   * The week-ending (Sunday) date used for display/sort is derived from `week` + `year`
   * via `isoWeekEndDateString` — not stored, since it's fully determined by them.
   */
  week: number;
  year: number;
  status: ShiplogStatus;
  projectTags?: ProjectSlug[];
  topics?: string[];
};

export type ShiplogModule = {
  shiplogMeta: ShiplogMeta;
  default: ComponentType;
};
