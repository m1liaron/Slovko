import React from "react";
import { Text } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";

/**
 * @param children {object}
 * @returns {JSX.Element}
 * @constructor
 */

const ThemeText = ({ children }) => {
	const {
		theme: {
			colors: { primary },
		},
	} = useAppTheme();
	return <Text style={{ color: primary }}>{children}</Text>;
};

export default ThemeText;
