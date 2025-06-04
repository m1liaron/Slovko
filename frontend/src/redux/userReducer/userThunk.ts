import {
	type IUpdateUser,
	IUser,
	type RegisterUser,
} from "@/common/enums/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";
import { SERVER_API_URL } from "@/common/enums/constants/server-api";

const login = createAsyncThunk(
	"user/login",
	async (data: { email: string; password: string }) => {
		const response = await axios.post(`${SERVER_API_URL}/users/login`, data);
		await AsyncStorage.setItem("token", response.data.token);
		return response.data;
	},
);

const register = createAsyncThunk(
	"user/register",
	async (data: RegisterUser) => {
		const response = await axios.post(`${SERVER_API_URL}/users/register`, data);
		await AsyncStorage.setItem("token", response.data.token);
		return response.data;
	},
);

const getUser = createAsyncThunk("user/get", async (_, { rejectWithValue }) => {
	try {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get("/users");
		return response.data.user;
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(error.message)	
		}
	}
});

const updateUser = createAsyncThunk(
	"user/update",
	async ({ id, data }: { id: string; data: IUpdateUser }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.put(`/users/${id}`, data);
		return response.data;
	},
);

const updateUserStreak = createAsyncThunk("user/updateUserStreak", async () => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.patch("/users/streak");
	return response.data;
});

const buyFreeze = createAsyncThunk(
	"user/buyFreeze",
	async ({ froze }: { froze: number }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.put("/users/streak/froze", { froze });
		return response.data;
	},
);

const getUserStreakDates = createAsyncThunk(
	"user/getStreakDates",
	async ({ month, year }: { month: number; year: number }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(
			`/users/streak?month=${month}&year=${year}`,
		);
		return response.data;
	},
);

export {
	login,
	register,
	getUser,
	updateUser,
	updateUserStreak,
	buyFreeze,
	getUserStreakDates,
};
