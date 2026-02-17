import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { ShiplogMeta } from "~/lib/shiplog/fetcher.server";

export const fetchProjectShiplogsActionDefinition = defineAction<{
  shiplogs: ShiplogMeta[];
  hasMore: boolean;
}>()({
  actionDirectoryName: "fetch-project-shiplogs",
  inputDataSchema: z.object({
    projectSlug: z.string(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  }),
  type: "query",
  cache: { enabled: false },
});
