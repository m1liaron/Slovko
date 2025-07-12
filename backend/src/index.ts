import express, { Application } from "express";
import fs from "fs";
import https from"https";
import cors from "cors";
import path from "path";

import { connectDB, sequelize } from "./db/sequelize";
import {
	userRoute,
	cardRoute,
	groupRoute,
	resultRoute,
	sharedGroupRoute,
} from "./routes/routes";
import { authMiddleware } from "./middlewares/authenticationMiddleware";
import { initializeLogger } from "./middlewares/initializeLogger";
import { validateEnvVariables } from "./helpers/db";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(initializeLogger);

app.use("/users", userRoute);
app.use("/cards", authMiddleware, cardRoute);
app.use("/groups", authMiddleware, groupRoute);
app.use("/results", authMiddleware, resultRoute);
app.use("/sharedGroups", authMiddleware, sharedGroupRoute);


const key = fs.readFileSync(path.join(__dirname, "../127.0.0.1+3-key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "../127.0.0.1+3.pem"));

const options = { key, cert };

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		validateEnvVariables();
		await connectDB();
		console.log("Database connected, attempting to sync models...");
		await sequelize.sync({ alter: true });

		https.createServer(options, app).listen(port, () => {
			console.log(`HTTPS server running on port https://localhost:${port}`);
			console.log(`Protected HTTPS server running on port https://127.0.0.1:${port}`);
		})
	} catch (error) {
		console.error("Error starting server: ", error);
	}
};
start();
