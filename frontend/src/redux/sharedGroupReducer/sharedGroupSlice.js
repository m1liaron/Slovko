import { createSlice } from "@reduxjs/toolkit";
import { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup, removeSharedGroup } from './sharedGroupThunk';
import { DataStatus } from "../../common/enums/app/DataStatus";

const sharedGroupSlice = createSlice({
    name:'sharedGroup',
    initialState: {
        sharedGroups: [],
        sharedGroup: {},
        status:DataStatus.IDLE,
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSharedGroups.pending, state => {
                state.status = DataStatus.PENDING;
            })
            .addCase(getAllSharedGroups.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.sharedGroups = action.payload;
            })
            .addCase(getAllSharedGroups.rejected, state => {
                state.status = DataStatus.ERROR;
            })

            .addCase(saveSharedGroup.pending, state => {
                state.status = DataStatus.PENDING;
            })
            .addCase(saveSharedGroup.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.sharedGroups.push(action.payload);
            })
            .addCase(saveSharedGroup.rejected, state => {
                state.status = DataStatus.ERROR;
            })
            // getSharedGroup
            .addCase(getSharedGroup.pending, state => {
                state.status = DataStatus.PENDING;
            })
            .addCase(getSharedGroup.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.sharedGroup = action.payload;
            })
            .addCase(getSharedGroup.rejected, state => {
                state.status = DataStatus.ERROR;
            })
            // removeSharedGroup
            .addCase(removeSharedGroup.pending, state => {
                state.status = DataStatus.PENDING;
            })
            .addCase(removeSharedGroup.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS;
                state.sharedGroups = state.sharedGroups.filter(group => group.id !== action.payload);
            })
            .addCase(removeSharedGroup.rejected, state => {
                state.status = DataStatus.ERROR;
            })
    }
})

export const selectSharedGroup= (state) => state.sharedGroups.sharedGroups;
export { getAllSharedGroups, saveSharedGroup, getSharedGroup, copySharedGroup, removeSharedGroup } from './sharedGroupThunk';
export const sharedGroupReducers = sharedGroupSlice.reducer;