import React from "react";
import { View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./AddButton.styles";

/**
 * @param onPress {function} - react-native function for press on button
 * @param iconSize {number} - size of icons
 * @returns {JSX.Element}
 * @constructor
 */

interface AddButtonProps {
	onPress: () => void;
	iconSize?: number
} 

const AddButton = ({ onPress, iconSize = 30 }: AddButtonProps) => {
	return (
		<View style={styles.addButtonContainer}>
			<Pressable onPress={onPress} style={styles.addButton}>
				<Icon name="plus" size={iconSize} color="#007AFF" />
			</Pressable>
		</View>
	);
};
export default AddButton;
