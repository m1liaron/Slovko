import { config } from "dotenv";
import { Sequelize } from "sequelize";

import { EnvVariables } from "../common/enums/index.js";
config();

const sequelize = new Sequelize(
  EnvVariables.DATABASE_NAME, // database name
  EnvVariables.DATABASE_USER_NAME, // username
  EnvVariables.DATABASE_PASSWORD, // password
  {
    host: EnvVariables.DATABASE_HOST,
    dialect: "postgres",
    logging: false,
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the PostgreSQL database:", error);
  }
};

export { sequelize, connectDB };
