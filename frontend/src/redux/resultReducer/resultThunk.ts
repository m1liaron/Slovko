import type { SaveResultsRequest } from "@/common/enums/types/result.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const saveResults = createAsyncThunk(
	"results/save",
	async (data: SaveResultsRequest) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/results", data);
		return response.data;
	},
);

export const getResults = createAsyncThunk(
	"results/get",
	async (data: { month: number; year: number, page: number }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(
			`/results?page=${data.page}&month=${data.month}&year=${data.year}`,
		);
		return response.data;
	},
);

export const getResultDetails = createAsyncThunk(
	"resultDetails/get",
	async (id: string) => {
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
