import { SERVER_API_URL } from '@/common/enums/constants/server-api';
import { logout } from '@/redux/userReducer/userSlice';
import axios, { type AxiosInstance } from 'axios';
import { getStorageItem } from '@/utils/storage';
import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';

/**
 * Creates an authorized Axios instance with a Bearer token.
 * @returns {Promise<AxiosInstance>} A Promise that resolves to an Axios instance with auth headers.
 */
export const createAuthorizedInstance = async (): Promise<AxiosInstance> => {
  try {
    const token = await getStorageItem(AsyncStorageVariables.TOKEN);

    const instance = axios.create({
      baseURL: SERVER_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      },
    );

    return instance;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};
