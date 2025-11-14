import { useAppDispatch } from '@/hooks/redux.hooks';
import { HAS_TOKEN } from '@/utils/storage/initToken';

const useUnAuthorizedDispatch = () => {
  const dispatch = useAppDispatch();

  if (HAS_TOKEN) {
    return dispatch;
  }
};

export { useUnAuthorizedDispatch };
