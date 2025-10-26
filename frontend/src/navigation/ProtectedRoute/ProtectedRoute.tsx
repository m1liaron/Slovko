import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import {
  LoginScreen,
  RegisterScreen,
  WelcomeScreen,
  ChooseLanguageScreen,
  ChooseWordsScreen,
} from '@/screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  AppPath,
  AsyncStorageVariables,
  DataStatus,
  TypeAppPath,
} from '../../common/enums/app/app';
import Loading from '../../components/Loading';
import { getUser, selectUser } from '../../redux/userReducer/userSlice';
import MainStackNavigator from '../MainStackNavigator/MainStackNavigator';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { IAppPath } from '@/common/enums/app/AppPath';

export type RootStackParamList = {
  [AppPath.Main]: undefined;
  [AppPath.Group]: { groupId: string };
  [AppPath.Learn]: { groupId?: string | undefined };
  [AppPath.ResultDetails]: { resultId: string };
  [AppPath.SharedGroupDetails]: { sharedGroupId: string };
  [AppPath.Statistics]: undefined;
  [AppPath.Streak]: undefined;
  [AppPath.Home]: undefined;
  [AppPath.Profile]: undefined;
  [AppPath.Results]: undefined;
  [AppPath.SharedGroup]: undefined;
  [AppPath.Login]: undefined;
  [AppPath.Register]: undefined;
};
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<IAppPath[keyof IAppPath]>(
    AppPath.Main,
  );

  useEffect(() => {
    (async () => {
      const firstLaunch = await getStorageItem(
        AsyncStorageVariables.FIRST_START,
      );
      if (!firstLaunch) {
        await setStorageItem(AsyncStorageVariables.FIRST_START, 'true');
        setInitialRoute(AppPath.Welcome);
      } else {
        setInitialRoute(AppPath.Main);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return isLoading ? (
    <Loading />
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name={AppPath.Home} component={MainStackNavigator} />
        <Stack.Screen name={AppPath.Welcome} component={WelcomeScreen} />
        <Stack.Screen name={AppPath.Register} component={RegisterScreen} />
        <Stack.Screen name={AppPath.Login} component={LoginScreen} />
        <Stack.Screen
          name={AppPath.ChooseLanguage}
          component={ChooseLanguageScreen}
        />
        <Stack.Screen
          name={AppPath.ChooseWords}
          component={ChooseWordsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProtectedRoute;
