import type {
  ActionDefinitionData,
  ActionHandlerReturnType,
} from "~/lib/actions/_core/action-utils";
import { serverRedirect } from "~/lib/router/server-responses.server";
import { ReadableError } from "~/lib/readable-error";
import type {
  LinkTo,
  LinkToOrDirectPath,
  ServerRedirectArgs,
} from "~/lib/router/router-utils";

/**
 * Success response
 *
 *
 * @param currentAction
 * @param data
 * @returns
 */
export function payloadSuccess<ADD extends ActionDefinitionData>(
  currentAction: ADD["actionDirectoryName"],
  data: ADD["outputData"]
): ActionHandlerReturnType<ADD> {
  return {
    _id: Math.random().toString(36).substring(7),
    success: true,
    currentAction,
    data: {
      [currentAction]: data,
    },
  };
}

/**
 * Redirect response
 *
 *
 * @param currentAction
 * @param data
 * @returns
 */
export function payloadRedirect<ADD extends ActionDefinitionData>(
  currentAction: ADD["actionDirectoryName"],
  linkToOrDirectPath: LinkToOrDirectPath,
  serverRedirectArgs?: ServerRedirectArgs
): ActionHandlerReturnType<ADD> {
  const redirectResponse = serverRedirect(linkToOrDirectPath, serverRedirectArgs);

  return {
    _id: Math.random().toString(36).substring(7),
    success: true,
    currentAction,
    redirectResponse,
  };
}

/**
 * Response response
 *
 *
 * @param currentAction
 * @param data
 * @returns
 */
export function payloadResponse<ADD extends ActionDefinitionData>(
  currentAction: ADD["actionDirectoryName"],
  response: Response
): ActionHandlerReturnType<ADD> {
  return {
    _id: Math.random().toString(36).substring(7),
    success: true,
    currentAction,
    response,
  };
}

/**
 * Error response
 *
 *
 * @param currentAction
 * @param error
 * @returns
 */
export function payloadError<ADD extends ActionDefinitionData>(
  currentAction: ADD["actionDirectoryName"],
  error: any
): ActionHandlerReturnType<ADD> {
  // log the error
  console.log(`Error in action: ${currentAction}`);

  let message_unsafe = error;
  let message_safe = "An error has occured. Please try again later.";

  if (error instanceof ReadableError) {
    message_safe = error.message;
  } else if (error instanceof Response) {
    message_unsafe = `An error response has occured: ${error.statusText}`;
  } else if (error instanceof Error) {
    message_unsafe = error.message;
  } else if (typeof error === "string") {
    message_unsafe = error;
  }

  console.log(message_unsafe);

  // return error
  return {
    _id: Math.random().toString(36).substring(7),
    success: false,
    currentAction,
    error: {
      message_unsafe,
      message_safe,
    },
  };
}
