import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAuthorizedInstance} from "../../utils/createAuthorizedInstance";
const url = 'http://192.168.31.196:3000';

export const login = createAsyncThunk(
    'user/login', async (data) => {
        const response = await axios.post(`${url}/users/login`, data);
        await AsyncStorage.setItem('token', response.data.token)
        return response.data
    }
)

export const register = createAsyncThunk(
    'user/register', async (data) => {
        const response = await axios.post(`${url}/users/register`, data);
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

export const updateUser = createAsyncThunk(
    'user/update', async ({id, data}) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.put(`/users/${id}`, data);
        return response.data
    }
)

export const updateUserStreak = createAsyncThunk(
    'user/updateUserStreak', async () => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.patch(`/users/streak`);
        return response.data
    }
)

export const buyFreeze = createAsyncThunk(
    'user/buyFreeze', async ({ froze }) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.put(`/users/streak/froze`, { froze });
        return response.data
    }
)

export const getUserStreakDates = createAsyncThunk(
    'user/getStreakDates', async () => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/users/streak');
        return response.data
    }
)