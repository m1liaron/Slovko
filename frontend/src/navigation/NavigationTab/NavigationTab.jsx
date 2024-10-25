import React from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";
import {Ionicons} from "@expo/vector-icons";
import {AppPath} from "../../common/app/app";

const Tab = createBottomTabNavigator();

const NavigationTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff', // Customize the background color
                    borderTopWidth: 0, // Remove the border
                    elevation: 0, // For Android shadow
                    shadowOpacity: 0.2, // For iOS shadow
                    shadowRadius: 10, // For iOS shadow
                    shadowColor: '#000', // Shadow color for iOS
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === AppPath.Home) {
                        iconName = focused ? 'home' : 'home-outline'; // Change icons based on focus
                    } else if (route.name === AppPath.Profile) {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Return the icon component
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF', // Active icon color
                tabBarInactiveTintColor: '#8e8e93', // Inactive icon color
                tabBarLabelStyle: {
                    fontSize: 12, // Customize label style
                    marginBottom: 5, // Add some spacing below label
                },
            })}
        >
            <Tab.Screen name={AppPath.Home} component={MainStackNavigator} options={{ title: 'Головна' }} />
            <Tab.Screen name={AppPath.Profile} component={ProfileScreen} options={{ title: 'Профіль' }} />
        </Tab.Navigator>
    );
};

export default NavigationTab;
