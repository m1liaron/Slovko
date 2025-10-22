import type { RootState } from '@/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorageItem } from '@/utils/storage';
import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';

const persistOfflineQueue = async (getState: () => RootState) => {
  const state = getState();
  const queue = state.offlineQueue;
  const persistData = await getStorageItem(AsyncStorageVariables.PERSIST_ROOT);
  if (!persistData) return;

  const parsed = JSON.parse(persistData);
  parsed.offlineQueue = JSON.stringify(queue);

  await AsyncStorage.setItem(
    AsyncStorageVariables.PERSIST_ROOT,
    JSON.stringify(parsed),
  );
};

export { persistOfflineQueue };
