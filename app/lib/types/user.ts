import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "~/lib/db/schemas/auth-schema";

const userSchema = createSelectSchema(usersTable);

/**
 * The user data that gets stored in the session
 *
 * THis needs to be kept minimal. If you try to store a lot of data it might affect the
 * performance of the application and you might get a "Error: Cookie length will exceed browser maximum. Length: 9900"
 */
export const userFromSessionSchema = userSchema.pick({
  id: true,
  email: true,
  display_name: true,
  first_name: true,
  last_name: true,
  provider: true,
  provider_id: true,
});

/**
 * The user data that gets stored in the session
 */
export type UserFromSession = z.infer<typeof userFromSessionSchema>;

export type UserFull = z.infer<typeof userSchema>;
