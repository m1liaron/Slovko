import {
  NavigationContainer,
  type NavigationProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import type { IAppPath } from '@/common/enums/app/AppPath';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { getUser } from '@/redux/userReducer/userThunk';
import {
  LoginScreen,
  RegisterScreen,
  WelcomeScreen,
  ChooseLanguageScreen,
  ChooseWordsScreen,
} from '@/screens';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { initToken } from '@/utils/storage/initToken';

import { AppPath, AsyncStorageVariables } from '../../common/enums/app/app';
import Loading from '../../components/Loading';
import MainStackNavigator from '../MainStackNavigator/MainStackNavigator';

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
    AppPath.Home,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    initToken();
  }, []);

  useEffect(() => {
    (async () => {
      const firstLaunch = await getStorageItem(
        AsyncStorageVariables.FIRST_START,
      );
      const token = await getStorageItem(AsyncStorageVariables.TOKEN);

      if (firstLaunch !== 'false') {
        await setStorageItem(AsyncStorageVariables.FIRST_START, 'true');
        setInitialRoute(AppPath.Welcome);
        setIsLoading(false);
        return;
      }

      if (token) {
        const result = await dispatch(getUser({}));
        if (getUser.rejected.match(result) && result.payload?.status === 401) {
          setInitialRoute(AppPath.Login);
        } else {
          setInitialRoute(AppPath.Main);
        }
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
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen
          name={AppPath.HomeNavigation}
          component={MainStackNavigator}
        />
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
