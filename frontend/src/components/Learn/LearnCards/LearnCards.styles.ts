import { Dimensions, StyleSheet } from "react-native";

const CARD_WIDTH = Dimensions.get("window").width - 800;

const styles = StyleSheet.create({
	cardContainer: {
		width: "90%",
		height: "100%",
	},
	card: {
		width: "100%",
		height: "80%",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 6,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	cardText: {
		fontSize: 35,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 10,
		flexWrap: "wrap",
		width: "90%",
	},
	cardDescription: {
		fontSize: 14,
		color: "#777",
		textAlign: "center",
		marginTop: 8,
	},
	iconButton: {
		marginTop: 10,
		padding: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 50,
	},
	swipeFeedbackView: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -50 }, { translateY: -50 }],
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 12,
	},
	swipeText: {
		color: "#ffffff",
		fontSize: 28,
		fontWeight: "700",
		textAlign: "center",
	},
	overlayLabelLeftTitle: {
		color: "white",
		backgroundColor: "#ff6b6b",
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 8,
		fontSize: 16,
		fontWeight: "700",
		maxWidth: CARD_WIDTH - 40,
	},
	overlayLabelLeftWrapper: {
		position: "absolute",
		top: "-35%",
		left: 100,
		transform: [{ translateY: -20 }],
		justifyContent: "center",
		alignItems: "center",
	},
	overlayLabelRightTitle: {
		color: "white",
		backgroundColor: "#1dd1a1",
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 8,
		fontSize: 16,
		fontWeight: "700",
		maxWidth: CARD_WIDTH - 40, // Ensures the label doesn't exceed card width
	},
	overlayLabelRightWrapper: {
		position: "absolute",
		top: "-35%",
		right: 100,
		transform: [{ translateY: -20 }], // Adjusts the label to be centered vertically
		justifyContent: "center",
		alignItems: "center",
	},
});

export default styles;