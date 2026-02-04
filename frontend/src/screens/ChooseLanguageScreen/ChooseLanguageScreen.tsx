import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconImage from '@/assets/images/favicon.png';
import PressableButton from '@/common/components/PressableButton/PressableButton';
import { SearchInput } from '@/common/components/SearchInput/SearchInput';
import { WelcomeThemeBackground } from '@/common/components/WelcomeThemeBackground/WelcomeThemeBackground';
import { AppPath } from '@/common/enums/app/AppPath';
import Loading from '@/components/Loading';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { setSelectedLanguage } from '@/redux/sectionReducer/sectionSlice';

const languages = [
  { id: 1, title: i18n.t('chooseLanguageScreen.english'), flag: '🇬🇧' },
  { id: 2, title: i18n.t('chooseLanguageScreen.german'), flag: '🇩🇪' },
  { id: 3, title: i18n.t('chooseLanguageScreen.spanish'), flag: '🇪🇸' },
  { id: 4, title: i18n.t('chooseLanguageScreen.french'), flag: '🇫🇷' },
  { id: 5, title: i18n.t('chooseLanguageScreen.italian'), flag: '🇮🇹' },
  { id: 6, title: i18n.t('chooseLanguageScreen.portuguese'), flag: '🇵🇹' },
  { id: 8, title: i18n.t('chooseLanguageScreen.chinese'), flag: '🇨🇳' },
  { id: 9, title: i18n.t('chooseLanguageScreen.japanese'), flag: '🇯🇵' },
  { id: 10, title: i18n.t('chooseLanguageScreen.korean'), flag: '🇰🇷' },
  { id: 11, title: i18n.t('chooseLanguageScreen.dutch'), flag: '🇳🇱' },
  { id: 12, title: i18n.t('chooseLanguageScreen.swedish'), flag: '🇸🇪' },
  { id: 13, title: i18n.t('chooseLanguageScreen.norwegian'), flag: '🇳🇴' },
  { id: 14, title: i18n.t('chooseLanguageScreen.danish'), flag: '🇩🇰' },
  { id: 15, title: i18n.t('chooseLanguageScreen.finnish'), flag: '🇫🇮' },
  { id: 16, title: i18n.t('chooseLanguageScreen.polish'), flag: '🇵🇱' },
  { id: 17, title: i18n.t('chooseLanguageScreen.turkish'), flag: '🇹🇷' },
  { id: 18, title: i18n.t('chooseLanguageScreen.arabic'), flag: '🇸🇦' },
  { id: 19, title: i18n.t('chooseLanguageScreen.hindi'), flag: '🇮🇳' },
  { id: 20, title: i18n.t('chooseLanguageScreen.ukrainian'), flag: '🇺🇦' },
];

const ChooseLanguageScreen = () => {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigation>();

  const [filteredLanguages, setFilteredLanguages] = useState<
    { id: number; title: string; flag: string }[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const { selectedLanguage } = useAppSelector((state) => state.sections);

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
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
      }}
    >
      <WelcomeThemeBackground />
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
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
            fontSize: 26,
            fontWeight: '700',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          {i18n.t('chooseLanguageScreen.whichLanguage')}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SearchInput
          value={searchInput}
          onChange={(value) => setSearchInput(value)}
        />
      </View>

      {/* Language List */}
      {filteredLanguages.length === 0 ? (
        <Loading />
      ) : (
        <>
          <FlatList
            data={filteredLanguages}
            contentContainerStyle={{
              flexDirection: width < 720 ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => dispatch(setSelectedLanguage(item.title))}
                style={{
                  width: 200,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  backgroundColor:
                    selectedLanguage === item.title
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
                <Text style={{ fontSize: 28, marginRight: 15 }}>
                  {item.flag}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color:
                      selectedLanguage === item.title || theme.dark
                        ? '#fff'
                        : '#000',
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {selectedLanguage?.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <PressableButton
              onPress={() => navigation.navigate(AppPath.ChooseWords)}
              text={i18n.t('welcomeScreen.next')}
            />
          </View>

          <PressableButton
            onPress={() => navigation.navigate(AppPath.Register)}
            text={i18n.t('welcomeScreen.skip')}
            buttonStyle={{ paddingHorizontal: 16 }}
            gradientColor={theme.colors.highlightDarkColor}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChooseLanguageScreen;
