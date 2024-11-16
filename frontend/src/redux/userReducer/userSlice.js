import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    register,
    getUser
} from './userThunk';
import {DataStatus} from "../../common/enums/app/app";

const initialState = {
    user: {},
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
    }
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export { login, register, getUser } from './userThunk';
export const userReducers = userSlice.reducer;
