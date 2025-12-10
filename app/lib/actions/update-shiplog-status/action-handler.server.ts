import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { updateShiplogStatusActionDefinition } from "./action-definition";
import { requireAdmin } from "~/lib/auth-utils/user.server";
import { updateShiplogStatus } from "~/lib/shiplog/db-service.server";

export default createActionHandler(
  updateShiplogStatusActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    await requireAdmin(request);

    const inputData = parseActionInput(updateShiplogStatusActionDefinition, unsafeInputData);

    const { slug, status } = inputData;

    await updateShiplogStatus(slug, status);

    return {
      success: true,
    };
  }
);
