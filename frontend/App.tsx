import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProtectedRoute from "./src/navigation/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./src/contexts/ThemeProvider";

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
