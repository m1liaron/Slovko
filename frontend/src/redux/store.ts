import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { cardReducers } from './cardReducer/cardSlice';
import { groupReducers } from './groupReducer/groupSlice';
import { networkReducer } from './networkReducer/networkSlice';
import { offlineQueueReducer } from './offlineQueueReducer/offlineQueueSlice';
import { resultReducers } from './resultReducer/resultSlice';
import { sharedGroupReducers } from './sharedGroupReducer/sharedGroupSlice';
import { logout, userReducers } from './userReducer/userSlice';
import { sectionReducers } from './sectionReducer/sectionSlice';
import { languageReducers } from './languageReducer/languageSlice';

const appReducer = combineReducers({
  user: userReducers,
  languages: languageReducers,
  sections: sectionReducers,
  groups: groupReducers,
  sharedGroups: sharedGroupReducers,
  cards: cardReducers,
  results: resultReducers,
  network: networkReducer,
  offlineQueue: offlineQueueReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any,
) => {
  if (action.type === logout.type) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

const persisConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'user',
    'languages',
    'groups',
    'cards',
    'results',
    'offlineQueue',
    'network',
    'sharedGroups',
    'sections',
  ],
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
    }),
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
