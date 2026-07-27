import { defineConfig } from "drizzle-kit";

import { DATABASE_URL } from "./src/common/enums/constants/DatabaseURL.js";

export default defineConfig({
  schema: "./src/drizzle/schema/**/*",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
