import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	card: {
		marginBottom: 40,
	},
	cardCount: {
		fontSize: 30,
	},
	cardText: {
		fontSize: 30,
		fontWeight: "bold",
		borderRadius: 20,
		borderWidth: 2,
		padding: 20,
	},
	quizCardText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	quizCardDescription: {
		fontSize: 15,
	},
	button: {
		backgroundColor: "#007bff",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginHorizontal: 10,
	},
	crossIcon: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 20,
	},
	optionContainer: {
		flex: 1,
		backgroundColor: "#b4b4b4",
		padding: 20,
		borderRadius: 5,
		marginTop: 10,
		alignItems: "center",
		color: "#fff",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},

	progressContainer: {
		backgroundColor: "#c3c3c3",
		borderColor: "#000",
		borderRadius: 20,
		borderWidth: 2,
		width: "80%",
		height: 60,
		justifyContent: "flex-start",
		overflow: "hidden",
		marginBottom: 20,
	},

	progressInsideContainer: {
		backgroundColor: "#c5c50b",
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		height: "100%",
	},
});

export default styles;
