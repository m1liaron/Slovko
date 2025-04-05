import React from "react";
import { GestureResponderEvent, Pressable, Text } from "react-native";
import styles from "./PressableButton.styles";

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
