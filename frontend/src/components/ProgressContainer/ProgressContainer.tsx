import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "../../contexts/ThemeProvider";
import styles from "./ProgressContainer.styles";

/**
 * @param index {number}
 * @param length {number}
 * @returns {JSX.Element}
 * @constructor
 */

interface ProgressContainerProps {
	index: number;
	length: number;
}

const ProgressContainer = ({ index, length }: ProgressContainerProps) => {
	const {
		theme: { colors },
	} = useAppTheme();

	const procentLeft = (index / length) * 100;

	return (
		<View
			style={[
				styles.progressContainer,
				{
					backgroundColor: colors.lightBackground,
					borderColor: colors.primary,
				},
			]}
		>
			<View
				style={[styles.progressInsideContainer, { width: `${procentLeft}%` }]}
			>
				<Text style={{ fontSize: 25, margin: 5, color: "#686868" }}>
					{index + 1}/{length}
				</Text>
			</View>
		</View>
	);
};

export default ProgressContainer;
