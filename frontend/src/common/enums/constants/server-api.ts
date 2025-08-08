import { Platform } from 'react-native';

const isEmulator = Platform.OS === 'android';
const SERVER_API_URL: string = isEmulator
  ? process.env.API_URL
  : 'http://192.168.31.21:3000';

export { SERVER_API_URL };
