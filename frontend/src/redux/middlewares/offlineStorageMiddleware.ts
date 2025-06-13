import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppStore, RootState } from "../store";
import { setQueue } from "../offlineQueueReducer/offlineQueueSlice";
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { type OfflineQueueState } from "@/redux/offlineQueueReducer/offlineQueueSlice";

const STORAGE_KEY = "@myApp/offlineQueue";

function isOfflineQueueAction(action: unknown): action is { type: string } {
    return typeof action === "object" && action !== null && "type" in action && typeof (action as any).type === "string";
}

/**
 * This function saving data to AsyncStorage from persisted queue
 * @param store 
 * @returns 
 */
const offlineStorageMiddleware: Middleware<{}, RootState, Dispatch<AnyAction>> = (
    store: MiddlewareAPI<Dispatch<AnyAction>, RootState>
        ) => (next) => (action) => { // Type action as AnyAction
                // 1) let the action through
                const result: unknown = next(action);

                // 2) if it's an offlineQueue mutation, persist the updated queue
                if (
                    isOfflineQueueAction(action) &&
                    action.type.startsWith("offlineQueue/")
                ) {
                    const queue: OfflineQueueState["queue"] =
                        store.getState().offlineQueue.queue;
                    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue)).catch((err) => {
                        console.error("Failed to persist offlineQueue:", err);
                    });
                }

                return result;
            };

const loadOfflineQueue = () => async (dispatch: Dispatch<AnyAction>) => { // Type dispatch as Dispatch<AnyAction>
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