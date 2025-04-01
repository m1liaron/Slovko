import React from "react";
import { View, Text } from "react-native";
import styles from "./ExitModal.styles";
import DefaultModal from "../../DefaultModal/DefaultModal";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import ThemeText from "../../../common/components/ThemeText/ThemeText";

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
				<ThemeText
					style={{ color: colors.primary, fontWeight: "bold", fontSize: 40 }}
				>
					{text}
				</ThemeText>
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
