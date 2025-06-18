import type { ICard, IRepeatedGroup } from "@/common/enums/types/types";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus, type IDataStatus } from "../../common/enums/app/app";
import type { RootState } from "../store";
import {
	addCard,
	getCards,
	getCardsStorage,
	getRepeatedCards,
	getRepeatedCardsFromIds,
	removeCard,
	updateCard,
	updateCardsAfterLearn,
} from "./cardThunk";
import { handleUpdateState } from "../services/handleUpdateState";
import { v4 as uuid } from "uuid";
interface InitialState {
	cards: ICard[];
	cardsStorage: ICard[];
	filteredCards: ICard[];
	repeatedCards: IRepeatedGroup[];
	lastFetchedSuccessfully: boolean;
	status: IDataStatus;
	error: string | null;
}

const initialState: InitialState = {
	cards: [],
	cardsStorage: [],
	filteredCards: [],
	repeatedCards: [],
	lastFetchedSuccessfully: false,
	status: DataStatus.IDLE,
	error: null,
};

const cardSlice = createSlice({
	name: "cards",
	initialState,
	reducers: {
		addStateCard: (state, action) => {
			const existinGroup = state.cards.find(card => card.word === action.payload.word);
			if (existinGroup) {
				throw new Error("Card with this name already exist");
			}
			const cardData = {
				id: uuid(),
				...action.payload
			}
			state.cards.push(cardData);
			state.cardsStorage.push(cardData);
		},
		updateStateCard: (state, action) => handleUpdateState(state, action, "cards"),
		removeStateCard: (state, action) => {
			const id = action.payload;
			state.cards = state.cards.filter((card) => card.id !== id);
			state.filteredCards = state.filteredCards.filter((card) => card.id !== id);
			state.cardsStorage = state.cardsStorage.filter((card) => card.id !== id);
		},
		rangeCards: (state, action) => {
			if (action.payload) {
				state.cards = [...state.cards.slice(0, action.payload)];
				state.cardsStorage = [...state.cardsStorage.slice(0, action.payload)];
			}
		},
		sortCards: (state, action: PayloadAction<"asc" | "desc">) => {
			state.cards.sort((a, b) => {
				const timeA = new Date(a.nextReviewAt).getTime();
				const timeB = new Date(b.nextReviewAt).getTime();

				if (action.payload === "asc") {
					return timeA - timeB; // Ascending order
				}
				return timeB - timeA;
			});
		},
		filterCardsByStatus: (state, action) => {
			state.cards = state.filteredCards.filter(
				(card) => card.status === action.payload.status,
			);
		},
		resetFilter: (state) => {
			state.cards = [...state.filteredCards];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCards.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getCards.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.cards = action.payload;
				state.filteredCards = action.payload;
				state.lastFetchedSuccessfully = true;
			})
			.addCase(getCards.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.error.message || null;
				state.lastFetchedSuccessfully = false;
			})
			.addCase(getCardsStorage.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				if (action.payload) {
					state.cardsStorage = action.payload;
				}
			})
			.addCase(updateCardsAfterLearn.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.cards = action.payload;
				state.filteredCards = action.payload;
			})
			.addCase(updateCardsAfterLearn.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.error.message || null;
			})

			.addCase(addCard.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(addCard.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.lastFetchedSuccessfully = true;
				state.cards.push(action.payload);
				state.filteredCards.push(action.payload);
			})
			.addCase(addCard.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.error.message || null;
			})
			// remove card
			.addCase(removeCard.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(removeCard.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.lastFetchedSuccessfully = true;
				state.cards = state.cards.filter((card) => card.id !== action.payload);
				state.filteredCards = state.filteredCards.filter(
					(card) => card.id !== action.payload,
				);
			})
			.addCase(removeCard.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// update card
			.addCase(updateCard.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(updateCard.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.error = null;
				state.lastFetchedSuccessfully = true;
				const updatedCard = action.payload;
				const index = state.cards.findIndex(
					(card) => card.id === updatedCard.id,
				);
				if (index !== -1) {
					state.cards[index] = updatedCard;
					state.filteredCards[index] = updatedCard;
					state.cards = [...state.cards];
					state.filteredCards = [...state.filteredCards];
				}
			})
			.addCase(updateCard.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// get repeated cards
			.addCase(getRepeatedCards.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getRepeatedCards.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.repeatedCards = action.payload;
			})
			.addCase(getRepeatedCards.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.error.message || null;
			})
			// get repeated cards
			.addCase(getRepeatedCardsFromIds.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getRepeatedCardsFromIds.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.cards = action.payload;
			})
			.addCase(getRepeatedCardsFromIds.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.error.message || null;
			});
	},
});

export const { addStateCard, updateStateCard, removeStateCard, filterCardsByStatus, resetFilter, rangeCards, sortCards } =
	cardSlice.actions;
export const selectCard = (state: RootState) => state.cards.cards;
export {
	getCards,
	addCard,
	removeCard,
	updateCard,
	updateCardsAfterLearn,
	getRepeatedCards,
	getRepeatedCardsFromIds,
} from "./cardThunk";
export const cardReducers = cardSlice.reducer;
