import { AppDispatch, RootState } from "@/redux/store";

type RejectValue = {
    status: number;
    message?: string;
};

type AsyncThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
    rejectWithValue: RejectValue;
};

export { type AsyncThunkConfig };
