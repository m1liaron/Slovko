import { configureStore } from "@reduxjs/toolkit";
import { cardReducers } from "./cardReducer/cardSlice";
import { groupReducers } from "./groupReducer/groupSlice";
import { resultReducers } from "./resultReducer/resultSlice";
import { sharedGroupReducers } from "./sharedGroupReducer/sharedGroupSlice";
import { userReducers } from "./userReducer/userSlice";

export const store = configureStore({
	reducer: {
		user: userReducers,
		groups: groupReducers,
		sharedGroups: sharedGroupReducers,
		cards: cardReducers,
		results: resultReducers,
	},
});
