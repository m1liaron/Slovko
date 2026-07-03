import { EnvVariables } from '@/libs/enums/envVariables.js';
import { JWToken } from './token.module.js';

const jwtToken = new JWToken();

const SECRET_JWT_KEY = new TextEncoder().encode(EnvVariables.JWT_SECRET);

export { jwtToken, SECRET_JWT_KEY };
