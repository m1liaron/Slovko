import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "@/libs/constants";
import * as schema from "@/modules/index";

import * as relations from "./associations";

const pool = new Pool({
  connectionString: DATABASE_URL,
});
const db = drizzle(pool, { schema: { ...schema, ...relations } });

export { db };
