import { NextFunction, Request, Response } from "express";

interface AuthRequest<T = any> extends Request<any, any, any, T> {
    user: {
        id: string;
        name: string;
    }
}

type AuthRequestHandler<T = any> = (
    req: AuthRequest<T>,
    res: Response,
    next: NextFunction
) => any;

export type { AuthRequest, AuthRequestHandler };