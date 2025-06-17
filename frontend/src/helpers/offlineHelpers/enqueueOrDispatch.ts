import { enqueueAction } from "@/redux/offlineQueueReducer/offlineQueueSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
	ActionCreatorWithPayload,
	AnyAction,
	ThunkAction,
	AsyncThunk,
} from "@reduxjs/toolkit";
import { persistOfflineQueue } from "./persistOfflineQueue";

// Updated type to match AsyncThunk signature
type AsyncThunkCreator<Returned, ThunkArg> = AsyncThunk<
	Returned,
	ThunkArg,
	{
		state: RootState;
		dispatch: AppDispatch;
		rejectValue: any;
	}
> & { typePrefix: string };

type RegularActionCreator<T> = ActionCreatorWithPayload<T> | AsyncThunkCreator<any, T>;;

// 🔹 First overload: only asyncThunk + args
function enqueueOrDispatch<Returned, ThunkArg>(
	actionCreator: AsyncThunkCreator<Returned, ThunkArg>,
	args: ThunkArg
): ReturnType<typeof buildThunk>;

// 🔹 Second overload: asyncThunk + stateAction + args
function enqueueOrDispatch<Returned, ThunkArg extends PayloadType, PayloadType>(
	actionCreator: AsyncThunkCreator<Returned, ThunkArg>,
	stateAction: RegularActionCreator<PayloadType>,
	args: ThunkArg
): ReturnType<typeof buildThunk>;

// 🔸 Actual implementation
function enqueueOrDispatch<Returned, ThunkArg, PayloadType = ThunkArg>(
	actionCreator: AsyncThunkCreator<Returned, ThunkArg>,
	arg1: RegularActionCreator<PayloadType> | ThunkArg,
	arg2?: ThunkArg
) {
	const hasStateCreator = typeof arg1 === "function";
	const actionStateCreator = hasStateCreator
		? (arg1 as RegularActionCreator<PayloadType>)
		: undefined;
	const args = hasStateCreator ? arg2! : (arg1 as ThunkArg);

	return buildThunk(actionCreator, actionStateCreator, args);
}

// 🔹 Extracted core thunk builder
function buildThunk<Returned, ThunkArg, PayloadType = ThunkArg>(
	actionCreator: AsyncThunkCreator<Returned, ThunkArg>,
	actionStateCreator: RegularActionCreator<PayloadType> | undefined,
	args: ThunkArg,
) {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const { network } = getState();
		const isOffline = !network.isConnected;
		const isFetchLike = actionCreator.typePrefix.toLowerCase().includes("get");

		const queueAction = async () => {
			dispatch(
				enqueueAction({
					type: actionCreator.typePrefix,
					payload: args,
				}),
			);
			await persistOfflineQueue(getState);
			if (actionStateCreator) {
				console.log("🚀 Running asyncThunk:", actionCreator.typePrefix, args);
				dispatch(actionStateCreator(args as any));
			}
		};

		if (isOffline) {
			if (isFetchLike) return { skipped: true };
			await queueAction();
			return { queued: true };
		}

		try {
			// TODO: Change type any for args on real type
			console.log("🚀 Dispatching asyncThunk (online):", actionCreator.typePrefix, args);
			const result = await dispatch(actionCreator(args as any));
			if (result.type.endsWith("/rejected")) {
				throw new Error(result.payload?.message || "Thunk failed");
			}
			return result;
		} catch (error) {
			await queueAction();
			if (isFetchLike) return { skipped: true };
			console.warn("Backend is off, save on device");
			return {
				queued: true,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	};
}

export { enqueueOrDispatch };