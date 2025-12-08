import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { Shiplog } from "~/lib/shiplog/fetcher.server";

export const fetchShiplogsActionDefinition = defineAction<{
  shiplogs: Shiplog[];
}>()({
  actionDirectoryName: "fetch-shiplogs",
  inputDataSchema: z.object({}),
  type: "query",
  cache: {
    enabled: true,
    staleTime: 60 * 1000 * 5, // 5 minutes
    cacheTime: 60 * 1000 * 10, // 10 minutes
  },
});
