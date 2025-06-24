import { createAppAsyncThunk } from "../services/createAppAsyncThunk";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllSharedGroups = createAppAsyncThunk(
	"sharedGroup/getAll",
	async (data: { page: number }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/sharedGroups?page=${data.page}`);
		return response.data;
	},
);

export const saveSharedGroup = createAppAsyncThunk(
	"sharedGroup/save",
	async (data: { groupId: string; title: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/sharedGroups", data);
		return response.data;
	},
);

export const getSharedGroup = createAppAsyncThunk(
	"sharedGroup/get",
	async (id: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/sharedGroups/${id}`);
		return response.data;
	},
);

export const copySharedGroup = createAppAsyncThunk(
	"sharedGroup/copy",
	async (sharedGroupId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post(`/sharedGroups/${sharedGroupId}`);
		return response.data;
	},
);

export const removeSharedGroup = createAppAsyncThunk(
	"sharedGroup/remove",
	async (sharedGroupId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(
			`/sharedGroups/${sharedGroupId}`,
		);
		return response.data;
	},
);
