import React, { ReactNode } from 'react';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ThemeBackgroundProps {
  children: ReactNode;
  style?: {}
}

const ThemeBackground = ({ children, style }: ThemeBackgroundProps) => {
  const {theme: { colors }} = useAppTheme();
  return <SafeAreaView style={[ style, {  flex: 1, backgroundColor: colors.background }]}>{children}</SafeAreaView>;
};

export default ThemeBackground;
