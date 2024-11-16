import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    register,
    getUser
} from './userThunk';

const initialState = {
    user: {},
    isAuthenticated: false,
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
                state.status = 'pending'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'success'
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state) => {
                state.status = 'rejects'
                state.isAuthenticated = false;
            })

            .addCase(register.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'success'
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state) => {
                state.status = 'rejects'
                state.isAuthenticated = false;
            })

            .addCase(getUser.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'success'
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getUser.rejected, (state) => {
                state.status = 'rejects';
                state.isAuthenticated = false;
            })
    }
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;
export const userReducers = userSlice.reducer;
