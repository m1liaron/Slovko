import React, { ReactNode } from "react";
import { Text } from "react-native";
import { useAppTheme } from "../../../contexts/ThemeProvider";

/**
 * @param children {object}
 * @param style {object}
 * @returns {JSX.Element}
 * @constructor
 */

interface ThemeTextProps {
	children: ReactNode;
	style: {}
}

const ThemeText = ({ children, style }: ThemeTextProps) => {
	const {
		theme: {
			colors: { primary },
		},
	} = useAppTheme();
	return <Text style={[ style ,{ color: primary }]}>{children}</Text>;
};

export default ThemeText;
