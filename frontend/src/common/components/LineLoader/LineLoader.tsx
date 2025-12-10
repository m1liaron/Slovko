import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeProvider';

const LineLoader: React.FC = () => {
  const {
    theme: {
      colors: { highlightColor },
    },
  } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();

  const lineWidth = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(lineWidth, {
          toValue: screenWidth,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(lineWidth, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: highlightColor,
            opacity,
            width: lineWidth,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 4,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  line: {
    height: '100%',
    borderRadius: 2,
  },
});

export { LineLoader };
