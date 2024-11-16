import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "../AuthNavigator/AuthNavigator";
import { AppPath } from "../../common/enums/app/app";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from "react-redux";
import {getUser, selectUser} from "../../redux/userReducer/userSlice";
import Loading from "../../components/Loading";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";

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
        return <Loading />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name={AppPath.Home} component={MainStackNavigator} />
                    </>
                ) : (
                    <Stack.Screen name="auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default ProtectedRoute;
