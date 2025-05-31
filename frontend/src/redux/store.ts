import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { cardReducers } from "./cardReducer/cardSlice";
import { groupReducers } from "./groupReducer/groupSlice";
import { resultReducers } from "./resultReducer/resultSlice";
import { sharedGroupReducers } from "./sharedGroupReducer/sharedGroupSlice";
import { userReducers } from "./userReducer/userSlice";
import { networkReducer } from "./networkReducer/networkSlice";
import { offlineQueueReducer } from "./offlineQueueReducer/offlineQueueSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const rootReducer = combineReducers({
	user: userReducers,
	groups: groupReducers,
	sharedGroups: sharedGroupReducers,
	cards: cardReducers,
	results: resultReducers,
	network: networkReducer,
	offlineQueue: offlineQueueReducer
});

const persisConfig = {
	key: "root",
	storage: AsyncStorage,
	whitelist: ["user", "groups", "cards", "results", "offlineQueue", "network"]
};

const persistedReducer = persistReducer(persisConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefault) => 
		getDefault({
			immutableCheck: false,
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		})
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
