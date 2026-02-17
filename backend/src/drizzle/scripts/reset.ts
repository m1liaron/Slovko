import { sql } from "drizzle-orm";

import { db } from "../index.js";

await db.execute(sql`
  TRUNCATE TABLE
    collocations,
    senses,
    headwords,
    languages
  RESTART IDENTITY
  CASCADE;
`);

console.log("All tables reset");
process.exit(0);
