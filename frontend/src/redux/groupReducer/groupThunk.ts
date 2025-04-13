import type { IGroup } from "@/common/enums/types/group.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllGroups = createAsyncThunk("group/getAll", async () => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get("/groups");
	return response.data;
});

export const addGroup = createAsyncThunk(
	"group/add",
	async (data: { title: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/groups", data);
		return response.data;
	},
);

export const getGroup = createAsyncThunk("group/get", async (id: string) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get(`/groups/${id}`);
	return response.data;
});

export const removeGroup = createAsyncThunk(
	"group/remove",
	async (id: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(`/groups/${id}`);
		return response.data;
	},
);

export const updateGroup = createAsyncThunk(
	"group/update",
	async (data: IGroup) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.patch(`/groups/${data.id}`, data);
		return response.data;
	},
);
