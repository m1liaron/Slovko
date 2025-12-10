import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	centeredContainer: {
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	sectionContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
	},
	resultItemContainer: {
		borderWidth: 3,
		borderRadius: 5,
		padding: 10,
	},
});

export default styles;
