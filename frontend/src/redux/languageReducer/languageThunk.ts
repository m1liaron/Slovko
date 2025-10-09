import { createAuthorizedInstance } from '@/utils';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getLanguages = createAsyncThunk('card/get-languages', async () => {
  const axiosInstance = await createAuthorizedInstance();
  const response = await axiosInstance.get(`/languages`);
  return response.data;
});
