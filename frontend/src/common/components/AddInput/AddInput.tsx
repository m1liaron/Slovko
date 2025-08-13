import React from 'react';
import {
  StyleProp,
  TextInput,
  ViewStyle,
  type TextInputProps,
} from 'react-native';
import { useAppTheme } from '../../../contexts/ThemeProvider';
import styles from './AddInput.styles';

/**
 * @param placeholder { string }
 * @param placeholderTextColor {string}
 * @param value {string}
 * @param onChangeText {function}
 * @returns {JSX.Element}
 * @constructor
 */

interface AddInputProps
  extends Pick<
    TextInputProps,
    | 'placeholder'
    | 'placeholderTextColor'
    | 'value'
    | 'onChangeText'
    | 'onFocus'
  > {
  height?: number;
}

const AddInput = ({
  placeholder = '',
  placeholderTextColor,
  value = '',
  onChangeText,
  onFocus,
  height,
}: AddInputProps) => {
  const {
    theme: {
      colors: { lightBackground, primary },
    },
  } = useAppTheme();
  return (
    <TextInput
      style={[
        styles.input,
        { backgroundColor: lightBackground, color: primary, height },
      ]}
      onFocus={onFocus}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || primary}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default AddInput;
