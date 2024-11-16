import { createSlice } from "@reduxjs/toolkit";
import { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup } from './sharedGroupThunk';

const sharedGroupSlice = createSlice({
    name:'sharedGroup',
    initialState: {
        sharedGroups: [],
        sharedGroup: {},
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSharedGroups.pending, state => {
                state.status = 'pending';
            })
            .addCase(getAllSharedGroups.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroups = action.payload;
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

export const selectSharedGroup= (state) => state.sharedGroups.sharedGroups;
export { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup } from './sharedGroupThunk';
export const sharedGroupReducers = sharedGroupSlice.reducer;