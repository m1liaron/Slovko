import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { getStorageItem } from '@/utils/storage';

import {
  AsyncStorageVariables,
  darkTheme,
  lightTheme,
} from '../common/enums/app/app';

type Theme = typeof lightTheme;
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme); // Default theme

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getStorageItem(AsyncStorageVariables.LANGUAGE);
      if (savedTheme === 'dark') {
        setTheme(darkTheme);
      } else if (!savedTheme) {
        await AsyncStorage.setItem(AsyncStorageVariables.LANGUAGE, 'light');
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem(
      AsyncStorageVariables.LANGUAGE,
      newTheme === darkTheme ? 'dark' : 'light',
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
