import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import styles from './PressableButton.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';

/**
 * @param text {string}
 * @param onPress {function}
 * @param buttonStyle {object}
 * @param disabled {Boolean}
 * @returns {JSX.Element}
 * @constructor
 */

interface PressableButtonProps {
  text: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const PressableButton = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  disabled,
}: PressableButtonProps) => {
  const {
    theme: {
      colors: { highlightColor, primary },
    },
  } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: highlightColor,
          shadowColor: highlightColor,
          ...buttonStyle,
        },
      ]}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: primary, ...textStyle }]}>
        {text}
      </Text>
    </Pressable>
  );
};

export default PressableButton;
