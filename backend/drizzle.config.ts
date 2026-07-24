import { DATABASE_URL } from "@/libs/constants";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/modules/**/*.model.ts",
  out: "./src/db/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
