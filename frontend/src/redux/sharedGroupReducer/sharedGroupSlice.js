import { createSlice } from "@reduxjs/toolkit";
import { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup } from './sharedGroupThunk';

const sharedGroupSlice = createSlice({
    name:'sharedGroup',
    initialState: {
        sharedGroups: [],
        filteredGroups: [],
        sharedGroup: {},
        status:'idle',
        error: null
    },
    reducers:{
        filterSharedGroups: (state, action) => {
            state.sharedGroups = state.filteredGroups.filter(item => item.title.startsWith(action.payload));
        },
        resetSharedGroups: (state) => {
            state.sharedGroups = [...state.filteredGroups];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSharedGroups.pending, state => {
                state.status = 'pending';
            })
            .addCase(getAllSharedGroups.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroups = action.payload;
                state.filteredGroups = action.payload;
            })
            .addCase(getAllSharedGroups.rejected, state => {
                state.status = 'error';
            })

            .addCase(saveSharedGroup.pending, state => {
                state.status = 'pending';
            })
            .addCase(saveSharedGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroups.push(action.payload);
                state.filteredGroups.push(action.payload);
            })
            .addCase(saveSharedGroup.rejected, state => {
                state.status = 'error';
            })
            // getSharedGroup
            .addCase(getSharedGroup.pending, state => {
                state.status = 'pending';
            })
            .addCase(getSharedGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroup = action.payload;
            })
            .addCase(getSharedGroup.rejected, state => {
                state.status = 'error';
            })
    }
})

export const { filterSharedGroups, resetSharedGroups } = sharedGroupSlice.actions;
export const selectSharedGroup= (state) => state.sharedGroups.sharedGroups;
export { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup } from './sharedGroupThunk';
export const sharedGroupReducers = sharedGroupSlice.reducer;