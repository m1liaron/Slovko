import {createSlice} from "@reduxjs/toolkit";

const cardSlice = createSlice({
    name:'card',
    initialState: {
        cards: [
            {
                title: 'human',
                translate: 'людина',
                id: '3e5970d7-d7b8-4791-810f-7eaa14792fbf'
            },
            {
                title: 'apple',
                translate: 'яблуко',
                id: '3e5970d7-d7b8-4791-810d-7eaa14792fbf'
            },
            {
                title: 'sun',
                translate: 'сонце',
                id: '3e5970d7-d7b8-4791-810e-7eaa14792fbf'
            },
            {
                title: 'tree',
                translate: 'дерево',
                id: '3e5970d7-d7b8-4791-810c-7eaa14792fbf'
            },
        ]
    },
    reducers:{
        addCard: (state, action) => {
            state.cards = [...state.cards, action.payload]
        },
        removeCard: (state, action) => {
            state.cards = state.cards.filter(item => item.id !== action.payload)
        },
        updateCard: (state, action) => {

        }
    }
})

export const {addCard, removeCard} = cardSlice.actions;

export const selectCard = (state) => state.card.cards;

export const cardReducers = cardSlice.reducer;