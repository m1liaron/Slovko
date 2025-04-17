import { i18n } from "@/localization/i18n";
import React, { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "uk";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => {}
})

const useLanguage = () => useContext(LanguageContext);

const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("uk");

    useEffect(() => {
        i18n.locale = language;
    }, [language])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        i18n.locale = lang;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}
export {
    LanguageProvider,
    useLanguage
}