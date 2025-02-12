import React from 'react';
import { Text, Pressable } from 'react-native';
import styles from './PressableButton.styles';

/**
 * @param text {string}
 * @param onPress {function}
 * @param buttonStyle {object}
 * @returns {JSX.Element}
 * @constructor
 */

const PressableButton = ({ text, onPress, buttonStyle }) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, { ...buttonStyle }]}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

export default PressableButton;
