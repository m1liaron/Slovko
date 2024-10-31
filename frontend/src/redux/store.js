import {configureStore} from "@reduxjs/toolkit";
import {cardReducers} from "./cardSlice";
import {userReducers} from "./userSlice";
import {groupReducers} from "./groupSlice";
import {resultReducers} from "./resultsSlice";

export const store = configureStore({
    reducer:{
        user: userReducers,
        groups: groupReducers,
        cards: cardReducers,
        results: resultReducers
    }
})