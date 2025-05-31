import NetInfo from "@react-native-community/netinfo";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { useEffect } from "react";
import { setIsConnected } from "@/redux/networkReducer/networkSlice";

const ConnectivityListener = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
		  dispatch(setIsConnected(Boolean(state.isConnected)));
		});
		return () => unsubscribe();
	  }, [dispatch]);
	
	  return null;
}

export { ConnectivityListener };