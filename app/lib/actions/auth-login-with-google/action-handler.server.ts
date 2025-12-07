import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import {
  checkIpHashRateLimit,
  consumeIpHashRateLimit,
} from "~/lib/auth-utils/password.server";
import crypto from "crypto";
import { cookieSessionStorage } from "~/lib/auth-utils/session.server";
import { payloadRedirect } from "~/lib/actions/_core/action-utils.server";
import { getGoogleOAuth2Url } from "~/lib/auth-utils/google-utils.server";
import { loginWithGoogleActionDefinition } from "./action-definition";

/**
 * Server action
 */
export default createActionHandler(
  loginWithGoogleActionDefinition,
  async ({ actionDirectoryName, inputData: unsafeInputData }, request) => {
    // parse the input data
    const parsedInputData = parseActionInput(loginWithGoogleActionDefinition, unsafeInputData);

    // check if the IP is rate limited
    checkIpHashRateLimit({ request });

    // Generate a random state parameter
    const state = crypto.randomBytes(16).toString("hex");

    // Store the state in the session to verify later

    // Get the session
    const session = await cookieSessionStorage.getSession(request.headers.get("Cookie"));

    // set the oauthState in the session
    session.set("oauth2state", state);

    // consume ip rate limit
    consumeIpHashRateLimit({ request });

    // Redirect to Google's OAuth2 endpoint
    return payloadRedirect(
      actionDirectoryName,
      {
        externalUrl: getGoogleOAuth2Url(state),
      },
      {
        headers: {
          "Set-Cookie": await cookieSessionStorage.commitSession(session),
        },
      }
    );
  }
);
