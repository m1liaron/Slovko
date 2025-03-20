import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import DefaultModal from "../../DefaultModal/DefaultModal";
import styles from "./ExitModal.styles";

const ExitModal = ({ modalVisible, handleClose, text }) => {
	const navigation = useNavigation();
	const {
		theme: { colors },
	} = useAppTheme();

	const exitModal = () => {
		handleClose();
		navigation.goBack();
	};

	return (
		<DefaultModal isVisible={modalVisible} handleClose={handleClose}>
			<View>
				<Text
					style={{ color: colors.primary, fontWeight: "bold", fontSize: 40 }}
				>
					{text}
				</Text>
			</View>
			<View style={styles.buttonsContainer}>
				<PressableButton
					text="Так"
					onPress={exitModal}
					buttonStyle={{ flex: 1 }}
				/>
				<PressableButton
					text="Ні"
					onPress={handleClose}
					buttonStyle={{ flex: 1 }}
				/>
			</View>
		</DefaultModal>
	);
};

export default ExitModal;
