import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const login = createAsyncThunk(
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
    }
});

export const { addUser } = userSlice.actions;

export const selectUser = (state) => state.user.users;

export const userReducers = userSlice.reducer;
