import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {AppPath} from "../../common/app/app";
import { MainScreen, ResultsScreen, ProfileScreen, SharedGroupsScreen } from "../../screens";
import {useAppTheme} from "../../contexts/ThemeProvider";

const Tab = createBottomTabNavigator();

const NavigationTab = () => {
    const { theme } = useAppTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background, // Customize the background color
                    borderTopWidth: 0, // Remove the border
                    elevation: 0, // For Android shadow
                    shadowOpacity: 0.2, // For iOS shadow
                    shadowRadius: 10, // For iOS shadow
                    shadowColor: theme.colors.background, // Shadow color for iOS
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === AppPath.Home) {
                        iconName = focused ? 'home' : 'home-outline'; // Change icons based on focus
                    } else if (route.name === AppPath.Profile) {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === AppPath.Results) {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === AppPath.SharedGroup) {
                        iconName = focused ? 'share' : 'share-outline';
                    }

                    // Return the icon component
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.iconColor, // Active icon color
                tabBarInactiveTintColor: '#8e8e93', // Inactive icon color
                tabBarLabelStyle: {
                    fontSize: 12, // Customize label style
                    marginBottom: 5, // Add some spacing below label
                },
            })}
        >
            <Tab.Screen name={AppPath.Home} component={MainScreen} options={{ title: 'Головна' }} />
            <Tab.Screen name={AppPath.SharedGroup} component={SharedGroupsScreen} options={{ title: 'Поширені групи' }} />
            <Tab.Screen name={AppPath.Results} component={ResultsScreen} options={{ title: 'Результати' }} />
            <Tab.Screen name={AppPath.Profile} component={ProfileScreen} options={{ title: 'Профіль' }} />
        </Tab.Navigator>
    );
};

export default NavigationTab;
