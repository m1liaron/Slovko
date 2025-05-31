import "react-native-gesture-handler";
import "react-native-reanimated"
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useAppDispatch } from "./src/hooks/redux.hooks";
import { persistor, store } from "./src/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProtectedRoute from "./src/navigation/ProtectedRoute/ProtectedRoute";
import { ThemeProvider } from "./src/contexts/ThemeProvider";
import { LanguageProvider } from "./src/contexts/LanguageProvider";
import { setIsConnected } from "./src/redux/networkReducer/networkSlice";
import NetInfo from "@react-native-community/netinfo";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./src/components/Loading";

const ConnectivityListener = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
		  dispatch(setIsConnected(Boolean(state.isConnected)));
		});
		return () => unsubscribe();
	  }, [dispatch]);
	
	  return null;
}

export default function App() {
	return (
		<Provider store={store}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ThemeProvider>
					<LanguageProvider>
						<PersistGate loading={<Loading/>} persistor={persistor} >
							<ConnectivityListener/>
							<ProtectedRoute />
						</PersistGate>
					</LanguageProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</Provider>
	);
}