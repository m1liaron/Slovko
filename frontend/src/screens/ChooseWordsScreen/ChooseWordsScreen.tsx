import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { i18n } from '@/localization/i18n';
import IconImage from '@/assets/images/favicon.png';
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hooks';
import languagesJson from '@/assets/data/languages.json';
import { FlatList } from 'react-native-gesture-handler';

type Word = {
  id: number;
  title: string;
};

type LanguagesData = {
  English: Word[];
  German: Word[];
};

const languages: LanguagesData = languagesJson;

const ChooseWordsScreen = () => {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const { selectedLanguage } = useAppSelector((state) => state.sections);
  const [words, setWords] = useState<Word[]>([]);
  const [chosenWords, setChosenWords] = useState<string[]>([]);

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

  return (
    <ThemeBackground
      style={{
        paddingHorizontal: 20,
        paddingVertical: 30,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
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
          }}
        >
          {i18n.t('chooseWordsScreen.chooseWords')}
        </ThemeText>
      </View>

      {words?.length > 0 && (
        <>
          <FlatList
            data={words}
            numColumns={2} // ✅ two columns
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              justifyContent: 'center',
              paddingBottom: 40,
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
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </ThemeBackground>
  );
};

export default ChooseWordsScreen;
