import type { IGroup } from "@/common/enums/types/group.type";
import {
	type PayloadAction,
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import {
	DataStatus,
	type IDataStatus,
} from "../../common/enums/app/DataStatus";
import type { RootState } from "../store";
import {
	addGroup,
	getAllGroups,
	getGroup,
	getGroupStorage,
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

const handleUpdateGroup = (
	state: InitialState,
	action: PayloadAction<IGroup>,
) => {
	const updatedGroup: IGroup = action.payload;
	const index = state.groups.findIndex((group) => group.id === updatedGroup.id);
	if (index !== -1) {
		state.groups[index] = updatedGroup;
		state.groups = [...state.groups];
		state.group = updatedGroup;
	}
};

const groupSlice = createSlice({
	name: "groups",
	initialState,
	reducers: {
		addStateGroup: (state, action) => {
			const existinGroup = state.groups.find(
				(group) => group.title === action.payload.title,
			);
			if (existinGroup) {
				throw new Error("Group with this name already exist");
			}
			const newGroup = {
				id: uuid(),
				...action.payload,
			};
			state.groups.push(newGroup);
		},
		updateStateGroup: handleUpdateGroup,
		removeStateGroup: (state, action) => {
			state.groups = state.groups.filter(
				(group) => group.id !== action.payload,
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllGroups.fulfilled, (state, action) => {
				state.groups = action.payload;
				state.isLoading = true;
			})
			.addCase(addGroup.fulfilled, (state, action) => {
				state.groups.push(action.payload);
			})
			.addCase(getGroup.fulfilled, (state, action) => {
				state.group = action.payload;
			})
			.addCase(getGroupStorage.fulfilled, (state, action) => {
				if (action.payload) {
					state.group = action.payload;
					state.isLoading = true;
				}
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

export const { addStateGroup, updateStateGroup, removeStateGroup } =
	groupSlice.actions;
export const selectGroup = (state: RootState) => state.groups.groups;
export {
	getAllGroups,
	getGroup,
	addGroup,
	removeGroup,
	updateGroup,
} from "./groupThunk";
export const groupReducers = groupSlice.reducer;
