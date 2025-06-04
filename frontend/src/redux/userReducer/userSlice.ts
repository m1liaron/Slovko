import type { IStreakDate, IUser } from "@/common/enums/types/user.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { DataStatus, type IDataStatus } from "../../common/enums/app/app";
import {
	buyFreeze,
	getUser,
	getUserStreakDates,
	login,
	register,
	updateUser,
	updateUserStreak,
} from "./userThunk";

interface InitialState {
	user: IUser | null;
	streakDates: IStreakDate[];
	isAuthenticated: boolean;
	status: IDataStatus;
	message: string
}

const initialState: InitialState = {
	user: null,
	streakDates: [],
	isAuthenticated: false,
	status: DataStatus.IDLE,
	message: ""
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			AsyncStorage.removeItem("token");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, (state) => {
				state.status = DataStatus.ERROR;
				state.isAuthenticated = false;
			})

			.addCase(register.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(register.rejected, (state) => {
				state.status = DataStatus.ERROR;
				state.isAuthenticated = false;
			})

			.addCase(getUser.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.status = DataStatus.ERROR;
				state.isAuthenticated = false;
				if (action.payload) {
					state.message = action.payload.toString();
				}
			})

			.addCase(updateUser.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(updateUser.rejected, (state) => {
				state.status = DataStatus.ERROR;
				state.isAuthenticated = false;
			})
			// update user streak
			.addCase(updateUserStreak.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(updateUserStreak.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
			})
			.addCase(updateUserStreak.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// buy freeze and update streak
			.addCase(buyFreeze.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(buyFreeze.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.user = action.payload;
			})
			.addCase(buyFreeze.rejected, (state) => {
				state.status = DataStatus.ERROR;
			})
			// get Streak Dates
			.addCase(getUserStreakDates.pending, (state) => {
				state.status = DataStatus.PENDING;
			})
			.addCase(getUserStreakDates.fulfilled, (state, action) => {
				state.status = DataStatus.SUCCESS;
				state.streakDates = action.payload;
			})
			.addCase(getUserStreakDates.rejected, (state) => {
				state.status = DataStatus.ERROR;
			});
	},
});

export const { logout } = userSlice.actions;
export const selectUser = (state: { user: InitialState }) => state.user;
export { login, register, getUser, updateUserStreak } from "./userThunk";
export const userReducers = userSlice.reducer;
