import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AppPath} from "../../common/app/app";
    import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";

const Tab = createBottomTabNavigator();

const NavigationTab = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name={AppPath.Home} component={MainStackNavigator} />
            <Tab.Screen name={AppPath.Profile} component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default NavigationTab;
