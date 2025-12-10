import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const restoreShiplogVersionActionDefinition = defineAction<{
  currentContent: string;
  versionContent: string;
}>()({
  actionDirectoryName: "restore-shiplog-version",
  inputDataSchema: z.object({
    slug: z.string(),
    versionId: z.string(),
    restore: z.boolean().optional(), // if true, actually restore; if false/undefined, just preview
  }),
  type: "mutation",
});
