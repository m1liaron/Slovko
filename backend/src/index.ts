import cors from "cors";
import express, { type Application } from "express";

import { validateEnvVariables } from "./helpers/db/index.js";
import { errorMiddleware, initializeLogger } from "./middlewares/index";

import { EnvVariables } from "./libs/enums/envVariables.js";
import { initializeRoutes } from "./initFunctions/initialize_routes.js";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(initializeLogger);

initializeRoutes(app);

app.use(errorMiddleware);

const port = EnvVariables.PORT || 3000;

const start = async () => {
  try {
    validateEnvVariables();
    console.log("Database connected, attempting to sync models...");
    // await ensureLanguages();

    app.listen(port, () => {
      console.log(`Server running on port http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
};

start();

export { app };
