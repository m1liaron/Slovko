import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {AppPath} from "../../common/app/app";
import MainScreen from "../../screens/MainScreen";
import GroupScreen from "../../screens/GroupScreen";
import LearnScreen from "../../screens/LearnScreen/LearnScreen";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AppPath.Home} component={MainScreen} />
            <Stack.Screen name={AppPath.Group} component={GroupScreen} />
            <Stack.Screen name={AppPath.Learn} component={LearnScreen} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
