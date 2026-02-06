import AsyncStorage from '@react-native-async-storage/async-storage';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import { i18n } from '@/localization/i18n';
import { getStorageItem } from '@/utils/storage';

export type LanguageCode = 'en' | 'uk';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

const useLanguage = () => useContext(LanguageContext);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>('uk');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await getStorageItem(AsyncStorageVariables.LANGUAGE);
      if (storedLang === 'en' || storedLang === 'uk') {
        setLanguage(storedLang);
        i18n.locale = storedLang;
      }
      setIsLoaded(true);
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    AsyncStorage.setItem(AsyncStorageVariables.LANGUAGE, lang);
    setLanguageState(lang);
    i18n.locale = lang;
  };

  if (!isLoaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export { LanguageProvider, useLanguage };
