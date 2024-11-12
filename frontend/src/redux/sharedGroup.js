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
        const response = await axiosInstance.post('/sharedGroups', data);
        return response.data
    }
)



const sharedGroupSlice = createSlice({
    name:'sharedGroup',
    initialState: {
        sharedGroups: [],
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
    }
})

export const selectGroup= (state) => state.sharedGroups.sharedGroups;
export const sharedGroupReducers = sharedGroupSlice.reducer;