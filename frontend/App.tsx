import "react-native-gesture-handler";
import "react-native-reanimated"
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProtectedRoute from "./src/navigation/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import { LanguageProvider } from "./src/contexts/LanguageProvider";

export default function App() {
	return (
		<Provider store={store}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider>
					<LanguageProvider>
						<ProtectedRoute />
					</LanguageProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</Provider>
	);
}