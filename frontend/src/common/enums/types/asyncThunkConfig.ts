import { AppDispatch, RootState } from "@/redux/store";
import { PersistState } from "redux-persist";

type RejectValue = {
    status: number;
    message?: string;
};

type AsyncThunkConfig = {
    state: RootState | PersistState;
    dispatch: AppDispatch;
    rejectWithValue: RejectValue;
};

export { type AsyncThunkConfig };
