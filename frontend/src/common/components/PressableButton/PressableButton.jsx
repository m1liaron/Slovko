import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./PressableButton.styles";

/**
 * @param text {string}
 * @param onPress {function}
 * @param buttonStyle {object}
 * @param disabled {Boolean}
 * @returns {JSX.Element}
 * @constructor
 */

const PressableButton = ({ text, onPress, buttonStyle, disabled }) => {
	return (
		<Pressable
			onPress={onPress}
			style={[styles.button, { ...buttonStyle }]}
			disabled={disabled}
		>
			<Text style={styles.buttonText}>{text}</Text>
		</Pressable>
	);
};

export default PressableButton;
