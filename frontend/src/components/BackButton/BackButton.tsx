import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { useAppTheme } from "../../contexts/ThemeProvider";
import { showConfirmAlert } from "../../utils/showConfirmAlert";

/**
 * @param showAlert {boolean}
 * @param iconSize {number}
 * @returns {JSX.Element}
 * @constructor
 */

interface BackButtonProps {
	showAlert?: boolean;
	iconSize?: number;
}

const BackButton = ({ showAlert, iconSize = 30 }: BackButtonProps) => {
	const navigation = useNavigation();
	const { theme } = useAppTheme();

	const handleBack = () => {
		if (showAlert) {
			showConfirmAlert(
				"Are you sure you want to go back?",
				() => navigation.goBack(),
				() => {},
			);
		} else {
			navigation.goBack();
		}
	};

	return (
		<Pressable onPress={handleBack}>
			<AntDesign
				name="arrowleft"
				size={iconSize}
				color={theme.colors.iconColor}
			/>
		</Pressable>
	);
};

export default BackButton;
