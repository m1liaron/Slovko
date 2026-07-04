import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


import * as schema from "@/modules/index";
import * as relations from "./associations"
import { DATABASE_URL } from "@/libs/constants";

const pool = new Pool({
  connectionString: DATABASE_URL
});
export const db = drizzle(pool, { schema: { ...schema, ...relations } });
