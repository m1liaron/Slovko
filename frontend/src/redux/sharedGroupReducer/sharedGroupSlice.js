import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../common/enums/app/DataStatus";
import {
	copySharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	removeSharedGroup,
	saveSharedGroup,
} from "./sharedGroupThunk";

const sharedGroupSlice = createSlice({
	name: "sharedGroup",
	initialState: {
		sharedGroups: [],
		haveMoreGroups: [],
		filteredGroups: [],
		sharedGroup: {},
		status: DataStatus.IDLE,
		error: null,
	},
	reducers: {
		filterSharedGroups: (state, action) => {
			state.sharedGroups = state.filteredGroups.filter((item) =>
				item.title.startsWith(action.payload),
			);
		},
		filterMySharedGroups: (state, action) => {
			state.sharedGroups = state.filteredGroups.filter(
				(item) => item.userId === action.payload.userId,
			);
		},
		resetSharedGroups: (state) => {
			state.sharedGroups = [...state.filteredGroups];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllSharedGroups.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getAllSharedGroups.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroups = action.payload.sharedGroups;
				state.filteredGroups = action.payload.sharedGroups;
				state.haveMoreGroups = action.payload.haveMoreSharedGroups;
			})
			.addCase(getAllSharedGroups.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})

			.addCase(saveSharedGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(saveSharedGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroups.push(action.payload);
				state.filteredGroups.push(action.payload);
			})
			.addCase(saveSharedGroup.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.error = action.payload;
				console.log(action)
			})
			// getSharedGroup
			.addCase(getSharedGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getSharedGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroup = action.payload;
			})
			.addCase(getSharedGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// removeSharedGroup
			.addCase(removeSharedGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(removeSharedGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroups = state.sharedGroups.filter(
					(group) => group.id !== action.payload,
				);
			})
			.addCase(removeSharedGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			});
	},
});

export const { filterSharedGroups, resetSharedGroups, filterMySharedGroups } =
	sharedGroupSlice.actions;
export const selectSharedGroup = (state) => state.sharedGroups.sharedGroups;
export {
	getAllSharedGroups,
	saveSharedGroup,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} from "./sharedGroupThunk";
export const sharedGroupReducers = sharedGroupSlice.reducer;
