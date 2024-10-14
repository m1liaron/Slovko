import React from 'react';
import {Text, Pressable} from 'react-native'
import styles from './PressableButton.styles';

const PressableButton = ({
    text,
    onPress
}) => {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

export default PressableButton;
