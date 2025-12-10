import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import languagesJson from '@/assets/data/languages.json';
import IconImage from '@/assets/images/favicon.png';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { WelcomeThemeBackground } from '@/common/components/WelcomeThemeBackground/WelcomeThemeBackground';
import { AppPath } from '@/common/enums/app/AppPath';
import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import {
  addSection,
  addStateSection,
} from '@/redux/sectionReducer/sectionSlice';
import { removeStorageItem, setStorageItem } from '@/utils/storage';

type Word = {
  id: number;
  title: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
};

type LanguagesData = {
  English: Word[];
  German: Word[];
};

const levelValues: Record<Word['level'], number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const getLevelFromScore = (avg: number) => {
  if (avg < 1.5) return 'A1';
  if (avg < 2.5) return 'A2';
  if (avg < 3.5) return 'B1';
  if (avg < 4.5) return 'B2';
  if (avg < 5.5) return 'C1';
  return 'C2';
};
const languages = languagesJson as LanguagesData;

const ChooseWordsScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { selectedLanguage } = useAppSelector((state) => state.sections);
  const [words, setWords] = useState<Word[]>([]);
  const [chosenWords, setChosenWords] = useState<string[]>([]);
  const [showLevel, setShowLevel] = useState(false);

  useEffect(() => {
    if (selectedLanguage?.length > 0) {
      setWords(languages[selectedLanguage as keyof typeof languages]);
    }
  }, [selectedLanguage]);

  const handleSetChosenWord = (newWord: Word) => {
    if (chosenWords.includes(newWord.title)) {
      setChosenWords((prev) => prev.filter((word) => word !== newWord.title));
    } else {
      setChosenWords((prev) => [...prev, newWord.title]);
    }
  };

  const userLevel = () => {
    if (chosenWords.length === 0) return null;

    // Find the highest level where user knows at least 80% of words
    const levelOrder: Word['level'][] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    for (let i = levelOrder.length - 1; i >= 0; i--) {
      const currentLevel = levelOrder[i];
      const wordsAtLevel = words.filter((w) => w.level === currentLevel);
      const knownAtLevel = wordsAtLevel.filter((w) =>
        chosenWords.includes(w.title),
      );

      if (wordsAtLevel.length > 0) {
        const percentage = knownAtLevel.length / wordsAtLevel.length;

        // If user knows 80%+ of words at this level, that's their level
        if (percentage >= 0.8) {
          return currentLevel;
        }
      }
    }

    // Fallback: return the highest level of any known word
    const known = words.filter((w) => chosenWords.includes(w.title));
    const highestKnown = Math.max(...known.map((w) => levelValues[w.level]));
    return getLevelFromScore(highestKnown);
  };

  const percentage = () => {
    const level = userLevel();
    if (level) {
      return level.includes('A') ? 25 : level.includes('B') ? 75 : 100;
    }
  };

  const handleBack = () => {
    setShowLevel(false);
    navigation.navigate(AppPath.ChooseLanguage);
  };

  const contentWidth = width < 720 ? '100%' : '50%';

  const navigateToRegister = async () => {
    await setStorageItem(AsyncStorageVariables.FIRST_START, 'false');
    navigation.navigate(AppPath.Register);
  };

  const navigateToMain = async () => {
    await setStorageItem(AsyncStorageVariables.FIRST_START, 'false');
    navigation.navigate(AppPath.Home);
    if (selectedLanguage) {
      dispatch(
        enqueueOrDispatch(addSection, addStateSection, {
          title: selectedLanguage,
        }),
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
      }}
    >
      <WelcomeThemeBackground />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={IconImage}
            style={{
              width: width < 720 ? width / 5 : width / 10,
              height: width < 720 ? width / 5 : width / 10,
              marginBottom: 15,
            }}
            resizeMode="contain"
          />
          <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#fff' }}>
            Slovko
          </Text>
        </View>
        <Text
          style={{
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 40,
            color: '#fff',
          }}
        >
          {showLevel
            ? i18n.t('chooseWordsScreen.slogan')
            : i18n.t('chooseWordsScreen.chooseWords')}
        </Text>

        {showLevel ? (
          <>
            <View
              style={{
                flex: 1,
                width: contentWidth,
                backgroundColor: theme.colors.lightBackground,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <EvilIcons
                      name="trophy"
                      color={theme.colors.iconColor}
                      size={25}
                    />
                    <ThemeText style={{ fontSize: 20 }}>
                      {i18n.t('chooseWordsScreen.yourLevel')}
                    </ThemeText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      borderRadius: 15,
                      backgroundColor: theme.colors.highlightDarkColor,
                      padding: 10,
                    }}
                  >
                    <AntDesign name="star" color="#fff" />
                    <Text style={{ color: '#fff' }}>{userLevel()}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 5,
                    borderRadius: 40,
                    backgroundColor: theme.colors.lightText,
                    padding: 5,
                    marginVertical: 10,
                    zIndex: 0,
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      width: `${percentage() || 10}%`,
                      height: 10,
                      borderRadius: 40,
                      zIndex: 1,
                      top: 0,
                      left: 0,
                      backgroundColor: theme.colors.highlightColor,
                    }}
                  ></View>
                </View>

                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <Entypo
                    name="globe"
                    size={20}
                    color={theme.colors.iconColor}
                  />
                  <ThemeText>Learning Language</ThemeText>
                </View>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    padding: 20,
                    borderRadius: 20,
                    borderColor: theme.colors.highlightColor,
                    borderWidth: 3,
                    marginVertical: 10,
                  }}
                >
                  <ThemeText>{selectedLanguage}</ThemeText>
                </View>
                <PressableButton
                  onPress={handleBack}
                  text={`< ${i18n.t('chooseWordsScreen.changeLanguage')}`}
                />
              </View>
            </View>
            <View style={{ gap: 10, width: contentWidth, margin: 10 }}>
              <PressableButton
                onPress={navigateToRegister}
                text={i18n.t('chooseWordsScreen.withRegistration')}
              />
              <PressableButton
                onPress={navigateToMain}
                gradientColor={theme.colors.highlightDarkColor}
                text={i18n.t('chooseWordsScreen.withoutRegistration')}
              />
            </View>
          </>
        ) : (
          <>
            {words?.length > 0 && (
              <FlatList
                data={words}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 10,
                  flexWrap: 'wrap',
                  paddingBottom: 100, // leave space for buttons
                }}
                columnWrapperStyle={{
                  justifyContent: 'center',
                  gap: 16,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSetChosenWord(item)}
                    style={{
                      minWidth: 150,
                      marginBottom: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 18,
                      paddingHorizontal: 20,
                      backgroundColor: chosenWords.includes(item.title)
                        ? theme.colors.highlightColor
                        : theme.colors.lightBackground,
                      borderRadius: 16,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color:
                          chosenWords.includes(item.title) || theme.dark
                            ? '#fff'
                            : '#000',
                      }}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}
      </View>

      {!showLevel && (
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 10,
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
          }}
        >
          <PressableButton
            buttonStyle={{ flex: 1 }}
            onPress={handleBack}
            text={i18n.t('welcomeScreen.back')}
          />
          {chosenWords.length >= 1 && (
            <PressableButton
              buttonStyle={{ flex: 1 }}
              onPress={() => setShowLevel(true)}
              text={i18n.t('welcomeScreen.next')}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChooseWordsScreen;
