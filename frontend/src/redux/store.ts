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

import { cardReducer } from './cardReducer/cardSlice';
import { groupReducers } from './groupReducer/groupSlice';
import { languageReducers } from './languageReducer/languageSlice';
import { networkReducer } from './networkReducer/networkSlice';
import { offlineQueueReducer } from './offlineQueueReducer/offlineQueueSlice';
import { resultReducers } from './resultReducer/resultSlice';
import { sectionReducers } from './sectionReducer/sectionSlice';
import { registerUnauthorizedHandler } from './services/authEvents';
import { sharedGroupReducers } from './sharedGroupReducer/sharedGroupSlice';
import { logout, userReducers } from './userReducer/userSlice';

const appReducer = combineReducers({
  user: userReducers,
  languages: languageReducers,
  sections: sectionReducers,
  groups: groupReducers,
  sharedGroups: sharedGroupReducers,
  cards: cardReducer,
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

registerUnauthorizedHandler(() => {
  const { network, user } = store.getState();
  if (network.isConnected && user.isAuthenticated) {
    persistor.purge();
    store.dispatch(logout());
  }
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
