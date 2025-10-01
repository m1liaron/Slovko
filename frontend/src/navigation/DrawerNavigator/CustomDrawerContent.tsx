import { FlatList, Pressable, View } from 'react-native';
import styles from './CustomDrawerContent.styles';
import { useAppTheme } from '@/contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { Entypo, Feather } from '@expo/vector-icons';
import { i18n } from '@/localization/i18n';
import { useEffect, useState } from 'react';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import DefaultModal from '@/components/DefaultModal/DefaultModal';
import AddInput from '@/common/components/AddInput/AddInput';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import {
  addSection,
  setActiveSectionId,
} from '@/redux/sectionReducer/sectionSlice';
import { getLanguages } from '@/redux/languageReducer/languageThunk';
import { Language } from '@/common/enums/types/language.type';

const CustomDrawerContent = ({ handleClose }: { handleClose: () => void }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );
  const languages = useAppSelector((state) => state.languages.languages);

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState<Language | null>();
  const [newTitle, setNewTitle] = useState('');

  const onAddSection = () => {
    if (newTitle.length <= 2) {
      Toast.show({
        type: 'error',
        text1: 'Min Length of title is two',
      });
    }

    dispatch(addSection({ title: newTitle }));
    setNewTitle("");
  };

  const onAddSectionLanguage = () => {
    if (!chosenLanguage) {
      Toast.show({
        type: 'error',
        text1: 'Chose a language',
      });
      return;
    }

    setChosenLanguage(null);
    setShowLanguages(false);
    dispatch(addSection({ languageId: chosenLanguage.id }));
  };

  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showLanguages && languages.length > 0 ? (
        <View>
          <Pressable onPress={() => setShowLanguages(false)}>
            <Feather name="arrow-left" color={colors.primary} size={30} />
          </Pressable>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  borderColor:
                    chosenLanguage?.id === item.id ? colors.highlightColor : colors.primary,
                  borderWidth: 2,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 20,
                }}
                onPress={() => setChosenLanguage(item)}
              >
                <ThemeText>
                  {item.symbol} {item.title}
                </ThemeText>
              </Pressable>
            )}
          />

          <PressableButton
            text="Додати мову до вивчення"
            buttonStyle={{
              backgroundColor: 'transparent',
              borderColor: colors.highlightColor,
              borderWidth: 3,
            }}
            onPress={onAddSectionLanguage}
          />
        </View>
      ) : (
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ThemeText style={styles.header}>
              {i18n.t('mainScreen.sections')}
            </ThemeText>
            <Pressable onPress={handleClose}>
              <Entypo name="cross" size={30} color={colors.primary} />
            </Pressable>
          </View>

          <PressableButton
            text="Вибрати мову"
            buttonStyle={{
              backgroundColor: 'transparent',
              borderColor: colors.highlightDarkColor,
              borderWidth: 3,
            }}
            onPress={() => setShowLanguages(true)}
          />

          <View style={styles.divider} />

          <PressableButton
            text="Створити секцію"
            buttonStyle={{ backgroundColor: colors.highlightDarkColor }}  
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
                <ThemeText>{item.Language?.symbol} {item.title || item.Language?.title}</ThemeText>
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
              <PressableButton text="Додати" onPress={onAddSection} />
            </View>
          </DefaultModal>
        </View>
      )}
    </View>
  );
};

export { CustomDrawerContent };
