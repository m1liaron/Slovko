import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AppPath } from "../../common/enums/app/app";
import { LoginScreen, RegisterScreen } from "../../screens/index";
import { RootStackParamList } from "../ProtectedRoute/ProtectedRoute";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={AppPath.Login} component={LoginScreen} />
			<Stack.Screen name={AppPath.Register} component={RegisterScreen} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
