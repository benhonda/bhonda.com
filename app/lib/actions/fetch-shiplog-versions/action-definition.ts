import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { ShiplogVersion } from "~/lib/shiplog/s3-versions-service.server";

export const fetchShiplogVersionsActionDefinition = defineAction<{
  versions: ShiplogVersion[];
}>()({
  actionDirectoryName: "fetch-shiplog-versions",
  inputDataSchema: z.object({
    slug: z.string(),
  }),
  type: "query",
});
