import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    register,
    getUser,
    updateUser,
    updateUserStreak,
    buyFreeze,
    getUserStreakDates
} from './userThunk';
import {DataStatus} from "../../common/enums/app/app";

const initialState = {
    user: {},
    streakDates: {},
    isAuthenticated: false,
    status: DataStatus.IDLE
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {};
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state) => {
                state.status = DataStatus.ERROR
                state.isAuthenticated = false;
            })

            .addCase(register.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state) => {
                state.status = DataStatus.ERROR
                state.isAuthenticated = false;
            })

            .addCase(getUser.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getUser.rejected, (state) => {
                state.status = DataStatus.ERROR
                state.isAuthenticated = false;
            })

            .addCase(updateUser.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(updateUser.rejected, (state) => {
                state.status = DataStatus.ERROR
                state.isAuthenticated = false;
            })
            // update user streak
            .addCase(updateUserStreak.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(updateUserStreak.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
            })
            .addCase(updateUserStreak.rejected, (state) => {
                state.status = DataStatus.ERROR
            })
            // buy freeze and update streak
            .addCase(buyFreeze.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(buyFreeze.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.user = action.payload;
            })
            .addCase(buyFreeze.rejected, (state) => {
                state.status = DataStatus.ERROR
            })
            // get Streak Dates
            .addCase(getUserStreakDates.pending, (state) => {
                state.status = DataStatus.PENDING
            })
            .addCase(getUserStreakDates.fulfilled, (state, action) => {
                state.status = DataStatus.SUCCESS
                state.streakDates = action.payload;
            })
            .addCase(getUserStreakDates.rejected, (state) => {
                state.status = DataStatus.ERROR
            })
    }
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export { login, register, getUser, updateUserStreak } from './userThunk';
export const userReducers = userSlice.reducer;
