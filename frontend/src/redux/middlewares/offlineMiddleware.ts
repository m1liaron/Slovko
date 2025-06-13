import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { enqueueAction } from "../offlineQueueReducer/offlineQueueSlice";
import { RootState } from "../store";

/** The minimal “opt‑in” shape our middleware cares about */
export interface OfflineAction extends AnyAction {
  type: string;
  payload?: unknown;
  meta?: { queueOffline?: boolean };
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

export const offlineMiddleware: Middleware<{}, RootState, Dispatch<AnyAction>> = (
  store: MiddlewareAPI<Dispatch<AnyAction>, RootState>
) => (next) => (action) => {
  const result = next(action);

  if (isOfflineAction(action) && !(store.getState().network?.isConnected ?? true)) {
    store.dispatch(
      enqueueAction({ type: action.type, payload: action.payload })
    );
  }

  return result;
};
