import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../../contexts/ThemeProvider";

const ThemeBackground = ({ children, style }) => {
	const {
		theme: { colors },
	} = useAppTheme();
	return (
		<SafeAreaView
			style={[style, { flex: 1, backgroundColor: colors.background }]}
		>
			{children}
		</SafeAreaView>
	);
};

export default ThemeBackground;
