import { defineConfig } from "drizzle-kit";

import { DATABASE_URL } from "../common/enums/constants";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL!,
  },
});
