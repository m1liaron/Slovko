import { useAppDispatch } from "@/hooks/redux.hooks";
import { replaceCards } from "@/redux/cardReducer/cardSlice";
import { setIsConnected } from "@/redux/networkReducer/networkSlice";
import { processOfflineQueue } from "@/redux/offlineQueueReducer/processOfflineQueue";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";

const ConnectivityListener = () => {
	const dispatch = useAppDispatch();
	const isFirst = useRef(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			const isConnected = !!state.isConnected;
			dispatch(setIsConnected(Boolean(state.isConnected)));

			if (!isFirst.current && isConnected) {
				dispatch(processOfflineQueue());
			}
			isFirst.current = false;
		});

		return () => unsubscribe();
	}, [dispatch]);

	return null;
};

export { ConnectivityListener };
