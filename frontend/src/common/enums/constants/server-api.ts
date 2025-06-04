import { Platform } from "react-native";

const isEmulator = Platform.OS === "android" && Platform.constants.Release?.toLowerCase().includes("emu");
const SERVER_API_URL: string = isEmulator ? "http://10.0.2.2:3000" : process.env.API_URL || "http://192.168.31.196:3000";

export { SERVER_API_URL };