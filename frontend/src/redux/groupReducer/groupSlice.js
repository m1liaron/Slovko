import { createSlice} from "@reduxjs/toolkit";
import {
    getAllGroups,
    getGroup,
    addGroup,
    removeGroup
} from './groupThunk';


const groupSlice = createSlice({
    name:'groups',
    initialState: {
        groups: [],
        group: {},
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getAllGroups.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getAllGroups.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups = action.payload;
            })
            .addCase(getAllGroups.rejected, (state) => {
                state.status = 'rejected';
            })

            .addCase(addGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups.push(action.payload);
            })
            .addCase(addGroup.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(getGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.group = action.payload;
            })
            .addCase(getGroup.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups = state.groups.filter(group => group.id !== action.payload.id);
            })
            .addCase(removeGroup.rejected, (state) => {
                state.status = 'rejected';
            })
    }
})

export const selectGroup= (state) => state.groups.groups;
export { getAllGroups, getGroup, addGroup, removeGroup } from './groupThunk';
export const groupReducers = groupSlice.reducer;