
import { EnvVariables } from "@/libs/enums/envVariables";

export const SECRET_JWT_KEY = new TextEncoder().encode(
    EnvVariables.JWT_SECRET,
);