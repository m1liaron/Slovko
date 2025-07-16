import { NextFunction, Router, Response } from "express"
import { AuthRequest } from "../common/types/AuthRequest";

type AuthRoute = <T = any> (
    path: string,
    handler: (req: AuthRequest<T>, res: Response, next: NextFunction) => any
) => Router;
 
const authRouter = () => {
    const router = Router();

    const get: AuthRoute = (path, handler) => router.get(path, handler as any);
    const post: AuthRoute = (path, handler) => router.post(path, handler as any);
    const patch: AuthRoute = (path, handler) => router.patch(path, handler as any);
    const put: AuthRoute = (path, handler) => router.put(path, handler as any);
    const remove: AuthRoute = (path, handler) => router.delete(path, handler as any);

    return { router, get, post, patch, put, remove };
}

export { authRouter };