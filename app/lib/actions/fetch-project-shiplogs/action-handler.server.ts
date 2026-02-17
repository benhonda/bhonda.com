import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchProjectShiplogsActionDefinition } from "./action-definition";
import { getProjectBySlug, getShiplogMetaByProjectId } from "~/lib/shiplog/project-db-service.server";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export default createActionHandler(
  fetchProjectShiplogsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    const inputData = parseActionInput(fetchProjectShiplogsActionDefinition, unsafeInputData);

    const user = await getUser(request);
    const userIsAdmin = isAdmin(user);

    const page = inputData.page ?? 1;
    const limit = inputData.limit ?? 12;
    const offset = (page - 1) * limit;

    const project = await getProjectBySlug(inputData.projectSlug);
    if (!project) throw new Error(`Project not found: ${inputData.projectSlug}`);

    // Fetch one extra to determine if more pages exist
    const shiplogs = await getShiplogMetaByProjectId(project.id, userIsAdmin, limit + 1, offset);

    const hasMore = shiplogs.length > limit;
    return {
      shiplogs: hasMore ? shiplogs.slice(0, limit) : shiplogs,
      hasMore,
    };
  }
);
