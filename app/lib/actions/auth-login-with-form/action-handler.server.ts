import { db } from "~/lib/db/index.server";
import { usersTable } from "~/lib/db/schemas/auth-schema";
import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import {
  checkIpHashRateLimit,
  consumeIpHashRateLimit,
  verifyPasswordHash,
} from "~/lib/auth-utils/password.server";
import { cookieSessionStorage } from "~/lib/auth-utils/session.server";
import { authLoginWithFormActionDefinition } from "./action-definition";
import { ReadableError } from "~/lib/readable-error";
import { eq } from "drizzle-orm";
import { userLoginRateLimit } from "~/lib/auth-utils/user.server";

/**
 * Server action
 */
export default createActionHandler(
  authLoginWithFormActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    // parse the input data
    const parsedInputData = parseActionInput(authLoginWithFormActionDefinition, unsafeInputData);

    // authenticate the user
    const user = await authenticate({ inputData: parsedInputData, request });

    // get the session
    const session = await cookieSessionStorage.getSession(request.headers.get("Cookie"));

    // set the user in the session
    session.set("user", user);

    // commit the session
    const headers = {
      "Set-Cookie": await cookieSessionStorage.commitSession(session),
    };

    // TODO: if isOnboarded

    return {};
  }
);

async function authenticate({
  inputData,
  request,
}: {
  inputData: { email: string; password: string };
  request: Request;
}): Promise<typeof usersTable.$inferSelect> {
  // const { l } = langUtils(request.url);
  // const { default: loginFormSchema } = formConfigToZodSchemas(loginFormConfig, l);
  const { email: plainTextEmail, password: plainTextPassword } = inputData;

  // trim and lowercase the email
  const email = plainTextEmail.trim().toLowerCase();

  // check if the IP is rate limited
  checkIpHashRateLimit({ request });

  const user = (await db.select().from(usersTable).where(eq(usersTable.email, email))).at(0);

  if (!user) {
    throw new ReadableError("Sorry, we couldn't find an account with those credentials.");
  }

  // consume ip rate limit
  consumeIpHashRateLimit({ request });

  // consume user login rate limit
  if (!userLoginRateLimit.consume(user.id, 1)) {
    throw new ReadableError("Sorry, you've made too many login attempts. Please try again later.");
  }
  const { password_hash, ...userWithoutPassword } = user;

  if (!password_hash) {
    throw new ReadableError("Sorry, we couldn't find an account with those credentials.");
  }

  const validPassword = await verifyPasswordHash(password_hash, plainTextPassword);

  if (!validPassword) {
    throw new ReadableError("Sorry, we couldn't find an account with those credentials.");
  }

  userLoginRateLimit.reset(user.id);

  return user;
}
