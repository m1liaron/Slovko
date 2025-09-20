import { FlatList, Pressable, View } from 'react-native';
import styles from './CustomDrawerContent.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { Entypo } from '@expo/vector-icons';
import { i18n } from '@/localization/i18n';
import { useEffect, useState } from 'react';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import DefaultModal from '@/components/DefaultModal/DefaultModal';
import AddInput from '@/common/components/AddInput/AddInput';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import {
  addSection,
  getSections,
  setActiveSectionId,
} from '@/redux/sectionReducer/sectionSlice';

const CustomDrawerContent = ({ handleClose }: { handleClose: () => void }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const onAddTitle = () => {
    if (newTitle.length <= 2) {
      Toast.show({
        type: 'success',
        text1: 'Min Length of title is two',
      });
    }

    dispatch(addSection(newTitle));
  };

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

      <PressableButton
        text="Створити секцію"
        onPress={() => setShowSectionModal(true)}
      />

      <FlatList
        data={sections}
        renderItem={({ item }) => (
          <Pressable
            style={{
              borderColor:
                activeSectionId === item.id
                  ? colors.highlightColor
                  : colors.lightBackground,
              borderWidth: 2,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
            }}
            onPress={() => dispatch(setActiveSectionId(item.id))}
          >
            <ThemeText>{item.title}</ThemeText>
          </Pressable>
        )}
      />

      <DefaultModal
        isVisible={showSectionModal}
        handleClose={() => setShowSectionModal(false)}
      >
        <View>
          <AddInput
            placeholder="Назва секції"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <PressableButton text="Додати" onPress={onAddTitle} />
        </View>
      </DefaultModal>
    </View>
  );
};

export { CustomDrawerContent };
