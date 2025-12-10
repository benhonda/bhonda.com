import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const updateShiplogStatusActionDefinition = defineAction<{
  success: boolean;
}>()({
  actionDirectoryName: "update-shiplog-status",
  inputDataSchema: z.object({
    slug: z.string(),
    status: z.enum(["draft", "published", "archived"]),
  }),
  type: "mutation",
});
