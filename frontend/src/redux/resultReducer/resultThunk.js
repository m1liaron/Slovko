import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const saveResults = createAsyncThunk("results/save", async (data) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.post("/results", data);
	return response.data;
});

export const getResults = createAsyncThunk("results/get", async ({resultsYear}) => {
	const axiosInstance = await createAuthorizedInstance();
	const response = await axiosInstance.get(`/results?year=${resultsYear}`);
	return response.data;
});

export const getResultDetails = createAsyncThunk(
	"resultDetails/get",
	async (id) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/results/${id}`);
		return response.data;
	},
);

export const getResultsStatistics = createAsyncThunk(
	"resultsDetails/get",
	async () => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get("/results/statistics");
		return response.data;
	},
);
