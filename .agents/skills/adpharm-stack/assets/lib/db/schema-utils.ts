import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

/***************************************************************
 *
 * Common
 *
 ****************************************************************/
// NOTE: this needs to be mode: "string" when using $onUpdate, otherwise you get value.toISOString is not a function
export const timestamps = {
  created_at: timestamp({ withTimezone: true, mode: "string" })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull(),
  updated_at: timestamp({ withTimezone: true, mode: "string" })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull()
    .$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),
};
