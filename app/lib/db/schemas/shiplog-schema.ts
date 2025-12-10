import { pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { timestamps, timelineFields } from "~/lib/db/schema-utils";

export const shiplogsTable = pgTable(
  "shiplogs",
  {
    ...timestamps,
    ...timelineFields,

    id: uuid().defaultRandom().primaryKey(),
    week: integer().notNull(),
    year: integer().notNull(),
    s3_public_key: text().notNull(),
    s3_internal_key: text().notNull(),
    stats_repos: integer().notNull(),
    stats_commits: integer().notNull(),
  }
);
