import React from 'react';
import {View, Text, StyleSheet} from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AppPath} from "../../common/app/app";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AppPath.Login} component={LoginScreen} />
            <Stack.Screen name={AppPath.Register} component={RegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
