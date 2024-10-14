import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import {showConfirmAlert} from "../../utils/showConfirmAlert";

const BackButton = ({ showAlert }) => {
    const navigation = useNavigation();

    const handleBack = () => {
        if (showAlert) {
            showConfirmAlert(
                "Are you sure you want to go back?",
                () => navigation.goBack(),
                () => console.log("Back action cancelled")
            );
        } else {
            navigation.goBack();
        }
    };

    return (
        <Pressable onPress={handleBack}>
            <AntDesign name="arrowleft" size={30} color="#000"/>
        </Pressable>
    )
}

export default BackButton;