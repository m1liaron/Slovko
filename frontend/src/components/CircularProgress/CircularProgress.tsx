import ThemeText from '@/common/components/ThemeText/ThemeText';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { i18n } from '@/localization/i18n';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 180;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  percentage: number; // e.g. 85
};

const CircularProgress = ({ percentage }: Props) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - percentage / 100)],
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          stroke={colors.lightBackground}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          stroke={colors.highlightColor}
          fill={colors.background}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={SIZE / 2}
          originY={SIZE / 2}
        />
      </Svg>
      <View style={styles.textContainer}>
        <ThemeText style={styles.percentage}>{percentage}%</ThemeText>
        <Text style={[styles.label, { color: colors.lightText }]}>
          {i18n.t('resultDetailsScreen.correctPercentage')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
});

export default CircularProgress;
