import { z } from "zod";
import { defineAction } from "~/lib/actions/_core/action-utils";
import { REACTION_TYPES } from "~/lib/shiplog/reactions";

export const toggleShiplogReactionActionDefinition = defineAction<{
  added: boolean;
  counts: Record<string, number>;
  userReactions: string[];
}>()({
  actionDirectoryName: "toggle-shiplog-reaction",
  inputDataSchema: z.object({
    shiplogSlug: z.string(),
    reactionType: z.enum(REACTION_TYPES),
    anonymousId: z.string(),
  }),
  type: "mutation",
});
