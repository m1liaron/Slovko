import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NetworkState {
	isConnected: boolean;
}

const initialState: NetworkState = {
	isConnected: true,
};

const networkSlice = createSlice({
	name: "network",
	initialState,
	reducers: {
		setIsConnected(state, action: PayloadAction<boolean>) {
			state.isConnected = action.payload;
		},
	},
});

export const { setIsConnected } = networkSlice.actions;
export const networkReducer = networkSlice.reducer;
