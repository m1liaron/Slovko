import { enqueueAction } from "@/redux/offlineQueueReducer/offlineQueueSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ThunkAction, AnyAction } from "@reduxjs/toolkit";

/**
 * A “thunk creator” that:
 *  • If offline: enqueues itself (by storing `{ type: <typePrefix>, payload: <args> }`).
 *  • If online: dispatches the real asyncThunk immediately.
 *
 * To make `.typePrefix` available, we declare “any function returning a ThunkAction <…> + has a `typePrefix` string.”
 */
type ActionCreatorWithType<Args extends any[]> =
    & ((...args: Args) => ThunkAction<any, RootState, unknown, AnyAction>)
    & { typePrefix: string };

/**
* @param actionCreator  — an RTK createAsyncThunk (has `typePrefix`).
* @param args           — the arguments to pass into that thunk.
*
* If disconnected, we push
*   { type: actionCreator.typePrefix, payload: (args or args[0]) }
* into the `offlineQueue` slice (which you’ve already persisted).
* Otherwise, we just do `dispatch(actionCreator(...args))` as usual.
*/
const enqueueOrDispatch = <Args extends any[]>(
    actionCreator: ActionCreatorWithType<Args>,
    ...args: Args
) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const { network } = getState();
        if (!network.isConnected) {
            // Device is offline: enqueue { type, payload } for later replay
            dispatch(
                enqueueAction({
                    type: actionCreator.typePrefix,
                    payload: args.length === 1 ? args[0] : args,
                })
            );
            return Promise.resolve({ queued: true } as { queued: boolean });
        } else {
            // Device is online: just dispatch the real asyncThunk
            return dispatch(actionCreator(...args));
        }
    }
}

export { enqueueOrDispatch };