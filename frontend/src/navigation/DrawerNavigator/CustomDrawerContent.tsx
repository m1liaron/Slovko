import { FlatList, Pressable, Text, View } from 'react-native';
import styles from './CustomDrawerContent.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { Entypo } from '@expo/vector-icons';
import { i18n } from '@/localization/i18n';
import { useEffect, useState } from 'react';
import { createAuthorizedInstance } from '@/utils';
import PressableButton from '@/common/components/PressableButton/PressableButton';

const CustomDrawerContent = ({ handleClose }: { handleClose: () => void }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const [sections, setSections] = useState<[]>();

  const fetchSections = async () => {
    try {
      const axiosInstance = await createAuthorizedInstance();
      const res = await axiosInstance.get('/sections');
      console.log(res);
      setSections(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  console.log(sections);

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

      {sections && sections.length === 0 ? (
        <PressableButton text="Створити секцію" />
      ) : (
        <FlatList
          data={sections}
          renderItem={({ item }) => <ThemeText>{item}</ThemeText>}
        />
      )}
    </View>
  );
};

export { CustomDrawerContent };
