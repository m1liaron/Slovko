import { config } from "dotenv";
import { Sequelize } from "sequelize";

import { EnvVariables } from "../common/enums/index.js";
config();

let sequelize: Sequelize;

if (EnvVariables.NODE_ENV === "production") {
  sequelize = new Sequelize(EnvVariables.DATABASE_URL!, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(
    EnvVariables.DATABASE_NAME!,
    EnvVariables.DATABASE_USER_NAME!,
    EnvVariables.DATABASE_PASSWORD!,
    {
      host: EnvVariables.DATABASE_HOST,
      port: Number(EnvVariables.DB_PORT),
      dialect: "postgres",
      logging: false,
    },
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the PostgreSQL database:", error);
  }
};

export { sequelize, connectDB };
