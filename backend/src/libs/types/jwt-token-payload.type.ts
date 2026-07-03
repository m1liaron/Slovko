import { type JWTPayload } from 'jose';

type JwtTokenPayload = JWTPayload & {
    name: string;
    id: string;
};

export { type JwtTokenPayload };
