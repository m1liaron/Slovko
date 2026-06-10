import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import { View } from 'moti';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ConnectivityListener } from './src/components/ConnectivityListener/ConnectivityListener.tsx';
import Loading from './src/components/Loading';
import { LanguageProvider } from './src/contexts/LanguageProvider';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import ProtectedRoute from './src/navigation/ProtectedRoute/ProtectedRoute';
import { persistor, store } from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <LanguageProvider>
            <PersistGate loading={<Loading />} persistor={persistor}>
              <ConnectivityListener />
              <ProtectedRoute />
              <Toast />
            </PersistGate>
          </LanguageProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
