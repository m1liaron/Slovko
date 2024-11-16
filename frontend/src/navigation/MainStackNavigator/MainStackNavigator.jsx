import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {AppPath} from "../../common/enums/app/app";
import { GroupScreen, LearnScreen, SharedGroupDetailsScreen, ResultDetailsScreen } from "../../screens";
import NavigationTab from "../NavigationTab/NavigationTab";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={AppPath.Home} component={NavigationTab} />
            <Stack.Screen name={AppPath.Group} component={GroupScreen} />
            <Stack.Screen name={AppPath.Learn} component={LearnScreen} />
            <Stack.Screen name={AppPath.ResultDetails} component={ResultDetailsScreen} />
            <Stack.Screen name={AppPath.SharedGroupDetails} component={SharedGroupDetailsScreen} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
