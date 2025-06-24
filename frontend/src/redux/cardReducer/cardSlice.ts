import type { ICard, IRepeatedGroup } from "@/common/enums/types/types";
import { type PayloadAction, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
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
interface InitialState {
	cards: ICard[];
	cardsStorage: ICard[];
	globalCards: ICard[];
	filteredCards: ICard[];
	repeatedCards: IRepeatedGroup[];
	lastFetchedSuccessfully: boolean;
	status: IDataStatus;
	error: undefined | null | string;
}

const initialState: InitialState = {
	cards: [],
	cardsStorage: [],
	globalCards: [],
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
			const { card: newCard , tempId } = action.payload;
			const existingGroup = state.cards.find(card =>
				card.word === newCard.word && card.groupId === newCard.groupId
			);
			if (existingGroup) {
				throw new Error("Card with this name already exist");
			}
			const newCardData = {
				id: tempId,
				...newCard
			}
			state.cards.push(newCardData);
			state.cardsStorage.push(newCardData);
			state.globalCards.push(newCardData);
		},
		updateStateCard: (state, action) => handleUpdateState(state, action, "cards"),
		removeStateCard: (state, action) => {
			const id = action.payload;
			state.cards = state.cards.filter((card) => card.id !== id);
			state.filteredCards = state.filteredCards.filter((card) => card.id !== id);
			state.cardsStorage = state.cardsStorage.filter((card) => card.id !== id);
			state.globalCards = state.globalCards.filter((card) => card.id !== id);
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
			.addCase(getCards.fulfilled, (state, action) => {
				state.cards = [];
				state.cardsStorage = [];
				state.filteredCards = [];

				const fresh = action.payload;
				state.cards = fresh;
				state.cardsStorage = fresh;
				state.filteredCards = fresh;
				if (fresh.length > 0) {
					state.globalCards = fresh;
				}
			})
			.addCase(getCardsStorage.fulfilled, (state, action) => {
				if (action.payload) {
					state.cards = action.payload;
					state.cardsStorage = action.payload;
				}
			})
			.addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
				state.cards = action.payload;
				state.filteredCards = action.payload;
			})
			.addCase(addCard.fulfilled, (state, action) => {
				const { tempId, card } = action.payload;
				if (tempId) {
					state.cards = state.cards.filter(card => card.id !== tempId);
					state.filteredCards = state.filteredCards.filter(card => card.id !== tempId);
					state.globalCards = state.globalCards.filter(card => String(card.id) !== String(tempId));

					state.cards.push(card)
					state.cardsStorage.push(card)
					state.globalCards.push(card)
				}
			})
			// remove card
			.addCase(removeCard.fulfilled, (state, action) => {
				state.cards = state.cards.filter((card) => card.id !== action.payload);
				state.filteredCards = state.filteredCards.filter(
					(card) => card.id !== action.payload,
				);
				state.globalCards = state.globalCards.filter(
					(card) => card.id !== action.payload,
				);
			})
			// update card
			.addCase(updateCard.fulfilled, (state, action) => {
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
			// get repeated cards
			.addCase(getRepeatedCards.fulfilled, (state, action) => {
				state.repeatedCards = action.payload;
			})
			// get repeated cards
			.addCase(getRepeatedCardsFromIds.fulfilled, (state, action) => {
				state.cards = action.payload;
			})
		
			.addMatcher(isPending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addMatcher(isFulfilled, (state) => {
				state.status = DataStatus.SUCCESS;
				state.error = null;
				state.lastFetchedSuccessfully = true;
			})
			.addMatcher(isRejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.lastFetchedSuccessfully = false;
				const payload = action.payload as { message?: string } | undefined;
				state.error = payload?.message ?? action.error.message;
			})
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
