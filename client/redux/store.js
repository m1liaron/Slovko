import {configureStore} from "@reduxjs/toolkit";
import {cardReducers} from "./cardSlice";
import {userReducers} from "./userSlice";
import {groupReducers} from "./groupSlice";
export const store = configureStore({
    reducer:{
        card: cardReducers,
        group: groupReducers,
        user: userReducers
    }
})