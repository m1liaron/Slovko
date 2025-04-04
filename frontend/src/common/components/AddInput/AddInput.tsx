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

interface AddInputProps {
	placeholder: string;
	placeholderTextColor: string;
	value: string;
	onChangeText: () => void
}

const AddInput = ({
	placeholder = "",
	placeholderTextColor,
	value = "",
	onChangeText,
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
				{ backgroundColor: lightBackground, color: primary },
			]}
			placeholder={placeholder}
			placeholderTextColor={placeholderTextColor || primary}
			value={value}
			onChangeText={onChangeText}
		/>
	);
};

export default AddInput;
