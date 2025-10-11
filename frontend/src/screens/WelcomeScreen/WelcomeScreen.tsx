import PressableButton from '@/common/components/PressableButton/PressableButton';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconImage from '@/assets/images/favicon.png';
import { i18n } from '@/localization/i18n';
import { AppPath } from '@/common/enums/app/AppPath';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigation>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Image source={IconImage} style={{ width: 150, height: 150 }} />
      <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <View>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            {i18n.t('welcomeScreen.welcome')}
          </Text>
          <Text style={{ fontSize: 15 }}>
            {i18n.t('welcomeScreen.customize')}
          </Text>
        </View>

        <PressableButton
          onPress={() => navigation.navigate(AppPath.ChooseLanguage)}
          text={i18n.t('welcomeScreen.start')}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
