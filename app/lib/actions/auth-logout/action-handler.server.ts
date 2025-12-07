import { createActionHandler } from "~/lib/actions/_core/action-utils";
import { cookieSessionStorage } from "~/lib/auth-utils/session.server";
import { payloadRedirect } from "~/lib/actions/_core/action-utils.server";
import { authLogoutActionDefinition } from "./action-definition";

/**
 * Server action
 */
export default createActionHandler(
  authLogoutActionDefinition,
  async ({ actionDirectoryName }, request) => {
    // get the session
    const session = await cookieSessionStorage.getSession(request.headers.get("Cookie"));

    // commit the session
    return payloadRedirect(
      actionDirectoryName,
      {
        to: "/login",
      },
      {
        headers: {
          "Set-Cookie": await cookieSessionStorage.destroySession(session),
        },
      }
    );
  }
);
