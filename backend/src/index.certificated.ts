import fs from "fs";
import https from "https";

import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";

import { connectDB, sequelize } from "./db/sequelize.js";
import { validateEnvVariables } from "./helpers/db/index.js";
import { ensureLanguages } from "./initFunctions/createLanguages.js";

import { initializeLogger } from "./middlewares/initializeLogger.js";
import { initializeRoutes } from "./initFunctions/initialize_routes.js";

import { EnvVariables } from "./libs/enums/envVariables.js";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(initializeLogger);
app.use(helmet());

initializeRoutes(app);

const port = EnvVariables.PORT || 3000;

const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "../certs/key.pem";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "../certs/key.pem";
const SSL_CA_PATH = process.env.SSL_CA_PATH || undefined; // optional CA chain
const SSL_PASSPHRASE = process.env.SSL_PASSPHRASE || undefined;

const start = async () => {
  try {
    validateEnvVariables();
    await connectDB();
    console.log("Database connected, attempting to sync models...");
    await sequelize.sync({ alter: true });
    await ensureLanguages();

    const key = fs.readFileSync(SSL_KEY_PATH, "utf8");
    const cert = fs.readFileSync(SSL_CERT_PATH, "utf8");
    const ca = SSL_CA_PATH ? fs.readFileSync(SSL_CA_PATH, "utf8") : undefined;

    const sslOptions: https.ServerOptions = {
      key,
      cert,
      ca,
      passphrase: SSL_PASSPHRASE,
    };

    const httpsServer = https.createServer(sslOptions, app);

    httpsServer.listen(port, () => {
      console.log(`HTTPS server running on port https://localhost:${port}`);
      console.log(
        `Protected HTTPS server running on port https://127.0.0.1:${port}`,
      );
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
};

start();

export { app };
