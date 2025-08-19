import { Pressable, Text, View } from 'react-native';
import styles from './CustomDrawerContent.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { Entypo } from '@expo/vector-icons';
import { i18n } from '@/localization/i18n';

const CustomDrawerContent = ({ handleClose }: { handleClose: () => void }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ThemeText style={styles.header}>
          {i18n.t('mainScreen.sections')}
        </ThemeText>
        <Pressable onPress={handleClose}>
          <Entypo name="cross" size={30} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.divider} />
    </View>
  );
};

export { CustomDrawerContent };
