import { Platform } from 'react-native';

console.log(process.env.EXPO_API_URL)
const SERVER_API_URL: string =
  process.env.EXPO_API_URL ?? 'http://192.168.31.21:3000';

export { SERVER_API_URL };
