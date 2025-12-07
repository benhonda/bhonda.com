import type { usersTable } from "~/lib/db/schemas/auth-schema";
import { authEnv } from "~/lib/env/auth-env.server";
import { serverEnv } from "~/lib/env/env.defaults.server";
import { log, logDebug } from "~/lib/logger";
import type { Expand, NonNullableRequired } from "~/lib/types/type-utils";

type OAuth2Profile = Expand<
  NonNullableRequired<{
    // required to be returned
    provider: (typeof usersTable.$inferSelect)["provider"];
    provider_id: (typeof usersTable.$inferSelect)["provider_id"];
    email: (typeof usersTable.$inferSelect)["email"];
    display_name: (typeof usersTable.$inferSelect)["display_name"];
    provider_data: (typeof usersTable.$inferSelect)["provider_data"];
  }> & {
    // optional to be returned
    avatar_url: (typeof usersTable.$inferSelect)["avatar_url"];
    avatar_base64: (typeof usersTable.$inferSelect)["avatar_base64"];
  }
>;

// OAUTH2 URLs
const AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REDIRECT_URI = `https://${serverEnv.APP_FQDN}/oauth2/google/callback`;
const USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

/**
 * THe raw response from Google User Info endpoint
 *
 */
type GoogleUserInfoData = {
  /**
   * The unique ID of the user (in Google)
   */
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  /**
   * Hosted domain
   */
  hd: string;
};

/**
 *
 * Helper function to get the Google OAuth2 URL
 *
 * "State" is a unique string value of your choice that is hard to guess.
 */
export function getGoogleOAuth2Url(state: string) {
  const params = new URLSearchParams({
    client_id: authEnv.GOOGLE_OAUTH2_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    /**
     * The access_type parameter specifies whether your application needs to access a Google API when the user is not present at the browser.
     * This parameter is set to offline, which means the application can access a Google API when the user is not present at the browser.
     */
    access_type: "offline",
    /**
     * The prompt parameter can be used to request that the user be prompted to select a user account at authentication time.
     * This can be used as a way to allow the user to switch accounts when set to select_account.
     */
    prompt: "consent",
    state,
  });

  return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
}

export async function getGoogleProfile(code: string): Promise<OAuth2Profile> {
  const params = new URLSearchParams({
    client_id: authEnv.GOOGLE_OAUTH2_CLIENT_ID,
    client_secret: authEnv.GOOGLE_OAUTH2_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    code,
  });

  // exchange code for tokens
  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    logDebug("Access token not found. Token data: ", tokenData);
    throw new Error("Access token not found");
  }

  // fetch user profile
  const response = await fetch(USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const raw: GoogleUserInfoData = await response.json();

  // get the picture, then base64 encode it
  let pictureBase64: string | null = null;
  try {
    const pictureResponse = await fetch(raw.picture);
    const pictureBuffer = await pictureResponse.arrayBuffer();
    pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
    // prepend the base64 header
    pictureBase64 = pictureBase64 ? `data:image/jpeg;base64,${pictureBase64}` : null;
  } catch (error) {
    log("Failed to fetch the picture", error);
  }

  return {
    provider: "google",
    provider_id: raw.sub,
    email: raw.email,
    /**
     * TODO: we have to store the avatar in our own storage because googleusercontent is blocked by adblockers and browsers
     */
    avatar_url: raw.picture,
    avatar_base64: pictureBase64,
    display_name: raw.name,
    provider_data: raw,
  };
}
