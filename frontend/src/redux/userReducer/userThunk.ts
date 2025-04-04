import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";
import { IUser } from "@/common/enums/types/user.type";
const url: string = "http://192.168.31.196:3000";

const login = createAsyncThunk("user/login", async (data) => {
	const response = await axios.post(`${url}/users/login`, data);
	await AsyncStorage.setItem("token", response.data.token);
	return response.data;
});

const register = createAsyncThunk("user/register", async (data) => {
	const response = await axios.post(`${url}/users/register`, data);
	await AsyncStorage.setItem("token", response.data.token);
	return response.data;
});

const getUser = createAsyncThunk("user/get", async () => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get("/users");
	return response.data.user;
});

const updateUser = createAsyncThunk(
	"user/update",
	async ({ id, data }: {id: string, data: IUser}) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.put(`/users/${id}`, data);
		return response.data;
	},
);

const updateUserStreak = createAsyncThunk(
	"user/updateUserStreak",
	async () => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.patch("/users/streak");
		return response.data;
	},
);

const buyFreeze = createAsyncThunk(
	"user/buyFreeze",
	async ({ froze }: { froze: boolean}) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.put("/users/streak/froze", { froze });
		return response.data;
	},
);

const getUserStreakDates = createAsyncThunk(
	"user/getStreakDates",
	async ({ month, year }: { month: Date; year: Date}) => {
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
}