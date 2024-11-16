import { createSlice } from "@reduxjs/toolkit";
import {
    getCards,
    getAllStatusCards,
    addCard,
    removeCard,
    updateCard,
    updateCardsAfterLearn
} from './cardThunk';
import {DataStatus} from "../../common/enums/app/app";

const cardSlice = createSlice({
    name:'cards',
    initialState: {
        cards: [],
        status: DataStatus.IDLE,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getCards.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getCards.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards = action.payload;
            })
            .addCase(getCards.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
                state.error = action.error.message;
            })

            .addCase(getAllStatusCards.pending, (state) => {
                state.status =  DataStatus.PENDING
            })
            .addCase(getAllStatusCards.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards = action.payload;
            })
            .addCase(getAllStatusCards.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
                state.error = action.error.message;
            })

            .addCase(updateCardsAfterLearn.pending, (state) => {
                state.status = DataStatus.PENDING;
            })
            .addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.cards = action.payload;
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
                    state.cards = [...state.cards];
                }
            })
            .addCase(updateCard.rejected, (state, action) => {
                state.status = DataStatus.ERROR;
            })
    }
})

export const selectCard = (state) => state.cards.cards;
export {
    getCards,
    getAllStatusCards,
    addCard,
    removeCard,
    updateCard,
    updateCardsAfterLearn
} from './cardThunk';
export const cardReducers = cardSlice.reducer;