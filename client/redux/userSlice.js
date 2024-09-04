import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../utils/createAuthorizedInstance";
import axios from "axios";

export const login = createAsyncThunk(
    'user/login', async (data) => {
        const response = await axios.post(`${process.env.URL}/users/login`, data);
        return response.data
    }
)

export const register = createAsyncThunk(
    'user/register', async (data) => {
        const response = await axios.post('${process.env.URL}/users/register', data);
        return response.data
    }
)

export const getUser = createAsyncThunk(
    'user/get', async (data) => {
        console.log(data)
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/users', data);
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

            .addCase(register.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'success'
                state.users.push(action.payload);
            })
            .addCase(register.rejected, (state) => {
                state.status = 'rejects'
            })

            .addCase(getUser.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'success'
                state.users = action.payload;
            })
            .addCase(getUser.rejected, (state) => {
                state.status = 'rejects'
            })
    }
});

export const { addUser } = userSlice.actions;

export const selectUser = (state) => state.user.users;

export const userReducers = userSlice.reducer;
