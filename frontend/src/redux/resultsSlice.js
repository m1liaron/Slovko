import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthorizedInstance } from "../utils/createAuthorizedInstance";

export const saveResults = createAsyncThunk(
    'user/login', async (data) => {
        const axiosInstance = createAuthorizedInstance();
        const response = await axiosInstance.post(`/results`, data);
        return response.data
    }
)

const initialState = {
    results: [],
    isLoading: false,
    error: null,
    status: 'ide'
}

const resultSlice = createSlice({
    name: 'results',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveResults.pending, (state, action) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(saveResults.fulfilled, (state, action) => {
                state.status = 'success';
                state.results = action.payload;
                state.isLoading = false;
            })
            .addCase(saveResults.rejected, (state, action) => {
                state.status = 'error';
                state.isLoading = false;
            })
    }
});

export const selectResult = (state) => state.results;
export const resultReducers = resultSlice.reducer;
