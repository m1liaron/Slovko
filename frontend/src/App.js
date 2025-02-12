import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProtectedRoute from "./navigation/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeProvider";

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
