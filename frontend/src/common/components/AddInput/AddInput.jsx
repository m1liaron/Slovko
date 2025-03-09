import React from "react";
import { TextInput } from "react-native";
import styles from "./AddInput.styles";
import { useAppTheme } from "../../../contexts/ThemeProvider";

/**
 * @param placeholder { string }
 * @param placeholderTextColor {string}
 * @param value {string}
 * @param onChangeText {function}
 * @returns {JSX.Element}
 * @constructor
 */

const AddInput = ({
	placeholder = "",
	placeholderTextColor,
	value = "",
	onChangeText,
	onFocus
}) => {
	const {
		theme: {
			colors: { lightBackground, primary },
		},
	} = useAppTheme();
	return (
		<TextInput
			style={[
				styles.input,
				{ backgroundColor: lightBackground, color: primary },
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
