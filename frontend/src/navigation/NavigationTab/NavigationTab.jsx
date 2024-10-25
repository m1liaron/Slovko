import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";

const Tab = createBottomTabNavigator();

const NavigationTab = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeTab" component={MainStackNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
};

export default NavigationTab;
