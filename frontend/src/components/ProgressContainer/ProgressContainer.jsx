import React from 'react';
import { View, Text } from 'react-native';
import styles from './ProgressContainer.styles';
import { useAppTheme } from '../../contexts/ThemeProvider';

/**
 * @param index {number}
 * @param length {number}
 * @returns {JSX.Element}
 * @constructor
 */

const ProgressContainer = ({ index, length }) => {
  const {
    theme: { colors },
  } = useAppTheme();

  const procentLeft = (index / length) * 100;

  return (
    <View
      style={[
        styles.progressContainer,
        {
          backgroundColor: colors.lightBackground,
          borderColor: colors.primary,
        },
      ]}
    >
      <View
        style={[styles.progressInsideContainer, { width: `${procentLeft}%` }]}
      >
        <Text style={{ fontSize: 25, margin: 5, color: '#686868' }}>
          {index + 1}/{length}
        </Text>
      </View>
    </View>
  );
};

export default ProgressContainer;
