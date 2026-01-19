import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchShiplogsActionDefinition } from "./action-definition";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export default createActionHandler(
  fetchShiplogsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    const inputData = parseActionInput(fetchShiplogsActionDefinition, unsafeInputData);

    const user = await getUser(request);
    const userIsAdmin = isAdmin(user);

    const page = inputData.page ?? 1;
    const limit = inputData.limit ?? 12;
    const offset = (page - 1) * limit;

    // Fetch one extra to check if there are more
    const shiplogs = await fetchShiplogs(userIsAdmin, limit + 1, offset);

    const hasMore = shiplogs.length > limit;
    const shiplogsToReturn = hasMore ? shiplogs.slice(0, limit) : shiplogs;

    return {
      shiplogs: shiplogsToReturn,
      hasMore,
    };
  }
);
