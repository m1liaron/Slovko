import React from 'react';
import { TextInput } from 'react-native'
import styles from './AddInput.styles';

const AddInput = ({
    placeholder = '',
    placeholderTextColor = '#000',
    value = '',
    onChangeText
}) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
        />
    );
};


export default AddInput;
