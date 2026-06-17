import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { dbEnv } from "~/lib/env/db-env.server";

const sql = neon(dbEnv.DATABASE_URL);
export const db = drizzle({ client: sql });
