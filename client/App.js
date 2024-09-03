import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import StudyScreen from "./screens/StudyScreen";
import GreetingScreen from "./screens/GreetingScreen";
import MainScreen from "./screens/MainScreen";
import QuizScreen from "./screens/QuizScreen";
import GuessWordScreen from "./screens/GuessWordScreen";
import LoadingScreen from "./screens/LoadingScreen";
import GroupScreen from "./screens/GroupScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator headerMode="none" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="loading" component={LoadingScreen} />
                    <Stack.Screen name="home" component={GreetingScreen} />
                    <Stack.Screen name="group" component={GroupScreen}/>
                    <Stack.Screen name="main" component={MainScreen} />
                    <Stack.Screen name="quiz" component={QuizScreen} />
                    <Stack.Screen name="word" component={GuessWordScreen} />
                    {/* Wrap only StudyScreen with GestureHandlerRootView */}
                    <Stack.Screen name="study" component={StudyScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
