import type { IGroup } from "@/common/enums/types/group.type";
import {
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from "@reduxjs/toolkit";
import {
	DataStatus,
	type IDataStatus,
} from "../../common/enums/app/DataStatus";
import { copySharedGroup } from "../sharedGroupReducer/sharedGroupThunk";
import type { RootState } from "../store";
import {
	addGroup,
	getAllGroups,
	getGroup,
	removeGroup,
	updateGroup,
} from "./groupThunk";

interface InitialState {
	groups: IGroup[];
	group: IGroup | null;
	status: IDataStatus;
	error: string | null;
	isLoading: boolean;
}

const initialState: InitialState = {
	groups: [],
	group: null,
	status: DataStatus.IDLE,
	error: null,
	isLoading: false,
};

const groupSlice = createSlice({
	name: "groups",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllGroups.fulfilled, (state, action) => {
				state.groups = action.payload;
			})
			.addCase(addGroup.fulfilled, (state, action) => {
				state.groups.push(action.payload);
			})
			.addCase(getGroup.fulfilled, (state, action) => {
				state.group = action.payload;
			})
			.addCase(removeGroup.fulfilled, (state, action) => {
				state.groups = state.groups.filter(
					(group) => group.id !== action.payload.id,
				);
			})
			// update
			.addCase(updateGroup.fulfilled, (state, action) => {
				state.error = null;
				const updatedGroup = action.payload;
				const index = state.groups.findIndex(
					(group) => group.id === updatedGroup.id,
				);
				if (index !== -1) {
					state.groups[index] = updatedGroup;
					state.group = updatedGroup;
					state.groups = [...state.groups];
				}
			})
			.addMatcher(isPending, (state) => {
				state.status = DataStatus.PENDING;
				state.isLoading = true;
			})
			.addMatcher(isFulfilled, (state) => {
				state.status = DataStatus.SUCCESS;
				state.isLoading = false;
			})
			.addMatcher(isRejected, (state) => {
				state.status = DataStatus.ERROR;
				state.isLoading = false;
			});
	},
});

export const selectGroup = (state: RootState) => state.groups.groups;
export {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
} from "./groupThunk";
export const groupReducers = groupSlice.reducer;
