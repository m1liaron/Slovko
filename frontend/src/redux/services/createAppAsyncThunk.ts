import type { AsyncThunkConfig } from '@reduxjs/toolkit';
import {
  createAsyncThunk,
  type AsyncThunkPayloadCreator,
} from '@reduxjs/toolkit';

import type { RootState, AppDispatch } from '../store';

const createAppAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<
    Returned,
    ThunkArg,
    {
      dispatch: AppDispatch;
      state: RootState;
      rejectValue: { message: string };
    }
  >,
) =>
  createAsyncThunk(typePrefix, payloadCreator, {
    condition: (arg, { getState }) => {
      const { isConnected } = getState().network;
      const { token, isAuthenticated } = getState().user;

      // block from even running logic
      if (!isConnected) return false;
      if (!token && !isAuthenticated) return false;

      return true;
    },
  });

const createAuthAppAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  requestFn: (arg: ThunkArg) => Promise<Returned>,
) => {
  return createAsyncThunk<Returned, ThunkArg, AsyncThunkConfig>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        const data = await requestFn(arg);
        return data;
      } catch (err: any) {
        const status = err?.response?.status ?? 500;
        return rejectWithValue({
          message: err?.response?.data?.message,
          status,
        });
      }
    },
  );
};

export { createAppAsyncThunk, createAuthAppAsyncThunk };
