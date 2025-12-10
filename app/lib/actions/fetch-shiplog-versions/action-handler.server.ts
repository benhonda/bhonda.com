import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchShiplogVersionsActionDefinition } from "./action-definition";
import { requireAdmin } from "~/lib/auth-utils/user.server";
import { listShiplogVersions } from "~/lib/shiplog/s3-versions-service.server";

export default createActionHandler(
  fetchShiplogVersionsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    await requireAdmin(request);

    const inputData = parseActionInput(fetchShiplogVersionsActionDefinition, unsafeInputData);

    const versions = await listShiplogVersions(inputData.slug);

    return {
      versions,
    };
  }
);
