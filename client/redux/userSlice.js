import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
    'user/login', async (data) => {
        const response = await axios.post('http://localhost:3000/users/login', data);
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: []
    },
    reducers: {
        addUser: (state, action) => {
            state.users = [...state.users, action.payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'success'
                state.users.push(action.payload);
            })
            .addCase(login.rejected, (state) => {
                state.status = 'rejects'
            })
    }
});

export const { addUser } = userSlice.actions;

export const selectUser = (state) => state.user.users;

export const userReducers = userSlice.reducer;
