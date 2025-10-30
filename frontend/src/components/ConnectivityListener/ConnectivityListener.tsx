import { useAppDispatch } from '@/hooks/redux.hooks';
import { setIsConnected } from '@/redux/networkReducer/networkSlice';
import { processOfflineQueue } from '@/redux/offlineQueueReducer/processOfflineQueue';
import { hasToken } from '@/utils/storage';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';

const ConnectivityListener = () => {
  const dispatch = useAppDispatch();
  const isFirst = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isConnected = !!state.isConnected;
      dispatch(setIsConnected(Boolean(state.isConnected)));

      if (!isFirst.current && isConnected) {
        const tokenExists = await hasToken();
        if (tokenExists) {
          dispatch(processOfflineQueue());
        }
      }
      isFirst.current = false;
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export { ConnectivityListener };
