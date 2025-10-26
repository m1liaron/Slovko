import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import { getStorageItem } from './asyncStorage.util';

const hasToken = async (): Promise<boolean> =>
  Boolean(await getStorageItem(AsyncStorageVariables.TOKEN));

export { hasToken };
