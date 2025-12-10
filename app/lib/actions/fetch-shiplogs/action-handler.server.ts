import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchShiplogsActionDefinition } from "./action-definition";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";
import { getUser, isAdmin } from "~/lib/auth-utils/user.server";

export default createActionHandler(
  fetchShiplogsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    parseActionInput(fetchShiplogsActionDefinition, unsafeInputData);

    const user = await getUser(request);
    const userIsAdmin = isAdmin(user);

    const shiplogs = await fetchShiplogs(userIsAdmin);

    return {
      shiplogs,
    };
  }
);
