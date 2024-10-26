import React from 'react';
import {View, Text, StyleSheet} from 'react-native'
import styles from './ExitModal.styles';
import DefaultModal from "../../DefaultModal/DefaultModal";
import PressableButton from "../../../common/components/PressableButton/PressableButton";
import {useNavigation} from "@react-navigation/native";

const ExitModal = ({
    modalVisible,
    handleClose,
    text,
}) => {
    const navigation = useNavigation();

    const exitModal = () => {
        handleClose();
        navigation.goBack();
    }

    return (
        <DefaultModal
            isVisible={modalVisible}
            handleClose={handleClose}
        >
            <View>
                <Text>{text}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <PressableButton text="Так" onPress={exitModal} />
                <PressableButton text="Ні" onPress={handleClose} />
            </View>
        </DefaultModal>
    );
};

export default ExitModal;
