import React, {createContext, useContext} from 'react';
import { useColorScheme} from 'react-native'
import {darkTheme, lightTheme} from "../common/app/app";

const ThemeContext = createContext({});

export const ThemeProvider = (children) => {
    const colorScheme = useColorScheme();
    return (
        <ThemeContext.Provider
            value={colorScheme === 'dark' ? darkTheme : lightTheme }
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);