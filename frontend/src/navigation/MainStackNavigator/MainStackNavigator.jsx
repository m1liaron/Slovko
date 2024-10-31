import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {AppPath} from "../../common/app/app";
import GroupScreen from "../../screens/GroupScreen";
import LearnScreen from "../../screens/LearnScreen/LearnScreen";
import NavigationTab from "../NavigationTab/NavigationTab";
import ResultDetailsScreen from "../../screens/ResultDetailsScreen/ResultDetailsScreen";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AppPath.Home} component={NavigationTab} />
            <Stack.Screen name={AppPath.Group} component={GroupScreen} />
            <Stack.Screen name={AppPath.Learn} component={LearnScreen} />
            <Stack.Screen name={AppPath.ResultDetails} component={ResultDetailsScreen} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
