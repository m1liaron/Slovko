import { Request } from "express";

interface AuthRequest<T = any> extends Request<any, any, any, T> {
    user: {
        id: string;
        name: string;
    }
}

export { AuthRequest };