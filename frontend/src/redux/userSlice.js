import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../utils/createAuthorizedInstance";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = createAsyncThunk(
    'user/login', async (data) => {
        const response = await axios.post(`http://192.168.31.196:3000/users/login`, data);
        await AsyncStorage.setItem('token', response.data.token)
        return response.data
    }
)

export const register = createAsyncThunk(
    'user/register', async (data) => {
        const response = await axios.post(`http://192.168.31.196:3000/users/register`, data);
        await AsyncStorage.setItem('token', response.data.token)
        return response.data
    }
)

export const getUser = createAsyncThunk(
    'user/get', async () => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/users');
        return response.data.user
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: []
    },
    reducers: {},
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
export const selectUser = (state) => state.user.users;
export const userReducers = userSlice.reducer;
