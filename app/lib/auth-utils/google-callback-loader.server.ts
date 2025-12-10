import type { LoaderFunctionArgs } from "react-router";
import { cookieSessionStorage } from "~/lib/auth-utils/session.server";
import { logDebug } from "~/lib/logger";
import { getGoogleProfile } from "./google-utils.server";
import { usersTable } from "~/lib/db/schemas/auth-schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { db } from "~/lib/db/index.server";
import { eq } from "drizzle-orm";
import { serverRedirect } from "~/lib/router/server-responses.server";
import { userFromSessionSchema } from "~/lib/types/user";

const ADMIN_EMAIL = "ben@theadpharm.com";

/**
 * Must be called in a loader
 */
export async function callbackLoader(request: LoaderFunctionArgs["request"]) {
  const url = new URL(request.url);

  // get the code and state
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // verify we have the code and state
  if (!code || !state) {
    throw new Error("Missing code or state");
  }

  // Retrieve the stored state from the session
  const session = await cookieSessionStorage.getSession(request.headers.get("Cookie"));

  // get the stored state
  const storedState = session.get("oauth2state");

  // verify the state
  if (state !== storedState) {
    throw new Error("Invalid state");
  }

  // unset the state
  session.unset("oauth2state");

  logDebug("fetching google profile");

  // Exchange the code for a token and user info
  const oauth2Profile = await getGoogleProfile(code);

  // Only allow admin email
  if (oauth2Profile.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized email");
  }

  logDebug("attempting to update user");

  // validate the profile
  // we don't want to update the email, so we remove it from the update data
  const { email: ___email, ...updateData } = createUpdateSchema(usersTable).parse(oauth2Profile);

  // upsert the user in the database
  let user = (
    await db.update(usersTable).set(updateData).where(eq(usersTable.email, oauth2Profile.email)).returning()
  ).at(0);

  // if no user was found, create a new user
  if (!user) {
    logDebug("Creating a new user");

    // validate the profile
    const insertData = createInsertSchema(usersTable).parse(oauth2Profile);

    // insert the user
    user = (await db.insert(usersTable).values(insertData).returning()).at(0);

    // verify the user was inserted
    if (!user) {
      throw new Error("Failed to create user");
    }
  }

  const userFromSession = userFromSessionSchema.parse(user);

  // set the user in the session
  session.set("user", userFromSession);

  // Redirect into the app
  return serverRedirect(
    { to: "/" },
    {
      headers: {
        "Set-Cookie": await cookieSessionStorage.commitSession(session),
      },
    }
  );
}
