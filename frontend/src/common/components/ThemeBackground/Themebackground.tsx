import React, { type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../../contexts/ThemeProvider";

interface ThemeBackgroundProps {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
}

const ThemeBackground = ({ children, style }: ThemeBackgroundProps) => {
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
