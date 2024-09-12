import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";

const BackButton = (handleFunction) => {
    const navigation = useNavigation();

    const handleBack = () => {
        return  handleFunction ? navigation.goBack() : handleFunction;
    }

    return (
        <Pressable onPress={handleBack}>
            <AntDesign name="arrowleft" size={30} color="#000"/>
        </Pressable>
    )
}

export default BackButton;