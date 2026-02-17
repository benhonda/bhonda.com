import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import type { ProjectWithStats } from "~/lib/shiplog/project-db-service.server";

export const fetchProjectsActionDefinition = defineAction<{
  projects: ProjectWithStats[];
}>()({
  actionDirectoryName: "fetch-projects",
  inputDataSchema: z.object({}),
  type: "query",
  cache: { enabled: false },
});
