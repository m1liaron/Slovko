import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	formContainer: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	image: {
		width: 100,
		height: 100,
		marginVertical: 10,
		borderRadius: 10,
	},
	listContainer: {
		marginHorizontal: 30,
		gap: 10,
	},
	modeToggle: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	modeButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 5,
	},
	bulkAddContainer: {
		paddingVertical: 10,
	},
	fileInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f1f1f1",
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	fileInput: {
		marginLeft: 10,
		fontSize: 16,
	},
	jsonTableContainer: {
		marginTop: 10,
	},
	jsonTableTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	jsonTable: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		backgroundColor: "#f9f9f9",
		height: 400,
	},
	jsonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	jsonKey: {
		fontWeight: "bold",
		fontSize: 16,
		flex: 1,
	},
	jsonValue: {
		fontSize: 16,
		flex: 1,
		textAlign: "right",
	},
	singleAddContainer: {
		marginTop: 10,
	},
	inputField: {
		marginVertical: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
	},
	imagePreview: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginVertical: 10,
	},
	saveButton: {
		marginTop: 20,
	},
});

export default styles;
