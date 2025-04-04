import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getAllGroups = createAsyncThunk("group/getAll", async (data) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get("/groups", data);
	return response.data;
});

export const addGroup = createAsyncThunk("group/add", async (data) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.post("/groups", data);
	return response.data;
});

export const getGroup = createAsyncThunk("group/get", async (id) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get(`/groups/${id}`);
	return response.data;
});

export const removeGroup = createAsyncThunk("group/remove", async (id) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.delete(`/groups/${id}`);
	return response.data;
});

export const updateGroup = createAsyncThunk("group/update", async (data) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.patch(`/groups/${data.id}`, data);
	return response.data;
});
