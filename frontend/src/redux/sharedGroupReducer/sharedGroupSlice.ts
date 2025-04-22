import type { ISharedGroup } from "@/common/enums/types/sharedGroup";
import { createSlice } from "@reduxjs/toolkit";
import {
	DataStatus,
	type IDataStatus,
} from "../../common/enums/app/DataStatus";
import type { RootState } from "../store";
import {
	copySharedGroup,
	getAllSharedGroups,
	getSharedGroup,
	removeSharedGroup,
	saveSharedGroup,
} from "./sharedGroupThunk";

interface InitialState {
	sharedGroups: ISharedGroup[];
	haveMoreSharedGroups: boolean;
	filteredGroups: ISharedGroup[];
	sharedGroup: ISharedGroup | null;
	status: IDataStatus;
	error: null;
	isLoading: boolean;
}

const initialState: InitialState = {
	sharedGroups: [],
	filteredGroups: [],
	haveMoreSharedGroups: false,
	sharedGroup: null,
	status: DataStatus.IDLE,
	error: null,
	isLoading: false,
};

const sharedGroupSlice = createSlice({
	name: "sharedGroup",
	initialState,
	reducers: {
		filterSharedGroups: (state, action) => {
			state.sharedGroups = state.filteredGroups.filter((item) =>
				item.title.startsWith(action.payload),
			);
		},
		filterMySharedGroups: (state, action) => {
			state.sharedGroups = [...state.sharedGroups].filter(
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
				state.isLoading = true;
			})
			.addCase(getAllSharedGroups.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroups = [
					...state.sharedGroups,
					...action.payload.sharedGroups,
				];
				state.filteredGroups = [
					...state.sharedGroups,
					...action.payload.sharedGroups,
				];
				state.haveMoreSharedGroups = action.payload.haveMoreSharedGroups;
				state.isLoading = false;
			})
			.addCase(getAllSharedGroups.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})

			.addCase(saveSharedGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(saveSharedGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.sharedGroups = [...state.sharedGroups, action.payload];
				state.filteredGroups = [...state.sharedGroups, action.payload];
			})
			.addCase(saveSharedGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
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
export const selectSharedGroup = (state: RootState) =>
	state.sharedGroups.sharedGroups;
export {
	getAllSharedGroups,
	saveSharedGroup,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} from "./sharedGroupThunk";
export const sharedGroupReducers = sharedGroupSlice.reducer;
