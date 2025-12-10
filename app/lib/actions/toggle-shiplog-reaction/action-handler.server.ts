import { db } from "~/lib/db/index.server";
import { shiplogsTable, shiplogReactionsTable } from "~/lib/db/schemas/shiplog-schema";
import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { toggleShiplogReactionActionDefinition } from "./action-definition";
import { checkReactionRateLimit, consumeReactionRateLimit } from "~/lib/shiplog/reactions.server";
import { eq, and } from "drizzle-orm";
import { ReadableError } from "~/lib/readable-error";

export default createActionHandler(
  toggleShiplogReactionActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    const { shiplogSlug, reactionType, anonymousId } = parseActionInput(
      toggleShiplogReactionActionDefinition,
      unsafeInputData
    );

    // Check rate limit before doing anything
    checkReactionRateLimit(request);

    // Get shiplog by slug
    const shiplog = (
      await db.select().from(shiplogsTable).where(eq(shiplogsTable.slug, shiplogSlug))
    ).at(0);

    if (!shiplog) {
      throw new ReadableError("Shiplog not found");
    }

    // Check if reaction already exists
    const existingReaction = (
      await db
        .select()
        .from(shiplogReactionsTable)
        .where(
          and(
            eq(shiplogReactionsTable.shiplog_id, shiplog.id),
            eq(shiplogReactionsTable.anon_session_id, anonymousId),
            eq(shiplogReactionsTable.reaction_type, reactionType)
          )
        )
    ).at(0);

    let added: boolean;

    if (existingReaction) {
      // Remove reaction (toggle off)
      await db
        .delete(shiplogReactionsTable)
        .where(eq(shiplogReactionsTable.id, existingReaction.id));
      added = false;
    } else {
      // Add reaction (toggle on) and consume rate limit
      consumeReactionRateLimit(request);
      await db.insert(shiplogReactionsTable).values({
        shiplog_id: shiplog.id,
        anon_session_id: anonymousId,
        reaction_type: reactionType,
      });
      added = true;
    }

    // Get updated counts and user reactions
    const allReactions = await db
      .select()
      .from(shiplogReactionsTable)
      .where(eq(shiplogReactionsTable.shiplog_id, shiplog.id));

    // Calculate counts per reaction type
    const counts: Record<string, number> = {};
    allReactions.forEach((reaction) => {
      counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
    });

    // Get user's reactions
    const userReactions = allReactions
      .filter((r) => r.anon_session_id === anonymousId)
      .map((r) => r.reaction_type);

    return {
      added,
      counts,
      userReactions,
    };
  }
);
