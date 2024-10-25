import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AppPath} from "../../common/app/app";
import MainScreen from "../../screens/MainScreen";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";

const Tab = createBottomTabNavigator();

const NavigationTab = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name={AppPath.Home} component={MainScreen} />
            <Tab.Screen name={AppPath.Profile} component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default NavigationTab;
