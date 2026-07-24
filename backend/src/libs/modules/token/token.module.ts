import * as jose from 'jose';

import { HttpError } from '@/libs/constants/index';
import { type JwtTokenPayload } from '@/libs/types/jwt-token-payload.type.js';
import { SECRET_JWT_KEY } from './jwt-secret';

class JWToken {
    public createJWTToken({ email, id }: JwtTokenPayload): Promise<string> {
        return new jose.SignJWT({ email, id })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuedAt()
            .setExpirationTime(process.env['JWT_LIFETIME'] || '1d')
            .sign(SECRET_JWT_KEY);
    }

    public async verifyJWTToken(token: string): Promise<JwtTokenPayload> {
        try {
            const { payload } = await jose.jwtVerify(token, SECRET_JWT_KEY, {
                algorithms: ['HS256']
            });

            if (
                typeof payload['email'] !== 'string' ||
                typeof payload['id'] !== 'number'
            ) {
                throw HttpError.unauthorized('Invalid token payload');
            }

            return payload as JwtTokenPayload;
        } catch (error) {
            throw HttpError.unauthorized(
                error instanceof Error ? error.message : 'Invalid or expired JWT'
            );
        }
    }
}

export { JWToken };
