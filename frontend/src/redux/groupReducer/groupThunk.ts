import type { IGroup } from "@/common/enums/types/group.type";
import { createAppAsyncThunk } from "../services/createAppAsyncThunk";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllGroups = createAppAsyncThunk("group/getAll", async () => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get("/groups");
	return response.data;
});

export const addGroup = createAppAsyncThunk(
	"group/add",
	async (data: { title: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/groups", data);
		return response.data;
	},
);

export const getGroup = createAppAsyncThunk("group/get", async (id: string) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get(`/groups/${id}`);
	return response.data;
});

export const removeGroup = createAppAsyncThunk(
	"group/remove",
	async (id: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(`/groups/${id}`);
		return response.data;
	},
);

export const updateGroup = createAppAsyncThunk(
	"group/update",
	async (data: IGroup) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.patch(`/groups/${data.id}`, data);
		return response.data;
	},
);
