import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: true, message: "Authentication invalid" });
	}
	const token = authHeader.split(" ")[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		const user = User.findByPk(payload.id, {
			attributes: { exclude: ["password"] },
		});
		if (!user) {
			return res
				.status(401)
				.json({ error: true, message: "Authentication invalid" });
		}
		req.user = { id: payload.userId, name: payload.name };

		next();
	} catch (error) {
		return res
			.status(401)
			.json({ error: true, message: "Authentication invalid" });
	}
};

export { authMiddleware };
