import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { HttpError } from "@/libs/constants/index";
import { jwtToken } from "@/libs/modules/token/index.js";
import { encrypt } from "@/libs/modules/encrypt/encrypt.js";
import { UserService } from "../user/user.service.js";

const register = async (req: Request, res: Response) => {
    const { email, password, name, points } = req.body;

    const findUser = await UserService.findUserByEmail(email);
    if (findUser) {
        throw HttpError.badRequest("User already exist");
    }

    const user = await UserService.createUser({
        email,
        password,
        name,
        points,
    });
    const token = jwtToken.createJWTToken({ name, id: user.id });
    res.status(StatusCodes.CREATED).json({ user: user, token });
};

const login = async (req: Request, res: Response) => {
    const { email, password: requestPassword } = req.body;

    const user = await UserService.findUserByEmail(email);
    if (!user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: true, message: "User with this email not found" });
    }

    const isPasswordCorrect = await encrypt.compare(requestPassword, user.password);
    if (!isPasswordCorrect) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: true, message: "Invalid credentials" });
    }

    const token = jwtToken.createJWTToken({ name: user.name, id: user.id });
    res.status(StatusCodes.OK).json({ user: user, token });
};

export {
    register,
    login,
};
