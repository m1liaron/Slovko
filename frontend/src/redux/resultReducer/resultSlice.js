import { createSlice } from "@reduxjs/toolkit";
import { saveResults, getResults, getResultDetails, getResultsDetails } from './resultThunk';

const initialState = {
    results: [],
    filteredResults: [],
    result: {},
    isLoading: false,
    error: null,
    status: 'ide'
}

const resultSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        filterResults: (state, action) => {
            state.results = state.filteredResults.filter(item => item.title.startsWith(action.payload));
        },
        sortResults: (state, action) => {
            const { key, direction } = action.payload;
            state.results = [...state.results].sort((a, b) => {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        },
        resetResults: (state) => {
            state.results = [...state.filteredResults];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveResults.pending, (state, action) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(saveResults.fulfilled, (state, action) => {
                state.status = 'success';
                state.results.push(action.payload)
                state.filteredResults.push(action.payload)
                state.isLoading = false;
            })
            .addCase(saveResults.rejected, (state, action) => {
                state.status = 'error';
                state.isLoading = false;
            })
            .addCase(getResults.pending, (state, action) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(getResults.fulfilled, (state, action) => {
                state.status = 'success';
                state.results = action.payload;
                state.filteredResults = action.payload;
                state.isLoading = false;
            })
            .addCase(getResults.rejected, (state, action) => {
                state.status = 'error';
                state.isLoading = false;
            })
            .addCase(getResultDetails.pending, (state, action) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(getResultDetails.fulfilled, (state, action) => {
                state.status = 'success';
                state.result = action.payload;
                state.isLoading = false;
            })
            .addCase(getResultDetails.rejected, (state, action) => {
                state.status = 'error';
                state.isLoading = false;
            })

            .addCase(getResultsDetails.pending, (state, action) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(getResultsDetails.fulfilled, (state, action) => {
                state.status = 'success';
                state.results = action.payload;
                state.isLoading = false;
            })
            .addCase(getResultsDetails.rejected, (state, action) => {
                state.status = 'error';
                state.isLoading = false;
            })
    }
});

export const { filterResults, sortResults, resetResults } = resultSlice.actions;
export const selectResult = (state) => state.results;
export { saveResults, getResults, getResultDetails } from './resultThunk';
export const resultReducers = resultSlice.reducer;
