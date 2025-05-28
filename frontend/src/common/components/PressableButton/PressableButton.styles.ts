import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#007AFF",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		shadowColor: "#007AFF",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default styles;
