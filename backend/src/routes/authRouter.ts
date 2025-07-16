import { NextFunction, Router, Response, RequestHandler } from "express"
import { AuthRequest, AuthRequestHandler } from "../common/types/AuthRequest.type.js";

type AuthRoute = <T = any> (
    path: string,
    handler: (req: AuthRequest<T>, res: Response, next: NextFunction) => any
) => Router;

const authRouter = () => {
    const router = Router();

    const methods = ["get", "post", "patch", "put", "delete"] as const;

    type Method = typeof methods[number];
    const wrappedRouter = {} as Record<Method, (path: string, ...handlers: (RequestHandler | AuthRequestHandler)[]) => Router>;

    for (const method of methods) {
        wrappedRouter[method] = (path, ...handlers) => {
            return router[method](path, ...handlers.map(h => h as RequestHandler))
        }
    }

    return {
        ...wrappedRouter,
        router,
    };
}

export { authRouter };