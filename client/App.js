import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from "react-redux";
import {store} from "./redux/store";
import StudyScreen from "./screens/StudyScreen";
import GreetingScreen from "./screens/GreetingScreen";
import MainScreen from "./screens/MainScreen";
import QuizScreen from "./screens/QuizScreen";
import SentenceScreen from "./screens/SentenceScreen";
const Stack = createNativeStackNavigator();
export default function App() {
  return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator headerMode="none" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="home" component={GreetingScreen} />
                    <Stack.Screen name="main" component={MainScreen} />
                    <Stack.Screen name="quiz" component={QuizScreen}/>
                    <Stack.Screen name="sentence" component={SentenceScreen}/>
                    <Stack.Screen name="study" component={StudyScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
  );
}