import { Middleware } from "@reduxjs/toolkit";
import { enqueueAction } from "../offlineQueueReducer/offlineQueueSlice";
import { RootState } from "../store";

export interface OfflineAction {
    type: string;
    payload?: unknown;
    meta?: {
        queueOffline?: boolean;
    };
}

function isOfflineAction(action: unknown): action is OfflineAction {
    return (
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        typeof (action as any).type === "string" &&
        (action as OfflineAction).meta?.queueOffline === true
    );
}

const offlineMiddleware: Middleware<{}, RootState> =
    (store) =>
        (next) =>
            (action: unknown) => {
                const result = next(action);
                // If the action didn’t opt in, just pass it through
                if (!isOfflineAction(action)) {
                    return result;
                  }

                const isConnected = store.getState().network?.isConnected ?? true;

                if (!isConnected) {
                    store.dispatch(
                        enqueueAction({ type: action.type, payload: action.payload })
                    );
                }

                return result
};


export { offlineMiddleware };
