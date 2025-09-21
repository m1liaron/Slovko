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
import { AppPath, DataStatus } from '../../common/enums/app/app';
import Loading from '../../components/Loading';
import { getUser, selectUser } from '../../redux/userReducer/userSlice';
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
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, user } = useAppSelector(selectUser);
  const isConnected = useAppSelector((state) => state.network.isConnected);

  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const triedGetUserRef = useRef(false);

  const backendOff = status === DataStatus.ERROR;

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setHasToken(true);
      }
      setIsLoading(false);
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || (backendOff && !user)) {
      setHasToken(false);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasToken && isConnected && user && !triedGetUserRef.current) {
      triedGetUserRef.current = true;

      (async () => {
        try {
          dispatch(enqueueOrDispatch(getUser, () => {}));
        } catch (error) {
          console.warn('getUser failed or backend offline:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [hasToken, isConnected, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  if (!hasToken) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={AppPath.Login} component={LoginScreen} />
          <Stack.Screen name={AppPath.Register} component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={AppPath.Welcome} component={MainStackNavigator} />
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
