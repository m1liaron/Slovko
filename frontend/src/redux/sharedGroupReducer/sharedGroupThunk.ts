import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllSharedGroups = createAsyncThunk(
	"sharedGroup/getAll",
	async (data: { page: number }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/sharedGroups?page=${data.page}`);
		return response.data;
	},
);

export const saveSharedGroup = createAsyncThunk(
	"sharedGroup/save",
	async (data: { groupId: string; title: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/sharedGroups", data);
		return response.data;
	},
);

export const getSharedGroup = createAsyncThunk(
	"sharedGroup/get",
	async (id: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/sharedGroups/${id}`);
		return response.data;
	},
);

export const copySharedGroup = createAsyncThunk(
	"sharedGroup/copy",
	async (sharedGroupId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post(`/sharedGroups/${sharedGroupId}`);
		return response.data;
	},
);

export const removeSharedGroup = createAsyncThunk(
	"sharedGroup/remove",
	async (sharedGroupId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(
			`/sharedGroups/${sharedGroupId}`,
		);
		return response.data;
	},
);
