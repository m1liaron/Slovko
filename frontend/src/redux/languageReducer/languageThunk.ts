import { createAuthorizedInstance } from '@/utils';

import { createAppAsyncThunk } from '../services/createAppAsyncThunk';

export const getLanguages = createAppAsyncThunk(
  'card/get-languages',
  async () => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(`/languages`);
    return response.data;
  },
);
