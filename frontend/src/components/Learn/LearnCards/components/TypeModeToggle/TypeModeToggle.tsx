import Checkbox from 'expo-checkbox';
import { View } from 'react-native';

import ThemeText from '@/common/components/ThemeText/ThemeText';
import { i18n } from '@/localization/i18n';

interface TypeModeToggleProps {
  typeMode: boolean;
  onToggle: (value: boolean) => void;
}

export const TypeModeToggle: React.FC<TypeModeToggleProps> = ({
  typeMode,
  onToggle,
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 40,
        bottom: 5,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Checkbox value={typeMode} onValueChange={onToggle} />
      <ThemeText>{i18n.t('learnScreen.learnCards.answer')}</ThemeText>
    </View>
  );
};
