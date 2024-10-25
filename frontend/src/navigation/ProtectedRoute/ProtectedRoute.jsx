import React from 'react';
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/userSlice";
import {NavigationContainer} from "@react-navigation/native";
import NavigationTab from "../NavigationTab/NavigationTab";
import AuthNavigator from "../AuthNavigator/AuthNavigator";

const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector(selectUser);

    return (
        <NavigationContainer>
            {isAuthenticated ? <NavigationTab/> : <AuthNavigator/> }
        </NavigationContainer>
    )
};

export default ProtectedRoute;
