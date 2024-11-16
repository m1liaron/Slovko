import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAuthorizedInstance} from "../../utils/createAuthorizedInstance";

export const login = createAsyncThunk(
    'user/login', async (data) => {
        const response = await axios.post(`http://localhost:3000/users/login`, data);
        await AsyncStorage.setItem('token', response.data.token)
        return response.data
    }
)

export const register = createAsyncThunk(
    'user/register', async (data) => {
        const response = await axios.post(`http://localhost:30000/users/register`, data);
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


export {
    login,
    register,
    getUser
}