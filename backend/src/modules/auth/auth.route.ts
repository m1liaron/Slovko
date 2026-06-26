import { authRouter } from "@/libs/modules/route/index.js";
import {
    register,
    login,
} from "./auth.controller.js";
import {
    registerSchema,
    loginSchema,
} from "./auth.schema.js";
import { validate, asyncHandler } from "@/middlewares/index.js";

const { router, get, put, post, patch } = authRouter();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));