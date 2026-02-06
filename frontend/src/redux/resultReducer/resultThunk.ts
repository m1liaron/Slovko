import type { SaveResultsRequest } from '@/common/enums/types/result.type';

import { createAuthorizedInstance } from '../../utils/createAuthorizedInstance';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';

export const saveResults = createAppAsyncThunk(
  'results/save',
  async (data: SaveResultsRequest) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post('/results', data);
    return response.data;
  },
);

export const getResults = createAppAsyncThunk(
  'results/get',
  async (data: {
    month: number;
    year: number;
    page: number;
    replace: boolean;
  }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(
      `/results?page=${data.page}&month=${data.month}&year=${data.year}`,
    );
    return { ...response.data, replace: data.replace };
  },
);

export const getResultDetails = createAppAsyncThunk(
  'resultDetails/get',
  async ({ resultId }: { resultId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(`/results/${resultId}`);
    return response.data;
  },
);

export const getResultsStatistics = createAppAsyncThunk(
  'resultsDetails/get',
  async () => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get('/results/statistics');
    return response.data;
  },
);
