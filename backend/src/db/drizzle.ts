import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


import * as schema from "./schema/tables.js";
import { DATABASE_URL } from "@/libs/constants";

const pool = new Pool({
  connectionString: DATABASE_URL
});
export const db = drizzle(pool, { schema });
