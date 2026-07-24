import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL } from "@/libs/constants";
import * as schema from "./schema";

import * as relations from "./associations";

const pool = new Pool({
  connectionString: DATABASE_URL,
});
const db = drizzle(pool, { schema: { ...schema, ...relations } });

type TransactionMethod = typeof db.transaction;

// 2. Extract the type of the callback function (the first parameter)
type TransactionCallback = Parameters<TransactionMethod>[0];

// 3. Extract the 'tx' object (the first parameter of that callback)
type DatabaseTransaction = Parameters<TransactionCallback>[0];

type Transaction = DatabaseTransaction | typeof db

export { db, pool, type Transaction };
