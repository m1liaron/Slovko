import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


const handleUpdateState = <T extends { id: string | number }>(
    state: any,
    action: PayloadAction<T>,
    arrayKey: string,
    singleKey?: string
) => {
    if (!arrayKey) {
        return;
    }
    const updatedItem: T = action.payload;
    const index = state[arrayKey].findIndex((item: T) => item.id === updatedItem.id);

    if (index !== -1) {
        state[arrayKey][index] = updatedItem;
        if (singleKey) {
            state[singleKey] = updatedItem;
        }
    }
};

export { handleUpdateState }