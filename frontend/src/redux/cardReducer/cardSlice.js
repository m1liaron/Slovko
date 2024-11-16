import { createSlice } from "@reduxjs/toolkit";
import {
    getCards,
    getAllStatusCards,
    addCard,
    removeCard,
    updateCard,
    updateCardsAfterLearn
} from './cardThunk';

const cardSlice = createSlice({
    name:'cards',
    initialState: {
        cards: [],
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getCards.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards = action.payload;
            })
            .addCase(getCards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(getAllStatusCards.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllStatusCards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards = action.payload;
            })
            .addCase(getAllStatusCards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(updateCardsAfterLearn.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCardsAfterLearn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards = action.payload;
            })
            .addCase(updateCardsAfterLearn.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(addCard.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards.push(action.payload)
            })
            .addCase(addCard.rejected, (state, action) => {
                state.status = 'error';
            })
            // remove card
            .addCase(removeCard.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(removeCard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards = state.cards.filter(card => card.id !== action.payload)
            })
            .addCase(removeCard.rejected, (state, action) => {
                state.status = 'error';
            })
            // update card
            .addCase(updateCard.pending, (state, action) => {
                state.status = 'pending';
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                const updatedCard = action.payload;
                const index = state.cards.findIndex((card) => card.id === updatedCard.id);
                if (index !== -1) {
                    state.cards[index] = updatedCard;
                    state.cards = [...state.cards];
                }
            })
            .addCase(updateCard.rejected, (state, action) => {
                state.status = 'error';
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