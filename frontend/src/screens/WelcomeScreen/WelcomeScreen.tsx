import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Text,
  useWindowDimensions,
  View,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconImage from '@/assets/images/favicon.png';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import { WelcomeThemeBackground } from '@/common/components/WelcomeThemeBackground/WelcomeThemeBackground';
import { AppPath } from '@/common/enums/app/AppPath';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { useAppTheme } from '@/contexts/ThemeProvider';

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const { width } = useWindowDimensions();
  const {
    theme: { colors },
  } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* static gradient background */}
      <WelcomeThemeBackground />

      {/* Floating background letters */}
      {['A', 'B', 'C', 'Ä', 'Ü', 'Я'].map((char, i) => (
        <Animated.Text
          key={i}
          entering={FadeInDown.delay(i * 500).duration(2000)}
          style={[
            styles.floatingLetter,
            {
              top: `${10 + i * 12}%`,
              left: `${(i * 25) % 80}%`,
              fontSize: 30 + (i % 3) * 10,
            },
          ]}
        >
          {char}
        </Animated.Text>
      ))}

      {/* Main content */}
      <View
        style={[
          styles.center,
          { flexDirection: width < 720 ? 'column' : 'row' },
        ]}
      >
        <Animated.Image
          source={IconImage}
          style={styles.logo}
          entering={FadeInDown.duration(1000)}
        />
        <Animated.View
          style={[styles.glassBox, { width: width < 720 ? '85%' : 350 }]}
          entering={FadeInUp.delay(300).duration(1000)}
        >
          <Text style={styles.title}>{i18n.t('welcomeScreen.welcome')} 👋</Text>
          <Text style={styles.subtitle}>{i18n.t('welcomeScreen.journey')}</Text>

          <PressableButton
            onPress={() => navigation.navigate(AppPath.ChooseLanguage)}
            text={i18n.t('welcomeScreen.start')}
            buttonStyle={{ width: '100%' }}
          />
        </Animated.View>
      </View>

      <View style={{ position: 'absolute', bottom: 0, right: 0, padding: 15 }}>
        <PressableButton
          onPress={() => navigation.navigate(AppPath.Register)}
          text={i18n.t('welcomeScreen.skip')}
          buttonStyle={{ width: '100%' }}
          gradientColor={colors.danger}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  floatingLetter: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.1)',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  glassBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 14,
    elevation: 3,
  },
});
