import { DataStatus, type IDataStatus } from '@/common/enums/app/DataStatus';
import type { IResult, IStatistics } from '@/common/enums/types/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  getResultDetails,
  getResults,
  getResultsStatistics,
  saveResults,
} from './resultThunk';
import { v4 as uuidv4 } from 'uuid';

interface InitialState {
  results: IResult[];
  haveMoreResults: boolean;
  firstResult: Date | string;
  filteredResults: IResult[];
  statistics: IStatistics | null;
  result: IResult | null;
  isLoading: boolean;
  error: string | null;
  status: IDataStatus;
}

const initialState: InitialState = {
  results: [],
  haveMoreResults: false,
  firstResult: '',
  filteredResults: [],
  statistics: null,
  result: null,
  isLoading: false,
  error: null,
  status: DataStatus.IDLE,
};

const resultSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    addStateResult: (state, action) => {
      const newResult = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
      };
      state.results.push(newResult);
    },
    filterResults: (state, action) => {
      state.results = state.filteredResults.filter((item) =>
        item.title.startsWith(action.payload),
      );
    },
    sortResults: (
      state,
      action: PayloadAction<{ key: keyof IResult; direction: 'asc' | 'desc' }>,
    ) => {
      const { key = 'completionTime', direction = 'asc' } = action.payload;
      state.results = [...state.results].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (!aValue || !bValue) {
          return 0;
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    },
    resetResults: (state) => {
      state.results = [...state.filteredResults];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveResults.pending, (state) => {
        state.status = DataStatus.PENDING;
        state.isLoading = true;
      })
      .addCase(saveResults.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.results.push(action.payload);
        state.filteredResults.push(action.payload);
        state.isLoading = false;
      })
      .addCase(saveResults.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.isLoading = false;
      })
      .addCase(getResults.pending, (state) => {
        state.status = DataStatus.PENDING;
        state.isLoading = true;
      })
      .addCase(getResults.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        const { results, haveMoreResults, replace, firstResult } =
          action.payload;
        state.results = replace ? results : [...state.results, ...results];
        state.filteredResults = replace
          ? results
          : [...state.results, ...results];
        state.haveMoreResults = haveMoreResults;
        state.firstResult = firstResult;

        state.isLoading = false;
      })
      .addCase(getResults.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.isLoading = false;
      })
      .addCase(getResultDetails.pending, (state) => {
        state.status = DataStatus.PENDING;
        state.isLoading = true;
      })
      .addCase(getResultDetails.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.result = action.payload;
        state.isLoading = false;
      })
      .addCase(getResultDetails.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.isLoading = false;
      })

      .addCase(getResultsStatistics.pending, (state) => {
        state.status = DataStatus.PENDING;
        state.isLoading = true;
      })
      .addCase(getResultsStatistics.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.statistics = action.payload;
        state.isLoading = false;
      })
      .addCase(getResultsStatistics.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.isLoading = false;
      });
  },
});

export const { addStateResult, filterResults, sortResults, resetResults } =
  resultSlice.actions;
export const selectResult = (state: RootState) => state.results;
export {
  saveResults,
  getResults,
  getResultDetails,
  getResultsStatistics,
} from './resultThunk';
export const resultReducers = resultSlice.reducer;
