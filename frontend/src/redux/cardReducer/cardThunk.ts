import type {
	AddCardRequest,
	UpdateCardRequst,
} from "@/common/enums/types/types";
import { createAuthorizedInstance } from "../../utils/createAuthorizedInstance";
import { createAppAsyncThunk } from "../services/createAppAsyncThunk";

export const getCards = createAppAsyncThunk(
	"card/get-cards",
	async ({ groupId }: { groupId: string }) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get(`/cards/${groupId}`);
		return response.data;
	},
);

export const addCard = createAppAsyncThunk(
	"card/add-card",
	async (data: AddCardRequest) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/cards", data);
		return response.data;
	},
);

export const removeCard = createAppAsyncThunk(
	"card/remove",
	async (cardId: string) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.delete(`/cards/${cardId}`);
		return response.data;
	},
);

export const updateCard = createAppAsyncThunk(
	"card/update",
	async (data: UpdateCardRequst) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.patch(`/cards/${data.id}`, data);
		return response.data;
	},
);

export const updateCardsAfterLearn = createAppAsyncThunk(
	"card/learnCards",
	async (data: string[]) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.put("/cards/learn", data || {});
		return response.data;
	},
);

export const getRepeatedCards = createAppAsyncThunk(
	"card/getRepeatedCards",
	async () => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.get("/cards");
		return response.data;
	},
);

export const getRepeatedCardsFromIds = createAppAsyncThunk(
	"card/getRepeatedCardsFromIds",
	async (data: string[]) => {
		const axiosInstance = await createAuthorizedInstance();
		const response = await axiosInstance.post("/cards/repeated", data);
		return response.data;
	},
);
