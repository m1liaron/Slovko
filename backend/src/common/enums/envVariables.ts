import { config } from "dotenv";
config();

const EnvVariables = {
  PORT: (process.env.PORT as string) || 3000,
  DATABASE_USER_NAME: (process.env.DATABASE_USER_NAME as string) || "postgres",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: (process.env.DATABASE_NAME as string) || "slovko",
  DATABASE_HOST: (process.env.DATABASE_HOST as string) || "localhost",
  DB_PORT: (process.env.DB_PORT as string) || "5434",
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_LIFETIME: (process.env.JWT_LIFETIME as string) || "30d",
  UNSPLASH_KEY: process.env.UNSPLASH_KEY as string,
} as const;

export { EnvVariables };
