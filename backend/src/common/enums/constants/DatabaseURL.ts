import { EnvVariables } from "../envVariables";

const DATABASE_URL = `postgresql://${EnvVariables.DATABASE_USER_NAME}:${EnvVariables.DATABASE_PASSWORD}@${EnvVariables.DATABASE_HOST}${EnvVariables.DB_PORT}/${EnvVariables.DATABASE_NAME}`;

export { DATABASE_URL };
