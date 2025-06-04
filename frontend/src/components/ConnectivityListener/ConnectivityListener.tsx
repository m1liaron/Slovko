import { useAppDispatch } from "@/hooks/redux.hooks";
import { setIsConnected } from "@/redux/networkReducer/networkSlice";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

const ConnectivityListener = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			dispatch(setIsConnected(Boolean(state.isConnected)));
		});
		return () => unsubscribe();
	}, [dispatch]);

	return null;
};

export { ConnectivityListener };
