import { pgTable, text, uuid, integer, pgEnum, unique } from "drizzle-orm/pg-core";
import { timestamps, timelineFields } from "~/lib/db/schema-utils";

export const shiplogStatusEnum = pgEnum("shiplog_status", ["draft", "published", "archived"]);

export const shiplogsTable = pgTable(
  "shiplogs",
  {
    ...timestamps,
    ...timelineFields,

    id: uuid().defaultRandom().primaryKey(),
    week: integer().notNull(),
    year: integer().notNull(),
    s3_public_key_relative: text().notNull(),
    s3_internal_key_relative: text().notNull(),
    stats_repos: integer().notNull(),
    stats_commits: integer().notNull(),
    status: shiplogStatusEnum().notNull().default("draft"),
  }
);

export const reactionTypeEnum = pgEnum("reaction_type", [
  "thumbs_up",
  "thumbs_down",
  "laugh",
  "hooray",
  "confused",
  "heart",
  "rocket",
  "eyes",
]);

export const shiplogReactionsTable = pgTable(
  "shiplog_reactions",
  {
    ...timestamps,

    id: uuid().defaultRandom().primaryKey(),
    shiplog_id: uuid()
      .notNull()
      .references(() => shiplogsTable.id),
    reaction_type: reactionTypeEnum().notNull(),
    anon_session_id: text().notNull(),
    user_id: uuid(), // Future: link to authenticated users
  },
  (table) => [
    unique("unique_shiplog_reaction").on(
      table.shiplog_id,
      table.anon_session_id,
      table.reaction_type
    ),
  ]
);

export const projectsTable = pgTable("projects", {
  ...timestamps,

  id: uuid().defaultRandom().primaryKey(),
  slug: text().notNull().unique(),
  display_name: text().notNull(),
  description: text(),
  repo_identifier: text().notNull().unique(),
});

export const shiplogProjectsTable = pgTable(
  "shiplog_projects",
  {
    ...timestamps,

    id: uuid().defaultRandom().primaryKey(),
    shiplog_id: uuid()
      .notNull()
      .references(() => shiplogsTable.id),
    project_id: uuid()
      .notNull()
      .references(() => projectsTable.id),
  },
  (table) => [
    unique("unique_shiplog_project").on(table.shiplog_id, table.project_id),
  ]
);
