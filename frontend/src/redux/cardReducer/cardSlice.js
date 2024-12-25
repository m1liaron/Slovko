import { createSlice } from "@reduxjs/toolkit";
import {
    getCards,
    addCard,
    removeCard,
    updateCard,
    updateCardsAfterLearn,
    getRepeatedCards,
    getRepeatedCardsFromIds
} from './cardThunk';
import {DataStatus} from "../../common/enums/app/app";

const cardSlice = createSlice({
    name:'cards',
    initialState: {
        cards: [],
        filteredCards: [],
        repeatedCards: [],
        status: DataStatus.IDLE,
        error: null
    },
    reducers:{
        filterCardsByStatus: (state, action) => {
            state.cards = state.filteredCards.filter(card => card.status === action.payload.status)
        },
        resetFilter: (state, action) => {
            state.cards = [...state.filteredCards];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCards.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getCards.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards = action.payload;
                state.filteredCards = action.payload;
            })
            .addCase(getCards.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
                state.error = action.error.message;
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
                state.error = action.error.message;
            })

            .addCase(addCard.pending, (state, action) => {
                state.status = DataStatus.PENDING;
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards.push(action.payload)
                state.filteredCards.push(action.payload)
            })
            .addCase(addCard.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
            })
            // remove card
            .addCase(removeCard.pending, (state, action) => {
                state.status = DataStatus.PENDING;
            })
            .addCase(removeCard.fulfilled, (state, action) => {
                state.status =  DataStatus.SUCCESS;
                state.cards = state.cards.filter(card => card.id !== action.payload)
                state.filteredCards = state.filteredCards.filter(card => card.id !== action.payload)
            })
            .addCase(removeCard.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
            })
            // update card
            .addCase(updateCard.pending, (state, action) => {
                state.status = DataStatus.PENDING;
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.error = null;
                const updatedCard = action.payload;
                const index = state.cards.findIndex((card) => card.id === updatedCard.id);
                if (index !== -1) {
                    state.cards[index] = updatedCard;
                    state.filteredCards[index] = updatedCard;
                    state.cards = [...state.cards];
                    state.filteredCards = [...state.filteredCards];
                }
            })
            .addCase(updateCard.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
            })
            // get repeated cards
            .addCase(getRepeatedCards.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getRepeatedCards.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.repeatedCards = action.payload;
            })
            .addCase(getRepeatedCards.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
                state.error = action.error.message;
            })
            // get repeated cards
            .addCase(getRepeatedCardsFromIds.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getRepeatedCardsFromIds.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards = action.payload;
            })
            .addCase(getRepeatedCardsFromIds.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
                state.error = action.error.message;
            })
    }
})

export const { filterCardsByStatus, resetFilter } = cardSlice.actions;
export const selectCard = (state) => state.cards.cards;
export {
    getCards,
    addCard,
    removeCard,
    updateCard,
    updateCardsAfterLearn,
    getRepeatedCards,
    getRepeatedCardsFromIds
} from './cardThunk';
export const cardReducers = cardSlice.reducer;