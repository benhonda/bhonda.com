import { type ActionHandlerReturnType } from "~/lib/actions/_core/action-utils";
import type { ActionFunctionArgs } from "react-router";
import { payloadError } from "~/lib/actions/_core/action-utils.server";
import type { ActionDefinitionData } from "./action-utils";
import handlerMap from "./action-map";
import type { ActionName } from "./action-map";

export async function action_handler({
  request,
}: ActionFunctionArgs): Promise<ActionHandlerReturnType<ActionDefinitionData>> {
  const data = (await request.json()) as ActionDefinitionData;

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
