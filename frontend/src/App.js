import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainScreen from "./screens/MainScreen";
import LoadingScreen from "./screens/LoadingScreen";
import GroupScreen from "./screens/GroupScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AppPath } from "./common/app/app";
import LearnScreen from "./screens/LearnScreen/LearnScreen";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator headerMode="none" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name={AppPath.Loading} component={LoadingScreen} />
                        <Stack.Screen name={AppPath.Group} component={GroupScreen} />
                        <Stack.Screen name={AppPath.Home} component={MainScreen} />
                        <Stack.Screen name={AppPath.Learn} component={LearnScreen} />
                        <Stack.Screen name={AppPath.Login} component={LoginScreen} />
                        <Stack.Screen name={AppPath.Register} component={RegisterScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </Provider>
    );
}
