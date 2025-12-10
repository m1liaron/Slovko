import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface QueuedAction {
	id: string;
	type: string;
	payload: any;
}

export interface OfflineQueueState {
	queue: QueuedAction[];
}

const initialState: OfflineQueueState = {
	queue: [],
};

const offlineQueueSlice = createSlice({
	name: "offlineQueue",
	initialState,
	reducers: {
		enqueueAction(state, action: PayloadAction<QueuedAction>) {
			if (!state.queue) {
				state.queue = [];
			}
			state.queue.push(action.payload);
		},
		dequeueAction: (state, action: PayloadAction<string>) => {
			state.queue = state.queue.filter((item) => item.id !== action.payload);
		},
		setQueue(state, action: PayloadAction<QueuedAction[]>) {
			state.queue = action.payload;
		},
		clearQueue(state) {
			state.queue = [];
		},
	},
});

export const { enqueueAction, dequeueAction, setQueue, clearQueue } =
	offlineQueueSlice.actions;
export const offlineQueueReducer = offlineQueueSlice.reducer;
