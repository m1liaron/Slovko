import PressableButton from '@/common/components/PressableButton/PressableButton';
import { Image, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconImage from '@/assets/images/favicon.png';
import { i18n } from '@/localization/i18n';
import { AppPath } from '@/common/enums/app/AppPath';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import ThemeText from '@/common/components/ThemeText/ThemeText';

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const { width } = useWindowDimensions();

  return (
    <ThemeBackground
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: width < 720 ? 'column' : 'row',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Image source={IconImage} style={{ width: 150, height: 150 }} />
      <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <View>
          <ThemeText
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: width < 720 ? 'center' : 'auto',
            }}
          >
            {i18n.t('welcomeScreen.welcome')}
          </ThemeText>
          <ThemeText style={{ fontSize: 15 }}>
            {i18n.t('welcomeScreen.customize')}
          </ThemeText>
        </View>

        <PressableButton
          onPress={() => navigation.navigate(AppPath.ChooseLanguage)}
          text={i18n.t('welcomeScreen.start')}
          textStyle={{ color: '#fff' }}
        />
      </View>
    </ThemeBackground>
  );
};

export default WelcomeScreen;
