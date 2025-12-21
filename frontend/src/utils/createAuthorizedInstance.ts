import axios, { InternalAxiosRequestConfig, type AxiosInstance } from 'axios';

import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import { SERVER_API_URL } from '@/common/enums/constants/server-api';
import { triggerUnauthorized } from '@/redux/services/authEvents';
import { getStorageItem } from '@/utils/storage';
import { store } from '@/redux/store';
import { HAS_TOKEN } from './storage/initToken';

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
      timeout: 150000,
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          triggerUnauthorized();
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

export const createAxiosInstance = async (): Promise<AxiosInstance> => {
  try {
    const instance = axios.create({
      baseURL: SERVER_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return instance;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};
