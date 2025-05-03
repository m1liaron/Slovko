import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import ThemeText from "../../../common/components/ThemeText/ThemeText";
import { useAppTheme } from "../../../contexts/ThemeProvider";
import DefaultModal from "../../DefaultModal/DefaultModal";
import styles from "./ExitModal.styles";

interface ExitModalProps {
	modalVisible: boolean;
	handleClose: () => void;
	text: string;
}

const ExitModal = ({ modalVisible, handleClose, text }: ExitModalProps) => {
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
				<ThemeText style={{ fontWeight: "bold", fontSize: 30, marginBottom: 20 }}>
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
