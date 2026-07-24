import { pool } from "@/db/drizzle.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/db/drizzle.js";
import { sql } from "drizzle-orm";

export async function setup() {
    await db.execute(sql`DROP SCHEMA public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await migrate(db, { migrationsFolder: "src/db/drizzle/migrations" });
}

export async function teardown() {
    await pool.end();
}