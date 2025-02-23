import React from "react";
import { Text, Pressable } from "react-native";
import styles from "./PressableButton.styles";
import { useAppTheme } from '../../../contexts/ThemeProvider';

/**
 * @param text {string}
 * @param onPress {function}
 * @param buttonStyle {object}
 * @param disabled {Boolean}
 * @returns {JSX.Element}
 * @constructor
 */

const PressableButton = ({ text, onPress, buttonStyle, disabled }) => {
	const { theme: { colors }} = useAppTheme();
	return (
		<Pressable onPress={onPress} style={[styles.button, { ...buttonStyle, backgroundColor: colors.buttonColor }]} disabled={disabled}>
			<Text style={styles.buttonText}>{text}</Text>
		</Pressable>
	);
};

export default PressableButton;
