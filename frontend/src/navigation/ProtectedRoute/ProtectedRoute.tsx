import React, { useEffect, useState } from "react";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import AuthNavigator from "../AuthNavigator/AuthNavigator";
import { AppPath, TypeAppPath } from "../../common/enums/app/app";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, selectUser } from "../../redux/userReducer/userSlice";
import Loading from "../../components/Loading";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";

export type RootStackParamList = Record<TypeAppPath[number], undefined>
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProtectedRoute = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { isAuthenticated } = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const checkAuth = async () => {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				dispatch(getUser());
			}
			setIsLoading(false);
		};

		checkAuth();
	}, [dispatch]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{isAuthenticated ? (
					<>
						<Stack.Screen name={AppPath.Home} component={MainStackNavigator} />
					</>
				) : (
					<Stack.Screen name="auth" component={AuthNavigator} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default ProtectedRoute;
