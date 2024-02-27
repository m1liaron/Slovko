import {configureStore} from "@reduxjs/toolkit";
import {cardReducers} from "./cardSlice";
import {userReducers} from "./userSlice";
export const store = configureStore({
    reducer:{
        card: cardReducers,
        user: userReducers
    }
})