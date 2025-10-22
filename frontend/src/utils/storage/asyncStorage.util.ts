import { AsyncStorageKey } from '@/common/enums/types/asyncStorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getStorageItem = async (key: AsyncStorageKey) => {
  return await getStorageItem(key);
};

const setStorageItem = async (key: AsyncStorageKey, value: string) => {
  const data = await AsyncStorage.setItem(key, value);
  return data;
};

const removeStorageItem = async (key: AsyncStorageKey) => {
  const value = await AsyncStorage.removeItem(key);
  return value;
};

export { getStorageItem, setStorageItem, removeStorageItem };
