import React, { type ReactNode } from 'react';
import { type StyleProp, Text, type TextStyle } from 'react-native';

import { useAppTheme } from '../../../contexts/ThemeProvider';

/**
 * @param children {ReactNode}
 * @param style {object}
 * @returns {JSX.Element}
 * @constructor
 */

interface ThemeTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'middle' | 'head' | 'tail' | 'clip';
}

const ThemeText = ({
  children,
  style,
  numberOfLines,
  ellipsizeMode,
}: ThemeTextProps) => {
  const {
    theme: {
      colors: { primary },
    },
  } = useAppTheme();
  return (
    <Text
      style={[style, { color: primary }]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

export default ThemeText;
