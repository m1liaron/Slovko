import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { AppPath, TypeAppPath } from "../../common/enums/app/app";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {
	MainScreen,
	ProfileScreen,
	ResultsScreen,
	SharedGroupsScreen,
} from "../../screens";
import { RootStackParamList } from "../ProtectedRoute/ProtectedRoute";

const Tab = createBottomTabNavigator<RootStackParamList>();

const NavigationTab = () => {
	const { theme } = useAppTheme();
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: theme.colors.background, // Customize the background color
					borderTopWidth: 0, // Remove the border
					elevation: 0, // For Android shadow
					shadowOpacity: 0.2, // For iOS shadow
					shadowRadius: 10, // For iOS shadow
					shadowColor: theme.colors.background, // Shadow color for iOS
				},
				tabBarIcon: ({ focused, color, size }) => {

					const iconMap: Partial<Record<keyof typeof AppPath, [string, string]>> = {
						[AppPath.Home]: ["home", "home-outline"],
						[AppPath.Profile]: ["person", "person-outline"],
						[AppPath.Results]: ["search", "search-outline"],
						[AppPath.SharedGroup]: ["share", "share-outline"],
					};

					const icons = iconMap[route.name as keyof typeof AppPath];
					const iconName = icons ? (focused ? icons[0] : icons[1]) : "home-outline"

					// Return the icon component
					return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
				},
				tabBarActiveTintColor: theme.colors.iconColor, // Active icon color
				tabBarInactiveTintColor: "#8e8e93", // Inactive icon color
				tabBarLabelStyle: {
					fontSize: 12, // Customize label style
					marginBottom: 5, // Add some spacing below label
				},
			})}
		>
			<Tab.Screen
				name={AppPath.Home}
				component={MainScreen}
				options={{ title: "Головна" }}
			/>
			<Tab.Screen
				name={AppPath.SharedGroup}
				component={SharedGroupsScreen}
				options={{ title: "Поширені групи" }}
			/>
			<Tab.Screen
				name={AppPath.Results}
				component={ResultsScreen}
				options={{ title: "Результати" }}
			/>
			<Tab.Screen
				name={AppPath.Profile}
				component={ProfileScreen}
				options={{ title: "Профіль" }}
			/>
		</Tab.Navigator>
	);
};

export default NavigationTab;
