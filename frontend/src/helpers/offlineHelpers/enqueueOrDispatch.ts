import { enqueueAction } from "@/redux/offlineQueueReducer/offlineQueueSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
	Action,
	ActionCreatorWithPayload,
	AnyAction,
	ThunkAction,
} from "@reduxjs/toolkit";
import { persistOfflineQueue } from "./persistOfflineQueue";

/**
 * A “thunk creator” that:
 *  • If offline: enqueues itself (by storing `{ type: <typePrefix>, payload: <args> }`).
 *  • If online: dispatches the real asyncThunk immediately.
 *
 * To make `.typePrefix` available, we declare “any function returning a ThunkAction <…> + has a `typePrefix` string.”
 */
type ActionCreatorWithType<Args extends any[]> = ((
	...args: Args
) => ThunkAction<any, RootState, unknown, AnyAction>) & { typePrefix: string };

type RegularActionCreator<T> = ActionCreatorWithPayload<T>;

/**
 * @param actionCreator — an RTK createAsyncThunk (has `typePrefix`).
 * @param actionStateCreator — optional state action creator for optimistic updates
 * @param args — the arguments to pass into that thunk.
 */
const enqueueOrDispatch = <
	Args extends any[],
	PayloadType = Args extends [infer T] ? T : Args,
>(
	actionCreator: ActionCreatorWithType<Args>,
	actionStateCreator?: RegularActionCreator<PayloadType>,
	...args: Args
) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const { network } = getState();

		const isOffline = !network.isConnected;

		// Skip queuing GET/fetch-like actions
		const isFetchLike = actionCreator.typePrefix
			.toLowerCase()
			.includes("get");

		const queueAction = async () => {
			dispatch(
				enqueueAction({
					type: actionCreator.typePrefix,
					payload: args.length === 1 ? args[0] : args,
				}),
			);
			await persistOfflineQueue(getState);
			if (actionStateCreator && typeof actionStateCreator === 'function') {
				const payload = (args.length === 1 ? args[0] : args) as PayloadType;
				dispatch(actionStateCreator(payload));
			}
		};

		if (isOffline) {
			if (isFetchLike) {
				return { skipped: true };
			}
			await queueAction();
			return { queued: true };
		}

		try {
			const result = await dispatch(actionCreator(...args));

			if (result.type.endsWith('/rejected')) {
				throw new Error(result.payload?.message || "Thunk failed");
			}
			return result;
		} catch (error) {
			if (isFetchLike) {
				return { skipped: true };
			}
			console.warn("Backend is off, save on device");

			await queueAction();

			return {
				queued: true,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	};
};

export { enqueueOrDispatch };
