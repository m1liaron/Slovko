import { type ICard, AddCardRequest } from "@/common/enums/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getCards = createAsyncThunk(
	"card/fetchCards",
	async ({ groupId }: { groupId: string}) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.get(`/cards/${groupId}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);

export const addCard = createAsyncThunk(
	"card/addCard",
	async (data: AddCardRequest, thunkAPI) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.post("/cards", data);
			return response.data;
		} catch (error) {
			let message = "Unknown Error";
			if (error instanceof Error) message = error.message;
			return thunkAPI.rejectWithValue(message);
		}
	},
);

export const removeCard = createAsyncThunk(
	"card/remove",
	async (cardId: string) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.delete(`/cards/${cardId}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);

export const updateCard = createAsyncThunk(
	"card/update",
	async (data: ICard) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.patch(`/cards/${data.id}`, data);
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);

export const updateCardsAfterLearn = createAsyncThunk(
	"card/learnCards",
	async (data: ICard) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const url = data.groupId ? `/cards/${data.groupId}` : "/cards";
			const response = await axiosInstance.put(url, data || {});
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);

export const getRepeatedCards = createAsyncThunk(
	"card/getRepeatedCards",
	async () => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.get("/cards");
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);

export const getRepeatedCardsFromIds = createAsyncThunk(
	"card/getRepeatedCardsFromIds",
	async (data: string[]) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.post("/cards/repeated", data);
			return response.data;
		} catch (error) {
			console.error("Error fetching cards:", error);
			throw error;
		}
	},
);
