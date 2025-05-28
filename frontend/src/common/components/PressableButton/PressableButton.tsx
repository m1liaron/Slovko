import React from "react";
import { Pressable } from "react-native";
import styles from "./PressableButton.styles";
import ThemeText from "../ThemeText/ThemeText";

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
			<ThemeText style={styles.buttonText}>{text}</ThemeText>
		</Pressable>
	);
};

export default PressableButton;
