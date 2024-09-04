import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../utils/createAuthorizedInstance";

export const fetchCards = createAsyncThunk('card/fetchCards', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post('/cards', data);
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})

export const addCard = createAsyncThunk('card/addCard', async(data) => {
    try{
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post('/card', data)
        return response.data
    } catch (error){
        console.error('Error fetching cards:', error);
        throw error;
    }
})


const cardSlice = createSlice({
    name:'card',
    initialState: {
        cards: [
            {data:
                ["hello", "привіт", "həˈloʊ", "a common greeting or expression of welcome"],
                groupId: 1
            },
            {data:
                    ["cat", "кішка", "cat", "a common greeting or expression of welcome"],
                groupId: 1
            },
            {
                data: ["world", "світ", "wɜrld", "the earth, together with all of its countries, peoples, and natural features"],
                groupId: 2
            },
            {
                data: ["apple", "яблуко", "ˈæpəl", "a round fruit with red or green skin and a whitish interior"],
                groupId: 3
            },
            {
                data: ["house", "будинок", "haʊs", "a building for human habitation, especially one that is lived in by a family or small group of people"],
                groupId: 4
            },
            {
                data: ["cat", "кіт", "kæt", "a small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws"],
                groupId: 5
            },
        ]
        ,
        status:'idle',
        error: null
    },
    reducers:{
        removeCard: (state, action) => {
            state.cards = state.cards.filter((item, index) => index !== action.payload)
        },
        shuffleCards: (state) => {
            state.cards = shuffleArray(state.cards);
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
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cards.cards.push(action.payload)
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

export const {removeCard,shuffleCards} = cardSlice.actions;

export const selectCard = (state) => state.card.cards;

export const cardReducers = cardSlice.reducer;