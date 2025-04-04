import React from 'react';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemeBackground = ({ children, style }) => {
  const {theme: { colors }} = useAppTheme();
  return <SafeAreaView style={[ style, {  flex: 1, backgroundColor: colors.background }]}>{children}</SafeAreaView>;
};

export default ThemeBackground;
