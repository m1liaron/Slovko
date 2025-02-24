import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	header: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: 'center',
		padding: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
	},
	resultContainer: {
		padding: 20,
	},
	mistakesAmountContainer: {
		padding: 10,
		borderRadius: 100,
		backgroundColor: "#ff0000",
		marginRight: 20,
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: 10,
		marginTop: 10,
	},
	title: {
		fontSize: 25,
		fontWeight: "bold",
	},
	wastedTimeContainer: {
		borderRadius: 10,
		borderWidth: 6,
		padding: 10,
	},
});

export default styles;
