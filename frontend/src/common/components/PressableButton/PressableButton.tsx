import React from 'react';
import { Pressable } from 'react-native';
import ThemeText from '../ThemeText/ThemeText';
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
  buttonStyle?: object;
  disabled?: boolean;
}

const PressableButton = ({
  text,
  onPress,
  buttonStyle,
  disabled,
}: PressableButtonProps) => {
  const {
    theme: {
      colors: { highlightColor, background },
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
      <ThemeText style={[styles.buttonText, { color: background }]}>
        {text}
      </ThemeText>
    </Pressable>
  );
};

export default PressableButton;
