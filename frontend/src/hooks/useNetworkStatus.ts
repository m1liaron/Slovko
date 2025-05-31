import { useEffect, useState } from "react"
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(Boolean(state.isConnected));
        })
        return () => unsubscribe();
    }, []);
}

export { useNetworkStatus };