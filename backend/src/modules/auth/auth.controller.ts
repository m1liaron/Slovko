import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { HttpError } from "@/common/constants/HttpError.js";
import { User } from "../user/user.model.js";

const register = async (req: Request, res: Response) => {
    const { email, password, name, points } = req.body;

    const findUser = await User.findOne({ where: { email } });
    if (findUser) {
        throw HttpError.badRequest("User already exist");
    }

    const user = await User.create({
        email,
        password,
        name,
        points,
    });
    const token = user.createJWT();
    const mainUserData = user.toJSON();
    res.status(StatusCodes.CREATED).json({ user: mainUserData, token });
};

const login = async (req: Request, res: Response) => {
    const { email, password: requestPassword } = req.body;

    const user = await User.findOne({
        where: { email },
    });
    if (!user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: true, message: "User with this email not found" });
    }

    const isPasswordCorrect = await user.comparePassword(requestPassword);
    if (!isPasswordCorrect) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: true, message: "Invalid credentials" });
    }

    const token = user.createJWT();
    const mainUserData = user.toJSON();
    res.status(StatusCodes.OK).json({ user: mainUserData, token });
};

export {
    register,
    login,
};
