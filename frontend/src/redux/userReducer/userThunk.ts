import AsyncStorage from '@react-native-async-storage/async-storage';

import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import type { IUpdateUser, RegisterUser } from '@/common/enums/types/types';

import {
  createAuthorizedInstance,
  createAxiosInstance,
} from '../../utils/createAuthorizedInstance';
import {
  createAppAsyncThunk,
  createAuthAppAsyncThunk,
} from '../services/createAppAsyncThunk';

const login = createAuthAppAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const axiosInstance = await createAxiosInstance();
    const response = await axiosInstance.post(`/users/login`, data);
    await AsyncStorage.setItem(
      AsyncStorageVariables.TOKEN,
      response.data.token,
    );
    return response.data;
  },
);

const register = createAppAsyncThunk(
  'user/register',
  async (data: RegisterUser) => {
    const axiosInstance = await createAxiosInstance();
    const response = await axiosInstance.post(`/users/register`, data);
    await AsyncStorage.setItem(
      AsyncStorageVariables.TOKEN,
      response.data.token,
    );
    return response.data;
  },
);

const getUser = createAppAsyncThunk('user/get', async () => {
  const axiosInstance = await createAuthorizedInstance();
  const response = await axiosInstance.get('/users');
  return response.data.user;
});

const updateUser = createAppAsyncThunk(
  'user/update',
  async ({ id, data }: { id: string; data: IUpdateUser }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  },
);

const updateUserStreak = createAppAsyncThunk(
  'user/updateUserStreak',
  async () => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.patch('/users/streak');
    return response.data;
  },
);

const buyFreeze = createAppAsyncThunk(
  'user/buyFreeze',
  async ({ froze }: { froze: number }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.put('/users/streak/froze', { froze });
    return response.data;
  },
);

const getUserStreakDates = createAppAsyncThunk(
  'user/getStreakDates',
  async ({ month, year }: { month: number; year: number }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(
      `/users/streak?month=${month}&year=${year}`,
    );
    return response.data;
  },
);

export {
  login,
  register,
  getUser,
  updateUser,
  updateUserStreak,
  buyFreeze,
  getUserStreakDates,
};
