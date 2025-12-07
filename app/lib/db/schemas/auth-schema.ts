import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  jsonb,
  varchar,
  serial,
  text,
  unique,
  boolean,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "~/lib/db/schema-utils";

/***************************************************************
 *
 * Users
 *
 ****************************************************************/
export const usersTable = pgTable(
  "users",
  {
    ...timestamps,

    id: uuid().defaultRandom().primaryKey(),
    email: text().notNull(),

    // password hash (if the user is using email/password)
    password_hash: text(),

    first_name: text(),
    last_name: text(),
    display_name: text().notNull(),
    avatar_url: text(),
    avatar_base64: text(),

    // auth provider
    provider: text({ enum: ["email", "google"] }).notNull(),

    // the unique id from the auth provider
    provider_id: text(),

    // extra data from the auth provider
    provider_data: jsonb(),
  },
  (table) => [
    // Ensure that the email is unique
    unique("email").on(table.email),
    // index on email
    // index("email").on(table.email),
  ]
);

export const internalSessionsTable = pgTable(
  "internal_sessions",
  {
    ...timestamps,

    // id: serial().primaryKey(),
    id: text().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id),
    expires_at: timestamp({ withTimezone: true }).notNull(),
    // two_factor_verified: boolean().notNull().default(false),
  },
  (table) => [
    // Ensure that the user_uuid is unique
    // unique("user_id").on(table.user_uuid),
  ]
);
