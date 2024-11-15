import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../utils/createAuthorizedInstance";


export const getAllSharedGroups = createAsyncThunk(
    'sharedGroup/getAll', async () => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/sharedGroups');
        return response.data
    }
)

export const saveSharedGroup = createAsyncThunk(
    'sharedGroup/save', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post(`/sharedGroups`, data);
        return response.data
    }
)

export const getSharedGroup = createAsyncThunk(
    'sharedGroup/get', async (id) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/sharedGroups/${id}`);
        return response.data
    }
)

export const copySharedGroup = createAsyncThunk(
    'sharedGroup/copy', async (sharedGroupId) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post(`/sharedGroups/${sharedGroupId}`);
        return response.data
    }
)

const sharedGroupSlice = createSlice({
    name:'sharedGroup',
    initialState: {
        sharedGroups: [],
        sharedGroup: {},
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSharedGroups.pending, state => {
                state.status = 'pending';
            })
            .addCase(getAllSharedGroups.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroups = action.payload;
            })
            .addCase(getAllSharedGroups.rejected, state => {
                state.status = 'error';
            })

            .addCase(saveSharedGroup.pending, state => {
                state.status = 'pending';
            })
            .addCase(saveSharedGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroups.push(action.payload);
            })
            .addCase(saveSharedGroup.rejected, state => {
                state.status = 'error';
            })
            // getSharedGroup
            .addCase(getSharedGroup.pending, state => {
                state.status = 'pending';
            })
            .addCase(getSharedGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.sharedGroup = action.payload;
            })
            .addCase(getSharedGroup.rejected, state => {
                state.status = 'error';
            })
    }
})

export const selectSharedGroup= (state) => state.sharedGroups.sharedGroups;
export const sharedGroupReducers = sharedGroupSlice.reducer;