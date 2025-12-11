import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import type { RejectedPayload } from '@/common/enums/types/rejectedAction';
import type { IStreakDate, IUser } from '@/common/enums/types/user.type';
import { removeStorageItem } from '@/utils/storage';

import {
  AsyncStorageVariables,
  DataStatus,
  type IDataStatus,
} from '../../common/enums/app/app';

import {
  buyFreeze,
  getUser,
  getUserStreakDates,
  login,
  register,
  updateUser,
  updateUserStreak,
} from './userThunk';

interface InitialState {
  user: IUser | null;
  token: string | null;
  streakDates: IStreakDate[];
  isAuthenticated: boolean;
  status: IDataStatus;
  codeStatus: number;
  isLoading: boolean;
  message: string;
}

const initialState: InitialState = {
  user: null,
  token: null,
  streakDates: [],
  isAuthenticated: false,
  status: DataStatus.IDLE,
  isLoading: false,
  codeStatus: 0,
  message: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.streakDates = [];
      state.message = '';
      state.status = DataStatus.IDLE;
      state.token = null;
      removeStorageItem(AsyncStorageVariables.TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.user.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.user.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state) => {
        state.isAuthenticated = false;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        if (action.payload) {
          state.message = action.payload.toString();
        }
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isAuthenticated = false;
      })
      // update user streak
      .addCase(updateUserStreak.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // buy freeze and update streak
      .addCase(buyFreeze.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // get Streak Dates
      .addCase(getUserStreakDates.fulfilled, (state, action) => {
        state.streakDates = action.payload;
      })

      .addMatcher(isPending, (state) => {
        state.status = DataStatus.PENDING;
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = DataStatus.SUCCESS;
        state.isLoading = false;
      })
      .addMatcher(isRejected, (state, action) => {
        const payload = action.payload as RejectedPayload;
        state.status = DataStatus.ERROR;
        state.isLoading = false;
        state.codeStatus = payload?.status;
        state.message = payload?.message;
      });
  },
});

export const { logout } = userSlice.actions;
export const selectUser = (state: { user: InitialState }) => state.user;
export { login, register, getUser, updateUserStreak } from './userThunk';
export const userReducers = userSlice.reducer;
