import { type ActionHandlerReturnType } from "~/lib/actions/_core/action-utils";
import type { ActionFunctionArgs } from "react-router";
import { payloadError } from "~/lib/actions/_core/action-utils.server";
import type { ActionDefinitionData } from "./action-utils";
import handlerMap from "./action-map";
import type { ActionName } from "./action-map";

export async function action_handler({
  request,
}: ActionFunctionArgs): Promise<ActionHandlerReturnType<ActionDefinitionData>> {
  let data: ActionDefinitionData;

  // Parse request body with error handling
  try {
    data = (await request.json()) as ActionDefinitionData;
  } catch (error) {
    // Handle aborted/malformed requests (common when tab focus triggers revalidation then aborts)
    if (error instanceof SyntaxError) {
      console.warn('[Action] Ignoring malformed JSON (likely aborted request)');
      // Return minimal payload - client has already aborted so won't process this anyway
      return {
        _id: Math.random().toString(36).substring(7),
        success: false,
        currentAction: '__aborted__',
        error: {
          message_unsafe: 'Request aborted',
          message_safe: 'Request was cancelled',
        },
      };
    }
    throw error;
  }

  // try to handle the action
  try {
    // get the handler from the handler map
    const handler = handlerMap[data.actionDirectoryName as ActionName];
    if (!handler) throw new Response(`Unknown action type: ${data.actionDirectoryName}`, { status: 400 });

    // call the handler
    const payload = await handler(data, request);

    // redirect if needed
    if (payload.redirectResponse) {
      throw payload.redirectResponse;
    }

    // return the response if needed
    if (payload.response) {
      console.log("payload.response", payload.response);
      throw payload.response;
    }

    // return the payload
    return payload;
  } catch (errorOrResponse) {
    const isRedirect =
      errorOrResponse instanceof Response && errorOrResponse.status <= 399 && errorOrResponse.status >= 300;

    /**
     * If we are here because we threw a serverRedirect, we should rethrow it
     * so that the router can handle it.
     */
    if (isRedirect) {
      throw errorOrResponse;
    }

    // if we are here because we threw a response, we should rethrow it
    if (errorOrResponse instanceof Response) {
      const resClone = errorOrResponse.clone();
      const errorMessage = await resClone.text();
      console.log("errorOrResponse", errorMessage);
      throw errorOrResponse;
    }

    const error = errorOrResponse;

    return payloadError(data.actionDirectoryName, error);
  }
}
