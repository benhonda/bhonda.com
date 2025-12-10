import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { Shiplog } from "~/lib/shiplog/fetcher.server";

export const editShiplogActionDefinition = defineAction<{
  shiplog: Shiplog;
}>()({
  actionDirectoryName: "edit-shiplog",
  inputDataSchema: z.object({
    slug: z.string(),
    editPrompt: z.string().min(1),
  }),
  type: "mutation",
});
