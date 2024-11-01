import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../utils/createAuthorizedInstance";

export const saveResults = createAsyncThunk(
    'results/save', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post(`/results`, data);
        return response.data
    }
)

export const getResults = createAsyncThunk(
    'results/get', async () => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/results`);
        return response.data
    }
)

export const getResultDetails = createAsyncThunk(
    'resultDetails/get', async (id) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/results/${id}`);
        return response.data
    }
)

const initialState = {
    results: [],
    result: {},
    isLoading: false,
    error: null,
    status: 'ide'
}

const resultSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {
        filter: (state, action) => {
            state.results = state.results.filter(item => item.startsWith(action.payload));
        },
        sort: (state, action) => {
            state.results = state.results.sort((a, b) => a[action.payload] - b[action.payload]);
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
                state.results .push(action.payload)
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
    }
});

export const selectResult = (state) => state.results;
export const resultReducers = resultSlice.reducer;
