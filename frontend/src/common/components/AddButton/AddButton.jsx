import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome";

const AddButton = ({ onPress, iconSize = 30 }) => {
    return (
        <View style={styles.addButtonContainer}>
            <Pressable onPress={onPress} style={styles.addButton}>
                <Icon name="plus" size={iconSize} color="#000" />
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({})

export default AddButton;
