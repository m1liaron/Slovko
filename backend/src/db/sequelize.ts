import { config } from "dotenv";
import { Sequelize } from "sequelize";

import { EnvVariables } from "../common/enums/index.js";
config();

let sequelize: Sequelize;

if (EnvVariables.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL!, {
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
    process.env.DATABASE_NAME!,
    process.env.DATABASE_USER_NAME!,
    process.env.DATABASE_PASSWORD!,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
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
