import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import styles from './PressableButton.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

interface PressableButtonProps {
  text: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  gradientColor?: string;
  disabled?: boolean;
}

const PressableButton = ({
  text,
  onPress,
  buttonStyle,
  gradientColor,
  textStyle,
  disabled,
}: PressableButtonProps) => {
  const {
    theme: {
      colors: { highlightColor, highlightDarkColor },
    },
  } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.9 : 1 },
        { borderRadius: 14, overflow: 'hidden' },
        buttonStyle,
      ]}
      disabled={disabled}
    >
      <LinearGradient
        colors={[gradientColor || highlightColor, highlightDarkColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={[styles.buttonText, { color: '#fff' }, textStyle]}>
          {text}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

export default PressableButton;
