import type {
	AddCardRequest,
	UpdateCardRequst,
} from "@/common/enums/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";

export const getCards = createAsyncThunk(
	"card/get-cards",
	async ({ groupId }: { groupId: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/cards/${groupId}`);
		return response.data;
	},
);

export const addCard = createAsyncThunk(
	"card/add-card",
	async (data: AddCardRequest) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/cards", data);
		return response.data;
	},
);

export const removeCard = createAsyncThunk(
	"card/remove",
	async (cardId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(`/cards/${cardId}`);
		return response.data;
	},
);

export const updateCard = createAsyncThunk(
	"card/update",
	async (data: UpdateCardRequst) => {
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
	async (data: string[]) => {
		try {
			const axiosInstance = await createAuthorizedInstance();
			const response = await axiosInstance.put("/cards/learn", data || {});
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
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get("/cards");
		return response.data;
	},
);

export const getRepeatedCardsFromIds = createAsyncThunk(
	"card/getRepeatedCardsFromIds",
	async (data: string[]) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/cards/repeated", data);
		return response.data;
	},
);
