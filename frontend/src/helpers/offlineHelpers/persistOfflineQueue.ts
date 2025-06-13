import { RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistOfflineQueue = async (getState: () => RootState) => {
    const state = getState();
    const queue = state.offlineQueue;
    const persistData = await AsyncStorage.getItem("persist:root");
    if (!persistData) return;

    const parsed = JSON.parse(persistData);
    parsed.offlineQueue = JSON.stringify(queue);

    await AsyncStorage.setItem("persist:root", JSON.stringify(parsed));
};

export { persistOfflineQueue };