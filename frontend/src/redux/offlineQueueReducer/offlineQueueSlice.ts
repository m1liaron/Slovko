import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QueuedAction {
    type: string;
    payload: any;
}

export interface OfflineQueueState {
    queue: QueuedAction[];
}

const initialState: OfflineQueueState = {
    queue: []
};

const offlineQueueSlice = createSlice({
    name: "offlineQueue",
    initialState,
    reducers: {
        enqueueAction(state, action: PayloadAction<QueuedAction>) {
            state.queue.push(action.payload);
        },
        dequeueAction(state) {
            state.queue.shift();
        },
        clearQueue(state) {
            state.queue = [];
        },
    }
});

export const { enqueueAction, dequeueAction, clearQueue } = offlineQueueSlice.actions;
export const offlineQueueReducer = offlineQueueSlice.reducer;