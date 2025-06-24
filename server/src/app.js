const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const cors = require("cors");

const { connectDB, sequelize } = require("./db/sequelize");
const {
	userRoute,
	cardRoute,
	groupRoute,
	resultRoute,
	sharedGroup,
} = require("./routes/routes");
const authMiddleware = require("./middlewares/authenticationMiddleware");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use("/users", userRoute);
app.use("/cards", authMiddleware, cardRoute);
app.use("/groups", authMiddleware, groupRoute);
app.use("/results", authMiddleware, resultRoute);
app.use("/sharedGroups", authMiddleware, sharedGroup);

const key = fs.readFileSync(path.join(__dirname, "../127.0.0.1+3-key.pem"));
const cert = fs.readFileSync(path.join(__dirname, "../127.0.0.1+3.pem"));

const options = { key, cert };

const port = process.env.PORT || 3000;

const start = async () => {
	try {
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
