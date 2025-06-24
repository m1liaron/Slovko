import type { ISharedGroup } from "@/common/enums/types/sharedGroup";
import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import {
	DataStatus,
	type IDataStatus,
} from "../../common/enums/app/DataStatus";
import type { RootState } from "../store";
import {
	getAllSharedGroups,
	getSharedGroup,
	removeSharedGroup,
	addSharedGroup,
} from "./sharedGroupThunk";
import { v4 as uuid } from "uuid";

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
		addStateSharedGroup: (state, action) => {
			const newSharedGroup = {
				id: action.payload.tempd,
				...action.payload.group
			}
			state.sharedGroups.push(newSharedGroup);	
		},
		filterSharedGroups: (state, action) => {
			state.sharedGroups = state.sharedGroups.filter((item) =>
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
				state.isLoading = true;
			})
			.addCase(getAllSharedGroups.fulfilled, (state, action) => {
				if (action.payload.sharedGroups.length > 0) {
					const combined = [
						...state.sharedGroups,
						...action.payload.sharedGroups,
					];

					// ✅ Deduplicate by ID
					const map = new Map<string, ISharedGroup>();
					for (const group of combined) {
						map.set(group.id, group); // Last one wins (latest from backend)
					}

					const deduped = Array.from(map.values());

					state.sharedGroups = deduped;
					state.filteredGroups = deduped;
					state.haveMoreSharedGroups = action.payload.haveMoreSharedGroups;
				}
			})
			.addCase(addSharedGroup.fulfilled, (state, action) => {
				const { tempId, group } = action.payload;
				if (tempId) {
					state.sharedGroups = state.sharedGroups.filter(group => group.id !== tempId);
					state.sharedGroups.push(group)
				}
			})
			.addCase(getSharedGroup.fulfilled, (state, action) => {
				state.sharedGroup = action.payload;
			})
			// removeSharedGroup
			.addCase(removeSharedGroup.fulfilled, (state, action) => {
				state.sharedGroups = state.sharedGroups.filter(
					(group) => group.id !== action.payload,
				);
			})
		
			.addMatcher(isPending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addMatcher(isFulfilled, (state) => {
				state.status = DataStatus.SUCCESS;
				state.error = null;
				state.isLoading = false;
			})
			.addMatcher(isRejected, (state) => {
				state.status = DataStatus.ERROR;
				state.isLoading = false;
			})
	},
});

export const { addStateSharedGroup, filterSharedGroups, resetSharedGroups, filterMySharedGroups } =
	sharedGroupSlice.actions;
export const selectSharedGroup = (state: RootState) =>
	state.sharedGroups.sharedGroups;
export {
	getAllSharedGroups,
	addSharedGroup,
	getSharedGroup,
	copySharedGroup,
	removeSharedGroup,
} from "./sharedGroupThunk";
export const sharedGroupReducers = sharedGroupSlice.reducer;
