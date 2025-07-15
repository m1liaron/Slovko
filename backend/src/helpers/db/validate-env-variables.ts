import winston from "winston";
import { EnvVariables } from "../../common/enums";

const validateEnvVariables = () => {
    const missingVariables = Object.values(EnvVariables).filter((varName) => !varName);

    if (missingVariables.length > 0) {
        missingVariables.forEach((varName) => {
            winston.error(`Env Validation: Missing required environment variable: ${varName}`);
        });
        process.exit(1);
    }
    return EnvVariables;
};

const validatedEnvVariables = validateEnvVariables()

export { validateEnvVariables, validatedEnvVariables };
