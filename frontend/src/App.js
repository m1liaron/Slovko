import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeProvider";
import ProtectedRoute from "./navigation/ProtectedRoute/ProtectedRoute";
import { store } from "./redux/store";

export default function App() {
	return (
		<Provider store={store}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider>
					<ProtectedRoute />
				</ThemeProvider>
			</GestureHandlerRootView>
		</Provider>
	);
}
