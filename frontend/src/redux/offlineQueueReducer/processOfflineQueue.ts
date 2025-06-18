import { addCard } from "../cardReducer/cardSlice";
import { addGroup } from "../groupReducer/groupThunk";
import { AppDispatch, RootState } from "../store";
import { dequeueAction } from "./offlineQueueSlice";

const thunkMap: Record<string, Function> = {
    "group/add": addGroup,
    "card/add-card": addCard,
}

const processOfflineQueue = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const { queue } = getState().offlineQueue;

        for (const action of queue) {
            const thunk = thunkMap[action.type];

            if (!thunk) {
                console.warn(`No thunk found for type ${action.type}`);
                continue;
            }


            try {
                await dispatch(thunk(action.payload));
                dispatch(dequeueAction());
            } catch (error) {
                console.error("Retry failed: ", error);
                break;
            }
        }
    }
}



export { processOfflineQueue };