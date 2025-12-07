import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";

export const exampleActionDefinition = defineAction<{
  id: string;
  success: boolean;
}>()({
  actionDirectoryName: "example-action",
  inputDataSchema: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    tags: z.array(z.string()).min(1, "Select at least one tag"),
    isPublic: z.boolean(),
  }),
});
