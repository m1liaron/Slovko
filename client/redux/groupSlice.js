import {createSlice} from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name:'groups',
    initialState: {
        groups: [
            {id: 1, title: 'First Group'},
            {id: 2, title: 'Second Group'},
            {id: 3, title: 'Third Group'},
            {id: 4, title: 'Fourth Group'},
            {id: 5, title: 'Fifth Group'},
        ],
        status:'idle',
        error: null
    },
    reducers:{
        removeCard: (state, action) => {
            state.groups = state.groups.filter((item, index) => index !== action.payload)
        }
    },
})

// export const {removeGroup, } = cardSlice.actions;

export const selectGroup= (state) => state.group.groups;

export const groupReducers = groupSlice.reducer;