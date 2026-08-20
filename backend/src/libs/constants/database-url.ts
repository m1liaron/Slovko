import { EnvVariables } from "../enums/envVariables";

const DATABASE_URL = EnvVariables.DATABASE_PASSWORD
  ? `postgresql://${EnvVariables.DATABASE_USER_NAME}:${EnvVariables.DATABASE_PASSWORD}@${EnvVariables.DATABASE_HOST}:${EnvVariables.DB_PORT}/${EnvVariables.DATABASE_NAME}`
  : EnvVariables.DATABASE_URL;

export { DATABASE_URL };
