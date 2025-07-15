import { Request } from "express";

interface AuthRequest extends Request {
    user: {
        id: string;
        name: string;
    }
}

export { AuthRequest };