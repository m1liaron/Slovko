import { AsyncThunkConfig } from "@/common/enums/types/asyncThunkConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

function createAppAsyncThunk<Returned, ThunkArg>(
    typePrefix: string,
    requestFn: (arg: ThunkArg) => Promise<Returned>,
) {
    return createAsyncThunk<Returned, ThunkArg, AsyncThunkConfig>(
        typePrefix,
        async (arg, { rejectWithValue }) => {
            try {
                const data = await requestFn(arg);
                return data;
            } catch (err: any) {
                const status = err?.response?.status ?? 500;
                return rejectWithValue({ message: err?.response?.data?.error, status });
            }
        },
    );
}

export { createAppAsyncThunk };
