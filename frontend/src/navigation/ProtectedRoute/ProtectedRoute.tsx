import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	NavigationContainer,
	type NavigationProp,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { AppPath, type TypeAppPath } from "../../common/enums/app/app";
import Loading from "../../components/Loading";
import { getUser, selectUser } from "../../redux/userReducer/userSlice";
import AuthNavigator from "../AuthNavigator/AuthNavigator";
import MainStackNavigator from "../MainStackNavigator/MainStackNavigator";

export type RootStackParamList = {
	[AppPath.Main]: undefined;
	[AppPath.Group]: { groupId: string };
	[AppPath.Learn]: { groupId: string };
	[AppPath.ResultDetails]: { resultId: string };
	[AppPath.SharedGroupDetails]: { sharedGroupId: string };
	[AppPath.Statistics]: undefined;
	[AppPath.Streak]: undefined;
	[AppPath.Home]: undefined;
	[AppPath.Profile]: undefined;
	[AppPath.Results]: undefined;
	[AppPath.SharedGroup]: undefined;
  };
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
