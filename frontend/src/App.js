import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import StudyScreen from "./screens/StudyScreen";
import MainScreen from "./screens/MainScreen";
import QuizScreen from "./screens/QuizScreen";
import GuessWordScreen from "./screens/GuessWordScreen";
import LoadingScreen from "./screens/LoadingScreen";
import GroupScreen from "./screens/GroupScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AppPath } from "./common/app/app";
import LearnScreen from "./screens/LearnScreen/LearnScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator headerMode="none" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name={AppPath.Loading} component={LoadingScreen} />
                    <Stack.Screen name={AppPath.Group} component={GroupScreen} />
                    <Stack.Screen name={AppPath.Home} component={MainScreen} />
                    <Stack.Screen name={AppPath.Learn} component={LearnScreen} />
                    <Stack.Screen name={AppPath.Quiz} component={QuizScreen} />
                    <Stack.Screen name={AppPath.Word} component={GuessWordScreen} />
                    <Stack.Screen name={AppPath.Study} component={StudyScreen} />
                    <Stack.Screen name={AppPath.Login} component={LoginScreen} />
                    <Stack.Screen name={AppPath.Register} component={RegisterScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
