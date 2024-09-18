import React, {useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ActivityIndicator,
} from 'react-native';
import { useDispatch } from "react-redux";
import {getUser} from "../redux/userSlice";

const LoadingScreen = (props) => {
    const dispatch = useDispatch();

    const detectLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const response = await dispatch(getUser());
            if(getUser.rejected.match(response)) {
                props.navigation.replace("login")
            } else {
                props.navigation.replace("home")
            }
        } else {
            props.navigation.replace("login")
        }
    }

    useEffect(() => {
        detectLogin()
    }, [])

    return <ActivityIndicator size="large" color="blue"/>
};

export default LoadingScreen;