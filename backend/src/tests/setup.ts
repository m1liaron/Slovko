import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function setup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();

  const connectionString = container.getConnectionUri();

  // Make it available to the rest of the test process
  process.env.DATABASE_URL = connectionString;

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  await migrate(db, { migrationsFolder: "src/db/drizzle/migrations" });

  await pool.end();

  return async () => {
    await container.stop();
  };
}
