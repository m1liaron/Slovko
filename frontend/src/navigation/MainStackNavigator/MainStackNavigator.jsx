import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AppPath } from "../../common/enums/app/app";
import {
	GroupScreen,
	LearnScreen,
	ResultDetailsScreen,
	SharedGroupDetailsScreen,
	StatisticsScreen,
	StreakScreen,
} from "../../screens";
import NavigationTab from "../NavigationTab/NavigationTab";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={AppPath.Main} component={NavigationTab} />
			<Stack.Screen name={AppPath.Group} component={GroupScreen} />
			<Stack.Screen name={AppPath.Learn} component={LearnScreen} />
			<Stack.Screen
				name={AppPath.ResultDetails}
				component={ResultDetailsScreen}
			/>
			<Stack.Screen
				name={AppPath.SharedGroupDetails}
				component={SharedGroupDetailsScreen}
			/>
			<Stack.Screen name={AppPath.Statistics} component={StatisticsScreen} />
			<Stack.Screen name={AppPath.Streak} component={StreakScreen} />
		</Stack.Navigator>
	);
};

export default MainStackNavigator;
