import React from 'react';
import {View, Text} from 'react-native'
import styles from './ProgressContainer.styles';

const ProgressContainer = ({index, length}) => {

    const procentLeft  = (index) / length * 100;


    return (
        <View style={styles.progressContainer}>
            <View
                style={[
                    styles.progressInsideContainer,
                    { width: `${procentLeft}%` },
                ]}
            >
                <Text style={{ fontSize: 25, margin: 5 }}>
                    {index + 1}/{length}
                </Text>
            </View>
        </View>
    );
};

export default ProgressContainer;
