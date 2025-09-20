import {
  Image,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import IconImage from '@/assets/images/favicon.png';
import { i18n } from '@/localization/i18n';
import { useAppTheme } from '@/contexts/ThemeProvider';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import { SearchInput } from '@/common/components/SearchInput/SearchInput';
import { useEffect, useState } from 'react';

// ⚠️ IDs should be unique (fixed here)
const languages = [
  { id: 1, title: 'English', flag: '🇬🇧' },
  { id: 2, title: 'German', flag: '🇩🇪' },
];

const ChooseLanguageScreen = () => {
  const { width } = useWindowDimensions();
  const {
    theme: { colors },
  } = useAppTheme();

  const [filteredLanguages, setFilteredLanguages] = useState<
    { id: number; title: string; flag: string }[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [chosenLanguage, setChoseLanguage] = useState<string>('');

  useEffect(() => {
    if (searchInput) {
      const filtered = languages.filter((language) =>
        language.title.includes(searchInput),
      );
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages(languages);
    }
  }, [searchInput]);

  return (
    <ThemeBackground
      style={{
        flex: 1,
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
            color: colors.text,
          }}
        >
          {i18n.t('chooseLanguageScreen.whichLanguage')}
        </ThemeText>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SearchInput
          customStyles={{ width: '50%' }}
          value={searchInput}
          onChange={(value) => setSearchInput(value)}
        />
      </View>

      {/* Language List */}
      {filteredLanguages.length === 0 ? (
        <ThemeText style={{ fontSize: 30, textAlign: 'center' }}>
          No Language found
        </ThemeText>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {filteredLanguages.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setChoseLanguage(item.title)}
              style={{
                width: '45%', // about half of screen
                minWidth: 150,
                maxWidth: 250,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 18,
                paddingHorizontal: 20,
                backgroundColor:
                  chosenLanguage === item.title
                    ? colors.highlightColor
                    : colors.lightBackground,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 28, marginRight: 15 }}>{item.flag}</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color:
                    chosenLanguage === item.title
                      ? colors.primary
                      : colors.text,
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ThemeBackground>
  );
};

export default ChooseLanguageScreen;
