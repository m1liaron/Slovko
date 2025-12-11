import { Entypo, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, useWindowDimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';

import AddInput from '@/common/components/AddInput/AddInput';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import type { Language } from '@/common/enums/types/language.type';
import DefaultModal from '@/components/DefaultModal/DefaultModal';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import { getLanguages } from '@/redux/languageReducer/languageThunk';
import {
  addSection,
  addStateSection,
  setActiveSectionId,
} from '@/redux/sectionReducer/sectionSlice';
import { HAS_TOKEN } from '@/utils/storage/initToken';

import styles from './CustomDrawerContent.styles';

const CustomDrawerContent = ({ handleClose }: { handleClose: () => void }) => {
  const {
    theme: { colors },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );
  const { width } = useWindowDimensions();
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
      return;
    }

    dispatch(
      enqueueOrDispatch(addSection, addStateSection, { title: newTitle }),
    );
    setNewTitle('');
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
    <View
      style={[
        styles.container,
        { width: width / 2, backgroundColor: colors.background },
      ]}
    >
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
                    chosenLanguage?.id === item.id
                      ? colors.highlightColor
                      : colors.primary,
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
            text={i18n.t('mainScreen.drawer.addLanguage')}
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

          {HAS_TOKEN && languages.length > 0 && (
            <>
              <PressableButton
                text={i18n.t('mainScreen.drawer.chooseLanguage')}
                onPress={() => setShowLanguages(true)}
              />

              <View style={styles.divider} />
            </>
          )}

          <PressableButton
            text={i18n.t('mainScreen.drawer.createLanguage')}
            onPress={() => setShowSectionModal(true)}
          />

          <FlatList
            data={sections}
            contentContainerStyle={{ margin: 10 }}
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
                <ThemeText>
                  {item.Language?.symbol} {item.title || item.Language?.title}
                </ThemeText>
              </Pressable>
            )}
          />

          <DefaultModal
            isVisible={showSectionModal}
            handleClose={() => setShowSectionModal(false)}
          >
            <View style={{ gap: 20 }}>
              <AddInput
                placeholder={i18n.t('mainScreen.drawer.nameSection')}
                value={newTitle}
                onChangeText={setNewTitle}
                height={60}
              />
              <PressableButton
                text={i18n.t('mainScreen.drawer.add')}
                onPress={onAddSection}
              />
            </View>
          </DefaultModal>
        </View>
      )}
    </View>
  );
};

export { CustomDrawerContent };
