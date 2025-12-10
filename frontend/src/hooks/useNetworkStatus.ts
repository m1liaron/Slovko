import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const useNetworkStatus = () => {
	const [_isConnected, setIsConnected] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsConnected(Boolean(state.isConnected));
		});
		return () => unsubscribe();
	}, []);
};

export { useNetworkStatus };
