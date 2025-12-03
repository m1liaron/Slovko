import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import { getStorageItem } from './asyncStorage.util';

export let HAS_TOKEN = false;

export const initToken = async () => {
  const token = await getStorageItem(AsyncStorageVariables.TOKEN);
  HAS_TOKEN = Boolean(token);
};
