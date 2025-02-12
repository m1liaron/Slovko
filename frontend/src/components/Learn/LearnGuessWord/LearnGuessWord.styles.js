import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	wordContainer: {
		width: "100%",
		height: 300,
		overflow: "auto",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	word: {
		padding: 20,
		margin: 5,
		borderWidth: 5,
		borderRadius: 10,
	},
	wordText: {
		fontSize: 40,
		fontWeight: "bold",
	},
});

export default styles;
