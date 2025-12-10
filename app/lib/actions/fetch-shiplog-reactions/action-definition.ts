import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const fetchShiplogReactionsActionDefinition = defineAction<{
  counts: Record<string, number>;
  userReactions: string[];
}>()({
  actionDirectoryName: "fetch-shiplog-reactions",
  inputDataSchema: z.object({
    shiplogSlug: z.string(),
  }),
  type: "query",
  cache: {
    enabled: true,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 60 * 1000, // 60 seconds
  },
});
