import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "../common/enums/constants/DatabaseURL.js";
import { EnvVariables } from "../common/enums/envVariables.js";

import * as schema from "./schema/tables.js";

const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool, { schema });
