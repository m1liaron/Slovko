import cors from "cors";
import type { Application } from "express";
import express from "express";

import { connectDB } from "./db/sequelize.js";
import { validateEnvVariables } from "./helpers/db/index.js";
import { ensureLanguages } from "./initFunctions/createLanguages.js";
import { authMiddleware, errorMiddleware, initializeLogger } from "./middlewares/index";
import {
  userRoute,
  sectionRoute,
  groupRoute,
  cardRoute,
  resultRoute,
  sharedGroupRoute,
  languageRoute
} from "./modules/index";

import { EnvVariables } from "./libs/enums/envVariables.js";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(initializeLogger);

app.use("/users", userRoute);
app.use("/languages", authMiddleware, languageRoute);
app.use("/cards", authMiddleware, cardRoute);
app.use("/groups", authMiddleware, groupRoute);
app.use("/results", authMiddleware, resultRoute);
app.use("/sharedGroups", authMiddleware, sharedGroupRoute);
app.use("/sections", authMiddleware, sectionRoute);

app.use(errorMiddleware);

const port = EnvVariables.PORT || 3000;

const start = async () => {
  try {
    validateEnvVariables();
    await connectDB();
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
