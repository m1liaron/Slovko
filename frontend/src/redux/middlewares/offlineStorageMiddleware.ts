import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStore } from "../store";
import { setQueue } from "../offlineQueueReducer/offlineQueueSlice";
import { Dispatch, Middleware, UnknownAction } from "@reduxjs/toolkit";
import type { OfflineQueueState } from "@/redux/offlineQueueReducer/offlineQueueSlice";

const STORAGE_KEY = "@myApp/offlineQueue";

function isOfflineQueueAction(action: unknown): action is { type: string } {
    return typeof action === "object" && action !== null && "type" in action && typeof (action as any).type === "string";
}

/**
 * This function saving data to AsyncStorage from persisted queue
 * @param store 
 * @returns 
 */
const offlineStorageMiddleware: Middleware<{}, ReturnType<AppStore["getState"]>> =
    (store) => (next) => (action) => {
        const result = next(action);

        if (isOfflineQueueAction(action) && action.type.startsWith("offlineQueue/")) {
            const queue: OfflineQueueState["queue"] = store.getState().offlineQueue.queue;
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue)).catch((error) => {
                console.error("Failed to persist offlineQueue:", error);
            });
        }

        return result;
};

const loadOfflineQueue = () => async (dispatch: Dispatch) => {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
            const queue = JSON.parse(raw);
            dispatch(setQueue(queue));
        }
    } catch (error) {
        console.error(error);
    }
}

export { offlineStorageMiddleware, loadOfflineQueue };