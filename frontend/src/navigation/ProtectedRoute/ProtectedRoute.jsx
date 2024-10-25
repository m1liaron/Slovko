import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "../AuthNavigator/AuthNavigator";
import { AppPath } from "../../common/app/app";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoadingScreen from "../../screens/LoadingScreen";
import NavigationTab from "../NavigationTab/NavigationTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from "react-redux";
import {getUser, selectUser} from "../../redux/userSlice";

const Stack = createNativeStackNavigator();

const ProtectedRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated }= useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await dispatch(getUser());
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [dispatch]);


    if(isLoading){
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name={AppPath.Home} component={NavigationTab} />
                    </>
                ) : (
                    <Stack.Screen name="auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default ProtectedRoute;
