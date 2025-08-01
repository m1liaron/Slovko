import { Platform } from 'react-native';

const isEmulator = Platform.OS === 'android';
const SERVER_API_URL: string = isEmulator
  ? process.env.API_URL
  : 'https://localhost:3000';

export { SERVER_API_URL };
