import PressableButton from '@/common/components/PressableButton/PressableButton';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IconImage from '@/assets/images/favicon.png';

const WelcomeScreen = () => {
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
            Welcome to Slovko
          </Text>
          <Text style={{ fontSize: 15 }}>Let's customize your learning</Text>
        </View>

        <PressableButton text="Start" buttonStyle={{ paddingVertical: 10 }} />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
