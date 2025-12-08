import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { fetchShiplogsActionDefinition } from "./action-definition";
import { fetchShiplogs } from "~/lib/shiplog/fetcher.server";

export default createActionHandler(
  fetchShiplogsActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    parseActionInput(fetchShiplogsActionDefinition, unsafeInputData);

    const shiplogs = await fetchShiplogs();

    return {
      shiplogs,
    };
  }
);
