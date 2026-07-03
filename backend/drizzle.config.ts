import { DATABASE_URL } from "@/libs/constants";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/drizzle/schema/**/*",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
