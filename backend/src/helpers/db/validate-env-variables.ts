import winston from "winston";

const validateEnvVariables = () => {
  const requiredEnvVariables = [
    "DATABASE_USER_NAME",
    "DATABASE_PASSWORD",
    "DATABASE_HOST",
    "DB_PORT",
    "JWT_SECRET",
    "JWT_LIFETIME",
  ];
  const missingVariables = requiredEnvVariables.filter(
    (varName) => !process.env[varName],
  );
  console.log(`Required variables: ${requiredEnvVariables}`);
  if (missingVariables.length > 0) {
    missingVariables.forEach((varName) => {
      winston.error(
        `Env Validation: Missing required environment variable: ${varName}`,
      );
    });
    process.exit(1);
  }
};

export { validateEnvVariables };
