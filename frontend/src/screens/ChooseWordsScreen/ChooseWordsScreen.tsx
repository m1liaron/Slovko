import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { i18n } from '@/localization/i18n';
import IconImage from '@/assets/images/favicon.png';
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hooks';
import { FlatList } from 'react-native-gesture-handler';
import languagesJson from '@/assets/data/languages.json';
import PressableButton from '@/common/components/PressableButton/PressableButton';

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
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
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

  return (
    <ThemeBackground
      style={{
        paddingHorizontal: 20,
        paddingVertical: 30,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          source={IconImage}
          style={{ width: width / 5, height: width / 5, marginBottom: 15 }}
          resizeMode="contain"
        />
        <ThemeText
          style={{
            fontSize: 26,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          {showLevel
            ? i18n.t('chooseWordsScreen.yourLevel')
            : i18n.t('chooseWordsScreen.chooseWords')}
          {showLevel && (
            <ThemeText style={{ fontSize: 15 }}>
              ({i18n.t('chooseWordsScreen.approxLevel')})
            </ThemeText>
          )}
        </ThemeText>

        {showLevel ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 100,
                backgroundColor: theme.colors.highlightColor,
              }}
            >
              <ThemeText
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                {userLevel()}
              </ThemeText>
            </View>
          </View>
        ) : (
          <>
            {words?.length > 0 && (
              <FlatList
                data={words}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                  justifyContent: 'center',
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
                      width: '45%',
                      minWidth: 150,
                      maxWidth: 250,
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
                    <ThemeText
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                      }}
                    >
                      {item.title}
                    </ThemeText>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}
      </View>

      {chosenWords.length >= 1 && (
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
          {showLevel && (
            <PressableButton
              buttonStyle={{ flex: 1 }}
              onPress={() => setShowLevel(false)}
              text={i18n.t('welcomeScreen.back')}
            />
          )}

          <PressableButton
            buttonStyle={{ flex: 1 }}
            onPress={() => setShowLevel(true)}
            text={i18n.t('welcomeScreen.next')}
          />
        </View>
      )}
    </ThemeBackground>
  );
};

export default ChooseWordsScreen;
