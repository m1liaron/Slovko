import React, { createContext, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from '../common/enums/app/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme); // Default theme

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setTheme(darkTheme);
      } else if (!savedTheme) {
        AsyncStorage.setItem('theme', 'light');
      } else {
        setTheme(lightTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem(
      'theme',
      newTheme === darkTheme ? 'dark' : 'light'
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
