import { db } from "~/lib/db/index.server";
import { shiplogsTable, shiplogReactionsTable } from "~/lib/db/schemas/shiplog-schema";
import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchShiplogReactionsActionDefinition } from "./action-definition";
import { getAnonymousIdFromRequest } from "~/lib/analytics/get-anonymous-id.server";
import { eq } from "drizzle-orm";
import { ReadableError } from "~/lib/readable-error";

export default createActionHandler(
  fetchShiplogReactionsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    const { shiplogSlug } = parseActionInput(fetchShiplogReactionsActionDefinition, unsafeInputData);

    // Get anonymous ID from Segment cookie
    const anonymousId = getAnonymousIdFromRequest(request);

    // Get shiplog by slug
    const shiplog = (
      await db.select().from(shiplogsTable).where(eq(shiplogsTable.slug, shiplogSlug))
    ).at(0);

    if (!shiplog) {
      throw new ReadableError("Shiplog not found");
    }

    // Get all reactions for this shiplog
    const allReactions = await db
      .select()
      .from(shiplogReactionsTable)
      .where(eq(shiplogReactionsTable.shiplog_id, shiplog.id));

    // Calculate counts per reaction type
    const counts: Record<string, number> = {};
    allReactions.forEach((reaction) => {
      counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
    });

    // Get user's reactions (only if we have an anonymousId)
    const userReactions = anonymousId
      ? allReactions
          .filter((r) => r.anon_session_id === anonymousId)
          .map((r) => r.reaction_type)
      : [];

    return {
      counts,
      userReactions,
    };
  }
);
