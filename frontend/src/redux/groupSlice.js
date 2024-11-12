import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../utils/createAuthorizedInstance";


export const getAllGroups = createAsyncThunk(
    'group/getAll', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/groups', data);
        return response.data
    }
)

export const addGroup = createAsyncThunk(
    'group/add', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.post('/groups', data);
        return response.data
    }
)

export const getGroup = createAsyncThunk(
    'group/get', async (id) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get(`/groups/${id}`);
        return response.data;
    }
)

export const removeGroup = createAsyncThunk(
    'group/remove', async (id) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.delete(`/groups/${id}`);
        return response.data
    }
)

const groupSlice = createSlice({
    name:'groups',
    initialState: {
        groups: [],
        group: {},
        status:'idle',
        error: null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(getAllGroups.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getAllGroups.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups = action.payload;
            })
            .addCase(getAllGroups.rejected, (state) => {
                state.status = 'rejected';
            })

            .addCase(addGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups.push(action.payload);
            })
            .addCase(addGroup.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(getGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(getGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.group = action.payload;
            })
            .addCase(getGroup.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups = state.groups.filter(group => group.id !== action.payload.id);
            })
            .addCase(removeGroup.rejected, (state) => {
                state.status = 'rejected';
            })
    }
})

export const selectGroup= (state) => state.groups.groups;

export const groupReducers = groupSlice.reducer;