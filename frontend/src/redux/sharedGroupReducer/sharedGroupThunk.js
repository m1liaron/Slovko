import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllSharedGroups = createAsyncThunk(
	"sharedGroup/getAll",
	async () => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get("/sharedGroups");
		return response.data;
	},
);

export const saveSharedGroup = createAsyncThunk(
	"sharedGroup/save",
	async (data, thunkAPI) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.post("/sharedGroups", data);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.message);
		}
	},
);

export const getSharedGroup = createAsyncThunk(
	"sharedGroup/get",
	async (id) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/sharedGroups/${id}`);
		return response.data;
	},
);

export const copySharedGroup = createAsyncThunk(
	"sharedGroup/copy",
	async (sharedGroupId) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post(`/sharedGroups/${sharedGroupId}`);
		return response.data;
	},
);

export const removeSharedGroup = createAsyncThunk(
	"sharedGroup/remove",
	async (sharedGroupId) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(
			`/sharedGroups/${sharedGroupId}`,
		);
		return response.data;
	},
);
