import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosInstance } from "axios";

/**
 * Creates an authorized Axios instance with a Bearer token.
 * @returns {Promise<AxiosInstance>} A Promise that resolves to an Axios instance with auth headers.
 */

export const createAuthorizedInstance = async (): Promise<AxiosInstance> => {
	try {
		const token = await AsyncStorage.getItem("token");

		return axios.create({
			baseURL: process.env.URL || "http://192.168.31.196:3000",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error retrieving token:", error);
		throw error instanceof Error ? error : new Error("Unknown error occurred");
	}
};
