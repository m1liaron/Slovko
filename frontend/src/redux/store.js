import {configureStore} from "@reduxjs/toolkit";
import {cardReducers} from "./cardSlice";
import {userReducers} from "./userReducer/userSlice";
import {groupReducers} from "./groupSlice";
import {resultReducers} from "./resultsSlice";
import { sharedGroupReducers } from "./sharedGroup";

export const store = configureStore({
    reducer:{
        user: userReducers,
        groups: groupReducers,
        sharedGroups: sharedGroupReducers,
        cards: cardReducers,
        results: resultReducers
    }
})