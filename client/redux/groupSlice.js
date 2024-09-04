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

export const removeGroup = createAsyncThunk(
    'group/remove', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.delete('/groups', data);
        return response.data
    }
)

const groupSlice = createSlice({
    name:'groups',
    initialState: {
        groups: [
            {id: 1, title: 'First Group'},
            {id: 2, title: 'Second Group'},
            {id: 3, title: 'Third Group'},
            {id: 4, title: 'Fourth Group'},
            {id: 5, title: 'Fifth Group'},
        ],
        status:'idle',
        error: null
    },
    reducers:{
        removeCard: (state, action) => {
            state.groups = state.groups.filter((item, index) => index !== action.payload)
        }
    },
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

            .addCase(removeGroup.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.groups = state.groups.filter(group => group.id !== action.payload);
            })
            .addCase(removeGroup.rejected, (state) => {
                state.status = 'rejected';
            })
    }
})

// export const {removeGroup, } = cardSlice.actions;

export const selectGroup= (state) => state.group.groups;

export const groupReducers = groupSlice.reducer;