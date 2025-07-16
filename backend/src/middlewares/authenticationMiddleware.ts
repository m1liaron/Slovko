import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { EnvVariables } from "../common/enums/index.js";

interface AuthRequest extends Request {
	user?: {
		id: string;
		name: string;
	}
}

interface DecodedUserPayload extends JwtPayload {
	userId: string;
	name: string;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: true, message: "Authentication invalid, token not found" });
	}
	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, EnvVariables.JWT_SECRET!) as DecodedUserPayload;
		const user = await User.findByPk(decoded.userId, {
			attributes: { exclude: ["password"] },
		});
		if (!user) {
			return res
				.status(401)
				.json({ error: true, message: "Authentication invalid, user not found" });
		}
		req.user = { id: decoded.userId, name: decoded.name };

		next();
	} catch (error) {
		if (error instanceof Error) {
			return res
				.status(401)
				.json({ error: true, message: "Authentication invalid: " + error.message });
		}
	}
};

export { authMiddleware };
