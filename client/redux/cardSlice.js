import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchCards = createAsyncThunk('card/fetchCards', async() => {
    try{
        const response = await fetch('http://localhost:8000/cards');
        const data = await response.json();
        // console.log(data)
        return data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

const cardSlice = createSlice({
    name:'card',
    initialState: {
        cards: [],
        status:'idle',
        error: null
    },
    reducers:{
        addCard: (state, action) => {
            state.cards = [...state.cards, action.payload]
        },
        removeCard: (state, action) => {
            state.cards = state.cards.filter((item, index) => index !== action.payload)
        },
        shuffleCards: (state) => {
            state.cards = shuffleArray(state.cards);
        },
        updateCard: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards = action.payload;
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
        });
    }
})

const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

export const {addCard, removeCard,shuffleCards} = cardSlice.actions;

export const selectCard = (state) => state.card.cards;

export const cardReducers = cardSlice.reducer;