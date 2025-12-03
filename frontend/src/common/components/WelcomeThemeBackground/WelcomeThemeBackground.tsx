import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
const WelcomeThemeBackground = () => {
  return (
    <LinearGradient
      colors={['#6f1f9d', '#7b2ff7', '#6e1d9d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
  );
};

export { WelcomeThemeBackground };
