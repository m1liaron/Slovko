import type { PersistState } from "redux-persist";

import type { AppDispatch, RootState } from "@/redux/store";

type RejectValue = {
	status: number;
	message?: string;
};

type AsyncThunkConfig = {
	state: RootState | PersistState;
	dispatch: AppDispatch;
	rejectWithValue: RejectValue;
};

export type { AsyncThunkConfig };
