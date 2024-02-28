import {createSlice} from "@reduxjs/toolkit";

const cardSlice = createSlice({
    name:'card',
    initialState: {
        cards: [
            {
                id: '3e5970d7-d7b8-4791-810f-7eaa14792fbf',
                title: 'human',
                translate: 'людина',
                transcription: '[ˈhjuːmən]',
                audioUrl: 'http://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
                definition: 'A member of the species Homo sapiens, distinguished from other animals by superior mental development, power of articulate speech, and upright stance.'
            },
            {
                id: '3e5970d7-d7b8-4791-810d-7eaa14792fbf',
                title: 'apple',
                translate: 'яблуко',
                transcription: '[ˈæpl]',
                audioUrl: 'http://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
                definition: 'The round fruit of a tree of the rose family, which typically has thin red or green skin and crisp flesh.'
            },
            {
                id: '3e5970d7-d7b8-4791-810e-7eaa14792fbf',
                title: 'sun',
                translate: 'сонце',
                transcription: '[sʌn]',
                audioUrl: 'http://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
                definition: 'The star around which the earth orbits, which provides light and heat to the earth, and around which the planets of the solar system revolve.'
            },
            {
                id: '3e5970d7-d7b8-4791-810c-7eaa14792fbf',
                title: 'tree',
                translate: 'дерево',
                transcription: '[triː]',
                audioUrl: 'http://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
                definition: 'A woody perennial plant, typically having a single stem or trunk growing to a considerable height and bearing lateral branches at some distance from the ground.'
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