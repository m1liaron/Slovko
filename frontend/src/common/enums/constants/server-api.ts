import { Platform } from 'react-native';

const SERVER_API_URL: string =
  process.env.API_URL ?? 'http://192.168.31.21:3000';

export { SERVER_API_URL };
