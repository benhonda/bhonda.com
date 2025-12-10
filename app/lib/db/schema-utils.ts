import { sql } from "drizzle-orm";
import { timestamp, text, date } from "drizzle-orm/pg-core";

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

/***************************************************************
 *
 * Timeline Content
 *
 ****************************************************************/
// Common fields for all timeline content types (ships, articles, links, etc.)
export const timelineFields = {
  slug: text().notNull().unique(),
  title_text: text().notNull(),
  preview_text: text().notNull(),
  intro_text: text().notNull(),
  published_at: date({ mode: "string" }).notNull(),
};
