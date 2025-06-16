import { enqueueAction } from "@/redux/offlineQueueReducer/offlineQueueSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ActionCreatorWithPayload,
	AnyAction,
	ThunkAction,
} from "@reduxjs/toolkit";
import { persistOfflineQueue } from "./persistOfflineQueue";

type ActionCreatorWithType<Args extends any[]> = ((
	...args: Args
) => ThunkAction<any, RootState, unknown, AnyAction>) & { typePrefix: string };

type RegularActionCreator<T> = ActionCreatorWithPayload<T>;

// 🔹 First overload: only asyncThunk + args
function enqueueOrDispatch<Args extends any[]>(
	actionCreator: ActionCreatorWithType<Args>,
	...args: Args
): ReturnType<typeof buildThunk>;

// 🔹 Second overload: asyncThunk + stateAction + args
function enqueueOrDispatch<Args extends any[], PayloadType>(
	actionCreator: ActionCreatorWithType<Args>,
	stateAction: RegularActionCreator<PayloadType>,
	...args: Args
): ReturnType<typeof buildThunk>;

// 🔸 Actual implementation
function enqueueOrDispatch<Args extends any[], PayloadType>(
	actionCreator: ActionCreatorWithType<Args>,
	arg1: any,
	...rest: any[]
) {
	const hasStateCreator = typeof arg1 === "function";
	const actionStateCreator = hasStateCreator ? (arg1 as RegularActionCreator<PayloadType>) : undefined;
	const args = hasStateCreator ? rest : [arg1, ...rest] as Args;

	return buildThunk(actionCreator, actionStateCreator, args as Args);
}

// 🔹 Extracted core thunk builder
function buildThunk<Args extends any[], PayloadType>(
	actionCreator: ActionCreatorWithType<Args>,
	actionStateCreator: RegularActionCreator<PayloadType> | undefined,
	args: Args,
) {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const { network } = getState();
		const isOffline = !network.isConnected;
		const isFetchLike = actionCreator.typePrefix.toLowerCase().includes("get");

		const queueAction = async () => {
			dispatch(
				enqueueAction({
					type: actionCreator.typePrefix,
					payload: args.length === 1 ? args[0] : args,
				}),
			);
			await persistOfflineQueue(getState);

			if (actionStateCreator) {
				const payload = (args.length === 1 ? args[0] : args) as PayloadType;
				dispatch(actionStateCreator(payload));
			}
		};

		if (isOffline) {
			if (isFetchLike) return { skipped: true };
			await queueAction();
			return { queued: true };
		}

		try {
			const result = await dispatch(actionCreator(...args));
			if (result.type.endsWith("/rejected")) {
				throw new Error(result.payload?.message || "Thunk failed");
			}
			return result;
		} catch (error) {
			if (isFetchLike) return { skipped: true };
			console.warn("Backend is off, save on device");
			await queueAction();
			return {
				queued: true,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	};
}

export { enqueueOrDispatch };