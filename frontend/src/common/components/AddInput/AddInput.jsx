import React from 'react';
import { TextInput } from 'react-native'
import styles from './AddInput.styles';
import {useAppTheme} from "../../../contexts/ThemeProvider";

const AddInput = ({
    placeholder = '',
    placeholderTextColor,
    value = '',
    onChangeText
}) => {
    const { theme: { colors: { lightBackground, primary }}} = useAppTheme();
    return (
        <TextInput
            style={[styles.input, { backgroundColor: lightBackground, color: primary }]}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor || primary}
            value={value}
            onChangeText={onChangeText}
        />
    );
};


export default AddInput;
