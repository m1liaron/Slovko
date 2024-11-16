import {configureStore} from "@reduxjs/toolkit";
import {cardReducers} from "./cardReducer/cardSlice";
import {userReducers} from "./userReducer/userSlice";
import {groupReducers} from "./groupReducer/groupSlice";
import {resultReducers} from "./resultReducer/resultsSlice";
import { sharedGroupReducers } from "./sharedGroupReducer/sharedGroup";

export const store = configureStore({
    reducer:{
        user: userReducers,
        groups: groupReducers,
        sharedGroups: sharedGroupReducers,
        cards: cardReducers,
        results: resultReducers
    }
})