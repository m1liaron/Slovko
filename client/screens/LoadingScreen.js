import React, {useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ActivityIndicator,
} from 'react-native';

const LoadingScreen = (props) => {

    const detectLogin = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        if (token) {
            props.navigation.replace("main")
        } else {
            props.navigation.replace("home")
        }
    }

    useEffect(() => {
        detectLogin()
    }, [])

    return <ActivityIndicator size="large" color="blue"/>
};

export default LoadingScreen;