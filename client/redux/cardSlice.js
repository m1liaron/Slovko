import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../utils/createAuthorizedInstance";

export const getCards = createAsyncThunk('card/fetchCards', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/cards/${data.groupId}`);
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const addCard = createAsyncThunk('card/addCard', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post('/cards', data)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})


export const removeCard = createAsyncThunk('card/remove', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.delete(`/cards/${data}`)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})


const cardSlice = createSlice({
    name:'cards',
    initialState: {
        cards: [],
        status:'idle',
        error: null
    },
    reducers:{
        shuffleCards: (state) => {
            state.cards = shuffleArray(state.cards);
        }
    },
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

export const { shuffleCards } = cardSlice.actions;

export const selectCard = (state) => state.cards.cards;

export const cardReducers = cardSlice.reducer;