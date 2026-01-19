import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { Shiplog } from "~/lib/shiplog/fetcher.server";

export const fetchShiplogsActionDefinition = defineAction<{
  shiplogs: Shiplog[];
  hasMore: boolean;
}>()({
  actionDirectoryName: "fetch-shiplogs",
  inputDataSchema: z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  }),
  type: "query",
  cache: {
    enabled: false, // Disable cache for paginated queries
  },
});
