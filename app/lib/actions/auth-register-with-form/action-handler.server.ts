import { createActionHandler, parseActionInput } from "~/lib/actions/_core/action-utils";
import { db } from "~/lib/db/index.server";
import {
  checkIpHashRateLimit,
  consumeIpHashRateLimit,
  hashPassword,
  verifyPasswordStrength,
} from "~/lib/auth-utils/password.server";
import { eq } from "drizzle-orm";
import { ReadableError } from "~/lib/readable-error";
import { usersTable } from "~/lib/db/schemas/auth-schema";
import { createInsertSchema } from "drizzle-zod";
import { authRegisterWithFormActionDefinition } from "./action-definition";

/**
 * Server action
 */
export default createActionHandler(
  authRegisterWithFormActionDefinition,
  async ({ inputData: unsafeInputData }, request) => {
    // parse the input data
    const parsedInputData = parseActionInput(authRegisterWithFormActionDefinition, unsafeInputData);

    // check if the IP is rate limited
    checkIpHashRateLimit({ request });

    const {
      email: _email,
      plainTextPassword1: _plainTextPassword1,
      plainTextPassword2: _plainTextPassword2,
    } = parsedInputData;

    // check if the passwords match
    if (_plainTextPassword1 !== _plainTextPassword2) {
      throw new ReadableError("Passwords do not match");
    }

    // trim and lowercase the email
    const email = _email?.toLowerCase()?.trim();

    // verify email availability
    const emailAvailable = await isEmailAvailable(email);
    if (!emailAvailable) {
      throw new ReadableError("Email is already taken");
    }

    // verify password strength
    const isStrongPassword = await verifyPasswordStrength(_plainTextPassword1);
    if (!isStrongPassword) {
      throw new ReadableError("Password is not strong enough");
    }

    // consume ip rate limit
    consumeIpHashRateLimit({ request });

    // hash the password
    const passwordHash = await hashPassword(_plainTextPassword1);

    // build insert object
    const insertUserData = createInsertSchema(usersTable).parse({
      ...parsedInputData,
      password_hash: passwordHash,
    });

    // create the user
    const users = await db.insert(usersTable).values(insertUserData).returning();

    if (users.length === 0) {
      throw new ReadableError("Error creating user");
    }

    const user = users[0];

    return {};
  }
);

/**
 * Helper: Check if the email is available.
 *
 * @param email
 * @returns
 */
async function isEmailAvailable(email: string): Promise<boolean> {
  const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

  return users.length === 0;
}
