import { EnvVariables } from '@/libs/enums/envVariables.js';
import { Encrypt } from './encrypt.module.js';

const encrypt = new Encrypt(EnvVariables.BCRYPT_SALT_ROUNDS);

export { encrypt };
