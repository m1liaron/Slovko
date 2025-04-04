import { createSlice } from "@reduxjs/toolkit";
import {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
} from "./groupThunk";
import { DataStatus, type IDataStatus } from "../../common/enums/app/DataStatus";
import { IGroup } from "@/common/enums/types/group.type";

interface InitialState {
	groups: IGroup[];
	group: IGroup | null;
	status: IDataStatus;
	error: string | null;
}

const initialState: InitialState = {
	groups: [],
	group: null,
	status: DataStatus.IDLE,
	error: null,
};

const groupSlice = createSlice({
	name: "groups",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllGroups.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getAllGroups.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.groups = action.payload;
			})
			.addCase(getAllGroups.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})

			.addCase(addGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(addGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.groups.push(action.payload);
			})
			.addCase(addGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			.addCase(getGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.group = action.payload;
			})
			.addCase(getGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			.addCase(removeGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(removeGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.groups = state.groups.filter(
					(group) => group.id !== action.payload.id,
				);
			})
			.addCase(removeGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// update
			.addCase(updateGroup.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(updateGroup.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
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
			.addCase(updateGroup.rejected, (state) => {
				state.status = DataStatus.ERROR;
			});
	},
});

export const selectGroup = (state: { groups: { groups: InitialState } }) => state.groups.groups;
export {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
} from "./groupThunk";
export const groupReducers = groupSlice.reducer;
