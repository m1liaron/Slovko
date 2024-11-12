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
    extraReducers: (builder) => {}
})

export const selectGroup= (state) => state.sharedGroups.sharedGroups;
export const sharedGroupReducers = sharedGroupSlice.reducer;