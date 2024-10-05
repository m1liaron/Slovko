import React from 'react';
import {View, Pressable} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome";
import styles from './AddButton.styles';

const AddButton = ({ onPress, iconSize = 30 }) => {
    return (
        <View style={styles.addButtonContainer}>
            <Pressable onPress={onPress} style={styles.addButton}>
                <Icon name="plus" size={iconSize} color="#007AFF" />
            </Pressable>
        </View>
    );
};
export default AddButton;
