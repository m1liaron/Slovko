import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createAuthorizedInstance} from "../utils/createAuthorizedInstance";


export const getAllGroups = createAsyncThunk(
    'group/getAll', async (data) => {
        const axiosInstance = await createAuthorizedInstance();
        const response = await axiosInstance.get('/groups', data);
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